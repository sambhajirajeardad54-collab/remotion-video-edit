import { Audio } from "@remotion/media";
import {
  interpolate,
  staticFile,
  Track,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AUDIO_FILES } from "./audioFiles";

// When the narration plays, in video frames (start, end).
// These match the clips in VoiceoverTrack.tsx. If you move a voice clip,
// update its window here too so the music ducks at the right moment.
const NARRATION_WINDOWS: [number, number][] = [
  [12, 132], // VO 1 - Opening title
  [143, 222], // VO 2 - Headline
  [225, 314], // VO 3 - Step 01 Write
  [318, 390], // VO 4 - Step 02 Animate
  [393, 487], // VO 5 - Step 03 Render
  [497, 631], // VO 6 - End card
];

// Background music (public/audio/music/background-music.mp3), an original
// composition (see scripts/generate-background-music.py).
//
// - volume:        music level when nobody is speaking
// - duckedVolume:  music level underneath the narration (ducking)
// - Ducking starts 0.3 s before each line and recovers 0.6 s after it,
//   so the music never jumps abruptly.
// - Fades in over the first 1.5 s and out over the last 2 s.
export const MusicTrack: React.FC<{
  volume: number;
  duckedVolume: number;
}> = ({ volume, duckedVolume }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const duck = Math.max(
    0,
    ...NARRATION_WINDOWS.map(([start, end]) =>
      interpolate(
        frame,
        [start - 0.3 * fps, start, end, end + 0.6 * fps],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      ),
    ),
  );

  const fade = interpolate(
    frame,
    [0, 1.5 * fps, durationInFrames - 2 * fps, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <Track name="Music">
      <Audio
        name="Background music"
        src={staticFile(AUDIO_FILES.music)}
        loop
        volume={fade * (volume - (volume - duckedVolume) * duck)}
      />
    </Track>
  );
};
