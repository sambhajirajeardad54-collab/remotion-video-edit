import { z } from "zod";
import {
  AbsoluteFill,
  Interactive,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "./fonts";
import { EASE_OUT, EASE_POP, progress } from "./motion";
import { theme } from "./theme";

// Reels-style animated Marathi subtitles.
//
// - One caption at a time, large text, lower-middle of the screen.
// - Words appear one after another. Word timing is estimated by spreading the
//   words evenly over the caption, since the recording has no word timestamps.
// - Highlight keywords by wrapping them in asterisks: "हा *महत्त्वाचा* शब्द".
//   Several words can be highlighted together: "*MP4 व्हिडिओ*".
// - centerY moves the subtitle block up or down (pixels from the top) so it
//   never covers important visuals.
export const captionSchema = z.object({
  text: z.string(),
  startMs: z.number().min(0),
  endMs: z.number().min(0),
});

export const subtitlesSchema = z.object({
  captions: z.array(captionSchema),
  centerY: z.number().min(0).max(1920),
  fontSize: z.number().min(30).max(140),
  maxWidth: z.number().min(400).max(1040),
  highlightColor: z.string(),
});

export type Caption = z.infer<typeof captionSchema>;
export type SubtitlesProps = z.infer<typeof subtitlesSchema>;

type Word = { text: string; highlighted: boolean };

// "हा *महत्त्वाचा शब्द* आहे" -> words with highlight flags.
export const parseCaption = (text: string): Word[] => {
  let inHighlight = false;
  const words = text
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => {
      const opens = raw.startsWith("*");
      const closes = raw.endsWith("*") && (raw.length > 1 || !opens);
      if (opens) inHighlight = true;
      const word = { text: raw.replace(/\*/g, ""), highlighted: inHighlight };
      if (closes) inHighlight = false;
      return word;
    })
    .filter((w) => w.text.length > 0);
  // Join neighbouring highlighted words into one phrase, so a highlighted
  // phrase gets one box instead of one box per word.
  return words.reduce<Word[]>((out, word) => {
    const last = out[out.length - 1];
    if (last && last.highlighted && word.highlighted) {
      last.text = `${last.text} ${word.text}`;
    } else {
      out.push({ ...word });
    }
    return out;
  }, []);
};

export const Subtitles: React.FC<SubtitlesProps> = ({
  captions,
  centerY,
  fontSize,
  maxWidth,
  highlightColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;
  const caption = captions.find((c) => nowMs >= c.startMs && nowMs < c.endMs);

  if (!caption) {
    return null;
  }

  const startFrame = (caption.startMs / 1000) * fps;
  const endFrame = (caption.endMs / 1000) * fps;
  const words = parseCaption(caption.text);
  // Words finish appearing by 60% of the caption, then the line holds.
  const revealSpan = Math.max(1, (endFrame - startFrame) * 0.6);
  const perWord = revealSpan / Math.max(1, words.length);
  const exit = 1 - progress(frame, endFrame - 5, 5);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Interactive.Div
        name="Subtitles"
        style={{
          position: "absolute",
          left: "50%",
          top: centerY,
          width: maxWidth,
          marginLeft: -maxWidth / 2,
          translate: "0px -50%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: fontSize * 0.28,
          rowGap: fontSize * 0.12,
          fontFamily: theme.fontFamily,
          fontSize,
          fontWeight: 800,
          lineHeight: 1.35,
          textAlign: "center",
          opacity: exit,
        }}
      >
        {words.map((word, i) => {
          const wordStart = startFrame + i * perWord;
          const appear = progress(frame, wordStart, 6, EASE_OUT);
          const pop = word.highlighted
            ? progress(frame, wordStart, 10, EASE_POP)
            : appear;
          return (
            <span
              key={`${word.text}-${i}`}
              style={{
                display: "inline-block",
                padding: word.highlighted ? `0 ${fontSize * 0.18}px` : 0,
                borderRadius: fontSize * 0.2,
                backgroundColor: word.highlighted
                  ? highlightColor
                  : "transparent",
                color: word.highlighted ? "#0f0c29" : theme.text,
                // Dark outline keeps white text readable on any background.
                textShadow: word.highlighted
                  ? "none"
                  : "0 0 4px rgba(0,0,0,0.9), 0 4px 14px rgba(0,0,0,0.75), 2px 2px 0 rgba(0,0,0,0.7), -2px -2px 0 rgba(0,0,0,0.7), 2px -2px 0 rgba(0,0,0,0.7), -2px 2px 0 rgba(0,0,0,0.7)",
                boxShadow: word.highlighted
                  ? "0 8px 24px rgba(0,0,0,0.35)"
                  : "none",
                opacity: appear,
                translate: `0px ${(1 - appear) * fontSize * 0.35}px`,
                scale: `${0.85 + 0.15 * pop}`,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </Interactive.Div>
    </AbsoluteFill>
  );
};
