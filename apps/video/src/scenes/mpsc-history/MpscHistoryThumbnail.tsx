import { AbsoluteFill, Img, staticFile } from "remotion";
import { CommentCTA } from "../../components/CommentCTA";
import { Infographic } from "../../components/Infographic";
import { KineticHeadline } from "../../components/KineticHeadline";
import { SceneBackground } from "../../components/SceneBackground";
import { theme } from "../../components/theme";

// Cover / thumbnail for the MPSC गट-C · इतिहास video (1080 x 1920).
// Every fact matches what Sam says in the video:
//   "जवळपास 12 ते 13 क्वेश्चन", "एकाच बुकमधून", "ओल्ड महाराष्ट्र स्टेट बोर्डचं बुक",
//   topics: समाजसुधारक, ब्रिटिशकालीन भारत, महाराष्ट्रातील चळवळी,
//   "कमेंटमध्ये PDF… टाइप करा", "Sam Xplains चॅनलला फॉलो".
// Animated over 60 frames; the still thumbnail is the last frame.
// Key text stays inside the centre 1080 x 1350 band (profile-grid crop).
const Y = theme.accent;

export const MpscHistoryThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <SceneBackground spotlightY={52} />

      {/* Presenter cut-out (from the video at 19.0 s), lower right. */}
      <Img
        src={staticFile("images/mpsc-history/presenter-thumb.png")}
        style={{
          position: "absolute",
          width: 760,
          right: -190,
          bottom: -340,
          filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))",
        }}
      />

      {/* Brand line: follow call-to-action from the video. */}
      <div
        style={{
          position: "absolute",
          top: 190,
          left: 60,
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 38,
          fontWeight: 800,
          color: theme.text,
        }}
      >
        <div
          style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: Y }}
        />
        Sam Xplains · फॉलो करा
      </div>

      <AbsoluteFill style={{ padding: "300px 60px 0", gap: 26 }}>
        <KineticHeadline
          kicker="MPSC गट-C परीक्षा"
          text="*इतिहास* विभाग"
          icon="none"
          fontSize={150}
          align="left"
          accentColor={Y}
          delay={0}
          exitFrame={0}
        />

        <StatLine />

        <div style={{ marginTop: 10 }}>
          <KineticHeadline
            kicker=""
            text="फक्त *1 पुस्तक* पुरेसं!"
            icon="book"
            fontSize={74}
            align="left"
            accentColor={Y}
            delay={10}
            exitFrame={0}
          />
          <div
            style={{
              marginTop: 6,
              marginLeft: 108,
              fontSize: 40,
              fontWeight: 700,
              color: theme.text,
              textShadow: theme.textOutline,
            }}
          >
            ओल्ड महाराष्ट्र स्टेट बोर्ड पुस्तक
          </div>
        </div>

        <div style={{ width: 600, marginTop: 14 }}>
          <Infographic
            variant="chips"
            title=""
            items={[
              { title: "समाजसुधारक", description: "" },
              { title: "ब्रिटिशकालीन भारत", description: "" },
              { title: "महाराष्ट्रातील चळवळी", description: "" },
            ]}
            columns={[]}
            accentColor={Y}
            listIcon="check"
            delay={0}
            stagger={6}
            exitFrame={0}
          />
        </div>
      </AbsoluteFill>

      {/* Calls to action, above the bottom app-UI area. */}
      <AbsoluteFill
        style={{
          top: 1500,
          alignItems: "center",
          gap: 18,
        }}
      >
        <CommentCTA
          variant="comment"
          label="PDF हवी असल्यास कमेंटमध्ये लिहा"
          text="PDF"
          accentColor={Y}
          delay={0}
          exitFrame={0}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const StatLine: React.FC = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 22,
      alignSelf: "flex-start",
      padding: "14px 30px",
      borderRadius: 24,
      backgroundColor: "rgba(10,20,40,0.9)",
      border: `3px solid ${Y}`,
    }}
  >
    <div style={{ fontSize: 46, fontWeight: 700, color: theme.text }}>
      एकूण प्रश्न: जवळपास
    </div>
    <div style={{ fontSize: 84, fontWeight: 800, color: Y, lineHeight: 1 }}>
      12 ते 13
    </div>
  </div>
);
