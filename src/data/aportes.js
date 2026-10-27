// Perfiles y montos del aporte mensual. Lo usan la página /aportar y el Worker
// (que vuelve a validar el monto antes de crear el cobro). Montos en pesos.
export const perfiles = [
  {
    id: 'estudiante',
    nombre: 'Estudiante',
    quien: 'Soy estudiante',
    detalle: 'Integrantes de la RED en pregrado o posgrado.',
    montos: [10000, 20000, 30000],
    sugerido: 20000,
  },
  {
    id: 'profesor',
    nombre: 'Profesor/a',
    quien: 'Soy profesor/a',
    detalle: 'Investigadoras e investigadores de la RED.',
    montos: [30000, 50000, 80000],
    sugerido: 50000,
  },
  {
    id: 'amigo',
    nombre: 'Amigos de la Red',
    quien: 'Apoyo desde afuera',
    detalle: 'Personas que siguen y respaldan el trabajo de la RED.',
    montos: [20000, 50000, 100000],
    sugerido: 50000,
  },
];

export const metodos = {
  CARD: 'Tarjeta de crédito o débito',
  NEQUI: 'Nequi',
};

export const pesos = (n) => '$' + Number(n).toLocaleString('es-CO');

// Además de los tres montos, cada quien puede escribir otro valor: desde el mínimo
// de su perfil hasta este tope (que solo evita errores al digitar).
export const MONTO_MAXIMO = 2000000;
export const montoMinimo = (p) => Math.min(...p.montos);

export function montoValido(perfil, monto) {
  const p = perfiles.find((x) => x.id === perfil);
  const n = Number(monto);
  return !!p && Number.isInteger(n) && n >= montoMinimo(p) && n <= MONTO_MAXIMO;
}
