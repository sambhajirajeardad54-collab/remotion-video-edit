import { Composition } from "remotion";
import { TitleScene, titleSceneSchema } from "./TitleScene";

// Vertical 9:16 video (Reels / Shorts / TikTok).
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const VIDEO_FPS = 30;

export const MyComposition = () => {
  return (
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
  );
};
