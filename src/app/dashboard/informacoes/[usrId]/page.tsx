"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

type Informacao = {
  infId: number;
  infUsrId: number;
  infData: string;
  infDescricao: string;
};

// ---------------- PAGE ----------------

export default function InformacoesPage() {
  const [informacoes, setInformacoes] = useState<Informacao[]>([]);
  const router = useRouter();
  const params = useParams();

  const usrId = params.usrId as string;

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get(`/informacoes/${usrId}`);
        setInformacoes(res.data);
      } catch (error) {
        console.error("Erro ao carregar informações:", error);
      }
    }

    if (usrId) loadData();
  }, [usrId]);

  // ---------------- DELETE ----------------

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Deseja realmente excluir esta informação?");
    if (!confirmDelete) return;

    try {
      await api.put(`/delinformacao/${id}`);

      setInformacoes((prev) => prev.filter((item) => item.infId !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir a informação");
    }
  }

  // ---------------- FORMAT DATE ----------------

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC",
    }).format(new Date(date));
  }

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* botão voltar */}
      <div>
        <Button variant="outline" onClick={() => router.back()}>
          ← Voltar
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Informações do Usuário
          </CardTitle>

          <Link href={`/dashboard/informacoes/${usrId}/novo`}>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Nova Informação
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* cabeçalho fixo */}
          <div className="rounded-xl border bg-white dark:bg-zinc-900">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 dark:bg-zinc-800">
                  <TableHead className="font-semibold">Servidor</TableHead>
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Informação</TableHead>
                  <TableHead className="text-right font-semibold">
                    Editar
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Excluir
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* tabela com scroll */}
          <div className="max-h-[65vh] overflow-y-auto rounded-xl border">
            <Table>
              <TableBody>
                {informacoes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-zinc-500"
                    >
                      Nenhuma informação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  informacoes.map((row) => (
                    <TableRow
                      key={row.infId}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {row.infUsrId}
                      </TableCell>

                      <TableCell>{row.infId}</TableCell>

                      <TableCell>{formatDate(row.infData)}</TableCell>

                      <TableCell className="text-zinc-700 dark:text-zinc-300">
                        {row.infDescricao}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link
                          href={`/dashboard/informacoes/${usrId}/editar/${row.infId}`}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            className="hover:scale-105 transition"
                          >
                            <Pencil size={16} />
                          </Button>
                        </Link>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(row.infId)}
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