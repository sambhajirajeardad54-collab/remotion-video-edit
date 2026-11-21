import { z } from "zod";
import { Img, Interactive, staticFile, useCurrentFrame } from "remotion";
import "./fonts";
import { exitProgress, progress } from "./motion";
import { theme } from "./theme";

// News / current-affairs card. `source` and `date` are REQUIRED so that
// a news claim can never appear on screen without where it came from.
export const newsCardSchema = z.object({
  category: z.string(),
  headline: z.string().min(1),
  summary: z.string(),
  source: z.string().min(1, "Every news card needs a source"),
  date: z.string().min(1, "Every news card needs a date"),
  imageSrc: z.string(), // "" = no image, or e.g. "images/news-1.jpg" in public/
  accentColor: z.string(),
  delay: z.number().int().min(0),
  exitFrame: z.number().int().min(0), // 0 = stays until the end
});

export type NewsCardProps = z.infer<typeof newsCardSchema>;

export const NewsCard: React.FC<NewsCardProps> = ({
  category,
  headline,
  summary,
  source,
  date,
  imageSrc,
  accentColor,
  delay,
  exitFrame,
}) => {
  const frame = useCurrentFrame();
  const cardIn = progress(frame, delay, 24);
  const imageReveal = progress(frame, delay + 8, 26);
  const headlineIn = progress(frame, delay + 16, 22);
  const summaryIn = progress(frame, delay + 28, 22);
  const sourceIn = progress(frame, delay + 38, 20);
  const out = exitProgress(frame, exitFrame);

  return (
    <Interactive.Div
      name="News card"
      style={{
        width: 940,
        borderRadius: 40,
        overflow: "hidden",
        backgroundColor: "rgba(20,17,52,0.92)",
        border: `2px solid ${theme.cardBorder}`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        fontFamily: theme.fontFamily,
        color: theme.text,
        opacity: Math.min(cardIn, out),
        translate: `0px ${(1 - cardIn) * 120 + (1 - out) * -60}px`,
      }}
    >
      {/* Image area (16:9), revealed with a soft wipe and slow zoom. */}
      <div
        style={{
          position: "relative",
          height: 470,
          overflow: "hidden",
          clipPath: `inset(0 ${(1 - imageReveal) * 100}% 0 0)`,
        }}
      >
        {imageSrc ? (
          <Img
            src={staticFile(imageSrc)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              scale: `${1.08 - 0.08 * imageReveal}`,
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(135deg, #302b63, ${accentColor}55)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 40,
              letterSpacing: 4,
              color: theme.textFaint,
            }}
          >
            IMAGE · प्रतिमा
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            padding: "8px 26px",
            borderRadius: 999,
            backgroundColor: accentColor,
            color: "#0f0c29",
            fontSize: 32,
            fontWeight: 800,
          }}
        >
          {category}
        </div>
      </div>

      <div
        style={{
          padding: "40px 48px 44px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.25,
              translate: `0px ${(1 - headlineIn) * 100}%`,
              opacity: headlineIn,
            }}
          >
            {headline}
          </div>
        </div>
        <div
          style={{
            fontSize: 38,
            lineHeight: 1.45,
            color: theme.textMuted,
            opacity: summaryIn,
            translate: `0px ${(1 - summaryIn) * 20}px`,
          }}
        >
          {summary}
        </div>
        <div
          style={{
            marginTop: 8,
            paddingTop: 22,
            borderTop: `2px solid ${theme.cardBorder}`,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 30,
            fontWeight: 600,
            color: theme.textFaint,
            opacity: sourceIn,
          }}
        >
          <span>स्रोत: {source}</span>
          <span>{date}</span>
        </div>
      </div>
    </Interactive.Div>
  );
};
