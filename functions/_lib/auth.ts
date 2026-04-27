/**
 * Cookie-based auth middleware cho admin Functions.
 */

import { verifyJwt, type JwtPayload } from "./jwt";

const COOKIE_NAME = "nd_admin_session";

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  const parts = header.split(/;\s*/);
  for (const p of parts) {
    const eq = p.indexOf("=");
    if (eq < 0) continue;
    if (p.slice(0, eq) === name) return decodeURIComponent(p.slice(eq + 1));
  }
  return null;
}

export function setSessionCookie(token: string, maxAgeSec = 7 * 24 * 60 * 60): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAgeSec}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export async function requireAuth(
  request: Request,
  jwtSecret: string,
): Promise<JwtPayload | Response> {
  const token = readCookie(request, COOKIE_NAME);
  if (!token) {
    return new Response(JSON.stringify({ ok: false, error: "Chưa đăng nhập" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const payload = await verifyJwt(token, jwtSecret);
  if (!payload) {
    return new Response(JSON.stringify({ ok: false, error: "Phiên đã hết hạn" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return payload;
}

export const COOKIE_KEY = COOKIE_NAME;
