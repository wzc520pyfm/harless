#!/usr/bin/env bash
# One-shot: install → build → test → annotated tag v<semver> → push branch + tag.
# Prereqs: pnpm, git, clean working tree; packages/cli version already bumped and committed.
# Post-push: .github/workflows/release.yml runs verify + creates a GitHub Release.
# npm publish runs in CI only if secret NPM_TOKEN is set; otherwise publish locally, e.g.:
#   pnpm -F harless publish --access public --no-git-checks
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

die() { echo "release: $*" >&2; exit 1; }

command -v pnpm >/dev/null || die "pnpm not found"
command -v git >/dev/null || die "git not found"

if [ -n "$(git status --porcelain)" ]; then
  die "working tree is not clean; commit or stash before releasing"
fi

VERSION="$(node -p "require('./packages/cli/package.json').version")"
TAG="v${VERSION}"

if ! printf '%s' "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+'; then
  die "packages/cli/package.json version must look like X.Y.Z (got $VERSION)"
fi

BRANCH="$(git branch --show-current)"
[ -n "$BRANCH" ] || die "detached HEAD; checkout your release branch first"

if git rev-parse "$TAG" >/dev/null 2>&1; then
  if [ "$(git rev-parse "$TAG^{commit}")" != "$(git rev-parse HEAD)" ]; then
    die "local tag $TAG exists but does not point at HEAD"
  fi
  echo "release: local tag $TAG already at HEAD"
else
  git tag -a "$TAG" -m "Release $TAG"
  echo "release: created annotated tag $TAG"
fi

if git ls-remote --tags origin "refs/tags/$TAG" | grep -q .; then
  die "remote already has $TAG — bump packages/cli/package.json and CHANGELOG, then retry"
fi

pnpm install --frozen-lockfile
pnpm -r build
pnpm -r test

echo "release: pushing $BRANCH and $TAG to origin (triggers verify + GitHub Release on tag)…"
git push origin "$BRANCH"
git push origin "refs/tags/$TAG"

echo "release: done. Confirm the release workflow on GitHub Actions, then publish to npm locally if needed."
