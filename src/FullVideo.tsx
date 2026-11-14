import {
  linearTiming,
  springTiming,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DocumentaryScene } from "./DocumentaryScene";
import { TitleScene } from "./TitleScene";

// Total length = 150 + 300 + 105 scene frames - 25 - 20 transition frames = 510.
// If you change a scene or transition length, update durationInFrames of the
// "FullVideo" composition in Composition.tsx to match.

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0c29" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Opening title" durationInFrames={150}>
          <TitleScene
            title="Remotion Video Edit"
            subtitle="Made with code"
            accentColor="#38bdf8"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: 25,
          })}
        />

        <TransitionSeries.Sequence name="Documentary" durationInFrames={300}>
          <DocumentaryScene
            chapter="Chapter 02"
            headline="How this video was made"
            steps={[
              {
                title: "Write",
                description: "Every scene is a React component.",
              },
              {
                title: "Animate",
                description: "Motion is calculated frame by frame in code.",
              },
              {
                title: "Render",
                description: "The same code is exported as an MP4 video.",
              },
            ]}
            footer="Built with Remotion"
            accentColor="#38bdf8"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        <TransitionSeries.Sequence name="End card" durationInFrames={105}>
          <TitleScene
            title="Thanks for watching"
            subtitle="Remotion Video Edit"
            accentColor="#38bdf8"
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <MotionOverlay />
    </AbsoluteFill>
  );
};

// Graphics that stay on top of every scene: a progress bar and a brand label.
const MotionOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Interactive.Div
        name="Progress bar"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 10,
          backgroundColor: "#38bdf8",
          transformOrigin: "left center",
          scale: interpolate(frame, [0, durationInFrames], ["0 1", "1 1"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      <Interactive.Div
        name="Brand label"
        style={{
          position: "absolute",
          top: 80,
          right: 90,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
          opacity: interpolate(
            frame,
            [20, 40, durationInFrames - 25, durationInFrames - 5],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
          translate: interpolate(frame, [20, 40], ["0px -20px", "0px 0px"], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: "#38bdf8",
          }}
        />
        Remotion Video Edit
      </Interactive.Div>
    </AbsoluteFill>
  );
};
