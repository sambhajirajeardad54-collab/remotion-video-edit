import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Mukta (SIL Open Font License 1.1, see public/fonts/mukta/OFL-LICENSE.txt).
// Each weight is split into a Devanagari file (Marathi) and a Latin file
// (English, numbers, punctuation); the browser picks the right file per letter.
const DEVANAGARI_RANGE =
  "U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+20F0,U+25CC,U+A830-A839,U+A8E0-A8FF,U+11B00-11B09";
const LATIN_RANGE =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

const WEIGHTS = ["400", "600", "700", "800"] as const;

// Rendering waits until all font files are loaded, so text never flashes
// in a fallback font.
export const fontsLoaded = Promise.all(
  WEIGHTS.flatMap((weight) => [
    loadFont({
      family: "Mukta",
      url: staticFile(`fonts/mukta/mukta-devanagari-${weight}-normal.woff2`),
      weight,
      unicodeRange: DEVANAGARI_RANGE,
    }),
    loadFont({
      family: "Mukta",
      url: staticFile(`fonts/mukta/mukta-latin-${weight}-normal.woff2`),
      weight,
      unicodeRange: LATIN_RANGE,
    }),
  ]),
);
