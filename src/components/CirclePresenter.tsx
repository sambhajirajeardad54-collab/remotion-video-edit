import { z } from "zod";
import { Interactive, useCurrentFrame } from "remotion";
import "./fonts";
import { EASE_POP, exitProgress, progress } from "./motion";
import { PresenterMedia } from "./PresenterMedia";

// The presenter in a round frame that pops in over other content
// (news cards, infographics). Place it in a corner so it never covers
// the main visual.
export const circlePresenterSchema = z.object({
  presenterSrc: z.string(), // "" = placeholder, or e.g. "presenter/sam-intro.mp4"
  withAudio: z.boolean(),
  position: z.enum(["bottom-right", "bottom-left", "top-right", "top-left"]),
  size: z.number().min(120).max(700),
  ringColor: z.string(),
  // Distance from the top/bottom edge in px. Keep it clear of subtitles
  // (around 1450-1650 px from the top) and of the main visual.
  edgeOffset: z.number().min(0).max(1600),
  delay: z.number().int().min(0), // frames before it appears
  exitFrame: z.number().int().min(0), // 0 = stays until the end
});

export type CirclePresenterProps = z.infer<typeof circlePresenterSchema>;

const MARGIN = 60;

export const CirclePresenter: React.FC<CirclePresenterProps> = ({
  presenterSrc,
  withAudio,
  position,
  size,
  ringColor,
  edgeOffset,
  delay,
  exitFrame,
}) => {
  const frame = useCurrentFrame();
  const appear = progress(frame, delay, 18, EASE_POP);
  const out = exitProgress(frame, exitFrame, 12);
  const visible = Math.min(appear, out);
  const [vertical, horizontal] = position.split("-") as [
    "top" | "bottom",
    "left" | "right",
  ];

  return (
    <Interactive.Div
      name="Circle presenter"
      style={{
        position: "absolute",
        [vertical]: edgeOffset,
        [horizontal]: MARGIN,
        width: size,
        height: size,
        opacity: Math.min(1, visible * 1.5),
        scale: `${Math.max(0, visible)}`,
      }}
    >
      {/* Rotating accent ring. */}
      <div
        style={{
          position: "absolute",
          inset: -12,
          borderRadius: "50%",
          background: `conic-gradient(from ${frame * 2}deg, ${ringColor}, transparent 40%, ${ringColor} 70%, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          overflow: "hidden",
          border: "6px solid #0f0c29",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        <PresenterMedia
          presenterSrc={presenterSrc}
          withAudio={withAudio}
          zoom={0}
          compact
        />
      </div>
    </Interactive.Div>
  );
};
