import { signInWithGoogle } from "../actions";

export default function SignIn() {
  return (
    <>
      <h1>Sign in</h1>
      <form action={signInWithGoogle}>
        <button>Continue with Google</button>
      </form>
    </>
  );
}
