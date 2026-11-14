import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SceneBackground } from "./SceneBackground";
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
  // Start this many frames into the footage (keeps a cut in sync with audio).
  trimBeforeFrames?: number;
  // Reframing: starting zoom (1 = fill the frame) and the point to zoom
  // towards, in % of the frame (e.g. the presenter's face).
  baseZoom?: number;
  focusX?: number;
  focusY?: number;
  // Framing for footage whose shape differs from the frame (e.g. 864x1920):
  // sourceAspect = source height / width, containerHeight = height of the
  // area in px, faceY = where the face sits in the source (0 = top, 1 = bottom).
  // The footage is positioned so the face is centred, and zooms toward it.
  sourceAspect?: number;
  containerHeight?: number;
  faceY?: number;
  // Background removal: a transparent WebM of the presenter (same size and
  // timing as presenterSrc). When set, the original background is replaced
  // by the dark Sam Xplains backdrop with a soft spotlight.
  foregroundSrc?: string;
  // Zoom around the bottom edge instead of the face (to make the presenter
  // smaller and lower, leaving room for graphics above).
  anchorBottom?: boolean;
}> = ({
  presenterSrc,
  withAudio,
  zoom = 0.04,
  durationInFrames = 300,
  compact = false,
  trimBeforeFrames = 0,
  baseZoom = 1,
  focusX = 50,
  focusY = 50,
  sourceAspect,
  containerHeight,
  faceY = 0.36,
  foregroundSrc,
  anchorBottom = false,
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const scale = baseZoom + zoom * Math.min(1, frame / durationInFrames);

  // Face-centred framing (only when the source shape is given).
  let boxStyle: React.CSSProperties = { width: "100%", height: "100%" };
  let originX = focusX;
  let originY = focusY;
  if (sourceAspect && containerHeight) {
    const boxH = width * sourceAspect;
    const top = Math.min(
      0,
      Math.max(containerHeight - boxH, containerHeight / 2 - faceY * boxH),
    );
    boxStyle = { position: "absolute", left: 0, top, width, height: boxH };
    originX = 50;
    originY = ((top + faceY * boxH) / containerHeight) * 100;
  }
  const spotlightY = originY;
  if (anchorBottom) {
    originY = 100;
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {foregroundSrc ? (
        <SceneBackground
          spotlightY={
            anchorBottom ? 100 - (100 - spotlightY) * scale : spotlightY
          }
        />
      ) : null}
      <AbsoluteFill
        style={{
          scale: `${scale}`,
          transformOrigin: `${originX}% ${originY}%`,
        }}
      >
        {presenterSrc ? (
          <div style={boxStyle}>
            <Video
              name={foregroundSrc ? "Presenter cutout" : "Presenter footage"}
              src={staticFile(foregroundSrc || presenterSrc)}
              trimBefore={trimBeforeFrames > 0 ? trimBeforeFrames : undefined}
              muted={!withAudio}
              objectFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
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
          "radial-gradient(circle at 50% 35%, #1e3a6b 0%, #0a1428 55%, #04070f 100%)",
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
