import { z } from "zod";
import { captionSchema } from "../components/Subtitles";

// One Sam Xplains video = one project config (see src/workflow/projects/).
// Times are in frames at 30 fps (seconds × 30), taken from the transcript's
// word timestamps so graphics land on the spoken words.

const timed = {
  from: z.number().int().min(0),
  durationInFrames: z.number().int().min(1),
};

export const overlaySchema = z.discriminatedUnion("type", [
  // Big animated headline (keywords in *asterisks* turn yellow).
  z.object({
    type: z.literal("headline"),
    ...timed,
    kicker: z.string(),
    text: z.string(),
    icon: z.enum(["none", "book", "target", "warning"]),
  }),
  // Points that appear one by one.
  z.object({
    type: z.literal("list"),
    ...timed,
    style: z.enum(["chips", "list", "steps"]),
    icon: z.enum(["check", "cross", "dot"]),
    items: z.array(z.string()),
    stagger: z.number().int().min(4),
  }),
  // Animated number; the source line is required.
  z.object({
    type: z.literal("counter"),
    ...timed,
    value: z.number(),
    rangeFrom: z.number().nullable(),
    label: z.string(),
    source: z.string().min(1),
  }),
  // Comment / DM / follow call-to-action.
  z.object({
    type: z.literal("cta"),
    ...timed,
    variant: z.enum(["comment", "dm", "follow"]),
    label: z.string(),
    text: z.string(),
  }),
  // Full-screen cutaway from YOUR raw footage (e.g. a screen recording part
  // of the same file), shown inside a phone. The presenter hides meanwhile.
  z.object({
    type: z.literal("phone-cutaway"),
    ...timed,
    label: z.string(),
  }),
]);

export const projectSchema = z.object({
  title: z.string(),
  // Your original recording in public/videos/raw-video/ (never modified).
  rawVideo: z.string(),
  // Background-removed presenter (public path), "" = use the raw footage.
  cutout: z.string(),
  // Level-corrected copy of YOUR voice (public path, made by
  // scripts/workflow/prepare-voice.sh); "" = audio of the raw video itself.
  voice: z.string(),
  durationInFrames: z.number().int().min(1),
  // Measured with scripts/workflow/measure-head.py.
  sourceWidth: z.number(),
  sourceHeight: z.number(),
  headX: z.number().min(0).max(1),
  headY: z.number().min(0).max(1),
  layout: z.enum(["circle", "full"]),
  circle: z.object({
    position: z.enum(["bottom-right", "bottom-left", "center"]),
    diameter: z.number().min(200).max(900),
    scale: z.number().min(0.2).max(2), // zoom of the source inside the circle
  }),
  captions: z.array(captionSchema),
  captionY: z.number().min(0).max(1920),
  overlays: z.array(overlaySchema),
  musicVolume: z.number().min(0).max(1), // 0 = no background music
  // Filled in automatically: whether rawVideo / cutout exist.
  rawFound: z.boolean(),
  cutoutFound: z.boolean(),
});

export type ProjectConfig = z.infer<typeof projectSchema>;
export type Overlay = z.infer<typeof overlaySchema>;
