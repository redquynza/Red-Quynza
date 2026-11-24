// Ediciones del boletín mensual (sale el último martes de cada mes).
// Cada número tiene su página en src/pages/boletin/<numero>.astro;
// esta lista alimenta el archivo de /boletin.

export const CANAL_WHATSAPP = 'https://whatsapp.com/channel/0029Vb8rnFRG3R3lYLTDhP0g';
export const CORREO_CONVOCATORIA = 'redquynza@gmail.com';

export const boletines = [
  {
    numero: 1,
    fecha: '2026-10-27',
    mes: 'Octubre de 2026',
    titulo: 'La paz también se construye en la ciudad',
    resumen: 'El primer episodio del podcast, con Óscar Useche; la vuelta del ESMAD; el Expediente De la Espriella y el encuentro de paz en Manizales.',
    imagen: '/img/boletin/n1-portada.jpg',
  },
  {
    numero: 2,
    fecha: '2026-11-24',
    mes: 'Noviembre de 2026',
    titulo: 'La seguridad se mide en vidas',
    resumen: 'Una nota de política sobre la seguridad en el Tolima, el análisis de Carlos Medina Gallego sobre la «guerra total», una firmante que se gradúa en Medellín, el Expediente de noviembre y la agenda de fin de año.',
    imagen: '/img/boletin/n2-portada.jpg',
  },
];

// Próximo número: fecha de salida y cierre de la convocatoria.
// El de diciembre se corre una semana: sale el 5 de enero de 2027 (en enero salen dos números).
export const proximo = { numero: 3, sale: 'martes 5 de enero de 2027', cierre: 'martes 29 de diciembre' };

// "27 de octubre de 2026"
export const fechaLarga = (f: Date | string) =>
  new Date(f).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
