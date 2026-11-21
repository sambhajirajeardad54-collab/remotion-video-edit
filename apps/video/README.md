# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Sam Xplains project notes

**Main compositions** (open `npm run dev`, or render with `npx remotion render <id> out/<file>.mp4`):

| ID | What it is |
|---|---|
| `MpscHistory` | MPSC गट-C · इतिहास documentary edit (43 s), presenter in a circle |
| `MpscHistoryThumbnail` | Matching cover image (render frame 59 with `npx remotion still`) |
| `FullVideo` / `FullVideoSubtitled` | First demo video with Marathi voiceover, music and SFX |
| `ComponentsShowcase` | Quick tour of all reusable components |
| `Components/*` | Each reusable component on its own, editable in the Props panel |

**Restore the presenter cutout after a fresh clone.** `MpscHistory` uses a
background-removed video that is generated, not stored in Git. Without it the
video still renders, but the circle shows the original footage (with the
curtain) instead. To regenerate it (CPU, about 10 minutes):

```console
pip install onnxruntime opencv-python-headless numpy
curl -L -o scripts/remove-background/modnet.onnx https://huggingface.co/Xenova/modnet/resolve/main/onnx/model.onnx
python3 scripts/remove-background/matte_video.py public/videos/mpsc-history/source.mp4 /tmp/cutout.webm
scripts/remove-background/mask-burned-in-poster.sh /tmp/cutout.webm public/videos/mpsc-history/presenter-cutout.webm
```

**Folders:** `src/components` (reusable), `src/scenes` (videos), `src/data`
(transcripts, captions), `src/audio` (voice, music, SFX tracks), `public/`
(media, fonts), `scripts/` (music, SFX and background-removal generators),
`docs/` (raw speech-recognition output).

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
