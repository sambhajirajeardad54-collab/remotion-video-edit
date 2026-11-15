# Audio files for FullVideo

Put your audio files here using these exact names. Each one is optional:
if a file is missing, the video still plays and renders, just without it.

| File | What it is | Status |
|---|---|---|
| `marathi-voiceover.mp3` | Your recorded Marathi narration (converted from your .m4a, loudness -16 LUFS) | Added |
| `music/background-music.mp3` | Original cinematic underscore, composed for this project by `scripts/generate-background-music.py` (no third-party music). Ducks under the voice automatically. | Added |
| `sfx/whoosh.mp3` | Whoosh for the slide transition | Added |
| `sfx/riser.mp3` | Cinematic riser into the end card | Added |
| `sfx/impact-soft.mp3` | Soft low impact for title and headline appearances | Added |
| `sfx/tick.mp3` | Gentle pop for the chapter label and step circles | Added |
| `sfx/swipe.mp3` | Airy swipe for the divider line | Added |

All sound effects are original, synthesized by `scripts/generate-sound-effects.py`
(no third-party sounds). Their timing is in `src/audio/SfxTrack.tsx`. They only
play if all five files are present.

Volumes and on/off switches are in Remotion Studio: open FullVideo and use the
Props panel (voiceoverVolume, musicVolume, sfxVolume, ...Enabled).

Voiceover timing (where each sentence plays) is in `src/audio/VoiceoverTrack.tsx`.
Only use music and sound effects you have the rights to use.
