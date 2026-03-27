"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import moment from "moment";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

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

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [orgDescricao, setOrgDescricao] = useState("");
  const [datPrint, setDatPrint] = useState("");

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    const datVencto = searchParams.get("datVencto");
    const orgao = searchParams.get("orgao");
    const regStatus = searchParams.get("regStatus");

    if (!datVencto) return;

    setDatPrint(moment(datVencto).utc().locale("pt-br").format("L"));

    async function loadData() {
      try {
        let orgId = orgao;
        if (!orgId || orgId === "0") orgId = "999";

        if (orgId !== "999") {
          const org = await api.get(`/searchOrg/${orgId}`);
          setOrgDescricao(org.data[0].orgDescricao);

          const res = await api.get(
            `/pdfVctOrgao/${datVencto}/${datVencto}/${orgId}/${regStatus}`
          );
          setVendas(res.data);
        } else {
          const res = await api.get(
            `/pdfVdaVenc/${datVencto}/${datVencto}/${regStatus}`
          );
          setVendas(res.data);
        }
      } catch (error) {
        console.error("Erro ao gerar relatório:", error);
      }
    }

    loadData();
  }, [searchParams]);

  // ---------------- GERAR PDF ----------------

  async function gerarPdf() {
    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfFontsModule = await import("pdfmake/build/vfs_fonts");

    const pdfMake = pdfMakeModule.default;

    (pdfMake as any).vfs = pdfFontsModule.default;

    const reportTitle = [
      {
        text: `Relatório de Vendas Vencimento: ${datPrint} - ${orgDescricao}`,
        fontSize: 15,
        bold: true,
        margin: [15, 20, 0, 45],
      },
    ];

    const dados = vendas.map((venda) => [
      { text: venda.parIdCompra, fontSize: 7 },
      { text: venda.parNroParcela, fontSize: 7 },
      { text: venda.usrMatricula, fontSize: 7 },
      { text: venda.usrNome, fontSize: 7 },
      { text: venda.cnvNomFantasia, fontSize: 7 },
      {
        text: moment(venda.cmpEmissao).utc().locale("pt-br").format("L"),
        fontSize: 7,
      },
      {
        text: moment(venda.parVctParcela).utc().locale("pt-br").format("L"),
        fontSize: 7,
      },
      {
        text: Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(venda.parVlrParcela),
        alignment: "right",
        fontSize: 7,
      },
    ]);

    const total = vendas
      .map((item) => item.parVlrParcela)
      .reduce((prev, curr) => prev + curr, 0);

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [15, 50, 15, 40],
      header: reportTitle,
      content: [
        {
          table: {
            headerRows: 1,            
            widths: [20, 20, 50, 120, 100, 50, 50, 60],
            body: [
              [
                { text: "ID", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "PARC", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "MATRICULA", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "NOME SERVIDOR(A)", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "CONVENIO", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "EMISSÃO", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "VENCIMENTO", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "VALOR", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
              ],
              ...dados,
            ],
          },
        },
      ],
      footer: (currentPage: number, pageCount: number) => ({
        columns: [
          {
            text:
              "Total de Vendas: " +
              Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(total),
            alignment: "left",
            margin: [10, 0, 0, 0],
          },
          {
            text: `Página ${currentPage} / ${pageCount}`,
            alignment: "right",
            margin: [0, 0, 20, 0],
          },
        ],
      }),
    };

    pdfMake.createPdf(docDefinition as any).open();
  }

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="rounded-2xl shadow-sm w-[420px]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Gerar Relatório em PDF
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 items-center">
          <p className="text-sm text-zinc-500 text-center">
            Clique no botão abaixo para gerar o relatório de compras com vencimento.
          </p>

          <Button onClick={gerarPdf} className="flex items-center gap-2">
            <FileText size={16} />
            Gerar PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}