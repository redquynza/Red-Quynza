// Ediciones del boletín mensual (sale el último martes de cada mes).
// Cada número tiene su página en src/pages/boletin/<numero>.astro;
// esta lista alimenta el archivo de /boletin.

export const CANAL_WHATSAPP = 'https://whatsapp.com/channel/0029Vb8rnFRG3R3lYLTDhP0g';
export const CORREO_CONVOCATORIA = 'martinpereat@protonmail.com';

export const boletines = [
  {
    numero: 1,
    fecha: '2026-10-27',
    mes: 'Octubre de 2026',
    titulo: 'La paz también se construye en la ciudad',
    resumen: 'El primer episodio del podcast, con Óscar Useche; la vuelta del ESMAD; el Expediente De la Espriella y el encuentro de paz en Manizales.',
    imagen: '/img/boletin/n1-portada.jpg',
  },
];

// Próximo número: fecha de salida y cierre de la convocatoria.
export const proximo = { numero: 2, sale: 'martes 24 de noviembre', cierre: 'martes 17 de noviembre' };

// "27 de octubre de 2026"
export const fechaLarga = (f: Date | string) =>
  new Date(f).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
