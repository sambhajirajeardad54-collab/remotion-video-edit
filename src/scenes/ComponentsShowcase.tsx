import {
  linearTiming,
  springTiming,
  TransitionSeries,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill } from "remotion";
import { CirclePresenter } from "../components/CirclePresenter";
import { Infographic } from "../components/Infographic";
import { NewsCard } from "../components/NewsCard";
import { NumberCounter } from "../components/NumberCounter";
import { PhoneMockup } from "../components/PhoneMockup";
import { PresenterScene } from "../components/PresenterScene";
import { SceneBackground } from "../components/SceneBackground";
import { Subtitles } from "../components/Subtitles";
import { theme } from "../components/theme";

// A short tour of every reusable component, used to check them visually.
// All content is SAMPLE / PLACEHOLDER text: no real news, numbers or claims.
//
// Total = 90 + 120 + 105 + 120 + 105 frames - 4 transitions x 18 = 468 (15.6 s)
const T = 18;

export const ComponentsShowcase: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.backgroundDeep }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Presenter" durationInFrames={90}>
          <PresenterScene
            presenterSrc=""
            withAudio={false}
            layout="full"
            name="Sam Xplains"
            role="आरोग्य · MPSC · चालू घडामोडी"
            accentColor={theme.accent}
            lowerThirdExitFrame={0}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: T,
          })}
        />

        <TransitionSeries.Sequence name="News card" durationInFrames={120}>
          <SceneBackground />
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
            <NewsCard
              category="चालू घडामोडी"
              headline="येथे बातमीचा मथळा येईल"
              summary="हे नमुना कार्ड आहे. खरी बातमी, तिचा स्रोत आणि दिनांक येथे लिहा."
              source="नमुना स्रोत"
              date="दिनांक"
              imageSrc=""
              accentColor={theme.accent}
              delay={8}
              exitFrame={0}
            />
          </AbsoluteFill>
          <CirclePresenter
            presenterSrc=""
            withAudio={false}
            position="bottom-right"
            size={260}
            ringColor={theme.accent}
            edgeOffset={540}
            delay={30}
            exitFrame={0}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence name="Number counter" durationInFrames={105}>
          <SceneBackground />
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 300,
            }}
          >
            <NumberCounter
              value={125000}
              decimals={0}
              prefix=""
              suffix=""
              label="नमुना आकडा (डेमो)"
              source="डेमो — खरी आकडेवारी नाही"
              digits="devanagari"
              accentColor={theme.accent}
              delay={10}
              countDuration={45}
              exitFrame={0}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: T,
          })}
        />

        <TransitionSeries.Sequence name="Infographic" durationInFrames={120}>
          <SceneBackground />
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 220 }}>
            <Infographic
              variant="list"
              title="MPSC अभ्यास नियोजन"
              items={[
                { title: "अभ्यासक्रम नीट वाचा", description: "" },
                { title: "रोज ठराविक वेळ सराव", description: "" },
                { title: "नियमित उजळणी", description: "" },
              ]}
              columns={[]}
              accentColor={theme.accent}
              delay={8}
              stagger={14}
              exitFrame={0}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        <TransitionSeries.Sequence name="Phone mockup" durationInFrames={105}>
          <SceneBackground />
          <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
            <PhoneMockup
              screenImageSrc=""
              screenVideoSrc=""
              tiltIn
              float
              accentColor={theme.accent}
              delay={6}
              exitFrame={0}
            />
          </AbsoluteFill>
        </TransitionSeries.Sequence>
      </TransitionSeries>

      <Subtitles
        captions={[
          { text: "हा *सादरकर्ता* विभाग आहे", startMs: 500, endMs: 2600 },
          {
            text: "*बातमी* कार्ड — स्रोतासह",
            startMs: 3300,
            endMs: 6600,
          },
          { text: "*आकडे* नेहमी स्रोतासह", startMs: 6900, endMs: 8900 },
          { text: "मुद्दे *एकामागून एक*", startMs: 9400, endMs: 12300 },
          {
            text: "*मोबाईल* स्क्रीन दाखवण्यासाठी",
            startMs: 13200,
            endMs: 15200,
          },
        ]}
        centerY={1560}
        fontSize={76}
        maxWidth={960}
        highlightColor={theme.highlight}
      />
    </AbsoluteFill>
  );
};
