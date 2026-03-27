"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black">
        <p className="text-zinc-600 dark:text-zinc-300">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-6">
      
      {/* Logo */}
      <Image
        src="/logo.png"
        alt="Logo"
        width={120}
        height={120}
        className="mb-6"
        priority
      />

      {/* Título */}
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
        Bem-vindo ao Sistema
      </h1>

      {/* Usuário logado */}
      {session ? (
        <>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Logado como <strong>{session.user?.email}</strong>
          </p>

          <Link
            href="/dashboard"
            className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-medium hover:scale-105 transition mb-3"
          >
            Ir para o Dashboard
          </Link>

          <button
            onClick={() => signOut()}
            className="text-red-500 font-medium hover:underline"
          >
            Sair da conta
          </button>
        </>
      ) : (
        <>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-center max-w-md">
            Faça login para acessar o painel e utilizar todas as funcionalidades do sistema.
          </p>

          <button
            onClick={() => signIn()}
            className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-xl font-medium hover:scale-105 transition"
          >
            Entrar no sistema
          </button>
        </>
      )}
    </div>
  );
}