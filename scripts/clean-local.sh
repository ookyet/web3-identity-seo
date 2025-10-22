#!/usr/bin/env bash
set -euo pipefail

echo "Cleaning local artifacts..."

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Monitoring logs
if [ -d "$ROOT_DIR/.monitoring-logs" ]; then
  rm -rf "$ROOT_DIR/.monitoring-logs"
  echo "✓ Removed .monitoring-logs/"
fi

# Example cache placeholders (extend if you add caches)
if [ -d "$ROOT_DIR/.cache" ]; then
  rm -rf "$ROOT_DIR/.cache"
  echo "✓ Removed .cache/"
fi

echo "Done."

