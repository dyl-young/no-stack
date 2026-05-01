import type { ClassValue } from "clsx";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function confirmDelete(onConfirm: () => void): void {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: onConfirm },
  ]);
}
