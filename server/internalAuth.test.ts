import { describe, expect, it } from "vitest";
import { hashPassword, validatePassword, verifyPassword } from "./internalAuth";

describe("internal authentication", () => {
  it("hashes and verifies a valid password without storing plaintext", async () => {
    const password = "SecureOwnerPassword!9";
    const hash = await hashPassword(password);
    expect(hash).not.toContain(password);
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword("WrongPassword!9", hash)).toBe(false);
  });

  it("enforces the approved password baseline", () => {
    expect(validatePassword("short")).toContain("12 characters");
    expect(validatePassword("onlylowercasepassword")).toContain("uppercase");
    expect(validatePassword("SecurePasswordOnly")).toContain("number");
    expect(validatePassword("SecurePassword9")).toContain("special");
    expect(validatePassword("SecureOwnerPassword!9")).toBeNull();
  });
});
