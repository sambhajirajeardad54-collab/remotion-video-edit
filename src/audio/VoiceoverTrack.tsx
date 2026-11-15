import { Audio } from "@remotion/media";
import { staticFile, Track } from "remotion";
import { AUDIO_FILES } from "./audioFiles";

// Your recorded Marathi voiceover (public/audio/marathi-voiceover.mp3),
// split into one clip per script line so each line starts with its scene.
//
//   from             = when the line starts in the VIDEO
//   trimBefore       = where the line starts in YOUR RECORDING
//   durationInFrames = how long the line plays
//
// All values are in frames (30 frames = 1 second). Cut points sit in the
// pauses of the recording. Each clip can also be moved or trimmed in the
// Studio timeline. Original recording: audio-source/marathi-voiceover-original.m4a
export const VoiceoverTrack: React.FC<{ volume: number }> = ({ volume }) => {
  const src = staticFile(AUDIO_FILES.voiceover);

  return (
    <Track name="Voiceover">
      {/* Video 0.40-4.40s | recording 1.07-5.07s | Opening title */}
      <Audio
        name="VO 1 - Opening title"
        src={src}
        from={12}
        trimBefore={32}
        durationInFrames={120}
        volume={volume}
      />
      {/* Video 4.77-7.40s | recording 5.07-7.70s | Headline */}
      <Audio
        name="VO 2 - Headline"
        src={src}
        from={143}
        trimBefore={152}
        durationInFrames={79}
        volume={volume}
      />
      {/* Video 7.50-10.47s | recording 7.83-10.80s | Step 01 Write */}
      <Audio
        name="VO 3 - Step 01 Write"
        src={src}
        from={225}
        trimBefore={235}
        durationInFrames={89}
        volume={volume}
      />
      {/* Video 10.60-13.00s | recording 10.93-13.33s | Step 02 Animate */}
      <Audio
        name="VO 4 - Step 02 Animate"
        src={src}
        from={318}
        trimBefore={328}
        durationInFrames={72}
        volume={volume}
      />
      {/* Video 13.10-16.23s | recording 13.33-16.47s | Step 03 Render */}
      <Audio
        name="VO 5 - Step 03 Render"
        src={src}
        from={393}
        trimBefore={400}
        durationInFrames={94}
        volume={volume}
      />
      {/* Video 16.57-21.03s | recording 16.53-21.00s | End card */}
      <Audio
        name="VO 6 - End card"
        src={src}
        from={497}
        trimBefore={496}
        durationInFrames={134}
        volume={volume}
      />
    </Track>
  );
};
