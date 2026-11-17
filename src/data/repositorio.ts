// Repositorio de la RED: lo que los nodos envían por el formulario y se sube a Zenodo
// (comunidad redquynza). `zenodo` es el id del registro: la página enlaza a Zenodo
// solo cuando el registro ya está publicado (se comprueba al construir el sitio);
// mientras tanto usa `original`, si existe.

export type Autor = { nombre: string; id?: string }; // id = ficha en /la-red#<id>

export type Texto = {
  zenodo: number;
  tipo: 'articulo' | 'capitulo' | 'informe';
  titulo: string;
  autores: Autor[];
  anio: string;
  fuente: string; // dónde se publicó originalmente
  resumen: string;
  territorio: string;
  nodo: string;
  licencia: string;
  original?: { href: string; label: string };
};

export type Video = {
  zenodo: number;
  yt: string;
  titulo: string;
  canal: string;
  anio: string;
  duracion: string;
  resumen: string;
  territorio: string;
  conversan?: Autor[];
};

export const tipos = {
  articulo: 'Artículos',
  capitulo: 'Capítulos de libro',
  informe: 'Informes y boletines',
} as const;

export const textos: Texto[] = [
  {
    zenodo: 24318644,
    tipo: 'articulo',
    titulo: 'Homicidio selectivo: modalidad de violencia urbana en Buenaventura 2000-2015',
    autores: [{ nombre: 'Gloria Inés Montoya Duque' }, { nombre: 'Waldor Federico Arias Botero' }, { nombre: 'Dennis Arley Huffington Arroyo' }],
    anio: '2024',
    fuente: 'Revista Territorios, n.º 51, Universidad del Rosario',
    resumen: 'Cómo el homicidio selectivo se volvió una forma de ejercer poder en Buenaventura: contra líderes sociales y organizaciones, en retaliaciones entre grupos armados y en el crimen ligado a los cultivos ilícitos.',
    territorio: 'Buenaventura',
    nodo: 'Pacífico',
    licencia: 'CC BY-NC 4.0',
    original: { href: 'https://doi.org/10.12804/revistas.urosario.edu.co/territorios/a.12744', label: 'Ver en la revista' },
  },
  {
    zenodo: 24318651,
    tipo: 'articulo',
    titulo: 'Factores asociados con la desafiliación social en reincorporados de las FARC en el Valle del Cauca - 2019',
    autores: [{ nombre: 'María Gertrudis Roa-Martínez' }, { nombre: 'María Eugenia Ibarra-Melo' }],
    anio: '2021',
    fuente: 'Revista Sociedad y Economía, n.º 45, Universidad del Valle',
    resumen: 'Un índice de desafiliación social muestra quiénes, entre los exguerrilleros del Valle, corren más riesgo de quedar por fuera: desempleados, con personas a cargo, con discapacidad, afrocolombianos e indígenas sin arraigo en las ciudades.',
    territorio: 'Valle del Cauca',
    nodo: 'Pacífico',
    licencia: 'CC BY-NC 4.0',
    original: { href: 'https://doi.org/10.25100/sye.v0i45.11328', label: 'Ver en la revista' },
  },
  {
    zenodo: 24318999,
    tipo: 'capitulo',
    titulo: 'Aproximaciones al análisis de la violencia urbana en América Latina: por una comprensión compleja',
    autores: [{ nombre: 'Blas Zubiría Mutis', id: 'blas-zubiria' }],
    anio: '2021',
    fuente: 'En Movimientos sociales, movimientos armados y procesos de paz en Centroamérica y el Caribe (Universidad Externado de Colombia y CLACSO)',
    resumen: 'Una revisión de las maneras de explicar la violencia urbana, que propone entenderla como un fenómeno complejo: individual, social, económico, político y cultural a la vez.',
    territorio: 'América Latina',
    nodo: 'Caribe',
    licencia: 'Derechos reservados',
  },
  {
    zenodo: 24319010,
    tipo: 'capitulo',
    titulo: 'Activismo de mujeres por la paz en tiempos de seguridad democrática',
    autores: [{ nombre: 'María Eugenia Ibarra Melo' }],
    anio: '2018',
    fuente: 'En Mujeres en movimiento. Género, experiencias organizativas y repertorios de acción en Colombia (Universidad del Valle)',
    resumen: 'Las mujeres que se movilizaron por la paz durante la seguridad democrática: sus liderazgos, sus repertorios de acción y sus discursos.',
    territorio: 'Colombia',
    nodo: 'Pacífico',
    licencia: 'Derechos reservados',
  },
  {
    zenodo: 24319024,
    tipo: 'capitulo',
    titulo: 'Las herederas de Bachué: colombianas que construyen un nuevo país, en minga por la paz',
    autores: [{ nombre: 'María Eugenia Ibarra Melo' }],
    anio: '2021',
    fuente: 'En Los derechos de las mujeres. Caminos de libertad (Universidad de Guanajuato)',
    resumen: 'Un balance de la acción colectiva de las mujeres por la paz, de lo que lograron con el Acuerdo de 2016 y de los retos que siguen abiertos.',
    territorio: 'Colombia',
    nodo: 'Pacífico',
    licencia: 'Derechos reservados',
  },
  {
    zenodo: 24318656,
    tipo: 'capitulo',
    titulo: 'Mujeres y feministas en el estallido social de Colombia, 2021',
    autores: [{ nombre: 'María Eugenia Ibarra Melo' }, { nombre: 'Stephania Recalde García' }],
    anio: '2023',
    fuente: 'En Derechos humanos y paz: dimensiones para el fortalecimiento de la democracia (CLACSO)',
    resumen: 'Qué hicieron las mujeres y las feministas en el estallido social de 2021 en Cali, Popayán y Buenaventura, y cómo se volvieron actoras políticas en las calles.',
    territorio: 'Cali, Popayán y Buenaventura',
    nodo: 'Pacífico',
    licencia: 'CC BY-NC-ND 4.0',
  },
  {
    zenodo: 24318668,
    tipo: 'capitulo',
    titulo: 'La configuración del sistema de guerra en Colombia y la construcción de las masculinidades bélicas',
    autores: [{ nombre: 'María Eugenia Ibarra Melo' }, { nombre: 'Juan Manuel Ruiz Barrera' }],
    anio: '2025',
    fuente: 'En Lo común como horizonte: paz, resistencias y territorios en Colombia (CLACSO)',
    resumen: 'A partir de dos historias de vida de excombatientes de las FARC-EP, muestra cómo la guerra fue moldeando una manera de ser hombre.',
    territorio: 'Tolima',
    nodo: 'Pacífico',
    licencia: 'CC BY-NC-ND 4.0',
  },
  {
    zenodo: 24319033,
    tipo: 'informe',
    titulo: 'Caracterización de la población en proceso de reincorporación en el Valle del Cauca',
    autores: [{ nombre: 'María Eugenia Ibarra Melo' }, { nombre: 'María Gertrudis Roa-Martínez' }],
    anio: '2019',
    fuente: 'Boletín El Observador, n.º 42, CIDSE, Universidad del Valle',
    resumen: 'Los primeros datos sobre cómo viven las personas en reincorporación en el Valle del Cauca: vivienda, hogar, necesidades básicas y desafiliación social.',
    territorio: 'Valle del Cauca',
    nodo: 'Pacífico',
    licencia: 'Derechos reservados',
  },
  {
    zenodo: 24319035,
    tipo: 'informe',
    titulo: 'Desafiliación social: riesgos en la reincorporación de los exguerrilleros de las Farc en el Valle del Cauca',
    autores: [{ nombre: 'María Gertrudis Roa-Martínez' }, { nombre: 'María Eugenia Ibarra Melo' }],
    anio: '2020',
    fuente: 'En Informe de Coyuntura Socio-Económica: Cali 2019, CIDSE, Universidad del Valle',
    resumen: 'Informe para la Mesa Departamental de Reincorporación: un modelo para medir la desafiliación social y los riesgos que enfrenta la reincorporación.',
    territorio: 'Valle del Cauca',
    nodo: 'Pacífico',
    licencia: 'Derechos reservados',
  },
];

export const videos: Video[] = [
  {
    zenodo: 24318670,
    yt: 'HIE2BvUdIYI',
    titulo: 'Óscar Useche - El miedo a la paz',
    canal: 'El miedo a la paz (Documentales)',
    anio: '2018',
    duracion: '13 min',
    resumen: 'El economista Óscar Useche, experto en paz y ciudadanía, reflexiona sobre el miedo a la paz en Colombia.',
    territorio: 'Colombia',
    conversan: [{ nombre: 'Óscar Useche', id: 'oscar-useche' }],
  },
  {
    zenodo: 24318678,
    yt: 'WNwiYUljWQc',
    titulo: 'Fundación Progreso y Paz - Pro&Paz',
    canal: 'Fundación Pro & Paz',
    anio: '2025',
    duracion: '3 min',
    resumen: 'Un proceso nacido en la comuna 7 de Buenaventura que usa el arte, el deporte y la comunicación popular para prevenir el reclutamiento de niñas, niños y jóvenes y las violencias basadas en género.',
    territorio: 'Buenaventura',
  },
];

// Comprueba en Zenodo qué registros ya están publicados (al construir el sitio).
// Si no hay conexión, se asume que no lo están y la página usa el enlace original.
// Zenodo responde 403 al agente por defecto de Node: hay que mandar uno propio.
export async function publicadosEnZenodo(ids: number[]): Promise<Set<number>> {
  const ok = new Set<number>();
  const consultar = async (id: number) => {
    for (let intento = 0; intento < 3; intento++) {
      try {
        const r = await fetch(`https://zenodo.org/api/records/${id}`, {
          headers: { 'User-Agent': 'redquynza-site-build/1.0' },
          signal: AbortSignal.timeout(10000),
        });
        if (r.ok) ok.add(id);
        if (r.ok || r.status === 404 || r.status === 410) return;
      } catch {
        /* corte de red: se reintenta */
      }
      await new Promise((res) => setTimeout(res, 1500 * (intento + 1)));
    }
  };
  for (const id of ids) await consultar(id); // de a uno, para no toparse con el límite de Zenodo
  return ok;
}

export const zenodoUrl = (id: number) => `https://zenodo.org/records/${id}`;
