# Architecture & milestone plan

## Starting point

The repository's `main` branch holds the Sam Xplains Remotion production system (15 compositions, presenter workflow, audio, fonts, Python/shell scripts). It was moved **byte-for-byte** into `apps/video` with `git mv` (same blob hashes for all files; history preserved). Tooling that Claude Code sessions look for at the repo root stays there: `.agents/`, `.claude/skills`, `skills-lock.json`, `.prettierrc`.

## Two independent dependency trees

| | Platform (`apps/web`, `apps/mobile`, `packages/*`) | Video studio (`apps/video`) |
| --- | --- | --- |
| Install | `npm install` at the root (npm workspaces) | `npm ci` inside `apps/video` |
| Lockfile | `/package-lock.json` | `apps/video/package-lock.json` (unchanged from `main`) |
| React | 19.3.0 (pinned by Expo SDK 58) | 19.3.1 (unchanged) |

`apps/video` is deliberately **not** an npm workspace: in a shared tree, hoisted packages such as `remotion` could resolve the platform's React and break hooks. The Android bundler (`apps/mobile/metro.config.js`) also blocks `apps/video`, and root `.gitignore` rules are anchored so they never affect the video project's own `.gitignore`.

Video scripts (`render:final`, `make-cutout`, `transcribe`, …) use paths relative to the project folder, so they work unchanged when run from `apps/video`.

## Platform workspaces

npm workspaces (`apps/web`, `apps/mobile`, `packages/*`). Expo supports npm workspaces with no extra Metro setup beyond excluding `apps/video`. All platform workspaces share one React copy (19.3.0), which avoids "invalid hook call" errors.

Shared packages ship **TypeScript source** (no build step). Next.js compiles them via `transpilePackages`; Metro compiles them natively.

```
packages/design   tokens only (no React) ──┐
packages/core     data + logic (no React) ─┼──► apps/web    (Next.js, DOM components, CSS)
packages/core/react  provider + hooks ─────┘──► apps/mobile (Expo, RN components, StyleSheet)
```

## What is shared, and what isn't

| Layer | Shared? | Where |
| --- | --- | --- |
| Colours, spacing, type scale, radii | ✅ | `@edu/design` (web gets them as CSS variables via `toCssVariables()`) |
| Domain types, sample content | ✅ | `@edu/core` `types.ts`, `data/*` |
| Marathi / English UI text | ✅ | `@edu/core` `i18n/messages.ts` — TypeScript enforces identical keys |
| Scoring, progress, streaks, dashboard selectors, state reducer | ✅ | `@edu/core` `logic/*` |
| State provider (with pluggable storage) & test-taking engine | ✅ | `@edu/core/react` |
| Visual components | ❌ per platform | `apps/web/src/components`, `apps/mobile/src/ui.tsx` |

Components are deliberately *not* shared through react-native-web: native-feeling Android UI and a lean, SEO-friendly website matter more than saving some JSX, and the behaviour that must not diverge (scoring, timers, progress, translations) is already shared.

## Bilingual content

- UI strings: `messages.en` / `messages.mr`. The Marathi object is typed against the English one, so a missing key fails `tsc`; a unit test also checks placeholders match.
- Content: every user-facing field is a `Localized` `{ en, mr }` object. A unit test walks all data and fails on any empty translation.
- Default language is Marathi; choice is persisted (web: cookie + localStorage, so the server renders the right `<html lang>`; Android: AsyncStorage).
- Typeface: Mukta on the web (covers Devanagari and Latin); Android system fonts handle Devanagari natively.
- Dates/times are formatted by hand (`formatDate`, `formatTime`) because `Intl` output differs between Node, browsers and Hermes.

## Persistence (until the backend exists)

`StudentState` (language, target exam, completed lessons, test attempts, active days) lives on the device behind a two-method `KeyValueStorage` interface. `parseStoredState` validates everything it reads, so corrupt or old data falls back to defaults instead of crashing. When the database arrives, a sync adapter can implement the same interface.

## Testing

| Layer | How |
| --- | --- |
| Shared logic & content integrity | Vitest, `packages/core/test` (21 tests) |
| Lint | ESLint 9 per workspace: `eslint-config-next`, `eslint-config-expo`, `typescript-eslint` + React Hooks rules (the video studio keeps its own ESLint 10 config) |
| Types | `tsc` in every workspace |
| Web | `next build` + Playwright smoke test at phone and desktop sizes (`apps/web/e2e`) |
| Android | `expo export --platform android` (Metro + Hermes bytecode) + the same flows driven through react-native-web (`apps/mobile/e2e`) |

| Video studio | Separate CI job: guard that flags any change under `apps/video`, isolated install, React 19.3.1 check, `npm run lint` (eslint + tsc), all 15 compositions present, a still of each, a 3 s MpscHistory render with audio |

All of it runs in GitHub Actions on every push.

## Next milestones (suggested)

1. Backend + database (e.g. Postgres via Supabase or a Next.js API), phone-number OTP login, sync of `StudentState`.
2. Content admin for the institute (courses, tests, materials, announcements) replacing `packages/core/src/data`.
3. Video lessons and PDF downloads (with storage/CDN).
4. Payments (Razorpay/UPI) and enrolment.
5. Push notifications for scheduled tests; Play Store release via EAS.
