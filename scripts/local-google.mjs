// Development-only Google ID token fixture. Keys are ephemeral and never shipped in the image.
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { exportJWK, generateKeyPair, SignJWT } from "jose";

export async function startLocalGoogle(host = "127.0.0.1") {
  const { privateKey, publicKey } = await generateKeyPair("RS256", {
    extractable: true,
  });
  const key = {
    ...(await exportJWK(publicKey)),
    kid: crypto.randomUUID(),
    alg: "RS256",
    use: "sig",
  };
  const issuer = "http://127.0.0.1:9099";
  async function sign(
    name,
    audience = "local-demo",
    expiry = "5m",
    verified = true,
  ) {
    return new SignJWT({
      name,
      email: name + "@example.test",
      email_verified: verified,
    })
      .setProtectedHeader({ alg: "RS256", kid: key.kid })
      .setIssuer(issuer)
      .setAudience(audience)
      .setSubject(name)
      .setIssuedAt()
      .setExpirationTime(expiry)
      .sign(privateKey);
  }
  const server = createServer(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.url === "/jwks") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ keys: [key] }));
      return;
    }
    const user = req.url?.match(/^\/token\/(alice|bob)$/)?.[1];
    if (user && req.method === "GET") {
      res.end(await sign(user));
      return;
    }
    res.writeHead(404).end();
  });
  await new Promise((resolve, reject) =>
    server.once("error", reject).listen(9099, host, resolve),
  );
  return { server, sign };
}
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await startLocalGoogle(process.env.LOCAL_SIGNER_HOST);
  console.log("Local Google test identities ready on port 9099");
}
