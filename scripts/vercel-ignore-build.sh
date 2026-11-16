#!/usr/bin/env bash
# Preview convention: only main and preview/* branches build previews.
# Vercel: 0 skips, 1 builds. The branch rule runs first so a feature branch's first push
# (no VERCEL_GIT_PREVIOUS_SHA yet) is skipped too; production with missing history always builds.
set -u
if [ "${VERCEL_ENV:-}" = preview ]; then
  case "${VERCEL_GIT_COMMIT_REF:-}" in main|preview/*) ;; *) exit 0 ;; esac
fi
previous=${VERCEL_GIT_PREVIOUS_SHA:-}
[ -n "$previous" ] || exit 1
changed=$(git diff --name-only "$previous" "${VERCEL_GIT_COMMIT_SHA:-HEAD}") || exit 1
[ -n "$changed" ] || exit 1
while IFS= read -r path; do
  case "$path" in
    docs/*|*.md|reports/*|data/snapshots/*|data/reports/*) ;;
    *) exit 1 ;;
  esac
done <<< "$changed"
exit 0
