import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(1)
  .max(39)
  .regex(/^[a-zA-Z0-9-]+$/, "Invalid GitHub username format");
