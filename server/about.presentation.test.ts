import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const aboutSource = readFileSync(resolve(process.cwd(), "client/src/pages/AboutPage.tsx"), "utf8");

const caller = appRouter.createCaller({
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("About presentation", () => {
  it("uses the homepage Hero visual and a 48-hour maximum response card", () => {
    expect(aboutSource).toContain("/manus-storage/spm-hero-exact-half-split_1a839b26.webp");
    expect(aboutSource).toContain('value: "48h"');
    expect(aboutSource).toContain('label: "Maximum Response"');
    expect(aboutSource).toContain("Italray C-Arm and surgical imaging equipment in a modern operating room");
  });

  it("publishes the same Hero and response language through the public CMS", async () => {
    const page = await caller.cms.publishedBySlug({ slug: "about" });
    expect(page).not.toBeNull();
    expect((page!.data as any).heroImage).toBe("/manus-storage/spm-hero-exact-half-split_1a839b26.webp");
    expect((page!.data as any).stats).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: "48h", label: "Maximum Response" }),
    ]));
  });
});
