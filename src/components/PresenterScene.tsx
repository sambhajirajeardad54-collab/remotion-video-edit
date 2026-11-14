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
  children?: React.ReactNode;
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
}) => {
  const { durationInFrames } = useVideoConfig();
  const isSplit = layout === "top-half";

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
          durationInFrames={durationInFrames}
        />
        {/* Darken the bottom edge so the name banner stays readable. */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, transparent 55%, rgba(15,12,41,0.85) 100%)",
          }}
        />
        <LowerThird
          name={name}
          role={role}
          accentColor={accentColor}
          exitFrame={lowerThirdExitFrame}
          bottom={isSplit ? 60 : 560}
        />
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
      ) : null}
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
