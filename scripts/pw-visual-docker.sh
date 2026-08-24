#!/usr/bin/env bash
# Local: Next on the host; Chromium from the Microsoft Playwright image (run-server).
# CI: already inside that image — workspace visual only (no nested Docker, no npm ci here).
# Usage: npm run test:visual | npm run test:visual:update
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PW_VERSION="$(node -p "require('@playwright/test/package.json').version")"
IMAGE="mcr.microsoft.com/playwright:v${PW_VERSION}-jammy"
UPDATE_SNAPSHOTS="${1:-}"
APP_PORT=4100
WS_PORT=3400
CID="seokit-pw-visual"

run_workspace_visual() {
  if [ "${UPDATE_SNAPSHOTS:-}" = "--update-snapshots" ]; then
    npm run test:visual -w seokit-webapp -- --update-snapshots
  else
    npm run test:visual -w seokit-webapp
  fi
}

if [ -d /ms-playwright ] && [ -f /.dockerenv ]; then
  echo "image: $IMAGE (already in Playwright container)"
  run_workspace_visual
  exit 0
fi

echo "image: $IMAGE"

npm run build -w @sargonpiraev/seokit
npm run build -w seokit-webapp

cleanup() {
  docker rm -f "$CID" >/dev/null 2>&1 || true
}
trap cleanup EXIT
cleanup

docker run -d --name "$CID" --init --ipc=host \
  -p "127.0.0.1:${WS_PORT}:${WS_PORT}" \
  --add-host=host.docker.internal:host-gateway \
  -e PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
  "$IMAGE" \
  /bin/sh -c "npx -y playwright@${PW_VERSION} run-server --port ${WS_PORT} --host 0.0.0.0"

node -e '
const net = require("node:net");
const port = Number(process.argv[1]);
const deadline = Date.now() + 180_000;
(function connect() {
  const socket = net.connect(port, "127.0.0.1", () => {
    socket.end();
    process.exit(0);
  });
  socket.on("error", () => {
    if (Date.now() > deadline) process.exit(1);
    setTimeout(connect, 500);
  });
})();
' "$WS_PORT"

export PW_TEST_CONNECT_WS_ENDPOINT="ws://127.0.0.1:${WS_PORT}/"
export PLAYWRIGHT_BASE_URL="http://host.docker.internal:${APP_PORT}"
export CI=true
run_workspace_visual
