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
  cmpId: number;
  cmpQtdParcela: number;
  usrMatricula: string;
  usrNome: string;
  cnvNomFantasia: string;
  cmpEmissao: string;
  cmpVlrCompra: number;
};

// ---------------- PAGE ----------------

export default function PdfCmpEmisPage() {
  const searchParams = useSearchParams();

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [datInicio, setDatInicio] = useState("");
  const [datFinal, setDatFinal] = useState("");

  // ---------------- LOAD DATA ----------------

  useEffect(() => {
    const dataInicio = searchParams.get("datInicio");
    const dataFinal = searchParams.get("datFinal");
    const convenio = searchParams.get("convenio");
    const servidor = searchParams.get("servidor");

    if (!dataInicio || !dataFinal) return;

    setDatInicio(moment(dataInicio).utc().locale("pt-br").format("L"));
    setDatFinal(moment(dataFinal).utc().locale("pt-br").format("L"));

    async function loadData() {
      try {
        const res = await api.get(
          `/pdfCmpEmis/${dataInicio}/${dataFinal}/${convenio || 0}/${servidor || 0}`
        );

        setVendas(res.data);
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
        text: `Relatório de Compras por Emissão: ${datInicio} até ${datFinal}`,
        fontSize: 15,
        bold: true,
        margin: [15, 20, 0, 45],
      },
    ];

    const dados = vendas.map((venda) => [
      { text: venda.cmpId, fontSize: 7 },
      { text: venda.cmpQtdParcela, fontSize: 7 },
      { text: venda.usrMatricula, fontSize: 7 },
      { text: venda.usrNome, fontSize: 7 },
      { text: venda.cnvNomFantasia, fontSize: 7 },
      {
        text: moment(venda.cmpEmissao).utc().locale("pt-br").format("L"),
        fontSize: 7,
      },
      {
        text: Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(venda.cmpVlrCompra),
        alignment: "right",
        fontSize: 7,
      },
    ]);

    const total = vendas
      .map((item) => item.cmpVlrCompra)
      .reduce((prev, curr) => prev + curr, 0);

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [15, 50, 15, 40],
      header: reportTitle,
      content: [
        {
          table: {
            headerRows: 1,
            widths: [20, 25, 50, 120, 110, 60, 60],
            body: [
              [
                { text: "ID", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "PLANO", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "MATRICULA", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "NOME SERVIDOR(A)", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "CONVENIO", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "EMISSÃO", fontSize: 6, bold: true, fillColor: "#d9d9d9" },
                { text: "VALOR", fontSize: 6, bold: true, fillColor: "#d9d9d9", alignment: "right" },
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
              "Total de Compras: " +
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
            Gerar Relatório de Compras por Emissão
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 items-center">
          <p className="text-sm text-zinc-500 text-center">
            Clique no botão abaixo para gerar o relatório de compras por emissão.
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