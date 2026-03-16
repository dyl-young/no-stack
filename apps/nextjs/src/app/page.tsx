import { AnimatedCubeLogo } from "@/components/composite/animated-cube-logo";
import { AuthHeader } from "@/components/composite/auth-header";
import { SignUpOrDashboard } from "@/components/composite/landing/sign-up-or-dashboard";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 w-full bg-background">
        <AuthHeader />
      </div>

      <main className="flex flex-grow flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl space-y-8">
          <div className="relative flex h-32 w-full items-center justify-center md:h-50 lg:h-68 xl:h-96">
            <AnimatedCubeLogo size={250} />
          </div>
          <div className="fixed right-4 bottom-4">
            <ThemeToggle />
          </div>

          <div className="rounded-lg bg-card p-6 text-card-foreground shadow-md">
            <h1 className="mb-4 text-center text-2xl font-bold">no-stack</h1>
            <div className="text-muted-foreground">
              <p>A full-stack starter for web and native applications.</p>
              <Separator className="my-4" />
              <p>
                Next.js with tRPC backend, Expo for native, Supabase for auth,
                database and file storage. Everything you need to ship fast.
              </p>
              <Separator className="my-4" />
              <div className="flex items-center justify-center">
                <SignUpOrDashboard />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full p-4 text-center text-muted-foreground">
        © {new Date().getFullYear()} no-stack
      </footer>
    </div>
  );
}
