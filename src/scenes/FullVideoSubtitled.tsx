import { AbsoluteFill } from "remotion";
import { Subtitles } from "../components/Subtitles";
import { theme } from "../components/theme";
import { FULL_VIDEO_CAPTIONS } from "../data/fullVideoCaptions";
import { FullVideo, FullVideoProps } from "./FullVideo";

// The existing FullVideo with Marathi Reels-style subtitles on top.
// FullVideo itself is unchanged. centerY 1580 keeps the subtitles in the
// free band below the step diagram (ends ~1400 px) and above the footer
// (~1720 px), and below the titles of the opening and end cards.
export const FullVideoSubtitled: React.FC<FullVideoProps> = (props) => {
  return (
    <AbsoluteFill>
      <FullVideo {...props} />
      <Subtitles
        captions={FULL_VIDEO_CAPTIONS}
        centerY={1580}
        fontSize={70}
        maxWidth={960}
        highlightColor={theme.highlight}
        highlightStyle="box"
      />
    </AbsoluteFill>
  );
};
