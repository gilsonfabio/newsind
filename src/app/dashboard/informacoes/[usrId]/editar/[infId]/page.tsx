"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// ---------------- TYPES ----------------

type InformacaoForm = {
  infDescricao: string;
};

// ---------------- PAGE ----------------

export default function EditarInformacaoPage() {
  const router = useRouter();
  const params = useParams();

  const usrId = params.usrId as string;
  const infId = params.infId as string;

  const [form, setForm] = useState<InformacaoForm>({
    infDescricao: "",
  });

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get(`/searchInf/${usrId}/${infId}`);

        setForm({
          infDescricao: res.data[0].infDescricao,
        });
      } catch (error) {
        console.error("Erro ao carregar informação:", error);
      }
    }

    if (usrId && infId) loadData();
  }, [usrId, infId]);

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
      await api.put(`/altinformacao/${usrId}/${infId}`, form);

      alert("Informação alterada com sucesso!");
      router.back();
    } catch (error) {
      console.error("Erro ao atualizar informação:", error);
      alert("Erro ao atualizar informação");
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
            Alterar Informação
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
                className="min-h-[140px]"
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