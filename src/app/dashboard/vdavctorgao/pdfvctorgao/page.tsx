"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { FileText } from "lucide-react";
import moment from "moment";

import { api } from "@/lib/api";

// ---------------- TYPES ----------------

type Venda = {
  idTotOrg: number;
  orgDescricao: string;
  orgTotMes: number;
  orgTotAno: number;
  orgTotVlrVenda: number;
};

// ---------------- PAGE ----------------

export default function PdfVctOrgaoPage() {
  const searchParams = useSearchParams();
  const datInicio = searchParams.get("datInicio");

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [datPrint, setDatPrint] = useState("");

  // ---------------- CARREGA DADOS ----------------

  useEffect(() => {
    if (!datInicio) return;

    setDatPrint(moment(datInicio).utc().locale("pt-br").format("L"));

    async function loadData() {
      try {
        const resp = await api.get(`/pdfExtOrgao/${datInicio}`);
        setVendas(resp.data);
      } catch (error) {
        console.error("Erro ao carregar PDF:", error);
      }
    }

    loadData();
  }, [datInicio]);

  // ---------------- GERAR PDF ----------------

  async function gerarPdf() {
  const pdfMakeModule = await import("pdfmake/build/pdfmake");
  await import("pdfmake/build/vfs_fonts"); 
  // apenas importar já registra o vfs automaticamente

  const pdfMake = pdfMakeModule.default;

  const reportTitle = [
    {
      text: `Relatório Extrato Orgão Administrativo: ${datPrint}`,
      fontSize: 15,
      bold: true,
      margin: [15, 20, 0, 45],
    },
  ];

  const dados = vendas.map((venda) => [
    { text: venda.idTotOrg, fontSize: 8 },
    { text: venda.orgDescricao, fontSize: 8 },
    { text: venda.orgTotMes, fontSize: 8 },
    { text: venda.orgTotAno, fontSize: 8 },
    {
      text: Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(venda.orgTotVlrVenda),
      fontSize: 8,
      alignment: "right",
    },
  ]);

  const total = vendas.reduce((acc, v) => acc + v.orgTotVlrVenda, 0);

  const docDefinition: any = {
  pageSize: "A4",
  pageMargins: [30, 80, 30, 50],

  header: {
    margin: [30, 20, 30, 0],
    stack: [
      {
        text: "RELATÓRIO - EXTRATO POR ÓRGÃO ADMINISTRATIVO",
        alignment: "center",
        fontSize: 16,
        bold: true,
      },
      {
        text: `Data: ${datPrint}`,
        alignment: "center",
        fontSize: 10,
        margin: [0, 5, 0, 10],
      },
      {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 5,
            x2: 520,
            y2: 5,
            lineWidth: 1,
          },
        ],
      },
    ],
  },

  content: [
    {
      table: {
        headerRows: 1,
        widths: [40, "*", 40, 40, 80],
        body: [
          [
            { text: "ID", style: "tableHeader" },
            { text: "ÓRGÃO ADMINISTRATIVO", style: "tableHeader" },
            { text: "MÊS", style: "tableHeader" },
            { text: "ANO", style: "tableHeader" },
            { text: "TOTAL (R$)", style: "tableHeader", alignment: "right" },
          ],
          ...dados,
        ],
      },
      layout: {
        fillColor: function (rowIndex: number) {
          return rowIndex === 0 ? "#f3f4f6" : null;
        },
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => "#d1d5db",
        vLineColor: () => "#d1d5db",
      },
    },

    {
      margin: [0, 15, 0, 0],
      alignment: "right",
      text:
        "TOTAL GERAL: " +
        Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(total),
      fontSize: 12,
      bold: true,
    },
  ],

  footer: function (currentPage: number, pageCount: number) {
    return {
      margin: [30, 0, 30, 10],
      columns: [
        {
          text: "Sistema Administrativo",
          fontSize: 8,
          alignment: "left",
        },
        {
          text: `Página ${currentPage} de ${pageCount}`,
          fontSize: 8,
          alignment: "right",
        },
      ],
    };
  },

  styles: {
    tableHeader: {
      fontSize: 9,
      bold: true,
      margin: [0, 5, 0, 5],
    },
  },
};

    pdfMake.createPdf(docDefinition).open();
    }

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-[420px] rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-center">
            Gerar PDF - Orgão Administrativo
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6">
          <div className="text-sm text-zinc-500">
            Data selecionada: {datPrint || "----"}
          </div>

          <Button onClick={gerarPdf} className="flex gap-2 w-[240px] h-[45px]">
            <FileText size={18} />
            Gerar PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}