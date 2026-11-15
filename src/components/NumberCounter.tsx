import { z } from "zod";
import { Interactive, useCurrentFrame } from "remotion";
import "./fonts";
import { EASE_OUT, exitProgress, progress } from "./motion";
import { theme } from "./theme";

// Big animated number for statistics. `source` is REQUIRED: every figure
// shown on screen must say where it comes from.
export const numberCounterSchema = z.object({
  value: z.number(),
  // Show a range "rangeFrom ते value" (e.g. 12 ते 13). null = single number.
  rangeFrom: z.number().nullable(),
  rangeSeparator: z.string(),
  decimals: z.number().int().min(0).max(3),
  prefix: z.string(), // e.g. "₹"
  suffix: z.string(), // e.g. "%" or " कोटी"
  label: z.string(),
  source: z.string().min(1, "Every number needs a source"),
  digits: z.enum(["latin", "devanagari"]), // 1,25,000 or १,२५,०००
  accentColor: z.string(),
  delay: z.number().int().min(0),
  countDuration: z.number().int().min(1), // frames to count up
  exitFrame: z.number().int().min(0), // 0 = stays until the end
});

export type NumberCounterProps = z.infer<typeof numberCounterSchema>;

const DEVANAGARI_DIGITS = "०१२३४५६७८९";

// Indian grouping: 1,25,00,000 (last three digits, then pairs).
export const formatIndianNumber = (
  value: number,
  decimals: number,
  digits: "latin" | "devanagari",
): string => {
  const negative = value < 0;
  const [intPart, fracPart] = Math.abs(value).toFixed(decimals).split(".");
  const lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const grouped = rest
    ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`
    : lastThree;
  let out = `${negative ? "-" : ""}${grouped}${fracPart ? `.${fracPart}` : ""}`;
  if (digits === "devanagari") {
    out = out.replace(/\d/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
  }
  return out;
};

export const NumberCounter: React.FC<NumberCounterProps> = ({
  value,
  rangeFrom,
  rangeSeparator,
  decimals,
  prefix,
  suffix,
  label,
  source,
  digits,
  accentColor,
  delay,
  countDuration,
  exitFrame,
}) => {
  const frame = useCurrentFrame();
  const appear = progress(frame, delay, 18);
  const count = progress(frame, delay + 6, countDuration, EASE_OUT);
  const underline = progress(frame, delay + 6, countDuration);
  const labelIn = progress(frame, delay + 14, 20);
  const sourceIn = progress(frame, delay + countDuration, 18);
  const out = exitProgress(frame, exitFrame);

  return (
    <Interactive.Div
      name="Number counter"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        fontFamily: theme.fontFamily,
        color: theme.text,
        opacity: Math.min(appear, out),
        scale: `${0.94 + 0.06 * appear}`,
      }}
    >
      <div
        style={{
          fontSize: 190,
          fontWeight: 800,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          color: accentColor,
          textShadow: `0 0 60px ${accentColor}55`,
        }}
      >
        {prefix}
        {rangeFrom !== null
          ? `${formatIndianNumber(rangeFrom * count, decimals, digits)}${rangeSeparator}`
          : null}
        {formatIndianNumber(value * count, decimals, digits)}
        {suffix}
      </div>
      <div
        style={{
          width: 420,
          height: 8,
          borderRadius: 4,
          backgroundColor: accentColor,
          transformOrigin: "center",
          scale: `${underline} 1`,
        }}
      />
      <div
        style={{
          fontSize: 54,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: 900,
          opacity: labelIn,
          translate: `0px ${(1 - labelIn) * 24}px`,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 600,
          color: theme.textFaint,
          opacity: sourceIn,
        }}
      >
        स्रोत: {source}
      </div>
    </Interactive.Div>
  );
};
