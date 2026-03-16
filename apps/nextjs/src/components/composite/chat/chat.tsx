"use client";

import type { UIMessage } from "ai";
import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useMutation } from "@tanstack/react-query";
import { Bot } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Suggestion,
  Suggestions,
} from "@/components/ai-elements/suggestion";
import { toast } from "@/components/ui/sonner";
import { useTRPC } from "~/trpc/react";
import { ChatMessage } from "./chat-message";

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

  const handleStop = () => {
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

  const handleSubmit = ({ text }: { text: string }) => {
    if (!text.trim() || ["streaming", "submitted"].includes(status)) return;
    setInput("");
    void sendMessage({ text });
  };

  const handleSuggestion = (suggestion: string) => {
    setInput("");
    void sendMessage({ text: suggestion });
  };

  const suggestions = [
    "What can you help me with?",
    "Explain quantum computing",
    "Write a haiku about code",
  ];

  return (
    <div className="mx-auto flex h-full w-full flex-1 flex-col overflow-hidden text-muted-foreground">
      <Conversation>
        <ConversationContent>
          {messages.length === 0 && (
            <ConversationEmptyState
              title="How can I help?"
              description="Ask me anything to get started."
              icon={<Bot className="size-6" />}
            />
          )}
          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              message={m}
              status={status}
              handleMessageReload={handleMessageReload}
            />
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {messages.length === 0 && (
        <Suggestions className="mx-auto mb-3 justify-center px-4">
          {suggestions.map((s) => (
            <Suggestion key={s} suggestion={s} onClick={handleSuggestion} />
          ))}
        </Suggestions>
      )}

      <div className="mx-auto mb-2 w-full max-w-2xl px-4">
        <PromptInput
          onSubmit={handleSubmit}
        >
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              autoFocus
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit status={status} onStop={handleStop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
