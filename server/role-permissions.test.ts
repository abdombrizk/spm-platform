import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

function createContext(role: User["role"]): TrpcContext {
  const now = new Date();
  return {
    user: {
      id: 900001,
      openId: `test:${role}`,
      name: `${role} test user`,
      email: `${role}@test.invalid`,
      loginMethod: "internal",
      role,
      passwordHash: null,
      mustChangePassword: false,
      isActive: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("role and Owner access control", () => {
  it("allows Owner-only account listing only to Owner", async () => {
    const managerCaller = appRouter.createCaller(createContext("manager"));
    const marketingCaller = appRouter.createCaller(createContext("marketing"));
    await expect(managerCaller.owner.listUsers()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(marketingCaller.owner.listUsers()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows permission replacement only through Owner procedures", async () => {
    const serviceCaller = appRouter.createCaller(createContext("service"));
    await expect(serviceCaller.owner.replacePermissions({ userId: 2, permissions: [] })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("does not allow an inactive or unauthenticated user to use protected access", async () => {
    const publicCaller = appRouter.createCaller({ user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] });
    await expect(publicCaller.owner.listUsers()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
