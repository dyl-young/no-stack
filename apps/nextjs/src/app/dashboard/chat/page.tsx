"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function ChatPage() {
  const [text, setText] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    generateId: () => crypto.randomUUID(),
  });

  const isLoading = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    const msg = text;
    setText("");
    sendMessage({ text: msg }).catch(console.error);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col">
      <h1 className="mb-4 text-2xl font-bold">Chat</h1>

      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-lg p-3 ${
              m.role === "user"
                ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                : "bg-muted max-w-[80%]"
            }`}
          >
            <p className="text-xs font-medium opacity-70">
              {m.role === "user" ? "You" : "Assistant"}
            </p>
            <div className="mt-1 whitespace-pre-wrap">
              {m.parts.map((part, i) =>
                part.type === "text" ? <span key={i}>{part.text}</span> : null,
              )}
            </div>
          </div>
        ))}

        {isLoading && messages.at(-1)?.role !== "assistant" && (
          <div className="bg-muted max-w-[80%] rounded-lg p-3">
            <p className="text-muted-foreground animate-pulse text-sm">
              Thinking...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Error: {error.message}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 pt-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="border-input bg-background flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
