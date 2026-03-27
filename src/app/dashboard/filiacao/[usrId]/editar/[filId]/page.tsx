"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ---------------- TYPES ----------------

type Filiacao = {
  filNome: string;
  filNascimento: string;
};

// ---------------- PAGE ----------------

export default function EditarFiliacaoPage() {
  const router = useRouter();
  const params = useParams();

  const usrId = params.usrId as string;
  const filId = params.filId as string;

  const [form, setForm] = useState<Filiacao>({
    filNome: "",
    filNascimento: "",
  });

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get(`/searchFiliacao/${usrId}/${filId}`);

        setForm({
          filNome: res.data[0].filNome,
          filNascimento: res.data[0].filNascimento,
        });
      } catch (error) {
        console.error("Erro ao carregar filiação:", error);
      }
    }

    if (usrId && filId) loadData();
  }, [usrId, filId]);

  // ---------------- SUBMIT ----------------

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.put(`/altfiliacao/${usrId}/${filId}`, form);

      alert("Filiação alterada com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao alterar filiação:", error);
      alert("Erro ao salvar alteração");
    }
  }

  // ---------------- HANDLE INPUT ----------------

  function handleChange(field: keyof Filiacao, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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
            Alterar Filiação
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
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
              Salvar Alteração
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}