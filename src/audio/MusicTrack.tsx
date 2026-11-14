import { Audio } from "@remotion/media";
import {
  interpolate,
  staticFile,
  Track,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AUDIO_FILES } from "./audioFiles";

// Background music (public/audio/music/background-music.mp3).
// Loops if shorter than the video, fades in and out, and stays quiet
// underneath the voice. Kept separate from the voiceover on purpose.
export const MusicTrack: React.FC<{ volume: number }> = ({ volume }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <Track name="Music">
      <Audio
        name="Background music"
        src={staticFile(AUDIO_FILES.music)}
        loop
        volume={
          volume *
          interpolate(
            frame,
            [0, 1 * fps, durationInFrames - 1.5 * fps, durationInFrames],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
    </Track>
  );
};
