"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft } from "lucide-react";

export default function NewAtividadePage() {
  const router = useRouter();

  const [atvDescricao, setAtvDescricao] = useState("");
  const [atvTaxAdm, setAtvTaxAdm] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- CREATE ----------------

  async function handleCreateAtividade(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/newatividade", {
        atvDescricao,
        atvTaxAdm,
      });

      alert("Atividade cadastrada com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro ao cadastrar atividade");
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
            Nova Atividade
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <form onSubmit={handleCreateAtividade} className="space-y-5">

            {/* DESCRIÇÃO */}
            <div className="space-y-2">
              <Label>Descrição da Atividade</Label>
              <Input
                required
                placeholder="Digite a descrição da atividade"
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
                placeholder="Ex: 5"
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
                {loading ? "Salvando..." : "Salvar cadastro"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}