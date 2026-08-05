import { z } from "zod";

export const createLinkSchema = z.object({
  slug: z.string().trim().min(2, "Use at least 2 characters").max(48, "Keep shortcuts under 48 characters").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens"),
  destination: z.string().trim().url("Enter a complete URL, including https://").refine((value) => ["http:", "https:"].includes(new URL(value).protocol), "Only HTTP(S) URLs are supported"),
  description: z.string().trim().max(120, "Keep the description under 120 characters").optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
