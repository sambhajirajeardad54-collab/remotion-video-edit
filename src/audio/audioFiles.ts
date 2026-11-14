import { staticFile } from "remotion";

// Audio files the video looks for inside the public/ folder.
// Add a file with exactly this name and it is picked up automatically.
// A missing file is simply skipped, so the video still works without it.
export const AUDIO_FILES = {
  voiceover: "audio/marathi-voiceover.mp3",
  music: "audio/music/background-music.mp3",
  whoosh: "audio/sfx/whoosh.mp3",
} as const;

export type AudioAvailability = Record<keyof typeof AUDIO_FILES, boolean>;

// Checks whether a file exists in public/ before the video uses it.
// Works the same in Remotion Studio and while rendering.
const fileExists = async (path: string): Promise<boolean> => {
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
  const [voiceover, music, whoosh] = await Promise.all([
    fileExists(AUDIO_FILES.voiceover),
    fileExists(AUDIO_FILES.music),
    fileExists(AUDIO_FILES.whoosh),
  ]);
  return { voiceover, music, whoosh };
};
