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
  it("uses the homepage Hero visual, lifecycle message and audience paths", () => {
    expect(aboutSource).toContain("/manus-storage/spm-hero-exact-half-split_1a839b26.webp");
    expect(aboutSource).toContain('value: "48h"');
    expect(aboutSource).toContain('label: "Maximum Response"');
    expect(aboutSource).toContain("Italray C-Arm and surgical imaging equipment in a modern operating room");
    expect(aboutSource).toContain("Engineering continuity for critical imaging systems.");
    expect(aboutSource).toContain('id="who-we-serve"');
    expect(aboutSource).toContain("Systems");
    expect(aboutSource).toContain("Outcome:");
    expect(aboutSource).toContain('href="/spare-parts"');
    expect(aboutSource).toContain("image={heroImage}");
    expect(aboutSource).not.toContain("ISO 9001 Certified");
    expect(aboutSource).not.toContain("License No. 2528/7");
  });

  it("publishes the same Hero and response language through the public CMS", async () => {
    const page = await caller.cms.publishedBySlug({ slug: "about" });
    expect(page).not.toBeNull();
    expect((page!.data as any).heroImage).toBe("/manus-storage/spm-hero-exact-half-split_1a839b26.webp");
    expect((page!.data as any).stats).toEqual(expect.arrayContaining([
      expect.objectContaining({ value: "48h", label: "Maximum Response" }),
    ]));
    expect((page!.data as any).title).toBe("Engineering continuity for critical imaging systems.");
    expect((page!.data as any).partners).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "Hermann Medizintechnik", status: "Exclusive Agent" }),
    ]));
    expect((page!.data as any).quality?.[0]).toEqual(expect.objectContaining({ title: "Quality review framework" }));
    expect((page!.data as any).operatingModel?.[0]).toEqual(expect.objectContaining({ outcome: "Documented diagnosis" }));
  });
});
