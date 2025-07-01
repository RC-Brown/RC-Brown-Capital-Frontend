# .eslintrc.json

```json
{
    "parserOptions": {
      "project": ["./tsconfig.json"]
    },
    "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "next/core-web-vitals", "prettier"],
    "env": {
      "es6": true,
      "jest": true,
      "browser": true
    },
    "plugins": ["unused-imports", "@typescript-eslint", "@stylistic"],
    "ignorePatterns": ["src/_tracker.js"],
    "rules": {
      "prefer-destructuring": [
        "error",
        {
          "array": true,
          "object": true
        }
      ],
      "no-restricted-imports": [
        "error",
        {
          "patterns": ["..*"]
        }
      ],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": ["error"],
      "@typescript-eslint/no-unsafe-argument": ["error"],
      "@typescript-eslint/no-unsafe-call": ["error"],
      "@typescript-eslint/no-unsafe-member-access": ["error"],
      "@typescript-eslint/no-unsafe-assignment": ["error"],
      "@typescript-eslint/no-unsafe-return": ["error"],
      "@typescript-eslint/no-floating-promises": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_",
          "caughtErrors": "all"
        }
      ]
    }
  }
  
```

# .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

```

# .prettierrc

```
{
    "trailingComma": "es5",
    "semi": true,
    "tabWidth": 2,
    "singleQuote": false,
    "jsxSingleQuote": true,
    "printWidth": 120,
    "plugins": ["prettier-plugin-tailwindcss"]
  }
  
```

# auth.ts

```ts
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcryptjs";
// import prisma from "@/src/lib/prisma";
import { SIGN_IN_METHOD_EMAIL } from "@/lib/constants/auth-constants";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        // firebaseIdToken: { label: "Firebase Token", type: "password" },
      },

      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password?: string;
          };

          if (!password) return null;

          const authMethod = SIGN_IN_METHOD_EMAIL;

          //   const user = await prisma.user.findFirst({
          //     where: { email },
          //     include: { email_verification: true },
          //   });

          //   if (!user || !user.active || (!user.password && !user.firebase_id_token) || (!firebaseIdToken && !password))
          //     return null;

          //   if (authMethod == "email" && !compareSync(password!, user.password ?? "")) return null;

          return {
            id: "1",
            email: "test@test.com",
            auth_method: authMethod,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }

      return token;
    },

    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          id: token.sub,
          email: (token as Partial<User>).email,
        },
      };
    },
  },
});

```

# components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

# eslint.config.mjs

```mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;

```

# next-env.d.ts

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

# next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole:
      process.env.APP_ENV != "development"
        ? {
            exclude: ["error"],
          }
        : false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    domains: ["firebasestorage.googleapis.com", "storage.googleapis.com"],
  },
};

export default nextConfig;

```

# package.json

```json
{
  "name": "rc-brown-capital",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write --ignore-path .gitignore ."
  },
  "dependencies": {
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@tanstack/react-query": "^5.80.6",
    "@tanstack/react-query-devtools": "^5.80.6",
    "@tanstack/react-virtual": "^3.13.12",
    "axios": "^1.9.0",
    "bcryptjs": "^3.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "country-list-with-dial-code-and-flag": "^5.1.0",
    "embla-carousel-autoplay": "^8.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.16.0",
    "lucide-react": "^0.513.0",
    "next": "15.3.3",
    "next-auth": "5.0.0-beta.25",
    "next-themes": "^0.4.6",
    "nextjs-toploader": "^3.8.16",
    "normalize-email": "^1.1.1",
    "nuqs": "^2.4.3",
    "react": "^19.0.0",
    "react-country-flag": "^3.1.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.2",
    "sonner": "^1.7.4",
    "tailwind-merge": "^3.3.1",
    "zod": "^3.25.56",
    "zustand": "^5.0.5"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@hookform/resolvers": "^3.10.0",
    "@types/next-auth": "^3.13.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "autoprefixer": "^10.4.21",
    "eslint": "^9",
    "eslint-config-next": "15.3.3",
    "eslint-config-prettier": "^10.1.5",
    "postcss": "^8.5.4",
    "prettier": "^3.5.3",
    "prettier-plugin-tailwindcss": "^0.6.12",
    "tailwindcss": "^3.4.0",
    "tw-animate-css": "^1.3.4",
    "typescript": "^5"
  }
}

```

# postcss.config.mjs

```mjs
// /** @type {import('tailwindcss').Config} */
// export default {
//   plugins: {
//     '@tailwindcss/postcss': {},
//   },
// }

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;

```

# public\file.svg

This is a file of the type: SVG Image

# public\globe.svg

This is a file of the type: SVG Image

# public\icons\buildings.svg

This is a file of the type: SVG Image

# public\icons\call.svg

This is a file of the type: SVG Image

# public\icons\facebook.svg

This is a file of the type: SVG Image

# public\icons\google.svg

This is a file of the type: SVG Image

# public\icons\instagram.svg

This is a file of the type: SVG Image

# public\icons\invest-buildings.svg

This is a file of the type: SVG Image

# public\icons\invest.svg

This is a file of the type: SVG Image

# public\icons\linkedin.svg

This is a file of the type: SVG Image

# public\icons\location.svg

This is a file of the type: SVG Image

# public\icons\mail.svg

This is a file of the type: SVG Image

# public\icons\twitter.svg

This is a file of the type: SVG Image

# public\icons\video-play.svg

This is a file of the type: SVG Image

# public\icons\youtube.svg

This is a file of the type: SVG Image

# public\images\about-section.png

This is a binary file of the type: Image

# public\images\facts.png

This is a binary file of the type: Image

# public\images\featured-listing-bg.png

This is a binary file of the type: Image

# public\images\hero-img.png

This is a binary file of the type: Image

# public\images\join-img.png

This is a binary file of the type: Image

# public\images\listing-1.png

This is a binary file of the type: Image

# public\images\listing-2.png

This is a binary file of the type: Image

# public\images\listing-3.png

This is a binary file of the type: Image

# public\images\login.png

This is a binary file of the type: Image

# public\images\logo-dark.png

This is a binary file of the type: Image

# public\images\logo-light.png

This is a binary file of the type: Image

# public\images\partner-logo1.png

This is a binary file of the type: Image

# public\images\partner-logo2.png

This is a binary file of the type: Image

# public\images\partner-logo3.png

This is a binary file of the type: Image

# public\images\partner-logo4.png

This is a binary file of the type: Image

# public\images\partner-logo5.png

This is a binary file of the type: Image

# public\images\partner-logo6.png

This is a binary file of the type: Image

# public\images\partner-logo7.png

This is a binary file of the type: Image

# public\images\partner-logo8.png

This is a binary file of the type: Image

# public\images\partner-logo9.png

This is a binary file of the type: Image

# public\images\partner-logo10.png

This is a binary file of the type: Image

# public\images\partner-logo11.png

This is a binary file of the type: Image

# public\images\partner-logo12.png

This is a binary file of the type: Image

# public\images\quick-insights.png

This is a binary file of the type: Image

# public\images\register-investor.png

This is a binary file of the type: Image

# public\images\register-sponsor.png

This is a binary file of the type: Image

# public\images\streamlined-investment.png

This is a binary file of the type: Image

# public\next.svg

This is a file of the type: SVG Image

# public\rc-favicon.png

This is a binary file of the type: Image

# public\vercel.svg

This is a file of the type: SVG Image

# public\window.svg

This is a file of the type: SVG Image

# README.md

```md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#   R C - B r o w n - C a p i t a l - F r o n t e n d  
 
```

# src\actions\auth.ts

```ts
import { z } from "zod";
import { signIn } from "../../auth";
import axios from "axios";

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

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });

    return { success: result.message, redirectTo: result.redirect_to };
  } catch (error) {
    console.log({ error });
    if (axios.isAxiosError(error)) {
      const response = error.response;

      if (response?.status === 422 && response.data?.errors) {
        return {
          error: "An error occured",
          fieldErrors: response.data.errors, // should be an object like { email: ["Taken"], password: ["Too short"] }
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
      redirectTo: "/",
    });
  } catch (error) {
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

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });

    return { success: result.message, redirectTo: result.redirect_to };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong" };
  }
}

```

# src\app\(auth)\components\dynamic-auth-image.tsx

```tsx
"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function DynamicAuthImage() {
  const pathname = usePathname();

  // Determine image source based on the current path
  const getImageSrc = (path: string) => {
    if (path.includes("register-investor")) {
      return "/images/register-investor.png";
    } else if (path.includes("register-sponsor")) {
      return "/images/register-sponsor.png";
    } else if (path.includes("login")) {
      return "/images/login.png";
    }
    // Default fallback
    return "/images/register-investor.png";
  };

  // Get alt text based on the current path
  const getAltText = (path: string) => {
    if (path.includes("register-investor")) {
      return "Modern residential building with wood and glass facade";
    } else if (path.includes("register-sponsor")) {
      return "Real estate investment and sponsorship opportunities";
    } else if (path.includes("login")) {
      return "Welcome back to your investment platform";
    }
    return "Modern residential building with wood and glass facade";
  };

  const imageSrc = getImageSrc(pathname);
  const altText = getAltText(pathname);

  return (
    <div className='relative h-full w-full'>
      {pathname.includes("register-sponsor") && (
        <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent sm:h-32' />
      )}
      {pathname.includes("register-sponsor") && (
        <div className='absolute bottom-8 left-8 right-8 z-10 text-white sm:bottom-11 sm:left-11 sm:right-11'>
          <p className='mb-5 text-3xl'>Let’s create your perfect portfolio.</p>
          <p className='text-sm'>
            Showcase your real estate projects to a network of verified investors sign up as a sponsor for free and
            start raising capital today.
          </p>
        </div>
      )}
      <Image src={imageSrc} alt={altText} width={604} height={865} className='h-full w-full object-cover' priority />
    </div>
  );
}

```

# src\app\(auth)\layout.tsx

```tsx
import { redirect } from "next/navigation";
import React from "react";
import { auth } from "../../../auth";
import DynamicAuthImage from "./components/dynamic-auth-image";
import Navbar from "@/components/molecules/navbar";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <div className=''>
      <Navbar />
      <div className='grid w-full grid-cols-1 items-start gap-6 bg-[#F5F5F5] px-12 pb-12 pt-32 sm:gap-12 lg:grid-cols-2'>
        <div className='hidden overflow-hidden rounded-[30px] lg:block'>
          <DynamicAuthImage />
        </div>
        <div className='flex w-full items-center justify-center'>{children}</div>
      </div>
    </div>
  );
}

```

# src\app\(auth)\login\page.tsx

```tsx
"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { LoginSchema, LoginType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const methods = useForm<LoginType>({ resolver: zodResolver(LoginSchema) });
  const { register, handleSubmit, formState } = methods;
  const { errors } = formState;
  const router = useRouter();

  const login = handleSubmit(async (data: LoginType) => {
    console.log(data);
  });

  return (
    <div className='w-full space-y-8 sm:max-w-lg'>
      {/* Header */}
      <div className='text-center lg:text-left'>
        <h1 className='mb-4 text-3xl font-semibold -tracking-[3%] text-primary lg:text-4xl'>Welcome Back! 👋</h1>
        <p className='text-sm tracking-[0%] text-text-muted'>
          Glad to have you here! Log in to explore exclusive real estate opportunities and manage your investments with
          ease.
        </p>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={login} className='w-2/3 space-y-4'>
          <div className='relative'>
            <Input
              id='email'
              type='email'
              {...register("email")}
              placeholder='Email'
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.email && <p className='text-xs text-red-500 sm:text-sm'>{errors.email.message}</p>}
          </div>

          <div>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder='Password'
                className='w-full rounded-md border-0 bg-white py-3 pl-2 pr-10 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-400' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-400' />
                )}
              </Button>
            </div>
            {errors.password && <p className='text-xs text-red-500 sm:text-sm'>{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            className='w-full rounded-md bg-[#D9D9D9] py-6 text-sm font-medium text-[#5F646A] hover:bg-primary hover:text-white disabled:pointer-events-auto disabled:cursor-not-allowed'
            disabled={!formState.isValid}
          >
            Login
          </Button>

          <div className='flex justify-end'>
            {/* Forgot Password */}
            <Link href='/forgot-password' className='text-sm text-black underline'>
              Forgot Password?
            </Link>
          </div>
        </form>
      </FormProvider>

      {/* Mobile Image */}
      <div className='mt-8 hidden'>
        <Card className='overflow-hidden'>
          <CardContent className='p-0'>
            <Image
              src='/images/building.png'
              alt='Modern residential building'
              width={400}
              height={300}
              className='h-48 w-full object-cover'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

```

# src\app\(auth)\register-investor\page.tsx

```tsx
"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RegisterInvestorSchema, RegisterInvestorType } from "@/types/forms";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import CountryList from "country-list-with-dial-code-and-flag";
import { toast } from "sonner";
import { redirectToGoogleOAuth } from "@/lib/utils";
import { signUpInvestor } from "@/actions/auth";

export default function InvestorSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("NG");
  const [code, setCode] = useState<string>("+234");
  const countryList = CountryList.getAll();

  const methods = useForm<RegisterInvestorType>({
    resolver: zodResolver(RegisterInvestorSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });
  const { register, handleSubmit, formState, setValue } = methods;
  const { errors } = formState;

  const handleChange = (value: string) => {
    const index = parseInt(value);
    const country = countryList[index];
    setSelectedCountry(country.code);
    setCode(country.dial_code);
  };
  const router = useRouter();

  const signUpEmail = handleSubmit(async (data: RegisterInvestorType) => {
    setEmailLoading(true);

    try {
      const response = await signUpInvestor({
        ...data,
        phoneNumber: code + data.phoneNumber,
      });

      console.log({
        response,
      });

      setEmailLoading(false);
      if (response.error) {
        const { error } = response;
        toast.error(error);
        return;
      }

      if (response.success) toast(response.success);
      const session = await getSession();

      if (!session) {
        throw new Error("Session not found");
      }

      router.push(response.redirectTo);
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      }
      setEmailLoading(false);
    }
  });

  return (
    <div className='w-full space-y-8 sm:max-w-lg'>
      {/* Header */}
      <div className='text-center lg:text-left'>
        <h1 className='mb-4 text-2xl font-light -tracking-[3%] text-primary lg:text-3xl'>
          Let's create your perfect portfolio.
        </h1>
        <p className='text-sm tracking-[0%] text-text-muted'>
          Explore exclusive real estate investing opportunities by registering for free on the top investment platform.
        </p>
      </div>

      <FormProvider {...methods}>
        {/* Form */}
        <form onSubmit={signUpEmail} className='w-2/3 space-y-4'>
          {/* First Name */}
          <div className='relative'>
            <Input
              id='firstName'
              {...register("firstName")}
              placeholder='First name'
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.firstName && <p className='text-xs text-red-500 sm:text-sm'>{errors.firstName.message}</p>}
          </div>
          <div className='relative'>
            <Input
              id='lastName'
              {...register("lastName")}
              placeholder='Last name'
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.lastName && <p className='text-xs text-red-500 sm:text-sm'>{errors.lastName.message}</p>}
          </div>
          <div className='relative'>
            <Input
              id='email'
              {...register("email")}
              placeholder='Email'
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.email && <p className='text-xs text-red-500 sm:text-sm'>{errors.email.message}</p>}
          </div>
          <div className='flex gap-2'>
            <Select onValueChange={(value) => handleChange(value)}>
              <SelectTrigger className='w-24 bg-white' id='phoneInput'>
                {/* todo: let this be based on their location */}
                <SelectValue defaultValue={"+234"} />
                <span className='flex items-center gap-1'>
                  <ReactCountryFlag className='emojiFlag' countryCode={selectedCountry} svg />
                  +234
                </span>
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {countryList.map((country, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    <span className='flex items-center gap-3'>
                      <ReactCountryFlag className='emojiFlag' countryCode={country.code} svg />
                      {country.name}
                      {country.dial_code}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='flex-1'>
              <Input
                type='tel'
                placeholder='Phone number'
                {...register("phoneNumber")}
                className='bg-white text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
              />
              {errors.phoneNumber && <p className='text-xs text-red-500 sm:text-sm'>{errors.phoneNumber.message}</p>}
            </div>
          </div>

          <Select
            {...register("country")}
            onValueChange={(value) => {
              setValue("country", value);
            }}
          >
            <SelectTrigger className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'>
              <SelectValue placeholder='Select country' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {countryList.map((country, index) => (
                <SelectItem key={index} value={index.toString()} className='hover:bg-primary hover:text-white'>
                  <span className='flex items-center gap-3'>
                    <ReactCountryFlag
                      className='emojiFlag'
                      countryCode={country.code}
                      svg
                      style={{ width: 20, height: 15 }}
                      loading='lazy'
                    />
                    {country.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder='Password'
                className='w-full rounded-md border-0 bg-white py-3 pl-2 pr-10 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-400' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-400' />
                )}
              </Button>
            </div>
            {errors.password && <p className='text-xs text-red-500 sm:text-sm'>{errors.password.message}</p>}
          </div>
          <div>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder='Confirm password'
                className='w-full rounded-md border-0 bg-white py-3 pl-2 pr-10 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-400' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-400' />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className='text-xs text-red-500 sm:text-sm'>{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <div className='flex items-start space-x-2'>
              <Controller
                control={methods.control}
                name='agreeToTerms'
                render={({ field }) => (
                  <Checkbox
                    id='terms'
                    checked={field.value}
                    className='mt-1 size-[14px] h-[14px] w-[14px] rounded-[4px] border-2 border-black/60 text-white'
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                )}
              />
              <Label htmlFor='terms' className='text-sm leading-relaxed text-black'>
                I have read and accept the{" "}
                <a href='#' className='text-[#55A2F0] underline'>
                  terms and condition
                </a>
              </Label>
            </div>
            {errors.agreeToTerms && <p className='text-xs text-red-500 sm:text-sm'>{errors.agreeToTerms.message}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            className={`w-full rounded-md bg-[#D9D9D9] py-6 text-sm font-medium text-[#5F646A] ${formState.isValid && "bg-primary text-white"} hover:bg-primary hover:text-white disabled:pointer-events-auto disabled:cursor-not-allowed`}
          >
            {emailLoading ? "Loading" : "Sign Up & Explore"}
          </Button>

          <div className='flex w-full items-center gap-2'>
            {/* Divider */}
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-sm text-text-muted/80'>
              Or
            </div>

            {/* Google Sign Up */}
            <Button
              type='button'
              variant='outline'
              className='flex-1 rounded-full border-0 bg-white py-[22px] text-sm text-text-muted/80'
              onClick={() => redirectToGoogleOAuth("Investor")}
            >
              <Image src='/icons/google.svg' alt='Google' width={24} height={24} />
              Continue with Google
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* Mobile Image */}
      <div className='mt-8 lg:hidden'>
        <Card className='overflow-hidden'>
          <CardContent className='p-0'>
            <Image
              src='/images/building.png'
              alt='Modern residential building'
              width={400}
              height={300}
              className='h-48 w-full object-cover'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

```

# src\app\(auth)\register-sponsor\page.tsx

```tsx
"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { RegisterSponsorSchema, RegisterSponsorType } from "@/types/forms";
import { FormProvider, useForm } from "react-hook-form";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import CountryList from "country-list-with-dial-code-and-flag";
import { toast } from "sonner";
import { redirectToGoogleOAuth } from "@/lib/utils";
import { signUpSponsor } from "@/actions/auth";

export default function SponsorSignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("NG");
  const [code, setCode] = useState<string>("+234");
  const countryList = CountryList.getAll();

  const handleChange = (value: string) => {
    const index = parseInt(value);
    const country = countryList[index];
    setSelectedCountry(country.code);
    setCode(country.dial_code);
  };

  const methods = useForm<RegisterSponsorType>({ resolver: zodResolver(RegisterSponsorSchema) });
  const { register, handleSubmit, formState } = methods;
  const { errors } = formState;
  const router = useRouter();

  const signUpEmail = handleSubmit(async (data: RegisterSponsorType) => {
    setEmailLoading(true);

    try {
      const response = await signUpSponsor(data);

      setEmailLoading(false);
      if (response.error) {
        const { error } = response;
        if (error == "User not found") {
          toast("Invalid Credentials");
        }
        toast(error);
        return;
      }

      if (response.success) toast(response.success);
      const session = await getSession();

      if (!session) {
        throw new Error("Session not found");
      }

      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast(error.message);
      }
      setEmailLoading(false);
    }
  });

  return (
    <div className='w-full space-y-8 sm:max-w-lg'>
      {/* Header */}
      <div className='text-center lg:text-left'>
        <h1 className='mb-4 text-2xl font-light -tracking-[3%] text-primary lg:text-3xl'>Sign Up</h1>
        <p className='hidden text-sm tracking-[0%] text-text-muted'>
          Explore exclusive real estate investing opportunities by registering for free on the top investment platform.
        </p>
      </div>

      <FormProvider {...methods}>
        {/* Form */}
        <form onSubmit={signUpEmail} className='w-2/3 space-y-4'>
          {/* First Name */}
          <div className='relative'>
            <Input
              id='firstName'
              {...register("firstName")}
              placeholder='First name'
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.firstName && <p className='text-xs text-red-500 sm:text-sm'>{errors.firstName.message}</p>}
          </div>
          <div className='relative'>
            <Input
              id='lastName'
              {...register("lastName")}
              placeholder='Last name'
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.lastName && <p className='text-xs text-red-500 sm:text-sm'>{errors.lastName.message}</p>}
          </div>
          <div className='relative'>
            <Input
              id='email'
              {...register("email")}
              placeholder='Email'
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.email && <p className='text-xs text-red-500 sm:text-sm'>{errors.email.message}</p>}
          </div>
          <div className='flex gap-2'>
            <Select onValueChange={(value) => handleChange(value)}>
              <SelectTrigger className='w-24 bg-white' id='phoneInput'>
                {/* todo: let this be based on their location */}
                <SelectValue defaultValue={"+234"} />
                <span className='flex items-center gap-1'>
                  <ReactCountryFlag className='emojiFlag' countryCode={selectedCountry} svg />
                  +234
                </span>
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {countryList.map((country, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    <span className='flex items-center gap-3'>
                      <ReactCountryFlag className='emojiFlag' countryCode={country.code} svg />
                      {country.name}
                      {country.dial_code}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='flex-1'>
              <Input
                type='tel'
                placeholder='Phone number'
                {...register("phoneNumber")}
                className='bg-white text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
              />
              {errors.phoneNumber && <p className='text-xs text-red-500 sm:text-sm'>{errors.phoneNumber.message}</p>}
            </div>
          </div>

          <Select {...register("country")}>
            <SelectTrigger className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'>
              <SelectValue
                placeholder='Select country'
                className='text-text-muted/80 placeholder:text-sm placeholder:text-text-muted/80'
              />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              {countryList.map((country, index) => (
                <SelectItem key={index} value={index.toString()}>
                  <span className='flex items-center gap-3'>
                    <ReactCountryFlag className='emojiFlag' countryCode={country.code} svg />
                    {country.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <Input
              type='text'
              placeholder='Company name'
              {...register("companyName")}
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.companyName && <p className='text-xs text-red-500 sm:text-sm'>{errors.companyName.message}</p>}
          </div>

          <div>
            <Input
              type='url'
              placeholder='Website (optional)'
              {...register("website")}
              className='w-full rounded-md border-0 bg-white px-2 py-3 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
            />
            {errors.website && <p className='text-xs text-red-500 sm:text-sm'>{errors.website.message}</p>}
          </div>

          <div>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder='Password'
                className='w-full rounded-md border-0 bg-white py-3 pl-2 pr-10 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-400' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-400' />
                )}
              </Button>
            </div>
            {errors.password && <p className='text-xs text-red-500 sm:text-sm'>{errors.password.message}</p>}
          </div>
          <div>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder='Confirm password'
                className='w-full rounded-md border-0 bg-white py-3 pl-2 pr-10 text-sm shadow-none placeholder:text-sm placeholder:text-text-muted/80'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-400' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-400' />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className='text-xs text-red-500 sm:text-sm'>{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <div className='flex items-start space-x-2'>
              <Checkbox
                id='terms'
                {...register("agreeToTerms")}
                className='mt-1 size-[14px] h-[14px] w-[14px] rounded-[4px] border-2 border-black/60 text-white'
              />
              <Label htmlFor='terms' className='text-sm leading-relaxed text-black'>
                I have read and accept the{" "}
                <a href='#' className='text-[#55A2F0] underline'>
                  terms and condition
                </a>
              </Label>
            </div>
            {errors.agreeToTerms && <p className='text-xs text-red-500 sm:text-sm'>{errors.agreeToTerms.message}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            className={`w-full rounded-md bg-[#D9D9D9] py-6 text-sm font-medium text-[#5F646A] hover:bg-primary hover:text-white disabled:pointer-events-auto disabled:cursor-not-allowed`}
            disabled={!formState.isValid}
          >
            Submit
          </Button>

          <div className='flex w-full items-center gap-2'>
            {/* Divider */}
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-sm text-text-muted/80'>
              Or
            </div>

            {/* Google Sign Up */}
            <Button
              type='button'
              variant='outline'
              className='flex-1 rounded-full border-0 bg-white py-[22px] text-sm text-text-muted/80'
              onClick={() => redirectToGoogleOAuth("Sponsor")}
            >
              <Image src='/icons/google.svg' alt='Google' width={20} height={20} />
              Continue with Google
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* Mobile Image */}
      <div className='mt-8 lg:hidden'>
        <Card className='overflow-hidden'>
          <CardContent className='p-0'>
            <Image
              src='/images/building.png'
              alt='Modern residential building'
              width={400}
              height={300}
              className='h-48 w-full object-cover'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

```

# src\app\(global)\home\page.tsx

```tsx
export default function Home() {
  return <div className='min-h-screen bg-background-secondary'>home</div>;
}

```

# src\app\(global)\layout.tsx

```tsx
import React from "react";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function GlobalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const pathname = (await headers()).get("x-next-pathname") || (await headers()).get("referer") || "";
  if (!session && !pathname.includes("home")) {
    redirect("/login");
  }
  return <main>{children}</main>;
}

```

# src\app\api\auth\[...nextauth]\route.ts

```ts
import { handlers } from "../../../../../auth";
export const { GET, POST } = handlers;

// // app/api/auth/[...nextauth]/route.ts
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { NextAuthOptions } from "next-auth";

// // Extend NextAuth types
// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//     };
//   }

//   interface User {
//     accessToken?: string;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     accessToken?: string;
//   }
// }

// const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Email & Password",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) return null;
//         const res = await fetch(`${process.env.AUTH_API_BASE}/login`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(credentials),
//         });
//         const user = await res.json();
//         if (res.ok && user.token) {
//           return {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             accessToken: user.token,
//           };
//         }
//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user?.accessToken) token.accessToken = user.accessToken;
//       return token;
//     },
//     async session({ session, token }) {
//       if (token.sub) {
//         session.user.id = token.sub;
//       }
//       if (token.accessToken) {
//         session.accessToken = token.accessToken;
//       }
//       return session;
//     },
//   },
//   session: { strategy: "jwt" },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

```

# src\app\error.tsx

```tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Error</h1>
      <Button onClick={() => router.push("/")}>Go to Home</Button>
    </div>
  );
}

```

# src\app\globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-pps: var(--font-pps);
}

@layer utilities {
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 63.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

body {
  font-family: var(--font-pps);
}

@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}

```

# src\app\layout.tsx

```tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

const pps = Poppins({
  variable: "--font-pps",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  adjustFontFallback: false,
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RC Brown Capital",
  description: "Gateway to high yeid Real Estate Investments",
  icons: {
    icon: "/rc-favicon.png",
    shortcut: "/rc-favicon.png",
    apple: "/rc-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning={true} className='h-full'>
      <body className={`${pps.variable} antialiased`} suppressHydrationWarning={true}>
        <Providers>
          {children}
          <NextTopLoader color='#1F3B5F' showSpinner={false} />
          <Toaster   richColors={true} closeButton position='top-center' />
        </Providers>
      </body>
    </html>
  );
}

```

# src\app\not-found.tsx

```tsx
export default function NotFound() {
  return <div>Not Found</div>;
}

```

# src\app\page.tsx

```tsx
import Navbar from "@/components/molecules/navbar";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FeaturedListings from "@/components/molecules/featured-listings";
import TestimonialCarousel from "@/components/molecules/testimonial-carousel";
import Footer from "@/components/molecules/footer";

export default function Home() {
  return (
    <div className='min-h-screen bg-background-secondary'>
      <Navbar />
      {/* Hero Section */}
      <section className='relative min-h-[70vh] medium:min-h-[90vh]'>
        <div className='absolute inset-0'>
          <Image src='/images/hero-img.png' alt='Business meeting' fill className='h-full object-cover' priority />
        </div>

        <div className='container relative mx-auto px-4 pt-16 sm:px-6 sm:pt-20 lg:px-16 lg:pt-24'>
          <div className='max-w-xs sm:max-w-sm xl:max-w-lg'>
            <h1 className='mb-6 text-2xl font-bold leading-tight text-white sm:mb-8 sm:text-3xl lg:text-[42px] lg:leading-[1.5] xl:text-[48px] xl:leading-[1.5]'>
              Gateway to high <br className='hidden sm:block' /> yield Real Estate Investments.
            </h1>

            <div className='mb-12 flex flex-col gap-3 rounded-md bg-white bg-opacity-10 bg-clip-padding p-3 backdrop-blur-2xl backdrop-filter sm:mb-16 sm:flex-row sm:gap-4'>
              <Input placeholder='Email' className='border-0 bg-white/90 text-xs placeholder:text-black' />
              <Button className='px-4 text-xs font-medium sm:px-6'>Join RC Brown</Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className='absolute -bottom-[280px] left-1/2 grid w-[90%] max-w-6xl -translate-x-1/2 gap-4 sm:-bottom-[300px] sm:gap-6 md:-bottom-[305px] md:grid-cols-3 md:gap-6 xl:gap-8'>
            <Card className='group cursor-pointer rounded-[10px] border-none bg-white p-3 shadow-lg transition-all duration-300 ease-in-out hover:bg-primary hover:text-white'>
              <CardContent className='p-3 py-8 sm:py-10'>
                <div className='flex flex-col items-center space-y-4 text-center sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0 sm:text-left'>
                  <Image
                    src='/icons/invest.svg'
                    alt='Invest Smarter'
                    width={40}
                    height={40}
                    className='flex-shrink-0 sm:h-[50px] sm:w-[50px]'
                  />
                  <div>
                    <h3 className='text-lg font-normal leading-[1.4] sm:text-xl xl:text-2xl'>
                      Invest Smarter, Live Better. Your Path to Passive Income Starts Here.
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='group cursor-pointer rounded-[10px] border-none bg-white p-3 shadow-lg transition-all duration-300 ease-in-out hover:bg-primary hover:text-white'>
              <CardContent className='p-3 py-8 sm:py-10'>
                <div className='flex flex-col items-center space-y-4 text-center sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0 sm:text-left'>
                  <Image
                    src='/icons/buildings.svg'
                    alt='Invest Smarter'
                    width={40}
                    height={40}
                    className='flex-shrink-0 sm:h-[50px] sm:w-[50px]'
                  />
                  <div>
                    <h3 className='text-lg font-normal leading-[1.4] sm:text-xl xl:text-2xl'>
                      Own a Piece of the Property Pie - Real Estate for Every Investor.
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='group cursor-pointer rounded-[10px] border-none bg-white p-3 shadow-lg transition-all duration-300 ease-in-out hover:bg-primary hover:text-white md:col-span-1'>
              <CardContent className='p-3 py-8 sm:py-10'>
                <div className='flex flex-col items-center space-y-4 text-center sm:flex-row sm:items-start sm:space-x-6 sm:space-y-0 sm:text-left'>
                  <Image
                    src='/icons/invest-buildings.svg'
                    alt='Invest Smarter'
                    width={40}
                    height={40}
                    className='flex-shrink-0 sm:h-[50px] sm:w-[50px]'
                  />
                  <div>
                    <h3 className='text-lg font-normal leading-[1.4] sm:text-xl xl:text-2xl'>
                      Diversify and Relax, Unwind from Stock Market Stress.
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className='mt-32 bg-white sm:mt-56'>
        <div className='container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:px-16 lg:py-20'>
          <div className='grid gap-8 lg:grid-cols-2 lg:gap-12 xl:items-center'>
            <div className='order-2 lg:order-1'>
              <h2 className='mb-4 text-2xl font-semibold leading-[1.4] tracking-tight text-primary sm:mb-6 sm:text-3xl lg:leading-[1.4] xl:text-4xl'>
                Streamlined investment made <br className='hidden xl:block' /> simple and effortless
              </h2>
              <p className='mb-4 text-sm leading-relaxed text-text-muted sm:mb-6'>
                Whether you&apos;re a first-time investor or expanding a seasoned portfolio, our marketplace equips you
                with the tools, insights, and support needed to make smart, efficient investment decisions.
              </p>
              <p className='mb-6 text-sm leading-relaxed text-text-muted sm:mb-8'>
                Our platform streamlines the process of discovering and evaluating direct investment opportunities.
                Browse a curated selection of commercial real estate projects, access detailed financial documents, join
                live webinars with developers, and submit investment offers—all from the comfort of your home.
              </p>
              <Button className='px-8 py-3 text-sm font-medium sm:px-8 sm:py-4 lg:py-6'>Join RC Brown</Button>
            </div>
            <div className='relative order-1 lg:order-2'>
              <Image
                src='/images/streamlined-investment.png'
                alt='Investment professional'
                width={638}
                height={444}
                className='h-auto w-full rounded-[10px]'
              />
            </div>
          </div>
        </div>
      </section>

      <FeaturedListings />

      {/* About Us Section */}
      <section className='py-12 sm:py-16 lg:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-16'>
          <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-12'>
            <div className='relative order-2 lg:order-1'>
              <Image
                src='/images/about-section.png'
                alt='Team meeting'
                width={588}
                height={395}
                className='h-auto w-full rounded-lg'
              />
            </div>
            <div className='order-1 lg:order-2'>
              <h2 className='mb-4 text-2xl font-semibold text-primary sm:mb-6 sm:text-3xl lg:text-4xl'>About us</h2>
              <p className='mb-4 text-sm leading-relaxed text-text-muted sm:mb-6'>
                Welcome to RC Brown Homes, a leading multinational real estate investment company headquartered in the
                United States. With a dynamic and visionary approach, we have curated a diverse portfolio that exceeds
                $150,000,000 in value while funding an average of $10,000,000 transactions per month.
              </p>
              <p className='mb-6 text-sm leading-relaxed text-text-muted sm:mb-8 sm:text-base'>
                Our mission is to redefine the real estate landscape by creating exceptional residential and commercial
                properties that stand as testaments to innovation, quality, and sustainability.
              </p>
              <Button className='flex items-center gap-2 py-3 text-sm font-normal has-[>svg]:px-5 sm:py-4 has-[>svg]:sm:px-5 lg:py-5'>
                Read More <ArrowRight className='size-3 sm:size-4' />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className='relative py-12 text-white sm:py-16 lg:py-20'>
        <div className='absolute inset-0'>
          <Image src='/images/facts.png' alt='Real estate property' fill className='object-cover' />
          <div className='absolute inset-0 bg-gray-900/60' />
        </div>

        <div className='container relative mx-auto px-4 sm:px-6 lg:px-16'>
          <div className='grid gap-6 sm:gap-8 lg:grid-cols-3'>
            <div className='lg:col-span-1'>
              <h2 className='mb-4 text-2xl font-light sm:text-3xl lg:text-4xl'>
                SOME INTERESTING <br />
                <span className='text-2xl font-semibold sm:text-3xl lg:text-4xl'>FACTS</span>
              </h2>
            </div>
            <div className='lg:col-span-2'>
              <p className='text-sm font-light'>
                RC Brown capital, USA has achieved a platinum institutional status in the American real estate sector,
                boasting of access to over $100,000,000 in investable dollars on an annualized basis.
              </p>
              <div className='mt-8 grid gap-6 text-center sm:mt-12 sm:grid-cols-3 sm:gap-8 lg:mt-16'>
                <div className=''>
                  <div className='mb-1 text-4xl font-bold sm:text-5xl'>100+</div>
                  <div className='text-sm font-light'>Deals Funded</div>
                </div>
                <div className=''>
                  <div className='mb-1 text-4xl font-bold sm:text-5xl'>$150M</div>
                  <div className='text-sm font-light'>Million Invested</div>
                </div>
                <div className=''>
                  <div className='mb-1 text-4xl font-bold sm:text-5xl'>200+</div>
                  <div className='text-sm font-light'>Realized Deals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Insights Section */}
      <section className='bg-white py-12 sm:py-16 lg:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-16'>
          <div className='grid items-center gap-8 lg:grid-cols-2 lg:gap-12'>
            <div className='order-2 lg:order-1'>
              <h2 className='mb-4 text-2xl font-semibold text-primary sm:mb-5 sm:text-3xl lg:text-4xl'>
                Quick Insights
              </h2>
              <p className='mb-6 text-sm leading-relaxed text-text-muted sm:mb-8 lg:max-w-[80%]'>
                Access real-time data, market trends, and personalized investment. Consider properties with given
                certifications, as they may offer long-term value and appeal to environmentally conscious tenants.
              </p>
              <Button className='flex items-center gap-2 text-sm font-light has-[>svg]:pr-4 has-[>svg]:sm:pr-5'>
                Learn More <ArrowRight className='size-3' />
              </Button>
            </div>
            <div className='relative order-1 lg:order-2'>
              <Image
                src='/images/quick-insights.png'
                alt='Modern house illustration'
                width={655}
                height={468}
                className='mx-auto h-auto w-full'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Partners */}
      <section className='bg-white py-12 sm:py-16'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-16'>
          <div className='rounded-[20px] border-b-2 border-black bg-gradient-to-b from-white from-10% via-[#f5f5f5] via-45% to-[#f5f5f5] px-4 py-8 sm:rounded-[30px] sm:px-8 sm:py-12'>
            <h2 className='mb-8 text-center text-2xl font-semibold text-primary sm:mb-12 sm:text-3xl lg:text-4xl'>
              A Selection of Our Institutional Partners
            </h2>

            <div className='grid grid-cols-2 items-center gap-4 sm:gap-8 md:grid-cols-4 lg:grid-cols-6'>
              {/* Partner logos - using placeholder images */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className='flex aspect-[2/1] items-center justify-center rounded-md bg-white p-2'>
                  <Image
                    src={`/images/partner-logo${i + 1}.png`}
                    alt={`Partner ${i + 1}`}
                    width={120}
                    height={60}
                    className='h-auto max-h-full w-auto max-w-full object-contain'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className='bg-white py-12 sm:py-16 lg:py-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-16'>
          <TestimonialCarousel />
        </div>
      </section>

      <section className='bg-white pb-12 sm:pb-16 lg:pb-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-16'>
          <div className='flex flex-col overflow-hidden rounded-2xl bg-[#2A2A2A] sm:rounded-3xl md:flex-row'>
            <div className='flex flex-col justify-center px-6 py-8 md:w-[54%] md:px-8 xl:px-12'>
              <h2 className='mb-4 text-xl font-semibold tracking-tight text-white sm:mb-6 sm:text-2xl md:text-3xl lg:max-w-[78%] lg:leading-[1.5] xl:text-4xl xl:leading-[1.6]'>
                Sign up with RC Brown Capital today & unlock premium real estate opportunities.
              </h2>
              <Button
                className='w-fit border-2 border-white bg-white/10 px-8 py-3 text-xs font-semibold text-white hover:border-tertiary hover:bg-tertiary hover:font-semibold hover:text-primary sm:px-10 sm:py-4 lg:px-10 lg:py-5'
                variant='outline'
              >
                Join RC BROWN
              </Button>
            </div>
            <div className='h-64 md:h-auto md:w-[46%]'>
              <Image
                src='/images/join-img.png'
                alt='RC Brown Capital team working'
                width={615}
                height={410}
                className='h-full w-full object-cover'
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

```

# src\app\providers.tsx

```tsx
"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
// import { NuqsAdapter } from "nuqs/adapters/next/app";
// todo: add nuqs adapter

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* <NuqsAdapter> */}
      <SessionProvider>{children}</SessionProvider>
      {/* </NuqsAdapter> */}
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </QueryClientProvider>
  );
}

```

# src\app\template.tsx

```tsx
"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeOut", duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

```

# src\components\molecules\featured-listings.tsx

```tsx
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedListings() {
  const autoplay = useRef(Autoplay({ delay: 2100, stopOnInteraction: false }));
  const lisitngs = [
    {
      name: "John Apartment",
      description:
        "123 Main St, Anytown, USA. This beautiful apartment features 2 spacious bedrooms, 2 modern bathrooms, a fully equipped kitchen, and a large living area with plenty of natural light. Located in the heart of Anytown, it offers easy access to shopping, dining, and public transportation. Perfect for families or professionals seeking comfort and convenience.",
      image: "/images/listing-1.png",
    },
    {
      name: "1004 North 10th Street",
      description:
        "1004 North 10th Street, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-2.png",
    },
    {
      name: "RC Brown Apartment",
      description:
        "RC Brown Apartment, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-3.png",
    },
    {
      name: "Avery Apartments",
      description:
        "Avery Apartments, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-1.png",
    },
    {
      name: "Baker Apartments",
      description:
        "Baker Apartments, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-3.png",
    },
    {
      name: "Cleveland Apartments",
      description:
        "Cleveland Apartments, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-2.png",
    },
    {
      name: "Drexel Apartments",
      description:
        "Drexel Apartments, Philadelphia, PA 19123. This stunning property offers 3 spacious bedrooms, 2.5 modern bathrooms, an open-concept kitchen with stainless steel appliances, and a sunlit living room perfect for entertaining. Enjoy hardwood floors throughout, a private backyard, and convenient access to local shops, restaurants, and public transportation. Ideal for families or professionals seeking a blend of comfort and city living.",
      image: "/images/listing-1.png",
    },
  ];

  return (
    <section className='medium:min-h-screen medium:h-auto medium:max-h-fit relative h-[90vh] max-h-[650px]'>
      <div className='absolute inset-0'>
        <Image src='/images/featured-listing-bg.png' alt='Business meeting' fill className='object-cover' priority />
      </div>
      <div className='container relative mx-auto px-4 pb-6 pt-16 sm:px-6 sm:pb-9 sm:pt-20 lg:pt-28'>
        <div className='flex flex-col items-center text-center'>
          <Image src='/icons/video-play.svg' alt='Video play' width={56} height={56} className='mx-auto' />

          <h2 className='mt-2 text-2xl font-bold uppercase text-white sm:mt-3 sm:text-3xl lg:text-4xl'>
            The Marketplace for{" "}
            <span className='text-text-tertiary'>
              Smart <br /> Investments
            </span>
          </h2>

          <Button
            variant={"outline"}
            className='mx-auto mt-4 flex border-2 bg-white/10 px-10 py-3 text-xs font-bold text-white duration-75 hover:border-tertiary hover:bg-tertiary hover:text-primary sm:mt-5 sm:px-12 sm:py-4 lg:px-16 lg:py-6 lg:text-sm'
          >
            Invest Now
          </Button>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplay.current]}
          className='medium:lg:mt-32 mx-auto mt-16 w-full max-w-5xl sm:mt-24 lg:mt-24'
          onMouseEnter={() => autoplay.current.stop()}
          onMouseLeave={() => autoplay.current.play()}
        >
          <CarouselContent className='-ml-2'>
            {lisitngs.map((listing, index) => (
              <CarouselItem key={index} className='pl-1 md:basis-1/2 lg:basis-1/3'>
                <div className='p-1'>
                  <Card className='group relative h-48 cursor-pointer overflow-hidden rounded-[10px] border-2 border-[#D9D9D9] sm:h-56 lg:h-[190px] lg:border-4'>
                    <div className='absolute inset-0 -z-10'>
                      <Image src={listing.image} alt='Business meeting' fill className='object-cover' priority />
                    </div>
                    <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent sm:h-24' />
                    <CardContent className='relative flex h-full items-center justify-center p-4 sm:p-6'>
                      <span className='absolute bottom-3 left-3 z-10 text-lg font-semibold text-white transition-opacity duration-200 group-hover:opacity-0 sm:bottom-4 sm:left-4'>
                        {listing.name}
                      </span>
                      <span className='absolute bottom-3 left-3 right-3 z-10 line-clamp-2 text-sm font-light text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:bottom-4 sm:left-4 sm:right-4 sm:text-base'>
                        {listing.description}
                      </span>
                      <span className='absolute right-3 top-3 z-10 rounded-md bg-white/40 bg-opacity-50 bg-clip-padding px-2 py-1 text-sm font-medium uppercase text-white opacity-0 backdrop-blur-lg backdrop-filter transition-opacity duration-200 group-hover:opacity-100 sm:right-4 sm:top-4 sm:px-3 sm:py-2 sm:text-base lg:text-lg'>
                        Invest Now
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant='ghost'
            customIcon={
              <ChevronLeft className='box-content size-5 rounded-full bg-white/15 p-1.5 text-white sm:size-6 sm:p-2' />
            }
            className='left-2 xl:-left-10'
          />
          <CarouselNext
            variant='ghost'
            customIcon={
              <ChevronRight className='box-content size-5 rounded-full bg-white/15 p-1.5 text-white sm:size-6 sm:p-2' />
            }
            className='right-2 xl:-right-10'
          />
        </Carousel>
      </div>
    </section>
  );
}

```

# src\components\molecules\footer.tsx

```tsx
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className='bg-primary pt-12 text-white sm:pt-16 lg:pt-20'>
      <div className='container mx-auto max-w-full px-4 sm:px-8 lg:pl-16'>
        <div className='grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-6 lg:gap-16'>
          {/* Logo and Company Info */}
          <div className='col-span-1 -mt-8 space-y-4 md:col-span-2 lg:space-y-6'>
            <div>
              <Image src='/images/logo-light.png' alt='RC Brown Capital' width={227} height={55} className='' />
            </div>
            <p className='text-xs text-white'>An online real estate investing platform</p>

            {/* Contact Info Box */}
            <div className='max-w-full space-y-3 rounded-[10px] bg-[#254773] px-4 py-6 sm:max-w-[280px] sm:space-y-4 sm:px-5 sm:py-8'>
              <div className='flex items-start'>
                <Image
                  src='/icons/location.svg'
                  alt='Map Pin'
                  className='mr-3 mt-0.5 flex-shrink-0'
                  width={16}
                  height={16}
                />
                <p className='text-xs'>687 Adeola Hopewell Street, Victoria Island, Lagos.</p>
              </div>
              <div className='flex items-center'>
                <Image src='/icons/call.svg' alt='Phone' className='mr-3 mt-0.5 flex-shrink-0' width={16} height={16} />
                <p className='text-xs'>07080185222</p>
              </div>
              <div className='flex items-center'>
                <Image src='/icons/mail.svg' alt='Mail' className='mr-3 mt-0.5 flex-shrink-0' width={16} height={16} />
                <p className='text-xs'>support@singlereos.com</p>
              </div>
            </div>
          </div>

          <div className='col-span-1 grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-4 lg:grid-cols-4 lg:gap-8'>
            {/* About Links */}
            <div>
              <h3 className='mb-3 text-base font-semibold sm:text-lg'>ABOUT</h3>
              <ul className='space-y-1'>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Who we are
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Contacts
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    In the News
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className='mb-3 text-base font-semibold sm:text-lg'>QUICK LINKS</h3>
              <ul className='space-y-1'>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Agents
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Stories
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Our Portfolio
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Contacts
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Posting Policy
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Policy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Invest Links and Social Media */}
            <div>
              <h3 className='mb-3 text-base font-semibold sm:text-lg'>INVEST</h3>
              <ul className='space-y-1'>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Browse Marketplace
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Ways To Invest
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Marketplace Performance
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Investment Thesis
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Review Process
                  </Link>
                </li>
                <li>
                  <Link href='#' className='text-xs text-gray-300 transition-colors hover:text-white'>
                    Our Investor Commitments
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='mb-3 text-base font-semibold sm:text-lg'>FOLLOW US</h3>
              <ul className='space-y-3 sm:space-y-4'>
                <li>
                  <Link href='#' className='flex items-center text-sm text-gray-300 transition-colors hover:text-white'>
                    <Image src='/icons/facebook.svg' alt='Facebook' className='mr-3' width={16} height={16} />
                    <span>Facebook</span>
                  </Link>
                </li>
                <li>
                  <Link href='#' className='flex items-center text-sm text-gray-300 transition-colors hover:text-white'>
                    <Image src='/icons/twitter.svg' alt='Twitter' className='mr-3' width={16} height={16} />
                    <span>Twitter</span>
                  </Link>
                </li>
                <li>
                  <Link href='#' className='flex items-center text-sm text-gray-300 transition-colors hover:text-white'>
                    <Image src='/icons/instagram.svg' alt='Instagram' className='mr-3' width={16} height={16} />
                    <span>Instagram</span>
                  </Link>
                </li>
                <li>
                  <Link href='#' className='flex items-center text-sm text-gray-300 transition-colors hover:text-white'>
                    <Image src='/icons/linkedin.svg' alt='LinkedIn' className='mr-3' width={16} height={16} />
                    <span>LinkedIn</span>
                  </Link>
                </li>
                <li>
                  <Link href='#' className='flex items-center text-sm text-gray-300 transition-colors hover:text-white'>
                    <Image src='/icons/youtube.svg' alt='YouTube' className='mr-3' width={16} height={16} />
                    <span>YouTube</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-8 border-t border-gray-700 py-6 text-center text-xs text-white/75 sm:mt-10 sm:py-5'>
          Copyright 2025 All rights Reserved. RC Brown Homes.
        </div>
      </div>
    </footer>
  );
}

```

# src\components\molecules\navbar.tsx

```tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useMediaQuery } from "@/lib/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const session = useSession().data;
  const pathname = usePathname();
  const authPaths = ["login", "register-investor", "register-sponsor"];
  const isAuthPath = authPaths.some((authPath) => pathname.includes(authPath));

  console.log(session);

  const menu = [
    {
      name: "Invest",
      subMenu: [
        {
          name: "Start Investing",
          href: "#",
        },
        {
          name: "How it works",
          href: "#",
        },
        {
          name: "Screening Process",
          href: "#",
        },
      ],
      hidden: false,
    },
    {
      name: "About Us",
      subMenu: [
        {
          name: "Who we are",
          href: "#",
        },
        {
          name: "Careers",
          href: "#",
        },
        {
          name: "Contacts",
          href: "#",
        },
        {
          name: "In the News",
          href: "#",
        },
      ],
      hidden: false,
    },
    {
      name: "Resources",
      subMenu: [
        {
          name: "Blogs",
          href: "#",
        },
        {
          name: "Videos",
          href: "#",
        },
        {
          name: "FAQ's",
          href: "#",
        },
        {
          name: "Glossary terms",
          href: "#",
        },
      ],
      hidden: false,
    },
    {
      name: "Sponsor",
      subMenu: [
        {
          name: "Raise capital",
          href: "#",
        },
        {
          name: "Post Fundraise",
          href: "#",
        },
        {
          name: "Request Info",
          href: "#",
        },
      ],
      hidden: false,
    },
    {
      name: "Testimonials",
      href: "#",
      hidden: false,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
      setOpenSubmenu(null);
    }
  };

  const toggleSubmenu = (menuName: string) => {
    setOpenSubmenu(openSubmenu === menuName ? null : menuName);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenSubmenu(null);
  };

  return (
    <>
      <header className='fixed top-0 z-50 w-full bg-white shadow-sm'>
        <div className='container mx-auto px-4 py-3 sm:px-6 lg:px-14 lg:py-[26px]'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Link href='/' className='flex-shrink-0'>
              <Image
                src='/images/logo-dark.png'
                alt='logo'
                width={isMobile ? 160 : 200}
                height={isMobile ? 48 : 35}
                priority
                className=''
              />
            </Link>

            {/* Desktop Navigation */}
            {!isMobile && !isAuthPath && (
              <NavigationMenu viewport={false}>
                <NavigationMenuList>
                  {menu.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      {item.href ? (
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className='py-2 text-xs font-semibold text-text-muted transition-colors hover:text-black'
                          >
                            {item.name}
                          </Link>
                        </NavigationMenuLink>
                      ) : (
                        <>
                          <NavigationMenuTrigger className='px-2 text-xs font-semibold text-text-muted transition-colors hover:text-black'>
                            {item.name}
                          </NavigationMenuTrigger>
                          {item.subMenu && (
                            <NavigationMenuContent className='min-w-[180px] bg-white p-0'>
                              {item.subMenu.map((subItem, index) => (
                                <NavigationMenuLink
                                  key={index}
                                  asChild
                                  className='block px-4 py-3 text-xs font-semibold text-text-muted transition-all hover:bg-primary hover:text-white'
                                >
                                  <Link href={subItem.href}>{subItem.name}</Link>
                                </NavigationMenuLink>
                              ))}
                            </NavigationMenuContent>
                          )}
                        </>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}

            {/* Desktop Auth Buttons */}
            {!isMobile && !session && (
              <div className='flex items-center space-x-4 xl:space-x-6'>
                <Button variant='link' className='px-0 text-sm font-normal' asChild>
                  <Link href='/login'>Log in</Link>
                </Button>
                <NavigationMenu viewport={false}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className='bg-primary px-6 py-2 text-sm font-semibold text-white hover:bg-primary/90 xl:px-8'>
                        Sign up
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className='min-w-[200px] bg-white p-0'>
                        <NavigationMenuLink
                          asChild
                          className='block px-4 py-3 text-sm font-semibold text-text-muted transition-all hover:bg-primary hover:text-white'
                        >
                          <Link href='/register-investor'>Register as Investor</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink
                          asChild
                          className='block px-4 py-3 text-sm font-semibold text-text-muted transition-all hover:bg-primary hover:text-white'
                        >
                          <Link href='/register-sponsor'>Register as Sponsor</Link>
                        </NavigationMenuLink>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            )}

            {!isMobile && session && (
              <Button variant='link' className='px-0 text-sm font-normal'>
                {/* profile pic ideally here */}
                Log Out
              </Button>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={toggleMobileMenu}
                className='relative z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 transition-all duration-300 hover:bg-gray-200'
                aria-label='Toggle mobile menu'
              >
                <div className='relative h-6 w-6'>
                  <span
                    className={`absolute left-0 top-1 h-0.5 w-6 bg-gray-800 transition-all duration-300 ${
                      isMobileMenuOpen ? "top-3 rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-3 h-0.5 w-6 bg-gray-800 transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`absolute left-0 top-5 h-0.5 w-6 bg-gray-800 transition-all duration-300 ${
                      isMobileMenuOpen ? "top-3 -rotate-45" : ""
                    }`}
                  />
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-40 transition-all duration-300 ${
            isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
          }`}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              isMobileMenuOpen ? "bg-opacity-50" : "bg-opacity-0"
            }`}
            onClick={closeMobileMenu}
          />

          {/* Mobile Menu */}
          <div
            className={`absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className='flex h-full flex-col'>
              {/* Mobile Menu Header */}
              <div className='flex items-center justify-between border-b border-gray-200 p-4'>
                <Image src='/images/logo-dark.png' alt='logo' width={140} height={100} className='h-auto w-auto' />
                <button
                  onClick={closeMobileMenu}
                  className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200'
                  aria-label='Close menu'
                >
                  <X className='h-5 w-5 text-gray-600' />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className='flex-1 overflow-y-auto px-4 py-4'>
                <nav className='space-y-2'>
                  {menu.map((item) => (
                    <div key={item.name} className='border-b border-gray-100 pb-2 last:border-b-0'>
                      {item.href ? (
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className='block py-3 text-lg font-semibold text-text-muted transition-colors hover:text-primary'
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleSubmenu(item.name)}
                            className='flex w-full items-center justify-between py-3 text-left text-lg font-semibold text-text-muted transition-colors hover:text-primary'
                          >
                            {item.name}
                            <ChevronDown
                              className={`h-5 w-5 transition-transform duration-200 ${
                                openSubmenu === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {item.subMenu && (
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                openSubmenu === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className='ml-4 space-y-1 border-l-2 border-gray-100 pl-4'>
                                {item.subMenu.map((subItem, index) => (
                                  <Link
                                    key={index}
                                    href={subItem.href}
                                    onClick={closeMobileMenu}
                                    className='block py-2 text-base text-text-muted transition-colors hover:text-primary'
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Mobile Auth Buttons */}
              {!session ? (
                <div className='space-y-3 border-t border-gray-200 p-4'>
                  <Button
                    variant='outline'
                    className='w-full py-3 text-base font-semibold'
                    onClick={closeMobileMenu}
                    asChild
                  >
                    <Link href='/login'>Log in</Link>
                  </Button>
                  <Button
                    className='w-full py-3 text-base font-semibold'
                    onClick={closeMobileMenu}
                    variant={"link"}
                    asChild
                  >
                    <Link href='/register' className='h-full w-full'>
                      Sign up
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button variant='outline' className='w-full py-3 text-base font-semibold' onClick={closeMobileMenu}>
                  Log Out
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

```

# src\components\molecules\testimonial-carousel.tsx

```tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks/use-mobile";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  rating: number;
  content: string;
  avatar: string;
}

export default function TestimonialCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "John Smith",
      role: "Business Owner",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "John Smith",
      role: "Investor",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "John Smith",
      role: "Business Analyst",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      role: "Real Estate Agent",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 5,
      name: "Michael Brown",
      role: "Property Developer",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 6,
      name: "Emily Davis",
      role: "First-time Buyer",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 7,
      name: "Robert Wilson",
      role: "Commercial Investor",
      rating: 5,
      content:
        "Exceptional service from start to finish! The team was professional, knowledgeable, and made the entire buying process smooth and stress-free. Highly recommend for anyone looking to invest in real estate.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ];

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const getItemBasis = () => {
    if (isMobile) return "basis-full";
    if (isTablet) return "md:basis-1/2";
    return "lg:basis-1/3";
  };

  return (
    <div className='mx-auto w-full max-w-7xl px-4 py-8 sm:py-12'>
      <div className='mb-8 flex flex-col items-center justify-between gap-4 sm:mb-12 sm:flex-row sm:gap-0'>
        <h2 className='text-center text-2xl font-semibold text-primary sm:text-left sm:text-3xl lg:text-4xl'>
          What Investors are Saying
        </h2>
        <div className='flex gap-2'>
          <Button
            onClick={() => api?.scrollPrev()}
            variant='outline'
            size='icon'
            className='h-10 w-10 rounded-full border-2 border-primary hover:bg-primary hover:text-white xl:h-12 xl:w-12'
          >
            <ChevronLeft className='size-4 xl:size-5' />
            <span className='sr-only'>Previous slide</span>
          </Button>
          <Button
            onClick={() => api?.scrollNext()}
            variant='outline'
            size='icon'
            className='h-10 w-10 rounded-full border-2 border-primary hover:bg-primary hover:text-white xl:h-12 xl:w-12'
          >
            <ChevronRight className='size-4 xl:size-5' />
            <span className='sr-only'>Next slide</span>
          </Button>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className='w-full'
      >
        <CarouselContent className='-ml-2 sm:-ml-4'>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className={`pl-2 sm:pl-4 ${getItemBasis()}`}>
              <div className='flex h-full flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-6'>
                <div className='mb-3 flex space-x-1 text-[#FF9811]'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className='size-3 fill-current sm:size-4' />
                  ))}
                </div>
                <p className='mb-4 flex-grow text-sm text-text-muted sm:mb-6'>{testimonial.content}</p>
                <div className='flex items-center gap-3'>
                  <div className='relative h-10 w-10 overflow-hidden rounded-full sm:h-12 sm:w-12'>
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold text-text-muted'>{testimonial.name}</h4>
                    <p className='text-xs font-light text-[#55A2F0] sm:text-sm'>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className='mt-4 flex justify-center gap-2 sm:mt-6'>
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              current === index ? "w-4 bg-primary sm:w-6" : "bg-text-muted/40"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

```

# src\components\ui\button.tsx

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-background-primary text-white hover:bg-hover-primary transition-all duration-300 ease-in-out",
        destructive:
          "bg-destructive text-white transition-all duration-300 ease-in-out shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent transition-all duration-300 ease-in-out hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 transition-all duration-300 ease-in-out",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 transition-all duration-300 ease-in-out",
        link: "text-black underline-offset-4 hover:underline transition-all duration-200 ease-in-out",
      },
      size: {
        default: "h-9 px-7 py-3 has-[>svg]:px-3 rounded-[5px]",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 rounded-[5px]",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 rounded-[5px]",
        icon: "size-9 rounded-[5px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp data-slot='button' className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };

```

# src\components\ui\card.tsx

```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```

# src\components\ui\carousel.tsx

```tsx
"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role='region'
          aria-roledescription='carousel'
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div ref={carouselRef} className='overflow-hidden'>
        <div
          ref={ref}
          className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className)}
          {...props}
        />
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        role='group'
        aria-roledescription='slide'
        className={cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className)}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { customIcon?: React.ReactNode }
>(({ className, variant = "outline", size = "icon", customIcon, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      {customIcon ? customIcon : <ArrowLeft className='h-4 w-4' />}
      <span className='sr-only'>Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { customIcon?: React.ReactNode }
>(({ className, variant = "outline", size = "icon", customIcon, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      {customIcon ? customIcon : <ArrowRight className='h-4 w-4' />}
      <span className='sr-only'>Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };

```

# src\components\ui\checkbox.tsx

```tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

```

# src\components\ui\input.tsx

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

```

# src\components\ui\label.tsx

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

```

# src\components\ui\navigation-menu.tsx

```tsx
import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}

```

# src\components\ui\select.tsx

```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

```

# src\components\ui\sonner.tsx

```tsx
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

```

# src\lib\constants\auth-constants.ts

```ts
export const SIGN_IN_METHOD_EMAIL = "email";
export const SIGN_IN_METHOD_GOOGLE = "google";
export const USER_ROLE_INVESTOR = "investor";
export const USER_ROLE_SPONSOR = "sponsor";

```

# src\lib\hooks\use-mobile.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);

    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
}

```

# src\lib\utils.ts

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function redirectToGoogleOAuth(role: "Investor" | "Sponsor") {
  window.location.href = `${BASE_URL}/api/auth/google/redirect?role=${role}`;
}

```

# src\types\forms.ts

```ts
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
    agreeToTerms: z.boolean({ message: "You must agree to the terms and conditions" }),
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
    agreeToTerms: z.boolean({ message: "You must agree to the terms and conditions" }),
    companyName: z.string().min(1, { message: "Company name is required" }),
    website: z.string().url({ message: "Please enter a valid website URL" }),
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

```

# tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F3B5F",
        tertiary: "#82D361",
        hover: {
          primary: "#000000",
        },
        background: {
          primary: "#1F3B5F",
          secondary: "#F5F5F5",
        },
        text: {
          primary: "#1F3B5F",
          muted: "#4A4A4A",
          tertiary: "#82D361",
        },
      },
      screens: {
        // Target screens with max-height of 400px
        medium: { raw: "(max-height: 780px)" },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;

```

# tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

