import { linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EASE_IN_OUT } from "./motion";

// Two kinds of transitions:
//
// 1. OVERLAY transitions (WhipFlash, DipToBlack, LightSweep) sit ON TOP of a
//    hard cut. They do not overlap the scenes, so the timeline length and the
//    sync with the original voice never change. Use these when editing over a
//    continuous recording (talking-head videos).
//    Place them in a <Sequence from={cutFrame - half}> spanning the cut.
//
// 2. SERIES transitions (presets below) for <TransitionSeries>, where scenes
//    overlap. Only use these when the audio is not one continuous recording.

// Fast streak of light with motion blur, like a whip pan.
export const WhipFlash: React.FC<{ color?: string }> = ({
  color = "#facc15",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });
  const peak = 1 - Math.abs(t - 0.5) * 2;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <AbsoluteFill
        style={{ backgroundColor: `rgba(4,7,15,${0.55 * peak})` }}
      />
      <div
        style={{
          position: "absolute",
          top: "-20%",
          height: "140%",
          width: "60%",
          left: `${-60 + t * 160}%`,
          rotate: "12deg",
          background: `linear-gradient(90deg, transparent, ${color}cc, #ffffff, ${color}cc, transparent)`,
          filter: "blur(30px)",
          opacity: peak,
        }}
      />
    </AbsoluteFill>
  );
};

// Quick dip to black and back.
export const DipToBlack: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundColor: "#000",
        opacity: 1 - Math.abs(t - 0.5) * 2,
      }}
    />
  );
};

// Soft diagonal light sweep, for emphasis without a cut.
export const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        overflow: "hidden",
        mixBlendMode: "screen",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-30%",
          height: "160%",
          width: "35%",
          left: `${-40 + t * 150}%`,
          rotate: "20deg",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          filter: "blur(20px)",
        }}
      />
    </AbsoluteFill>
  );
};

// Presets for <TransitionSeries.Transition presentation={...} timing={...} />.
export const seriesTransitions = {
  slideUp: () => ({
    presentation: slide({ direction: "from-bottom" }),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: 18 }),
  }),
  slideLeft: () => ({
    presentation: slide({ direction: "from-right" }),
    timing: springTiming({ config: { damping: 200 }, durationInFrames: 18 }),
  }),
  crossfade: () => ({
    presentation: fade(),
    timing: linearTiming({ durationInFrames: 15 }),
  }),
};
