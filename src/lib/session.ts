import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken, verifySessionToken } from "./session-token";

export const persistSession = async (number: string) => {
  const token = await createSessionToken(number);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    maxAge: SESSION_TTL_SECONDS,
    path: "/",
  });
};

export const readSession = async () => {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
};

export const clearSession = () => {
  cookies().delete(SESSION_COOKIE);
};

