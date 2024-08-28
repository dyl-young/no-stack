import { BackButton } from "@/components/composite/auth/back-button";
import { Header } from "@/components/composite/auth/header";
import { Social } from "@/components/composite/auth/social";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonLinkLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  showCredentials?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonLinkLabel,
  backButtonHref,
  showSocial,
  showCredentials,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] p-4 shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>

      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}

      {showCredentials && (
        <>
          {showSocial && (
            <div className="flex items-center justify-center px-6 pb-4 pt-0">
              <div className="flex-grow border-t border-muted-foreground" />
              <span className="px-3 text-muted-foreground">or</span>
              <div className="flex-grow border-t border-muted-foreground" />
            </div>
          )}
          <CardContent>{children}</CardContent>
        </>
      )}
      <CardFooter>
        <BackButton
          label={backButtonLabel}
          linkLabel={backButtonLinkLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  );
};
