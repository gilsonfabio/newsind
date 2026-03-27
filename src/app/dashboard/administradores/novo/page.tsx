"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ---------------- TYPES ----------------

type NewAdminForm = {
  admNome: string;
  admEmail: string;
  admSenha: string;
  admNivAcesso: number;
};

// ---------------- PAGE ----------------

export default function NewAdminPage() {
  const router = useRouter();

  const [form, setForm] = useState<NewAdminForm>({
    admNome: "",
    admEmail: "",
    admSenha: "",
    admNivAcesso: 0,
  });

  const handleChange = (field: keyof NewAdminForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/newadmin", form);
      alert("Administrador(a) cadastrado com sucesso!");
      router.back();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar administrador(a)!");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <Link href="/dashboard/admin">
          <Button variant="outline">← Voltar</Button>
        </Link>
      </div>

      <Card className="rounded-2xl shadow-sm max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Cadastrar Novo Administrador</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              placeholder="Nome do Usuário"
              value={form.admNome}
              onChange={(e) => handleChange("admNome", e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email do Usuário"
              value={form.admEmail}
              onChange={(e) => handleChange("admEmail", e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha do Usuário"
              value={form.admSenha}
              onChange={(e) => handleChange("admSenha", e.target.value)}
              required
            />
            <Input
              type="number"
              placeholder="Nível de Acesso"
              value={form.admNivAcesso}
              onChange={(e) => handleChange("admNivAcesso", Number(e.target.value))}
              required
            />
            <Button type="submit" className="mt-4">
              Salvar cadastro
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}