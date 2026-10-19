import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const catalogueSource = readFileSync(resolve(process.cwd(), "client/src/pages/Catalogue.tsx"), "utf8");

describe("Catalogue search presentation", () => {
  it("keeps a compact search-only control below the hero", () => {
    expect(catalogueSource).toContain('aria-label="Catalogue search"');
    expect(catalogueSource).toContain('placeholder="Search systems, models or capabilities"');
    expect(catalogueSource).not.toContain("Search and filters");
    expect(catalogueSource).not.toContain("All manufacturers");
    expect(catalogueSource).not.toContain("All clinical categories");
    expect(catalogueSource).not.toContain("Sort systems");
  });

  it("presents products as a visual showcase without the removed comparison panels", () => {
    expect(catalogueSource).toContain("Product showcase");
    expect(catalogueSource).toContain("Explore system");
    expect(catalogueSource).not.toContain("Quick comparison");
    expect(catalogueSource).not.toContain("Equipment finder");
    expect(catalogueSource).not.toContain("Compare system");
  });
});
