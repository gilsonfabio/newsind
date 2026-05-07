import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "./api";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        try {
          const response = await api.post("/signInAdm", {
            email: credentials?.email,
            password: credentials?.senha,
          });

          const user = response.data;

          if (user?.forceRelogin) {
            throw new Error("RELOGIN_REQUIRED");
        }

          if (!user) return null;

          return user;

        } catch (error: any) {
          throw new Error(
            error.response?.data?.message || "Erro ao autenticar"
          );
        }
      }
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};