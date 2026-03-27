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

// ---------------- PAGE ----------------
export default function NewBairroPage() {
  const router = useRouter();

  const [baiDescricao, setBaiDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- CREATE ----------------
  async function handleCreateBairro(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/newbairro", {
        baiDescricao,
      });

      alert("Bairro cadastrado com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro no cadastro!");
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
            Novo Bairro
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <form onSubmit={handleCreateBairro} className="space-y-5">

            <div className="space-y-2">
              <Label>Descrição do Bairro</Label>
              <Input
                required
                placeholder="Digite a descrição do bairro"
                value={baiDescricao}
                onChange={(e) => setBaiDescricao(e.target.value)}
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