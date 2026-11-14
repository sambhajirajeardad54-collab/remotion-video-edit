import { z } from "zod";
import {
  AbsoluteFill,
  Interactive,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "./fonts";
import { exitProgress, progress } from "./motion";
import { PresenterMedia } from "./PresenterMedia";
import { theme } from "./theme";

// A presenter-led scene: your talking-head footage with an animated name
// banner (lower third). Two layouts:
//   "full"      presenter fills the screen
//   "top-half"  presenter on top, `children` (cards, infographics) below
export const presenterSceneSchema = z.object({
  presenterSrc: z.string(), // "" = placeholder, or e.g. "presenter/sam-intro.mp4"
  withAudio: z.boolean(),
  layout: z.enum(["full", "top-half"]),
  name: z.string(),
  role: z.string(),
  accentColor: z.string(),
  // Frame at which the name banner leaves (0 = stays until the end).
  lowerThirdExitFrame: z.number().int().min(0),
});

export type PresenterSceneProps = z.infer<typeof presenterSceneSchema> & {
  // "top-half": shown below the presenter. "full": shown on top of the footage.
  children?: React.ReactNode;
  // Footage options (see PresenterMedia): start offset and reframing.
  trimBeforeFrames?: number;
  baseZoom?: number;
  zoom?: number;
  zoomDurationInFrames?: number;
  focusX?: number;
  focusY?: number;
  sourceAspect?: number;
  faceY?: number;
  // Transparent presenter cutout (background removal), see PresenterMedia.
  foregroundSrc?: string;
  shiftY?: number;
};

export const PresenterScene: React.FC<PresenterSceneProps> = ({
  presenterSrc,
  withAudio,
  layout,
  name,
  role,
  accentColor,
  lowerThirdExitFrame,
  children,
  trimBeforeFrames,
  baseZoom,
  zoom,
  zoomDurationInFrames,
  focusX,
  focusY,
  sourceAspect,
  faceY,
  foregroundSrc,
  shiftY,
}) => {
  const { durationInFrames } = useVideoConfig();
  const isSplit = layout === "top-half";
  const { height } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{ background: theme.background, fontFamily: theme.fontFamily }}
    >
      <AbsoluteFill
        style={{
          height: isSplit ? "52%" : "100%",
          borderRadius: isSplit ? "0 0 48px 48px" : 0,
          overflow: "hidden",
        }}
      >
        <PresenterMedia
          presenterSrc={presenterSrc}
          withAudio={withAudio}
          durationInFrames={zoomDurationInFrames ?? durationInFrames}
          trimBeforeFrames={trimBeforeFrames}
          baseZoom={baseZoom}
          zoom={zoom}
          focusX={focusX}
          focusY={focusY}
          sourceAspect={sourceAspect}
          containerHeight={isSplit ? height * 0.52 : height}
          faceY={faceY}
          foregroundSrc={foregroundSrc}
          shiftY={shiftY}
        />
        {/* Darken the bottom edge so the name banner stays readable. */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, transparent 55%, rgba(4,7,15,0.85) 100%)",
          }}
        />
        {name ? (
          <LowerThird
            name={name}
            role={role}
            accentColor={accentColor}
            exitFrame={lowerThirdExitFrame}
            bottom={isSplit ? 60 : 560}
          />
        ) : null}
      </AbsoluteFill>

      {isSplit ? (
        <AbsoluteFill
          style={{
            top: "52%",
            height: "48%",
            padding: "60px 70px",
            justifyContent: "center",
          }}
        >
          {children}
        </AbsoluteFill>
      ) : (
        <AbsoluteFill>{children}</AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const LowerThird: React.FC<{
  name: string;
  role: string;
  accentColor: string;
  exitFrame: number;
  bottom: number;
}> = ({ name, role, accentColor, exitFrame, bottom }) => {
  const frame = useCurrentFrame();
  const bar = progress(frame, 12, 20);
  const nameIn = progress(frame, 18, 22);
  const roleIn = progress(frame, 26, 22);
  const out = exitProgress(frame, exitFrame);

  return (
    <Interactive.Div
      name="Lower third"
      style={{
        position: "absolute",
        left: 70,
        bottom,
        display: "flex",
        gap: 24,
        opacity: out,
        translate: `${(1 - out) * -40}px 0px`,
      }}
    >
      <div
        style={{
          width: 10,
          borderRadius: 5,
          backgroundColor: accentColor,
          transformOrigin: "center top",
          scale: `1 ${bar}`,
        }}
      />
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.15,
            color: theme.text,
            translate: `0px ${(1 - nameIn) * 100}%`,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            lineHeight: 1.3,
            color: accentColor,
            opacity: roleIn,
            translate: `${(1 - roleIn) * -30}px 0px`,
          }}
        >
          {role}
        </div>
      </div>
    </Interactive.Div>
  );
};
