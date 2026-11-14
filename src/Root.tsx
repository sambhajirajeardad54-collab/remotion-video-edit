import { CalculateMetadataFunction, Composition, Folder } from "remotion";
import { detectAudioFiles } from "./audio/audioFiles";
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./data/videoConfig";
import {
  DocumentaryScene,
  documentarySceneSchema,
} from "./scenes/DocumentaryScene";
import { FullVideo, FullVideoProps, fullVideoSchema } from "./scenes/FullVideo";
import { TitleScene, titleSceneSchema } from "./scenes/TitleScene";
import { circlePresenterSchema } from "./components/CirclePresenter";
import { infographicSchema } from "./components/Infographic";
import { newsCardSchema } from "./components/NewsCard";
import { numberCounterSchema } from "./components/NumberCounter";
import { phoneMockupSchema } from "./components/PhoneMockup";
import {
  PresenterScene,
  presenterSceneSchema,
} from "./components/PresenterScene";
import { subtitlesSchema } from "./components/Subtitles";
import {
  CirclePresenterDemo,
  InfographicDemo,
  NewsCardDemo,
  NumberCounterDemo,
  PhoneMockupDemo,
  SubtitlesDemo,
} from "./scenes/ComponentDemos";
import { ComponentsShowcase } from "./scenes/ComponentsShowcase";
import { FullVideoSubtitled } from "./scenes/FullVideoSubtitled";
import { MpscHistoryVideo } from "./scenes/mpsc-history/MpscHistoryVideo";

// Before the video plays or renders, check which audio files exist in
// public/audio/. Missing files are skipped, so the video never breaks.
const detectFullVideoAudio: CalculateMetadataFunction<FullVideoProps> = async ({
  props,
}) => {
  const found = await detectAudioFiles();
  return {
    props: {
      ...props,
      voiceoverFound: found.voiceover,
      musicFound: found.music,
      sfxFound: found.sfx,
    },
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* The complete video: title -> documentary -> end card. */}
      <Composition
        id="FullVideo"
        component={FullVideo}
        schema={fullVideoSchema}
        calculateMetadata={detectFullVideoAudio}
        durationInFrames={654}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={{
          voiceoverEnabled: true,
          voiceoverVolume: 1,
          musicEnabled: true,
          musicVolume: 0.25,
          musicDuckedVolume: 0.12,
          sfxEnabled: true,
          sfxVolume: 0.5,
          voiceoverFound: false,
          musicFound: false,
          sfxFound: false,
        }}
      />

      {/* Same video with Reels-style Marathi subtitles (FullVideo unchanged). */}
      <Composition
        id="FullVideoSubtitled"
        component={FullVideoSubtitled}
        schema={fullVideoSchema}
        calculateMetadata={detectFullVideoAudio}
        durationInFrames={654}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={{
          voiceoverEnabled: true,
          voiceoverVolume: 1,
          musicEnabled: true,
          musicVolume: 0.25,
          musicDuckedVolume: 0.12,
          sfxEnabled: true,
          sfxVolume: 0.5,
          voiceoverFound: false,
          musicFound: false,
          sfxFound: false,
        }}
      />

      {/* Short tour of all reusable components (sample content only). */}
      <Composition
        id="ComponentsShowcase"
        component={ComponentsShowcase}
        durationInFrames={468}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      {/* MPSC गट-क · इतिहास: documentary edit of Sam's video (preview: first 18 s). */}
      <Folder name="MPSC-History">
        <Composition
          id="MpscHistoryPreview"
          component={MpscHistoryVideo}
          durationInFrames={540}
          fps={VIDEO_FPS}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
        />
      </Folder>

      {/* Individual scenes, for previewing and editing on their own. */}
      <Folder name="Scenes">
        <Composition
          id="TitleScene"
          component={TitleScene}
          schema={titleSceneSchema}
          durationInFrames={150}
          fps={VIDEO_FPS}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          defaultProps={{
            title: "Remotion Video Edit",
            subtitle: "Made with code",
            accentColor: "#38bdf8",
          }}
        />
        <Composition
          id="DocumentaryScene"
          component={DocumentaryScene}
          schema={documentarySceneSchema}
          durationInFrames={300}
          fps={VIDEO_FPS}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          defaultProps={{
            chapter: "Chapter 02",
            headline: "How this video was made",
            steps: [
              {
                title: "Write",
                description: "Every scene is a React component.",
              },
              {
                title: "Animate",
                description: "Motion is calculated frame by frame in code.",
              },
              {
                title: "Render",
                description: "The same code is exported as an MP4 video.",
              },
            ],
            footer: "Built with Remotion",
            accentColor: "#38bdf8",
          }}
        />
      </Folder>

      {/* Reusable components, each previewable and editable on its own. */}
      <Folder name="Components">
        <Composition
          id="PresenterScene"
          component={PresenterScene}
          schema={presenterSceneSchema}
          durationInFrames={150}
          fps={VIDEO_FPS}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          defaultProps={{
            presenterSrc: "",
            withAudio: true,
            layout: "full",
            name: "Sam Xplains",
            role: "आरोग्य · MPSC · चालू घडामोडी",
            accentColor: "#38bdf8",
            lowerThirdExitFrame: 0,
          }}
        />
        <Composition
          id="CirclePresenter"
          component={CirclePresenterDemo}
          schema={circlePresenterSchema}
          durationInFrames={120}
          fps={VIDEO_FPS}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          defaultProps={{
            presenterSrc: "",
            withAudio: true,
            position: "bottom-right",
            size: 300,
            ringColor: "#38bdf8",
            edgeOffset: 540,
            delay: 10,
            exitFrame: 0,
          }}
        />
        <Composition
          id="NewsCard"
          component={NewsCardDemo}
          schema={newsCardSchema}
          durationInFrames={150}
          fps={VIDEO_FPS}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          defaultProps={{
            category: "चालू घडामोडी",
            headline: "येथे बातमीचा मथळा येईल",
            summary:
              "हे नमुना कार्ड आहे. खरी बातमी, तिचा स्रोत आणि दिनांक येथे लिहा.",
            source: "नमुना स्रोत",
            date: "दिनांक",
            imageSrc: "",
            accentColor: "#38bdf8",
            delay: 8,
            exitFrame: 0,
          }}
        />
        <Composition
          id="NumberCounter"
          component={NumberCounterDemo}
          schema={numberCounterSchema}
          durationInFrames={120}
          fps={VIDEO_FPS}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          defaultProps={{
            value: 125000,
            rangeFrom: null,
            rangeSeparator: " ते ",
            decimals: 0,
            prefix: "",
            suffix: "",
            label: "नमुना आकडा (डेमो)",
            source: "डेमो — खरी आकडेवारी नाही",
            digits: "devanagari",
            accentColor: "#38bdf8",
            delay: 10,
            countDuration: 45,
            exitFrame: 0,
          }}
        />
        <Composition
          id="Infographic"
          component={InfographicDemo}
          schema={infographicSchema}
          durationInFrames={150}
          fps={VIDEO_FPS}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          defaultProps={{
            variant: "comparison",
            title: "तुलना (नमुना)",
            items: [
              { title: "पहिला मुद्दा", description: "थोडक्यात माहिती" },
              { title: "दुसरा मुद्दा", description: "थोडक्यात माहिती" },
              { title: "तिसरा मुद्दा", description: "थोडक्यात माहिती" },
            ],
            columns: [
              { heading: "आधी", points: ["मुद्दा एक", "मुद्दा दोन"] },
              { heading: "आता", points: ["मुद्दा एक", "मुद्दा दोन"] },
            ],
            accentColor: "#38bdf8",
            listIcon: "check",
            delay: 8,
            stagger: 14,
            exitFrame: 0,
          }}
        />
        <Composition
          id="PhoneMockup"
          component={PhoneMockupDemo}
          schema={phoneMockupSchema}
          durationInFrames={120}
          fps={VIDEO_FPS}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          defaultProps={{
            screenImageSrc: "",
            screenVideoSrc: "",
            tiltIn: true,
            float: true,
            accentColor: "#38bdf8",
            delay: 6,
            exitFrame: 0,
          }}
        />
        <Composition
          id="Subtitles"
          component={SubtitlesDemo}
          schema={subtitlesSchema}
          durationInFrames={150}
          fps={VIDEO_FPS}
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          defaultProps={{
            captions: [
              {
                text: "हा *महत्त्वाचा* शब्द हायलाइट होतो",
                startMs: 300,
                endMs: 2500,
              },
              {
                text: "मराठी उपशीर्षके — *मोठी आणि स्पष्ट*",
                startMs: 2600,
                endMs: 4900,
              },
            ],
            centerY: 1530,
            fontSize: 76,
            maxWidth: 960,
            highlightColor: "#facc15",
            highlightStyle: "box",
          }}
        />
      </Folder>
    </>
  );
};
