import { Composition } from "remotion";
import { TitleScene, titleSceneSchema } from "./TitleScene";
import {
  DocumentaryScene,
  documentarySceneSchema,
} from "./DocumentaryScene";

// Vertical 9:16 video (Reels / Shorts / TikTok).
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;

export const MyComposition = () => {
  return (
    <>
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
          headline: "How short video took over the internet",
          statValue: 82,
          statLabel: "of all internet traffic is now online video",
          chartTitle: "Daily minutes watched",
          bars: [
            { label: "2019", value: 84 },
            { label: "2022", value: 100 },
            { label: "2025", value: 118 },
          ],
          source: "Illustrative figures · Replace with your own data",
          accentColor: "#38bdf8",
        }}
      />
    </>
  );
};
