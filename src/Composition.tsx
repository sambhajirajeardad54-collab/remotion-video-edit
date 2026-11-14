import { Composition, Folder } from "remotion";
import { TitleScene, titleSceneSchema } from "./TitleScene";
import {
  DocumentaryScene,
  documentarySceneSchema,
} from "./DocumentaryScene";
import { FullVideo } from "./FullVideo";

// Vertical 9:16 video (Reels / Shorts / TikTok).
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;

export const MyComposition = () => {
  return (
    <>
      {/* The complete video: title -> documentary -> end card. */}
      <Composition
        id="FullVideo"
        component={FullVideo}
        durationInFrames={510}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
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
