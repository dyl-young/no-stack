import type { UIMessage } from "ai";

import Chat from "@/components/composite/chat/chat";
import { api } from "~/trpc/server";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  let initialMessages: UIMessage[] = [];

  try {
    const chat = await api.chat.getChat({ id: chatId });

    initialMessages = chat.messages.map((msg) => ({
      id: msg.id,
      role: msg.role as UIMessage["role"],
      parts: msg.parts as UIMessage["parts"],
      createdAt: msg.createdAt,
    }));
  } catch {
    // Chat doesn't exist yet — this is a new chat with a pre-generated ID
    // streamChat will auto-create it on first message
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Chat</h1>
      <Chat id={chatId} messages={initialMessages} />
    </div>
  );
}
