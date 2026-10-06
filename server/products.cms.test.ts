import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function publicContext(): TrpcContext {
  return { user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("products catalogue access", () => {
  it("allows public catalogue reads without exposing a draft procedure", async () => {
    const caller = appRouter.createCaller(publicContext());
    const result = await caller.products.published();
    expect(Array.isArray(result)).toBe(true);
    await expect(caller.products.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("blocks product creation and publication without an internal session", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.products.create({ slug: "sample-product", productType: "medical_device", data: { name: "Sample" }, draftVisible: true, displayOrder: 0 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.products.publish({ id: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("prevents non-owner users from permanently deleting products", async () => {
    const marketingCtx: TrpcContext = {
      user: {
        id: 2,
        openId: "marketing-user",
        name: "Marketing Specialist",
        email: "marketing@spm.com",
        loginMethod: "internal",
        role: "marketing",
        mustChangePassword: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(marketingCtx);
    await expect(caller.products.delete({ id: 1 })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
