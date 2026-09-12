# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo contains two independent projects that are **not** a JS workspace/monorepo — each has its own `package.json`/`yarn.lock` and must be installed and run from its own directory:

- `app/` — the Quran/prayer companion mobile app (Expo / React Native + Expo Router). This is where almost all active development happens.
- `backend/` — a stock, unmodified NestJS starter (only the default `AppController`/`AppService`/`AppModule` exist). Note: `backend` is tracked in git as a separate embedded repo (it has its own `.git`), not a submodule-configured one — be aware `git status`/`git add` at the repo root won't see changes made inside it.
- The root `package.json`/`yarn.lock` are stray (accidental `npm install` run at the repo root, holding a handful of Expo-related packages) — they are not a real workspace manifest and should generally be ignored/not relied upon.

## Commands

### Mobile app (`app/`)

```bash
cd app
yarn install            # install deps (yarn is the package manager of record — yarn.lock is committed)
yarn start               # start Metro/Expo dev server (scan QR with Expo Go, or connect a dev build)
yarn ios / yarn android / yarn web   # start with a platform preselected
yarn lint                 # expo lint (eslint-config-expo flat config, see app/eslint.config.js)
```

There is no test suite in `app/` (no `*.test.*`/`*.spec.*` files, no test script).

Useful upgrade/maintenance commands specific to this Expo project:
```bash
npx expo install --fix   # align all expo-* / RN packages to the versions expected by the installed Expo SDK
npx expo-doctor           # validate config schema, peer deps, and RN Directory metadata after any dependency change
```

### Backend (`backend/`)

```bash
cd backend
yarn install
yarn start:dev            # nest start --watch
yarn lint                  # eslint --fix over src/apps/libs/test
yarn test                  # jest unit tests
yarn test:e2e              # jest e2e tests (test/jest-e2e.json)
yarn test -- <pattern>     # run a single test file/suite by name pattern
```

## Architecture (`app/`)

### Routing: Expo Router with route groups doing double duty

Entry point is `expo-router/entry` (see `app/package.json` `main`). Routes live under `app/app/`. Route groups (`(tabs)`, `(home)`, `(quran)`, `(qibla)`, `(fig)`) are used for two different purposes at once, which is easy to misread:

- `(tabs)/_layout.tsx` defines the actual bottom-tab navigator (`Tabs` from `expo-router`) and is the only group whose screens (`index.tsx`, `quran.tsx`, `qibla.tsx`, `fig.tsx`) are the real, navigable top-level routes.
- The other groups — `(home)`, `(quran)`, `(qibla)`, `(fig)` — are mostly used as **shared code folders** (holding `components/` and `hooks/` subfolders) that the corresponding tab screen imports from, e.g. `app/app/(tabs)/index.tsx` pulls its hooks/components from `../(home)/hooks/*` and `../(home)/components/*`. `(quran)/_layout.tsx` additionally declares a nested `Stack` with `surah/[id]` as its only registered screen (the surah detail page).
- Some files sitting directly in a group folder (e.g. `(quran)/quran-screen.tsx`) are leftover/superseded screens not wired into any navigator's `Stack.Screen`/`Tabs.Screen` list — before assuming a file is "the" screen for a route, check the nearest `_layout.tsx` to see what's actually registered.
- `app/navigation/StackNavigator.tsx` is a dead stub (`return null`) left over from before the Expo Router migration; it is not imported anywhere.

### Shared UI components live in two places

Both `app/components/` and `app/shared/` hold reusable, non-route UI components — check both before adding a new one or assuming a component doesn't exist yet. `components/icons/*` are hand-written SVG icon components built directly from `react-native-svg` primitives (`Svg`, `Path`, ...), not `.svg` file imports, even though Metro is separately configured (`app/metro.config.js`) via `react-native-svg-transformer` to allow importing raw `.svg` files as components.

### Path alias

`@/*` resolves to the `app/` directory root (configured in `app/tsconfig.json`), and is used pervasively instead of relative imports for anything outside a route's own group folder.

### Global providers (wired in `app/app/_layout.tsx`)

The root layout wraps the entire `Stack` in, from outermost to innermost: `ThemeProvider` (light/dark, from `expo-router`'s bundled theming, not `@react-navigation/native` — see below) → `AudioPlayerProvider` (`app/context/AudioContext.tsx`) → `QueryClientProvider` (TanStack Query, client instance in `app/utils/queryClient.ts`). Because `AudioPlayerProvider` wraps the whole app, audio playback state/controls persist across tab/screen navigation.

### `expo-router` vs `@react-navigation/*` — do not import react-navigation packages directly

As of SDK 56+, `expo-router` bundles its own fork of React Navigation internals and Metro will **throw a build error** for any app-source (non-`node_modules`) import from `@react-navigation/*` other than a type-only import (Babel strips `import type` before it reaches Metro's resolver, so those are safe). Concretely:
- Get `ThemeProvider`/`DarkTheme`/`DefaultTheme`/`Stack` etc. from `expo-router` itself, not `@react-navigation/native`.
- Never import a runtime value (e.g. `PlatformPressable`) from `@react-navigation/elements` or any other `@react-navigation/*` package in app code — use React Native's own `Pressable`/equivalents instead.
- `import type { X } from '@react-navigation/...'` is fine since it's erased at compile time.

### Data/API layer — three separate, un-unified API integrations

There is no single API client; each domain talks to a different backend directly:
- **Chapters list**: `app/utils/apiClient.ts` (axios instance, `baseURL: https://api.quran.com/api/v4`) used by `app/services/quranApi.ts#getChapters`.
- **Verse text/translation/word timings**: `app/services/quranApi.ts#getVerses` calls `api.alquran.cloud` and `api.quran.com` directly via raw `fetch()` (bypassing the axios client above).
- **Prayer times**: `app/services/calenderApi.ts` calls `api.aladhan.com` directly via axios, with **hardcoded latitude/longitude** (not yet wired to `expo-location`/device location) — prayer times will be wrong for any user not near those coordinates until this is connected to real geolocation.

### Audio playback

`app/context/AudioContext.tsx` wraps `expo-audio`'s `useAudioPlayer` in an `AudioPlayerProvider`/`useAudioPlayerContext()` pair exposing play/pause/next/previous/stop for whichever surah is active. Actual playable audio URLs are meant to come from `app/services/audioService.ts`, which points at a Cloudflare R2 bucket — `R2_BUCKET_URL` there is still a placeholder, so audio streaming is not yet functional end-to-end. `app/scripts/generateAudioMapping.js` is a standalone Node/Wrangler helper for uploading audio files to that R2 bucket; it's not part of the Expo app bundle.

There's also an unused/legacy `react-native-sound` dependency in `app/package.json` alongside `expo-audio`/`expo-av` — nothing in the app imports it, and `expo-av` itself is flagged by `expo-doctor`'s React Native Directory check as unmaintained (in favor of `expo-audio`).

### Theming

`app/constants/theme.ts` exports a `Colors` object keyed by `light`/`dark`; nearly every screen reads `Colors[colorScheme ?? 'light']` (via `useColorScheme()`) rather than using a theme context/hook.

### Planned direction (not yet implemented)

`app/app/(quran)/note.txt` sketches a target feature-based folder structure (`features/quran`, `features/audio`, etc.) that the codebase has not been refactored into yet — treat it as a design note about where things may be headed, not as the current structure.
