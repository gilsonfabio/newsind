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

export default function NewSecretariaPage() {
  const router = useRouter();

  const [secCodigo, setSecCodigo] = useState("");
  const [secDescricao, setSecDescricao] = useState("");
  const [secOrgAdm, setSecOrgAdm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateSecretaria(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/newsecretaria", {
        secCodigo,
        secDescricao,
        secOrgAdm,
      });

      alert("Secretaria cadastrada com sucesso!");
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
            Nova Secretaria
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <form onSubmit={handleCreateSecretaria} className="space-y-5">
            
            {/* CÓDIGO */}
            <div className="space-y-2">
              <Label>Código da Secretaria</Label>
              <Input
                required
                placeholder="Digite o código da secretaria"
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
                placeholder="Digite a descrição da secretaria"
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
                placeholder="Digite o órgão administrativo"
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
                {loading ? "Salvando..." : "Salvar cadastro"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}