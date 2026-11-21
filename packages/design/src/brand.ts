/**
 * Lakshya Academy brand mark: a gold target with an arrow in the bullseye
 * ("lakshya" = target). Geometry lives here once and is rendered by
 *  - the asset generator (app icon, adaptive icon, splash, favicons),
 *  - the web logo (inline SVG) and the mobile logo (react-native-svg).
 * Coordinates use a 100 × 100 box with the target centred at (50, 50).
 */

export const brandColors = {
  navy: '#0A1A3F',
  navyLight: '#1B3A7A',
  gold: '#C9A227',
  goldLight: '#EED27A',
  goldDark: '#9C7A10',
} as const;

type Pt = readonly [number, number];
const R2 = Math.SQRT1_2;
/** Unit vector from the centre towards the arrow's tail (upper right). */
const D: Pt = [R2, -R2];
/** Perpendicular to D. */
const P: Pt = [R2, R2];
const at = (o: Pt, ...terms: [number, Pt][]): Pt =>
  terms.reduce<Pt>((acc, [k, v]) => [acc[0] + k * v[0], acc[1] + k * v[1]], o);
const round = (p: Pt): Pt => [Math.round(p[0] * 100) / 100, Math.round(p[1] * 100) / 100];

const TIP: Pt = [50, 50];
const TAIL: Pt = at(TIP, [47, D]);

export const markGeometry = {
  rings: [
    { r: 40, width: 6.5 },
    { r: 27.5, width: 6 },
  ],
  bullseye: { r: 13, innerR: 4.2 },
  shaft: { from: round(at(TIP, [10, D])), to: round(at(TAIL, [-3, D])), width: 4.6, outline: 9 },
  head: [TIP, at(TIP, [13, D], [6.4, P]), at(TIP, [13, D], [-6.4, P])].map(round),
  feathers: [
    [at(TAIL, [-14, D]), at(TAIL, [-6, D], [6.8, P]), at(TAIL, [2, D], [6.8, P]), at(TAIL, [-4, D])].map(round),
    [at(TAIL, [-14, D]), at(TAIL, [-6, D], [-6.8, P]), at(TAIL, [2, D], [-6.8, P]), at(TAIL, [-4, D])].map(round),
  ],
} as const;

export interface MarkSvgOptions {
  /** Pixel size of the square SVG. */
  size?: number;
  /** Fill behind the mark: navy square, navy rounded tile, or transparent. */
  background?: 'navy' | 'tile' | 'none';
  /** Single colour (Android monochrome/themed icons). */
  monochrome?: string;
  /** Fraction of the canvas the mark occupies (adaptive icons need ~0.6). */
  scale?: number;
  /** Prefix for gradient/mask ids; must be unique when several marks share a page. */
  idPrefix?: string;
}

const pts = (list: readonly Pt[]) => list.map((p) => p.join(',')).join(' ');

/** Standalone SVG markup for the mark. */
export function brandMarkSvg({ size = 512, background = 'navy', monochrome, scale = 0.86, idPrefix = 'lakshya' }: MarkSvgOptions = {}): string {
  const g = markGeometry;
  const id = (name: string) => `${idPrefix}${name}`;
  const gold = monochrome ?? `url(#${id('Gold')})`;
  const t = 50 - 50 * scale;
  const bg =
    background === 'navy'
      ? `<rect width="100" height="100" fill="url(#${id('Navy')})"/>`
      : background === 'tile'
        ? `<rect width="100" height="100" rx="22" fill="url(#${id('Navy')})"/>`
        : '';
  const defs = monochrome
    ? ''
    : `<defs>
  <linearGradient id="${id('Gold')}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${brandColors.goldLight}"/>
    <stop offset="0.5" stop-color="${brandColors.gold}"/>
    <stop offset="1" stop-color="${brandColors.goldDark}"/>
  </linearGradient>
  <radialGradient id="${id('Navy')}" cx="0.5" cy="0.42" r="0.75">
    <stop offset="0" stop-color="${brandColors.navyLight}"/>
    <stop offset="1" stop-color="${brandColors.navy}"/>
  </radialGradient>
</defs>`;
  const rings = g.rings
    .map((r) => `<circle cx="50" cy="50" r="${r.r}" fill="none" stroke="${gold}" stroke-width="${r.width}"/>`)
    .join('');
  const line = (stroke: string, width: number) =>
    `<line x1="${g.shaft.from[0]}" y1="${g.shaft.from[1]}" x2="${g.shaft.to[0]}" y2="${g.shaft.to[1]}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
  const shapes = (fill: string, grow = 0) =>
    [...g.feathers, g.head]
      .map((f) => `<polygon points="${pts(f)}" fill="${fill}"${grow ? ` stroke="${fill}" stroke-width="${grow}" stroke-linejoin="round"` : ''}/>`)
      .join('');
  // Transparent gaps (a mask, not painted navy) so the mark works on any background
  // and in single-colour Android themed icons.
  const mask = `<mask id="${id('Gap')}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><circle cx="50" cy="50" r="${g.bullseye.innerR}" fill="#000"/>${line('#000', g.shaft.outline)}${shapes('#000', 3)}</mask>`;
  const target = `<g mask="url(#${id('Gap')})">${rings}<circle cx="50" cy="50" r="${g.bullseye.r}" fill="${gold}"/></g>`;
  const arrow = line(gold, g.shaft.width) + shapes(gold);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">${defs}${bg}<g transform="translate(${t} ${t}) scale(${scale})">${mask}${target}${arrow}</g></svg>`;
}
