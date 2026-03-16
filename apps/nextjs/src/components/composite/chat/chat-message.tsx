"use client";

import type { UIMessage } from "ai";
import { isToolUIPart } from "ai";
import { useState } from "react";
import { Copy, Pencil, RefreshCw, Send, X } from "lucide-react";

import type { ChatStatus } from "ai";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MessageProps {
  message: UIMessage;
  status: ChatStatus;
  handleMessageReload?: (message: UIMessage, newContent?: string) => void;
}

export function ChatMessage({
  message,
  status,
  handleMessageReload,
}: MessageProps) {
  const content = message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSaveEdit = () => {
    if (handleMessageReload && editedContent.trim()) {
      handleMessageReload(message, editedContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(content);
  };

  return (
    <Message from={message.role}>
      {!content.length && (
        <span className="animate-pulse text-sm font-bold text-muted-foreground">
          {formatToolName(
            (() => {
              const toolPart = message.parts.find((part) =>
                isToolUIPart(part),
              );
              if (!toolPart) return undefined;
              return "toolName" in toolPart
                ? toolPart.toolName
                : toolPart.type.replace("tool-", "");
            })(),
          )}
        </span>
      )}

      <MessageContent>
        {message.role === "user" && isEditing ? (
          <div className="flex flex-col">
            <Textarea
              value={editedContent}
              placeholder="Type something..."
              onChange={(e) => setEditedContent(e.target.value)}
              className="h-32 w-full resize-none border-none shadow-none focus-visible:ring-transparent"
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                onClick={handleCancelEdit}
                variant="ghost"
                className="h-8 w-8 rounded-full"
              >
                <X />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full"
                disabled={
                  editedContent.trim() === "" ||
                  ["streaming", "submitted"].includes(status)
                }
                onClick={handleSaveEdit}
              >
                <Send />
              </Button>
            </div>
          </div>
        ) : (
          content.length > 0 && (
            <MessageResponse>{content}</MessageResponse>
          )
        )}
      </MessageContent>

      {content.length > 0 && !isEditing && (
        <MessageActions className="opacity-0 transition-opacity group-hover:opacity-100">
          <MessageAction tooltip="Copy" onClick={handleCopy}>
            <Copy className="size-3.5" />
          </MessageAction>
          {message.role === "assistant" &&
            status !== "streaming" &&
            handleMessageReload && (
              <MessageAction
                tooltip="Regenerate"
                onClick={() => handleMessageReload(message)}
              >
                <RefreshCw className="size-3.5" />
              </MessageAction>
            )}
          {message.role === "user" && handleMessageReload && (
            <MessageAction tooltip="Edit" onClick={() => setIsEditing(true)}>
              <Pencil className="size-3.5" />
            </MessageAction>
          )}
        </MessageActions>
      )}
    </Message>
  );
}

function formatToolName(toolName: string | undefined) {
  return (
    toolName
      ?.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") ?? "Using a Tool"
  );
}
