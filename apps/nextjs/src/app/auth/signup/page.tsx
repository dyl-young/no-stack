import { CardWrapper } from "@/components/composite/auth/card-wrapper";
import { SignUpForm } from "@/components/composite/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <main>
      <CardWrapper
        headerLabel="Create your account"
        backButtonLabel="Have an account?"
        backButtonLinkLabel="Sign in"
        backButtonHref="/auth/signin"
        showSocial={false}
        showCredentials
      >
        <SignUpForm />
      </CardWrapper>
    </main>
  );
}
