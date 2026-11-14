import { z } from "zod";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const titleSceneSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  accentColor: z.string(),
});

export type TitleSceneProps = z.infer<typeof titleSceneSchema>;

export const TitleScene: React.FC<TitleSceneProps> = ({
  title,
  subtitle,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Background gradient slowly rotates over the whole video.
  const bgAngle = interpolate(frame, [0, durationInFrames], [135, 225]);

  // Accent bar grows from the center.
  const barProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  // Each word of the title springs in with a stagger.
  const words = title.split(" ");

  // Subtitle fades and slides up after the title.
  const subtitleStart = 15 + words.length * 6;
  const subtitleOpacity = interpolate(
    frame,
    [subtitleStart, subtitleStart + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const subtitleY = interpolate(
    frame,
    [subtitleStart, subtitleStart + 20],
    [40, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  // Everything fades out during the last 15 frames.
  const outro = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${bgAngle}deg, #0f0c29, #302b63, #24243e)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Helvetica, Arial, sans-serif",
        padding: 80,
      }}
    >
      <div
        style={{
          opacity: outro,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
        }}
      >
        <div
          style={{
            width: 360 * barProgress,
            height: 12,
            borderRadius: 6,
            backgroundColor: accentColor,
          }}
        />

        <h1
          style={{
            margin: 0,
            color: "white",
            fontSize: 150,
            fontWeight: 800,
            lineHeight: 1.05,
            textAlign: "center",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            columnGap: 36,
          }}
        >
          {words.map((word, i) => {
            const progress = spring({
              frame: frame - 10 - i * 6,
              fps,
              config: { damping: 12, stiffness: 120 },
            });
            return (
              <span
                key={`${word}-${i}`}
                style={{
                  display: "inline-block",
                  opacity: progress,
                  transform: `translateY(${(1 - progress) * 120}px) scale(${
                    0.6 + progress * 0.4
                  })`,
                }}
              >
                {word}
              </span>
            );
          })}
        </h1>

        <p
          style={{
            margin: 0,
            color: accentColor,
            fontSize: 56,
            fontWeight: 500,
            letterSpacing: 4,
            textTransform: "uppercase",
            textAlign: "center",
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};
