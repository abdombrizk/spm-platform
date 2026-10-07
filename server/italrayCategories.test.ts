import { describe, expect, it } from "vitest";
import { italrayCategoryLinks } from "../client/src/lib/italrayCategories";

describe("Italray category navigation", () => {
  it("exposes seven stable category destinations", () => {
    expect(italrayCategoryLinks).toHaveLength(7);
    expect(new Set(italrayCategoryLinks.map(item => item.href)).size).toBe(7);
  });

  it("keeps equipment categories scoped to the internal Italray catalogue", () => {
    const equipmentLinks = italrayCategoryLinks.slice(0, 6);
    for (const item of equipmentLinks) {
      expect(item.href).toMatch(/^\/catalogue\?brand=italray&q=/);
    }
  });

  it("routes an unavailable Solar X-Ray category to a structured quote", () => {
    expect(italrayCategoryLinks.at(-1)?.href).toBe("/request-a-quote?brand=italray&product=Solar%20X-Ray");
  });
});
