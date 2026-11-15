import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  Track,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrollScene } from "../../components/BrollScene";
import { CommentCTA } from "../../components/CommentCTA";
import { Infographic } from "../../components/Infographic";
import { KineticHeadline } from "../../components/KineticHeadline";
import { NumberCounter } from "../../components/NumberCounter";
import { PhoneMockup } from "../../components/PhoneMockup";
import {
  CircleNameplate,
  CircularPresenter,
} from "../../components/CircularPresenter";
import { SceneBackground } from "../../components/SceneBackground";
import { Subtitles } from "../../components/Subtitles";
import { theme } from "../../components/theme";
import { DipToBlack, WhipFlash } from "../../components/Transitions";
import {
  MPSC_HISTORY_CAPTIONS,
  MPSC_HISTORY_CAPTIONS_HOOK,
} from "../../data/mpscHistory";

// MPSC गट-क · इतिहास विभाग: documentary edit of Sam's original video.
//
// The original voice plays as ONE continuous track. The talking head is shown
// in a fixed circle (CircularPresenter) whose footage is trimmed to the same
// frame as the timeline, with overlay transitions on top, so sync can never
// drift.
//
// Full length: 1290 frames (43 s). Timings come from the word timestamps.
const SOURCE = "videos/mpsc-history/source.mp4";
// Presenter with the background removed (transparent WebM, same timing).
const CUTOUT = "videos/mpsc-history/presenter-cutout.webm";
const Y = theme.accent; // yellow

// The circular talking head: fixed in the bottom-right corner.
// Framing measured from the footage (median over 76 samples, source px):
// hair top y 438, chin ≈ y 1050, face centre x 420 → head centre (420, 744).
// At scale 0.42 the 610 px head is ≈ 255 px tall in the 420 px circle, so the
// whole head, hair, ears, chin and upper shoulders stay inside the circle.
const CIRCLE = {
  src: CUTOUT,
  diameter: 420,
  centerX: 1080 - 50 - 220, // 50 px right margin (ring included)
  centerY: 1920 - 250 - 220, // 250 px bottom margin, clear of app UI
  sourceWidth: 864,
  sourceHeight: 1920,
  faceX: 420 / 864,
  faceY: 744 / 1920,
  faceAt: 0.5, // head centred in the circle
  scale: 0.42,
  // Shoulders fade softly into the studio gradient at the bottom (this also
  // keeps the original video's burned-in poster at 0-3 s out of the circle).
  fadeBottomFrom: 0.9,
};
// Name plate to the left of the circle, level with its centre.
const NAMEPLATE_LEFT = 60;
const NAMEPLATE_TOP = CIRCLE.centerY - 36;
// Subtitles sit in the middle of the screen, above the circle; during the
// PDF phone scene (no circle) they return to the lower-middle.
const SUBTITLE_Y = 1080;
const SUBTITLE_ZONES = [{ fromMs: 12600, toMs: 15600, centerY: 1560 }];

export const MpscHistoryVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.backgroundDeep }}>
      {/* Studio backdrop for all presenter sections (C and I cover it). */}
      <SceneBackground spotlightY={45} />

      {/* A · 0.0-4.8 s · Hook: "MPSC ग्रुप C… जवळपास 12 ते 13 क्वेश्चन" */}
      <Sequence name="A · Hook" durationInFrames={144}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
            }}
          >
            <KineticHeadline
              kicker="MPSC गट-C परीक्षा"
              text="*इतिहास* विभाग"
              icon="target"
              fontSize={120}
              align="center"
              accentColor={Y}
              delay={4}
              exitFrame={0}
            />
            <NumberCounter
              value={13}
              rangeFrom={12}
              rangeSeparator=" ते "
              decimals={0}
              prefix=""
              suffix=""
              label="प्रश्न (जवळपास)"
              source="Sam Xplains"
              digits="latin"
              accentColor={Y}
              delay={95}
              countDuration={18}
              exitFrame={0}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* B · 4.8-12.6 s · "एकाच बुकमधून… ओल्ड महाराष्ट्र स्टेट बोर्ड… नेटवर अवेलेबल नाही" */}
      <Sequence name="B · One book" from={144} durationInFrames={234}>
        <TopOverlay>
          <Sequence from={42} durationInFrames={58} layout="none">
            <KineticHeadline
              kicker=""
              text="*एकाच* बुकमधून सोडवा!"
              icon="none"
              fontSize={104}
              align="center"
              accentColor={Y}
              delay={0}
              exitFrame={48}
            />
          </Sequence>
          <Sequence from={90} durationInFrames={60} layout="none">
            <KineticHeadline
              kicker="पुस्तक"
              text="*ओल्ड* महाराष्ट्र स्टेट बोर्ड"
              icon="book"
              fontSize={84}
              align="left"
              accentColor={Y}
              delay={0}
              exitFrame={50}
            />
          </Sequence>
          <Sequence from={150} durationInFrames={84} layout="none">
            <Infographic
              variant="list"
              title=""
              items={[
                { title: "नेटवर कुठेही उपलब्ध नाही", description: "" },
                { title: "टेलिग्रामवर लिंक मिळत नाही", description: "" },
              ]}
              columns={[]}
              accentColor={Y}
              listIcon="cross"
              delay={1}
              stagger={21}
              exitFrame={78}
            />
          </Sequence>
        </TopOverlay>
      </Sequence>

      {/* C · 12.6-15.6 s · Original cutaway to the book PDF, now in a phone */}
      <Sequence name="C · Book PDF" from={378} durationInFrames={90}>
        <BrollScene
          src={SOURCE}
          mediaType="video"
          trimBeforeFrames={378}
          zoomFrom={1.3}
          zoomTo={1.38}
          panX={0}
          panY={-2}
          blur={22}
          darken={0.65}
          label="पुस्तकातील एक पान"
          accentColor={Y}
        >
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 265 }}>
            <div style={{ scale: "0.85", transformOrigin: "top center" }}>
              <PhoneMockup
                screenImageSrc=""
                screenVideoSrc={SOURCE}
                screenTrimBeforeFrames={378}
                tiltIn
                float={false}
                accentColor={Y}
                delay={0}
                exitFrame={0}
              />
            </div>
          </AbsoluteFill>
          <AbsoluteFill style={{ alignItems: "center", top: 1225 }}>
            <CommentCTA
              variant="comment"
              label="कमेंटमध्ये टाइप करा"
              text="PDF"
              accentColor={Y}
              delay={58}
              exitFrame={0}
            />
          </AbsoluteFill>
        </BrollScene>
      </Sequence>

      {/* D · 15.6-18.0 s · "डायरेक्ट तुमच्या DM मध्ये पाठवून देतो" */}
      <Sequence name="D · DM" from={468} durationInFrames={72}>
        <TopOverlay>
          <CommentCTA
            variant="dm"
            label="थेट तुमच्या DM मध्ये"
            text="PDF पाठवतो"
            accentColor={Y}
            delay={24}
            exitFrame={0}
          />
        </TopOverlay>
      </Sequence>

      {/* E · 18.1-24.4 s · "यामध्ये दिलेलं काय… समाजसुधारक, ब्रिटिशकालीन भारत,
          महाराष्ट्रातील चळवळी… हे सगळं यामध्ये कव्हर केलेलं आहे" */}
      <Sequence
        name="E · What the book covers"
        from={543}
        durationInFrames={189}
      >
        <TopOverlay>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 34,
              width: 940,
            }}
          >
            <KineticHeadline
              kicker="या पुस्तकात"
              text="काय *कव्हर* केलं आहे?"
              icon="book"
              fontSize={78}
              align="left"
              accentColor={Y}
              delay={0}
              exitFrame={0}
            />
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
              delay={25}
              stagger={39}
              exitFrame={0}
            />
          </div>
        </TopOverlay>
      </Sequence>

      {/* F · 24.4-29.8 s · "तर हे बुकसाठी… Sam Xplains चॅनलला फॉलो केलं पाहिजे,
          तरच PDF… DM…" (same cutout framing as E, so no visible cut) */}
      <Sequence name="F · Follow for PDF" from={732} durationInFrames={162}>
        <TopOverlay>
          <Sequence from={42} durationInFrames={48} layout="none">
            <CommentCTA
              variant="follow"
              label="आधी हे करा"
              text="Sam Xplains"
              accentColor={Y}
              delay={0}
              exitFrame={44}
            />
          </Sequence>
          <Sequence from={90} durationInFrames={72} layout="none">
            <CommentCTA
              variant="dm"
              label="तरच"
              text="PDF मिळेल DM मध्ये"
              accentColor={Y}
              delay={0}
              exitFrame={62}
            />
          </Sequence>
        </TopOverlay>
      </Sequence>

      {/* G · 29.8-35.5 s · "हिस्ट्री हा खूप हाय स्कोरिंग सब्जेक्ट… एक बुक
          रेफर केलं…" Real camera shot with a slow documentary push-in. */}
      <Sequence name="G · High scoring" from={894} durationInFrames={171}>
        <TopOverlay>
          <Sequence from={18} durationInFrames={75} layout="none">
            <KineticHeadline
              kicker="MPSC · इतिहास"
              text="*हिस्ट्री* = हाय स्कोरिंग विषय"
              icon="target"
              fontSize={86}
              align="left"
              accentColor={Y}
              delay={0}
              exitFrame={66}
            />
          </Sequence>
          <Sequence from={96} durationInFrames={75} layout="none">
            <KineticHeadline
              kicker=""
              text="*एक पुस्तक* → हाय स्कोर"
              icon="book"
              fontSize={96}
              align="left"
              accentColor={Y}
              delay={0}
              exitFrame={0}
            />
          </Sequence>
        </TopOverlay>
      </Sequence>

      {/* H · 35.5-41.5 s · Outro: "…कशी वाटते?… Sam Xplains चॅनलला फॉलो
          करायला विसरू नका." */}
      <Sequence name="H · Outro" from={1065} durationInFrames={180}>
        <TopOverlay>
          <Sequence from={128} durationInFrames={52} layout="none">
            <CommentCTA
              variant="follow"
              label="विसरू नका!"
              text="Sam Xplains"
              accentColor={Y}
              delay={0}
              exitFrame={0}
            />
          </Sequence>
        </TopOverlay>
      </Sequence>

      {/* I · 41.5-43.0 s · End card (no speech) */}
      <Sequence name="I · End card" from={1245} durationInFrames={45}>
        <EndCard />
      </Sequence>

      {/* Talking head in a fixed circle: 0-12.6 s, then (after the PDF
          cutaway) 15.6-41.5 s. Hidden during C and the end card. */}
      <Sequence name="Circle · A-B" durationInFrames={378}>
        <CircularPresenter {...CIRCLE} exitAt={366} />
      </Sequence>
      <Sequence name="Circle · D-H" from={468} durationInFrames={777}>
        <CircularPresenter {...CIRCLE} trimBeforeFrames={468} exitAt={765} />
      </Sequence>
      <Sequence name="Name · B" from={156} durationInFrames={98}>
        <CircleNameplate
          name="Sam Xplains"
          role="MPSC · इतिहास"
          centerX={NAMEPLATE_LEFT}
          top={NAMEPLATE_TOP}
          align="left"
          exitAt={88}
        />
      </Sequence>
      <Sequence name="Name · H" from={1077} durationInFrames={93}>
        <CircleNameplate
          name="Sam Xplains"
          role="MPSC · इतिहास"
          centerX={NAMEPLATE_LEFT}
          top={NAMEPLATE_TOP}
          align="left"
          exitAt={83}
        />
      </Sequence>

      {/* Transitions over the cuts (do not change timing). */}
      <Sequence name="Whip · D→E" from={535} durationInFrames={16}>
        <WhipFlash />
      </Sequence>
      <Sequence name="Whip · F→G" from={886} durationInFrames={16}>
        <WhipFlash />
      </Sequence>
      <Sequence name="Whip · G→H" from={1057} durationInFrames={16}>
        <WhipFlash />
      </Sequence>
      <Sequence name="Whip · A→B" from={136} durationInFrames={16}>
        <WhipFlash />
      </Sequence>
      <Sequence name="Whip · B→C" from={370} durationInFrames={16}>
        <WhipFlash />
      </Sequence>
      <Sequence name="Dip · C→D" from={463} durationInFrames={10}>
        <DipToBlack />
      </Sequence>

      {/* Subtitles: middle of the screen, above the circle (lower during C). */}
      <Subtitles
        captions={MPSC_HISTORY_CAPTIONS_HOOK}
        centerY={SUBTITLE_Y}
        zones={SUBTITLE_ZONES}
        fontSize={72}
        maxWidth={960}
        highlightColor={Y}
        highlightStyle="text"
      />
      <Subtitles
        captions={MPSC_HISTORY_CAPTIONS}
        centerY={SUBTITLE_Y}
        zones={SUBTITLE_ZONES}
        fontSize={72}
        maxWidth={960}
        highlightColor={Y}
        highlightStyle="text"
      />

      <MpscAudio />
    </AbsoluteFill>
  );
};

// Upper area for graphics, kept clear of the face (~860 px) and subtitles.
const TopOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      paddingTop: 210,
      paddingLeft: 70,
      paddingRight: 70,
    }}
  >
    {children}
  </AbsoluteFill>
);

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <SceneBackground spotlightY={42} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
          paddingBottom: 200,
        }}
      >
        <KineticHeadline
          kicker="MPSC · इतिहास"
          text="*Sam Xplains*"
          icon="none"
          fontSize={130}
          align="center"
          accentColor={Y}
          delay={2}
          exitFrame={0}
        />
        <CommentCTA
          variant="follow"
          label=""
          text="फॉलो करा"
          accentColor={Y}
          delay={10}
          exitFrame={0}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const MpscAudio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const musicFade = interpolate(
    frame,
    [0, fps, durationInFrames - fps, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <>
      <Track name="Voice (original)">
        <Audio
          name="Sam voice"
          src={staticFile("audio/mpsc-history/voice.mp3")}
        />
      </Track>
      <Track name="Music">
        <Audio
          name="Background music"
          src={staticFile("audio/music/background-music.mp3")}
          loop
          volume={0.1 * musicFade}
        />
      </Track>
      <Track name="SFX - Transitions">
        <Audio
          name="Whoosh A→B"
          src={staticFile("audio/sfx/whoosh.mp3")}
          from={130}
          durationInFrames={30}
          volume={0.3}
        />
        <Audio
          name="Whoosh B→C"
          src={staticFile("audio/sfx/whoosh.mp3")}
          from={364}
          durationInFrames={30}
          volume={0.3}
        />
        <Audio
          name="Whoosh D→E"
          src={staticFile("audio/sfx/whoosh.mp3")}
          from={529}
          durationInFrames={30}
          volume={0.3}
        />
        <Audio
          name="Whoosh F→G"
          src={staticFile("audio/sfx/whoosh.mp3")}
          from={880}
          durationInFrames={30}
          volume={0.3}
        />
        <Audio
          name="Whoosh G→H"
          src={staticFile("audio/sfx/whoosh.mp3")}
          from={1051}
          durationInFrames={30}
          volume={0.3}
        />
      </Track>
      <Track name="SFX - Accents">
        <Audio
          name="Impact - counter"
          src={staticFile("audio/sfx/impact-soft.mp3")}
          from={95}
          durationInFrames={48}
          volume={0.22}
        />
        <Audio
          name="Tick - one book"
          src={staticFile("audio/sfx/tick.mp3")}
          from={186}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - book title"
          src={staticFile("audio/sfx/tick.mp3")}
          from={234}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - not online"
          src={staticFile("audio/sfx/tick.mp3")}
          from={315}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - no Telegram"
          src={staticFile("audio/sfx/tick.mp3")}
          from={336}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - comment"
          src={staticFile("audio/sfx/tick.mp3")}
          from={436}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - DM"
          src={staticFile("audio/sfx/tick.mp3")}
          from={492}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - topic 1"
          src={staticFile("audio/sfx/tick.mp3")}
          from={588}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - topic 2"
          src={staticFile("audio/sfx/tick.mp3")}
          from={627}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - topic 3"
          src={staticFile("audio/sfx/tick.mp3")}
          from={666}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - follow"
          src={staticFile("audio/sfx/tick.mp3")}
          from={774}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - DM PDF"
          src={staticFile("audio/sfx/tick.mp3")}
          from={822}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - high scoring"
          src={staticFile("audio/sfx/tick.mp3")}
          from={912}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - one book"
          src={staticFile("audio/sfx/tick.mp3")}
          from={990}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - follow outro"
          src={staticFile("audio/sfx/tick.mp3")}
          from={1193}
          durationInFrames={8}
          volume={0.2}
        />
        <Audio
          name="Tick - follow pressed"
          src={staticFile("audio/sfx/tick.mp3")}
          from={796}
          durationInFrames={8}
          volume={0.25}
        />
        <Audio
          name="Tick - follow pressed outro"
          src={staticFile("audio/sfx/tick.mp3")}
          from={1215}
          durationInFrames={8}
          volume={0.25}
        />
        <Audio
          name="Impact - end card"
          src={staticFile("audio/sfx/impact-soft.mp3")}
          from={1247}
          durationInFrames={43}
          volume={0.22}
        />
      </Track>
    </>
  );
};
