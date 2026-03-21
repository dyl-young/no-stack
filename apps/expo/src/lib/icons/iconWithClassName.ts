import type { LucideIcon } from "lucide-react-native";
import { styled } from "nativewind";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function iconWithClassName(icon: LucideIcon): any {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return styled(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
      },
    },
  } as any);
}
