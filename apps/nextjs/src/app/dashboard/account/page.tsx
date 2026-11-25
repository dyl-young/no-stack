import Image from "next/image";
import Link from "next/link";

import { getCaller } from "~/trpc/server";
import { deleteAccount, signOut } from "../../auth/actions";

export default async function Account({
  searchParams,
}: {
  searchParams: Promise<{ failed?: string }>;
}) {
  const caller = await getCaller();
  const account = await caller.account.me();
  return (
    <>
      <Link href="/dashboard">Home</Link>
      <h1>Account</h1>
      {account.avatarUrl && (
        <Image
          unoptimized
          src={account.avatarUrl}
          width={56}
          height={56}
          alt=""
          referrerPolicy="no-referrer"
        />
      )}
      <h2>{account.name}</h2>
      <p>{account.email}</p>
      <form action={signOut}>
        <button>Sign out</button>
      </form>
      {(await searchParams).failed && (
        <p role="alert">Deletion failed. Please try again.</p>
      )}
      <details>
        <summary>Delete account</summary>
        <p>This permanently deletes your app account.</p>
        <form action={deleteAccount}>
          <button>Confirm deletion</button>
        </form>
      </details>
    </>
  );
}
