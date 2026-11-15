import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "./theme";

// The standard Sam Xplains backdrop: dark navy gradient + slowly drifting
// grid. With `spotlightY` (in % of the height) a soft light glows behind a
// presenter cutout, like a studio backlight.
export const SceneBackground: React.FC<{
  showGrid?: boolean;
  spotlightY?: number;
}> = ({ showGrid = true, spotlightY }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + 0.04 * Math.sin(frame / 40);
  return (
    <AbsoluteFill style={{ background: theme.background }}>
      {spotlightY !== undefined ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at 50% ${spotlightY}%, rgba(250,204,21,0.16) 0%, rgba(56,110,200,0.14) 28%, transparent 60%)`,
            scale: `${pulse}`,
          }}
        />
      ) : null}
      {showGrid ? (
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
      ) : null}
    </AbsoluteFill>
  );
};
