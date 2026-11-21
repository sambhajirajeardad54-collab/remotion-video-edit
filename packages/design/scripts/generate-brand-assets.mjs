// Regenerates every Lakshya Academy icon/splash asset from packages/design/src/brand.ts.
// Usage (from the repo root; needs Playwright + Chromium):
//   node --no-warnings packages/design/scripts/generate-brand-assets.mjs
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const { brandMarkSvg } = await import(path.join(here, '../src/brand.ts'));

const mobile = path.join(root, 'apps/mobile/assets/images');
const web = path.join(root, 'apps/web/app');
mkdirSync(mobile, { recursive: true });

// Android adaptive icons: the launcher crops to a circle/squircle inside the
// central 66% "safe zone", so the foreground mark is drawn at ~58% of the canvas.
const pngs = [
  { file: path.join(mobile, 'icon.png'), size: 1024, opts: { background: 'navy', scale: 0.8 } },
  { file: path.join(mobile, 'adaptive-icon.png'), size: 1024, opts: { background: 'none', scale: 0.58 } },
  { file: path.join(mobile, 'adaptive-monochrome.png'), size: 1024, opts: { background: 'none', scale: 0.58, monochrome: '#FFFFFF' } },
  { file: path.join(mobile, 'splash-icon.png'), size: 1024, opts: { background: 'none', scale: 0.9 } },
  { file: path.join(mobile, 'favicon.png'), size: 48, opts: { background: 'tile', scale: 0.86 } },
  { file: path.join(web, 'apple-icon.png'), size: 180, opts: { background: 'navy', scale: 0.8 } },
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const { file, size, opts } of pngs) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<html><body style="margin:0;background:transparent">${brandMarkSvg({ size, ...opts })}</body></html>`);
  await page.locator('svg').screenshot({ path: file, omitBackground: true });
  console.log('wrote', path.relative(root, file));
}
await browser.close();

writeFileSync(path.join(web, 'icon.svg'), brandMarkSvg({ size: 64, background: 'tile', scale: 0.86 }) + '\n');
console.log('wrote', path.relative(root, path.join(web, 'icon.svg')));
