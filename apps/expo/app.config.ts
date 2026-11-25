import type { ExpoConfig } from "expo/config";

import project from "../../starter.json";

const iosId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const config: ExpoConfig = {
  name: project.name,
  slug: project.slug,
  scheme: project.scheme,
  version: "0.1.0",
  icon: "./assets/logo.png",
  ios: { bundleIdentifier: project.applicationId, supportsTablet: true },
  android: { package: project.applicationId },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-dev-client",
    ...(iosId
      ? [
          [
            "@react-native-google-signin/google-signin",
            { iosUrlScheme: iosId.split(".").reverse().join(".") },
          ] as [string, { iosUrlScheme: string }],
        ]
      : []),
  ],
};
export default config;
