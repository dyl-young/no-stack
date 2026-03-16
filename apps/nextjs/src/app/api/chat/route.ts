import type { UIMessage } from "ai";

import { createCaller, createTRPCContext } from "@no-stack/api";

import { createAdminClient, createClient } from "~/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const { messages, id: chatId } = (await req.json()) as {
      messages: UIMessage[];
      id: string;
    };

    const supabase = await createClient();
    const supabaseAdminServerClient = createAdminClient();

    const context = await createTRPCContext({
      headers: req.headers,
      supabase,
      supabaseAdminServerClient,
    });

    const caller = createCaller(() => Promise.resolve(context));

    const result = await caller.chat.streamChat({
      chatId,
      messages: messages.map((msg: UIMessage) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant" | "system",
        parts: msg.parts.map((p) => ({ ...p })),
      })),
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      generateMessageId: () => crypto.randomUUID(),
      onFinish: async ({ messages: responseMessages }: { messages: UIMessage[] }) => {
        await caller.chat.saveMessages({
          chatId,
          messages: responseMessages.map((msg: UIMessage) => ({
            id: msg.id,
            role: msg.role as "user" | "assistant" | "system",
            parts: msg.parts.map((p) => ({ ...p })),
          })),
        });
      },
    });
  } catch (error) {
    console.error("Failed to handle chat request:", error);
    return new Response("Failed to handle chat request", { status: 500 });
  }
}
