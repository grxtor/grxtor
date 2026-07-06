import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

const failedAttempts = new Map<string, { count: number; resetAt: number }>();

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const aHash = crypto.createHash("sha256").update(a).digest();
  const bHash = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(aHash, bHash);
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyPassword(password: string): boolean {
  const secret = getAdminPassword();
  if (!secret) return false;
  return timingSafeEqualStrings(password, secret);
}

export function createSessionToken(): string | null {
  const secret = getAdminPassword();
  if (!secret) return null;
  const expiry = (Date.now() + SESSION_DURATION_MS).toString();
  return `${expiry}.${sign(expiry, secret)}`;
}

function verifySessionToken(token: string | undefined): boolean {
  const secret = getAdminPassword();
  if (!secret || !token) return false;
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;
  if (!timingSafeEqualStrings(signature, sign(expiry, secret))) return false;
  return Date.now() < Number(expiry);
}

export function checkAuth(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

export function isRateLimited(ip: string): boolean {
  const entry = failedAttempts.get(ip);
  if (!entry || Date.now() > entry.resetAt) return false;
  return entry.count >= RATE_LIMIT_MAX_ATTEMPTS;
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    failedAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}
