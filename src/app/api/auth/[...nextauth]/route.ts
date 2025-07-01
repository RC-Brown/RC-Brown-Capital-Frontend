import { handlers } from "@/auth";
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
