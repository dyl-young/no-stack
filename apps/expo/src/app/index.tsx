import React from "react";
import { Image, View } from "react-native";
import { Link, Stack } from "expo-router";
import { useColorScheme } from "nativewind";

import { AuthAvatar } from "~/components/header";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const logoDark = require("../../assets/logo-white.png") as number;
const logoLight = require("../../assets/logo.png") as number;

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();

  return (
    <View className="h-full w-full bg-background p-4">
      <Stack.Screen
        options={{
          headerLeft: () => <AuthAvatar />,
          headerTitle: () => (
            <Text className="text-xl font-bold text-primary">no-stack</Text>
          ),
        }}
      />
      <View className="flex-1 items-center justify-center">
        <Image
          source={colorScheme === "dark" ? logoDark : logoLight}
          style={{ width: 96, height: 96 }}
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 items-center justify-start">
        <Link href="/posts" asChild className="w-full">
          <Button className="w-full py-6" variant="default">
            <Text>Posts</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
}
