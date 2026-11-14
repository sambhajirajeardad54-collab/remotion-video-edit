import type { Caption } from "../components/Subtitles";

// Marathi subtitles for FullVideo, one caption per voiceover line.
// Times match the voice clips in src/audio/VoiceoverTrack.tsx
// (frame / 30 * 1000 = milliseconds). Text is the approved script;
// if your recording says something slightly different, edit it here.
// Wrap keywords in *asterisks* to highlight them.
export const FULL_VIDEO_CAPTIONS: Caption[] = [
  {
    text: "*रिमोशन व्हिडिओ एडिट.* संपूर्ण व्हिडिओ… फक्त *कोडमधून.*",
    startMs: 400,
    endMs: 4400,
  },
  {
    text: "हा व्हिडिओ *कसा तयार* झाला? चला, पाहूया.",
    startMs: 4767,
    endMs: 7400,
  },
  {
    text: "*लिहिणं* — प्रत्येक दृश्य म्हणजे एक *React कॉम्पोनंट.*",
    startMs: 7500,
    endMs: 10467,
  },
  {
    text: "*ॲनिमेशन* — प्रत्येक फ्रेमची हालचाल *कोडमधून* ठरते.",
    startMs: 10600,
    endMs: 13000,
  },
  {
    text: "आणि *रेंडर* — तोच कोड बनतो एक *MP4 व्हिडिओ.*",
    startMs: 13100,
    endMs: 16233,
  },
  {
    text: "पाहिल्याबद्दल *धन्यवाद!* भेटूया पुढच्या व्हिडिओत.",
    startMs: 16567,
    endMs: 21033,
  },
];
