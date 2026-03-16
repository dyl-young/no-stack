import type { StreamTextResult, ToolSet, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, generateText, streamText } from "ai";

import { db } from "@no-stack/db";
import { Chat, Message } from "@no-stack/db/schema";

import { systemPrompt, titleGenerationPrompt } from "./chat.prompts";

export async function createStreamingChat({
  messages,
}: {
  messages: UIMessage[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<StreamTextResult<ToolSet, any>> {
  const modelMessages = await convertToModelMessages(messages);

  return streamText({
    model: openai("gpt-4o-mini"),
    system: systemPrompt,
    messages: modelMessages,
    temperature: 0.3,
  });
}

export async function generateChatTitle({ message }: { message: string }) {
  const { text: title } = await generateText({
    model: openai("gpt-4o-mini"),
    system: titleGenerationPrompt,
    prompt: message,
  });
  return title;
}

export async function saveChatMessages({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}) {
  if (messages.length === 0) return;

  await db
    .insert(Message)
    .values(
      messages.map((msg) => ({
        id: msg.id,
        chatId,
        role: msg.role,
        parts: msg.parts as unknown as Record<string, unknown>[],
      })),
    )
    .onConflictDoNothing();
}

export async function createChat({
  id,
  profileId,
  title,
}: {
  id: string;
  profileId: string;
  title: string;
}) {
  return db.insert(Chat).values({ id, profileId, title });
}

export async function getChat({ id }: { id: string }) {
  return db.query.Chat.findFirst({
    where: (chat, { eq }) => eq(chat.id, id),
    columns: { id: true },
  });
}
