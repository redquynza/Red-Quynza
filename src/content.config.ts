import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Textos completos de la RED (la sección tipo blog). Cada archivo .md de
// src/content/textos es una página en /textos/<nombre-del-archivo>.
// El boletín de cada mes resume estos textos y enlaza a ellos.
const textos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/textos' }),
  schema: z.object({
    titulo: z.string(),
    bajada: z.string(),              // 2 o 3 líneas: se usan en el boletín, el correo y al compartir
    tipo: z.string(),                // Expediente, Nota, Agenda, Columna, Avance de investigación…
    autor: z.string(),
    firma: z.string().optional(),    // cuenta o reseña corta bajo el autor
    fecha: z.coerce.date(),
    region: z.string().optional(),
    tema: z.string().optional(),
    boletin: z.number().optional(),  // número del boletín en que salió
    imagen: z.string().optional(),   // ruta en /public, para la cabecera y al compartir
    imagenAlt: z.string().optional(),
    adjunto: z.object({ href: z.string(), etiqueta: z.string() }).optional(),
  }),
});

export const collections = { textos };
