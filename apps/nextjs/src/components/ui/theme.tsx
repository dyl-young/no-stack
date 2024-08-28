"use client";

import * as React from "react";
import { useRef } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";

function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const buttonRefs = {
    light: useRef<HTMLButtonElement>(null),
    dark: useRef<HTMLButtonElement>(null),
    system: useRef<HTMLButtonElement>(null),
  };

  // Avoid hydration mismatch by only rendering theme-dependent classes after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-row rounded-full bg-accent ring-1 ring-inset ring-zinc-500">
      <span
        ref={buttonRefs["light"]}
        onClick={() => setTheme("light")}
        className={`flex flex-1 rounded-full border p-1 ${
          mounted && theme === "light"
            ? "border-zinc-500 text-primary"
            : "border-transparent text-muted-foreground hover:text-primary"
        }`}
      >
        <Sun size={16} />
      </span>
      <span
        ref={buttonRefs["dark"]}
        onClick={() => setTheme("dark")}
        className={`flex flex-1 rounded-full border p-1 ${
          mounted && theme === "dark"
            ? "border-zinc-500 text-primary"
            : "border-transparent text-muted-foreground hover:text-primary"
        }`}
      >
        <Moon size={16} />
      </span>
      <span
        ref={buttonRefs["system"]}
        onClick={() => setTheme("system")}
        className={`flex flex-1 rounded-full border p-1 ${
          mounted && theme === "system"
            ? "border-zinc-500 text-primary"
            : "border-transparent text-muted-foreground hover:text-primary"
        }`}
      >
        <Monitor size={16} />
      </span>
    </div>
  );
}

export { ThemeProvider, ThemeToggle };
