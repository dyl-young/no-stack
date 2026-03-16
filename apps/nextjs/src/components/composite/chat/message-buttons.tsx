"use client";

import { useState } from "react";
import { Check, Copy, Pencil, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface CopyButtonProps {
  text: string;
  className?: string;
}

interface ActionButtonProps {
  onClick: () => void;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard", {
      position: "top-right",
      duration: 2000,
      dismissible: true,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </Button>
  );
}

export function RegenerateButton({ onClick, className }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={className}
      title="Regenerate response"
    >
      <RefreshCw className="size-3.5" />
    </Button>
  );
}

export function EditButton({ onClick, className }: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={className}
      title="Edit message"
    >
      <Pencil className="size-3.5" />
    </Button>
  );
}
