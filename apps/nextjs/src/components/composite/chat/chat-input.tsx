"use client";

import { useEffect, useRef } from "react";
import { Send, Square } from "lucide-react";

import type { ResponseStatus } from "./chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  input: string;
  status: ResponseStatus;
  handleInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleStop: (e: React.FormEvent) => void;
  className?: string;
}

export function ChatInput({
  input,
  status,
  handleInput,
  handleSubmit,
  handleStop,
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustInputHeight();
    }
  }, [input]);

  const adjustInputHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInput(event.target.value);
    adjustInputHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (["ready", "error"].includes(status)) {
        handleFormSubmit(e);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (["streaming", "submitted"].includes(status) || !input.trim()) return;
    handleSubmit(e);
  };

  return (
    <div className="mb-2 flex justify-center bg-transparent">
      <form
        onSubmit={
          ["ready", "error"].includes(status) ? handleFormSubmit : handleStop
        }
        className={`flex w-full flex-row items-end justify-center space-x-1 rounded-2xl bg-accent p-2 text-base focus-within:border-foreground ${className ?? ""}`}
      >
        <Textarea
          value={input}
          ref={textareaRef}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          rows={1}
          className="max-h-60 min-h-[40px] flex-1 resize-none border-none shadow-none focus-visible:ring-transparent"
          autoFocus
        />
        <Button
          type="submit"
          className="h-10 w-10 rounded-full"
          disabled={input.trim() === "" && ["ready", "error"].includes(status)}
        >
          {["ready", "error"].includes(status) ? (
            <Send />
          ) : (
            <Square className="fill-accent" />
          )}
        </Button>
      </form>
    </div>
  );
}
