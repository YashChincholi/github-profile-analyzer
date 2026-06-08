import { z } from "zod";

const githubUsernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export const usernameSchema = z
  .string()
  .trim()
  .min(1, "Username is required")
  .max(39, "GitHub usernames cannot exceed 39 characters")
  .regex(githubUsernameRegex, "Invalid GitHub username format")
  .refine(
    (username) => !username.includes("--"),
    "GitHub usernames cannot contain consecutive hyphens",
  );

export const usernameParamsSchema = z.object({
  username: usernameSchema,
});

export const limitQuerySchema = z.object({
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(10),
});

export const languageQuerySchema = z.object({
  language: z
    .string()
    .trim()
    .min(1, "language query required")
    .max(50, "language too long"),
});
