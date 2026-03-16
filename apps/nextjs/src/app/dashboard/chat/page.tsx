"use client";

import { useState } from "react";

import Chat from "@/components/composite/chat/chat";

export default function ChatPage() {
  const [chatId] = useState(() => crypto.randomUUID());

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Chat</h1>
      <Chat id={chatId} />
    </div>
  );
}
