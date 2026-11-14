# Audio files for FullVideo

Put your audio files here using these exact names. Each one is optional:
if a file is missing, the video still plays and renders, just without it.

| File | What it is | Status |
|---|---|---|
| `marathi-voiceover.mp3` | Your recorded Marathi narration (converted from your .m4a, loudness -16 LUFS) | Added |
| `music/background-music.mp3` | Background music (loops, plays quietly under the voice) | Optional, add later |
| `sfx/whoosh.mp3` | Sound effect played at each scene transition | Optional, add later |

Volumes and on/off switches are in Remotion Studio: open FullVideo and use the
Props panel (voiceoverVolume, musicVolume, sfxVolume, ...Enabled).

Voiceover timing (where each sentence plays) is in `src/audio/VoiceoverTrack.tsx`.
Only use music and sound effects you have the rights to use.
