"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft } from "lucide-react";

export default function NewCargoPage() {
  const router = useRouter();

  const [crgDescricao, setCrgDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- CREATE ----------------
  async function handleCreateCargo(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/newcargo", {
        crgDescricao,
      });

      alert("Cargo cadastrado com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro ao cadastrar cargo");
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
      <Card className="w-full max-w-xl mx-auto rounded-2xl shadow-sm">

        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Novo Cargo
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <form onSubmit={handleCreateCargo} className="space-y-5">

            {/* DESCRIÇÃO */}
            <div className="space-y-2">
              <Label>Descrição do Cargo</Label>
              <Input
                required
                placeholder="Digite a descrição do cargo"
                value={crgDescricao}
                onChange={(e) => setCrgDescricao(e.target.value)}
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