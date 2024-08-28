import Image from "next/image";
import Link from "next/link";

import { SignOutButton } from "@/components/composite/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { ThemedLogo } from "./landing/themed-logo";

export const AuthHeader = async () => {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  const logoLink = (
    <Link href="/" className="relative mr-auto h-8 w-8 shrink-0">
      <ThemedLogo />
    </Link>
  );

  return (
    <header className="sticky top-0 flex w-full items-center justify-end bg-background p-4">
      {logoLink}
      <div className={`space-x-2 ${user ? "flex" : ""}`}>
        {user ? (
          <>
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <SignOutButton />
          </>
        ) : (
          <>
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
