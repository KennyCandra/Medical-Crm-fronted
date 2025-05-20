import { z } from "zod";

export const userRegSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, {
      message: "Password confirmation is required",
    }),
    role: z.enum(["PLATFORM_ADMIN", "TENANT_ADMIN", "CUSTOMER"], {
      errorMap: () => ({ message: "Role is required" }),
    }),
    tenantId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const userUpdateSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .optional(),
  confirmPassword: z
    .string()
    .min(8, {
      message: "Password confirmation is required",
    })
    .optional(),
  role: z.enum(["PLATFORM_ADMIN", "TENANT_ADMIN", "CUSTOMER"], {
    errorMap: () => ({ message: "Role is required" }),
  }),
  tenantId: z.string().optional(),
});

export type UserRegValues = z.infer<typeof userRegSchema>;
export type UserUpdateValues = z.infer<typeof userUpdateSchema>;
