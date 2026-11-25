import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const localGoogle = process.env.EXPO_PUBLIC_LOCAL_GOOGLE_URL;
const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;
if (!baseUrl)
  throw new Error("Set EXPO_PUBLIC_BASE_URL to the web service origin");
const origin = new URL(baseUrl);
if (
  origin.protocol !== "https:" &&
  !(localGoogle && origin.protocol === "http:")
)
  throw new Error("Live Google sign-in requires an HTTPS API endpoint");
export const apiOrigin = origin.origin;
if (!localGoogle)
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  });

export async function googleSession(localUser = "alice") {
  let credential: string;
  if (localGoogle) {
    const result = await fetch(
      new URL("/token/" + localUser, localGoogle).href,
    );
    if (!result.ok) throw new Error("Local sign-in service is unavailable");
    credential = await result.text();
  } else {
    await GoogleSignin.hasPlayServices();
    if (GoogleSignin.hasPreviousSignIn()) await GoogleSignin.signOut();
    const result = await GoogleSignin.signIn();
    if (result.type === "cancelled") return null;
    if (!result.data.idToken)
      throw new Error("Google returned no ID token. Check the web client ID.");
    credential = result.data.idToken;
  }
  const response = await fetch(apiOrigin + "/api/session", {
    method: "POST",
    headers: { authorization: "Bearer " + credential },
  });
  if (!response.ok) throw new Error("Could not start the session");
  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("token" in data) ||
    typeof data.token !== "string"
  )
    throw new Error("Invalid session response");
  return data.token;
}
