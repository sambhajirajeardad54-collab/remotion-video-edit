import { Audio } from "@remotion/media";
import { staticFile, Track } from "remotion";
import { SFX_FILES } from "./audioFiles";

// Documentary-style sound effects, kept separate from voiceover and music.
// All sounds are original (see scripts/generate-sound-effects.py).
//
// `from` is the video frame where the sound starts (30 frames = 1 second),
// matched to the animation it accompanies. `volume` is scaled by the
// master sfxVolume prop, so one slider controls all effects.
// Effects are split over three tracks so overlapping sounds never collide.
export const SfxTrack: React.FC<{ volume: number }> = ({ volume }) => {
  return (
    <>
      <Track name="SFX - Transitions">
        {/* Whoosh peaks mid-slide (slide: frames 129-154). */}
        <Audio
          name="Whoosh - slide to documentary"
          src={staticFile(SFX_FILES.whoosh)}
          from={127}
          durationInFrames={30}
          volume={0.55 * volume}
        />
        {/* Riser builds through the fade (frames 487-507), lands on the end card title. */}
        <Audio
          name="Riser - into end card"
          src={staticFile(SFX_FILES.riser)}
          from={467}
          durationInFrames={30}
          volume={0.26 * volume}
        />
      </Track>

      <Track name="SFX - Impacts">
        {/* Opening title words spring in (frame 10). */}
        <Audio
          name="Impact - opening title"
          src={staticFile(SFX_FILES.impact)}
          from={10}
          durationInFrames={48}
          volume={0.38 * volume}
        />
        {/* Documentary headline words start appearing (frame 144). */}
        <Audio
          name="Impact - headline"
          src={staticFile(SFX_FILES.impact)}
          from={144}
          durationInFrames={48}
          volume={0.35 * volume}
        />
        {/* End card title springs in (frame 497). */}
        <Audio
          name="Impact - end card"
          src={staticFile(SFX_FILES.impact)}
          from={497}
          durationInFrames={48}
          volume={0.36 * volume}
        />
      </Track>

      <Track name="SFX - Infographic accents">
        {/* "Chapter 02" label slides in (frame 134). */}
        <Audio
          name="Tick - chapter label"
          src={staticFile(SFX_FILES.tick)}
          from={134}
          durationInFrames={8}
          volume={0.3 * volume}
        />
        {/* Divider line draws across (frames 169-199). */}
        <Audio
          name="Swipe - divider"
          src={staticFile(SFX_FILES.swipe)}
          from={168}
          durationInFrames={13}
          volume={0.25 * volume}
        />
        {/* Step circles pop in (frames 204, 239, 274). */}
        <Audio
          name="Tick - step 01"
          src={staticFile(SFX_FILES.tick)}
          from={204}
          durationInFrames={8}
          volume={0.35 * volume}
        />
        <Audio
          name="Tick - step 02"
          src={staticFile(SFX_FILES.tick)}
          from={239}
          durationInFrames={8}
          volume={0.35 * volume}
        />
        <Audio
          name="Tick - step 03"
          src={staticFile(SFX_FILES.tick)}
          from={274}
          durationInFrames={8}
          volume={0.35 * volume}
        />
      </Track>
    </>
  );
};
