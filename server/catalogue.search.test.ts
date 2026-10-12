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
});
