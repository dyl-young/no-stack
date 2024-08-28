import { CardWrapper } from "@/components/composite/auth/card-wrapper";
import { ForgotPasswordForm } from "@/components/composite/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <CardWrapper
      headerLabel="Forgot password"
      backButtonLabel="Remebered it again?"
      backButtonHref="/auth/signin"
      backButtonLinkLabel="Sign in"
      showSocial={false}
      showCredentials
    >
      <ForgotPasswordForm />
    </CardWrapper>
  );
}
