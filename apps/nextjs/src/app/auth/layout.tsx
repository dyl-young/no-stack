import { AuthHeader } from "@/components/composite/auth-header";

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <div className="flex flex-1 items-center justify-center">
        {props.children}
      </div>
    </div>
  );
}
