"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import moment from "moment";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

type Venda = {
  cmpId: number;
  cmpQtdParcela: number;
  usrMatricula: string;
  usrNome: string;
  cnvNomFantasia: string;
  cmpEmissao: string;
  cmpVlrCompra: number;
};

export default function PdfCmpEmisPage() {
  const searchParams = useSearchParams();

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [parcelas, setParcelas] = useState<any[]>([]);
  const [datInicio, setDatInicio] = useState("");
  const [datFinal, setDatFinal] = useState("");

  useEffect(() => {
    const dataInicio = searchParams.get("datInicio");
    const dataFinal = searchParams.get("datFinal");
    const convenio = searchParams.get("convenio");
    const servidor = searchParams.get("servidor");

    if (!dataInicio || !dataFinal) return;

    setDatInicio(moment(dataInicio).format("L"));
    setDatFinal(moment(dataFinal).format("L"));

    async function loadData() {
      const res = await api.get(
        `/pdfCmpEmis/${dataInicio}/${dataFinal}/${convenio || 0}/${servidor || 0}`
      );

      setVendas(res.data.compras);
      setParcelas(res.data.parcelas || []);
    }

    loadData();
  }, [searchParams]);

  async function gerarPdf() {
    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfFontsModule = await import("pdfmake/build/vfs_fonts");

    const pdfMake = pdfMakeModule.default;
    (pdfMake as any).vfs = pdfFontsModule.default;

    // 🔹 Agrupar parcelas
    const parcelasPorCompra = parcelas.reduce((acc, parcela) => {
      if (!acc[parcela.parIdCompra]) {
        acc[parcela.parIdCompra] = [];
      }
      acc[parcela.parIdCompra].push(parcela);
      return acc;
    }, {} as Record<number, any[]>);

    const dados: any[] = [];

    vendas.forEach((venda) => {
      dados.push([
        {
          text: `Compra #${venda.cmpId} - ${venda.usrNome}`,
          colSpan: 7,
          bold: true,
          fillColor: "#eeeeee",
          margin: [5, 5, 0, 5],
        },
        {}, {}, {}, {}, {}, {},
      ]);

      dados.push([
        { text: "Matrícula:", bold: true, fontSize: 7 },
        { text: venda.usrMatricula, fontSize: 7 },
        { text: "Convênio:", bold: true, fontSize: 7 },
        { text: venda.cnvNomFantasia, fontSize: 7 },
        { text: "Emissão:", bold: true, fontSize: 7 },
        { text: moment(venda.cmpEmissao).format("L"), fontSize: 7 },
        {
          text: Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(venda.cmpVlrCompra),
          alignment: "right",
          bold: true,
          fontSize: 7,
        },
      ]);

      dados.push([
        { text: "", colSpan: 2 },
        {},
        { text: "Parcela", bold: true, fontSize: 6 },
        { text: "Vencimento", bold: true, fontSize: 6 },
        { text: "Valor", bold: true, fontSize: 6 },
        { text: "Status", bold: true, fontSize: 6 },
        { text: "", fontSize: 6 },
      ]);

      const parcelasDaCompra = parcelasPorCompra[venda.cmpId] || [];

      parcelasDaCompra.forEach((parcela: any) => {
        dados.push([
          { text: "", colSpan: 2 },
          {},
          { text: parcela.parNroParcela, fontSize: 6 },
          { text: moment(parcela.parVctParcela).format("L"), fontSize: 6 },
          {
            text: Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(parcela.parVlrParcela),
            alignment: "right",
            fontSize: 6,
          },
          {
            text: parcela.parStaParcela === "P" ? "PAGO" : "ABERTO",
            fontSize: 6,
          },
          {},
        ]);
      });

      dados.push([
        { text: "", colSpan: 7, margin: [0, 5] },
        {}, {}, {}, {}, {}, {},
      ]);
    });

    const total = vendas.reduce((sum, v) => sum + v.cmpVlrCompra, 0);

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [20, 60, 20, 50],

      header: {
        text: `RELATÓRIO DE COMPRAS\nPeríodo: ${datInicio} até ${datFinal}`,
        alignment: "center",
        fontSize: 14,
        bold: true,
        margin: [0, 20, 0, 10],
      },

      content: [
        {
          table: {
            widths: ["*", "*", "*", "*", "*", "*", "*"],
            body: dados,
          },
          layout: "noBorders",
        },
      ],

      footer: (currentPage: number, pageCount: number) => ({
        margin: [20, 10],
        columns: [
          {
            text:
              "Total Geral: " +
              Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(total),
            alignment: "left",
            fontSize: 9,
            bold: true,
          },
          {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: "right",
            fontSize: 8,
          },
        ],
      }),
    };

    pdfMake.createPdf(docDefinition as any).open();
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="rounded-2xl shadow-sm w-[420px]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Gerar Relatório de Compras
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6 items-center">
          <Button onClick={gerarPdf} className="flex items-center gap-2">
            <FileText size={16} />
            Gerar PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}