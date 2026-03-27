"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FileText, Pencil, Trash2 } from "lucide-react";

// ---------------- TYPES ----------------

type Compra = {
  cmpId: number;
  cmpQtdParcela: number;
  cmpEmissao: string;
  cmpVlrCompra: number;
  cnvNomFantasia: string;
  usrNome: string;
};

type Total = {
  totCmp: number;
};

// ---------------- PAGE ----------------

export default function VdaEmissaoPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [total, setTotal] = useState<Total[]>([]);

  const [datInicio, setDatInicio] = useState("");
  const [datFinal, setDatFinal] = useState("");
  const [convenio, setConvenio] = useState("");
  const [servidor, setServidor] = useState("");

  // ---------------- DATA ATUAL AUTOMÁTICA ----------------

  useEffect(() => {
    const hoje = new Date();
    const data = hoje.toISOString().split("T")[0];

    setDatInicio(data);
    setDatFinal(data);
  }, []);

  // ---------------- BUSCAR DADOS ----------------

  useEffect(() => {
    if (!datInicio || !datFinal) return;

    async function loadData() {
      try {
        const res = await api.get(
          `/cmpPeriodo/${datInicio}/${datFinal}/${convenio || 0}/${servidor || 0}`
        );
        setCompras(res.data);

        const totalResp = await api.get(
          `/somCompras/${datInicio}/${datFinal}/${convenio || 0}/${servidor || 0}`
        );
        setTotal(totalResp.data);
      } catch (error) {
        console.error("Erro ao carregar compras:", error);
      }
    }

    loadData();
  }, [datInicio, datFinal, convenio, servidor]);

  // ---------------- TOTAL ----------------

  const totalGeral =
    total.length > 0
      ? Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(total[0].totCmp)
      : "R$ 0,00";

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 justify-center p-6">
      <Card className="w-full max-w-6xl rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Relatório de Compras por Emissão
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* FILTROS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="date"
              value={datInicio}
              onChange={(e) => setDatInicio(e.target.value)}
            />

            <Input
              type="date"
              value={datFinal}
              onChange={(e) => setDatFinal(e.target.value)}
            />

            <Input
              placeholder="CNPJ Convênio"
              value={convenio}
              onChange={(e) => setConvenio(e.target.value)}
            />

            <Input
              placeholder="CPF Servidor"
              value={servidor}
              onChange={(e) => setServidor(e.target.value)}
            />
          </div>

          {/* BOTÕES + TOTAL */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
                href={{
                    pathname: "/dashboard/vdaemissao/pdfcmpemissao",
                    query: {
                        datInicio,
                        datFinal,
                        convenio,
                        servidor,
                    },
                }}
            >
                <Button className="flex gap-2">
                    <FileText size={16} />
                        Gerar PDF
                </Button>
            </Link>
            
            <div className="text-sm font-medium">
              TOTAL DAS COMPRAS:{" "}
              <span className="text-lg font-semibold text-blue-600">
                {totalGeral}
              </span>
            </div>
          </div>

          {/* TABELA */}
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Qtd Parc</th>
                  <th className="p-3 text-left">Emissão</th>
                  <th className="p-3 text-left">Valor Compra</th>
                  <th className="p-3 text-left">Convênio</th>
                  <th className="p-3 text-left">Servidor</th>
                  <th className="p-3 text-right">Editar</th>
                  <th className="p-3 text-right">Excluir</th>
                </tr>
              </thead>

              <tbody>
                {compras.map((row) => (
                  <tr key={row.cmpId} className="border-t hover:bg-zinc-50">
                    <td className="p-3">{row.cmpId}</td>
                    <td className="p-3">{row.cmpQtdParcela}</td>
                    <td className="p-3">{row.cmpEmissao}</td>
                    <td className="p-3">
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(row.cmpVlrCompra)}
                    </td>
                    <td className="p-3">{row.cnvNomFantasia}</td>
                    <td className="p-3">{row.usrNome}</td>

                    <td className="p-3 text-right">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Pencil size={16} />
                      </button>
                    </td>

                    <td className="p-3 text-right">
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}