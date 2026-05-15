"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Pencil, Plus, Search } from "lucide-react";
import moment from "moment";

// ---------------- TYPES ----------------

type TaxaMensal = {
  txaMenId: number;
  txaMenAtvId: number;
  txaMenMes: number;
  txaMenAno: number;
  txaMenIndice: number;
  txaMenStatus: string;
  atvDescricao: string;
};

// ---------------- PAGE ----------------

export default function TaxasMensaisPage() {
  const [taxas, setTaxas] = useState<TaxaMensal[]>([]);

  // pega mês e ano atual automaticamente
  const dataAtual = new Date();

  const [mes, setMes] = useState(
    String(dataAtual.getMonth() + 1).padStart(2, "0")
  );

  const [ano, setAno] = useState(
    String(dataAtual.getFullYear())
  );

  const router = useRouter();

  // ---------------- LOAD ----------------

  async function loadData(
    mesBusca?: string,
    anoBusca?: string
  ) {
    try {
      const params: any = {};

      if (mesBusca) params.mes = mesBusca;
      if (anoBusca) params.ano = anoBusca;

      const res = await api.get("/searchTaxa", {
        params: {
          mes: mesBusca,
          ano: anoBusca,
        },
      });

      setTaxas(res.data);
    } catch (error) {
      console.error("Erro ao carregar taxas:", error);
    }
  }

  // ---------------- FIRST LOAD ----------------

  useEffect(() => {
    loadData(mes, ano);
  }, []);

  // ---------------- SEARCH ----------------

  function handleBuscar() {
    loadData(mes, ano);
  }

  //----------------- TAXAS ADM MENSAIS -----------------
  async function handleGerMensais() {
    try {
      
      const res = await api.post("/geraTaxa", { mes, ano });

    } catch (error) {
      
      console.error("Erro ao carregar taxas:", error);

    }
  }

  //----------------- REPROCESSA VENDAS CONVÊNIOS -----------------
  async function handleAceCmpConv() {
    try {
      let datProcess = new Date();

      let day = 15;
      let year = parseInt(ano);
      let month = parseInt(mes) - 1;

      //let year = datProcess.getFullYear();
      //let month = datProcess.getMonth();

      let datVencto = new Date(year, month, day);

      // Formato AAAA-MM-DD
      let datVenctoFormatada = datVencto.toISOString().split("T")[0];

      console.log("Data:", datVenctoFormatada);

      const res = await api.post("/aceCmpCnv", {
         datVencto: datVenctoFormatada,
      });

      console.log(res.data.msn);
      alert(res.data.msn);

    } catch (error) {
      console.error("Erro ao carregar taxas:", error);
    }
  }

  // ---------------- UI ----------------

  return (
  <div className="flex flex-1 flex-col gap-6 p-6">
    <div>
      <Button variant="outline" onClick={() => router.back()}>
        ← Voltar
      </Button>
    </div>
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl font-semibold">
            Taxas Mensais
          </CardTitle>
          <Link href="/dashboard/atvmensal/nova">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Nova Taxa
            </Button>
          </Link>
          <Button onClick={handleGerMensais} className="flex items-center gap-2">
            <Plus size={16} />
            Gerar Mensais
          </Button>
          <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white" onClick={handleAceCmpConv}>
            <Plus size={16} />
            Reprocessa Vendas
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            type="number"
            placeholder="Mês"
            min={1}
            max={12}
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            className="w-full md:w-28"
          />

          <Input
            type="number"
            placeholder="Ano"
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            className="w-full md:w-32"
          />

          <Button
            onClick={handleBuscar}
            className="flex items-center gap-2"
          >
            <Search size={16} />
            Buscar
          </Button>

        </div>

      </CardHeader>

      <CardContent className="space-y-4">

        {/* HEADER FIXO */}
        <div className="rounded-xl border bg-white dark:bg-zinc-900">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Atividade</TableHead>
                <TableHead className="w-[100px]">Mês</TableHead>
                <TableHead className="w-[100px]">Ano</TableHead>
                <TableHead className="w-[120px]">Índice</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[100px] text-right">
                  Editar
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxas.map((item) => (
                <TableRow key={item.txaMenId}>
                  <TableCell>{item.txaMenId}</TableCell>
                  <TableCell>{item.txaMenAtvId} - {item.atvDescricao}</TableCell>
                  <TableCell>{item.txaMenMes}</TableCell>
                  <TableCell>{item.txaMenAno}</TableCell>
                  <TableCell>{item.txaMenIndice}%</TableCell>
                  <TableCell>{item.txaMenStatus}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/atvmensal/edit/${item.txaMenId}`}>
                      <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
  );
}