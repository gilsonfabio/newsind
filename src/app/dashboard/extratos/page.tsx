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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Pencil, Trash2, FileText, FileDown } from "lucide-react";

// ---------------- TYPES ----------------

type Compra = {
  parIdCompra: number;
  parNroParcela: number;
  cmpEmissao: string;
  parVctParcela: string;
  parVlrParcela: number;
  cmpConvenio: string;
  usrNome: string;
};

type Orgao = {
  orgId: number;
  orgDescricao: string;
};

type Total = {
  totCmp: number;
};

// ---------------- PAGE ----------------

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [total, setTotal] = useState<Total[]>([]);

  const [datVencto, setDatVencto] = useState("");
  const [orgao, setOrgao] = useState("0");
  const [regStatus, setRegStatus] = useState("A");

  const status = [
    { staId: "A", staDescricao: "ATIVOS" },
    { staId: "B", staDescricao: "BLOQUEADOS" },
    { staId: "F", staDescricao: "FÉRIAS" },
    { staId: "T", staDescricao: "TODOS" },
  ];

  // ---------------- CALCULA DATA PADRÃO ----------------

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
    setDatVencto(data);
  }, []);

  // ---------------- LOAD DADOS ----------------

  useEffect(() => {
    if (!datVencto) return;

    async function loadData() {
      try {
        if (orgao !== "0") {
          const res = await api.get(
            `/findCmpOrgao/${datVencto}/${orgao}/${regStatus}`
          );
          setCompras(res.data);

          const tot = await api.get(
            `/totCmpOrgao/${datVencto}/${orgao}/${regStatus}`
          );
          setTotal(tot.data);
        } else {
          const res = await api.get(`/findCompras/${datVencto}/${regStatus}`);
          setCompras(res.data);

          const tot = await api.get(`/totCompras/${datVencto}/${regStatus}`);
          setTotal(tot.data);
        }

        const org = await api.get("/orgaos");
        setOrgaos(org.data);
      } catch (error) {
        console.error("Erro ao carregar compras:", error);
      }
    }

    loadData();
  }, [datVencto, orgao, regStatus]);

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Compras</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* FILTROS */}
          <div className="flex flex-wrap items-end gap-4">
            <Input
              type="date"
              value={datVencto}
              onChange={(e) => setDatVencto(e.target.value)}
              className="w-[200px]"
            />

            <Select value={orgao} onValueChange={setOrgao}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Órgão Administrativo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos os órgãos</SelectItem>
                {orgaos.map((o) => (
                  <SelectItem key={o.orgId} value={String(o.orgId)}>
                    {o.orgDescricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regStatus} onValueChange={setRegStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {status.map((s) => (
                  <SelectItem key={s.staId} value={s.staId}>
                    {s.staDescricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Link
                href={{
                    pathname: "/dashboard/extratos/pdfcmpvenc",
                    query: {
                        datVencto,
                        orgao,
                        regStatus,
                    },
                }}
            >
                <Button className="flex gap-2">
                    <FileText size={16} />
                        Imprimir PDF
                </Button>
            </Link>

            <Link
                href={{
                    pathname: "/dashboard/extratos/arqcmpcsv",
                    query: {
                        datVencto,
                        orgao,
                        regStatus,
                    },
                }}
            >
                <Button className="flex gap-2">
                    <FileText size={16} />
                        Arquivo CSV
                </Button>
            </Link>
            <Link
                href={{
                    pathname: "/dashboard/extratos/arqcmptxt",
                    query: {
                        datVencto,
                        orgao,
                        regStatus,
                    },
                }}
            >
                <Button className="flex gap-2">
                    <FileText size={16} />
                        Arquivo TXT
                </Button>
            </Link>
            <Link
                href={{
                    pathname: "/dashboard/extratos/cmpvctpdf",
                    query: {
                        datVencto,
                        orgao,
                        regStatus,
                    },
                }}
            >
                <Button className="flex gap-2">
                    <FileText size={16} />
                        PDF sintético
                </Button>
            </Link>
          </div>

          {/* TOTAL */}
          <div className="text-lg font-semibold text-green-600">
            {total.map((t) => (
              <div key={t.totCmp}>
                TOTAL DAS COMPRAS:{" "}
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(t.totCmp)}
              </div>
            ))}
          </div>

          {/* TABELA HEADER FIXO */}
          <div className="rounded-xl border bg-white dark:bg-zinc-900">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 dark:bg-zinc-800">
                  <TableHead>ID</TableHead>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Emissão</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Servidor</TableHead>
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
                {compras.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-zinc-500">
                      Nenhuma compra encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  compras.map((row) => (
                    <TableRow
                      key={row.parIdCompra}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                    >
                      <TableCell className="font-medium">{row.parIdCompra}</TableCell>
                      <TableCell>{row.parNroParcela}</TableCell>
                      <TableCell>{row.cmpEmissao}</TableCell>
                      <TableCell>{row.parVctParcela}</TableCell>
                      <TableCell>
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(row.parVlrParcela)}
                      </TableCell>
                      <TableCell>{row.cmpConvenio}</TableCell>
                      <TableCell>{row.usrNome}</TableCell>

                      <TableCell className="text-right">
                        <Button variant="outline" size="icon">
                          <Pencil size={16} />
                        </Button>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button variant="destructive" size="icon">
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