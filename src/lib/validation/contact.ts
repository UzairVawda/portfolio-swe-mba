import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Required").max(200),
  email: z.string().trim().email("Enter a valid email").max(320),
  message: z.string().trim().min(1, "Required").max(5000),
  role: z.string().trim().max(200).optional().or(z.literal("")),
  reason: z.string().trim().max(500).optional().or(z.literal("")),
  source: z.enum(["portfolio", "mba"]),
});

export type ContactInput = z.infer<typeof contactSchema>;
