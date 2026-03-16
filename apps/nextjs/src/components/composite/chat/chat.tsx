"use client";

import type { UIMessage } from "ai";
import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@/components/ui/sonner";
import { useTRPC } from "~/trpc/react";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

export type ResponseStatus = "error" | "submitted" | "streaming" | "ready";

interface ChatProps {
  id: string;
  messages?: UIMessage[];
}

export default function Chat({ id, messages: initialMessages }: ChatProps) {
  const trpc = useTRPC();
  const deleteMessages = useMutation(
    trpc.chat.deleteMessages.mutationOptions(),
  );

  const [input, setInput] = useState("");

  const {
    messages,
    status,
    setMessages,
    sendMessage,
    stop,
    error,
    regenerate,
  } = useChat({
    id,
    messages: initialMessages,
    experimental_throttle: 100,
    generateId: () => crypto.randomUUID(),
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message, { position: "top-right" });
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || ["streaming", "submitted"].includes(status)) return;
    const text = input;
    setInput("");
    void sendMessage({ text });
  };

  const handleMessageReload = (message: UIMessage, newContent?: string) => {
    let messageIndex = messages.findIndex((m) => m.id === message.id);
    if (messageIndex === -1) return;

    // For assistant messages, find the preceding user message
    if (message.role === "assistant") {
      while (messageIndex >= 0) {
        if (messages[messageIndex]?.role === "user") break;
        messageIndex--;
      }
    }

    const newClientMessages = messages.slice(0, messageIndex + 1);

    deleteMessages.mutate({
      chatId: id,
      messageIds: messages.slice(messageIndex).map((m) => m.id),
    });

    if (message.role === "user" && newContent) {
      const existing = newClientMessages[messageIndex];
      if (existing) {
        newClientMessages[messageIndex] = {
          ...existing,
          parts: [{ type: "text" as const, text: newContent }],
        };
      }
    }

    setMessages(newClientMessages);
    void regenerate();
  };

  const handleStop = (e: React.FormEvent) => {
    e.preventDefault();
    void stop();

    // Clear out empty assistant messages
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant") {
      const content = lastMessage.parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join("");
      if (!content.trim()) {
        setMessages(messages.slice(0, -1));
      }
    }
  };

  return (
    <div className="mx-auto flex h-full w-full flex-1 flex-col overflow-hidden text-muted-foreground">
      <ChatMessages
        messages={messages}
        status={status}
        handleMessageReload={handleMessageReload}
      />
      <ChatInput
        input={input}
        status={status}
        handleInput={setInput}
        handleSubmit={handleSubmit}
        handleStop={handleStop}
        className="mx-10 max-w-2xl"
      />
    </div>
  );
}
