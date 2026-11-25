import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import * as SecureStore from "expo-secure-store";

import { apiOrigin, googleSession } from "./auth";

interface SessionContext {
  token: string | null;
  login: (localUser?: string) => Promise<void>;
  logout: () => Promise<void>;
  clear: (expired: string) => Promise<void>;
}
const Context = createContext<SessionContext | null>(null);
// Scope credentials to the API that issued them, including for development builds.
const key =
  "google-app-session." +
  apiOrigin.replace(
    /[^a-zA-Z0-9.-]/g,
    (char) => "_" + char.charCodeAt(0).toString(16) + "_",
  );
export function SessionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>();
  const [failed, setFailed] = useState(false);
  const current = useRef<string | null>(null);
  useEffect(() => {
    void SecureStore.getItemAsync(key)
      .then((stored) => {
        current.current = stored;
        setToken(stored);
      })
      .catch(() => setFailed(true));
  }, []);
  if (failed)
    return (
      <Text>
        Could not open secure session storage. Reopen the app to retry.
      </Text>
    );
  if (token === undefined) return null;
  async function clear(expired: string) {
    if (current.current !== expired) return;
    await SecureStore.deleteItemAsync(key);
    if (current.current === expired) {
      current.current = null;
      setToken(null);
    }
  }
  async function login(localUser?: string) {
    const next = await googleSession(localUser);
    if (!next) return;
    await SecureStore.setItemAsync(key, next);
    current.current = next;
    setToken(next);
  }
  async function logout() {
    if (!token) return;
    const result = await fetch(apiOrigin + "/api/session", {
      method: "DELETE",
      headers: { authorization: "Bearer " + token },
    });
    if (!result.ok) throw new Error("Sign-out failed. Please retry.");
    await clear(token);
  }
  return (
    <Context.Provider value={{ token, login, logout, clear }}>
      {children}
    </Context.Provider>
  );
}
export function useSession() {
  const session = useContext(Context);
  if (!session) throw new Error("Session provider missing");
  return session;
}
