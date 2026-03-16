import {
  Icon,
  Label,
  NativeTabs,
} from "expo-router/unstable-native-tabs";

import { useThemeColours } from "~/lib/theme";

export default function TabLayout() {
  const theme = useThemeColours();
  return (
    <NativeTabs tintColor={theme.primary}>
      <NativeTabs.Trigger name="(feed)">
        <Icon sf={{ default: "newspaper", selected: "newspaper.fill" }} />
        <Label>Feed</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <Icon sf={{ default: "person", selected: "person.fill" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
