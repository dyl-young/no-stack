"use client";

import { useRef, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }): void;
          renderButton(
            element: HTMLElement,
            config: { type: "standard"; text: "continue_with" },
          ): void;
        };
      };
    };
  }
}

export function GoogleButton({
  local,
  clientId,
}: {
  local: boolean;
  clientId: string;
}) {
  const button = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  async function login(credential: Promise<string> | string) {
    try {
      setError("");
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: await credential }),
      });
      if (!response.ok) throw new Error();
      window.location.assign("/dashboard");
    } catch {
      setError("Sign-in failed. Please try again.");
    }
  }
  function initialize() {
    const api = window.google?.accounts.id;
    if (!api || !button.current) return;
    api.initialize({
      client_id: clientId,
      callback: ({ credential }) => void login(credential),
    });
    api.renderButton(button.current, {
      type: "standard",
      text: "continue_with",
    });
  }
  return (
    <>
      {local ? (
        ["alice", "bob"].map((name) => (
          <button
            key={name}
            onClick={() =>
              void login(
                fetch(`http://127.0.0.1:9099/token/${name}`).then((r) =>
                  r.text(),
                ),
              )
            }
          >
            Continue as {name}
          </button>
        ))
      ) : (
        <>
          <div ref={button} />
          <Script
            src="https://accounts.google.com/gsi/client"
            onReady={initialize}
            onError={() => setError("Could not load Google sign-in.")}
          />
        </>
      )}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
