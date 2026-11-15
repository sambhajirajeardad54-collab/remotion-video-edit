import { staticFile } from "remotion";

// Audio files the video looks for inside the public/ folder.
// Add a file with exactly this name and it is picked up automatically.
// A missing file is simply skipped, so the video still works without it.
export const AUDIO_FILES = {
  voiceover: "audio/marathi-voiceover.mp3",
  music: "audio/music/background-music.mp3",
} as const;

// Original sound effects (see scripts/generate-sound-effects.py).
export const SFX_FILES = {
  whoosh: "audio/sfx/whoosh.mp3",
  impact: "audio/sfx/impact-soft.mp3",
  tick: "audio/sfx/tick.mp3",
  swipe: "audio/sfx/swipe.mp3",
  riser: "audio/sfx/riser.mp3",
} as const;

export type AudioAvailability = {
  voiceover: boolean;
  music: boolean;
  // True only when every sound effect file is present.
  sfx: boolean;
};

// Checks whether a file exists in public/ before the video uses it.
// Works the same in Remotion Studio and while rendering.
export const fileExists = async (path: string): Promise<boolean> => {
  try {
    const res = await fetch(staticFile(path), { method: "HEAD" });
    const type = res.headers.get("content-type") ?? "";
    // Some servers answer unknown paths with the HTML app page instead of 404.
    return res.ok && !type.includes("text/html");
  } catch {
    return false;
  }
};

export const detectAudioFiles = async (): Promise<AudioAvailability> => {
  const [voiceover, music, ...sfx] = await Promise.all([
    fileExists(AUDIO_FILES.voiceover),
    fileExists(AUDIO_FILES.music),
    ...Object.values(SFX_FILES).map(fileExists),
  ]);
  return { voiceover, music, sfx: sfx.every(Boolean) };
};
