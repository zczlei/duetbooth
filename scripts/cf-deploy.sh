#!/usr/bin/env bash
# Build + deploy without baking .env.local (localhost / sk_test) into the Worker.
set -euo pipefail
cd "$(dirname "$0")/.."

MOVED=0
if [[ -f .env.local ]]; then
  mv .env.local .env.local.bak
  MOVED=1
fi
cleanup() {
  if [[ "$MOVED" -eq 1 && -f .env.local.bak ]]; then
    mv .env.local.bak .env.local
  fi
}
trap cleanup EXIT

# Ensure production public URL is present for NEXT_PUBLIC_* inlining.
if [[ ! -f .env.production ]]; then
  printf '%s\n' 'NEXT_PUBLIC_APP_URL=https://duetbooth.co' > .env.production
fi

pnpm exec opennextjs-cloudflare build
pnpm exec opennextjs-cloudflare deploy -- --keep-vars
