"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ---------------- TYPES ----------------

type FiliacaoForm = {
  filUsrId: number;
  filId: number;
  filNome: string;
  filNascimento: string;
};

// ---------------- PAGE ----------------

export default function NovaFiliacaoPage() {
  const router = useRouter();
  const params = useParams();

  const usrId = Number(params.usrId);

  const [form, setForm] = useState<FiliacaoForm>({
    filUsrId: usrId,
    filId: 0,
    filNome: "",
    filNascimento: "",
  });

  // ---------------- HANDLE INPUT ----------------

  function handleChange(field: keyof FiliacaoForm, value: string | number) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // ---------------- SUBMIT ----------------

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/newfiliacao", form);

      alert("Filiação cadastrada com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao cadastrar filiação:", error);
      alert("Erro ao cadastrar filiação");
    }
  }

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* botão voltar */}
      <div>
        <Button variant="outline" onClick={() => router.back()}>
          ← Voltar
        </Button>
      </div>

      <Card className="max-w-xl rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Nova Filiação - Usuário {usrId}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* código */}
            <div className="space-y-2">
              <Label>Código da Filiação</Label>
              <Input
                type="number"
                value={form.filId}
                onChange={(e) =>
                  handleChange("filId", Number(e.target.value))
                }
                required
              />
            </div>

            {/* nome */}
            <div className="space-y-2">
              <Label>Nome da Filiação</Label>
              <Input
                value={form.filNome}
                onChange={(e) => handleChange("filNome", e.target.value)}
                required
              />
            </div>

            {/* nascimento */}
            <div className="space-y-2">
              <Label>Data de Nascimento</Label>
              <Input
                type="date"
                value={form.filNascimento}
                onChange={(e) =>
                  handleChange("filNascimento", e.target.value)
                }
                required
              />
            </div>

            {/* botão salvar */}
            <Button type="submit" className="w-full">
              Salvar Cadastro
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}