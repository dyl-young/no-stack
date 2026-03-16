"use client";

import type { UIMessage } from "ai";
import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useMutation } from "@tanstack/react-query";
import { Bot, Globe, ImagePlus, Paperclip, Send, Square } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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

      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="relative">
          <PromptInput
            onSubmit={handleSubmit}
            className="mx-auto relative z-10 [&_[data-slot=input-group]]:items-end [&_[data-slot=input-group]]:rounded-xl [&_[data-slot=input-group]]:border-none [&_[data-slot=input-group]]:bg-muted [&_[data-slot=input-group]]:shadow-none [&_[data-slot=input-group]]:focus-within:ring-0 [&_[data-slot=input-group-control]]:border-none [&_[data-slot=input-group-control]]:shadow-none [&_[data-slot=input-group-control]]:focus-visible:ring-transparent"
          >
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              autoFocus
              className="min-h-16 py-2.5"
            />
          </PromptInput>
          <div className="-mt-5 flex items-end gap-1 rounded-b-3xl border-4 border-accent px-2 pb-1.5 pt-5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-primary hover:text-muted-foreground  cursor-pointer"
            >
              <Paperclip className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-primary hover:text-muted-foreground  cursor-pointer"
            >
              <ImagePlus className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-primary hover:text-muted-foreground  cursor-pointer"
            >
              <Globe className="size-4" />
            </Button>
            <div className="ml-auto flex items-center">
              <PromptInputSubmit
                status={status}
                onStop={handleStop}
                className="size-8 rounded-full bg-primary/80 cursor-pointer"
              >
                {status === "submitted" ? (
                  <Spinner className="size-4" />
                ) : status === "streaming" ? (
                  <Square className="size-3 fill-current" />
                ) : (
                  <Send className="size-4 text-secondary" />
                )}
              </PromptInputSubmit>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
