import { redirect } from "next/navigation";

import { AccountForm } from "@/components/composite/user/account-form";
import { api } from "@/trpc/server";
import { createClient } from "@/utils/supabase/server";

export default async function AccountPage() {
  // Check authentication first
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // Now fetch the user profile
  const userProfile = await api.user.getUserProfile();

  return <AccountForm initialProfile={userProfile} />;
}
