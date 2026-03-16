import { signInWithGoogle } from "~/app/auth/actions";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "../google-icon";

export const Social = () => {
  return (
    <form className="flex w-full flex-col items-center gap-2">
      <Button
        size="lg"
        className="flex w-full flex-row items-center justify-center gap-2"
        variant="outline"
        formAction={signInWithGoogle}
      >
        <GoogleIcon />
        <span className="font-medium text-muted-foreground">
          Continue with Google
        </span>
      </Button>
    </form>
  );
};
