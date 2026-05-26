import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

interface SessionContextValue {
  supabaseClient: SupabaseClient;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionContextProvider({
  supabaseClient,
  children,
}: {
  supabaseClient: SupabaseClient;
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void supabaseClient.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setIsLoading(false);
      },
    );

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, [supabaseClient]);

  return (
    <SessionContext.Provider
      value={{
        supabaseClient,
        session,
        user: session?.user ?? null,
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

function useSessionContext() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error(
      "Supabase session hooks must be used within a SessionContextProvider",
    );
  }
  return ctx;
}

export function useSupabaseClient() {
  return useSessionContext().supabaseClient;
}

export function useSession() {
  return useSessionContext().session;
}

export function useUser() {
  return useSessionContext().user;
}
