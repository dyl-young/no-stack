import Link from "next/link";

export default function ErrorPage() {
  return (
    <>
      <h1>Sign-in failed</h1>
      <Link href="/auth/signin">Try again</Link>
    </>
  );
}
