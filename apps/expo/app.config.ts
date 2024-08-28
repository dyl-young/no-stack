import type { ConfigContext, ExpoConfig } from "@expo/config";

const releaseVersion = "0.1.0";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "no-stack",
  description: "A simple expo app",
  slug: "no-stack",
  scheme: "expo",
  version: releaseVersion,
  newArchEnabled: true,
  orientation: "portrait",
  icon: "./assets/logo.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/logo.png",
    resizeMode: "contain",
    backgroundColor: "#18181A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.mostack.changeme",
    supportsTablet: true,
    // usesAppleSignIn: true, // Disabled for personal development team - requires paid Apple Developer account
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    package: "com.mostack.changeme",
    adaptiveIcon: {
      foregroundImage: "./assets/logo.png",
      backgroundColor: "#18181A",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  owner: "expo",
  // extra: {
  // eas: {
  //   projectId: "your-project-id",
  //   // Required if using a robot and access token for deployment (EXPO_TOKEN)
  //   owner: "expo",
  // },
  // },
  plugins: [
    "expo-dev-client",
    "expo-router",
    "expo-secure-store",
    // "expo-apple-authentication", // Disabled for personal development team - requires paid Apple Developer account
    [
      "expo-image-picker",
      {
        cameraPermission:
          "Allow no-stack to access your camera. no-stack requires access to your camera to [insert reason here].",
        photosPermission:
          "Allow no-stack to access your photos. no-stack requires access to your photo library to [insert reason here].",
      },
    ],
  ],
});
