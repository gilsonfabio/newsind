"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Edit, Trash2, Plus } from "lucide-react";

interface Cargo {
  crgId: number;
  crgDescricao: string;
}

export default function CargosPage() {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [search, setSearch] = useState("");

  // ---------------- LISTAR ----------------
  useEffect(() => {
    loadCargos();
  }, []);

  async function loadCargos() {
    try {
      const response = await api.get("/cargos");
      setCargos(response.data);
    } catch (error) {
      alert("Erro ao carregar cargos");
    }
  }

  // ---------------- BUSCA AUTOMÁTICA ----------------
  useEffect(() => {
    if (search === "") {
      loadCargos();
      return;
    }

    async function searchCargo() {
      try {
        const response = await api.get(`/buscargo/${search}`);
        setCargos(response.data);
      } catch (error) {
        alert("Erro na busca");
      }
    }

    searchCargo();
  }, [search]);

  // ---------------- DELETE ----------------
  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente excluir este cargo?")) return;

    try {
      await api.put(`/delcargo/${id}`);
      alert("Cargo excluído com sucesso!");
      loadCargos();
    } catch (error) {
      alert("Erro ao excluir cargo");
    }
  }

  // ---------------- UI ----------------
  return (
    <div className="w-full px-6 py-8 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <h1 className="text-2xl font-semibold">Cargos</h1>

        <div className="flex gap-3">

          {/* BUSCA */}
          <Input
            placeholder="Buscar cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[260px]"
          />

          {/* NOVO CARGO */}
          <Link href="/dashboard/cargos/new">
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Novo Cargo
            </Button>
          </Link>

        </div>
      </div>

      {/* TABELA */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle>Lista de Cargos</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right w-[120px]">Editar</TableHead>
                <TableHead className="text-right w-[120px]">Excluir</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cargos.map((cargo) => (
                <TableRow key={cargo.crgId}>

                  <TableCell>{cargo.crgId}</TableCell>

                  <TableCell>{cargo.crgDescricao}</TableCell>

                  {/* EDITAR */}
                  <TableCell className="text-right">
                    <Link href={`/dashboard/cargos/edit/${cargo.crgId}`}>
                      <Button variant="outline" size="sm">
                        <Edit size={16} />
                      </Button>
                    </Link>
                  </TableCell>

                  {/* EXCLUIR */}
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cargo.crgId)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}