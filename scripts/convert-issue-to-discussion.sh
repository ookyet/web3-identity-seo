#!/usr/bin/env bash
set -euo pipefail

# Convert a GitHub Issue to a Discussion in a given category (default: Q&A)
# Requirements: GitHub CLI (gh) logged in with repo scope, and jq installed.
# Usage: ./scripts/convert-issue-to-discussion.sh <issue-number> [<category-name>]

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI 'gh' is required. See https://cli.github.com/" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "'jq' is required. See https://stedolan.github.io/jq/" >&2
  exit 1
fi

if [ $# -lt 1 ]; then
  echo "Usage: $0 <issue-number> [<category-name>]" >&2
  exit 1
fi

ISSUE_NUMBER="$1"
CATEGORY_NAME="${2:-Q&A}"

# Detect owner/repo from git remote origin
REMOTE_URL=$(git remote get-url origin 2>/dev/null || true)
if [[ -z "${REMOTE_URL}" ]]; then
  echo "Cannot detect origin remote. Run inside a cloned GitHub repo with 'origin' set." >&2
  exit 1
fi

# Parse owner and repo from REMOTE_URL
# Supports ssh and https formats
if [[ "$REMOTE_URL" =~ github.com[:/](.+)/([^/]+)(\.git)?$ ]]; then
  OWNER="${BASH_REMATCH[1]}"
  REPO="${BASH_REMATCH[2]}"
else
  echo "Unable to parse repo owner/name from origin URL: $REMOTE_URL" >&2
  exit 1
fi

echo "Repo: $OWNER/$REPO"
echo "Issue #: $ISSUE_NUMBER"
echo "Target category: $CATEGORY_NAME"

# Query repository, categories and issue id
DATA=$(gh api graphql -f owner="$OWNER" -f name="$REPO" -F number="$ISSUE_NUMBER" -f query='
  query($owner:String!, $name:String!, $number:Int!) {
    repository(owner:$owner, name:$name) {
      id
      discussionCategories(first:100) { nodes { id name } }
      issue(number:$number) { id number title }
    }
  }
')

ISSUE_ID=$(echo "$DATA" | jq -r '.data.repository.issue.id')
FOUND_TITLE=$(echo "$DATA" | jq -r '.data.repository.issue.title')
CATEGORY_ID=$(echo "$DATA" | jq -r --arg n "$CATEGORY_NAME" '.data.repository.discussionCategories.nodes[] | select(.name==$n) | .id' | head -n1)

if [[ -z "$ISSUE_ID" || "$ISSUE_ID" == "null" ]]; then
  echo "Issue #$ISSUE_NUMBER not found." >&2
  exit 1
fi

if [[ -z "$CATEGORY_ID" ]]; then
  echo "Discussion category '$CATEGORY_NAME' not found in $OWNER/$REPO." >&2
  echo "Available categories:" >&2
  echo "$DATA" | jq -r '.data.repository.discussionCategories.nodes[].name' >&2
  exit 1
fi

echo "Converting: #$ISSUE_NUMBER - $FOUND_TITLE"

# Convert issue to discussion
RESP=$(gh api graphql -f issueId="$ISSUE_ID" -f categoryId="$CATEGORY_ID" -f query='
  mutation($issueId:ID!, $categoryId:ID!) {
    convertIssueToDiscussion(input:{issueId:$issueId, categoryId:$categoryId}) {
      discussion { number url }
    }
  }
')

DISC_NUM=$(echo "$RESP" | jq -r '.data.convertIssueToDiscussion.discussion.number')
DISC_URL=$(echo "$RESP" | jq -r '.data.convertIssueToDiscussion.discussion.url')

echo "Converted to discussion #$DISC_NUM"
echo "$DISC_URL"

