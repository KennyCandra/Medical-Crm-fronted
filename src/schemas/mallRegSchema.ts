import { z } from "zod";

export const mallRegSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  subdomain: z
    .string()
    .min(1, { message: "Subdomain is required" })
    .regex(/^[a-z0-9]+$/, {
      message: "Subdomain must be lowercase letters or numbers",
    })
    .max(20, { message: "Subdomain must be at most 20 characters" }),
  location: z.string().optional(),
  thumbnail: z.string().optional(),
});

export type MallRegValues = z.infer<typeof mallRegSchema>;
