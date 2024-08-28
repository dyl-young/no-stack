"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema,
} from "@no-stack/validators";

import { DEFAULT_LOGIN_REDIRECT } from "~/config/routes";
import { actionClient } from "~/lib/safe-action";
import { createClient } from "~/utils/supabase/server";

export const signInWithPassword = actionClient
  .schema(SignInSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    revalidatePath("/", "layout");
    redirect(DEFAULT_LOGIN_REDIRECT);
  });

export const signUp = actionClient
  .schema(SignUpSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const origin = (await headers()).get("origin");
    const supabase = await createClient();

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    // User already exists, so fake data is returned. See https://supabase.com/docs/reference/javascript/auth-signup
    if (data.user?.identities && data.user.identities.length === 0) {
      throw new Error("An error occurred. Please try again.");
    }

    if (error) throw error;
    return data.user;
  });

export const signInWithGithub = async () => {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const redirectUrl = `${origin}/auth/callback?next=${encodeURIComponent(DEFAULT_LOGIN_REDIRECT)}`;

  const res = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: redirectUrl },
  });

  if (res.data.url) redirect(res.data.url);
  throw res.error;
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};

export const forgotPassword = actionClient
  .schema(ForgotPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    if (!email) {
      throw new Error("Email is required");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
    });

    if (error) {
      console.error(error.message);
      throw new Error("Could not reset password");
    }

    return "success";
  });

export const resetPassword = actionClient
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: { password } }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;

    return "success";
  });
