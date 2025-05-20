import { z } from "zod";

export const tenantRegSchema = z.object({
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
  mallId: z.string().min(1, { message: "Mall ID is required" }),
});

export type TenantRegValues = z.infer<typeof tenantRegSchema>;
