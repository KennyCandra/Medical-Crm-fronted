import { z } from "zod";

export const loginSchema = z.object({
  nid: z
    .string()
    .min(14, { message: "National ID must be at least 14 numbers long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
