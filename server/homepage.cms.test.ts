import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("homepage CMS access control", () => {
  it("does not expose the draft to unauthenticated visitors", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.homepage.draft()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("does not allow unauthenticated publication", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.homepage.publish()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
