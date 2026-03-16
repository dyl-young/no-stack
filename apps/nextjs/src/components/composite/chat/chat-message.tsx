"use client";

import type { UIMessage } from "ai";
import { isToolUIPart } from "ai";
import { useState } from "react";
import { Send, X } from "lucide-react";

import type { ResponseStatus } from "./chat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Markdown from "./markdown";
import { CopyButton, EditButton, RegenerateButton } from "./message-buttons";

interface MessageProps {
  message: UIMessage;
  status: ResponseStatus;
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

  return (
    <div className="group flex flex-col">
      {!content.length && (
        <span className="mt-2 animate-pulse text-sm font-bold text-muted-foreground">
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
      <div
        className={`flex max-w-[70vw] flex-col ${
          message.role === "user"
            ? "ml-20 rounded-lg border-b border-l border-r p-3 text-right shadow-md"
            : "mr-20 pl-3 text-left"
        }`}
      >
        <div className="mb-1 text-xs font-bold capitalize">
          {message.role === "user"
            ? "You"
            : content.length > 0 && "Assistant"}
        </div>
        <div className="text-left text-base">
          {message.role === "user" && isEditing ? (
            <div className="flex flex-col">
              <Textarea
                value={editedContent}
                placeholder="Type something..."
                onChange={(e) => setEditedContent(e.target.value)}
                className="h-32 w-[45vw] resize-none border-none shadow-none focus-visible:ring-transparent"
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
            content.length > 0 && <Markdown content={content} />
          )}
        </div>
      </div>
      {content.length > 0 && (
        <div
          className={`flex flex-row ${message.role === "user" ? "self-end" : "self-start"}`}
        >
          <CopyButton
            text={content}
            className="invisible bg-transparent text-gray-400 hover:bg-transparent group-hover:visible"
          />
          {message.role === "assistant" &&
            status !== "streaming" &&
            handleMessageReload && (
              <RegenerateButton
                onClick={() => handleMessageReload(message)}
                className="invisible bg-transparent text-gray-400 hover:bg-transparent group-hover:visible"
              />
            )}
          {message.role === "user" && !isEditing && handleMessageReload && (
            <EditButton
              onClick={() => setIsEditing(true)}
              className="invisible bg-transparent text-gray-400 hover:bg-transparent group-hover:visible"
            />
          )}
        </div>
      )}
    </div>
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
