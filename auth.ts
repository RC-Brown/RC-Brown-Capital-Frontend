import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SIGN_IN_METHOD_EMAIL } from "@/src/lib/constants/auth-constants";
import axios from "axios";

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

          try {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
              {
                email,
                password,
              },
              {
                headers: { "Content-Type": "application/json", Accept: "application/json" },
              }
            );

            if (res.status !== 200 || !res.data.token) {
              return null;
            }

            const user: User = {
              id: res.data.user.id.toString(),
              email: res.data.user.email,
              name: `${res.data.user.firstname} ${res.data.user.lastname}`,
              firstname: res.data.user.firstname,
              lastname: res.data.user.lastname,
              auth_method: authMethod,
              role: res.data.user.role,
              country: res.data.user.country,
              phone: res.data.user.phone,
              token: res.data.token,
            };

            return user;
          } catch (err) {
            console.error("Login error:", err);
            return null;
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.token) {
        token.accessToken = user.token;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = session.user || {};
      session.user.id = token.sub ?? "";
      session.user.email = token.email ?? "";
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});
