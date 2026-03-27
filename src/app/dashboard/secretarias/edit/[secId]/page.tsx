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

export default function EditSecretariaPage() {
  const router = useRouter();
  const params = useParams();

  const secId = params.secId as string;

  const [secCodigo, setSecCodigo] = useState("");
  const [secDescricao, setSecDescricao] = useState("");
  const [secOrgAdm, setSecOrgAdm] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    async function loadSecretaria() {
      try {
        const response = await api.get(`/searchSec/${secId}`);

        setSecCodigo(response.data[0].secCodigo);
        setSecDescricao(response.data[0].secDescricao);
        setSecOrgAdm(response.data[0].secOrgAdm);
      } catch (error) {
        alert("Erro ao carregar dados da secretaria");
      }
    }

    if (secId) loadSecretaria();
  }, [secId]);

  // ---------------- UPDATE ----------------
  async function handleUpdateSecretaria(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/altsecretaria/${secId}`, {
        secCodigo,
        secDescricao,
        secOrgAdm,
      });

      alert("Secretaria alterada com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro ao alterar a secretaria");
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
            Editar Secretaria
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <form onSubmit={handleUpdateSecretaria} className="space-y-5">

            {/* CÓDIGO */}
            <div className="space-y-2">
              <Label>Código da Secretaria</Label>
              <Input
                required
                value={secCodigo}
                onChange={(e) => setSecCodigo(e.target.value)}
                className="h-11"
              />
            </div>

            {/* DESCRIÇÃO */}
            <div className="space-y-2">
              <Label>Descrição da Secretaria</Label>
              <Input
                required
                value={secDescricao}
                onChange={(e) => setSecDescricao(e.target.value)}
                className="h-11"
              />
            </div>

            {/* ORGÃO ADMINISTRATIVO */}
            <div className="space-y-2">
              <Label>Orgão Administrativo</Label>
              <Input
                required
                value={secOrgAdm}
                onChange={(e) => setSecOrgAdm(e.target.value)}
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