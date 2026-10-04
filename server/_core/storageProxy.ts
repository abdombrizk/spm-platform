import type { Express, Request } from "express";
import { parse as parseCookieHeader } from "cookie";
import { ENV } from "./env";
import { getUserBySessionToken } from "../db";
import { INTERNAL_SESSION_COOKIE } from "../internalAuth";

const PRIVATE_PREFIXES = ["service-requests/", "quote-requests/", "cms/", "private/"];

async function hasInternalSession(req: Request) {
  const header = req.headers.cookie;
  if (!header) return false;
  const token = parseCookieHeader(header)[INTERNAL_SESSION_COOKIE];
  if (!token) return false;
  return Boolean(await getUserBySessionToken(token));
}

export function registerStorageProxy(app: Express) {
  app.get("/manus-storage/*splat", async (req, res) => {
    const rawKey = (req.params as Record<string, string | string[]>).splat;
    const key = (Array.isArray(rawKey) ? rawKey.join("/") : rawKey)?.replace(/^\/+/, "");
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (PRIVATE_PREFIXES.some(prefix => key.startsWith(prefix)) && !(await hasInternalSession(req))) {
      res.status(404).send("Not found");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL("v1/storage/presign/get", ENV.forgeApiUrl.replace(/\/+$/, "") + "/");
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, { headers: { Authorization: `Bearer ${ENV.forgeApiKey}` } });
      if (!forgeResp.ok) {
        console.error(`[StorageProxy] forge error: ${forgeResp.status}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = (await forgeResp.json()) as { url: string };
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set({ "Cache-Control": key.startsWith("cms/") ? "private, no-store" : "public, max-age=3600", "Referrer-Policy": "no-referrer" });
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}
