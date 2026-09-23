import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { parse as parseCookieHeader } from "cookie";
import type { User } from "../../drizzle/schema";
import { getUserBySessionToken } from "../db";
import { INTERNAL_SESSION_COOKIE } from "../internalAuth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: User | null = null;
  const header = opts.req.headers.cookie;
  if (header) {
    const cookies = parseCookieHeader(header);
    const token = cookies[INTERNAL_SESSION_COOKIE];
    if (token) {
      user = (await getUserBySessionToken(token)) ?? null;
    }
  }
  return { req: opts.req, res: opts.res, user };
}
