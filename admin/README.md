# Content Admin

A small Next.js app for managing the mobile app's reciter and scholar content
(`content/reciters.json` and `content/scholars.json` at the repo root) without
needing an app rebuild or any paid backend.

## How it works

- The mobile app fetches `content/reciters.json` / `content/scholars.json`
  live from this GitHub repo via jsDelivr's free CDN.
- This admin app edits those same files by committing directly to the repo
  through the GitHub REST API.
- Saving a change here means: the next time the mobile app fetches that data
  (a few seconds to a couple of minutes later, once jsDelivr's cache updates),
  it just appears — no app rebuild, no app store review.

There is no database and no server to pay for — this is a local tool you run
on your own machine when you want to update content.

## Setup

1. **Generate a GitHub Personal Access Token**
   - Go to https://github.com/settings/tokens → "Generate new token" (classic
     is simplest) → give it the **repo** scope (read/write access to repo
     contents) → generate, and copy the token.
2. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and paste your token into `GITHUB_TOKEN`.
   `GITHUB_OWNER`/`GITHUB_REPO`/`GITHUB_BRANCH` are already filled in for
   this repo — only change them if the repo is renamed/moved.
3. **Install and run**
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000.

`.env.local` is gitignored — your token never gets committed.

## Using it

- **Reciters** → add a reciter (name, country, optional style/avatar URL),
  then open it to add surahs one at a time: pick the surah from the dropdown,
  paste its audio URL, and save. Each save commits straight to
  `content/reciters.json`.
- **Scholars** → same idea, simpler (no surah list).
- Deleting a reciter/scholar, or removing a single surah from a reciter, also
  commits immediately — there's no separate "publish" step.

## Notes

- Every save is a real git commit to the `master` branch (visible in the
  repo's commit history), so changes are always auditable/revertable via git.
- This app is meant to be run locally, not deployed publicly — it holds no
  authentication of its own, and a public deployment would need one added
  before anyone could put a link to it in front of the internet.
