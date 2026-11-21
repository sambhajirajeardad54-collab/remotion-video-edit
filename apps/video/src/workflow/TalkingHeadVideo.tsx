import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  interpolate,
  Sequence,
  staticFile,
  Track,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fileExists } from "../audio/audioFiles";
import { CircularPresenter } from "../components/CircularPresenter";
import { CommentCTA } from "../components/CommentCTA";
import { Infographic } from "../components/Infographic";
import { KineticHeadline } from "../components/KineticHeadline";
import { NumberCounter } from "../components/NumberCounter";
import { PhoneMockup } from "../components/PhoneMockup";
import { PresenterMedia } from "../components/PresenterMedia";
import { SceneBackground } from "../components/SceneBackground";
import { Subtitles } from "../components/Subtitles";
import { theme } from "../components/theme";
import { WhipFlash } from "../components/Transitions";
import { assertNotReference, rawVideoPath } from "./media";
import type { Overlay, ProjectConfig } from "./projectConfig";

// Reusable Sam Xplains talking-head video, built from a project config.
// The voice is ONE continuous track from your own recording; all picture
// changes are cuts at the same frame in footage and timeline, so lip sync
// can never drift.
const Y = theme.accent;
const MARGIN = 50;
const BOTTOM_SAFE = 250; // keep clear of Instagram's caption area

export const TalkingHeadVideo: React.FC<ProjectConfig> = (p) => {
  const raw = rawVideoPath(p.rawVideo);
  const cutaways = p.overlays.filter((o) => o.type === "phone-cutaway");
  const segments = presenterSegments(p.durationInFrames, cutaways);
  const useCutout = p.cutout !== "" && p.cutoutFound;
  const presenterSrc = useCutout ? p.cutout : raw;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.backgroundDeep }}>
      <SceneBackground spotlightY={45} />

      {/* Presenter: hidden during cutaways. */}
      {p.rawFound ? (
        segments.map(([start, end], i) => (
          <Sequence key={i} from={start} durationInFrames={end - start}>
            {p.layout === "circle" ? (
              <CircularPresenter
                {...circleGeometry(p)}
                src={presenterSrc}
                trimBeforeFrames={start}
                sourceWidth={p.sourceWidth}
                sourceHeight={p.sourceHeight}
                faceX={p.headX}
                faceY={p.headY}
                faceAt={0.5}
                scale={useCutout ? p.circle.scale : undefined}
                fill={1.05}
                fadeBottomFrom={useCutout ? 0.9 : undefined}
                exitAt={end - start - 12}
              />
            ) : (
              <PresenterMedia
                presenterSrc={raw}
                foregroundSrc={useCutout ? p.cutout : undefined}
                withAudio={false}
                trimBeforeFrames={start}
                sourceAspect={p.sourceHeight / p.sourceWidth}
                containerHeight={1920}
                faceY={p.headY}
                baseZoom={1.05}
                zoom={0.04}
                durationInFrames={end - start}
              />
            )}
          </Sequence>
        ))
      ) : (
        <PresenterMedia presenterSrc="" withAudio={false} />
      )}

      {p.overlays.map((o, i) => (
        <Sequence
          key={i}
          name={`${o.type} ${i + 1}`}
          from={o.from}
          durationInFrames={o.durationInFrames}
        >
          <OverlayView overlay={o} raw={raw} rawFound={p.rawFound} />
        </Sequence>
      ))}

      {/* Light-streak transition on every cut into and out of a cutaway. */}
      {cutaways.flatMap((c, i) => [
        <Sequence
          key={`in${i}`}
          from={Math.max(0, c.from - 8)}
          durationInFrames={16}
        >
          <WhipFlash />
        </Sequence>,
        <Sequence
          key={`out${i}`}
          from={c.from + c.durationInFrames - 8}
          durationInFrames={16}
        >
          <WhipFlash />
        </Sequence>,
      ])}

      <Subtitles
        captions={p.captions}
        centerY={p.captionY}
        zones={cutaways.map((c) => ({
          fromMs: (c.from / 30) * 1000,
          toMs: ((c.from + c.durationInFrames) / 30) * 1000,
          centerY: 1560,
        }))}
        fontSize={72}
        maxWidth={960}
        highlightColor={Y}
        highlightStyle="text"
      />

      {p.rawFound ? (
        <ProjectAudio voice={p.voice || raw} musicVolume={p.musicVolume} />
      ) : null}
    </AbsoluteFill>
  );
};

// Before rendering: check the raw video and cutout exist (fresh clones do
// not contain large videos), and log what will be used.
export const calculateProjectMetadata: CalculateMetadataFunction<
  ProjectConfig
> = async ({ props }) => {
  const rawFound = await fileExists(rawVideoPath(props.rawVideo));
  const cutoutFound = props.cutout !== "" && (await fileExists(props.cutout));
  if (!rawFound) {
    console.warn(
      `${props.title}: public/${rawVideoPath(props.rawVideo)} not found, showing a placeholder.`,
    );
  }
  return {
    durationInFrames: props.durationInFrames,
    props: { ...props, rawFound, cutoutFound },
  };
};

const circleGeometry = (p: ProjectConfig) => {
  const d = p.circle.diameter;
  const outer = d / 2 + 10; // ring
  const centerY = 1920 - BOTTOM_SAFE - outer;
  const centerX =
    p.circle.position === "bottom-right"
      ? 1080 - MARGIN - outer
      : p.circle.position === "bottom-left"
        ? MARGIN + outer
        : 540;
  return {
    diameter: d,
    centerX,
    centerY: p.circle.position === "center" ? 1090 : centerY,
  };
};

// Presenter is visible everywhere except during phone cutaways.
const presenterSegments = (
  total: number,
  cutaways: Overlay[],
): [number, number][] => {
  const sorted = [...cutaways].sort((a, b) => a.from - b.from);
  const out: [number, number][] = [];
  let t = 0;
  for (const c of sorted) {
    if (c.from > t) out.push([t, c.from]);
    t = Math.max(t, c.from + c.durationInFrames);
  }
  if (t < total) out.push([t, total]);
  return out;
};

const TopArea: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ alignItems: "center", padding: "210px 70px 0" }}>
    {children}
  </AbsoluteFill>
);

const OverlayView: React.FC<{
  overlay: Overlay;
  raw: string;
  rawFound: boolean;
}> = ({ overlay: o, raw, rawFound }) => {
  const exit = o.durationInFrames - 10;
  switch (o.type) {
    case "headline":
      return (
        <TopArea>
          <KineticHeadline
            kicker={o.kicker}
            text={o.text}
            icon={o.icon}
            fontSize={92}
            align="left"
            accentColor={Y}
            delay={0}
            exitFrame={exit}
          />
        </TopArea>
      );
    case "list":
      return (
        <TopArea>
          <Infographic
            variant={o.style}
            title=""
            items={o.items.map((t) => ({ title: t, description: "" }))}
            columns={[]}
            accentColor={Y}
            listIcon={o.icon}
            delay={0}
            stagger={o.stagger}
            exitFrame={exit}
          />
        </TopArea>
      );
    case "counter":
      return (
        <TopArea>
          <NumberCounter
            value={o.value}
            rangeFrom={o.rangeFrom}
            rangeSeparator=" ते "
            decimals={0}
            prefix=""
            suffix=""
            label={o.label}
            source={o.source}
            digits="latin"
            accentColor={Y}
            delay={0}
            countDuration={18}
            exitFrame={exit}
          />
        </TopArea>
      );
    case "cta":
      return (
        <TopArea>
          <CommentCTA
            variant={o.variant}
            label={o.label}
            text={o.text}
            accentColor={Y}
            delay={0}
            exitFrame={exit}
          />
        </TopArea>
      );
    case "phone-cutaway":
      return (
        <AbsoluteFill style={{ backgroundColor: theme.backgroundDeep }}>
          <SceneBackground />
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
            <div style={{ scale: "0.85", transformOrigin: "top center" }}>
              <PhoneMockup
                screenImageSrc=""
                screenVideoSrc={rawFound ? raw : ""}
                screenTrimBeforeFrames={o.from}
                tiltIn
                float={false}
                accentColor={Y}
                delay={0}
                exitFrame={0}
              />
            </div>
          </AbsoluteFill>
          {o.label ? (
            <div
              style={{
                position: "absolute",
                top: 130,
                left: 70,
                padding: "8px 24px",
                borderLeft: `8px solid ${Y}`,
                backgroundColor: "rgba(4,7,15,0.75)",
                fontFamily: theme.fontFamily,
                fontSize: 34,
                fontWeight: 700,
                color: theme.text,
              }}
            >
              {o.label}
            </div>
          ) : null}
        </AbsoluteFill>
      );
  }
};

const ProjectAudio: React.FC<{ voice: string; musicVolume: number }> = ({
  voice,
  musicVolume,
}) => {
  assertNotReference(voice, "Voiceover");
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fade = interpolate(
    frame,
    [0, fps, durationInFrames - fps, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <>
      <Track name="Voice (your recording)">
        <Audio name="Sam voice" src={staticFile(voice)} />
      </Track>
      {musicVolume > 0 ? (
        <Track name="Music">
          <Audio
            name="Background music"
            src={staticFile("audio/music/background-music.mp3")}
            loop
            volume={musicVolume * fade}
          />
        </Track>
      ) : null}
    </>
  );
};
