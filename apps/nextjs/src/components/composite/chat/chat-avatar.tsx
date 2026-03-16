import { Bot, User } from "lucide-react";

interface ChatAvatarProps {
  role: "user" | "assistant";
  isAnimated?: boolean;
}

export function ChatAvatar({ role, isAnimated }: ChatAvatarProps) {
  if (role === "assistant") {
    return (
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border">
        <Bot className={`size-4 ${isAnimated ? "animate-pulse" : ""}`} />
      </div>
    );
  }

  return (
    <div className="ml-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border">
      <User className="size-4" />
    </div>
  );
}
