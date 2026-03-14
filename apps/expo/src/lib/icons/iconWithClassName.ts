import type { LucideIcon } from "lucide-react-native";
import { styled } from "nativewind";

export function iconWithClassName(icon: LucideIcon) {
  styled(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  });
}
