import { describe, expect, it } from "vitest";
import { createLinkSchema } from "./link";

describe("createLinkSchema", () => {
  it("accepts a valid shortcut", () => {
    expect(createLinkSchema.safeParse({ slug: "design-system", destination: "https://example.com" }).success).toBe(true);
  });

  it.each(["Design", "two words", "-leading", "trailing-"])("rejects invalid slug %s", (slug) => {
    expect(createLinkSchema.safeParse({ slug, destination: "https://example.com" }).success).toBe(false);
  });

  it("rejects non-http protocols", () => {
    expect(createLinkSchema.safeParse({ slug: "docs", destination: "ftp://example.com" }).success).toBe(false);
  });
});
