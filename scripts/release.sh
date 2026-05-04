#!/usr/bin/env bash
# One-shot: install → build → test → annotated tag v<semver> → push branch + tag → npm publish.
# Prereqs: pnpm, git, clean working tree; packages/cli version already bumped and committed.
# Post-push: .github/workflows/release.yml runs verify + creates a GitHub Release (npm is published here).
# npm auth: `npm login` or export NPM_TOKEN for non-interactive publish.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

die() { echo "release: $*" >&2; exit 1; }

command -v pnpm >/dev/null || die "pnpm not found"
command -v git >/dev/null || die "git not found"

if [ -n "$(git status --porcelain)" ]; then
  echo "release: uncommitted or untracked files:" >&2
  git status --short >&2
  die "working tree is not clean; commit or stash before releasing"
fi

VERSION="$(node -p "require('./packages/cli/package.json').version")"
TAG="v${VERSION}"

if ! printf '%s' "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+'; then
  die "packages/cli/package.json version must look like X.Y.Z (got $VERSION)"
fi

BRANCH="$(git branch --show-current)"
[ -n "$BRANCH" ] || die "detached HEAD; checkout your release branch first"

# Commit the tag should point at (annotated tag peel on remote, else lightweight ref).
REMOTE_PEEL="$(git ls-remote origin "refs/tags/${TAG}^{}" 2>/dev/null | awk '{print $1; exit}')"
if [ -z "$REMOTE_PEEL" ]; then
  REMOTE_PEEL="$(git ls-remote origin "refs/tags/${TAG}" 2>/dev/null | awk -v r="refs/tags/$TAG" '$2==r{print $1; exit}')"
fi

HEAD_SHA="$(git rev-parse HEAD)"

if [ -n "$REMOTE_PEEL" ]; then
  if [ "$HEAD_SHA" != "$REMOTE_PEEL" ]; then
    die "remote already has $TAG at $(git rev-parse --short "$REMOTE_PEEL" 2>/dev/null || echo "$REMOTE_PEEL"), but HEAD is $(git rev-parse --short HEAD). Bump packages/cli/package.json + CHANGELOG, or delete the remote tag only if it was never published."
  fi
  echo "release: $TAG already on origin at HEAD"
  if git rev-parse "$TAG" >/dev/null 2>&1; then
    if [ "$(git rev-parse "$TAG^{commit}")" != "$HEAD_SHA" ]; then
      git tag -d "$TAG"
      git tag -a "$TAG" -m "Release $TAG"
      echo "release: realigned local $TAG to HEAD (matches origin)"
    fi
  else
    git tag -a "$TAG" -m "Release $TAG"
    echo "release: created local $TAG at HEAD (matches origin)"
  fi
else
  if git rev-parse "$TAG" >/dev/null 2>&1; then
    if [ "$(git rev-parse "$TAG^{commit}")" != "$HEAD_SHA" ]; then
      git tag -d "$TAG"
      echo "release: removed stale local $TAG (not on origin); will recreate at HEAD"
    fi
  fi
  if ! git rev-parse "$TAG" >/dev/null 2>&1; then
    git tag -a "$TAG" -m "Release $TAG"
    echo "release: created annotated tag $TAG at HEAD"
  else
    echo "release: local tag $TAG already at HEAD"
  fi
fi

pnpm install --frozen-lockfile
pnpm -r build
pnpm -r test

echo "release: pushing $BRANCH and $TAG to origin (triggers verify + GitHub Release on tag)…"
git push origin "$BRANCH"
git push origin "refs/tags/$TAG"

echo "release: publishing harless@${VERSION} to npm…"
pnpm -F harless publish --access public --no-git-checks

echo "release: done. npm publish finished; GitHub Actions will still verify the tag and create the GitHub Release."
