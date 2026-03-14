"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function AuthErrorPage() {
  const hash =
    typeof window !== "undefined" ? window.location.hash.substring(1) : "";
  const params = new URLSearchParams(hash);
  const error = params.get("error") ?? "Authentication Error";
  const errorDescription =
    params.get("error_description") ??
    "An error occurred during authentication";

  return (
    <Card className="w-[400px] p-4 shadow-sm">
      <CardHeader>
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-2xl font-semibold">Authentication Error</h1>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex w-full flex-col items-center justify-center space-y-2">
          <p className="text-center text-sm font-semibold text-destructive">
            {decodeURIComponent(error)}
          </p>
          <p className="text-center text-sm text-destructive">
            {decodeURIComponent(errorDescription)}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-center gap-2">
          <Button variant="link" asChild>
            <Link href="/auth/signin">Back to sign in</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
