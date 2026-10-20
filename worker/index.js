// Worker de redquynza.org: sirve el sitio estático (dist/) y la API de aportes
// mensuales con Wompi. El cobro mensual corre en el cron diario (scheduled).
//
// Variables (wrangler.jsonc → vars): WOMPI_PUBLIC_KEY, SITE_URL, MAIL_FROM
// Secretos (wrangler secret put / .dev.vars): WOMPI_PRIVATE_KEY, WOMPI_EVENTS_SECRET,
//   WOMPI_INTEGRITY_SECRET, ADMIN_TOKEN, RESEND_API_KEY (opcional: sin ella no se envían correos)

import { perfiles, montoValido, metodos, pesos } from '../src/data/aportes.js';

const MAX_FALLOS = 3;      // cobros fallidos seguidos antes de suspender
const DIAS_REINTENTO = 3;  // días entre reintentos de un cobro rechazado
const CRON_COBROS = '0 14 * * *'; // debe coincidir con wrangler.jsonc

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      return await api(request, env, ctx, url);
    } catch (e) {
      console.error('api', url.pathname, e && e.stack || e);
      return json({ error: 'Error interno. Intenta de nuevo en unos minutos.' }, 500);
    }
  },

  // 14:00 UTC: cobros del día · cada hora: conciliar cobros pendientes (respaldo del webhook)
  async scheduled(event, env, ctx) {
    ctx.waitUntil(event.cron === CRON_COBROS ? cicloDiario(env) : conciliar(env));
  },
};

// ---------------------------------------------------------------- API

async function api(request, env, ctx, url) {
  const p = url.pathname.replace(/\/$/, '');
  const m = request.method;

  if (p === '/api/aportes/config' && m === 'GET') return config(env);
  if (p === '/api/aportes' && m === 'POST') return crearAporte(request, env, ctx);
  if (p === '/api/aportes/estado' && m === 'GET') return estadoAporte(url, env, ctx);
  if (p === '/api/aporte' && m === 'GET') return verAporte(url, env);
  if (p === '/api/aporte/cancelar' && m === 'POST') return cancelarAporte(request, env, ctx);
  if (p === '/api/wompi/eventos' && m === 'POST') return eventoWompi(request, env, ctx);
  if (p.startsWith('/api/admin/') && m === 'GET') return admin(p, request, env);
  return json({ error: 'No encontrado' }, 404);
}

// Llave pública, ambiente y los dos contratos de Wompi que la persona debe aceptar.
async function config(env) {
  const info = await wompi(env, 'GET', '/merchants/info', null, { merchant: true })
    .catch(() => wompi(env, 'GET', `/merchants/${env.WOMPI_PUBLIC_KEY}`));
  const d = info.data || {};
  // llave pública para cifrar la tarjeta (Wompi no permite pedirla desde el navegador)
  const llave = await wompi(env, 'GET', '/tokens/keys/tokenization').catch(() => null);
  return json({
    publicKey: env.WOMPI_PUBLIC_KEY,
    llaveTarjetas: llave?.data?.publicKey || null,
    apiBase: apiBase(env),
    sandbox: esSandbox(env),
    terminos: {
      token: d.presigned_acceptance?.acceptance_token,
      enlace: d.presigned_acceptance?.permalink,
    },
    datos: {
      token: d.presigned_personal_data_auth?.acceptance_token,
      enlace: d.presigned_personal_data_auth?.permalink,
    },
    perfiles,
  }, 200, { 'cache-control': 'no-store' });
}

async function crearAporte(request, env, ctx) {
  const b = await request.json().catch(() => null);
  if (!b) return json({ error: 'Solicitud inválida.' }, 400);

  const nombre = limpio(b.nombre, 120);
  const email = limpio(b.email, 160).toLowerCase();
  const telefono = String(b.telefono || '').replace(/\D/g, '').slice(-10);
  const metodo = b.metodo;
  const errores = [];
  if (!montoValido(b.perfil, b.monto)) errores.push('Elige un perfil y un monto.');
  if (nombre.length < 3) errores.push('Escribe tu nombre.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errores.push('Revisa tu correo.');
  if (!metodos[metodo]) errores.push('Elige un medio de pago.');
  if (metodo === 'NEQUI' && telefono.length !== 10) errores.push('Revisa tu número de Nequi.');
  if (!b.token || !b.acceptance_token || !b.accept_personal_auth) errores.push('Faltan datos del medio de pago.');
  if (b.acepta !== true) errores.push('Debes aceptar las condiciones del aporte.');
  if (errores.length) return json({ error: errores.join(' ') }, 400);

  // Fuente de pago en Wompi: la tarjeta o el Nequi quedan guardados para cobrar cada mes
  const fuente = await wompi(env, 'POST', '/payment_sources', {
    type: metodo,
    token: String(b.token),
    customer_email: email,
    acceptance_token: String(b.acceptance_token),
    accept_personal_auth: String(b.accept_personal_auth),
  }, { privada: true }).catch((e) => ({ error: e }));
  if (fuente.error || !fuente.data?.id) {
    console.error('payment_source', fuente.error?.message || JSON.stringify(fuente));
    return json({ error: 'Wompi no aceptó este medio de pago. Revisa los datos o prueba con otro.' }, 402);
  }

  const ahora = new Date().toISOString();
  const a = {
    id: crypto.randomUUID(),
    clave: clave(),
    nombre, email,
    telefono: telefono || null,
    perfil: b.perfil,
    monto: Number(b.monto),
    metodo,
    detalle_metodo: detalleMetodo(metodo, b, telefono),
    payment_source_id: fuente.data.id,
    estado: 'verificando',
    creado: ahora,
  };
  await env.DB.prepare(
    `INSERT INTO aportantes (id, clave, nombre, email, telefono, perfil, monto, metodo, detalle_metodo,
       payment_source_id, estado, creado, actualizado) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(a.id, a.clave, a.nombre, a.email, a.telefono, a.perfil, a.monto, a.metodo, a.detalle_metodo,
    a.payment_source_id, a.estado, ahora, ahora).run();

  let estado = a.estado;
  if (fuente.data.status === 'AVAILABLE') estado = await primerCobro(env, a);
  else if (['DECLINED', 'ERROR'].includes(fuente.data.status)) estado = await marcar(env, a.id, 'rechazado');

  return json({ clave: a.clave, estado });
}

// La página consulta esto mientras la persona completa 3D Secure o el primer cobro.
async function estadoAporte(url, env, ctx) {
  const a = await porClave(env, url.searchParams.get('k'));
  if (!a) return json({ error: 'No encontrado' }, 404);

  let tresDS = null;
  if (a.estado === 'verificando') {
    const f = await wompi(env, 'GET', `/payment_sources/${a.payment_source_id}`, null, { privada: true })
      .catch(() => wompi(env, 'GET', `/payment_sources/${a.payment_source_id}`));
    const s = f.data?.status;
    if (s === 'AVAILABLE') a.estado = await primerCobro(env, a);
    else if (s === 'DECLINED' || s === 'ERROR') a.estado = await marcar(env, a.id, 'rechazado');
    else {
      const t = f.data?.extra?.three_ds_auth;
      if (t?.three_ds_method_data) tresDS = { paso: t.current_step, html: t.three_ds_method_data };
    }
  } else if (a.estado === 'cobrando') {
    const c = await env.DB.prepare(
      `SELECT * FROM cobros WHERE aportante_id = ? ORDER BY creado DESC LIMIT 1`).bind(a.id).first();
    if (c && c.estado === 'PENDING' && c.wompi_id) {
      const t = await wompi(env, 'GET', `/transactions/${c.wompi_id}`).catch(() => null);
      const s = t?.data?.status;
      if (s && s !== 'PENDING') await aplicarResultado(env, c, s, ctx);
      a.estado = (await porClave(env, a.clave)).estado;
    }
  }
  return json({ estado: a.estado, tresDS, monto: a.monto, perfil: a.perfil });
}

async function verAporte(url, env) {
  const a = await porClave(env, url.searchParams.get('k'));
  if (!a) return json({ error: 'No encontramos este aporte. Revisa el enlace de tu correo.' }, 404);
  const { results } = await env.DB.prepare(
    `SELECT periodo, monto, estado, actualizado FROM cobros WHERE aportante_id = ?
     AND estado IN ('APPROVED','DECLINED','ERROR','VOIDED') ORDER BY creado DESC LIMIT 24`
  ).bind(a.id).all();
  return json({
    nombre: a.nombre.split(' ')[0],
    perfil: perfiles.find((p) => p.id === a.perfil)?.nombre || a.perfil,
    monto: a.monto,
    metodo: a.detalle_metodo || metodos[a.metodo],
    estado: a.estado,
    proximo_cobro: ['activo'].includes(a.estado) ? a.proximo_cobro : null,
    desde: a.creado.slice(0, 10),
    cobros: results,
  });
}

async function cancelarAporte(request, env, ctx) {
  const b = await request.json().catch(() => ({}));
  const a = await porClave(env, b.k);
  if (!a) return json({ error: 'No encontrado' }, 404);
  if (a.estado !== 'cancelado') {
    const ahora = new Date().toISOString();
    await env.DB.prepare(`UPDATE aportantes SET estado = 'cancelado', cancelado = ?, actualizado = ? WHERE id = ?`)
      .bind(ahora, ahora, a.id).run();
    ctx.waitUntil(correo(env, a.email, 'Cancelaste tu aporte mensual a la RED Quynza', [
      `Hola, ${a.nombre.split(' ')[0]}.`,
      `Tu aporte mensual de ${pesos(a.monto)} quedó cancelado. No se te hará ningún otro cobro.`,
      'Gracias por el tiempo que acompañaste a la RED. Si algún día quieres volver, puedes hacerlo en redquynza.org/aportar.',
    ]));
  }
  return json({ estado: 'cancelado' });
}

// Notificaciones de Wompi (URL de eventos configurada en el panel de comercios).
async function eventoWompi(request, env, ctx) {
  const ev = await request.json().catch(() => null);
  if (!ev || !(await firmaEventoValida(ev, env.WOMPI_EVENTS_SECRET))) return json({ error: 'firma' }, 400);
  if (ev.event === 'transaction.updated') {
    const t = ev.data?.transaction || {};
    const c = await env.DB.prepare(`SELECT * FROM cobros WHERE referencia = ?`).bind(t.reference).first();
    if (c) {
      if (!c.wompi_id && t.id) {
        await env.DB.prepare(`UPDATE cobros SET wompi_id = ? WHERE referencia = ?`).bind(t.id, c.referencia).run();
      }
      if (t.status && t.status !== 'PENDING') await aplicarResultado(env, c, t.status, ctx);
    }
  }
  return json({ ok: true });
}

// Exportes para contabilidad: Authorization: Bearer <ADMIN_TOKEN>
async function admin(p, request, env) {
  const auth = request.headers.get('authorization') || '';
  if (!env.ADMIN_TOKEN || auth !== `Bearer ${env.ADMIN_TOKEN}`) return json({ error: 'No autorizado' }, 401);
  if (p === '/api/admin/aportantes.csv') {
    const { results } = await env.DB.prepare(
      `SELECT creado, nombre, email, telefono, perfil, monto, metodo, detalle_metodo, estado, proximo_cobro, fallos, cancelado
       FROM aportantes ORDER BY creado`).all();
    return csv(results, 'aportantes.csv');
  }
  if (p === '/api/admin/cobros.csv') {
    const { results } = await env.DB.prepare(
      `SELECT c.creado, c.periodo, a.nombre, a.email, a.perfil, c.monto, a.metodo, c.estado, c.referencia, c.wompi_id
       FROM cobros c JOIN aportantes a ON a.id = c.aportante_id ORDER BY c.creado`).all();
    return csv(results, 'cobros.csv');
  }
  return json({ error: 'No encontrado' }, 404);
}

// ---------------------------------------------------------------- cobros

async function primerCobro(env, a) {
  const hoy = hoyCol();
  const dia = Math.min(Number(hoy.slice(8, 10)), 28);
  await env.DB.prepare(`UPDATE aportantes SET estado = 'cobrando', dia_cobro = ?, proximo_cobro = ?, actualizado = ? WHERE id = ?`)
    .bind(dia, hoy, new Date().toISOString(), a.id).run();
  await cobrar(env, { ...a, dia_cobro: dia }, hoy);
  return 'cobrando';
}

// Crea la transacción en Wompi con la fuente de pago guardada.
async function cobrar(env, a, periodo) {
  const previos = await env.DB.prepare(`SELECT COUNT(*) AS n FROM cobros WHERE aportante_id = ? AND periodo = ?`)
    .bind(a.id, periodo).first();
  const intento = (previos?.n || 0) + 1;
  const referencia = `RQ-${periodo.replace(/-/g, '')}-${a.id.slice(0, 8)}-${intento}`;
  const centavos = a.monto * 100;
  const ahora = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO cobros (referencia, aportante_id, monto, periodo, intento, estado, creado, actualizado)
     VALUES (?,?,?,?,?, 'PENDING', ?, ?)`
  ).bind(referencia, a.id, a.monto, periodo, intento, ahora, ahora).run();

  const cuerpo = {
    amount_in_cents: centavos,
    currency: 'COP',
    signature: await sha256(`${referencia}${centavos}COP${env.WOMPI_INTEGRITY_SECRET}`),
    customer_email: a.email,
    reference: referencia,
    payment_source_id: Number(a.payment_source_id),
  };
  if (a.metodo === 'CARD') {
    cuerpo.payment_method = { installments: 1 };
    cuerpo.recurrent = true;
  }
  try {
    const t = await wompi(env, 'POST', '/transactions', cuerpo, { privada: true });
    const s = t.data?.status || 'PENDING';
    await env.DB.prepare(`UPDATE cobros SET wompi_id = ?, actualizado = ? WHERE referencia = ?`)
      .bind(t.data?.id || null, new Date().toISOString(), referencia).run();
    if (s !== 'PENDING') {
      const c = await env.DB.prepare(`SELECT * FROM cobros WHERE referencia = ?`).bind(referencia).first();
      await aplicarResultado(env, c, s);
    }
  } catch (e) {
    // Falla de comunicación: no cuenta como rechazo; el ciclo de mañana lo vuelve a intentar
    console.error('cobro', referencia, e.message);
    await env.DB.prepare(`UPDATE cobros SET estado = 'ERROR_ENVIO', actualizado = ? WHERE referencia = ?`)
      .bind(new Date().toISOString(), referencia).run();
  }
}

// Aplica el resultado final de un cobro (una sola vez por cobro).
async function aplicarResultado(env, c, status, ctx) {
  const ahora = new Date().toISOString();
  const r = await env.DB.prepare(`UPDATE cobros SET estado = ?, actualizado = ? WHERE referencia = ? AND estado = 'PENDING'`)
    .bind(status, ahora, c.referencia).run();
  if (!r.meta?.changes) return;
  const a = await env.DB.prepare(`SELECT * FROM aportantes WHERE id = ?`).bind(c.aportante_id).first();
  if (!a || a.estado === 'cancelado') return;
  const enviar = (asunto, lineas) => {
    const p = correo(env, a.email, asunto, lineas);
    return ctx ? ctx.waitUntil(p) : p;
  };
  const enlace = `${env.SITE_URL}/mi-aporte/?k=${a.clave}`;

  if (status === 'APPROVED') {
    const proximo = sumarMes(c.periodo, a.dia_cobro);
    await env.DB.prepare(`UPDATE aportantes SET estado = 'activo', fallos = 0, proximo_cobro = ?, actualizado = ? WHERE id = ?`)
      .bind(proximo, ahora, a.id).run();
    if (a.estado === 'cobrando') {
      await enviar('Gracias por tu aporte a la RED Quynza', [
        `Hola, ${a.nombre.split(' ')[0]}.`,
        `Recibimos tu primer aporte de ${pesos(a.monto)}. Desde ahora se cobrará automáticamente cada mes con ${a.detalle_metodo || metodos[a.metodo]}. El próximo cobro será el ${fechaLarga(proximo)}.`,
        'Es un aporte voluntario, no reembolsable y sin contraprestación, que sostiene la investigación de la RED y su búsqueda permanente de la paz en Colombia.',
        `Puedes ver tus cobros o cancelar cuando quieras desde este enlace (guárdalo): ${enlace}`,
      ]);
    }
    return;
  }

  // DECLINED | ERROR | VOIDED
  if (a.estado === 'cobrando') {
    await env.DB.prepare(`UPDATE aportantes SET estado = 'rechazado', actualizado = ? WHERE id = ?`).bind(ahora, a.id).run();
    return;
  }
  const fallos = a.fallos + 1;
  if (fallos >= MAX_FALLOS) {
    await env.DB.prepare(`UPDATE aportantes SET estado = 'suspendido', fallos = ?, actualizado = ? WHERE id = ?`)
      .bind(fallos, ahora, a.id).run();
    await enviar('No pudimos cobrar tu aporte a la RED Quynza', [
      `Hola, ${a.nombre.split(' ')[0]}.`,
      `Intentamos cobrar tu aporte de ${pesos(a.monto)} tres veces y el medio de pago no lo permitió, así que pausamos el cobro automático. No se te cobrará nada más.`,
      'Si quieres seguir aportando, puedes inscribirte de nuevo con otro medio de pago en redquynza.org/aportar. Gracias por acompañarnos.',
    ]);
  } else {
    await env.DB.prepare(`UPDATE aportantes SET fallos = ?, proximo_cobro = ?, actualizado = ? WHERE id = ?`)
      .bind(fallos, sumarDias(hoyCol(), DIAS_REINTENTO), ahora, a.id).run();
  }
}

// Consulta en Wompi los cobros que siguen pendientes (por si una notificación no llegó).
async function conciliar(env) {
  const hace10min = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { results: pendientes } = await env.DB.prepare(
    `SELECT * FROM cobros WHERE estado = 'PENDING' AND wompi_id IS NOT NULL AND creado < ?`).bind(hace10min).all();
  for (const c of pendientes) {
    const t = await wompi(env, 'GET', `/transactions/${c.wompi_id}`).catch(() => null);
    const s = t?.data?.status;
    if (s && s !== 'PENDING') await aplicarResultado(env, c, s);
  }
  return pendientes;
}

// Cron diario: concilia cobros pendientes y cobra a quienes les toca hoy.
async function cicloDiario(env) {
  const pendientes = await conciliar(env);
  const hoy = hoyCol();
  const { results: toca } = await env.DB.prepare(
    `SELECT * FROM aportantes a WHERE a.estado = 'activo' AND a.proximo_cobro <= ?
     AND NOT EXISTS (SELECT 1 FROM cobros c WHERE c.aportante_id = a.id AND c.estado = 'PENDING')`
  ).bind(hoy).all();
  for (const a of toca) {
    // el periodo es la fecha programada del ciclo (los reintentos conservan el ciclo original)
    const ultimo = await env.DB.prepare(
      `SELECT periodo FROM cobros WHERE aportante_id = ? AND estado != 'APPROVED' ORDER BY creado DESC LIMIT 1`).bind(a.id).first();
    const periodo = a.fallos > 0 && ultimo ? ultimo.periodo : a.proximo_cobro;
    await cobrar(env, a, periodo);
  }
  console.log(`ciclo ${hoy}: ${pendientes.length} conciliados, ${toca.length} cobros`);
}

// ---------------------------------------------------------------- Wompi

const esSandbox = (env) => String(env.WOMPI_PUBLIC_KEY || '').startsWith('pub_test_');
// WOMPI_API_BASE solo se define en .dev.vars para probar contra el simulador local
const apiBase = (env) => env.WOMPI_API_BASE || (esSandbox(env) ? 'https://sandbox.wompi.co/v1' : 'https://production.wompi.co/v1');

async function wompi(env, method, path, body, { privada = false, merchant = false } = {}) {
  const headers = { 'content-type': 'application/json' };
  if (privada) headers.authorization = `Bearer ${env.WOMPI_PRIVATE_KEY}`;
  else if (merchant) headers['x-merchant-public-key'] = env.WOMPI_PUBLIC_KEY;
  else headers.authorization = `Bearer ${env.WOMPI_PUBLIC_KEY}`;
  const r = await fetch(apiBase(env) + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Wompi ${method} ${path} → ${r.status} ${JSON.stringify(data.error || data).slice(0, 400)}`);
  return data;
}

async function firmaEventoValida(ev, secreto) {
  if (!secreto || !ev.signature?.properties || !ev.signature?.checksum) return false;
  const valores = ev.signature.properties.map((ruta) =>
    ruta.split('.').reduce((o, k) => (o == null ? o : o[k]), ev.data));
  const base = valores.join('') + String(ev.timestamp) + secreto;
  return (await sha256(base)).toUpperCase() === String(ev.signature.checksum).toUpperCase();
}

// ---------------------------------------------------------------- correo (Resend)

async function correo(env, para, asunto, lineas) {
  if (!env.RESEND_API_KEY || !env.MAIL_FROM) return;
  const html = `<div style="font-family:Georgia,serif;font-size:16px;line-height:1.55;color:#072E35;max-width:560px">`
    + lineas.map((l) => `<p>${escapar(l).replace(/(https:\/\/\S+)/g, '<a href="$1">$1</a>')}</p>`).join('')
    + `<p style="color:#46636A;font-size:14px">RED Quynza · Paz y cuidado de la vida · redquynza.org</p></div>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [para], subject: asunto, html, text: lineas.join('\n\n') }),
  }).catch((e) => ({ ok: false, statusText: e.message }));
  if (!r.ok) console.error('correo', asunto, r.status, r.statusText);
}

// ---------------------------------------------------------------- utilidades

const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...extra } });

function csv(rows, nombre) {
  const cols = rows.length ? Object.keys(rows[0]) : [];
  const esc = (v) => (v == null ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const body = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
  return new Response('﻿' + body, {
    headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="${nombre}"` },
  });
}

const porClave = (env, k) => (k && /^[A-Za-z0-9_-]{20,}$/.test(k)
  ? env.DB.prepare(`SELECT * FROM aportantes WHERE clave = ?`).bind(k).first() : null);

async function marcar(env, id, estado) {
  await env.DB.prepare(`UPDATE aportantes SET estado = ?, actualizado = ? WHERE id = ?`)
    .bind(estado, new Date().toISOString(), id).run();
  return estado;
}

function detalleMetodo(metodo, b, telefono) {
  if (metodo === 'NEQUI') return `Nequi ···· ${telefono.slice(-4)}`;
  const marca = limpio(b.marca, 20).toUpperCase();
  const ult = String(b.ultimos || '').replace(/\D/g, '').slice(-4);
  return ult ? `${marca || 'Tarjeta'} ···· ${ult}` : 'Tarjeta';
}

const limpio = (v, max) => String(v ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, max);
const escapar = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function clave() {
  const b = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256(s) {
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(h)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

// Fecha de hoy en Colombia (UTC−5, sin horario de verano)
const hoyCol = () => new Date(Date.now() - 5 * 3600 * 1000).toISOString().slice(0, 10);

function sumarMes(fecha, dia) {
  const [y, m] = fecha.split('-').map(Number);
  const d = new Date(Date.UTC(y, m, Math.min(dia || 1, 28))); // m ya es el mes siguiente (base 0)
  return d.toISOString().slice(0, 10);
}

function sumarDias(fecha, n) {
  const d = new Date(fecha + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
function fechaLarga(f) {
  const [y, m, d] = f.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}
