import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function publicContext(): TrpcContext {
  return { user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("services catalogue access", () => {
  it("allows public service reads while protecting the management list", async () => {
    const caller = appRouter.createCaller(publicContext());
    const result = await caller.services.published();
    expect(Array.isArray(result)).toBe(true);
    await expect(caller.services.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("blocks service creation, approval and publication without an internal session", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.services.create({ slug: "sample-service", serviceType: "preventive_maintenance", data: { name: "Sample service" }, draftVisible: true, displayOrder: 0 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.services.approve({ id: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.services.publish({ id: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
