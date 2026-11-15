# Raw video (your original recordings)

Put your original talking-head recordings here, **unchanged**.

- Never edit, re-encode or overwrite files in this folder. Every processing
  step (cutout, level-corrected voice, transcripts) writes a NEW file
  somewhere else.
- Name files `YYYY-MM-DD_project-name.mp4` (for example
  `2026-11-12_mpsc-group-c-history.mp4`).
- In Remotion, load them with `rawVideo("file.mp4")` from
  `src/workflow/media.ts` (it wraps `staticFile()`).
- Video files here are NOT committed to GitHub unless you approve it
  (see `.gitignore`).
