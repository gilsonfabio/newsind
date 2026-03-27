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
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";

type Compra = {
  parIdCompra: number;
  parNroParcela: number;
  cmpEmissao: string;
  parVctParcela: string;
  parVlrParcela: number;
  cmpConvenio: string;
  usrNome: string;
};

export default function VdaVencimento() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [total, setTotal] = useState(0);

  const [datInicio, setDatInicio] = useState("");
  const [datFinal, setDatFinal] = useState("");
  const [convenio, setConvenio] = useState("");
  const [servidor, setServidor] = useState("");

  // ================== DATA AUTOMÁTICA (dia 15) ==================
  useEffect(() => {
    const newDate = new Date();

    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    if (newDate.getDate() > 15) month++;

    if (month > 12) {
      month = 1;
      year++;
    }

    const data = `${year}-${String(month).padStart(2, "0")}-15`;

    setDatInicio(data);
    setDatFinal(data);
  }, []);

  // ================== BUSCAR DADOS ==================
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!datInicio || !datFinal) return;

        const url1 = `/vctPeriodo/${datInicio}/${datFinal}/${convenio || 0}/${servidor || 0}`;
        const url2 = `/somVctComp/${datInicio}/${datFinal}/${convenio || 0}/${servidor || 0}`;

        const [comprasResp, totalResp] = await Promise.all([
          api.get(url1),
          api.get(url2),
        ]);

        setCompras(comprasResp.data);
        setTotal(totalResp.data[0]?.totCmp || 0);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [datInicio, datFinal, convenio, servidor]);

  return (
    <div className="p-6 space-y-6">
      {/* ================== FILTROS ================== */}
      <div className="flex flex-wrap gap-4 items-end">

        <Input
          type="date"
          value={datInicio}
          onChange={(e) => setDatInicio(e.target.value)}
          className="w-[200px]"
        />

        <Input
          type="date"
          value={datFinal}
          onChange={(e) => setDatFinal(e.target.value)}
          className="w-[200px]"
        />

        <Input
          placeholder="CNPJ Convênio"
          value={convenio}
          onChange={(e) => setConvenio(e.target.value)}
          className="w-[220px]"
        />

        <Input
          placeholder="Matrícula Servidor"
          value={servidor}
          onChange={(e) => setServidor(e.target.value)}
          className="w-[220px]"
        />

        <Link
          href={{
            pathname: "/dashboard/vdavencimento/pdfvctcompras",
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

        {/* TOTAL */}
        <div className="ml-auto text-right">
          <p className="text-lg font-semibold">
            TOTAL DAS COMPRAS:{" "}
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(total)}
          </p>
        </div>
      </div>

      {/* ================== TABELA ================== */}
      <div className="rounded-2xl border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
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

          <TableBody>
            {compras.map((row) => (
              <TableRow key={row.parIdCompra}>
                <TableCell>{row.parIdCompra}</TableCell>
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
                  <Link href={`/editarCompra/${row.parIdCompra}`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                </TableCell>

                <TableCell className="text-right">
                  <Button variant="destructive" size="sm">
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}