import { z } from "zod";

export const phoneSchema = z.object({
  area_code: z.string().min(2).max(2),
  number: z.string().min(8),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  telephones: z.array(phoneSchema).default([]),
});

export type SignUpForm = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginForm = z.infer<typeof loginSchema>;
