import { z } from "zod";
import { Interactive, useCurrentFrame } from "remotion";
import "./fonts";
import { EASE_POP, exitProgress, progress } from "./motion";
import { theme } from "./theme";

// Reusable infographic in three styles:
//   "steps"       numbered process joined by a line that draws in
//   "list"        key points with check marks (revision notes, symptoms, tips)
//   "comparison"  two columns side by side (then vs now, myth vs fact)
export const infographicSchema = z.object({
  variant: z.enum(["steps", "list", "comparison"]),
  title: z.string(),
  // Used by "steps" and "list".
  items: z.array(z.object({ title: z.string(), description: z.string() })),
  // Used by "comparison" (two columns).
  columns: z.array(
    z.object({ heading: z.string(), points: z.array(z.string()) }),
  ),
  accentColor: z.string(),
  delay: z.number().int().min(0),
  stagger: z.number().int().min(4), // frames between items
  exitFrame: z.number().int().min(0), // 0 = stays until the end
});

export type InfographicProps = z.infer<typeof infographicSchema>;

export const Infographic: React.FC<InfographicProps> = (props) => {
  const { variant, title, accentColor, delay, exitFrame } = props;
  const frame = useCurrentFrame();
  const titleIn = progress(frame, delay, 20);
  const out = exitProgress(frame, exitFrame);

  return (
    <Interactive.Div
      name="Infographic"
      style={{
        width: 940,
        display: "flex",
        flexDirection: "column",
        gap: 50,
        fontFamily: theme.fontFamily,
        color: theme.text,
        opacity: out,
        translate: `0px ${(1 - out) * -50}px`,
      }}
    >
      {title ? (
        <div
          style={{
            fontSize: 70,
            fontWeight: 800,
            lineHeight: 1.2,
            opacity: titleIn,
            translate: `0px ${(1 - titleIn) * 30}px`,
          }}
        >
          {title}
          <div
            style={{
              marginTop: 18,
              width: 160,
              height: 8,
              borderRadius: 4,
              backgroundColor: accentColor,
              transformOrigin: "left center",
              scale: `${progress(frame, delay + 8, 24)} 1`,
            }}
          />
        </div>
      ) : null}
      {variant === "steps" ? <Steps {...props} /> : null}
      {variant === "list" ? <List {...props} /> : null}
      {variant === "comparison" ? <Comparison {...props} /> : null}
    </Interactive.Div>
  );
};

const NODE = 96;
const STEP_GAP = 60;

const Steps: React.FC<InfographicProps> = ({
  items,
  accentColor,
  delay,
  stagger,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: STEP_GAP }}>
      {items.map((item, i) => {
        const start = delay + 20 + i * stagger;
        const nodeIn = progress(frame, start, 15, EASE_POP);
        const textIn = progress(frame, start + 5, 20);
        const lineIn = progress(frame, start + 12, Math.max(4, stagger - 12));
        const isLast = i === items.length - 1;
        return (
          <div
            key={`${item.title}-${i}`}
            style={{ display: "flex", gap: 40, position: "relative" }}
          >
            {!isLast ? (
              <div
                style={{
                  position: "absolute",
                  left: NODE / 2 - 2,
                  top: NODE,
                  width: 4,
                  height: `calc(100% - ${NODE}px + ${STEP_GAP}px)`,
                  backgroundColor: "rgba(255,255,255,0.15)",
                  opacity: nodeIn,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${lineIn * 100}%`,
                    backgroundColor: accentColor,
                  }}
                />
              </div>
            ) : null}
            <div
              style={{
                flexShrink: 0,
                width: NODE,
                height: NODE,
                borderRadius: NODE / 2,
                border: `4px solid ${accentColor}`,
                backgroundColor: "#1b1740",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 40,
                fontWeight: 800,
                color: accentColor,
                scale: `${nodeIn}`,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                opacity: textIn,
                translate: `${(1 - textIn) * 50}px 0px`,
                paddingTop: 4,
              }}
            >
              <div style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.25 }}>
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 38,
                  lineHeight: 1.4,
                  color: theme.textMuted,
                }}
              >
                {item.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const List: React.FC<InfographicProps> = ({
  items,
  accentColor,
  delay,
  stagger,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {items.map((item, i) => {
        const start = delay + 20 + i * stagger;
        const rowIn = progress(frame, start, 20);
        const check = progress(frame, start + 6, 14);
        return (
          <div
            key={`${item.title}-${i}`}
            style={{
              display: "flex",
              gap: 32,
              alignItems: "flex-start",
              padding: "30px 36px",
              borderRadius: 28,
              backgroundColor: theme.card,
              border: `2px solid ${theme.cardBorder}`,
              opacity: rowIn,
              translate: `${(1 - rowIn) * 80}px 0px`,
            }}
          >
            <svg
              width={64}
              height={64}
              viewBox="0 0 64 64"
              style={{ flexShrink: 0 }}
            >
              <circle
                cx={32}
                cy={32}
                r={29}
                fill="none"
                stroke={accentColor}
                strokeWidth={5}
              />
              <path
                d="M 19 33 L 28 42 L 46 23"
                fill="none"
                stroke={accentColor}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={45}
                strokeDashoffset={45 * (1 - check)}
              />
            </svg>
            <div>
              <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.25 }}>
                {item.title}
              </div>
              {item.description ? (
                <div
                  style={{
                    fontSize: 36,
                    lineHeight: 1.4,
                    color: theme.textMuted,
                  }}
                >
                  {item.description}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Comparison: React.FC<InfographicProps> = ({
  columns,
  accentColor,
  delay,
  stagger,
}) => {
  const frame = useCurrentFrame();
  const vs = progress(frame, delay + 20, 16, EASE_POP);
  return (
    <div style={{ display: "flex", gap: 30, position: "relative" }}>
      {columns.slice(0, 2).map((col, c) => {
        const colIn = progress(frame, delay + 14 + c * 8, 22);
        const tint = c === 0 ? "rgba(255,255,255,0.75)" : accentColor;
        return (
          <div
            key={`${col.heading}-${c}`}
            style={{
              flex: 1,
              padding: "36px 32px",
              borderRadius: 32,
              backgroundColor: theme.card,
              border: `2px solid ${c === 0 ? theme.cardBorder : accentColor}`,
              opacity: colIn,
              translate: `${(1 - colIn) * (c === 0 ? -60 : 60)}px 0px`,
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <div style={{ fontSize: 50, fontWeight: 800, color: tint }}>
              {col.heading}
            </div>
            {col.points.map((point, i) => {
              const pIn = progress(frame, delay + 30 + i * stagger, 18);
              return (
                <div
                  key={`${point}-${i}`}
                  style={{
                    fontSize: 36,
                    lineHeight: 1.35,
                    color: theme.textMuted,
                    opacity: pIn,
                    translate: `0px ${(1 - pIn) * 16}px`,
                  }}
                >
                  • {point}
                </div>
              );
            })}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          marginTop: -45,
          width: 90,
          height: 90,
          marginLeft: -45,
          borderRadius: 45,
          backgroundColor: "#0f0c29",
          border: `4px solid ${accentColor}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 34,
          fontWeight: 800,
          color: accentColor,
          scale: `${vs}`,
        }}
      >
        VS
      </div>
    </div>
  );
};
