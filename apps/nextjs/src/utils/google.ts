import { createRemoteJWKSet, errors, jwtVerify } from "jose";

import { authConfig } from "~/env";

const localIssuer = "http://127.0.0.1:9099";
const googleKeys = createRemoteJWKSet(
  new URL("https://www.googleapis.com/oauth2/v3/certs"),
);
const demoKeys = createRemoteJWKSet(new URL("/jwks", localIssuer), {
  cooldownDuration: 1000,
});

export async function googleProfile(token: string) {
  const { local, clientId } = authConfig();
  try {
    const { payload } = await jwtVerify(token, local ? demoKeys : googleKeys, {
      algorithms: ["RS256"],
      issuer: local
        ? localIssuer
        : ["https://accounts.google.com", "accounts.google.com"],
      audience: clientId,
      requiredClaims: ["sub", "exp", "iat"],
    });
    if (
      typeof payload.sub !== "string" ||
      !payload.sub ||
      payload.aud !== clientId
    )
      return null;
    const email =
      typeof payload.email === "string" && payload.email_verified === true
        ? payload.email
        : null;
    return {
      googleSubject: local ? "local:" + payload.sub : payload.sub,
      email,
      name:
        typeof payload.name === "string" ? payload.name : (email ?? "Account"),
      avatarUrl:
        typeof payload.picture === "string" &&
        payload.picture.startsWith("https://")
          ? payload.picture
          : null,
    };
  } catch (e) {
    if (
      e instanceof errors.JWTClaimValidationFailed ||
      e instanceof errors.JWTExpired ||
      e instanceof errors.JWTInvalid ||
      e instanceof errors.JWSInvalid ||
      e instanceof errors.JWSSignatureVerificationFailed ||
      e instanceof errors.JWKSNoMatchingKey ||
      e instanceof errors.JOSENotSupported ||
      e instanceof errors.JOSEAlgNotAllowed
    )
      return null;
    throw e;
  }
}
