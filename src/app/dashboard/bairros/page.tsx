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
type Bairro = {
  baiId: number;
  baiDescricao: string;
};

// ---------------- PAGE ----------------
export default function BairrosPage() {
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/bairros");
        setBairros(res.data);
      } catch (error) {
        console.error("Erro ao carregar bairros:", error);
      }
    }

    loadData();
  }, []);

  // ---------------- SEARCH ----------------
  useEffect(() => {
    async function searchBairros() {
      try {
        const res = await api.get(`/busbairro/${search}`);
        setBairros(res.data);
      } catch (error) {
        console.error("Erro na busca de bairros:", error);
      }
    }

    if (search) {
      searchBairros();
    } else {
      // Se search estiver vazio, recarrega todos
      api.get("/bairros").then((res) => setBairros(res.data));
    }
  }, [search]);

  // ---------------- DELETE ----------------
  async function handleDelete(id: number) {
    const confirmDelete = confirm("Deseja realmente excluir este bairro?");
    if (!confirmDelete) return;

    try {
      await api.put(`/delbairro/${id}`);
      setBairros((prev) => prev.filter((b) => b.baiId !== id));
    } catch (error) {
      console.error("Erro ao excluir bairro:", error);
      alert("Erro ao excluir o bairro");
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
          <CardTitle className="text-xl font-semibold">Bairros</CardTitle>

          <Link href="/dashboard/bairros/novo">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Novo Bairro
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* BUSCA */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <input
              type="text"
              placeholder="Buscar bairro"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 w-full max-w-sm"
            />
          </div>

          {/* TABELA */}
          <div className="rounded-xl border bg-white dark:bg-zinc-900">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 dark:bg-zinc-800">
                  <TableHead className="w-20 font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Descrição</TableHead>
                  <TableHead className="text-right font-semibold">Editar</TableHead>
                  <TableHead className="text-right font-semibold">Excluir</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          <div className="max-h-[65vh] overflow-y-auto rounded-xl border">
            <Table>
              <TableBody>
                {bairros.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-zinc-500">
                      Nenhum bairro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  bairros.map((row) => (
                    <TableRow
                      key={row.baiId}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <TableCell className="w-20 font-medium">{row.baiId}</TableCell>
                      <TableCell className="text-zinc-700 dark:text-zinc-300">
                        {row.baiDescricao}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/bairros/edit/${row.baiId}`}>
                          <Button variant="outline" size="icon" className="hover:scale-105 transition">
                            <Pencil size={16} />
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(row.baiId)}
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