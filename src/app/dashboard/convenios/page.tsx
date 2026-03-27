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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Pencil, Trash2, Plus } from "lucide-react";

// ---------------- TYPES ----------------

type Convenio = {
  cnvId: number;
  cnvNomFantasia: string;
  cnvRazSocial: string;
  cnvCpfCnpj: string;
  cnvTelefone: string;
  cnvContato: string;
};

// ---------------- PAGE ----------------

export default function ConveniosPage() {
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    async function loadConvenios() {
      try {
        const res = await api.get("/convenios");
        setConvenios(res.data);
      } catch (error) {
        console.error("Erro ao carregar convênios:", error);
      }
    }

    loadConvenios();
  }, []);

  // ---------------- SEARCH ----------------

  useEffect(() => {
    async function searchConvenio() {
      if (!search) {
        const res = await api.get("/convenios");
        setConvenios(res.data);
        return;
      }

      try {
        const res = await api.get(`/classCnv/${search}`);
        setConvenios(res.data);
      } catch (error) {
        console.error("Erro ao buscar convênios:", error);
      }
    }

    searchConvenio();
  }, [search]);

  // ---------------- DELETE ----------------

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Deseja realmente excluir este convênio?");
    if (!confirmDelete) return;

    try {
      await api.put(`/delConvenio/${id}`);

      setConvenios((prev) => prev.filter((item) => item.cnvId !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir convênio");
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
            Convênios
          </CardTitle>

          <Link href="/dashboard/convenios/novo">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Novo Convênio
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* CAMPO BUSCA */}
          <Input
            placeholder="Buscar convênio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          {/* HEADER FIXO */}
          <div className="rounded-xl border bg-white dark:bg-zinc-900">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 dark:bg-zinc-800">
                  <TableHead className="w-20 font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Nome Fantasia</TableHead>
                  <TableHead className="font-semibold">Razão Social</TableHead>
                  <TableHead className="font-semibold">CNPJ/CPF</TableHead>
                  <TableHead className="font-semibold">Telefone</TableHead>
                  <TableHead className="font-semibold">Contato</TableHead>
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
                {convenios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-zinc-500">
                      Nenhum convênio encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  convenios.map((row) => (
                    <TableRow
                      key={row.cnvId}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <TableCell className="w-20 font-medium">
                        {row.cnvId}
                      </TableCell>

                      <TableCell className="text-zinc-700 dark:text-zinc-300">
                        {row.cnvNomFantasia}
                      </TableCell>

                      <TableCell className="text-zinc-700 dark:text-zinc-300">
                        {row.cnvRazSocial}
                      </TableCell>

                      <TableCell>{row.cnvCpfCnpj}</TableCell>

                      <TableCell>{row.cnvTelefone}</TableCell>

                      <TableCell>{row.cnvContato}</TableCell>

                      <TableCell className="text-right">
                        <Link href={`/dashboard/convenios/edit/${row.cnvId}`}>
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
                          onClick={() => handleDelete(row.cnvId)}
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