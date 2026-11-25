import { redirect } from "next/navigation";

import { authConfig } from "~/env";
import { cookieContext } from "~/trpc/server";
import { GoogleButton } from "./google-button";

export default async function SignIn() {
  if ((await cookieContext()).account) redirect("/dashboard");
  const env = authConfig();
  return (
    <>
      <h1>Sign in</h1>
      <GoogleButton local={env.local} clientId={env.clientId} />
    </>
  );
}
