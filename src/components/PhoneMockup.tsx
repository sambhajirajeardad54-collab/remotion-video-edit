import { Video } from "@remotion/media";
import { z } from "zod";
import { Img, Interactive, staticFile, useCurrentFrame } from "remotion";
import "./fonts";
import { exitProgress, progress } from "./motion";
import { theme } from "./theme";

// A phone frame for showing apps, websites, social posts or screen
// recordings. Put the screenshot in public/images/ or the screen recording
// in public/videos/. With neither, a neutral placeholder screen is shown.
export const phoneMockupSchema = z.object({
  screenImageSrc: z.string(), // e.g. "images/app-screen.png" ("" = none)
  screenVideoSrc: z.string(), // e.g. "videos/screen-recording.mp4" ("" = none)
  tiltIn: z.boolean(), // slight rotation as it enters
  float: z.boolean(), // gentle up/down movement after entering
  accentColor: z.string(),
  delay: z.number().int().min(0),
  exitFrame: z.number().int().min(0), // 0 = stays until the end
});

export type PhoneMockupProps = z.infer<typeof phoneMockupSchema> & {
  // Start the screen video this many frames in (keeps it in sync).
  screenTrimBeforeFrames?: number;
};

const PHONE_W = 540;
const PHONE_H = 1100;

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  screenImageSrc,
  screenVideoSrc,
  tiltIn,
  float,
  accentColor,
  delay,
  exitFrame,
  screenTrimBeforeFrames = 0,
}) => {
  const frame = useCurrentFrame();
  const enter = progress(frame, delay, 30);
  const out = exitProgress(frame, exitFrame);
  const bob = float ? Math.sin((frame - delay) / 25) * 10 * enter : 0;

  return (
    <Interactive.Div
      name="Phone mockup"
      style={{
        width: PHONE_W,
        height: PHONE_H,
        position: "relative",
        opacity: Math.min(1, enter * 1.4) * out,
        translate: `0px ${(1 - enter) * 400 + bob + (1 - out) * 120}px`,
        rotate: tiltIn ? `${(1 - enter) * -10}deg` : "0deg",
      }}
    >
      {/* Side buttons */}
      <div
        style={{
          position: "absolute",
          left: -8,
          top: 230,
          width: 8,
          height: 90,
          borderRadius: 4,
          backgroundColor: "#2a2a35",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -8,
          top: 300,
          width: 8,
          height: 140,
          borderRadius: 4,
          backgroundColor: "#2a2a35",
        }}
      />
      {/* Body */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 78,
          backgroundColor: "#121219",
          border: "3px solid #3a3a48",
          boxShadow: `0 40px 100px rgba(0,0,0,0.55), 0 0 80px ${accentColor}22`,
          padding: 18,
        }}
      >
        {/* Screen */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 62,
            overflow: "hidden",
            backgroundColor: "#0f0c29",
          }}
        >
          {screenVideoSrc ? (
            <Video
              name="Phone screen video"
              src={staticFile(screenVideoSrc)}
              trimBefore={
                screenTrimBeforeFrames > 0 ? screenTrimBeforeFrames : undefined
              }
              muted
              objectFit="cover"
              style={{ width: "100%", height: "100%" }}
            />
          ) : screenImageSrc ? (
            <Img
              src={staticFile(screenImageSrc)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <PlaceholderScreen accentColor={accentColor} />
          )}
          {/* Camera island */}
          <div
            style={{
              position: "absolute",
              top: 22,
              left: "50%",
              width: 150,
              height: 40,
              marginLeft: -75,
              borderRadius: 20,
              backgroundColor: "#000",
            }}
          />
        </div>
      </div>
    </Interactive.Div>
  );
};

// Generic feed layout with a soft shimmer, marking where screen content goes.
const PlaceholderScreen: React.FC<{ accentColor: string }> = ({
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const shimmer = (frame * 6) % 900;
  const block = (h: number, w = "100%", color = "rgba(255,255,255,0.08)") => (
    <div
      style={{ height: h, width: w, borderRadius: 18, backgroundColor: color }}
    />
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "90px 34px 34px",
        display: "flex",
        flexDirection: "column",
        gap: 22,
        background: theme.background,
      }}
    >
      <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: accentColor,
          }}
        />
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}
        >
          {block(22, "60%")}
          {block(18, "40%")}
        </div>
      </div>
      {block(420, "100%", `${accentColor}33`)}
      {block(26, "90%")}
      {block(26, "75%")}
      {block(26, "82%")}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
          translate: `${shimmer - 450}px 0px`,
        }}
      />
    </div>
  );
};
