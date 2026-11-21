import { staticFile } from "remotion";

// Sam Xplains production folders (inside public/, so Remotion can serve them).
export const RAW_VIDEO_DIR = "videos/raw-video"; // your original recordings
export const REFERENCE_VIDEO_DIR = "videos/reference-video"; // style examples
export const CUTOUT_DIR = "videos/cutouts"; // generated background removal

const clean = (file: string) => file.replace(/^\/+/, "");

const isReference = (path: string) => path.includes("reference-video/");

// Stops the render with a clear message if a reference video is about to be
// used as footage or audio. Reference videos are for style analysis only.
export const assertNotReference = (src: string, usage: string): void => {
  if (isReference(src)) {
    throw new Error(
      `${usage}: "${src}" is a reference video. Reference videos are only for analysing editing style and must never be used as footage or voiceover. Use a file from public/${RAW_VIDEO_DIR}/ instead.`,
    );
  }
};

// --- Raw footage -----------------------------------------------------------

// Path of an original recording, relative to public/ (for components that
// take a public path, e.g. PresenterMedia's presenterSrc).
export const rawVideoPath = (file: string): string => {
  const path = `${RAW_VIDEO_DIR}/${clean(file)}`;
  assertNotReference(path, "rawVideoPath");
  return path;
};

// URL of an original recording, via staticFile(), for <Video>/<Audio>.
export const rawVideo = (file: string): string =>
  staticFile(rawVideoPath(file));

// --- Reference videos ------------------------------------------------------

// A reference video is deliberately NOT a string: TypeScript will refuse to
// pass it to <Video src> or <Audio src>, so it cannot become footage or
// voiceover by accident.
export type ReferenceVideo = {
  readonly kind: "reference-video";
  readonly file: string;
};

export const referenceVideo = (file: string): ReferenceVideo => ({
  kind: "reference-video",
  file: clean(file),
});

// Only for showing a reference MUTED next to an edit (side-by-side checks).
export const referencePreviewSrc = (ref: ReferenceVideo): string =>
  staticFile(`${REFERENCE_VIDEO_DIR}/${ref.file}`);
