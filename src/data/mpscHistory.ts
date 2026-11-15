import type { Caption } from "../components/Subtitles";

// MPSC गट-क · इतिहास विभाग (source: public/videos/mpsc-history/source.mp4)
//
// TRANSCRIPT. Machine transcription (Whisper large-v3, cross-checked with
// a Marathi fine-tune; raw outputs in docs/), corrected by Sam on
// 2026-11-15 for the unclear words at 4.8 s, 23 s, 27-29 s and 33-35 s.
// 36 s ("कशी वाटते") was consistent across four machine decodes.
export type TranscriptLine = {
  startSec: number;
  endSec: number;
  text: string;
  check?: string;
};

export const MPSC_HISTORY_TRANSCRIPT: TranscriptLine[] = [
  {
    startSec: 0.0,
    endSec: 4.6,
    text: "MPSC ग्रुप C अंतर्गत जे हिस्ट्रीचं पोर्शन आहे, त्यामध्ये जवळपास 12 ते 13 क्वेश्चन असतात.",
  },
  {
    startSec: 4.8,
    endSec: 9.7,
    text: "हे 12 ते 13 क्वेश्चन तुम्ही एकाच बुकमधून सॉल्व्ह करू शकता, ते म्हणजे ओल्ड महाराष्ट्र स्टेट बोर्डचं बुक.",
  },
  {
    startSec: 9.9,
    endSec: 17.9,
    text: "हे बुक कुठेही नेटवर अवेलेबल नाही, टेलिग्रामवरची लिंक मिळत नाही. हे बुक पाहिजे असेल, तर कमेंटमध्ये PDF असं टाइप करा. हे बुक मी तुम्हाला डायरेक्ट तुमच्या DM मध्ये पाठवून देतो.",
  },
  {
    startSec: 18.1,
    endSec: 24.4,
    text: "यामध्ये दिलेलं काय, ते म्हणजे समाजसुधारक, यामध्ये ब्रिटिशकालीन भारत, महाराष्ट्रातील चळवळी, हे सगळे यामध्ये कव्हर केलेले.",
  },
  {
    startSec: 24.4,
    endSec: 29.5,
    text: "तर हे बुकसाठी तुम्ही Sam Xplains चॅनलला फॉलो केलं पाहिजे, तरच PDF मिळेल तुम्हाला DM मध्ये.",
  },
  {
    startSec: 29.8,
    endSec: 35.2,
    text: "मित्रांनो, हिस्ट्री हा खूप हाय स्कोरिंग सब्जेक्ट आहे. यासाठी हे एक बुक रेफर केलंत, तर हाय स्कोर आपण करू शकतो.",
  },
  {
    startSec: 35.6,
    endSec: 41.4,
    text: "तर मित्रांनो, ही इन्फॉर्मेशन तुम्हाला कशी वाटते? ही इन्फॉर्मेशन तुम्हाला फायदेशीर ठरत असेल, तर Sam Xplains चॅनलला फॉलो करायला विसरू नका.",
  },
];

// Reels-style subtitle chunks for the first 18 s (preview), timed to the
// machine word timestamps. Keywords in *asterisks* are shown in yellow.
export const MPSC_HISTORY_CAPTIONS_HOOK: Caption[] = [
  { text: "MPSC *ग्रुप C* अंतर्गत", startMs: 0, endMs: 1250 },
  { text: "जे *हिस्ट्रीचं* पोर्शन आहे,", startMs: 1250, endMs: 2700 },
  { text: "त्यामध्ये जवळपास", startMs: 2700, endMs: 3350 },
  { text: "*12 ते 13 क्वेश्चन* असतात.", startMs: 3350, endMs: 4700 },
];

export const MPSC_HISTORY_CAPTIONS: Caption[] = [
  {
    text: "हे 12 ते 13 क्वेश्चन तुम्ही *एकाच बुकमधून* सॉल्व्ह करू शकता,",
    startMs: 4800,
    endMs: 7400,
  },
  {
    text: "ते म्हणजे *ओल्ड महाराष्ट्र स्टेट बोर्डचं* बुक.",
    startMs: 7400,
    endMs: 9750,
  },
  { text: "हे बुक कुठेही *नेटवर अवेलेबल नाही*,", startMs: 9900, endMs: 12150 },
  { text: "*टेलिग्रामवरची लिंक* मिळत नाही.", startMs: 12150, endMs: 13450 },
  {
    text: "हे बुक पाहिजे असेल, तर कमेंटमध्ये *PDF* असं टाइप करा.",
    startMs: 13500,
    endMs: 15900,
  },
  {
    text: "हे बुक मी तुम्हाला *डायरेक्ट तुमच्या DM मध्ये* पाठवून देतो.",
    startMs: 16000,
    endMs: 17950,
  },
  { text: "यामध्ये *दिलेलं काय*, ते म्हणजे", startMs: 18080, endMs: 19550 },
  { text: "*समाजसुधारक*,", startMs: 19550, endMs: 20450 },
  { text: "यामध्ये *ब्रिटिशकालीन भारत*,", startMs: 20450, endMs: 22050 },
  { text: "*महाराष्ट्रातील चळवळी*,", startMs: 22050, endMs: 23150 },
  { text: "हे सगळे यामध्ये *कव्हर केलेले*.", startMs: 23150, endMs: 24400 },
  {
    text: "तर हे बुकसाठी तुम्ही *Sam Xplains* चॅनलला",
    startMs: 24400,
    endMs: 26400,
  },
  { text: "*फॉलो* केलं पाहिजे,", startMs: 26400, endMs: 27050 },
  {
    text: "तरच *PDF* मिळेल तुम्हाला *DM मध्ये*.",
    startMs: 27050,
    endMs: 29550,
  },
  { text: "मित्रांनो, *हिस्ट्री* हा खूप", startMs: 29800, endMs: 31550 },
  { text: "*हाय स्कोरिंग* सब्जेक्ट आहे.", startMs: 31550, endMs: 32550 },
  { text: "यासाठी हे *एक बुक* रेफर केलंत,", startMs: 32550, endMs: 33950 },
  { text: "तर *हाय स्कोर* आपण करू शकतो.", startMs: 33950, endMs: 35250 },
  {
    text: "तर मित्रांनो, ही इन्फॉर्मेशन तुम्हाला *कशी वाटते?*",
    startMs: 35550,
    endMs: 37550,
  },
  {
    text: "ही इन्फॉर्मेशन तुम्हाला *फायदेशीर* ठरत असेल,",
    startMs: 37550,
    endMs: 39450,
  },
  {
    text: "तर *Sam Xplains* चॅनलला *फॉलो* करायला विसरू नका.",
    startMs: 39450,
    endMs: 41500,
  },
];
