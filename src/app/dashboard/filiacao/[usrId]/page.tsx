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

type Filiacao = {
  filId: number;
  filUsrId: number;
  filNome: string;
  filNascimento: string;
};

// ---------------- PAGE ----------------

export default function FiliacaoPage() {
  const [filhos, setFilhos] = useState<Filiacao[]>([]);
  const router = useRouter();
  const params = useParams();

  const usrId = params.usrId as string;

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get(`/filiacao/${usrId}`);
        setFilhos(res.data);
      } catch (error) {
        console.error("Erro ao carregar filiações:", error);
      }
    }

    if (usrId) loadData();
  }, [usrId]);

  // ---------------- DELETE ----------------

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Deseja realmente excluir esta filiação?");
    if (!confirmDelete) return;

    try {
      await api.put(`/delfiliacao/${id}`);

      // remove da lista sem recarregar página
      setFilhos((prev) => prev.filter((item) => item.filId !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir a filiação");
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
            Filiações do Usuário
          </CardTitle>

          <Link href={`/dashboard/filiacao/${usrId}/novo`}>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Nova Filiação
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* cabeçalho fixo */}
          <div className="rounded-xl border bg-white dark:bg-zinc-900">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 dark:bg-zinc-800">
                  <TableHead className="w-20 font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="text-right font-semibold">
                    Nascimento
                  </TableHead>
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
                {filhos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-zinc-500"
                    >
                      Nenhuma filiação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filhos.map((row) => (
                    <TableRow
                      key={row.filId}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <TableCell className="w-20 font-medium">
                        {row.filId}
                      </TableCell>

                      <TableCell>{row.filUsrId}</TableCell>

                      <TableCell className="text-zinc-700 dark:text-zinc-300">
                        {row.filNome}
                      </TableCell>

                      <TableCell className="text-right">
                        {formatDate(row.filNascimento)}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link
                          href={`/dashboard/filiacao/${usrId}/editar/${row.filId}`}
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
                          onClick={() => handleDelete(row.filId)}
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