"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import LogoutButton from "./LogoutButton";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Menu,
  Users,
  ClipboardList,
  Building2,
  FileText,
  LogOut,
  UserCog,
} from "lucide-react";

import { api } from "@/lib/api";

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); 
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [userNome, setUserNome] = useState("");
  const [userCodigo, setUserCodigo] = useState("");

  const menu = [
    { name: "Orgão Admin.", to: "/dashboard/orgadmin", icon: Users },
    { name: "Secretarias", to: "/dashboard/secretarias", icon: Building2 },
    { name: "Cargos", to: "/dashboard/cargos", icon: ClipboardList },
    { name: "R.Atividades", to: "/dashboard/atividades", icon: FileText },
    { name: "Convênios", to: "/dashboard/convenios", icon: FileText },
    { name: "Bairros", to: "/dashboard/bairros", icon: FileText },
  ];

  const menUser = [
    { name: "Tipos Contrato", to: "/dashboard/tipos", icon: Users },
    { name: "Servidores", to: "/dashboard/servidores", icon: Users },
    { name: "Administradores", to: "/dashboard/administradores", icon: UserCog },
  ];

  const menAdmin = [
    { name: "Extrato", to: "/dashboard/extratos", icon: FileText },
    { name: "Vdas Emissão", to: "/dashboard/vdaemissao", icon: FileText },
    { name: "Vdas Vencimento", to: "/dashboard/vdavencimento", icon: FileText },
    { name: "Extrato Admin", to: "/dashboard/extadmin", icon: FileText },
    { name: "Compras Servidor", to: "/cmpservidor", icon: FileText },
    { name: "Vdas Org.Admin", to: "/dashboard/vdavctorgao", icon: FileText },
    { name: "Atualiza Tabelas", to: "/atuTabelas", icon: FileText },
  ];

  useEffect(() => {
    const codUsuario = localStorage.getItem("usuarioId");
    const nomeUsuario = localStorage.getItem("usuarioNome");

    if (nomeUsuario) setUserNome(nomeUsuario);

    if (!codUsuario) return;

    api
      .get(`searchAdmin/${codUsuario}`)
      .then((response) => {
        setUserCodigo(response.data[0].admId);
        setUserNome(response.data[0].admNome);
      })
      .catch(() => {
        alert("Falha no login! Tente novamente.");
        localStorage.clear();
        router.back();
      });
  }, [router]);

  function handleLogout() {
    localStorage.clear();
    router.push("/login");
  }

  function MenuSection({
    items,
    title,
  }: {
    items: { name: string; to: string; icon: any }[];
    title: string;
  }) {
    return (
      <div className="space-y-3">

        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-2">
          {title}
        </p>

        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;

          return (
            <Link key={item.to} href={item.to} onClick={() => setOpen(false)}>
              <div
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all group
                ${
                  active
                    ? "bg-indigo-50 text-indigo-600 dark:bg-zinc-800 dark:text-indigo-400 font-medium"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <div
                  className={`p-2 rounded-lg transition-all
                  ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 group-hover:bg-indigo-100 dark:group-hover:bg-zinc-700"
                  }`}
                >
                  <Icon size={16} />
                </div>

                {item.name}
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
  <div className="flex h-screen w-full overflow-hidden bg-zinc-100 dark:bg-black">
    
    {/* SIDEBAR DESKTOP */}
    <aside className="hidden md:flex h-screen w-72 flex-col border-r bg-white dark:bg-zinc-950">

      {/* TOPO (fixo) */}
      <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <h2 className="text-xl font-bold tracking-tight">Card Admin</h2>
        <p className="text-sm text-white/80 mt-1">
          Bem-vindo {userNome}
        </p>
      </div>

      {/* MENU COM SCROLL */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4 py-6">

          <MenuSection items={menu} title="Cadastros" />

          <Separator className="my-6" />

          <MenuSection items={menUser} title="Usuários" />

          <Separator className="my-6" />

          <MenuSection items={menAdmin} title="Financeiro" />

        </ScrollArea>
      </div>

      {/* FOOTER FIXO */}
      <div className="p-4 border-t bg-white dark:bg-zinc-950">
        <LogoutButton />
      </div>

    </aside>

    {/* CONTEÚDO */}
    <div className="flex flex-1 flex-col h-screen overflow-hidden">

      {/* HEADER MOBILE */}
      <header className="h-16 border-b bg-white dark:bg-zinc-950 flex items-center px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-72 p-0">

            <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
              <h2 className="text-xl font-bold">Card Admin</h2>
              <p className="text-sm text-white/80 mt-1">
                Bem-vindo {userNome}
              </p>
            </div>

            <ScrollArea className="h-[calc(100vh-160px)] px-4 py-6">
              <MenuSection items={menu} title="Cadastros" />
              <Separator className="my-6" />
              <MenuSection items={menUser} title="Usuários" />
              <Separator className="my-6" />
              <MenuSection items={menAdmin} title="Financeiro" />
            </ScrollArea>

            <div className="p-4 border-t">
              <LogoutButton />
            </div>

          </SheetContent>
        </Sheet>

        <h1 className="ml-4 font-semibold text-lg">Card Admin</h1>
      </header>

      {/* CONTEÚDO COM SCROLL */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>

    </div>
  </div>
);  
}