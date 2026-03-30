"use client";

import { useEffect, useState } from "react";
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

import { Pencil, Trash2, FileText, Loader2 } from "lucide-react";

// ---------------- TYPES ----------------

type Orgao = {
  idTotOrg: number;
  orgDescricao: string;
  orgTotAno: number;
  orgTotMes: number;
  orgTotVlrVenda: number;
};

// ---------------- PAGE ----------------

export default function VdaVctOrgaoPage() {
  const [dados, setDados] = useState<Orgao[]>([]);
  const [datInicio, setDatInicio] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- DATA AUTOMÁTICA ----------------

  useEffect(() => {
    const newDate = new Date();

    let dia = newDate.getDate();
    let mes = newDate.getMonth() + 1;
    let ano = newDate.getFullYear();

    if (dia > 15) mes += 1;

    if (mes > 12) {
      mes = 1;
      ano += 1;
    }

    const data = `${ano}-${String(mes).padStart(2, "0")}-15`;
    setDatInicio(data);
  }, []);

  // ---------------- CARREGA DADOS ----------------

  useEffect(() => {
    if (!datInicio) return;

    async function loadData() {
      try {
        setLoading(true);

        const response = await api.post("/totOrgao", {
          datInicio,
        });

        setDados(response.data);
      } catch (error) {
        console.error("Erro ao carregar órgãos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [datInicio]);

  // ---------------- TOTALIZADOR ----------------

  const total = dados.reduce((acc, item) => acc + item.orgTotVlrVenda, 0);

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Total de vendas por órgão administrativo
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* FILTRO */}
          <div className="flex flex-wrap items-end gap-4">
            <Input
              type="date"
              value={datInicio}
              onChange={(e) => setDatInicio(e.target.value)}
              className="w-[200px]"
            />

            <Link
              href={{
                pathname: "/dashboard/vdavctorgao/pdfvctorgao",
                query: { datInicio: datInicio },
              }}
            >
              <Button className="flex gap-2">
                <FileText size={16} />
                Gerar PDF
              </Button>
            </Link>
          </div>

          {/* TOTALIZADOR */}
          <div className="flex justify-end">
            <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 rounded-xl shadow-sm">
              <div className="text-xs text-zinc-500">Total geral</div>
              <div className="text-lg font-semibold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(total)}
              </div>
            </div>
          </div>

          {/* HEADER FIXO */}
          <div className="rounded-xl border bg-white dark:bg-zinc-900">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 dark:bg-zinc-800">
                  <TableHead>ID</TableHead>
                  <TableHead>Orgão Administrativo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Mês</TableHead>
                  <TableHead>Total de Vendas</TableHead>
                  <TableHead className="text-right">Editar</TableHead>
                  <TableHead className="text-right">Excluir</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* TABELA COM SCROLL */}
          <div className="max-h-[65vh] overflow-y-auto rounded-xl border">
            <Table>
              <TableBody>

                {/* LOADING */}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2 text-zinc-500">
                        <Loader2 className="animate-spin" size={18} />
                        Carregando dados...
                      </div>
                    </TableCell>
                  </TableRow>
                )}

                {/* SEM DADOS */}
                {!loading && dados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-zinc-500">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                )}

                {/* DADOS */}
                {!loading &&
                  dados.map((row) => (
                    <TableRow
                      key={row.idTotOrg}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                    >
                      <TableCell className="font-medium">
                        {row.idTotOrg}
                      </TableCell>

                      <TableCell>{row.orgDescricao}</TableCell>
                      <TableCell>{row.orgTotAno}</TableCell>
                      <TableCell>{row.orgTotMes}</TableCell>

                      <TableCell>
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(row.orgTotVlrVenda)}
                      </TableCell>

                      {/* EDITAR */}
                      <TableCell className="text-right">
                        <Link href={`/dashboard/orgao/editar/${row.idTotOrg}`}>
                          <Button variant="outline" size="icon">
                            <Pencil size={16} />
                          </Button>
                        </Link>
                      </TableCell>

                      {/* EXCLUIR */}
                      <TableCell className="text-right">
                        <Button variant="destructive" size="icon">
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

              </TableBody>
            </Table>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}