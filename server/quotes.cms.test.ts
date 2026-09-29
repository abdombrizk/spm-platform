import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function publicContext(): TrpcContext {
  return { user: null, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("quote request access", () => {
  it("keeps internal quote data protected", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.quotes.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.quotes.assignees()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(caller.quotes.get({ id: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("does not accept attachments for an unknown request", async () => {
    const caller = appRouter.createCaller(publicContext());
    await expect(caller.quotes.uploadAttachment({ quoteRequestId: 999999, accessToken: "token-12345678901234567890", fileName: "brief.pdf", contentType: "application/pdf", sizeBytes: 10, dataUrl: "data:application/pdf;base64,AA==" })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
