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
import { PresenterScene } from "../../components/PresenterScene";
import { Subtitles } from "../../components/Subtitles";
import { theme } from "../../components/theme";
import { DipToBlack, WhipFlash } from "../../components/Transitions";
import {
  MPSC_HISTORY_CAPTIONS,
  MPSC_HISTORY_CAPTIONS_HOOK,
} from "../../data/mpscHistory";

// MPSC गट-क · इतिहास विभाग: documentary edit of Sam's original video.
//
// The original voice plays as ONE continuous track. Picture edits are cuts
// at the same frame in both footage and timeline (trimBeforeFrames = cut
// frame), with overlay transitions on top, so sync can never drift.
//
// PREVIEW: frames 0-732 (0-24.4 s). Timings come from the word timestamps.
const SOURCE = "videos/mpsc-history/source.mp4";
const SOURCE_ASPECT = 1920 / 864; // source footage is 864 x 1920
const FACE_Y = 0.36; // face centre, as a fraction of source height
// Presenter with the background removed (transparent WebM, same timing).
const CUTOUT = "videos/mpsc-history/presenter-cutout.webm";
const Y = theme.accent; // yellow

export const MpscHistoryVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.backgroundDeep }}>
      {/* A · 0.0-4.8 s · Hook: "MPSC ग्रुप C… जवळपास 12 ते 13 क्वेश्चन" */}
      <Sequence name="A · Hook" durationInFrames={144}>
        <PresenterScene
          presenterSrc={SOURCE}
          withAudio={false}
          layout="top-half"
          name=""
          role=""
          accentColor={Y}
          lowerThirdExitFrame={0}
          sourceAspect={SOURCE_ASPECT}
          faceY={FACE_Y}
          baseZoom={1}
          zoom={0.08}
          zoomDurationInFrames={144}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 50,
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
        </PresenterScene>
      </Sequence>

      {/* B · 4.8-12.6 s · "एकाच बुकमधून… ओल्ड महाराष्ट्र स्टेट बोर्ड… नेटवर अवेलेबल नाही" */}
      <Sequence name="B · One book" from={144} durationInFrames={234}>
        <PresenterScene
          presenterSrc={SOURCE}
          withAudio={false}
          layout="full"
          name="Sam Xplains"
          role="MPSC · इतिहास मार्गदर्शन"
          accentColor={Y}
          lowerThirdExitFrame={100}
          trimBeforeFrames={144}
          sourceAspect={SOURCE_ASPECT}
          faceY={FACE_Y}
          baseZoom={1.12}
          zoom={0.12}
          zoomDurationInFrames={234}
        >
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
        </PresenterScene>
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
        <PresenterScene
          presenterSrc={SOURCE}
          withAudio={false}
          layout="full"
          name=""
          role=""
          accentColor={Y}
          lowerThirdExitFrame={0}
          trimBeforeFrames={468}
          sourceAspect={SOURCE_ASPECT}
          faceY={FACE_Y}
          foregroundSrc={CUTOUT}
          baseZoom={1.22}
          zoom={0.05}
          zoomDurationInFrames={72}
        >
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
        </PresenterScene>
      </Sequence>

      {/* E · 18.1-24.4 s · "यामध्ये दिलेलं काय… समाजसुधारक, ब्रिटिशकालीन भारत,
          महाराष्ट्रातील चळवळी… हे सगळं यामध्ये कव्हर केलेलं आहे" */}
      <Sequence
        name="E · What the book covers"
        from={543}
        durationInFrames={189}
      >
        <PresenterScene
          presenterSrc={SOURCE}
          withAudio={false}
          layout="full"
          name=""
          role=""
          accentColor={Y}
          lowerThirdExitFrame={0}
          trimBeforeFrames={543}
          sourceAspect={SOURCE_ASPECT}
          faceY={FACE_Y}
          foregroundSrc={CUTOUT}
          anchorBottom
          baseZoom={0.8}
          zoom={0.03}
          zoomDurationInFrames={189}
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
                variant="list"
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
        </PresenterScene>
      </Sequence>

      {/* Transitions over the cuts (do not change timing). */}
      <Sequence name="Whip · D→E" from={535} durationInFrames={16}>
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

      {/* Subtitles: higher during the split-screen hook, lower-middle after. */}
      <Subtitles
        captions={MPSC_HISTORY_CAPTIONS_HOOK}
        centerY={945}
        fontSize={62}
        maxWidth={960}
        highlightColor={Y}
        highlightStyle="text"
      />
      <Subtitles
        captions={MPSC_HISTORY_CAPTIONS}
        centerY={1560}
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
      </Track>
    </>
  );
};
