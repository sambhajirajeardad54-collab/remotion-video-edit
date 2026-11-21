import { AbsoluteFill } from "remotion";
import {
  CirclePresenter,
  CirclePresenterProps,
} from "../components/CirclePresenter";
import { Infographic, InfographicProps } from "../components/Infographic";
import { NewsCard, NewsCardProps } from "../components/NewsCard";
import { NumberCounter, NumberCounterProps } from "../components/NumberCounter";
import { PhoneMockup, PhoneMockupProps } from "../components/PhoneMockup";
import { SceneBackground } from "../components/SceneBackground";
import { Subtitles, SubtitlesProps } from "../components/Subtitles";

// Wrappers that show each component on the brand background, so every
// component can be previewed and tweaked on its own in Remotion Studio
// (Root.tsx -> "Components" folder). PresenterScene needs no wrapper.

const Stage: React.FC<{ children: React.ReactNode; top?: number }> = ({
  children,
  top,
}) => (
  <AbsoluteFill>
    <SceneBackground />
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: top === undefined ? "center" : "flex-start",
        paddingTop: top ?? 0,
      }}
    >
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

export const NewsCardDemo: React.FC<NewsCardProps> = (p) => (
  <Stage top={260}>
    <NewsCard {...p} />
  </Stage>
);

export const NumberCounterDemo: React.FC<NumberCounterProps> = (p) => (
  <Stage>
    <NumberCounter {...p} />
  </Stage>
);

export const InfographicDemo: React.FC<InfographicProps> = (p) => (
  <Stage top={240}>
    <Infographic {...p} />
  </Stage>
);

export const PhoneMockupDemo: React.FC<PhoneMockupProps> = (p) => (
  <Stage top={200}>
    <PhoneMockup {...p} />
  </Stage>
);

export const CirclePresenterDemo: React.FC<CirclePresenterProps> = (p) => (
  <Stage>
    <CirclePresenter {...p} />
  </Stage>
);

export const SubtitlesDemo: React.FC<SubtitlesProps> = (p) => (
  <Stage>
    <Subtitles {...p} />
  </Stage>
);
