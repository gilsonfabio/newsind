"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {api } from "@/lib/api";

interface User {
  usrNome: string;
  usrEmail: string;
  usrCpf: string;
  usrIdentidade: string;
  usrOrgEmissor: string;
  usrPassword: string;
}

export default function AltPermissao() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User>({
    usrNome: "",
    usrEmail: "",
    usrCpf: "",
    usrIdentidade: "",
    usrOrgEmissor: "",
    usrPassword: "",
  });

  const [activeTab, setActiveTab] = useState<string>("tab-0");

  useEffect(() => {
    const idUsr = params.usrId;
    api.get(`searchUser/${idUsr}`).then((response) => {
      const data = response.data[0];
      setUser({
        usrNome: data.usrNome,
        usrEmail: data.usrEmail,
        usrCpf: data.usrCpf,
        usrIdentidade: data.usrIdentidade,
        usrOrgEmissor: data.usrOrgEmissor,
        usrPassword: data.usrPassword,
      });
    });
  }, [params.usrId]);

  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdServidor = async (e: React.FormEvent) => {
    e.preventDefault();
    const idSrv = params.usrId;
    try {
      await api.put(`altpermissao/${idSrv}`, { usrPassword: user.usrPassword });
      alert("Servidor alterado com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro na alteração!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 flex flex-col gap-6">
        {/* Tabs verticais */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col md:flex-row bg-white rounded-xl shadow border border-gray-200"
        >
          <TabsList className="flex md:flex-col w-full md:w-48 border-b md:border-b-0 md:border-r border-gray-200">
            {Array.from({ length: 7 }).map((_, idx) => (
              <TabsTrigger
                key={idx}
                value={`tab-${idx}`}
                className="text-left px-4 py-2"
              >
                {idx === 0 ? "Básicos" : ""}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Conteúdo do Tab */}
          <form
            onSubmit={handleUpdServidor}
            className="flex-1 p-6 flex flex-col gap-6"
          >
            <TabsContent value="tab-0" className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Lado esquerdo */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col">
                    <Label htmlFor="nome">Nome do Usuário</Label>
                    <Input
                      id="nome"
                      value={user.usrNome}
                      onChange={(e) => handleChange("usrNome", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="email">Email do Usuário</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.usrEmail}
                      onChange={(e) => handleChange("usrEmail", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="password">Senha Servidor</Label>
                    <Input
                      id="password"
                      type="password"
                      value={user.usrPassword}
                      onChange={(e) =>
                        handleChange("usrPassword", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Lado direito */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={user.usrCpf}
                      onChange={(e) => handleChange("usrCpf", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="identidade">Identidade</Label>
                    <Input
                      id="identidade"
                      value={user.usrIdentidade}
                      onChange={(e) =>
                        handleChange("usrIdentidade", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="orgemissor">Orgão Emissor</Label>
                    <Input
                      id="orgemissor"
                      value={user.usrOrgEmissor}
                      onChange={(e) =>
                        handleChange("usrOrgEmissor", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Outras tabs vazias */}
            {Array.from({ length: 6 }).map((_, idx) => (
              <TabsContent key={idx + 1} value={`tab-${idx + 1}`} />
            ))}

            <div className="mt-4">
              <Button type="submit" className="w-full md:w-auto">
                Salvar cadastro
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  );
}