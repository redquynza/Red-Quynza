#!/usr/bin/env bash
# Lanzamiento del sistema de aportes en redquynza.org.
# Ejecútalo desde la carpeta Red-Quynza:  bash scripts/lanzar-aportes.sh
# Te pide pegar cada llave (no se muestran en pantalla). Nada se guarda en el repositorio.
set -euo pipefail
cd "$(dirname "$0")/.."

echo
echo "== 1/4 Tablas en la base de datos de Cloudflare =="
npx wrangler d1 migrations apply red-quynza-aportes --remote

echo
echo "== 2/4 Llaves privadas (pega cada una y presiona Enter) =="
echo "Wompi → Desarrollo → Programadores, en modo PRODUCCIÓN (botón 'Mostrar')."
echo
echo "-> Llave PRIVADA de Wompi (empieza por prv_prod_):"
npx wrangler secret put WOMPI_PRIVATE_KEY
echo "-> Secreto de EVENTOS de Wompi (empieza por prod_events_):"
npx wrangler secret put WOMPI_EVENTS_SECRET
echo "-> Secreto de INTEGRIDAD de Wompi (empieza por prod_integrity_):"
npx wrangler secret put WOMPI_INTEGRITY_SECRET
echo "-> Llave de Resend (empieza por re_), la de la ventana 'redquynza-aportes':"
npx wrangler secret put RESEND_API_KEY

echo
echo "== 3/4 Clave de administrador (para descargar las tablas de aportantes y cobros) =="
ADMIN=$(node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))")
printf '%s' "$ADMIN" | npx wrangler secret put ADMIN_TOKEN
echo
echo "   GUARDA ESTA CLAVE en un lugar seguro (no se vuelve a mostrar):"
echo "   $ADMIN"
echo

echo "== 4/4 Publicar el sitio =="
npm run build
npx wrangler deploy

echo
echo "Listo. Avísale a Claude para configurar las notificaciones de Wompi y hacer la prueba real."
