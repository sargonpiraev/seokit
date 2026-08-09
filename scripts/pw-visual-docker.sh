#!/usr/bin/env bash
# Update webapp visual baselines inside the Playwright Linux image (same as CI).
# Usage: npm run test:visual:update
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PW_VERSION="$(node -p "require('@playwright/test/package.json').version")"
IMAGE="mcr.microsoft.com/playwright:v${PW_VERSION}-jammy"

echo "image: $IMAGE"

docker run --rm --ipc=host \
  -v "$ROOT:/work" \
  -v seokit-pw-nm:/work/node_modules \
  -v seokit-pw-nm-webapp:/work/apps/webapp/node_modules \
  -v seokit-pw-nm-docapp:/work/apps/docapp/node_modules \
  -v seokit-pw-nm-pkg:/work/packages/seokit/node_modules \
  -w /work \
  -e CI=true \
  -e PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
  "$IMAGE" \
  bash -lc '
    set -euo pipefail
    npm ci
    npm run build -w @sargonpiraev/seokit
    npm run build -w seokit-webapp
    npm run test:visual -w seokit-webapp -- --update-snapshots
  '
