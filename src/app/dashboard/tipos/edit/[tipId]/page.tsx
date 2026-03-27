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

export default function EditTipoPage() {
  const router = useRouter();
  const params = useParams();

  const tipId = params.tipId as string;

  const [tipDescricao, setTipDescricao] = useState("");
  const [tipParcelas, setTipParcelas] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    async function loadTipo() {
      try {
        const response = await api.get(`/searchSec/${tipId}`);
        setTipDescricao(response.data[0].tipDescricao);
        setTipParcelas(response.data[0].tipParcelas);
      } catch (error) {
        alert("Erro ao carregar dados");
      }
    }

    if (tipId) loadTipo();
  }, [tipId]);

  // ---------------- UPDATE ----------------
  async function handleUpdateTipo(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/alttipo/${tipId}`, {
        tipDescricao,
        tipParcelas,
      });

      alert("Tipo alterado com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro ao alterar");
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
            Editar Tipo de Contrato
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <form onSubmit={handleUpdateTipo} className="space-y-5">

            <div className="space-y-2">
              <Label>Descrição do Tipo</Label>
              <Input
                required
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
                {loading ? "Salvando..." : "Salvar Alteração"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}