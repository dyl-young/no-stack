"use client";

import type { UIMessage } from "ai";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Bot } from "lucide-react";

import type { ResponseStatus } from "./chat";
import { ChatAvatar } from "./chat-avatar";
import { ChatMessage } from "./chat-message";

const LoadingAnimation = forwardRef<HTMLDivElement>(
  function LoadingAnimation(_props, ref) {
    return (
      <div
        ref={ref}
        className="mt-1 flex flex-row items-start space-x-1 text-base"
      >
        <div className="flex flex-row items-start justify-start gap-2">
          <div className="mr-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border">
            <Bot className="size-4 animate-pulse" />
          </div>
          <span className="mt-2 animate-pulse text-sm font-bold text-muted-foreground">
            Thinking...
          </span>
        </div>
      </div>
    );
  },
);

interface ChatMessagesProps {
  messages: UIMessage[];
  status: ResponseStatus;
  handleMessageReload?: (message: UIMessage, newContent?: string) => void;
}

export function ChatMessages({
  messages,
  status,
  handleMessageReload,
}: ChatMessagesProps) {
  const [lastMsgMargin, setLastMsgMargin] = useState(0);
  const msgContainerRef = useRef<HTMLDivElement>(null);
  const lastUserMsgRef = useRef<HTMLDivElement>(null);
  const lastAssistantMsgRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic bottom margin to keep latest message visible
  useEffect(() => {
    if (msgContainerRef.current && lastUserMsgRef.current) {
      const containerHeight = msgContainerRef.current.clientHeight;
      const lastMsgHeight = lastUserMsgRef.current.clientHeight;
      let newMargin = Math.max(containerHeight - lastMsgHeight - 32, 0);
      if (lastAssistantMsgRef.current) {
        newMargin = Math.max(
          newMargin - lastAssistantMsgRef.current.clientHeight - 16,
          0,
        );
      }
      setLastMsgMargin((prev) => (prev !== newMargin ? newMargin : prev));
    }
  }, [messages.length]);

  // Smooth auto-scroll when margin changes
  useEffect(() => {
    if (!msgContainerRef.current) return;
    msgContainerRef.current.scrollTo({
      top: msgContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lastMsgMargin]);

  return (
    <div ref={msgContainerRef} className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4" style={{ marginBottom: lastMsgMargin }}>
        {messages.map((m, index) => {
          const isLastUserMessage =
            m.role === "user" &&
            messages.slice(index + 1).every((msg) => msg.role !== "user");
          const isLastAssistantMessage =
            m.role === "assistant" && index === messages.length - 1;

          return (
            <div
              key={m.id}
              ref={
                isLastUserMessage
                  ? lastUserMsgRef
                  : isLastAssistantMessage
                    ? lastAssistantMsgRef
                    : null
              }
              className={`flex flex-row items-start gap-2 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <ChatAvatar
                  role="assistant"
                  isAnimated={isLastAssistantMessage && status === "streaming"}
                />
              )}
              <ChatMessage
                message={m}
                status={status}
                handleMessageReload={handleMessageReload}
              />
              {m.role === "user" && <ChatAvatar role="user" />}
            </div>
          );
        })}
        {["streaming", "submitted"].includes(status) &&
          messages.length > 0 &&
          messages[messages.length - 1]?.role === "user" && (
            <LoadingAnimation ref={lastAssistantMsgRef} />
          )}
      </div>
    </div>
  );
}
