import type { Caption } from "../components/Subtitles";

// MPSC गट-क · इतिहास विभाग (source: public/videos/mpsc-history/source.mp4)
//
// DRAFT TRANSCRIPT, to be checked by Sam before the final render.
// Made from Whisper large-v3 (machine transcription, Marathi), then rewritten
// into standard Marathi spelling from the machine output. It has NOT been
// checked against the recording by a person yet: every line must be checked. `check` notes mark
// words the machine heard unclearly.
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
    check: '"जवळपास" (machine heard "दोल पास")',
  },
  {
    startSec: 4.8,
    endSec: 9.7,
    text: "हे 12 ते 13 क्वेश्चन तुम्ही एकाच बुकमधून सॉल्व्ह करू शकता, ते म्हणजे ओल्ड महाराष्ट्र स्टेट बोर्डचं बुक.",
    check: '"एकाच" (machine heard "एकल")',
  },
  {
    startSec: 9.9,
    endSec: 17.9,
    text: "हे बुक कुठेही नेटवर अवेलेबल नाही, टेलिग्रामवरची लिंक मिळत नाही. हे बुक पाहिजे असेल, तर कमेंटमध्ये PDF असं टाइप करा. हे बुक मी तुम्हाला डायरेक्ट तुमच्या DM मध्ये पाठवून देतो.",
  },
  {
    startSec: 18.1,
    endSec: 24.4,
    text: "यामध्ये दिलेलं काय, ते म्हणजे समाजसुधारक, यामध्ये ब्रिटिशकालीन भारत, महाराष्ट्रातील चळवळी, हे सगळं यामध्ये कव्हर केलेलं आहे.",
    check: '"कव्हर केलेलं" (machine heard "कावल केराले")',
  },
  {
    startSec: 24.4,
    endSec: 29.5,
    text: "पण हे बुक मिळवण्यासाठी तुम्ही Sam Xplains चॅनलला फॉलो केलं पाहिजे, तरच PDF तुमच्या DM मध्ये येईल.",
    check:
      'start word and end of sentence unclear (machine: "तरण… तारेची पीडियाप चिली टुंचा डिआमा देवन दाये")',
  },
  {
    startSec: 29.8,
    endSec: 35.2,
    text: "मित्रांनो, हिस्ट्री हा खूप हाय स्कोरिंग सब्जेक्ट आहे. यासाठी हे एक बुक रेफर केलं, तर हाय स्कोर आपण करू शकतो.",
  },
  {
    startSec: 35.6,
    endSec: 41.4,
    text: "तर मित्रांनो, ही इन्फॉर्मेशन तुम्हाला कशी वाटली? ही इन्फॉर्मेशन तुम्हाला फायदेशीर ठरत असेल, तर Sam Xplains चॅनलला फॉलो करायला विसरू नका.",
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
  { text: "हे सगळं यामध्ये *कव्हर केलेलं* आहे.", startMs: 23150, endMs: 24400 },
];
