import { z } from "zod";
import { Interactive, useCurrentFrame } from "remotion";
import "./fonts";
import { EASE_POP, exitProgress, progress } from "./motion";
import { theme } from "./theme";

// Call-to-action card in a social-media style:
//   "comment"  a comment box where a keyword is typed letter by letter
//   "dm"       a direct-message bubble with a send icon
//   "follow"   a follow button that gets pressed
export const commentCtaSchema = z.object({
  variant: z.enum(["comment", "dm", "follow"]),
  label: z.string(), // line above the box, e.g. "कमेंटमध्ये टाइप करा"
  text: z.string(), // typed keyword / message / channel name
  accentColor: z.string(),
  delay: z.number().int().min(0),
  exitFrame: z.number().int().min(0),
});

export type CommentCtaProps = z.infer<typeof commentCtaSchema>;

export const CommentCTA: React.FC<CommentCtaProps> = ({
  variant,
  label,
  text,
  accentColor,
  delay,
  exitFrame,
}) => {
  const frame = useCurrentFrame();
  const appear = progress(frame, delay, 16, EASE_POP);
  const out = exitProgress(frame, exitFrame, 10);
  const typed =
    variant === "comment"
      ? text.slice(0, Math.max(0, Math.floor((frame - delay - 10) / 3)))
      : text;
  const caretOn = Math.floor(frame / 8) % 2 === 0;
  const press = variant === "follow" ? progress(frame, delay + 22, 8) : 0;

  return (
    <Interactive.Div
      name="Comment CTA"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        fontFamily: theme.fontFamily,
        opacity: Math.min(1, appear * 1.3) * out,
        scale: `${0.8 + 0.2 * appear}`,
      }}
    >
      {label ? (
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: theme.text,
            textShadow: theme.textOutline,
          }}
        >
          {label}
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          minWidth: 600,
          padding: "24px 30px",
          borderRadius: 999,
          backgroundColor:
            variant === "follow"
              ? press > 0.5
                ? theme.cardSolid
                : accentColor
              : "#ffffff",
          border: `4px solid ${accentColor}`,
          boxShadow: `0 16px 50px rgba(0,0,0,0.5), 0 0 40px ${accentColor}44`,
          scale: `${1 - 0.06 * Math.sin(press * Math.PI)}`,
        }}
      >
        <CtaIcon
          variant={variant}
          color={variant === "follow" && press <= 0.5 ? "#04070f" : accentColor}
        />
        <div
          style={{
            flex: 1,
            fontSize: 54,
            fontWeight: 800,
            color:
              variant === "follow"
                ? press > 0.5
                  ? accentColor
                  : "#04070f"
                : "#04070f",
            whiteSpace: "nowrap",
          }}
        >
          {variant === "follow" && press > 0.5 ? `✓ ${text}` : typed}
          {variant === "comment" && caretOn ? (
            <span style={{ color: accentColor, fontWeight: 400 }}>|</span>
          ) : null}
        </div>
      </div>
    </Interactive.Div>
  );
};

const CtaIcon: React.FC<{
  variant: CommentCtaProps["variant"];
  color: string;
}> = ({ variant, color }) => (
  <svg width={60} height={60} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
    {variant === "comment" ? (
      <path
        d="M 15 20 H 85 Q 92 20 92 28 V 62 Q 92 70 85 70 H 45 L 25 88 V 70 H 15 Q 8 70 8 62 V 28 Q 8 20 15 20 Z"
        fill={color}
      />
    ) : null}
    {variant === "dm" ? (
      <path d="M 8 48 L 92 12 L 62 90 L 48 58 Z" fill={color} />
    ) : null}
    {variant === "follow" ? (
      <>
        <circle cx={40} cy={34} r={18} fill={color} />
        <path d="M 10 88 Q 10 58 40 58 Q 70 58 70 88 Z" fill={color} />
        <path
          d="M 82 30 V 62 M 66 46 H 98"
          stroke={color}
          strokeWidth={9}
          strokeLinecap="round"
        />
      </>
    ) : null}
  </svg>
);
