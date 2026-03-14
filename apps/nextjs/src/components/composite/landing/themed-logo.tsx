"use client";

import Image from "next/image";

export function ThemedLogo() {
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
