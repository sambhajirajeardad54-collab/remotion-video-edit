import type { Locale, Localized } from '../types';

export const pick = (value: Localized, locale: Locale): string => value[locale];

const MONTHS: Record<Locale, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  mr: ['जाने.', 'फेब्रु.', 'मार्च', 'एप्रि.', 'मे', 'जून', 'जुलै', 'ऑग.', 'सप्टें.', 'ऑक्टो.', 'नोव्हें.', 'डिसें.'],
};

const WEEKDAYS: Record<Locale, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  mr: ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
};

/**
 * Deterministic date formatting (no reliance on Intl, which differs between
 * Node, browsers and Hermes on Android).
 */
export function formatDate(date: Date, locale: Locale, withWeekday = false): string {
  const d = `${date.getDate()} ${MONTHS[locale][date.getMonth()]} ${date.getFullYear()}`;
  return withWeekday ? `${WEEKDAYS[locale][date.getDay()]}, ${d}` : d;
}

export function formatShortDate(date: Date, locale: Locale): string {
  return `${WEEKDAYS[locale][date.getDay()]}, ${date.getDate()} ${MONTHS[locale][date.getMonth()]}`;
}

/** 24h "HH:MM" → "10:00 AM" / "सकाळी 10:00". */
export function formatTime(hhmm: string, locale: Locale): string {
  const [hStr = '0', mStr = '00'] = hhmm.split(':');
  const h = Number(hStr);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  if (locale === 'en') return `${h12}:${mStr} ${h < 12 ? 'AM' : 'PM'}`;
  const part = h < 12 ? 'सकाळी' : h < 17 ? 'दुपारी' : h < 20 ? 'सायं.' : 'रात्री';
  return `${part} ${h12}:${mStr}`;
}

/** Indian digit grouping: 214000 → "2,14,000". */
export function formatIndianNumber(n: number): string {
  const [int = '0', dec] = Math.round(n).toString().split('.');
  if (int.length <= 3) return dec ? `${int}.${dec}` : int;
  const last3 = int.slice(-3);
  const rest = int.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${rest},${last3}`;
}

export const formatInr = (n: number): string => `₹${formatIndianNumber(n)}`;

/** Seconds → "mm:ss" (or "h:mm:ss"). */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (v: number) => v.toString().padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

/** Local calendar date as YYYY-MM-DD. */
export function toDayKey(date: Date): string {
  const pad = (v: number) => v.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parse "YYYY-MM-DD" as a local calendar date (new Date("YYYY-MM-DD") is UTC and can shift a day). */
export function parseDayKey(key: string): Date {
  const [y = 1970, m = 1, d = 1] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export type DayPart = 'morning' | 'afternoon' | 'evening';
export function dayPart(date: Date): DayPart {
  const h = date.getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

/** Indian mobile number: 10 digits starting 6–9, optional +91/0 prefix and spaces. */
export function normalizeIndianMobile(input: string): string | null {
  const digits = input.replace(/[\s-]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}
