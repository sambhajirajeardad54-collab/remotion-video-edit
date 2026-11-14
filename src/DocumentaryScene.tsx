import { z } from "zod";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Editable content for the scene. Change these in the Studio "Props" panel.
export const documentarySceneSchema = z.object({
  chapter: z.string(),
  headline: z.string(),
  statValue: z.number().min(0).max(100),
  statLabel: z.string(),
  chartTitle: z.string(),
  bars: z.array(z.object({ label: z.string(), value: z.number() })),
  source: z.string(),
  accentColor: z.string(),
});

export type DocumentarySceneProps = z.infer<typeof documentarySceneSchema>;

export const DocumentaryScene: React.FC<DocumentarySceneProps> = ({
  chapter,
  headline,
  statValue,
  statLabel,
  chartTitle,
  bars,
  source,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        // Same palette as TitleScene for a consistent look.
        background: "linear-gradient(180deg, #0f0c29, #302b63, #24243e)",
        fontFamily: "Helvetica, Arial, sans-serif",
        color: "white",
      }}
    >
      <BackgroundGrid />

      {/* Whole layout fades and lifts away at the end (exit transition). */}
      <Interactive.Div
        name="Content"
        style={{
          position: "absolute",
          inset: 0,
          padding: "180px 90px",
          display: "flex",
          flexDirection: "column",
          gap: 70,
          opacity: interpolate(
            frame,
            [durationInFrames - 20, durationInFrames],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
          translate: interpolate(
            frame,
            [durationInFrames - 20, durationInFrames],
            ["0px 0px", "0px -80px"],
            {
              easing: Easing.bezier(0.7, 0, 0.84, 0),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
        }}
      >
        <Interactive.Div
          name="Chapter tag"
          style={{
            alignSelf: "flex-start",
            padding: "14px 28px",
            border: "3px solid #38bdf8",
            borderRadius: 999,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: accentColor,
            opacity: interpolate(frame, [5, 25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [5, 25], ["-60px 0px", "0px 0px"], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {chapter}
        </Interactive.Div>

        <Headline text={headline} />

        <Interactive.Div
          name="Divider"
          style={{
            height: 4,
            backgroundColor: "rgba(255,255,255,0.25)",
            transformOrigin: "left center",
            scale: interpolate(frame, [40, 70], ["0 1", "1 1"], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />

        <StatCard
          value={statValue}
          label={statLabel}
          accentColor={accentColor}
        />

        <BarChart title={chartTitle} bars={bars} accentColor={accentColor} />

        <Interactive.Div
          name="Source"
          style={{
            marginTop: "auto",
            fontSize: 28,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: 1,
            opacity: interpolate(frame, [190, 215], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {source}
        </Interactive.Div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// Subtle drifting grid lines, a common documentary/infographic backdrop.
const BackgroundGrid: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)",
        backgroundSize: "120px 120px",
        backgroundPosition: `0px ${frame * 0.5}px`,
        opacity: interpolate(frame, [0, 30], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

// Headline revealed word by word, each word sliding up from behind a mask.
const Headline: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <Interactive.Div
      name="Headline"
      style={{
        fontSize: 104,
        fontWeight: 800,
        lineHeight: 1.08,
        display: "flex",
        flexWrap: "wrap",
        columnGap: 28,
      }}
    >
      {words.map((word, i) => {
        const start = 15 + i * 5;
        const progress = interpolate(frame, [start, start + 18], [0, 1], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={`${word}-${i}`}
            style={{ display: "inline-block", overflow: "hidden" }}
          >
            <span
              style={{
                display: "inline-block",
                translate: `0px ${(1 - progress) * 110}%`,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Interactive.Div>
  );
};

// Animated percentage ring with a counting number.
const StatCard: React.FC<{
  value: number;
  label: string;
  accentColor: string;
}> = ({ value, label, accentColor }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [60, 120], [0, 1], {
    easing: Easing.bezier(0.33, 1, 0.68, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const radius = 120;
  const circumference = 2 * Math.PI * radius;

  return (
    <Interactive.Div
      name="Stat card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 56,
        padding: 48,
        borderRadius: 36,
        backgroundColor: "rgba(255,255,255,0.06)",
        border: "2px solid rgba(255,255,255,0.12)",
        opacity: interpolate(frame, [55, 75], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [55, 80], ["0px 60px", "0px 0px"], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div style={{ position: "relative", width: 280, height: 280 }}>
        <svg width={280} height={280} style={{ rotate: "-90deg" }}>
          <circle
            cx={140}
            cy={140}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={22}
          />
          <circle
            cx={140}
            cy={140}
            r={radius}
            fill="none"
            stroke={accentColor}
            strokeWidth={22}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - (value / 100) * progress)}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 84,
            fontWeight: 800,
          }}
        >
          {Math.round(value * progress)}%
        </div>
      </div>
      <div
        style={{
          flex: 1,
          fontSize: 44,
          lineHeight: 1.25,
          color: "rgba(255,255,255,0.85)",
        }}
      >
        {label}
      </div>
    </Interactive.Div>
  );
};

// Horizontal bars that grow in one after another.
const BarChart: React.FC<{
  title: string;
  bars: { label: string; value: number }[];
  accentColor: string;
}> = ({ title, bars, accentColor }) => {
  const frame = useCurrentFrame();
  const max = Math.max(1, ...bars.map((b) => b.value));

  return (
    <Interactive.Div
      name="Bar chart"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 34,
        opacity: interpolate(frame, [110, 130], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {title}
      </div>
      {bars.map((bar, i) => {
        const start = 120 + i * 12;
        const grow = interpolate(frame, [start, start + 30], [0, 1], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div key={`${bar.label}-${i}`}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 38,
                marginBottom: 12,
              }}
            >
              <span>{bar.label}</span>
              <span style={{ fontWeight: 700, color: accentColor }}>
                {Math.round(bar.value * grow)}
              </span>
            </div>
            <div
              style={{
                height: 26,
                borderRadius: 13,
                backgroundColor: "rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(bar.value / max) * 100 * grow}%`,
                  borderRadius: 13,
                  backgroundColor: accentColor,
                  opacity: 1 - i * 0.2,
                }}
              />
            </div>
          </div>
        );
      })}
    </Interactive.Div>
  );
};
