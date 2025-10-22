#!/usr/bin/env bash
set -euo pipefail

# Requires: GitHub CLI (gh) authenticated to this repo

create_label() {
  local name="$1" color="$2" desc="$3"
  if gh label list --limit 200 | awk '{print $1}' | grep -Fxq "$name"; then
    echo "Label exists: $name"
    gh label edit "$name" --color "$color" --description "$desc" >/dev/null || true
  else
    gh label create "$name" --color "$color" --description "$desc" >/dev/null || true
    echo "Created label: $name"
  fi
}

create_label "proposal:observability" "1d76db" "Read-only observability proposals (Discover)"
create_label "privacy-reviewed" "0e8a16" "Reviewed for privacy (read-only, local, no PII)"
create_label "wontfix:ranking" "d73a4a" "Out of scope – ranking/SEO manipulation"

echo "Done."

