# Architecture & milestone plan

## Starting point

The repository previously contained a single Remotion video project at the root (one commit). It has been moved, unchanged, to `apps/video` so the repo can grow into a monorepo without losing it.

## Monorepo

npm workspaces (`apps/*`, `packages/*`). npm was kept because the repo already used it and Expo supports npm workspaces with zero Metro configuration (SDK 52+).

**One React version everywhere.** Expo SDK 58 pins `react@19.3.0`, so the web app, the video app and the shared packages use exactly that version. `npm ls react` shows a single copy, which avoids "invalid hook call" errors from duplicate Reacts.

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
| Types | `tsc` in every workspace |
| Web | `next build` + Playwright smoke test at phone and desktop sizes (`apps/web/e2e`) |
| Android | `expo export --platform android` (Metro + Hermes bytecode) + the same flows driven through react-native-web (`apps/mobile/e2e`) |

All of it runs in GitHub Actions on every push.

## Next milestones (suggested)

1. Backend + database (e.g. Postgres via Supabase or a Next.js API), phone-number OTP login, sync of `StudentState`.
2. Content admin for the institute (courses, tests, materials, announcements) replacing `packages/core/src/data`.
3. Video lessons and PDF downloads (with storage/CDN).
4. Payments (Razorpay/UPI) and enrolment.
5. Push notifications for scheduled tests; Play Store release via EAS.
