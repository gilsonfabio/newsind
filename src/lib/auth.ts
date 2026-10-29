import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { api } from "./api";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        senha: {
          label: "Senha",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.senha) {
            return null;
          }

          const response = await api.post("/signInAdm", {
            email: credentials.email,
            password: credentials.senha,
          });

          const user = response.data;

          // O backend informa que a senha foi migrada.
          // O usuário deverá realizar o login novamente.
          if (user?.forceRelogin) {
            throw new Error("RELOGIN_REQUIRED");
          }

          // Verifica se o backend retornou os dados esperados.
          if (!user?.id || !user?.accessToken) {
            console.error(
              "Resposta inesperada do backend no login:",
              user
            );

            return null;
          }

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
          };
        } catch (error: any) {
          // Não substitui o erro especial de migração da senha.
          if (error.message === "RELOGIN_REQUIRED") {
            throw error;
          }

          // A API respondeu com um erro HTTP.
          if (error.response) {
            console.error(
              "Erro no login - Status HTTP:",
              error.response.status
            );

            console.error(
              "Resposta do backend:",
              error.response.data
            );

            // Credenciais rejeitadas ou outra resposta HTTP.
            return null;
          }

          // A API não retornou uma resposta HTTP.
          console.error(
            "Erro de comunicação com o backend:",
            error.message
          );

          throw new Error(
            "Erro ao conectar com o servidor de autenticação"
          );
        }
      },
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

        token.accessToken = (
          user as typeof user & {
            accessToken?: string;
          }
        ).accessToken;

        token.refreshToken = (
          user as typeof user & {
            refreshToken?: string;
          }
        ).refreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
