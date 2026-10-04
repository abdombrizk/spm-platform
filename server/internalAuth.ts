import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
function deriveKey(password: string, salt: string, length: number, legacy = false): Promise<Buffer> {
  const options = legacy ? { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 } : { N: 32768, r: 8, p: 1, maxmem: 128 * 1024 * 1024 };
  return new Promise((resolve, reject) => scryptCallback(password, salt, length, options, (error, derived) => error ? reject(error) : resolve(derived as Buffer)));
}
const KEY_LENGTH = 64;
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

export const INTERNAL_SESSION_COOKIE = "spm_internal_session";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await deriveKey(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, salt, encoded] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !encoded) return false;
  const expected = Buffer.from(encoded, "hex");
  if (expected.length !== KEY_LENGTH || !/^[0-9a-f]+$/i.test(encoded)) return false;
  const actual = (await deriveKey(password, salt, expected.length)) as Buffer;
  if (expected.length === actual.length && timingSafeEqual(expected, actual)) return true;
  const legacy = await deriveKey(password, salt, expected.length, true);
  return expected.length === legacy.length && timingSafeEqual(expected, legacy);
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function sessionExpiresAt(): Date {
  return new Date(Date.now() + SESSION_TTL_MS);
}

export function validatePassword(password: string): string | null {
  if (password.length < 12) return "Password must contain at least 12 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain a number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain a special character.";
  return null;
}
