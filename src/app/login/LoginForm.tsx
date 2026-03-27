"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const result = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });

    if (result?.error) {
      setErro("Email ou senha inválidos");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex">
      {/* IMAGEM */}
      <div className="hidden lg:flex w-1/2 relative">
        <Image
          src="/login.jpg"
          alt="Login"
          fill
          className="object-cover"
        />
      </div>

      {/* FORM */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white dark:bg-zinc-900 px-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Entrar na conta
          </h1>

          {erro && (
            <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-sm">
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-xl dark:bg-zinc-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Senha"
              className="w-full p-3 border rounded-xl dark:bg-zinc-800"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <button className="w-full bg-black text-white py-3 rounded-xl font-semibold">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}