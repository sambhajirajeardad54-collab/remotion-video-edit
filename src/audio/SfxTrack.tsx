import { Audio } from "@remotion/media";
import { staticFile, Track } from "remotion";
import { AUDIO_FILES } from "./audioFiles";

// Sound effects (public/audio/sfx/whoosh.mp3), played at each scene
// transition. Kept separate from the voiceover and music.
export const SfxTrack: React.FC<{ volume: number }> = ({ volume }) => {
  return (
    <Track name="Sound effects">
      {/* Slide transition: title -> documentary (starts at frame 129). */}
      <Audio
        name="Whoosh - slide transition"
        src={staticFile(AUDIO_FILES.whoosh)}
        from={129}
        durationInFrames={30}
        volume={volume}
      />
      {/* Fade transition: documentary -> end card (starts at frame 487). */}
      <Audio
        name="Whoosh - fade transition"
        src={staticFile(AUDIO_FILES.whoosh)}
        from={487}
        durationInFrames={30}
        volume={volume}
      />
    </Track>
  );
};
