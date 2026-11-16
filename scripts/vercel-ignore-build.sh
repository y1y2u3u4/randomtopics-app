#!/usr/bin/env bash
# Preview convention: only main and preview/* branches build previews.
# Vercel: 0 skips, 1 builds. Missing history always builds, including first deploy.
set -u
previous=${VERCEL_GIT_PREVIOUS_SHA:-}
[ -n "$previous" ] || exit 1
if [ "${VERCEL_ENV:-}" = preview ]; then
  case "${VERCEL_GIT_COMMIT_REF:-}" in main|preview/*) ;; *) exit 0 ;; esac
fi
changed=$(git diff --name-only "$previous" "${VERCEL_GIT_COMMIT_SHA:-HEAD}") || exit 1
[ -n "$changed" ] || exit 1
while IFS= read -r path; do
  case "$path" in
    docs/*|*.md|reports/*|data/snapshots/*|data/reports/*) ;;
    *) exit 1 ;;
  esac
done <<< "$changed"
exit 0
