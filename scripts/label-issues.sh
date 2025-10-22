#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/label-issues.sh <issue-number> <label> [<label>...]
#   ./scripts/label-issues.sh 1 proposal:observability privacy-reviewed
# Requires GitHub CLI (gh) authenticated and repo set as origin.

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI 'gh' is required. See https://cli.github.com/" >&2
  exit 1
fi

if [ $# -lt 2 ]; then
  echo "Usage: $0 <issue-number> <label> [<label>...]" >&2
  exit 1
fi

ISSUE_NUMBER="$1"; shift

echo "Adding labels to issue #${ISSUE_NUMBER}: $*"
gh issue edit "$ISSUE_NUMBER" --add-label "$@"
echo "Done."

