import { Easing, interpolate } from "remotion";

// Shared documentary-style motion: slow, smooth, no bounce unless asked.
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_POP = Easing.bezier(0.34, 1.56, 0.64, 1);

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// 0 -> 1 progress between `start` and `start + duration` frames.
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing = EASE_OUT,
): number =>
  interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing });

// 1 -> 0 progress for exits. `exitFrame` of 0 means "never exit".
export const exitProgress = (
  frame: number,
  exitFrame: number,
  duration = 15,
): number =>
  exitFrame > 0
    ? interpolate(frame, [exitFrame, exitFrame + duration], [1, 0], {
        ...clamp,
        easing: EASE_IN_OUT,
      })
    : 1;
