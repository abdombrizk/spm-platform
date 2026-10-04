import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import * as db from "../db";
import { storageGetSignedUrl } from "../storage";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => server.close(() => resolve(true)));
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) if (await isPortAvailable(port)) return port;
  throw new Error(`No available port found starting from ${startPort}`);
}

function isSameOrigin(req: express.Request) {
  const origin = req.get("origin");
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    return originUrl.host === req.get("host") && (originUrl.protocol === req.protocol || originUrl.protocol === "https:");
  } catch {
    return false;
  }
}

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false, keyGenerator: req => ipKeyGenerator(req.ip || "unknown"), message: { error: "Too many requests. Please try again later." } });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false, keyGenerator: req => ipKeyGenerator(req.ip || "unknown"), skip: req => !req.path.endsWith("/auth.login"), message: { error: "Too many sign-in attempts. Please try again later." } });
const publicMutationLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false, keyGenerator: req => ipKeyGenerator(req.ip || "unknown"), skip: req => !/\/(quotes\.create|serviceRequests\.create|documents\.request|quotes\.uploadAttachment|serviceRequests\.uploadAttachment)$/.test(req.path), message: { error: "Too many requests. Please try again later." } });

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? { directives: { defaultSrc: ["'self'"], baseUri: ["'self'"], objectSrc: ["'none'"], frameAncestors: ["'none'"], scriptSrc: ["'self'", "'unsafe-inline'"], styleSrc: ["'self'", "'unsafe-inline'", "https:"], imgSrc: ["'self'", "data:", "blob:", "https:"], connectSrc: ["'self'", "https:"], fontSrc: ["'self'", "data:", "https:"], frameSrc: ["'self'", "https:"], formAction: ["'self'"] } } : false,
    referrerPolicy: { policy: "no-referrer" },
  }));
  app.use((req, res, next) => {
    const parser = express.json({ limit: /\/(uploadMedia|uploadImage|uploadAttachment)$/.test(req.path) ? "35mb" : "1mb" });
    parser(req, res, next);
  });
  app.use(express.urlencoded({ limit: "1mb", extended: true }));
  app.use((req, res, next) => {
    if (req.method === "POST" && req.path.startsWith("/api/trpc") && !isSameOrigin(req)) {
      res.status(403).json({ error: "Cross-site request blocked." });
      return;
    }
    next();
  });
  app.use("/api/trpc", apiLimiter, loginLimiter, publicMutationLimiter);

  registerStorageProxy(app);
  app.get("/api/documents/download/:token", async (req, res) => {
    const token = typeof req.params.token === "string" ? req.params.token.trim() : "";
    if (!token) return res.status(400).send("Document download token is missing.");
    try {
      const documentReq = await db.getDocumentRequestByToken(token);
      if (!documentReq || !documentReq.documentUrl) return res.status(403).send("This document link is invalid, expired, or has not been approved by the SPM team.");
      if (!documentReq.documentUrl.startsWith("/manus-storage/products/") && !documentReq.documentUrl.startsWith("/manus-storage/services/") && !documentReq.documentUrl.startsWith("/manus-storage/cms-public/")) return res.status(403).send("This document is not available through the public document service.");
      const signedUrl = await storageGetSignedUrl(documentReq.documentUrl.replace("/manus-storage/", ""));
      res.set("Referrer-Policy", "no-referrer");
      return res.redirect(302, signedUrl);
    } catch (error) {
      console.error("[Documents] Download resolution failed:", error);
      return res.status(500).send("Unable to resolve document download.");
    }
  });
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  if (process.env.NODE_ENV === "development") await setupVite(app, server);
  else serveStatic(app);
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}
startServer().catch(console.error);
