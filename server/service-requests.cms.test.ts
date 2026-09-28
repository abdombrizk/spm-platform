import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function publicContext(): TrpcContext {
  return { user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("service request access", () => {
  it("keeps internal maintenance records protected", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.serviceRequests.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.serviceRequests.assignees()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.serviceRequests.get({ id: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("does not accept attachments for an unknown request", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.serviceRequests.uploadAttachment({ serviceRequestId: 999999, accessToken: "not-a-real-token-value", fileName: "device.jpg", contentType: "image/jpeg", sizeBytes: 10, dataUrl: "data:image/jpeg;base64,AA==" })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
