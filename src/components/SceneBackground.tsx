import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "./theme";

// The standard Sam Xplains backdrop: brand gradient + slowly drifting grid.
export const SceneBackground: React.FC<{ showGrid?: boolean }> = ({
  showGrid = true,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: theme.background }}>
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
