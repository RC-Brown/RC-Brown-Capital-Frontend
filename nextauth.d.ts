import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    auth_method: string;
    role: string;
    country: string;
    phone: string;
    token: string;
  }

  interface Session extends DefaultSession {
    user: Partial<User>;
    accessToken?: string;
  }
}
