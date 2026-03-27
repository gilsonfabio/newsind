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
import { Input } from "@/components/ui/input";

import { Pencil, Trash2, Plus } from "lucide-react";

// ---------------- TYPES ----------------

type Secretaria = {
  secId: number;
  secCodigo: string;
  secDescricao: string;
  secOrgAdm: string;
};

// ---------------- PAGE ----------------

export default function SecretariasPage() {
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/secretarias");
        setSecretarias(res.data);
      } catch (error) {
        console.error("Erro ao carregar secretarias:", error);
      }
    }

    loadData();
  }, []);

  // ---------------- SEARCH ----------------

  useEffect(() => {
    async function searchData() {
      try {
        if (!search) {
          const res = await api.get("/secretarias");
          setSecretarias(res.data);
          return;
        }

        const res = await api.get(`/searchSecDesc/${search}`);
        setSecretarias(res.data);
      } catch (error) {
        console.error("Erro na busca:", error);
      }
    }

    searchData();
  }, [search]);

  // ---------------- DELETE ----------------

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Deseja realmente excluir esta secretaria?");
    if (!confirmDelete) return;

    try {
      await api.put(`/delsecretaria/${id}`);

      // Atualiza a lista sem recarregar a página
      setSecretarias((prev) => prev.filter((item) => item.secId !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir a secretaria");
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Secretarias
          </CardTitle>

          <Link href="/dashboard/secretarias/nova">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Nova Secretaria
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* BUSCA */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <Input
              placeholder="Buscar secretaria pela descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:max-w-sm"
            />
          </div>

          {/* TABELA HEADER FIXO */}
          <div className="rounded-xl border bg-white dark:bg-zinc-900">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 dark:bg-zinc-800">
                  <TableHead className="w-20 font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Descrição</TableHead>
                  <TableHead className="font-semibold">Orgão</TableHead>
                  <TableHead className="text-right font-semibold">Editar</TableHead>
                  <TableHead className="text-right font-semibold">Excluir</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* TABELA COM SCROLL */}
          <div className="max-h-[65vh] overflow-y-auto rounded-xl border">
            <Table>
              <TableBody>
                {secretarias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-zinc-500">
                      Nenhuma secretaria encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  secretarias.map((row) => (
                    <TableRow
                      key={row.secId}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <TableCell className="font-medium">{row.secId}</TableCell>
                      <TableCell>{row.secCodigo}</TableCell>
                      <TableCell className="text-zinc-700 dark:text-zinc-300">
                        {row.secDescricao}
                      </TableCell>
                      <TableCell>{row.secOrgAdm}</TableCell>

                      <TableCell className="text-right">
                        <Link href={`/dashboard/secretarias/edit/${row.secId}`}>
                          <Button variant="outline" size="icon" className="hover:scale-105 transition">
                            <Pencil size={16} />
                          </Button>
                        </Link>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(row.secId)}
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