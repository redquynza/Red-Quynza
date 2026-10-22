#!/usr/bin/env bash
# Actualiza el sistema de aportes en redquynza.org (nueva columna en la base y nueva versión del Worker).
# Ejecútalo desde la carpeta Red-Quynza:  bash scripts/actualizar-aportes.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo
echo "== 1/2 Cambios en la base de datos de Cloudflare =="
npx wrangler d1 migrations apply red-quynza-aportes --remote

echo
echo "== 2/2 Publicar el sitio =="
npm run build
npx wrangler deploy

echo
echo "Listo. Avísale a Claude."
