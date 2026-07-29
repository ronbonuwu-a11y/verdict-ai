import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
export const SESSION_COOKIE = "verdict_session";

type UserRecord = { id: string; email: string; passwordHash: string; createdAt: string };
type SessionRecord = { tokenHash: string; userId: string; expiresAt: string };
export type AuthUser = Pick<UserRecord, "id" | "email" | "createdAt">;

async function readRecords<T>(filePath: string): Promise<T[]> {
  try { return JSON.parse(await fs.readFile(filePath, "utf8")) as T[]; } catch { return []; }
}

async function writeRecords<T>(filePath: string, records: T[]) {
  await fs.writeFile(filePath, JSON.stringify(records, null, 2), "utf8");
}

async function passwordHash(password: string, salt = randomBytes(16).toString("base64url")) {
  const derived = await new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
  return `scrypt$${salt}$${derived.toString("base64url")}`;
}

async function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, storedHash] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !storedHash) return false;
  const candidate = await passwordHash(password, salt);
  const candidateHash = Buffer.from(candidate.split("$")[2], "base64url");
  const expectedHash = Buffer.from(storedHash, "base64url");
  return candidateHash.length === expectedHash.length && timingSafeEqual(candidateHash, expectedHash);
}

const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");

export async function registerUser(email: string, password: string): Promise<AuthUser | null> {
  const users = await readRecords<UserRecord>(USERS_FILE);
  if (users.some((user) => user.email === email)) return null;
  const user: UserRecord = { id: crypto.randomUUID(), email, passwordHash: await passwordHash(password), createdAt: new Date().toISOString() };
  await writeRecords(USERS_FILE, [...users, user]);
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  const users = await readRecords<UserRecord>(USERS_FILE);
  const user = users.find((entry) => entry.email === email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) return null;
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000).toISOString();
  const sessions = (await readRecords<SessionRecord>(SESSIONS_FILE)).filter((session) => new Date(session.expiresAt).getTime() > Date.now());
  await writeRecords(SESSIONS_FILE, [...sessions, { tokenHash: tokenHash(token), userId, expiresAt }]);
  return { token, expiresAt };
}

export async function destroySession(token: string) {
  const sessions = await readRecords<SessionRecord>(SESSIONS_FILE);
  await writeRecords(SESSIONS_FILE, sessions.filter((session) => session.tokenHash !== tokenHash(token)));
}

export async function userFromToken(token?: string): Promise<AuthUser | null> {
  if (!token) return null;
  const sessions = await readRecords<SessionRecord>(SESSIONS_FILE);
  const session = sessions.find((entry) => entry.tokenHash === tokenHash(token) && new Date(entry.expiresAt).getTime() > Date.now());
  if (!session) return null;
  const users = await readRecords<UserRecord>(USERS_FILE);
  const user = users.find((entry) => entry.id === session.userId);
  return user ? { id: user.id, email: user.email, createdAt: user.createdAt } : null;
}

export async function getCurrentUser() {
  return userFromToken((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function getRequestUser(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
  return userFromToken(token);
}

export function sessionCookie(value: string, expiresAt: string) {
  return { name: SESSION_COOKIE, value, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", expires: new Date(expiresAt), priority: "high" as const };
}
