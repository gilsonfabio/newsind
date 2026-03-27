"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import type { TDocumentDefinitions } from "pdfmake/interfaces";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FileDown } from "lucide-react";

// ---------------- PDF CONFIG ----------------
(pdfMake as any).vfs = pdfFonts.vfs;

// ---------------- TYPES ----------------
type Venda = {
  parIdCompra: number;
  parNroParcela: number;
  usrMatricula: string;
  usrNome: string;
  cnvNomFantasia: string;
  cmpEmissao: string;
  parVctParcela: string;
  parVlrParcela: number;
};

// ---------------- PAGE ----------------
export default function PdfCmpVencPage() {
  const searchParams = useSearchParams();

  const datInicio = searchParams.get("datInicio") ?? "";
  const datFinal = searchParams.get("datFinal") ?? "";
  const convenio = searchParams.get("convenio") || "0";
  const servidor = searchParams.get("servidor") || "0";

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [nomConvenio, setNomConvenio] = useState("");
  const [nomServidor, setNomServidor] = useState("");

  // ---------------- HELPERS ----------------
  const formatDate = (date: string) =>
    moment(date).utc().locale("pt-br").format("L");

  const formatMoney = (value: number) =>
    Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  // ---------------- LOAD DADOS ----------------
  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get(
          `/pdfVctCompras/${datInicio}/${datFinal}/${convenio}/${servidor}`
        );

        setVendas(res.data);

        if (res.data.length > 0) {
          setNomConvenio(convenio === "0" ? "" : res.data[0].cnvNomFantasia);
          setNomServidor(servidor === "0" ? "" : res.data[0].usrNome);
        }
      } catch (error) {
        console.error("Erro ao carregar PDF:", error);
      }
    }

    if (datInicio && datFinal) loadData();
  }, [datInicio, datFinal, convenio, servidor]);

  // ---------------- TOTAL GERAL ----------------
  const totalCompras = vendas.reduce(
    (total, item) => total + item.parVlrParcela,
    0
  );

  // ---------------- TOTAL POR SERVIDOR ----------------
  const totalPorServidor = vendas.reduce((acc: any, venda) => {
    if (!acc[venda.usrNome]) acc[venda.usrNome] = 0;
    acc[venda.usrNome] += venda.parVlrParcela;
    return acc;
  }, {});

  // ---------------- TABLE DATA ----------------
  const tableData = vendas.map((venda) => [
    { text: String(venda.parIdCompra), fontSize: 8 },
    { text: String(venda.parNroParcela), fontSize: 8 },
    { text: String(venda.usrMatricula), fontSize: 8 },
    { text: venda.usrNome, fontSize: 8 },
    { text: venda.cnvNomFantasia, fontSize: 8 },
    { text: formatDate(venda.cmpEmissao), fontSize: 8 },
    { text: formatDate(venda.parVctParcela), fontSize: 8 },
    {
      text: formatMoney(venda.parVlrParcela),
      fontSize: 8,
      alignment: "right" as const,
    },
  ]);
   
  const totalServidorRows = Object.entries(totalPorServidor).map(
    ([nome, total]) => [
      { text: String(nome), fontSize: 9 },
      {
        text: formatMoney(Number(total)),
        alignment: "right" as const,
        fontSize: 9,
      },
    ]
  );
    
  // ---------------- GERAR PDF ----------------
  function gerarPdf() {
    const docDefinition: TDocumentDefinitions = {
      pageSize: "A4",
      pageMargins: [20, 90, 20, 50],

      // ---------------- HEADER ----------------
      header: {
        text: "RELATÓRIO DE COMPRAS POR VENCIMENTO",
        alignment: "center",
        bold: true,
        fontSize: 16,
        margin: [0, 30, 0, 10],
      },

      // ---------------- CONTENT ----------------
      content: [
        {
          text: `Período: ${formatDate(datInicio)} até ${formatDate(datFinal)}`,
          fontSize: 10,
          margin: [0, 10, 0, 5],
        },

        {
          text: nomConvenio ? `Convênio: ${nomConvenio}` : "",
          fontSize: 10,
          margin: [0, 0, 0, 10],
        },

        // ---------------- TABELA ----------------
        {
          table: {
            headerRows: 1,
            widths: [25, 25, 60, "*", 100, 60, 60, 70],
            body: [
              [
                { text: "ID", bold: true, fontSize: 8 },
                { text: "PARC", bold: true, fontSize: 8 },
                { text: "MATRÍCULA", bold: true, fontSize: 8 },
                { text: "SERVIDOR", bold: true, fontSize: 8 },
                { text: "CONVÊNIO", bold: true, fontSize: 8 },
                { text: "EMISSÃO", bold: true, fontSize: 8 },
                { text: "VENCIMENTO", bold: true, fontSize: 8 },
                { text: "VALOR", bold: true, fontSize: 8, alignment: "right" },
              ],
              ...tableData,
            ],
          },

          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0
                ? "#e5e7eb"
                : rowIndex % 2 === 0
                ? "#f9fafb"
                : null,
          },
        },

        // ---------------- TOTAL GERAL ----------------
        {
          text: `TOTAL GERAL: ${formatMoney(totalCompras)}`,
          alignment: "right",
          bold: true,
          fontSize: 12,
          margin: [0, 15, 0, 0],
        },

        // ---------------- TOTAL POR SERVIDOR ----------------
        {
          text: "TOTAL POR SERVIDOR",
          bold: true,
          fontSize: 12,
          margin: [0, 25, 0, 10],
        },

        {
          table: {
            widths: ["*", 120],
            body: [
              [
                { text: "Servidor", bold: true },
                { text: "Total", bold: true, alignment: "right" },
              ],
              ...totalServidorRows,
            ]
          },
        },
      ],

      // ---------------- FOOTER ----------------
      footer: (currentPage, pageCount) => ({
        columns: [
          {
            text: `Emitido em: ${moment().format("DD/MM/YYYY HH:mm")}`,
            fontSize: 8,
            margin: [20, 0, 0, 0],
          },
          {
            text: `Página ${currentPage} / ${pageCount}`,
            alignment: "right",
            fontSize: 8,
            margin: [0, 0, 20, 0],
          },
        ],
      }),
    };

    pdfMake.createPdf(docDefinition).open();
  }

  // ---------------- UI ----------------
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card className="rounded-2xl shadow-sm max-w-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Relatório PDF - Compras por Vencimento
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Período: {formatDate(datInicio)} até {formatDate(datFinal)}
          </div>

          <Button onClick={gerarPdf} className="flex gap-2 w-fit">
            <FileDown size={16} />
            Gerar PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}