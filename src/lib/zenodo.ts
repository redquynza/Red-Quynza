// El repositorio vive en Zenodo (comunidad «redquynza»): allí está el catálogo completo,
// con búsqueda, filtros, DOI y preservación. Esta página es la vitrina: cuenta lo que hay,
// muestra lo más reciente y los videos, y abre Zenodo ya filtrado por tipo, nodo o tema.
//
// Las mismas funciones corren al construir el sitio (HTML inicial) y en el navegador
// (para que lo que se publique en Zenodo aparezca sin volver a desplegar).

export const COMUNIDAD = 'redquynza';
export const ZENODO = `https://zenodo.org/communities/${COMUNIDAD}/records`;
const API = `https://zenodo.org/api/communities/${COMUNIDAD}/records`;

// Vocabulario controlado: cada envío lleva la etiqueta «Nodo <macrorregión>» en Zenodo.
export const NODOS = ['Caribe', 'Oriente', 'Zona Centro', 'Zona Cafetera', 'Pacífico', 'Orinoquía', 'Amazonía'];

// Tipos de Zenodo → cómo los nombramos aquí.
const TIPOS: Record<string, string> = {
  'publication-article': 'Artículos',
  'publication-section': 'Capítulos de libro',
  'publication-book': 'Libros',
  'publication-report': 'Informes',
  'publication-thesis': 'Tesis',
  'publication-workingpaper': 'Documentos de trabajo',
  'publication-conferencepaper': 'Ponencias',
  'publication-preprint': 'Preprints',
  'publication-other': 'Otros textos',
  publication: 'Textos',
  dataset: 'Bases de datos',
  video: 'Videos',
  image: 'Imágenes',
  presentation: 'Presentaciones',
  poster: 'Pósteres',
  lesson: 'Material didáctico',
  software: 'Software',
  other: 'Otros',
};
const TIPO_UNO: Record<string, string> = {
  'publication-article': 'Artículo', 'publication-section': 'Capítulo', 'publication-book': 'Libro',
  'publication-report': 'Informe', 'publication-thesis': 'Tesis', 'publication-workingpaper': 'Documento de trabajo',
  dataset: 'Base de datos', video: 'Video', image: 'Imagen',
};

export type Faceta = { label: string; n: number; href: string };
export type Ficha = { titulo: string; autores: string; anio: string; tipo: string; nodo?: string; href: string; doi?: string };
export type VideoZ = { titulo: string; autores: string; anio: string; yt: string; href: string };
export type Datos = { total: number; tipos: Faceta[]; nodos: Faceta[]; temas: Faceta[]; recientes: Ficha[]; videos: VideoZ[] };

const filtro = (f: string) => `${ZENODO}?q=&f=${encodeURIComponent(f)}&l=list&p=1&s=10&sort=newest`;
const conTema = (s: string) => filtro(`subject:${s}`);

async function pedir(qs: string, fetchImpl: typeof fetch) {
  const headers: Record<string, string> = { Accept: 'application/vnd.inveniordm.v1+json' };
  // Al construir (Node), Zenodo exige un agente propio; el navegador no deja cambiarlo.
  if (typeof window === 'undefined') headers['User-Agent'] = 'redquynza-site-build/1.0';
  for (let intento = 0; intento < 3; intento++) {
    try {
      const r = await fetchImpl(`${API}?${qs}`, { headers, signal: AbortSignal.timeout(12000) });
      if (r.ok) return await r.json();
      if (r.status < 500 && r.status !== 429) return null;
    } catch {
      /* corte de red: se reintenta */
    }
    await new Promise((res) => setTimeout(res, 1500 * (intento + 1)));
  }
  return null;
}

const autoresDe = (m: any) => {
  const n = (m.creators || []).map((c: any) => {
    const p = c.person_or_org || {};
    return p.given_name ? `${p.given_name} ${p.family_name}` : p.name || '';
  });
  if (n.length > 3) return `${n.slice(0, 3).join(', ')} y otros`;
  if (n.length > 1) return `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}`;
  return n[0] || '';
};
const nodoDe = (m: any) => (m.subjects || []).map((s: any) => s.subject).find((s: string) => s?.startsWith('Nodo '))?.slice(5);
const ytDe = (m: any) => {
  for (const r of m.related_identifiers || []) {
    const x = String(r.identifier || '').match(/(?:youtu\.be\/|v=)([\w-]{11})/);
    if (x) return x[1];
  }
  return '';
};

// Zenodo limita las consultas anónimas (responde 429 si llegan muchas juntas). Por eso:
// en el navegador solo se hacen 2 (resumen + videos); el conteo por nodo, que pide una
// consulta por macrorregión, solo se hace al construir el sitio, de a una.
export async function cargar(fetchImpl: typeof fetch = fetch, conNodos = false): Promise<Datos | null> {
  const general = await pedir('size=12&sort=newest', fetchImpl);
  if (!general) return null;
  const videos = await pedir('size=12&sort=newest&q=' + encodeURIComponent('metadata.resource_type.id:video'), fetchImpl);
  const porNodo: any[] = [];
  if (conNodos) {
    for (const n of NODOS) porNodo.push(await pedir('size=1&q=' + encodeURIComponent(`metadata.subjects.subject:"Nodo ${n}"`), fetchImpl));
  }
  const todo = { hits: { hits: (general.hits?.hits || []).filter((h: any) => h.metadata?.resource_type?.id !== 'video').slice(0, 6) } };

  const tipos: Faceta[] = [];
  for (const b of general.aggregations?.resource_type?.buckets || []) {
    const inner = b.inner?.buckets || [];
    if (inner.length) {
      for (const i of inner) tipos.push({ label: TIPOS[i.key] || i.label, n: i.doc_count, href: filtro(`resource_type:${b.key}+inner:${i.key}`) });
    } else {
      tipos.push({ label: TIPOS[b.key] || b.label, n: b.doc_count, href: filtro(`resource_type:${b.key}`) });
    }
  }
  tipos.sort((a, b) => b.n - a.n);

  const nodos: Faceta[] = conNodos ? NODOS.map((n, i) => ({ label: n, n: porNodo[i]?.hits?.total ?? 0, href: conTema(`Nodo ${n}`) })) : [];

  const temas: Faceta[] = (general.aggregations?.subject?.buckets || [])
    .filter((b: any) => !b.key.startsWith('Nodo ') && b.key !== 'Colombia')
    .slice(0, 12)
    .map((b: any) => ({ label: b.key, n: b.doc_count, href: conTema(b.key) }));

  const recientes: Ficha[] = (todo.hits?.hits || []).map((h: any) => ({
    titulo: h.metadata.title,
    autores: autoresDe(h.metadata),
    anio: String(h.metadata.publication_date || '').slice(0, 4),
    tipo: TIPO_UNO[h.metadata.resource_type?.id] || TIPOS[h.metadata.resource_type?.id] || 'Documento',
    nodo: nodoDe(h.metadata),
    href: h.links.self_html,
    doi: h.pids?.doi?.identifier,
  }));

  const vids: VideoZ[] = (videos?.hits?.hits || [])
    .map((h: any) => ({ titulo: h.metadata.title, autores: autoresDe(h.metadata), anio: String(h.metadata.publication_date || '').slice(0, 4), yt: ytDe(h.metadata), href: h.links.self_html }))
    .filter((v: VideoZ) => v.yt);

  return { total: general.hits?.total ?? 0, tipos, nodos, temas, recientes, videos: vids };
}

// ---------- HTML (lo usan la página y el navegador) ----------
const esc = (s: string) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const ext = 'target="_blank" rel="noopener"';

export const htmlTipos = (d: Datos) =>
  d.tipos.map((t) => `<a class="faceta" href="${esc(t.href)}" ${ext}><span class="fn">${t.n}</span><span class="fl">${esc(t.label)}</span></a>`).join('');

// Si ningún nodo tiene registros etiquetados todavía, no se muestra la grilla (quedaría vacía).
export const htmlNodos = (d: Datos) =>
  !d.nodos.some((t) => t.n > 0) ? '' : d.nodos
    .map((t) =>
      t.n > 0
        ? `<a class="nodo-f" href="${esc(t.href)}" ${ext}><span class="fl">${esc(t.label)}</span><span class="fn">${t.n}</span></a>`
        : `<span class="nodo-f vacio"><span class="fl">${esc(t.label)}</span><span class="fn">Aún sin envíos</span></span>`,
    )
    .join('');

export const htmlTemas = (d: Datos) => d.temas.map((t) => `<a class="tema" href="${esc(t.href)}" ${ext}>${esc(t.label)}</a>`).join('');

export const htmlRecientes = (d: Datos) =>
  d.recientes
    .map(
      (r) => `<a class="ficha" href="${esc(r.href)}" ${ext}>
  <span class="ft"><span>${esc(r.tipo)}</span><span>${esc(r.anio)}</span></span>
  <span class="fh">${esc(r.titulo)}</span>
  <span class="fa">${esc(r.autores)}</span>
  ${r.nodo ? `<span class="fnod">Nodo ${esc(r.nodo)}</span>` : ''}
</a>`,
    )
    .join('');

export const htmlVideos = (d: Datos) =>
  d.videos
    .map(
      (v) => `<div class="video-item">
  <a class="video" data-yt="${esc(v.yt)}" href="https://youtu.be/${esc(v.yt)}" ${ext} aria-label="Ver: ${esc(v.titulo)}">
    <span class="thumb"><img src="https://i.ytimg.com/vi/${esc(v.yt)}/hqdefault.jpg" alt="" loading="lazy" /><span class="play" aria-hidden="true"></span></span>
  </a>
  <h3>${esc(v.titulo)}</h3>
  <p class="vmeta">${esc(v.autores)} · ${esc(v.anio)} · <a href="${esc(v.href)}" ${ext}>Ficha en Zenodo ↗</a></p>
</div>`,
    )
    .join('');
