// Sam Xplains visual identity, shared by every component.
// Matches the existing TitleScene / DocumentaryScene look.
export const theme = {
  background: "linear-gradient(180deg, #0f0c29, #302b63, #24243e)",
  backgroundDeep: "#0f0c29",
  card: "rgba(255,255,255,0.07)",
  cardBorder: "rgba(255,255,255,0.14)",
  accent: "#38bdf8",
  highlight: "#facc15",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.72)",
  textFaint: "rgba(255,255,255,0.5)",
  // Mukta covers Marathi (Devanagari) and English. Loaded in fonts.ts.
  fontFamily: "Mukta, Helvetica, Arial, sans-serif",
} as const;
