import { z } from "zod";
import { Interactive, useCurrentFrame } from "remotion";
import "./fonts";
import { EASE_OUT, EASE_POP, exitProgress, progress } from "./motion";
import { theme } from "./theme";

// Documentary-style animated typography: big bold words that rise in one by
// one. Wrap keywords in *asterisks* to colour them (e.g. "*एकाच* पुस्तकातून").
// Optional small kicker line above and an icon on the left.
export const kineticHeadlineSchema = z.object({
  kicker: z.string(), // small label above, "" = none
  text: z.string(),
  icon: z.enum(["none", "book", "target", "warning"]),
  fontSize: z.number().min(40).max(200),
  align: z.enum(["left", "center"]),
  accentColor: z.string(),
  delay: z.number().int().min(0),
  exitFrame: z.number().int().min(0), // 0 = stays until the end
});

export type KineticHeadlineProps = z.infer<typeof kineticHeadlineSchema>;

export const KineticHeadline: React.FC<KineticHeadlineProps> = ({
  kicker,
  text,
  icon,
  fontSize,
  align,
  accentColor,
  delay,
  exitFrame,
}) => {
  const frame = useCurrentFrame();
  const out = exitProgress(frame, exitFrame, 10);
  const kickerIn = progress(frame, delay, 14);
  const iconIn = progress(frame, delay + 2, 16, EASE_POP);
  let highlighted = false;
  const words = text
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => {
      if (raw.startsWith("*")) highlighted = true;
      const w = { text: raw.replace(/\*/g, ""), on: highlighted };
      if (raw.endsWith("*") && raw.length > 1) highlighted = false;
      return w;
    });

  return (
    <Interactive.Div
      name="Kinetic headline"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: align === "center" ? "center" : "flex-start",
        gap: 30,
        fontFamily: theme.fontFamily,
        opacity: out,
        translate: `0px ${(1 - out) * -40}px`,
      }}
    >
      {icon !== "none" ? (
        <div style={{ flexShrink: 0, scale: `${iconIn}` }}>
          <HeadlineIcon kind={icon} color={accentColor} size={fontSize * 1.1} />
        </div>
      ) : null}
      <div style={{ textAlign: align }}>
        {kicker ? (
          <div
            style={{
              display: "inline-block",
              marginBottom: 12,
              padding: "6px 22px",
              borderRadius: 10,
              backgroundColor: accentColor,
              color: "#04070f",
              fontSize: fontSize * 0.34,
              fontWeight: 800,
              opacity: kickerIn,
              translate: `${(1 - kickerIn) * -30}px 0px`,
            }}
          >
            {kicker}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: align === "center" ? "center" : "flex-start",
            columnGap: fontSize * 0.25,
            fontSize,
            fontWeight: 800,
            lineHeight: 1.18,
          }}
        >
          {words.map((w, i) => {
            const p = progress(frame, delay + 6 + i * 4, 16, EASE_OUT);
            return (
              <span
                key={`${w.text}-${i}`}
                style={{ overflow: "hidden", paddingBottom: 6 }}
              >
                <span
                  style={{
                    display: "inline-block",
                    color: w.on ? accentColor : theme.text,
                    textShadow: theme.textOutline,
                    translate: `0px ${(1 - p) * 105}%`,
                  }}
                >
                  {w.text}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </Interactive.Div>
  );
};

const HeadlineIcon: React.FC<{
  kind: "book" | "target" | "warning";
  color: string;
  size: number;
}> = ({ kind, color, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {kind === "book" ? (
      <>
        <path d="M 12 20 Q 30 12 50 22 L 50 86 Q 30 76 12 84 Z" fill={color} />
        <path
          d="M 88 20 Q 70 12 50 22 L 50 86 Q 70 76 88 84 Z"
          fill={color}
          opacity={0.75}
        />
        <path
          d="M 22 34 Q 32 30 42 35 M 22 46 Q 32 42 42 47 M 58 35 Q 68 30 78 34 M 58 47 Q 68 42 78 46"
          stroke="#04070f"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
      </>
    ) : null}
    {kind === "target" ? (
      <>
        <circle
          cx={50}
          cy={50}
          r={42}
          fill="none"
          stroke={color}
          strokeWidth={8}
        />
        <circle
          cx={50}
          cy={50}
          r={26}
          fill="none"
          stroke={color}
          strokeWidth={8}
        />
        <circle cx={50} cy={50} r={9} fill={color} />
      </>
    ) : null}
    {kind === "warning" ? (
      <>
        <path d="M 50 8 L 94 88 L 6 88 Z" fill={color} />
        <rect x={45} y={34} width={10} height={30} rx={4} fill="#04070f" />
        <circle cx={50} cy={74} r={6} fill="#04070f" />
      </>
    ) : null}
  </svg>
);
