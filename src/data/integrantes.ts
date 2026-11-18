// Directorio de integrantes de la RED Quynza.
// Fuente: formulario de directorio (respuestas con autorización de publicación).
// Solo va aquí lo publicable: nombre, foto, reseña, ciudad e instituciones.
// Las reseñas muy extensas se condensaron respetando la voz de cada persona.

export const regiones = [
  { id: 'caribe', nombre: 'Caribe' },
  { id: 'oriente', nombre: 'Oriente' },
  { id: 'centro', nombre: 'Zona Centro' },
  { id: 'cafetera', nombre: 'Zona Cafetera' },
  { id: 'pacifico', nombre: 'Pacífico' },
  { id: 'orinoquia', nombre: 'Orinoquía' },
  { id: 'amazonia', nombre: 'Amazonía' },
] as const;

export type Integrante = {
  id: string;
  nombre: string;
  /** Una línea: cargo o perfil. */
  rol: string;
  /** Institución principal. */
  institucion: string;
  ciudad: string;
  region: (typeof regiones)[number]['id'];
  foto?: string;
  /** Párrafos de la reseña. */
  resena: string[];
  otras?: string;
  enlaces?: { label: string; href: string }[];
};

export const integrantes: Integrante[] = [
  // ---------- Caribe ----------
  {
    id: 'blas-zubiria',
    nombre: 'Blas Zubiría Mutis',
    rol: 'Sociólogo y escritor, docente titular de Sociología',
    institucion: 'Universidad del Atlántico',
    ciudad: 'Barranquilla',
    region: 'caribe',
    foto: '/img/integrantes/blas-zubiria.webp',
    resena: [
      'Sociólogo de la Universidad Simón Bolívar (Barranquilla, 1988), magíster en Historia (Universidad Nacional de Colombia / Universidad del Atlántico, 1998) y especialista en Procesos Políticos Latinoamericanos en el siglo XXI de CLACSO (2019). Escritor. Docente titular de tiempo completo del programa de Sociología de la Universidad del Atlántico, investigador del Grupo Goffman y director del Semillero de Investigación Rayuela.',
      'Sus líneas de investigación son la sociología política, el pensamiento sociológico latinoamericano y la sociología de la literatura. Ha publicado sobre violencia urbana en Barranquilla y el Caribe, entre otros el capítulo «Un renovado imaginario. El derecho de la ciudad a la paz» (IEPRI, 2026), escrito con colegas de la red. Su obra literaria incluye el poemario «De ciertas lealtades» (2021), «Gabriela y otros cuentos» (2021) y las novelas «Sin remordimiento» (2022) y «Diario de la inutilidad cotidiana» (2025).',
    ],
  },
  {
    id: 'wilfrido-ariza',
    nombre: 'Wilfrido Ariza',
    rol: 'Sociólogo, docente catedrático',
    institucion: 'Universidad del Atlántico',
    ciudad: 'Barranquilla',
    region: 'caribe',
    foto: '/img/integrantes/wilfrido-ariza.webp',
    resena: [
      'Sociólogo, especialista en Crimen Organizado y Seguridad Internacional y magíster en Políticas Públicas. Docente catedrático de la Universidad del Atlántico.',
    ],
    otras: 'Alcaldía de Barranquilla',
  },
  {
    id: 'lorena-mancera',
    nombre: 'Lorena Cecilia Mancera Panza',
    rol: 'Docente investigadora, líder del grupo OIDHPAZ',
    institucion: 'Corporación Universitaria Reformada',
    ciudad: 'Barranquilla',
    region: 'caribe',
    foto: '/img/integrantes/lorena-mancera.webp',
    resena: [
      'Socióloga y magíster en Estudios Latinoamericanos, doctoranda en Ciencias Sociales de la Universidad Nacional de La Plata. Docente investigadora de la Corporación Universitaria Reformada (Barranquilla), donde lidera el grupo OIDHPAZ y dirige el semillero REMEFES.',
      'Investiga juventudes, violencias y género en América Latina, con énfasis en el juvenicidio como práctica necropolítica y en la violencia homicida. Combina la investigación con la gestión de políticas públicas y la coordinación de proyectos.',
    ],
    otras: 'Alcaldía Distrital de Barranquilla',
  },
  {
    id: 'andres-miranda',
    nombre: 'Andrés Eduardo Miranda Pacheco',
    rol: 'Sociólogo, investigador en violencias e investigación acción participativa',
    institucion: 'Universidad del Atlántico',
    ciudad: 'Barranquilla',
    region: 'caribe',
    foto: '/img/integrantes/andres-miranda.webp',
    resena: [
      'Sociólogo egresado de la Universidad del Atlántico, formado en el estudio de las violencias y en la investigación acción participativa (IAP). Sus intereses investigativos son la sociología latinoamericana, la sociología de la violencia y la musicología.',
    ],
  },

  // ---------- Zona Centro ----------
  {
    id: 'carlos-mario-perea',
    nombre: 'Carlos Mario Perea',
    rol: 'Coordinador General de la RED Quynza',
    institucion: 'Universidad Nacional de Colombia',
    ciudad: 'Bogotá',
    region: 'centro',
    foto: '/img/integrantes/carlos-mario-perea.webp',
    resena: [
      'Coordinador General de la RED Quynza. Profesor del Instituto de Estudios Políticos y Relaciones Internacionales (IEPRI) de la Universidad Nacional de Colombia.',
    ],
  },
  {
    id: 'oscar-useche',
    nombre: 'Oscar Useche',
    rol: 'Profesor titular, Doctorado en Estudios Sociales',
    institucion: 'Universidad Distrital Francisco José de Caldas',
    ciudad: 'Bogotá',
    region: 'centro',
    foto: '/img/integrantes/oscar-useche.webp',
    resena: [
      'Profesor titular del Doctorado en Estudios Sociales de la Universidad Distrital Francisco José de Caldas. Director del Instituto de Noviolencia y profesor titular de la Escuela de Ciencias Humanas y Sociales de Uniminuto. Doctor en Paz, Conflictos y Democracia de la Universidad de Granada. Investigador del Grupo de Trabajo CLACSO «Cuidado, afectividades y vidas posthumanas».',
    ],
    otras: 'Consejo Latinoamericano de Investigación para la Paz (CLAIP); Instituto de la Paz y los Conflictos (IPAZ), Universidad de Granada',
  },
  {
    id: 'luz-adriana-parra',
    nombre: 'Luz Adriana Parra García',
    rol: 'Docente investigadora y doctoranda en Estudios Sociales',
    institucion: 'Secretaría de Educación del Distrito',
    ciudad: 'Bogotá',
    region: 'centro',
    foto: '/img/integrantes/luz-adriana-parra.webp',
    resena: [
      'Doctoranda en Estudios Sociales de la Universidad Distrital Francisco José de Caldas. Magíster en Desarrollo Educativo y Social (CINDE-UPN), especialista en Gerencia de Proyectos Educativos Institucionales de la Universidad Distrital y licenciada en Educación Básica con énfasis en Ciencias Sociales de la Universidad Pedagógica Nacional. Docente investigadora de la Secretaría de Educación del Distrito, con nombramiento en propiedad desde 2010.',
      'Experiencia en investigación social y educativa alrededor del cuidado, las ciudadanías, las migraciones, la paz, la convivencia y las prácticas noviolentas. Lidera desde 2015 el proyecto CUIDADANÍA en la IED Manuel Elkin Patarroyo. Su investigación doctoral se titula «CUIDADANÍAS: apuestas por las ciudadanías del cuidado. Las prácticas noviolentas y el cuidado como bien común».',
    ],
  },
  {
    id: 'martin-perea',
    nombre: 'Martín Perea Tobón',
    rol: 'Coordinador del Centro de Pensamiento Digital de la RED Quynza',
    institucion: 'Dial Medio',
    ciudad: 'Bogotá',
    region: 'centro',
    foto: '/img/integrantes/martin-perea.webp',
    resena: [
      'Realizador audiovisual, comunicador y músico de la ciudad de Bogotá. Creador de Dial Medio y coordinador del Centro de Pensamiento Digital de la RED Quynza. Me dedico a crear estrategias comunicativas y material audiovisual con enfoque en justicia social y diálogo político.',
    ],
  },
  {
    id: 'fabian-acosta',
    nombre: 'Fabián Rodolfo Acosta Sánchez',
    rol: 'Profesor asociado, Departamento de Ciencia Política',
    institucion: 'Universidad Nacional de Colombia',
    ciudad: 'Bogotá',
    region: 'centro',
    foto: '/img/integrantes/fabian-acosta.webp',
    resena: [
      'Filósofo e investigador social (1961). Master of Arts de la Universidad St. Kliment Ojridski de Sofía, Bulgaria (1986), cursó la maestría en Ciencia Política de la Universidad de los Andes (1994) y es doctor en Filosofía Social y Política de la Universidad Kliment Ojridski (2020). Profesor asociado del Departamento de Ciencia Política de la Universidad Nacional de Colombia y director del Observatorio de Juventud de la misma institución (OBJUN).',
      'Sus campos de interés son la filosofía social y política, la economía política, la teoría política, la sociología, la antropología y los estudios sociales enfocados en jóvenes y juventud.',
    ],
  },
  {
    id: 'lenin-giraldo',
    nombre: 'Lenin Alberto Giraldo',
    rol: 'Filósofo y analista de datos',
    institucion: 'Escuela Superior de Administración Pública (ESAP)',
    ciudad: 'Bogotá',
    region: 'centro',
    resena: [
      'Filósofo y analista de datos. Experto del Observatorio Nacional de Política Pública y del Laboratorio de Innovación de la Escuela Superior de Administración Pública (ESAP).',
    ],
    otras: 'Colectivo Ewcha',
  },
  {
    id: 'andres-tafur',
    nombre: 'Andrés Tafur Villarreal',
    rol: 'Docente, Departamento de Estudios Interdisciplinarios',
    institucion: 'Universidad del Tolima',
    ciudad: 'Ibagué',
    region: 'centro',
    foto: '/img/integrantes/andres-tafur.webp',
    resena: [
      'Soy docente asistente del Departamento de Estudios Interdisciplinarios de la Universidad del Tolima. Entre 2019 y 2025 dirigí su Centro de Estudios Regionales (CERE-UT), donde coordiné proyectos de investigación aplicada y consultoría pública en economía solidaria, ordenamiento territorial, justicia ambiental y construcción de paz, con énfasis en el Tolima, el suroccidente y el Pacífico colombiano.',
      'Tengo dos maestrías (ciencia política y construcción de paz) y pregrados en filosofía y comunicación social-periodismo. He liderado investigaciones sobre conflictos socioterritoriales ligados al mercado de bonos de carbono, la transformación de la violencia política y las capacidades institucionales para la no repetición. Hago parte de la Red de Estudios sobre Drogas en América Latina (REDESDAL) y publico opinión sobre seguridad, violencia política y construcción de paz.',
    ],
  },
  {
    id: 'david-silva',
    nombre: 'David Silva-Ojeda',
    rol: 'Profesor del Programa de Ciencia Política',
    institucion: 'Universidad Surcolombiana',
    ciudad: 'Neiva',
    region: 'centro',
    foto: '/img/integrantes/david-silva.webp',
    resena: [
      'Politólogo y magíster en Estudios Sociales y Políticos. Profesor del Programa de Ciencia Política e investigador del grupo Estudios Políticos de la Universidad Surcolombiana.',
    ],
  },

  // ---------- Zona Cafetera ----------
  {
    id: 'john-jairo-uribe',
    nombre: 'John Jairo Uribe Sarmiento',
    rol: 'Investigador en construcción de paces desde abajo',
    institucion: 'Universidades de Ibagué, Manizales y Autónoma de Manizales',
    ciudad: 'Manizales',
    region: 'cafetera',
    foto: '/img/integrantes/john-jairo-uribe.webp',
    resena: ['Investigador en construcción de paces desde abajo, juventudes y familias.'],
  },
  {
    id: 'james-delgado',
    nombre: 'James Delgado',
    rol: 'Artista, docente e investigador interdisciplinar',
    institucion: 'IPECAL',
    ciudad: 'Manizales',
    region: 'cafetera',
    foto: '/img/integrantes/james-delgado.webp',
    resena: [
      'James Alfonso Delgado Giraldo es artista, docente e investigador interdisciplinar y un sujeto sonopensante que articula sonido, imagen, palabra, cuerpo y pedagogía. Su trayectoria cruza creación sonora experimental, rock-blues, prácticas musicales comunitarias e investigación-creación. Es creador de Prácticas Musicales Comunitarias y Psicoblues. Actualmente cursa el Doctorado en Didáctica y Conciencia Histórica en IPECAL.',
    ],
  },
  {
    id: 'gloria-naranjo',
    nombre: 'Gloria Naranjo Giraldo',
    rol: 'Investigadora asociada, Instituto de Estudios Políticos',
    institucion: 'Universidad de Antioquia',
    ciudad: 'Medellín',
    region: 'cafetera',
    foto: '/img/integrantes/gloria-naranjo.webp',
    resena: [
      'Antropóloga y magíster en Ciencia Política de la Universidad de Antioquia; doctora en Ciencia Política de la Universidad de Luxemburgo y doctora en Ciencias Sociales de la Universidad de Granada. Profesora jubilada de la Universidad de Antioquia e investigadora asociada al Grupo Estudios Políticos del Instituto de Estudios Políticos. Hace parte del comité coordinador nacional de la RED Quynza.',
      'Sus líneas de investigación son las transiciones políticas, la paz territorial, la memoria, los conflictos y la reparación territorial, el derecho a la ciudad, la cultura de paz y las políticas públicas territoriales. Coordina el Proceso de Memoria Colectiva y Paz Territorial de la Zona Nororiental de Medellín (2020-2026). Es autora, entre otros, de «Tras las huellas ciudadanas» (2002) y «Desplazamiento forzado en Antioquia» (2001).',
    ],
    otras: 'Universidad Nacional, Universidad de los Andes, Corporación Convivamos, Corporación Viva la Ciudadanía',
    enlaces: [
      { label: 'ORCID', href: 'https://orcid.org/0000-0002-6270-1713' },
      { label: 'CvLAC', href: 'https://scienti.minciencias.gov.co/cvlac/visualizador/generarCurriculoCv.do?cod_rh=0000110639' },
      { label: 'Academia.edu', href: 'https://independent.academia.edu/GLORIAELENANARANJOGIRALDO' },
    ],
  },
  {
    id: 'natalia-maya',
    nombre: 'Natalia Maya Llano',
    rol: 'Coordinadora académica de la Unidad Especial de Paz',
    institucion: 'Universidad de Antioquia',
    ciudad: 'Medellín',
    region: 'cafetera',
    foto: '/img/integrantes/natalia-maya.webp',
    resena: [
      'Periodista, especialista en teorías, métodos y técnicas de investigación social, y magíster en ciencia política. Es coordinadora académica de la Unidad Especial de Paz de la Universidad de Antioquia, miembro del grupo de investigación Conflictos, Violencias y Seguridad Humana de la Facultad de Derecho y Ciencias Políticas e integrante del equipo Quynza Medellín.',
      'Ha sido investigadora y asesora del Centro Nacional de Memoria Histórica y de la Comisión para el Esclarecimiento de la Verdad, la Convivencia y la No Repetición, en temas relacionados con el conflicto armado, la violencia urbana, la memoria y la construcción de paz.',
    ],
  },
  {
    id: 'juan-camilo-portela',
    nombre: 'Juan Camilo Portela García',
    rol: 'Docente investigador, Instituto de Estudios Políticos',
    institucion: 'Universidad de Antioquia',
    ciudad: 'Medellín',
    region: 'cafetera',
    foto: '/img/integrantes/juan-camilo-portela.webp',
    resena: [
      'Antropólogo y magíster en Ciencia Política de la Universidad de Antioquia y doctor en Ciencias Sociales con mención en Sociología por la FLACSO-México. Es docente investigador del Instituto de Estudios Políticos de la Universidad de Antioquia, donde coordina el Semillero Conflicto y Acción Colectiva. Investiga movimientos sociales, acción colectiva y transiciones hacia la paz desde un enfoque cultural.',
    ],
  },
  {
    id: 'heidy-gomez',
    nombre: 'Heidy Cristina Gómez Ramírez',
    rol: 'Profesora de Sociología, investigadora asociada del INER',
    institucion: 'Universidad de Antioquia',
    ciudad: 'Medellín',
    region: 'cafetera',
    foto: '/img/integrantes/heidy-gomez.webp',
    resena: [
      'Candidata a doctora en Estudios Urbanos y Territoriales de la Universidad Nacional, sede Medellín, y magíster en Ciencias Sociales de la Universidad Nacional de La Plata (Argentina). Profesora de Sociología de la Universidad de Antioquia e investigadora asociada del grupo Cultura, Violencia y Territorio del INER. Sus temas de interés son la violencia urbana, la criminalidad y los estudios urbanos.',
    ],
  },
  {
    id: 'juan-esteban-lopera',
    nombre: 'Juan Esteban Lopera M.',
    rol: 'Profesor, Instituto de Estudios Políticos',
    institucion: 'Universidad de Antioquia',
    ciudad: 'Medellín',
    region: 'cafetera',
    foto: '/img/integrantes/juan-esteban-lopera.webp',
    resena: [
      'Es profesor del Instituto de Estudios Políticos de la Universidad de Antioquia, donde coordina la línea de investigación en Políticas Públicas Territoriales, Gobierno y Democracias Locales. En la actualidad trabaja, desde los ecosistemas de políticas públicas y la analítica de datos, temas asociados a la paz territorial.',
    ],
  },

  // ---------- Pacífico ----------
  {
    id: 'gildardo-vanegas',
    nombre: 'Gildardo Vanegas',
    rol: 'Coordinador editorial de la RED Quynza',
    institucion: 'Universidad del Valle',
    ciudad: 'Popayán · Cali',
    region: 'pacifico',
    foto: '/img/integrantes/gildardo-vanegas.webp',
    resena: [
      'Coordinador editorial de la RED Quynza. Sociólogo, magíster en Estudios Políticos y doctor en Sociología. Sus temas de investigación giran alrededor del conflicto violento urbano, el conflicto armado y las políticas públicas, con intereses en la literatura.',
    ],
  },
  {
    id: 'carlos-rojas',
    nombre: 'Carlos Rojas Cruz',
    rol: 'Investigador social y director',
    institucion: 'THOTLABS',
    ciudad: 'Cali',
    region: 'pacifico',
    foto: '/img/integrantes/carlos-rojas.webp',
    resena: [
      'Investigador social con base en Cali. Candidato a doctor en Derecho por la Universidad de Jaén (España), magíster en Políticas Públicas por la Universidad del Valle y en Derecho Constitucional por la Universidad Libre, y especialista en Teorías, Métodos y Técnicas de Investigación. Su trabajo une las ciencias sociales críticas con el uso metodológico de tecnologías digitales, desde las epistemologías del Sur y la perspectiva decolonial.',
      'Dirige THOTLABS, iniciativa de investigación aplicada e innovación pública que diseña arquitecturas de investigación asistidas por inteligencia artificial: sistemas agénticos para análisis jurídico, territorial y de políticas públicas, revisión sistemática y bibliometría, modelación de fenómenos de violencia urbana, análisis de fuentes abiertas (OSINT) e inteligencia territorial.',
      'Sus líneas de investigación abarcan los derechos de la naturaleza y el ecoconstitucionalismo en Colombia, Ecuador y Bolivia, la gobernanza algorítmica y la transformación digital del Estado, la seguridad ciudadana, los derechos étnico-territoriales y la gestión del riesgo. Su apuesta: una investigación social computacionalmente aumentada pero epistémicamente vigilante.',
    ],
    enlaces: [{ label: 'ORCID', href: 'https://orcid.org/0000-0003-0915-6653' }],
  },
  {
    id: 'mauricio-sedano',
    nombre: 'Mauricio Sedano',
    rol: 'Ingeniero electrónico y científico de datos',
    institucion: 'Fiscalía General de la Nación',
    ciudad: 'Cali',
    region: 'pacifico',
    resena: [
      'Ingeniero electrónico, científico de datos y magíster en Sociología. Investiga la construcción de paz ambiental en las huertas desde la sociología y la geografía, con métodos mediados por inteligencia artificial.',
    ],
  },
  {
    id: 'karen-ceron',
    nombre: 'Karen Nathalia Cerón Steevens',
    rol: 'Profesora e investigadora, Facultad de Estudios Internacionales, Políticos y Urbanos',
    institucion: 'Universidad del Rosario',
    ciudad: 'Puerto Tejada',
    region: 'pacifico',
    foto: '/img/integrantes/karen-ceron.webp',
    resena: [
      'Doctoranda en Sociología de la Universitat de Barcelona, magíster en Estudios Políticos e Internacionales y profesional en Relaciones Internacionales de la Universidad del Rosario. Actualmente es profesora e investigadora de la Facultad de Estudios Internacionales, Políticos y Urbanos de esa universidad.',
      'Especialista en la violencia asociada a las pandillas, que vincula especialmente a niños y jóvenes, en las carencias sociales que reproducen este y otros fenómenos, y en las dinámicas de acción colectiva y movilización social, particularmente en el Chocó. Ganadora del premio UNESCO-Juan Bosch a la mejor tesis de un joven investigador en América Latina y el Caribe.',
    ],
  },

  {
    id: 'gloria-montoya',
    nombre: 'Gloria Inés Montoya Duque',
    rol: 'Docente investigadora del Programa de Sociología',
    institucion: 'Universidad del Pacífico',
    ciudad: 'Buenaventura',
    region: 'pacifico',
    foto: '/img/integrantes/gloria-montoya.webp',
    resena: [
      'Doctora en Ciencias Sociales, magíster en Sociología, especialista en Teorías y Métodos en Sociología y socióloga de la Universidad del Valle. Docente investigadora del Programa de Sociología de la Universidad del Pacífico, donde coordina el grupo de investigación Huellas del Pacífico. Sus líneas de investigación son el conflicto y la violencia urbana, las acciones colectivas y los movimientos sociales.',
      'Ha estudiado la Ruta Pacífica de las Mujeres como movimiento feminista y pacifista en Colombia entre 1996 y 2016, tema de su capítulo «La Ruta Pacífica de las Mujeres y el Acuerdo de Paz 2016» en el libro «Lo común como horizonte» (CLACSO, 2025). Es coautora del artículo «Homicidio selectivo: modalidad de violencia urbana en Buenaventura 2000-2015» (revista Territorios, 2024) y coordinó el libro «Acciones colectivas y conflicto en Buenaventura 2008-2012» (Universidad del Pacífico, 2015).',
    ],
    enlaces: [{ label: 'ORCID', href: 'https://orcid.org/0000-0001-7605-6885' }],
  },
  {
    id: 'alejandra-gutierrez',
    nombre: 'Alejandra Gutiérrez Gómez',
    rol: 'Docente investigadora, grupo Humanidades y Estudios Socioculturales',
    institucion: 'Fundación Universitaria Claretiana',
    ciudad: 'Quibdó',
    region: 'pacifico',
    foto: '/img/integrantes/alejandra-gutierrez.webp',
    resena: [
      'Antropóloga y magíster en Estudios Afrocolombianos de la Pontificia Universidad Javeriana. Docente investigadora de la Fundación Universitaria Claretiana, en Quibdó, e integrante del grupo de investigación Humanidades y Estudios Socioculturales.',
      'Tiene experiencia en investigación etnográfica en el Pacífico colombiano sobre territorialidades campesinas y procesos organizativos. En los últimos años sus intereses se han centrado en las dinámicas de conflictividad urbana en Quibdó y sus efectos en la vida cotidiana, especialmente de los jóvenes afrocolombianos e indígenas.',
    ],
  },
  {
    id: 'maria-elena-erazo',
    nombre: 'María Elena Erazo Coral',
    rol: 'Decana de la Facultad de Ciencias Humanas y Sociales',
    institucion: 'Universidad de Nariño',
    ciudad: 'Pasto',
    region: 'pacifico',
    foto: '/img/integrantes/maria-elena-erazo.webp',
    resena: [
      'Licenciada en Ciencias Sociales de la Universidad de Nariño (1988), magíster en Estudios Latinoamericanos con énfasis en Historia de la Universidad Nacional Autónoma de México (1992) y doctora en Ciencias de la Educación de la Universidad de Nariño – RUDECOLOMBIA (2012). Docente de tiempo completo de la Universidad de Nariño desde 2004, donde ha sido elegida decana de la Facultad de Ciencias Humanas y Sociales (2017-2020 y 2025-2028) e integra la Comisión de Género y Diversidades. Presidió la mesa directiva de la Asamblea Universitaria entre 2014 y 2020.',
      'Coordina el grupo de investigación Edu-multiverso, en la línea de estudios regionales. Lideró el proyecto «Mujeres posicionando la paz en los territorios del Centro y Cordillera», ganador de la convocatoria de la Fundación WWB Colombia en 2022, y es coautora del Protocolo de Atención de Casos de Violencia de Género y Población LGTBIQ+ de la Universidad de Nariño, reconocido por el Ministerio de Educación Nacional en 2025. Entre sus publicaciones está el libro «Representaciones de nación desde la región: una generación docente, dos campos de poder» (Universidad de Nariño, 2015).',
    ],
  },
  {
    id: 'carmen-ceron',
    nombre: 'Carmen Patricia Cerón Rengifo',
    rol: 'Antropóloga, docente del Departamento de Ciencias Sociales',
    institucion: 'Universidad de Nariño',
    ciudad: 'Pasto',
    region: 'pacifico',
    foto: '/img/integrantes/carmen-ceron.webp',
    resena: ['Antropóloga. Docente del Departamento de Ciencias Sociales de la Universidad de Nariño.'],
  },
  {
    id: 'alvaro-dorado',
    nombre: 'Álvaro Darío Dorado Martínez',
    rol: 'Psicólogo, docente investigador del Programa de Psicología',
    institucion: 'Universidad de Nariño',
    ciudad: 'Pasto',
    region: 'pacifico',
    foto: '/img/integrantes/alvaro-dorado.webp',
    resena: [
      'Psicólogo de la Universidad de Nariño y magíster en Psicología de la Universidad Autónoma del Estado de Morelos (México), con formación en Derechos de los Autores Internacionales en la Universidad Complutense de Madrid. Docente investigador de los programas de Psicología de la Universidad de Nariño y de la Universidad Antonio Nariño, y conciliador en equidad del Ministerio de Justicia.',
      'Es miembro del Grupo de Investigación Psicología y Salud de la Universidad de Nariño y de la Asociación Latinoamericana de Psicología de la Salud (ALAPSA).',
    ],
    otras: 'Universidad Antonio Nariño',
  },

  // ---------- Orinoquía ----------
  {
    id: 'cesar-huertas',
    nombre: 'César Alfonso Huertas Chaparro',
    rol: 'Profesor e investigador, líder del Grupo de Investigación en Transformación Agraria',
    institucion: 'Universidad de los Llanos',
    ciudad: 'Villavicencio',
    region: 'orinoquia',
    foto: '/img/integrantes/cesar-huertas.webp',
    resena: [
      'Economista y magíster en Desarrollo Rural, profesor e investigador de la Universidad de los Llanos, líder del Grupo de Investigación en Transformación Agraria (GITA). Coordinador de la Red de Observatorios – Observatorio de la Orinoquía y líder del Observatorio del Territorio.',
      'Se desempeñó como Joven Investigador de Colciencias y participó en la formulación de la Estrategia de Desarrollo Agropecuario y Rural para el departamento del Meta. Su trayectoria abarca proyectos de desarrollo y extensión rural, formulación de políticas públicas y articulación comunitaria con organizaciones campesinas.',
    ],
  },
];

export const porRegion = (id: string) => integrantes.filter((m) => m.region === id);
