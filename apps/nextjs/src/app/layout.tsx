import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme";
import { cn } from "@/lib/utils";

import "~/app/globals.css";

export const metadata: Metadata = {
  title: "no-stack",
  description: "Simple monorepo with shared backend for web & mobile apps",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      url: "/favicon-white.ico",
      media: "(prefers-color-scheme: dark)",
    },
  ],
  openGraph: {
    title: "no-stack",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://no-stack.dev",
    siteName: "no-stack",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
