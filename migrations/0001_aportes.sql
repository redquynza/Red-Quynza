-- Aportantes con cobro mensual automático (Wompi) y el historial de cada cobro.
-- Fechas como texto 'YYYY-MM-DD' en hora de Colombia; marcas de tiempo en ISO UTC.

CREATE TABLE aportantes (
  id TEXT PRIMARY KEY,                 -- uuid
  clave TEXT NOT NULL UNIQUE,          -- secreto del enlace "Mi aporte" (ver y cancelar)
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  perfil TEXT NOT NULL,                -- estudiante | profesor | amigo
  monto INTEGER NOT NULL,              -- pesos al mes
  metodo TEXT NOT NULL,                -- CARD | NEQUI
  detalle_metodo TEXT,                 -- "VISA ···· 4242" o "Nequi ···· 1111"
  payment_source_id INTEGER,           -- fuente de pago en Wompi
  -- verificando: esperando 3D Secure o la aceptación en Nequi
  -- cobrando: primer cobro enviado
  -- activo | suspendido (3 cobros fallidos) | rechazado (no pasó el primer cobro) | cancelado
  estado TEXT NOT NULL,
  dia_cobro INTEGER,                   -- 1..28
  proximo_cobro TEXT,                  -- fecha del siguiente cobro
  fallos INTEGER NOT NULL DEFAULT 0,   -- cobros fallidos seguidos
  creado TEXT NOT NULL,
  actualizado TEXT NOT NULL,
  cancelado TEXT
);
CREATE INDEX aportantes_cobro ON aportantes (estado, proximo_cobro);
CREATE INDEX aportantes_email ON aportantes (email);

CREATE TABLE cobros (
  referencia TEXT PRIMARY KEY,         -- referencia única enviada a Wompi
  aportante_id TEXT NOT NULL REFERENCES aportantes (id),
  monto INTEGER NOT NULL,
  periodo TEXT NOT NULL,               -- fecha programada del cobro
  intento INTEGER NOT NULL,
  wompi_id TEXT,                       -- id de la transacción en Wompi
  estado TEXT NOT NULL,                -- PENDING | APPROVED | DECLINED | VOIDED | ERROR
  creado TEXT NOT NULL,
  actualizado TEXT NOT NULL
);
CREATE INDEX cobros_aportante ON cobros (aportante_id, creado);
CREATE INDEX cobros_estado ON cobros (estado);
