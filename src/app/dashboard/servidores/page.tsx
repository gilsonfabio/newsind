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
import { Plus } from "lucide-react";
import {
  Pencil,
  Trash2,
  Baby,
  Book,
  CreditCard,
  Printer,
  FileText,
} from "lucide-react";

export default function ServidoresPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cpfAnt, setCpfAnt] = useState("");

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      }
    }
    loadUsers();
  }, []);

  // ---------------- SEARCH ----------------
  useEffect(() => {
    async function searchUsers() {
      try {
        if (search) {
          const res = await api.get(`/classUser/${search}`);
          setUsers(res.data);
        }
      } catch (error) {
        console.error("Erro na busca:", error);
      }
    }
    searchUsers();
  }, [search]);

  // ---------------- CPF ANTIGO ----------------
  async function handleBusAnterior() {
    try {
      await api.get(`/usrAnterior/${cpfAnt}`);
      alert("Servidor(a) cadastrado com sucesso!");
    } catch {
      alert("Erro no cadastro!");
    }
  }

  // ---------------- DELETE ----------------
  async function handleDelete(usrId: number) {
    //const confirmDelete = confirm("Deseja realmente excluir este servidor?");
    //if (!confirmDelete) return;

    //try {
    //  await api.put(`/delServidor/${usrId}`);
    //  setUsers((prev) => prev.filter((u) => u.usrId !== usrId));
    //} catch (error) {
    //  console.error(error);
    //  alert("Erro ao excluir servidor");
    //}
  }

  function handleOpenModal(user: any) {
    setSelectedUser(user);
    setIsModalOpen(true);
  }

  // ---------------- UI ----------------
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* BOTÕES DE AÇÃO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Link href="/dashboard/servidores/novo">
          <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white">
            <Plus size={16} />
            Novo Servidor
          </Button>
        </Link>

        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <input
            type="text"
            placeholder="CPF Servidor Antigo"
            value={cpfAnt}
            onChange={(e) => setCpfAnt(e.target.value)}
            className="border border-zinc-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full md:w-[220px]"
          />
          <Button onClick={handleBusAnterior} className="h-11 px-4">
            <FileText size={16} />
          </Button>

          <input
            type="text"
            placeholder="Busca Servidor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-zinc-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full md:w-[300px]"
          />
        </div>
      </div>

      {/* TABELA */}
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Servidores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto border rounded-xl">
            {/* TABELA COM SCROLL VERTICAL */}
            <div className="max-h-[65vh] overflow-y-auto">
              <Table className="table-auto min-w-full border-separate border-spacing-0">
                <TableHeader className="sticky top-0 bg-zinc-50 dark:bg-zinc-800 z-10">
                  <TableRow>
                    <TableHead className="w-16 font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Nome</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="text-center font-semibold">Filiação</TableHead>
                    <TableHead className="text-center font-semibold">Info</TableHead>
                    <TableHead className="text-center font-semibold">Status</TableHead>
                    <TableHead className="text-center font-semibold">Ficha</TableHead>
                    <TableHead className="text-center font-semibold">Contrato</TableHead>
                    <TableHead className="text-center font-semibold">Permissão</TableHead>
                    <TableHead className="text-center font-semibold">Editar</TableHead>
                    <TableHead className="text-center font-semibold">Excluir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-12 text-zinc-500">
                        Nenhum servidor encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((row) => (
                      <TableRow
                        key={row.usrId}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <TableCell className="w-16 font-medium">{row.usrId}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleOpenModal(row)}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {row.usrNome}
                          </button>
                        </TableCell>
                        <TableCell>{row.usrEmail}</TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/filiacao/${row.usrId}`}><Baby size={16} /></Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/informacoes/${row.usrId}`}><Book size={16} /></Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/stacartao/${row.usrId}`}><CreditCard size={16} /></Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/ficha/${row.usrId}`}><Printer size={16} /></Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/contrato/${row.usrId}`}><Printer size={16} /></Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/permissao/${row.usrId}`}><FileText size={16} /></Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/servidores/edit/${row.usrId}`}><Pencil size={16} /></Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button onClick={() => handleDelete(row.usrId)}>
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Ações - {selectedUser.usrNome}
            </h2>

            <div className="grid grid-cols-2 gap-3">

              <Link href={`/dashboard/filiacao/${selectedUser.usrId}`}>
                <Button className="w-full flex gap-2"><Baby size={16}/> Filiação</Button>
              </Link>
              <Link href={`/dashboard/informacoes/${selectedUser.usrId}`}>
                <Button className="w-full flex gap-2"><Book size={16}/> Informações</Button>
              </Link>
              <Link href={`/dashboard/stacartao/${selectedUser.usrId}`}>
                <Button className="w-full flex gap-2"><CreditCard size={16}/> Status</Button>
              </Link>
              <Link href={`/dashboard/ficha/${selectedUser.usrId}`}>
                <Button className="w-full flex gap-2"><Printer size={16}/> Ficha</Button>
              </Link>
              <Link href={`/dashboard/contrato/${selectedUser.usrId}`}>
                <Button className="w-full flex gap-2"><Printer size={16}/> Contrato</Button>
              </Link>
              <Link href={`/dashboard/permissao/${selectedUser.usrId}`}>
                <Button className="w-full flex gap-2"><FileText size={16}/> Permissão</Button>
              </Link>
              <Link href={`/dashboard/servidores/edit/${selectedUser.usrId}`}>
                <Button className="w-full flex gap-2"><Pencil size={16}/> Editar</Button>
              </Link>
              <Button
                onClick={() => handleDelete(selectedUser.usrId)}
                className="w-full flex gap-2 bg-red-500 hover:bg-red-600"
              >
                <Trash2 size={16}/> Excluir
              </Button>
            </div>
            <div className="mt-6 text-right">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}                
    </div>
  );
}