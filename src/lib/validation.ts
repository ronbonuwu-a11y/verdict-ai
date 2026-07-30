import { z } from "zod";

const safeUrl = z
  .string()
  .trim()
  .max(2048, "URL is too long.")
  .url("Enter a valid URL.")
  .refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  }, "URL must use http or https.");

export const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email("Enter a valid email address."),
  website: z.string().max(0).optional(),
}).strict();

export const nominationSchema = z.object({
  toolName: z.string().trim().min(1, "Tool name is required.").max(120, "Tool name is too long."),
  toolUrl: z.union([z.literal(""), safeUrl]).optional(),
  reason: z.string().trim().min(10, "Please add a little more detail.").max(2000, "Reason is too long."),
  website: z.string().max(0).optional(),
}).strict();

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email("Enter a valid email address."),
  password: z.string().min(12, "Password must be at least 12 characters.").max(128, "Password is too long."),
  website: z.string().max(0).optional(),
}).strict();

export const commentSchema = z.object({
  body: z.string().trim().min(20, "Comments must be at least 20 characters.").max(1000, "Comments must be 1,000 characters or fewer."),
  website: z.string().max(0).optional(),
}).strict();

export const rerateSchema = z.object({
  company: z.string().trim().min(2, "Company name is required.").max(120),
  email: z.string().trim().toLowerCase().max(254).email("Enter a valid email address."),
  toolName: z.string().trim().min(2, "Tool name is required.").max(120),
  reviewUrl: z.union([z.literal(""), safeUrl]).optional(),
  evidence: z.string().trim().min(50, "Please provide at least 50 characters of evidence.").max(4000, "Evidence is too long."),
  website: z.string().max(0).optional(),
}).strict();

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type NominationInput = z.infer<typeof nominationSchema>;
export type CredentialsInput = z.infer<typeof credentialsSchema>;
