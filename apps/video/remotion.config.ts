/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// Remotion Studio: the Render button saves to out/final-video/<Composition>.mp4
// (the folder for finished exports). Only applied to the Studio: the
// command-line `remotion render` would treat a folder as a file name, so CLI
// renders keep explicit paths, e.g. `npm run render:final -- <id> <name>`.
if (process.argv.includes("studio")) {
  Config.setOutputLocation("out/final-video/");
}
