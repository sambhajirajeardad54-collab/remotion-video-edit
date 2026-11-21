import {
  MPSC_HISTORY_CAPTIONS,
  MPSC_HISTORY_CAPTIONS_HOOK,
} from "../../data/mpscHistory";
import type { ProjectConfig } from "../projectConfig";

// Example / template project: the MPSC गट-C · इतिहास video, expressed as a
// project config for the reusable TalkingHeadVideo. Copy this file for a new
// video and replace the values (see docs/VIDEO-WORKFLOW.md).
export const mpscGroupCHistoryProject: ProjectConfig = {
  title: "MPSC गट-C · इतिहास",
  rawVideo: "2026-11-12_mpsc-group-c-history.mp4", // in public/videos/raw-video/
  cutout: "videos/mpsc-history/presenter-cutout.webm",
  voice: "audio/mpsc-history/voice.mp3", // level-corrected copy of the raw audio
  durationInFrames: 1290,
  // Measured from the footage (scripts/workflow/measure-head.py).
  sourceWidth: 864,
  sourceHeight: 1920,
  headX: 420 / 864,
  headY: 744 / 1920,
  layout: "circle",
  circle: { position: "bottom-right", diameter: 420, scale: 0.42 },
  captions: [...MPSC_HISTORY_CAPTIONS_HOOK, ...MPSC_HISTORY_CAPTIONS],
  captionY: 1080,
  overlays: [
    {
      type: "headline",
      from: 4,
      durationInFrames: 90,
      kicker: "MPSC गट-C परीक्षा",
      text: "*इतिहास* विभाग",
      icon: "target",
    },
    {
      type: "counter",
      from: 95,
      durationInFrames: 49,
      value: 13,
      rangeFrom: 12,
      label: "प्रश्न (जवळपास)",
      source: "Sam Xplains",
    },
    {
      type: "headline",
      from: 186,
      durationInFrames: 58,
      kicker: "",
      text: "*एकाच* बुकमधून सोडवा!",
      icon: "none",
    },
    {
      type: "list",
      from: 294,
      durationInFrames: 84,
      style: "list",
      icon: "cross",
      items: ["नेटवर कुठेही उपलब्ध नाही", "टेलिग्रामवर लिंक मिळत नाही"],
      stagger: 21,
    },
    {
      type: "phone-cutaway",
      from: 378,
      durationInFrames: 90,
      label: "पुस्तकातील एक पान",
    },
    {
      type: "list",
      from: 543,
      durationInFrames: 189,
      style: "chips",
      icon: "check",
      items: ["समाजसुधारक", "ब्रिटिशकालीन भारत", "महाराष्ट्रातील चळवळी"],
      stagger: 39,
    },
    {
      type: "cta",
      from: 774,
      durationInFrames: 48,
      variant: "follow",
      label: "आधी हे करा",
      text: "Sam Xplains",
    },
    {
      type: "cta",
      from: 1193,
      durationInFrames: 52,
      variant: "follow",
      label: "विसरू नका!",
      text: "Sam Xplains",
    },
  ],
  musicVolume: 0.1,
  rawFound: false,
  cutoutFound: false,
};
