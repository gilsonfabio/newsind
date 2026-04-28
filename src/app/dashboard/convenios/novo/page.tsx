"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { ArrowLeft } from "lucide-react";

// ---------------- TYPES ----------------

type Atividade = {
  atvId: number;
  atvDescricao: string;
};

// ---------------- PAGE ----------------

export default function NovoConvenioPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [atividades, setAtividades] = useState<Atividade[]>([]);

  // ---------------- STATES ----------------

  const [cnvNomFantasia, setNomFantasia] = useState("");
  const [cnvRazSocial, setRazSocial] = useState("");
  const [cnvTelefone, setTelefone] = useState("");
  const [cnvEmail, setEmail] = useState("");
  const [cnvCpfCnpj, setCpfCnpj] = useState("");
  const [cnvContato, setContato] = useState("");
  const [cnvAtividade, setAtividade] = useState("");
  const [cnvPassword, setPassword] = useState("");
  const [cnvCanPassword, setCanPassword] = useState("");
  const [cnvEndereco, setEndereco] = useState("");
  const [cnvBairro, setBairro] = useState("");
  const [cnvCidade, setCidade] = useState("");
  const [cnvEstado, setEstado] = useState("");
  const [cnvCep, setCep] = useState("");
  const [cnvQtdParc, setQtdParc] = useState("");

  // ---------------- LOAD ATIVIDADES ----------------

  useEffect(() => {
    async function loadAtividades() {
      try {
        const res = await api.get("/atividades");
        setAtividades(res.data);
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
      }
    }

    loadAtividades();
  }, []);

  // ---------------- CREATE ----------------

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/newconvenio", {
        cnvRazSocial,
        cnvNomFantasia,
        cnvCpfCnpj,
        cnvEmail,
        cnvTelefone,
        cnvContato,
        cnvAtividade,
        cnvPassword,
        cnvCanPassword,
        cnvEndereco,
        cnvBairro,
        cnvCidade,
        cnvEstado,
        cnvCep,
        cnvQtdParc,
      });

      alert("Convênio cadastrado com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro ao cadastrar convênio");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- UI ----------------

  return (
    <div className="w-full px-6 py-8 space-y-6">

      {/* BOTÃO VOLTAR */}
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Voltar
      </Button>

      {/* CARD */}
      <Card className="w-full max-w-4xl mx-auto rounded-2xl shadow-sm">

        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Novo Convênio
          </CardTitle>
        </CardHeader>

        <Separator />

        <CardContent>
          <form onSubmit={handleCreate} className="space-y-6">

            <Tabs defaultValue="basicos" className="w-full">

              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="basicos">Dados Básicos</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="seguranca">Segurança</TabsTrigger>
              </TabsList>

              {/* ---------------- BASICOS ---------------- */}

              <TabsContent value="basicos" className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label>Nome Fantasia</Label>
                    <Input value={cnvNomFantasia} onChange={(e) => setNomFantasia(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Razão Social</Label>
                    <Input value={cnvRazSocial} onChange={(e) => setRazSocial(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input value={cnvTelefone} onChange={(e) => setTelefone(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={cnvEmail} onChange={(e) => setEmail(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>CNPJ / CPF</Label>
                    <Input value={cnvCpfCnpj} onChange={(e) => setCpfCnpj(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Contato</Label>
                    <Input value={cnvContato} onChange={(e) => setContato(e.target.value)} />
                  </div>

                </div>

              </TabsContent>

              {/* ---------------- ENDEREÇO ---------------- */}

              <TabsContent value="endereco" className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label>Endereço</Label>
                    <Input value={cnvEndereco} onChange={(e) => setEndereco(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Bairro</Label>
                    <Input value={cnvBairro} onChange={(e) => setBairro(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Cidade</Label>
                    <Input value={cnvCidade} onChange={(e) => setCidade(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Input value={cnvEstado} onChange={(e) => setEstado(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <Input value={cnvCep} onChange={(e) => setCep(e.target.value)} />
                  </div>

                </div>

              </TabsContent>

              {/* ---------------- SEGURANÇA ---------------- */}

              <TabsContent value="seguranca" className="space-y-4">

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label>Senha de Acesso</Label>
                    <Input type="password" value={cnvPassword} onChange={(e) => setPassword(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Senha de Cancelamento</Label>
                    <Input type="password" value={cnvCanPassword} onChange={(e) => setCanPassword(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantidade de Parcelas</Label>
                    <Input value={cnvQtdParc} onChange={(e) => setQtdParc(e.target.value)} />
                  </div>

                  <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">
                      Ramo de Atividade
                    </h3>
                    <Select onValueChange={(value) => setAtividade(value)}>
                      <SelectTrigger className="w-full h-11 text-sm">
                        <SelectValue placeholder="Selecione a atividade" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {atividades.map((s) => (
                          <SelectItem key={s.atvId} value={String(s.atvId)}>
                            {s.atvDescricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              </TabsContent>

            </Tabs>

            {/* BOTÃO SALVAR */}
            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="min-w-[200px]">
                {loading ? "Salvando..." : "Salvar Cadastro"}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}