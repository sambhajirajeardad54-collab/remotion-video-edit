import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { theme } from "./theme";

// Shows your talking-head footage, or a placeholder until you have it.
//
// To use real footage: put the file in public/presenter/ (for example
// public/presenter/sam-intro.mp4) and set presenterSrc="presenter/sam-intro.mp4".
// Leave presenterSrc empty ("") to show the placeholder.
export const PresenterMedia: React.FC<{
  presenterSrc: string;
  withAudio: boolean;
  // Slow documentary "Ken Burns" push-in, as a fraction (0.05 = 5% zoom).
  zoom?: number;
  durationInFrames?: number;
  // Hide the placeholder's text label (for small frames such as circles).
  compact?: boolean;
}> = ({
  presenterSrc,
  withAudio,
  zoom = 0.04,
  durationInFrames = 300,
  compact = false,
}) => {
  const frame = useCurrentFrame();
  const scale = 1 + zoom * Math.min(1, frame / durationInFrames);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: `${scale}` }}>
        {presenterSrc ? (
          <Video
            name="Presenter footage"
            src={staticFile(presenterSrc)}
            muted={!withAudio}
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <PresenterPlaceholder compact={compact} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Neutral silhouette that marks where the presenter will appear.
const PresenterPlaceholder: React.FC<{ compact: boolean }> = ({ compact }) => {
  const frame = useCurrentFrame();
  const breathe = 1 + 0.01 * Math.sin(frame / 20);
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 35%, #3b3680 0%, #1b1740 55%, #0f0c29 100%)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        style={{
          width: "62%",
          maxWidth: 640,
          scale: `${breathe}`,
          opacity: 0.55,
        }}
      >
        <circle cx="100" cy="72" r="38" fill="rgba(255,255,255,0.35)" />
        <path
          d="M 28 200 C 28 140 60 118 100 118 C 140 118 172 140 172 200 Z"
          fill="rgba(255,255,255,0.35)"
        />
      </svg>
      {compact ? null : (
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            fontFamily: theme.fontFamily,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: 4,
            color: theme.textFaint,
            textTransform: "uppercase",
          }}
        >
          Presenter · सादरकर्ता
        </div>
      )}
    </AbsoluteFill>
  );
};
