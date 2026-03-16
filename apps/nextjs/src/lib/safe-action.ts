import { createSafeActionClient } from "next-safe-action";

import { createClient } from "~/utils/supabase/server";

// Create and export the base action client for direct use with v7 API
export const actionClient = createSafeActionClient();

// Create and export authenticated action client
export const authActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error ?? !data.user) {
      throw new Error("Unauthorized");
    }

    return next({ ctx: { user: data.user } });
  },
);
