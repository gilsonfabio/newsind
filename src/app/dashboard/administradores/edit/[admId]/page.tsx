"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ---------------- TYPES ----------------

type AdminForm = {
  admNome: string;
  admEmail: string;
  admSenha: string;
  admNivAcesso: number;
};

// ---------------- PAGE ----------------

export default function EditAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const admId = searchParams.get("admId"); // ex: /dashboard/admin/edit?admId=1

  const [form, setForm] = useState<AdminForm>({
    admNome: "",
    admEmail: "",
    admSenha: "",
    admNivAcesso: 0,
  });

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    if (!admId) return;

    async function loadAdmin() {
      try {
        const res = await api.get(`/searchAdmin/${admId}`);
        const admin = res.data[0];
        setForm({
          admNome: admin.admNome,
          admEmail: admin.admEmail,
          admSenha: admin.admSenha,
          admNivAcesso: Number(admin.admNivAcesso),
        });
      } catch (error) {
        console.error("Erro ao carregar administrador:", error);
        alert("Erro ao carregar os dados do administrador.");
      }
    }

    loadAdmin();
  }, [admId]);

  // ---------------- HANDLE CHANGE ----------------

  const handleChange = (field: keyof AdminForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ---------------- HANDLE SUBMIT ----------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admId) return;

    try {
      await api.put(`/altadmin/${admId}`, form);
      alert("Administrador(a) alterado com sucesso!");
      router.back();
    } catch (error) {
      console.error(error);
      alert("Erro ao alterar administrador(a)!");
    }
  };

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Button variant="outline" onClick={() => router.back()}>
        ← Voltar
      </Button>

      <Card className="rounded-2xl shadow-sm max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Alterar Administrador
          </CardTitle>
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
              Salvar Alteração
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}