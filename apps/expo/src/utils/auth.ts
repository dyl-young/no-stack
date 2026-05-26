import * as WebBrowser from "expo-web-browser";
import { WebBrowserResultType } from "expo-web-browser";

import { supabase } from "./supabase";

WebBrowser.maybeCompleteAuthSession();

const REDIRECT_URL = "nostack://auth/callback";

export class GoogleSignInCancelledError extends Error {
  constructor() {
    super("Google sign in was cancelled");
    this.name = "GoogleSignInCancelledError";
  }
}

/**
 * Initiates the auth flow for Google Sign In via the system browser and
 * completes the PKCE code exchange with Supabase.
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: REDIRECT_URL, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data.url) throw new Error("Missing OAuth URL from Supabase");

  const result = await WebBrowser.openAuthSessionAsync(data.url, REDIRECT_URL);

  if (
    result.type === WebBrowserResultType.CANCEL ||
    result.type === WebBrowserResultType.DISMISS
  ) {
    throw new GoogleSignInCancelledError();
  }
  if (!("url" in result)) {
    throw new Error(`Google sign in failed: ${result.type}`);
  }

  const params = new URL(result.url).searchParams;
  const oauthError = params.get("error");
  if (oauthError) {
    const description = params.get("error_description") ?? oauthError;
    throw new Error(description);
  }

  const code = params.get("code");
  if (!code) throw new Error("Missing code in OAuth callback URL");

  const exchange = await supabase.auth.exchangeCodeForSession(code);
  if (exchange.error) throw exchange.error;

  return exchange.data;
}
