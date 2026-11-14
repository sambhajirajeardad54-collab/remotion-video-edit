import { CalculateMetadataFunction, Composition, Folder } from "remotion";
import { detectAudioFiles } from "./audio/audioFiles";
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "./data/videoConfig";
import { DocumentaryScene, documentarySceneSchema } from "./scenes/DocumentaryScene";
import { FullVideo, FullVideoProps, fullVideoSchema } from "./scenes/FullVideo";
import { TitleScene, titleSceneSchema } from "./scenes/TitleScene";

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
    </>
  );
};
