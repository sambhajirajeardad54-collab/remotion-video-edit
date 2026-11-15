import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import "./fonts";
import { EASE_IN_OUT, EASE_OUT } from "./motion";
import { theme } from "./theme";

// Talking-head footage inside a perfect circle, fixed in one position.
//
// The footage (ideally the background-removed transparent WebM) sits over a
// soft navy studio gradient. It is scaled so it always covers the whole
// circle (no straight edges can show) and positioned so the face sits at
// `faceAt` of the circle height, centred horizontally: the equivalent of
// object-fit: cover with a face-based object-position.
//
// Motion: one entrance (opacity + slight scale) and an optional exit.
// The circle itself never moves.
export type CircularPresenterProps = {
  src: string; // file in public/, e.g. "videos/.../presenter-cutout.webm"
  trimBeforeFrames?: number; // keep in sync when placed in a <Sequence>
  diameter: number;
  centerX: number;
  centerY: number;
  sourceWidth: number;
  sourceHeight: number;
  faceX?: number; // face centre in the source (0-1)
  faceY?: number;
  faceAt?: number; // where the face centre sits in the circle (0 = top, 1 = bottom)
  fill?: number; // extra zoom over the minimum needed to cover the circle
  enterFrames?: number;
  exitAt?: number; // frame (within the sequence) to start the exit; 0 = none
  ringWidth?: number;
};

export const CircularPresenter: React.FC<CircularPresenterProps> = ({
  src,
  trimBeforeFrames = 0,
  diameter,
  centerX,
  centerY,
  sourceWidth,
  sourceHeight,
  faceX = 0.5,
  faceY = 0.36,
  faceAt = 0.44,
  fill = 1.07,
  enterFrames = 18,
  exitAt = 0,
  ringWidth = 10,
}) => {
  const frame = useCurrentFrame();

  // Cover the circle completely, then place the face.
  const scale =
    Math.max(diameter / sourceWidth, diameter / sourceHeight) * fill;
  const boxW = sourceWidth * scale;
  const boxH = sourceHeight * scale;
  const left = Math.min(
    0,
    Math.max(diameter - boxW, diameter / 2 - faceX * boxW),
  );
  const top = Math.min(
    0,
    Math.max(diameter - boxH, faceAt * diameter - faceY * boxH),
  );

  const enter = interpolate(frame, [0, enterFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const exit =
    exitAt > 0
      ? interpolate(frame, [exitAt, exitAt + 10], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: EASE_IN_OUT,
        })
      : 1;
  const visible = Math.min(enter, exit);
  const outer = diameter + ringWidth * 2;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: centerX - outer / 2,
          top: centerY - outer / 2,
          width: outer,
          height: outer,
          borderRadius: "50%",
          padding: ringWidth,
          // Premium gradient ring (static) with a soft glow and deep shadow.
          background:
            "linear-gradient(140deg, #fff7d1 0%, #facc15 30%, #b7791f 62%, #facc15 85%, #fff7d1 100%)",
          boxShadow:
            "0 0 46px rgba(250,204,21,0.30), 0 0 12px rgba(250,204,21,0.45), 0 40px 90px rgba(0,0,0,0.65)",
          opacity: visible,
          scale: `${0.9 + 0.1 * visible}`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: diameter,
            height: diameter,
            borderRadius: "50%",
            overflow: "hidden",
            // Thin dark line between ring and picture, for a clean edge.
            boxShadow: "inset 0 0 0 4px #04070f",
            background:
              "radial-gradient(circle at 50% 38%, #24477f 0%, #12264a 45%, #070d1c 100%)",
            // Forces a true circular clip for the video layer.
            clipPath: "circle(50% at 50% 50%)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left,
              top,
              width: boxW,
              height: boxH,
            }}
          >
            <Video
              name="Circular presenter"
              src={staticFile(src)}
              trimBefore={trimBeforeFrames > 0 ? trimBeforeFrames : undefined}
              muted
              objectFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          {/* Subtle inner vignette for depth. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              boxShadow: "inset 0 0 60px rgba(4,7,15,0.55)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Name plate that sits on the bottom edge of the circle.
export const CircleNameplate: React.FC<{
  name: string;
  role: string;
  centerX: number;
  top: number;
  exitAt?: number;
}> = ({ name, role, centerX, top, exitAt = 0 }) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const exit =
    exitAt > 0
      ? interpolate(frame, [exitAt, exitAt + 10], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top,
          left: centerX,
          translate: `-50% ${(1 - enter) * 16}px`,
          display: "flex",
          alignItems: "baseline",
          gap: 16,
          padding: "10px 30px 12px",
          borderRadius: 999,
          backgroundColor: "rgba(4,7,15,0.92)",
          border: `3px solid ${theme.accent}`,
          boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
          fontFamily: theme.fontFamily,
          whiteSpace: "nowrap",
          opacity: Math.min(enter, exit),
        }}
      >
        <span style={{ fontSize: 40, fontWeight: 800, color: theme.text }}>
          {name}
        </span>
        <span style={{ fontSize: 28, fontWeight: 700, color: theme.accent }}>
          {role}
        </span>
      </div>
    </AbsoluteFill>
  );
};
