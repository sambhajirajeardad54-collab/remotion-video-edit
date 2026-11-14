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
// All values are in frames (30 frames = 1 second). The defaults assume the
// recording follows the video timeline exactly. Once your real recording is
// uploaded, trimBefore is adjusted so each sentence lines up with its scene.
// Each clip can also be moved or trimmed in the Studio timeline.
export const VoiceoverTrack: React.FC<{ volume: number }> = ({ volume }) => {
  const src = staticFile(AUDIO_FILES.voiceover);

  return (
    <Track name="Voiceover">
      {/* 00.4s Opening title: "रिमोशन व्हिडिओ एडिट. संपूर्ण व्हिडिओ… फक्त कोडमधून." */}
      <Audio
        name="VO 1 - Opening title"
        src={src}
        from={12}
        trimBefore={12}
        durationInFrames={102}
        volume={volume}
      />
      {/* 04.6s Headline: "हा व्हिडिओ कसा तयार झाला? चला, पाहूया." */}
      <Audio
        name="VO 2 - Headline"
        src={src}
        from={138}
        trimBefore={138}
        durationInFrames={60}
        volume={volume}
      />
      {/* 06.7s Step 01: "लिहिणं — प्रत्येक दृश्य म्हणजे एक React कॉम्पोनंट." */}
      <Audio
        name="VO 3 - Step 01 Write"
        src={src}
        from={201}
        trimBefore={201}
        durationInFrames={69}
        volume={volume}
      />
      {/* 09.0s Step 02: "ॲनिमेशन — प्रत्येक फ्रेमची हालचाल कोडमधून ठरते." */}
      <Audio
        name="VO 4 - Step 02 Animate"
        src={src}
        from={270}
        trimBefore={270}
        durationInFrames={63}
        volume={volume}
      />
      {/* 11.1s Step 03: "आणि रेंडर — तोच कोड बनतो एक MP4 व्हिडिओ." */}
      <Audio
        name="VO 5 - Step 03 Render"
        src={src}
        from={333}
        trimBefore={333}
        durationInFrames={69}
        volume={volume}
      />
      {/* 14.0s End card: "पाहिल्याबद्दल धन्यवाद! भेटूया पुढच्या व्हिडिओत." */}
      <Audio
        name="VO 6 - End card"
        src={src}
        from={420}
        trimBefore={420}
        durationInFrames={78}
        volume={volume}
      />
    </Track>
  );
};
