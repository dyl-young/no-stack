import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="rounded-lg bg-card p-6 text-card-foreground shadow-md">
      <h1 className="mb-4 text-center text-2xl font-bold">Dashboard</h1>
      <div className="text-muted-foreground">
        <p>Welcome to the kitchen sink of features and best practices.</p>
        <Separator className="my-4" />
        <p>
          The aim is to provide you with a set of resuable features and
          components that should help in any project.
        </p>
        <Separator className="my-4" />
        <p>
          Play around with all the features offered in the sidebar to find more.
        </p>
      </div>
    </div>
  );
}
