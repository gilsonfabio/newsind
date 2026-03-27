"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// ---------------- TYPES ----------------

type Servidor = {
  usrId: number;
  usrNome: string;
  usrCartao: string;
  usrStatus: string;
  usrObsBloqueio: string;
  usrSalBase: string;
  usrSalBruto: string;
  usrSalLiquido: string;
};

// ---------------- PAGE ----------------

export default function StatusPage() {
  const router = useRouter();
  const params = useParams();
  const usrId = params.usrId as string;

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Servidor>({
    usrId: 0,
    usrNome: "",
    usrCartao: "",
    usrStatus: "",
    usrObsBloqueio: "",
    usrSalBase: "",
    usrSalBruto: "",
    usrSalLiquido: "",
  });

  const [altSaldo, setAltSaldo] = useState("");

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get(`/searchUser/${usrId}`);
        const user = res.data[0];

        setForm({
          usrId: user.usrId,
          usrNome: user.usrNome || "",
          usrCartao: user.usrCartao || "",
          usrStatus: user.usrStatus || "",
          usrObsBloqueio: user.usrObsBloqueio || "",
          usrSalBase: user.usrSalBase || "",
          usrSalBruto: user.usrSalBruto || "",
          usrSalLiquido: user.usrSalLiquido || "",
        });
      } catch (error) {
        console.error("Erro ao carregar servidor:", error);
      } finally {
        setLoading(false);
      }
    }

    if (usrId) loadData();
  }, [usrId]);

  // ---------------- HANDLE INPUT ----------------

  function handleChange(field: keyof Servidor, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // ---------------- SAVE ----------------

  async function handleSubmit() {
    try {
      await api.post("/updLimite", {
        idSrv: usrId,
        ...form,
        altSaldo,
      });

      alert("Status atualizado com sucesso!");
      router.back();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar");
    }
  }

  // ---------------- UI ----------------

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* botão voltar */}
      <div>
        <Button variant="outline" onClick={() => router.back()}>
          ← Voltar
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Alteração de Status do Servidor
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* COLUNA ESQUERDA */}
            <div className="space-y-4">
              <div>
                <Label>Nome do Usuário</Label>
                <Input
                  value={form.usrNome}
                  onChange={(e) => handleChange("usrNome", e.target.value)}
                />
              </div>

              <div>
                <Label>Cartão do Usuário</Label>
                <Input
                  value={form.usrCartao}
                  onChange={(e) => handleChange("usrCartao", e.target.value)}
                />
              </div>

              <div>
                <Label>Salário Base</Label>
                <Input
                  value={form.usrSalBase}
                  onChange={(e) => handleChange("usrSalBase", e.target.value)}
                />
              </div>

              <div>
                <Label>Salário Bruto</Label>
                <Input
                  value={form.usrSalBruto}
                  onChange={(e) => handleChange("usrSalBruto", e.target.value)}
                />
              </div>
            </div>

            {/* COLUNA DIREITA */}
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={form.usrStatus}
                  onValueChange={(v) => handleChange("usrStatus", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">LIBERADO</SelectItem>
                    <SelectItem value="B">BLOQUEADO</SelectItem>
                    <SelectItem value="F">FÉRIAS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Observação do Status</Label>
                <Input
                  value={form.usrObsBloqueio}
                  onChange={(e) =>
                    handleChange("usrObsBloqueio", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Salário Líquido</Label>
                <Input
                  value={form.usrSalLiquido}
                  onChange={(e) => handleChange("usrSalLiquido", e.target.value)}
                />
              </div>

              <div>
                <Label>Confirma Alteração de Limite</Label>
                <Select value={altSaldo} onValueChange={setAltSaldo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alterar saldo?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">SIM</SelectItem>
                    <SelectItem value="N">NÃO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* BOTÃO */}
          <div className="flex justify-end pt-4">
            <Button onClick={handleSubmit} className="px-8">
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}