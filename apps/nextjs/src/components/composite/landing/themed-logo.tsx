"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export function ThemedLogo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src =
    mounted && resolvedTheme === "dark" ? "/logo-white.png" : "/logo.png";

  return (
    <>
      <Image
        src="/logo.png"
        alt="Logo"
        fill
        className="object-contain dark:hidden"
      />
      <Image
        src="/logo-white.png"
        alt="Logo"
        fill
        className="hidden object-contain dark:block"
      />
    </>
  );
}
