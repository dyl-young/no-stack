import Link from "next/link";

import { RainbowButton } from "@/components/ui/rainbow-button";
import ShimmerButton from "@/components/ui/shimmer-button";
import { createClient } from "@/utils/supabase/server";

export const SignUpOrDashboard = async () => {
  const client = await createClient();

  const {
    data: { user },
  } = await client.auth.getUser();

  if (user) {
    return (
      <Link href="/dashboard">
        <ShimmerButton className="">Take me to the dashboard</ShimmerButton>
      </Link>
    );
  }

  return (
    <Link href="/auth/signup">
      <RainbowButton>Sign Up now</RainbowButton>
    </Link>
  );
};
