import { CardWrapper } from "@/components/composite/auth/card-wrapper";
import { ResetPasswordForm } from "@/components/composite/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <CardWrapper
      headerLabel="Reset password"
      backButtonLabel="Back to sign in"
      backButtonHref="/auth/signin"
      backButtonLinkLabel="Sign in"
      showSocial={false}
      showCredentials
    >
      <ResetPasswordForm />
    </CardWrapper>
  );
}
