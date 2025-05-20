import { z } from "zod";

export const patientRegSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    nid: z.string().min(1, { message: "NID is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, {
      message: "Password confirmation is required",
    }),
    birth_date: z.string().min(1, { message: "Birth date is required" }),
    gender: z.string().min(1, { message: "Gender is required" }),
    blood_type: z.string().min(1, { message: "Blood type is required" }),
    email: z.string().email({
      message: "Invalid email address",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const doctorRegSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    nid: z.string().min(1, { message: "NID is required" }),
    blood_type: z.string().min(1, { message: "Blood type is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, {
      message: "Password confirmation is required",
    }),
    gender: z.string().min(1, { message: "Gender is required" }),
    license: z.string().min(1, { message: "License is required" }),
    speciality: z.string().min(1, { message: "Speciality is required" }),
    birth_date: z.string().min(1, { message: "Birth date is required" }),
    email: z.string().email({
      message: "Invalid email address",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const resetPasswordUsingEmailSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, {
      message: "Password confirmation is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type PatientRegSchemaType = z.infer<typeof patientRegSchema>;
export type DoctorRegSchemaType = z.infer<typeof doctorRegSchema>;
export type resetPasswordUsingEmailSchemaType = z.infer<
  typeof resetPasswordUsingEmailSchema
>;
export type resetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
