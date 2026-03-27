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

type OrgAdmin = {
  orgId: number;
  orgDescricao: string;
};

// ---------------- PAGE ----------------

export default function OrgAdminPage() {
  const [orgAdmin, setOrgAdmin] = useState<OrgAdmin[]>([]);
  const router = useRouter();

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/orgaos");
        setOrgAdmin(res.data);
      } catch (error) {
        console.error("Erro ao carregar órgãos:", error);
      }
    }

    loadData();
  }, []);

  // ---------------- DELETE ----------------

  async function handleDelete(id: number) {
    const confirmDelete = confirm("Deseja realmente excluir este órgão?");
    if (!confirmDelete) return;

    try {
      await api.put(`/delorgadmin/${id}`);

      // Atualiza a lista sem recarregar a página
      setOrgAdmin((prev) => prev.filter((item) => item.orgId !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir o órgão administrativo");
    }
  }

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <Button variant="outline" onClick={() => router.back()}>
          ← Voltar
        </Button>
      </div>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Órgãos Administrativos
          </CardTitle>

          <Link href="/dashboard/orgadmin/novo">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Novo Órgão
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
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
                {orgAdmin.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-zinc-500">
                      Nenhum órgão encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  orgAdmin.map((row, index) => (
                    <TableRow
                      key={row.orgId}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      <TableCell className="w-20 font-medium">{row.orgId}</TableCell>
                      <TableCell className="text-zinc-700 dark:text-zinc-300">
                        {row.orgDescricao}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/orgadmin/edit/${row.orgId}`}>
                          <Button variant="outline" size="icon" className="hover:scale-105 transition">
                            <Pencil size={16} />
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(row.orgId)}
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