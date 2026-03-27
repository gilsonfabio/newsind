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
type Tipo = {
  idTip: number;
  tipCodigo: string;
  tipDescricao: string;
  tipParcelas: number;
};

// ---------------- PAGE ----------------
export default function TiposPage() {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const router = useRouter();

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    async function loadTipos() {
      try {
        const res = await api.get("/tipos");
        setTipos(res.data);
      } catch (error) {
        console.error("Erro ao carregar tipos:", error);
      }
    }

    loadTipos();
  }, []);

  // ---------------- DELETE ----------------
  async function handleDelete(id: number) {
    const confirmDelete = confirm("Deseja realmente excluir este tipo?");
    if (!confirmDelete) return;

    try {
      await api.put(`/deltipo/${id}`);
      setTipos((prev) => prev.filter((item) => item.idTip !== id));
      alert("Tipo deletado com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar tipo:", error);
      alert("Erro ao excluir o tipo de contrato");
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

      {/* CARD */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Tipos de Contrato</CardTitle>

          <Link href="/dashboard/tipos/novo">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Novo Tipo
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* HEADER TABLE */}
          <div className="rounded-xl border bg-white dark:bg-zinc-900">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 dark:bg-zinc-800">
                  <TableHead className="w-20 font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Descrição</TableHead>
                  <TableHead className="font-semibold">Parcelas</TableHead>
                  <TableHead className="text-right font-semibold">Editar</TableHead>
                  <TableHead className="text-right font-semibold">Excluir</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* BODY TABLE */}
          <div className="max-h-[65vh] overflow-y-auto rounded-xl border">
            <Table>
              <TableBody>
                {tipos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-zinc-500">
                      Nenhum tipo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  tipos.map((row) => (
                    <TableRow
                      key={row.idTip}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <TableCell className="w-20 font-medium">{row.idTip}</TableCell>
                      <TableCell>{row.tipCodigo}</TableCell>
                      <TableCell>{row.tipDescricao}</TableCell>
                      <TableCell>{row.tipParcelas}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/tipos/edit/${row.idTip}`}>
                          <Button variant="outline" size="icon" className="hover:scale-105 transition">
                            <Pencil size={16} />
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(row.idTip)}
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