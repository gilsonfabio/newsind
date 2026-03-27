"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ---------------- TYPES ----------------

type InformacaoForm = {
  infUsrId: number;
  infDescricao: string;
};

// ---------------- PAGE ----------------

export default function NovaInformacaoPage() {
  const router = useRouter();
  const params = useParams();

  const usrId = Number(params.usrId);

  const [form, setForm] = useState<InformacaoForm>({
    infUsrId: usrId,
    infDescricao: "",
  });

  // ---------------- HANDLE INPUT ----------------

  function handleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      infDescricao: value,
    }));
  }

  // ---------------- SUBMIT ----------------

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/newinformacao", form);

      alert("Informação cadastrada com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao cadastrar informação:", error);
      alert("Erro ao cadastrar informação");
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
            Nova Informação - Usuário {usrId}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* descrição */}
            <div className="space-y-2">
              <Label>Descrição da Informação</Label>
              <Textarea
                value={form.infDescricao}
                onChange={(e) => handleChange(e.target.value)}
                required
                className="min-h-[120px]"
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