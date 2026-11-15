import { Video } from "@remotion/media";
import { z } from "zod";
import {
  AbsoluteFill,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "./fonts";
import { EASE_IN_OUT, progress } from "./motion";
import { theme } from "./theme";

// Full-screen B-roll: a photo or video clip with a slow documentary
// "Ken Burns" move (zoom + pan), a dark grade for readable text, and an
// optional label. Put files in public/images/ or public/videos/.
export const brollSceneSchema = z.object({
  src: z.string(), // "images/..." or "videos/..." ("" = placeholder)
  mediaType: z.enum(["image", "video"]),
  trimBeforeFrames: z.number().int().min(0), // video only: start offset
  zoomFrom: z.number().min(1).max(2),
  zoomTo: z.number().min(1).max(2),
  panX: z.number().min(-20).max(20), // % drift over the clip
  panY: z.number().min(-20).max(20),
  blur: z.number().min(0).max(40), // px, e.g. as a backdrop behind a card
  darken: z.number().min(0).max(1),
  label: z.string(), // small top-left tag, "" = none
  accentColor: z.string(),
});

export type BrollSceneProps = z.infer<typeof brollSceneSchema> & {
  children?: React.ReactNode; // overlays (cards, phone mockups...)
};

export const BrollScene: React.FC<BrollSceneProps> = ({
  src,
  mediaType,
  trimBeforeFrames,
  zoomFrom,
  zoomTo,
  panX,
  panY,
  blur,
  darken,
  label,
  accentColor,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });
  const labelIn = progress(frame, 6, 16);
  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <AbsoluteFill
      style={{ backgroundColor: theme.backgroundDeep, overflow: "hidden" }}
    >
      <AbsoluteFill
        style={{
          scale: `${zoomFrom + (zoomTo - zoomFrom) * t}`,
          translate: `${panX * t}% ${panY * t}%`,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
        }}
      >
        {!src ? (
          <AbsoluteFill style={{ background: theme.background }} />
        ) : mediaType === "video" ? (
          <Video
            name="B-roll video"
            src={staticFile(src)}
            trimBefore={trimBeforeFrames > 0 ? trimBeforeFrames : undefined}
            muted
            objectFit="cover"
            style={mediaStyle}
          />
        ) : (
          <Img src={staticFile(src)} style={mediaStyle} />
        )}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(4,7,15,${darken * 0.8}) 0%, rgba(4,7,15,${darken * 0.4}) 40%, rgba(4,7,15,${darken}) 100%)`,
        }}
      />
      {label ? (
        <Interactive.Div
          name="B-roll label"
          style={{
            position: "absolute",
            top: 170,
            left: 70,
            padding: "8px 24px",
            borderLeft: `8px solid ${accentColor}`,
            backgroundColor: "rgba(4,7,15,0.75)",
            fontFamily: theme.fontFamily,
            fontSize: 34,
            fontWeight: 700,
            color: theme.text,
            opacity: labelIn,
            translate: `${(1 - labelIn) * -30}px 0px`,
          }}
        >
          {label}
        </Interactive.Div>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};
