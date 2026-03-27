"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft } from "lucide-react";

export default function EditAtividadePage() {
  const router = useRouter();
  const params = useParams();

  const atvId = params.atvId as string;

  const [atvDescricao, setAtvDescricao] = useState("");
  const [atvTaxAdm, setAtvTaxAdm] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    async function loadAtividade() {
      try {
        const response = await api.get(`/searchAtiv/${atvId}`);

        setAtvDescricao(response.data[0].atvDescricao);
        setAtvTaxAdm(response.data[0].atvTaxAdm);
      } catch (error) {
        alert("Erro ao carregar atividade");
      }
    }

    if (atvId) loadAtividade();
  }, [atvId]);

  // ---------------- UPDATE ----------------

  async function handleUpdateAtividade(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/altatividade/${atvId}`, {
        atvDescricao,
        atvTaxAdm,
      });

      alert("Atividade alterada com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro ao alterar atividade");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- UI ----------------

  return (
    <div className="w-full px-6 py-8 space-y-6">

      {/* BOTÃO VOLTAR */}
      <div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>
      </div>

      {/* CARD */}
      <Card className="w-full max-w-2xl mx-auto rounded-2xl shadow-sm">
        
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Editar Atividade
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <form onSubmit={handleUpdateAtividade} className="space-y-5">

            {/* DESCRIÇÃO */}
            <div className="space-y-2">
              <Label>Descrição da Atividade</Label>
              <Input
                required
                value={atvDescricao}
                onChange={(e) => setAtvDescricao(e.target.value)}
                className="h-11"
              />
            </div>

            {/* TAXA ADMINISTRATIVA */}
            <div className="space-y-2">
              <Label>Taxa Administrativa (%)</Label>
              <Input
                required
                type="number"
                value={atvTaxAdm}
                onChange={(e) => setAtvTaxAdm(e.target.value)}
                className="h-11"
              />
            </div>

            {/* BOTÃO SALVAR */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[180px]"
              >
                {loading ? "Salvando..." : "Salvar Alteração"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}