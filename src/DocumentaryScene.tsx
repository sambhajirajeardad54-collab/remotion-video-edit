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
  steps: z.array(z.object({ title: z.string(), description: z.string() })),
  footer: z.string(),
  accentColor: z.string(),
});

export type DocumentarySceneProps = z.infer<typeof documentarySceneSchema>;

export const DocumentaryScene: React.FC<DocumentarySceneProps> = ({
  chapter,
  headline,
  steps,
  footer,
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
          padding: "200px 90px 180px",
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
            border: `3px solid ${accentColor}`,
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

        <ProcessTimeline steps={steps} accentColor={accentColor} />

        <Interactive.Div
          name="Footer"
          style={{
            marginTop: "auto",
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            opacity: interpolate(frame, [200, 225], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {footer}
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
        fontSize: 112,
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

// Vertical process diagram: numbered nodes joined by a line that draws in,
// with each step's text sliding in beside its node.
const ProcessTimeline: React.FC<{
  steps: { title: string; description: string }[];
  accentColor: string;
}> = ({ steps, accentColor }) => {
  const frame = useCurrentFrame();
  const NODE = 96;
  const STEP_GAP = 70;
  const FIRST_STEP = 75;
  const STAGGER = 35;

  return (
    <Interactive.Div
      name="Process timeline"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: STEP_GAP,
      }}
    >
      {steps.map((step, i) => {
        const start = FIRST_STEP + i * STAGGER;
        const nodeIn = interpolate(frame, [start, start + 15], [0, 1], {
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const textIn = interpolate(frame, [start + 5, start + 25], [0, 1], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        // Connector to the next node draws while waiting for the next step.
        const lineIn = interpolate(
          frame,
          [start + 12, start + STAGGER],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const isLast = i === steps.length - 1;

        return (
          <div
            key={`${step.title}-${i}`}
            style={{ display: "flex", gap: 44, position: "relative" }}
          >
            {!isLast && (
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
            )}
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
                fontSize: 38,
                fontWeight: 800,
                color: accentColor,
                scale: `${nodeIn}`,
                boxShadow: `0 0 ${40 * nodeIn}px ${accentColor}55`,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                paddingTop: 6,
                opacity: textIn,
                translate: `${(1 - textIn) * 60}px 0px`,
              }}
            >
              <div style={{ fontSize: 64, fontWeight: 800 }}>{step.title}</div>
              <div
                style={{
                  fontSize: 40,
                  lineHeight: 1.3,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
    </Interactive.Div>
  );
};
