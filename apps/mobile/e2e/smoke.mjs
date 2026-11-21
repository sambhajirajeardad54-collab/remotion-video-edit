// Drives the Expo app's web build at phone size to verify navigation, i18n, the test engine and persistence.
// Usage: npm run export:web && node e2e/serve.mjs dist/web 8090 & BASE_URL=http://localhost:8090 node e2e/smoke.mjs
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE_URL ?? 'http://localhost:8090';
const SHOTS = process.env.SCREENSHOT_DIR;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

let failures = 0;
const check = (cond, msg) => {
  console.log(`  ${cond ? '✓' : '✗'} ${msg}`);
  if (!cond) failures += 1;
};
const shot = async (page, name) => SHOTS && page.screenshot({ path: path.join(SHOTS, `mobile-${name}.png`) });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto(BASE);
await page.getByText('अभ्यास पुढे सुरू ठेवा').waitFor();
check(true, 'dashboard renders in Marathi');
await shot(page, 'dashboard-mr');

await page.getByTestId('lang-toggle').first().click();
await page.getByText('Continue learning').waitFor();
check(true, 'language toggle → English');
await shot(page, 'dashboard-en');

await page.reload();
await page.getByText('Continue learning').waitFor();
check(true, 'English persists after reload');

for (const [tab, text] of [
  ['Courses', 'My courses'],
  ['Tests', 'Practice sets'],
  ['Material', 'Notes, previous papers and formula sheets'],
  ['Profile', 'Target exam'],
]) {
  await page.getByRole('tab', { name: tab }).click();
  await page.getByText(text).first().waitFor();
  check(true, `${tab} tab renders`);
  await shot(page, tab.toLowerCase());
}

// Course detail + lesson toggle
await page.goto(`${BASE}/course/reasoning-arithmetic`);
await page.getByTestId('lesson-toggle-ra-2').waitFor();
await page.getByTestId('lesson-toggle-ra-2').click();
await page.waitForFunction(() => document.querySelector('[data-testid="lesson-toggle-ra-2"]')?.getAttribute('aria-checked') === 'true');
check(true, 'lesson marked done');
await shot(page, 'course-detail');

// Full test flow
await page.goto(`${BASE}/test/dmer-practice-1`);
await page.getByTestId('start-test').click();
for (const a of [1, 2, 1, 3, 1]) {
  await page.getByTestId(`option-${a}`).click();
  await page.getByTestId('next-question').click();
}
await shot(page, 'test-runner');
await page.getByTestId('submit-test').click();
await page.getByTestId('confirm-submit').click();
await page.getByTestId('result-score').waitFor();
check((await page.getByTestId('result-score').innerText()).includes('5 / 6'), 'score 5 / 6');
await shot(page, 'test-result');

await page.goto(BASE);
await page.getByText('Continue learning').waitFor();
check(await page.getByText('Tests taken').isVisible(), 'dashboard stats visible after test');

check(errors.length === 0, `no page errors${errors.length ? ': ' + errors.join(' | ') : ''}`);
await browser.close();
console.log(failures === 0 ? '\nAll mobile smoke checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures ? 1 : 0);
