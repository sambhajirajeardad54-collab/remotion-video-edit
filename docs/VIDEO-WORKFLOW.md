# Sam Xplains video production workflow

A repeatable path from your raw recording to the final 1080×1920 Reel.
Every step writes NEW files; your recordings are never modified.

## Folders

| Folder | What goes in it | In Git? |
|---|---|---|
| `public/videos/raw-video/` | Your original recordings, unchanged (`YYYY-MM-DD_project.mp4`) | No (only README) |
| `public/videos/reference-video/` | Videos whose editing style to copy (analysis only) | No (only README) |
| `public/videos/cutouts/` | Generated background removal (`<project>.cutout.webm`) | No |
| `public/audio/<project>/` | Level-corrected copy of your voice | Yes (small) |
| `out/analysis/` | Analysis reports, transcripts | No |
| `out/final-video/` | Finished MP4s (`YYYY-MM-DD_project_1080x1920.mp4`) | No (only README) |

Large videos are only committed to GitHub with Sam's approval.

## Safety rules (built into the code)

- **Raw footage** is loaded with `rawVideo()` / `rawVideoPath()` from
  `src/workflow/media.ts`, which use Remotion's `staticFile()`.
- **Reference videos** are loaded with `referenceVideo()`, which returns an
  object, not a file path. TypeScript refuses to use it as `<Video>` or
  `<Audio>` source, and the presenter, cutout and voice components stop with
  an error if a path points into `reference-video/`. The scripts refuse them
  too. A reference video's audio can never become your voiceover.
- Scripts never overwrite an existing output file.

## Steps

1. **Add the files**
   - Raw recording → `public/videos/raw-video/2026-12-01_topic.mp4`
   - Reference (optional) → `public/videos/reference-video/style-example.mp4`

2. **Analyse the reference** (editing style)
   `scripts/workflow/analyze-reference.sh public/videos/reference-video/style-example.mp4`
   Review `out/analysis/reference_*/`: cut rhythm (`cuts.txt`), layout,
   typography and graphics (`contact.png`), caption style and position
   (`captions.png`), music and loudness (`audio.txt`).

3. **Analyse your raw footage**
   `scripts/workflow/analyze-raw.sh public/videos/raw-video/2026-12-01_topic.mp4`
   Note burned-in graphics and cutaways (`cuts.txt`, `contact.png`), and the
   pauses (`audio.txt`).

4. **Transcribe your voice** (Marathi, word timings)
   `HF_HUB_DISABLE_XET=1 python3 scripts/workflow/transcribe.py out/analysis/raw_<name>/voice16k.wav out/analysis/raw_<name>/transcript.json`
   It is a machine transcript: confirm every unclear word with Sam. Never
   guess or invent dialogue.

5. **Prepare your voice** (−16 LUFS copy; the raw file is untouched)
   `scripts/workflow/prepare-voice.sh public/videos/raw-video/2026-12-01_topic.mp4 public/audio/topic/voice.mp3`

6. **Circle layout: remove the background and measure the head**
   `scripts/workflow/make-cutout.sh public/videos/raw-video/2026-12-01_topic.mp4 public/videos/cutouts/topic.cutout.webm`
   `python3 scripts/workflow/measure-head.py public/videos/cutouts/topic.cutout.webm`
   If the recording has burned-in graphics, mask them (see
   `scripts/remove-background/mask-burned-in-poster.sh`).

7. **Build the edit**
   Copy `src/workflow/projects/mpsc-group-c-history.ts` to a new file, fill in
   the file names, measured head position, captions (from the confirmed
   transcript) and overlays timed to the spoken words, and register it in
   `src/Root.tsx` with `TalkingHeadVideo` (see the `TalkingHeadTemplate`
   entry). Choose `layout: "circle"` or `"full"`.
   Preview in Remotion Studio: `npm run dev`.

8. **Approve, then render the final**
   `scripts/workflow/render-final.sh <CompositionId> topic`
   This writes `out/final-video/<date>_topic_1080x1920.mp4` (1080×1920,
   30 fps, H.264 CRF 16, AAC 320 kbps) and verifies it: full decode,
   loudness, black frames.

## Network needed (cloud sessions)

Steps 4 and 6 download models from huggingface.co (allowed hosts:
`huggingface.co`, `us.aws.cdn.hf.co`). The "remotion-video-edit" cloud
environment already allows them.
