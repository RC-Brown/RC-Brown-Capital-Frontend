import { z } from "zod";
import axios from "axios";
import { signIn } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const signUpInvestorSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Enter a valid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    country: z.string().min(1, { message: "Country is required" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    agreeToTerms: z.boolean().refine((val) => val, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function signUpInvestor(data: z.infer<typeof signUpInvestorSchema>) {
  const validatedFields = signUpInvestorSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { firstName, lastName, email, password, confirmPassword, country, phoneNumber } = validatedFields.data;

  try {
    const response = await axios.post(
      `${BASE_URL}/api/register/investor`,
      {
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        password_confirmation: confirmPassword,
        country,
        phone: phoneNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const result = response.data;

    return { success: result.message, redirectTo: "/home" };
  } catch (error) {
    console.log({ error });
    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response?.status === 422 && response.data?.errors) {
        return {
          error: "An error occured",
          fieldErrors: response.data.errors,
        };
      }

      return {
        error: response?.data?.message || "Request failed",
      };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong" };
  }
}

const signUpSponsorSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Enter a valid email" }),
    companyName: z.string().min(1, { message: "Company name is required" }),
    website: z.string().url({ message: "Enter a valid website URL" }),
    country: z.string().min(1, { message: "Country is required" }),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function signUpSponsor(data: z.infer<typeof signUpSponsorSchema>) {
  const validatedFields = signUpSponsorSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { firstName, lastName, email, companyName, website, country, phoneNumber, password, confirmPassword } =
    validatedFields.data;

  try {
    const response = await axios.post(
      `${BASE_URL}/api/register/sponsor`,
      {
        firstname: firstName,
        lastname: lastName,
        email,
        company_name: companyName,
        website,
        country,
        phone: phoneNumber,
        password,
        password_confirmation: confirmPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    const result = response.data;

    return { success: result.message, redirectTo: result.redirect_to };
  } catch (error) {
    console.log({ error });
    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response?.status === 422 && response.data?.errors) {
        return {
          error: "An error occured",
          fieldErrors: response.data.errors,
        };
      }

      return {
        error: response?.data?.message || "Request failed",
      };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong" };
  }
}

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z.string(),
});

export async function login(data: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    console.log({ error });
    if (axios.isAxiosError(error)) {
      const response = error.response;

      // if (response?.status === 422 && response.data?.errors) {
      //   return {
      //     error: "An error occured",
      //     fieldErrors: response.data.errors,
      //   };
      // }

      return {
        error: response?.data?.message || "Request failed",
      };
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong" };
  }
}
