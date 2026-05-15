"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { api } from "@/lib/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ---------------- PAGE ----------------

export default function EditTaxaPage() {
  const params = useParams();

  const { txaMenId } = useParams();
  
  const router = useRouter();
  const [form, setForm] = useState({
    txaMenAtvId: "",
    txaMenMes: "",
    txaMenAno: "",
    txaMenIndice: "",
    txaMenStatus: "",
    atvDescricao: "",
  });

  // ---------------- LOAD ----------------

  useEffect(() => {
    async function loadTaxa() {
      try {
        const res = await api.get(`/busTxaMensal/${txaMenId}`);
        const taxa = Array.isArray(res.data)
          ? res.data[0]
          : res.data;

        setForm({
          txaMenAtvId: taxa?.txaMenAtvId?.toString() || "",
          txaMenMes: taxa?.txaMenMes?.toString() || "",
          txaMenAno: taxa?.txaMenAno?.toString() || "",
          txaMenIndice: taxa?.txaMenIndice?.toString() || "",
          txaMenStatus: taxa?.txaMenStatus || "",
          atvDescricao: taxa?.atvDescricao || "",
        });

      } catch (error) {
        console.error(error);
      }
    }

    if (txaMenId) {
      loadTaxa();
    }
  }, [txaMenId]);

  // ---------------- SAVE ----------------

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.put(`/updTxaMensal/${txaMenId}`, form);

      alert("Taxa atualizada com sucesso!");

      router.push("/dashboard/atvmensal");
    } catch (error) {
      console.error(error);

      alert("Erro ao atualizar taxa");
    }
  }

  return (
    <div className="flex flex-1 justify-center p-6">

      <Card className="w-full max-w-2xl rounded-2xl">

        <CardHeader>
          <CardTitle>Editar Taxa Mensal</CardTitle>
        </CardHeader>

        <CardContent>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label>Atividade {form.atvDescricao}</Label>

                <Input
                  value={form.txaMenAtvId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      txaMenAtvId: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Mês</Label>

                <Input
                  type="number"
                  value={form.txaMenMes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      txaMenMes: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Ano</Label>

                <Input
                  type="number"
                  value={form.txaMenAno}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      txaMenAno: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Índice</Label>

                <Input
                  type="number"
                  step="0.01"
                  value={form.txaMenIndice}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      txaMenIndice: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>

                <Input
                  value={form.txaMenStatus}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      txaMenStatus: e.target.value,
                    })
                  }
                />
              </div>

            </div>

            <div className="flex gap-3">

              <Button type="submit">
                Salvar Alterações
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>
  );
}