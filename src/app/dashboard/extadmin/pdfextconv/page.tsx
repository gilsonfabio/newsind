"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ---------------- PDF SETUP ----------------

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// CORRETO
(pdfMake as any).vfs = pdfFonts.vfs;

// ---------------- TYPES ----------------

type Venda = {
  tcnvId: number;
  cnvCpfCnpj: string;
  cnvNomFantasia: string;
  txaMenIndice: number;
  tcnvVlrTotal: number;
  tcnvVlrTaxa: number;
  tcnvVlrLiquido: number;
  tcnvVlrSistema: number;
};

// ---------------- PAGE ----------------

export default function PdfExtratoAdmPage() {
  const searchParams = useSearchParams();
  const datVencto = searchParams.get("datVencto") || "";

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [datPrint, setDatPrint] = useState("");

  // ---------------- LOAD DADOS ----------------

  useEffect(() => {
    if (!datVencto) return;

    const [ano, mes, dia] = datVencto.split("-");
    setDatPrint(`${dia}/${mes}/${ano}`);

    async function loadData() {
      try {
        const resp = await api.get(`/pdfExtAdm/${datVencto}`);

        setVendas(resp.data);
      } catch (error) {
        console.error("Erro ao carregar dados PDF:", error);
      }
    }

    loadData();
  }, [datVencto]);

  // ---------------- TOTAIS ----------------

  const totCompras = vendas.reduce(
    (s, v) => s + Number(v.tcnvVlrTotal || 0),
    0
  );

  const totTaxa = vendas.reduce(
    (s, v) => s + Number(v.tcnvVlrTaxa || 0),
    0
  );

  const totLiquido = vendas.reduce(
    (s, v) => s + Number(v.tcnvVlrLiquido || 0),
    0
  );

  const totSistema = vendas.reduce(
    (s, v) => s + Number(v.tcnvVlrSistema || 0),
    0
  );

  // ---------------- FORMATADORES ----------------

  function formatar(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(valor || 0));
  }

  function formatarPercentual(valor: number) {
    return `${Number(valor || 0).toFixed(2)}%`;
  }

  // ---------------- PDF ----------------

  function gerarPdf() {
    const dados = vendas.map((venda) => [
      venda.tcnvId,
      venda.cnvCpfCnpj,
      venda.cnvNomFantasia,
      formatarPercentual(venda.txaMenIndice),
      formatar(venda.tcnvVlrTotal),
      formatar(venda.tcnvVlrTaxa),
      formatar(venda.tcnvVlrLiquido),
      formatar(venda.tcnvVlrSistema),
    ]);

    const docDefinition: any = {
      pageSize: "A4",

      // landscape fica melhor para muitas colunas
      pageOrientation: "landscape",

      pageMargins: [10, 60, 10, 35],

      // ---------------- HEADER ----------------

      header: {
        text: `RELATÓRIO EXTRATO ADMINISTRATIVO - Vencimento: ${datPrint}`,
        alignment: "center",
        fontSize: 11,
        bold: true,
        margin: [0, 20, 0, 10],
      },

      // ---------------- CONTENT ----------------

      content: [
        {
          table: {
            headerRows: 1,

            widths: [25, 90, "*", 45, 70, 70, 70, 70],

            body: [
              [
                { text: "ID", bold: true, fontSize: 8 },
                { text: "CNPJ", bold: true, fontSize: 8 },
                { text: "CONVÊNIO", bold: true, fontSize: 8 },
                { text: "% TAXA", bold: true, fontSize: 8 },
                { text: "TOT. COMPRA", bold: true, fontSize: 8 },
                { text: "TOT. TAXA", bold: true, fontSize: 8 },
                { text: "TOT. LÍQUIDO", bold: true, fontSize: 8 },
                { text: "TOT. SISTEMA", bold: true, fontSize: 8 },
              ],

              ...dados.map((d) =>
                d.map((cell: any) => ({
                  text: cell,
                  fontSize: 7,
                }))
              ),
            ],
          },

          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? "#eeeeee" : null,

            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,

            hLineColor: () => "#cccccc",
            vLineColor: () => "#cccccc",
          },
        },
      ],

      // ---------------- FOOTER ----------------

      footer: (currentPage: number, pageCount: number) => ({
        columns: [
          {
            text: `Tot.Compras: ${formatar(totCompras)}`,
            fontSize: 8,
          },

          {
            text: `Tot.Taxa: ${formatar(totTaxa)}`,
            fontSize: 8,
          },

          {
            text: `Tot.Líquido: ${formatar(totLiquido)}`,
            fontSize: 8,
          },

          {
            text: `Tot.Sistema: ${formatar(totSistema)}`,
            fontSize: 8,
          },

          {
            text: `Página ${currentPage} / ${pageCount}`,
            alignment: "right",
            fontSize: 8,
          },
        ],

        margin: [10, 5, 10, 5],
      }),

      // ---------------- DEFAULT STYLE ----------------

      defaultStyle: {
        fontSize: 8,
      },
    };

    (pdfMake as any).createPdf(docDefinition).open();
  }

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            PDF Extrato Administrativo
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-zinc-500">
            Clique no botão abaixo para gerar o PDF.
          </p>

          <button
            onClick={gerarPdf}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Gerar PDF
          </button>
        </CardContent>
      </Card>
    </div>
  );
}