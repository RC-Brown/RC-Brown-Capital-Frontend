import { z } from "zod";

export const RegisterInvestorSchema = z
  .object({
    email: z.string().email({ message: "Enter a valid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(50, { message: "Password must not be more than 50 characters" })
      .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,50}$/, {
        message: "Password must contain one number and one special character",
      }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    phoneNumber: z
      .string()
      .min(1, { message: "Phone number is required" })
      .max(20, { message: "Phone number must be below 20 characters" }),
    country: z.string().min(1, { message: "Country is required" }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const RegisterSponsorSchema = z
  .object({
    email: z.string().email({ message: "Enter a valid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(50, { message: "Password must not be more than 50 characters" })
      .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,50}$/, {
        message: "Password must contain one number and one special character",
      }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    phoneNumber: z
      .string()
      .min(1, { message: "Phone number is required" })
      .max(20, { message: "Phone number must be below 20 characters" }),
    country: z.string().min(1, { message: "Country is required" }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
    companyName: z.string().min(1, { message: "Company name is required" }),
    website: z.string().url({ message: "Please enter a valid website URL" }).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string(),
});

export type RegisterInvestorType = z.infer<typeof RegisterInvestorSchema>;
export type RegisterSponsorType = z.infer<typeof RegisterSponsorSchema>;
export type LoginType = z.infer<typeof LoginSchema>;
