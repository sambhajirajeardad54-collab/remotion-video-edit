// Sam Xplains visual identity, shared by every component.
// Palette from the Sam Xplains storyboard: black / dark navy backgrounds,
// white text, yellow for keywords and accents, red as a warning accent.
// (TitleScene / DocumentaryScene keep their own original look.)
export const theme = {
  background:
    "radial-gradient(ellipse at 50% 20%, #13264a 0%, #0a1428 45%, #04070f 100%)",
  backgroundDeep: "#04070f",
  navy: "#0a1428",
  card: "rgba(255,255,255,0.06)",
  cardSolid: "#0d1b36",
  cardBorder: "rgba(255,255,255,0.14)",
  accent: "#facc15",
  highlight: "#facc15",
  red: "#ef4444",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.75)",
  textFaint: "rgba(255,255,255,0.5)",
  // Heavy outline + shadow keeps text readable over footage.
  textOutline:
    "0 0 4px rgba(0,0,0,0.95), 0 6px 18px rgba(0,0,0,0.8), 3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000",
  // Mukta covers Marathi (Devanagari) and English. Loaded in fonts.ts.
  fontFamily: "Mukta, Helvetica, Arial, sans-serif",
} as const;
