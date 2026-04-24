"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { api } from "@/lib/api";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Pencil, Trash2, Plus } from "lucide-react";

// ---------------- TYPES ----------------

type Atividade = {
  atvId: number;
  atvDescricao: string;
  atvTaxAdm: number;
};

// ---------------- PAGE ----------------

export default function AtividadesPage() {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const router = useRouter();

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/atividades");
        setAtividades(res.data);
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
      }
    }

    loadData();
  }, []);

  // ---------------- DELETE ----------------

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Deseja realmente excluir esta atividade?");
    if (!confirmDelete) return;

    try {
      await api.put(`/delAtividade/${id}`);

      // Remove da lista sem recarregar
      setAtividades((prev) => prev.filter((item) => item.atvId !== id));
    } catch (error) {
      console.error("Erro ao excluir atividade:", error);
      alert("Erro ao excluir a atividade");
    }
  }

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">

      {/* BOTÃO VOLTAR */}
      <div>
        <Button variant="outline" onClick={() => router.back()}>
          ← Voltar
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm">

        {/* HEADER */}
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Ramos de Atividade
          </CardTitle>

          <Link href="/dashboard/atividades/nova">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Nova Atividade
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* CABEÇALHO FIXO */}
          <div className="rounded-xl border bg-white dark:bg-zinc-900">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 dark:bg-zinc-800">
                  <TableHead className="w-20 font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Descrição</TableHead>
                  <TableHead className="font-semibold">% Taxa Adm</TableHead>
                  <TableHead className="text-right font-semibold">Editar</TableHead>
                  <TableHead className="text-right font-semibold">Excluir</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* LISTA COM SCROLL */}
          <div className="max-h-[65vh] overflow-y-auto rounded-xl border">
            <Table>
              <TableBody>
                {atividades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                      Nenhuma atividade encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  atividades.map((row) => (
                    <TableRow
                      key={row.atvId}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <TableCell className="w-20 font-medium">
                        {row.atvId}
                      </TableCell>

                      <TableCell className="text-zinc-700 dark:text-zinc-300">
                        {row.atvDescricao}
                      </TableCell>

                      <TableCell className="text-zinc-700 dark:text-zinc-300">
                        {row.atvTaxAdm}%
                      </TableCell>

                      {/* EDITAR */}
                      <TableCell className="text-right">
                        <Link href={`/dashboard/atividades/edit/${row.atvId}`}>
                          <Button
                            variant="outline"
                            size="icon"
                            className="hover:scale-105 transition"
                          >
                            <Pencil size={16} />
                          </Button>
                        </Link>
                      </TableCell>

                      {/* EXCLUIR */}
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(row.atvId)}
                          className="hover:scale-105 transition"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}