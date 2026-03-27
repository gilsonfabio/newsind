"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft } from "lucide-react";

import { api } from "@/lib/api";

export default function NewTipoPage() {
  const router = useRouter();

  const [tipDescricao, setTipDescricao] = useState("");
  const [tipParcelas, setTipParcelas] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateTipo(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/newtipo", {
        tipDescricao,
        tipParcelas,
      });

      alert("Tipo cadastrado com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro no cadastro!");
    } finally {
      setLoading(false);
    }
  }

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
            Novo Tipo de Contrato
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <form onSubmit={handleCreateTipo} className="space-y-5">

            <div className="space-y-2">
              <Label>Descrição do Tipo</Label>
              <Input
                required
                placeholder="Digite a descrição do tipo"
                value={tipDescricao}
                onChange={(e) => setTipDescricao(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Qtde Parcelas</Label>
              <Input
                required
                type="number"
                placeholder="Digite a quantidade de parcelas"
                value={tipParcelas}
                onChange={(e) => setTipParcelas(e.target.value)}
                className="h-11"
              />
            </div>

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