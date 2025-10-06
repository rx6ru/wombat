import { z } from "zod";

//sample limits for now

export const ApiKeySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long"),

  service: z
    .string()
    .max(50, "Service name too long")
    .optional(),

  key: z
    .string()
    .min(1, "Key is required")
    .max(500, "Key is too long"),

  reqSample: z
    .json()
    .optional(),

  resSample: z
    .json()
    .optional(), 

  description: z
    .string()
    .max(500, "Description too long")
    .optional(),

  isActive: z
    .boolean()
    .default(true),
});

export type ApiKeyInput = z.infer<typeof ApiKeySchema>;
