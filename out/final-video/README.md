# Final videos (completed MP4 exports)

Every finished export goes here, named
`YYYY-MM-DD_project-name_1080x1920.mp4`.

Render and verify with:

    npm run render:final -- <CompositionId> <project-name>

Remotion Studio's Render button also saves here by default
(`out/final-video/<CompositionId>.mp4`, set in `remotion.config.ts`). Studio
overwrites a file with the same name after a warning, so give finals the
dated name above.
MP4 files here are NOT committed to GitHub unless you approve it.
