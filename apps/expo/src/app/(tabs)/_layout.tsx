import { NativeTabs } from "expo-router/unstable-native-tabs";

import { useThemeColours } from "~/lib/theme";

export default function TabLayout() {
  const theme = useThemeColours();
  return (
    <NativeTabs tintColor={theme.primary}>
      <NativeTabs.Trigger name="(feed)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "newspaper", selected: "newspaper.fill" }}
        />
        <NativeTabs.Trigger.Label>Feed</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Icon
          sf={{ default: "person", selected: "person.fill" }}
        />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
