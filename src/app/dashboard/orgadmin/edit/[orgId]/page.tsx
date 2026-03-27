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

export default function EditOrgAdminPage() {
  const router = useRouter();
  const params = useParams();

  const orgId = params.orgId as string;

  const [orgDescricao, setOrgDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    async function loadOrg() {
      try {
        const response = await api.get(`/searchOrg/${orgId}`);
        setOrgDescricao(response.data[0].orgDescricao);
      } catch (error) {
        alert("Erro ao carregar dados");
      }
    }

    if (orgId) loadOrg();
  }, [orgId]);

  // ---------------- UPDATE ----------------
  async function handleUpdateOrg(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put(`/altorgao/${orgId}`, {
        orgDescricao,
      });

      alert("Orgão alterado com sucesso!");
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
            Editar Orgão Administrativo
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6">
          <form onSubmit={handleUpdateOrg} className="space-y-5">
            
            <div className="space-y-2">
              <Label>Descrição do Orgão</Label>
              <Input
                required
                value={orgDescricao}
                onChange={(e) => setOrgDescricao(e.target.value)}
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