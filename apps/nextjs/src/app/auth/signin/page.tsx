import { CardWrapper } from "@/components/composite/auth/card-wrapper";
import { SignInForm } from "@/components/composite/auth/sign-in-form";

export default function SignInPage() {
  return (
    <main>
      <CardWrapper
        headerLabel="Welcome back"
        backButtonLabel="No account?"
        backButtonLinkLabel="Sign up"
        backButtonHref="/auth/signup"
        showSocial={false}
        showCredentials
      >
        <SignInForm />
      </CardWrapper>
    </main>
  );
}
