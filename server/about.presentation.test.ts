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
    expect(aboutSource).toContain("/manus-storage/Gemini_Generated_Image_in1ewmin1ewmin1e_ea370a5c.webp");
    expect(aboutSource).toContain("Pioneering clinical continuity");
    expect(aboutSource).toContain('value: "48h"');
    expect(aboutSource).toContain('label: "Maximum Response"');
    expect(aboutSource).not.toContain("02.</span> Italray Mobile C-Arm System");
    expect(aboutSource).not.toContain("01.</span> Hermann Surgical &amp; Endoscopy");
    expect(aboutSource).not.toContain("03.</span> Mobile Workstation &amp; Viewing Monitor");
    expect(aboutSource).toContain('id="visual-story"');
    expect(aboutSource).toContain("spm-carmex-maintenance-card-optimized_fde07293.jpg");
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
    expect((page!.data as any).heroImage).toBe("/manus-storage/Gemini_Generated_Image_in1ewmin1ewmin1e_ea370a5c.webp");
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
