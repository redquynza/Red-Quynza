// Simulador mínimo de la API de Wompi para probar /aportar sin llaves reales.
// Uso: node scripts/wompi-simulado.mjs  (puerto 8799) y en .dev.vars:
//   WOMPI_API_BASE=http://localhost:8799/v1
// Reglas (como el sandbox de Wompi): tarjeta 4242… aprueba, 4111… rechaza;
// Nequi 3991111111 aprueba, 3992222222 rechaza. Los tokens de Nequi se aprueban
// en la segunda consulta (como si la persona aceptara en la app).
import http from 'node:http';
import { generateKeyPairSync, privateDecrypt, createDecipheriv, constants } from 'node:crypto';

const tokens = new Map(), fuentes = new Map(), txs = new Map();
// llave de tokenización (JWE RSA-OAEP-256 + A256GCM), como /tokens/keys/tokenization
const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const pem = publicKey.export({ type: 'spki', format: 'pem' }).toString().replace(/\n/g, ' ').trim();
function descifrar(jwe) {
  const [cab, ek, iv, ct, tag] = jwe.split('.').map((p, i) => i === 0 ? p : Buffer.from(p, 'base64url'));
  const cek = privateDecrypt({ key: privateKey, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, ek);
  const d = createDecipheriv('aes-256-gcm', cek, iv).setAAD(Buffer.from(cab)).setAuthTag(tag);
  return JSON.parse(Buffer.concat([d.update(ct), d.final()]).toString());
}
let n = 1;
const id = (p) => `${p}_test_${n++}`;

const rutas = [
  ['GET', /^\/v1\/merchants\/(info|[\w-]+)$/, () => ({ data: {
    presigned_acceptance: { acceptance_token: 'acc_test', permalink: 'https://wompi.com/assets/downloadble/reglamento-Usuarios-Colombia.pdf' },
    presigned_personal_data_auth: { acceptance_token: 'pda_test', permalink: 'https://wompi.com/assets/downloadble/autorizacion-administracion-datos-personales.pdf' },
  } })],
  ['GET', /^\/v1\/tokens\/keys\/tokenization$/, () => ({ data: { publicKey: pem }, status: 'OK' })],
  ['POST', /^\/v1\/tokens\/cards$/, (b) => {
    if (b.payload) b = descifrar(b.payload);
    // 4000… aprueba solo el primer cobro (para probar reintentos y suspensión)
    const t = { id: id('tok'), brand: b.number.startsWith('5') ? 'MASTERCARD' : 'VISA', last_four: b.number.slice(-4),
      ok: b.number.startsWith('4242') || b.number.startsWith('4000'), soloPrimero: b.number.startsWith('4000') };
    tokens.set(t.id, t); return { status: 'CREATED', data: t };
  }],
  ['POST', /^\/v1\/tokens\/nequi$/, (b) => {
    const t = { id: id('nequi'), status: 'PENDING', polls: 0, ok: b.phone_number === '3991111111' };
    tokens.set(t.id, t); return { data: { id: t.id, status: t.status } };
  }],
  ['GET', /^\/v1\/tokens\/nequi\/(.+)$/, (_, m) => {
    const t = tokens.get(m[1]); if (!t) return [404, { error: 'no' }];
    if (++t.polls >= 2) t.status = t.ok ? 'APPROVED' : 'DECLINED';
    return { data: { id: t.id, status: t.status } };
  }],
  ['POST', /^\/v1\/payment_sources$/, (b, _, h) => {
    if (!String(h.authorization).includes('prv_')) return [401, { error: { type: 'INVALID_ACCESS_TOKEN' } }];
    const t = tokens.get(b.token); if (!t) return [422, { error: { type: 'INPUT_VALIDATION_ERROR' } }];
    const f = { id: 3000 + n++, type: b.type, status: 'AVAILABLE', ok: t.ok, soloPrimero: t.soloPrimero, email: b.customer_email };
    fuentes.set(f.id, f); return { data: { id: f.id, type: f.type, status: f.status } };
  }],
  ['GET', /^\/v1\/payment_sources\/(\d+)$/, (_, m) => {
    const f = fuentes.get(Number(m[1])); return f ? { data: { id: f.id, status: f.status } } : [404, {}];
  }],
  ['POST', /^\/v1\/transactions$/, (b, _, h) => {
    if (!String(h.authorization).includes('prv_')) return [401, { error: { type: 'INVALID_ACCESS_TOKEN' } }];
    const f = fuentes.get(b.payment_source_id); if (!f) return [422, { error: { type: 'INPUT_VALIDATION_ERROR' } }];
    if (!/^[0-9a-f]{64}$/.test(b.signature || '')) return [422, { error: { type: 'INPUT_VALIDATION_ERROR', messages: { signature: ['firma'] } } }];
    if (f.soloPrimero && f.usada) f.ok = false;
    f.usada = true;
    // Nequi queda PENDING (asíncrono, como en Wompi) y se resuelve al consultarla
    const tx = { id: `${n++}-test`, reference: b.reference, amount_in_cents: b.amount_in_cents,
      status: f.type === 'NEQUI' ? 'PENDING' : (f.ok ? 'APPROVED' : 'DECLINED'), final: f.ok ? 'APPROVED' : 'DECLINED' };
    txs.set(tx.id, tx); console.log('transacción', tx.reference, tx.amount_in_cents / 100, tx.status);
    return { data: tx };
  }],
  ['GET', /^\/v1\/transactions\/(.+)$/, (_, m) => {
    const tx = txs.get(m[1]); if (!tx) return [404, {}];
    tx.status = tx.final; return { data: tx };
  }],
];

http.createServer(async (req, res) => {
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS' };
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  let raw = ''; for await (const c of req) raw += c;
  const body = raw ? JSON.parse(raw) : {};
  const url = req.url.split('?')[0];
  for (const [met, re, fn] of rutas) {
    const m = url.match(re);
    if (m && met === req.method) {
      let out = fn(body, m, req.headers), code = 200;
      if (Array.isArray(out)) [code, out] = out;
      res.writeHead(code, { 'content-type': 'application/json', ...cors });
      return res.end(JSON.stringify(out));
    }
  }
  res.writeHead(404, cors); res.end('{}');
}).listen(8799, () => console.log('Wompi simulado en http://localhost:8799/v1'));
