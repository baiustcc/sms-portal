const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const SESSION_COOKIE = "portal_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const getSessionSecret = () => {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) throw new Error("AUTH_SESSION_SECRET env must be set");
  return secret;
};

const toBase64 = (bytes: Uint8Array) => {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const fromBase64 = (value: string) => {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(value, "base64"));
  }
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const toBase64Url = (bytes: Uint8Array) => toBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const fromBase64Url = (value: string) => {
  let normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  while (normalized.length % 4) normalized += "=";
  return fromBase64(normalized);
};

const encodePayload = (payload: Record<string, unknown>) => {
  const bytes = encoder.encode(JSON.stringify(payload));
  return toBase64Url(bytes);
};

const decodePayload = (payload: string) => {
  const bytes = fromBase64Url(payload);
  return JSON.parse(decoder.decode(bytes));
};

const timingSafeEqual = (a: Uint8Array, b: Uint8Array) => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
};

const getSubtle = () => {
  const crypto = globalThis.crypto;
  if (!crypto?.subtle) throw new Error("Web Crypto API is not available");
  return crypto.subtle;
};

const signPayload = async (payload: string) => {
  const secret = encoder.encode(getSessionSecret());
  const key = await getSubtle().importKey("raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await getSubtle().sign("HMAC", key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
};

export const createSessionToken = async (number: string) => {
  const payload = encodePayload({ number, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS });
  const signature = await signPayload(payload);
  return `${payload}.${signature}`;
};

export const verifySessionToken = async (token?: string | null) => {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expectedSignature = await signPayload(payload);
  const sigBytes = fromBase64Url(signature);
  const expectedBytes = fromBase64Url(expectedSignature);
  if (!timingSafeEqual(sigBytes, expectedBytes)) return null;
  const data = decodePayload(payload);
  if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) return null;
  if (typeof data.number !== "string") return null;
  return { number: data.number as string };
};

