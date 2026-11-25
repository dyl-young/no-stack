import { redirect } from "next/navigation";

import { cookieContext } from "~/trpc/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await cookieContext()).account) redirect("/auth/signin");
  return children;
}
