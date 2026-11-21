import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Android package ID (applicationId). Kept configurable until the final ID is
 * verified, because it can never change once the app is on the Play Store.
 * Set ANDROID_PACKAGE in the environment (or the APK workflow input) to override.
 */
export const PLACEHOLDER_ANDROID_PACKAGE = 'com.lakshyaacademy.app';

const VALID_PACKAGE = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;

export default ({ config }: ConfigContext): ExpoConfig => {
  const androidPackage = process.env.ANDROID_PACKAGE?.trim() || PLACEHOLDER_ANDROID_PACKAGE;
  if (!VALID_PACKAGE.test(androidPackage)) {
    throw new Error(
      `ANDROID_PACKAGE "${androidPackage}" is not a valid Android package ID (e.g. com.example.app: lowercase, dot-separated, each part starting with a letter).`,
    );
  }
  return {
    ...config,
    name: config.name ?? 'Lakshya Academy',
    slug: config.slug ?? 'lakshya-academy',
    android: { ...config.android, package: androidPackage },
  };
};
