// End-to-end smoke test for the web app.
// Usage: start the app (npm run build && npm start), then: BASE_URL=http://localhost:3000 npm run e2e
// Optional: SCREENSHOT_DIR=../../docs/screenshots to save screenshots.
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const SHOTS = process.env.SCREENSHOT_DIR;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

let failures = 0;
const check = (cond, msg) => {
  if (cond) console.log(`  ✓ ${msg}`);
  else {
    failures += 1;
    console.error(`  ✗ ${msg}`);
  }
};
const shot = async (page, name) => SHOTS && page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: true });

const browser = await chromium.launch();

async function run(viewport, label) {
  console.log(`\n[${label}] ${viewport.width}×${viewport.height}`);
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));

  // 1. Dashboard renders in Marathi by default.
  await page.goto(BASE);
  await page.getByTestId('dashboard').waitFor();
  check(await page.locator('html[lang="mr"]').count(), 'default language is Marathi');
  check(await page.getByText('अभ्यास पुढे सुरू ठेवा').isVisible(), 'Marathi dashboard heading visible');
  check(await page.getByTestId('continue-card').isVisible(), '"Up next" lesson card visible');
  await shot(page, `${label}-dashboard-mr`);

  // 2. Language toggle switches to English and persists across reloads.
  await page.getByTestId('lang-toggle').click();
  await page.getByText('Continue learning').waitFor();
  check(true, 'switched to English');
  await page.reload();
  await page.getByText('Continue learning').waitFor();
  check(await page.locator('html[lang="en"]').count(), 'English persists after reload (cookie + storage)');
  await shot(page, `${label}-dashboard-en`);

  // 3. Every tab loads.
  for (const [href, text] of [
    ['/courses', 'My courses'],
    ['/tests', 'Practice sets'],
    ['/material', 'Notes, previous papers and formula sheets'],
    ['/profile', 'Target exam'],
  ]) {
    await page.goto(BASE + href);
    await page.getByText(text).first().waitFor();
    check(true, `${href} renders`);
    await shot(page, `${label}-${href.slice(1)}`);
  }

  // 4. Mark a lesson done in a course and see it persist.
  await page.goto(`${BASE}/courses/reasoning-arithmetic`);
  const toggle = page.getByTestId('lesson-toggle-ra-2');
  await toggle.click();
  await page.waitForFunction(() => document.querySelector('[data-testid="lesson-toggle-ra-2"]')?.getAttribute('aria-pressed') === 'true');
  await page.reload();
  await page.getByTestId('lesson-toggle-ra-2').waitFor();
  check((await page.getByTestId('lesson-toggle-ra-2').getAttribute('aria-pressed')) === 'true', 'lesson completion persists');
  await shot(page, `${label}-course-detail`);

  // 5. Take a full test: answer every question correctly except the last, which is skipped.
  await page.goto(`${BASE}/tests/dmer-practice-1`);
  await page.getByTestId('start-test').click();
  await page.getByTestId('test-runner').waitFor();
  await page.waitForTimeout(2200);
  const clock = await page.locator('.timer').innerText();
  check(/05:5\d/.test(clock), `timer counts down (${clock.trim()})`);
  const answers = [1, 2, 1, 3, 1]; // correct options for DMER Q1–Q5; Q6 left blank
  for (const a of answers) {
    await page.getByTestId(`option-${a}`).click();
    await page.getByTestId('next-question').click();
  }
  await shot(page, `${label}-test-runner`);
  await page.getByTestId('submit-test').click();
  await page.getByTestId('confirm-submit').click(); // 1 unanswered → confirmation dialog
  await page.getByTestId('test-result').waitFor();
  const resultText = await page.getByTestId('test-result').innerText();
  check(resultText.includes('5 / 6'), 'score is 5 / 6');
  check(resultText.includes('83%'), 'percentage is 83%');
  await shot(page, `${label}-test-result`);

  // 6. Dashboard reflects the attempt (switch target exam to DMER to see it in context).
  await page.goto(BASE);
  await page.getByTestId('dashboard').waitFor();
  await page.getByRole('radio', { name: 'DMER' }).click();
  check(await page.getByText('DMER Health Sciences — Set 1').first().isVisible(), 'recent result shows on dashboard');

  check(errors.length === 0, `no console/page errors${errors.length ? `: ${errors.join(' | ')}` : ''}`);

  // 7. Brand + sign-in / registration previews (design-only: nothing is submitted).
  await page.goto(`${BASE}/login`);
  await page.getByTestId('auth-preview-note').waitFor();
  check(await page.locator('.auth-brand .tagline').isVisible() && (await page.locator('.auth-brand .tagline').innerText()) === 'Your goal, our guidance!', 'English tagline shown');
  await page.getByTestId('login-mobile').fill('12345');
  check(await page.getByText('Enter a valid 10-digit Indian mobile number').isVisible(), 'invalid mobile number flagged');
  await page.getByTestId('login-mobile').fill('98765 43210');
  check((await page.getByText('Enter a valid 10-digit Indian mobile number').count()) === 0, 'valid mobile number accepted');
  check(await page.getByRole('button', { name: /Send OTP/ }).isDisabled(), 'sign-in button is disabled (preview)');
  await page.getByRole('link', { name: 'Create an account' }).click();
  await page.getByTestId('register-mobile').waitFor();
  check(await page.getByRole('button', { name: /Create account/ }).isDisabled(), 'registration button is disabled (preview)');
  check(!(await page.evaluate(() => JSON.stringify(localStorage)).then((s) => s.includes('98765'))), 'typed details are not stored');
  await shot(page, `${label}-register`);

  // 8. Unknown routes give a friendly 404.
  const res = await page.goto(`${BASE}/does-not-exist`);
  check(res?.status() === 404, '404 for unknown route');

  await context.close();
}

await run({ width: 390, height: 844 }, 'phone');
await run({ width: 1366, height: 900 }, 'desktop');
await browser.close();

console.log(failures === 0 ? '\nAll smoke checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
