"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FileText, FileDown } from "lucide-react";

import { CSVLink } from "react-csv";

// ---------------- TYPES ----------------

type Venda = {
  usrMatricula: string;
  usrNome: string;
  usrVlrUsado: number;
};

// ---------------- PAGE ----------------

export default function ArqCmpCsvPage() {
  const searchParams = useSearchParams();

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [orgDescricao, setOrgDescricao] = useState("");
  const [datVencto, setDatVencto] = useState("");
  const [orgao, setOrgao] = useState("");
  const [status, setStatus] = useState("");

  // ---------------- CSV HEADERS ----------------

  const headers = [
    { label: "Matricula", key: "usrMatricula" },
    { label: "Nome Servidor", key: "usrNome" },
    { label: "Valor Total", key: "usrVlrUsado" },
  ];

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    const dat = searchParams.get("datVencto");
    const org = searchParams.get("orgao");
    const st = searchParams.get("regStatus");

    if (!dat) return;

    setDatVencto(dat);
    setOrgao(org || "");
    setStatus(st || "");

    async function loadData() {
      try {
        const res = await api.get(`/downloadTxt/${dat}/${org}/${st}`);
        setVendas(res.data);

        const orgResp = await api.get(`/searchOrg/${org}`);
        setOrgDescricao(orgResp.data.orgDescricao);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    loadData();
  }, [searchParams]);

  // ---------------- FILE NAME ----------------

  const nomeArquivo = `Relatorio_${orgDescricao}_${datVencto}.csv`;

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-4xl rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Relatório de Compras (TXT / CSV)
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* BOTÕES */}
          <div className="flex gap-3">
            <Button asChild>
              <a
                href={`/dashboard/extratos/pdfcmpvenc?datVencto=${datVencto}&orgao=${orgao}&regStatus=${status}`}
              >
                <FileText size={16} />
                Gerar PDF
              </a>
            </Button>

            <CSVLink
              data={vendas}
              headers={headers}
              filename={nomeArquivo}
              className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <FileDown size={16} />
              Exportar CSV
            </CSVLink>
          </div>

          {/* TABELA */}
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="p-3 text-left">Matrícula</th>
                  <th className="p-3 text-left">Servidor</th>
                  <th className="p-3 text-right">Total Compras</th>
                </tr>
              </thead>

              <tbody>
                {vendas.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-zinc-50 transition"
                  >
                    <td className="p-3">{row.usrMatricula}</td>
                    <td className="p-3">{row.usrNome}</td>
                    <td className="p-3 text-right">
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(row.usrVlrUsado)}
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