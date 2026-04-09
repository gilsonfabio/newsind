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

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ---------------- TYPES ----------------

type Venda = {
  usrId: number;
  usrMatricula: string;
  usrNome: string;
  usrVlrUsado: number;
};

// ---------------- 🔥 FORMATAR DATA ----------------

const formatarData = (data: string) => {
  if (!data) return "";

  const [ano, mes, dia] = data.split("-");
  return `${dia}-${mes}-${ano}`;
};

// ---------------- PAGE ----------------

export default function ArqCmpTxtPage() {
  const searchParams = useSearchParams();

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [orgDescricao, setOrgDescricao] = useState("");
  const [datVencto, setDatVencto] = useState("");
  const [orgao, setOrgao] = useState("");
  const [status, setStatus] = useState("");

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

        let idOrg = org;
        const orgResp = await api.get(`/searchOrg/${idOrg}`);
        const descricao = orgResp.data?.[0]?.orgDescricao || "";
        setOrgDescricao(descricao);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    loadData();
  }, [searchParams]);

  // ---------------- GERAR TXT ----------------

  const gerarTXT = () => {
    let texto = "";

    const col = (v: string | number, t: number) =>
      String(v ?? "").padEnd(t, " ");

    const colValor = (v: number, t: number) =>
      v
        .toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        .padStart(t, " ");

    texto += "RELATÓRIO DE VENDAS POR VENCIMENTO\n";
    texto += `Vencimento: ${formatarData(datVencto)}   Órgão: ${orgao} - ${orgDescricao}\n\n`;

    texto +=
      col("ID", 5) +
      col("MATRICULA", 10) +
      col("NOME DO SERVIDOR", 34) +
      col("VENCIMENTO", 11) +
      col("TOTAL", 13) +
      "\n";

    texto += "-".repeat(73) + "\n";

    const vendasOrdenadas = [...vendas].sort((a, b) =>
      a.usrNome.localeCompare(b.usrNome, "pt-BR", { sensitivity: "base" })
    );

    let total = 0;

    vendasOrdenadas.forEach((v) => {
      total += Number(v.usrVlrUsado ?? 0);

      texto +=
        col(v.usrId, 5) +
        col(v.usrMatricula, 10) +
        col(v.usrNome, 34) +
        col(formatarData(datVencto), 11) +
        "R$ " +
        colValor(v.usrVlrUsado ?? 0, 10) +
        "\n";
    });

    texto += "-".repeat(73) + "\n";
    texto += col("TOTAL GERAL:", 60) + "R$ " + colValor(total, 10) + "\n";

    const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Relatorio_${orgDescricao}_${formatarData(datVencto)}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  // ---------------- GERAR PDF ----------------

  const gerarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("RELATÓRIO DE VENDAS POR VENCIMENTO", 14, 15);

    doc.setFontSize(10);
    doc.text(
      `Vencimento: ${formatarData(datVencto)}   Órgão: ${orgao} - ${orgDescricao}`,
      14,
      22
    );

    const vendasOrdenadas = [...vendas].sort((a, b) =>
      a.usrNome.localeCompare(b.usrNome, "pt-BR", { sensitivity: "base" })
    );

    let total = 0;

    const rows = vendasOrdenadas.map((v) => {
      total += Number(v.usrVlrUsado ?? 0);

      return [
        v.usrId,
        v.usrMatricula,
        v.usrNome,
        formatarData(datVencto),
        `R$ ${Number(v.usrVlrUsado).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
      ];
    });

    autoTable(doc, {
      startY: 28,
      head: [["ID", "MATRÍCULA", "SERVIDOR", "VENCIMENTO", "TOTAL"]],
      body: rows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [40, 40, 40] },
      columnStyles: {
        4: { halign: "right" },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    doc.text(
      `TOTAL GERAL: R$ ${total.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      14,
      finalY + 10
    );

    doc.save(`Relatorio_${orgDescricao}_${formatarData(datVencto)}.pdf`);
  };

  // ---------------- UI ----------------

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-4xl rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Relatório de Compras (TXT / PDF)
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex gap-3">
            <Button onClick={gerarPDF}>
              <FileText size={16} />
              Gerar PDF
            </Button>

            <Button onClick={gerarTXT}>
              <FileDown size={16} />
              Exportar TXT
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-zinc-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Matrícula</th>
                  <th className="p-3 text-left">Servidor</th>
                  <th className="p-3 text-right">Total Compras</th>
                </tr>
              </thead>

              <tbody>
                {vendas.map((row, index) => (
                  <tr key={index} className="border-t hover:bg-zinc-50">
                    <td className="p-3">{row.usrId}</td>
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