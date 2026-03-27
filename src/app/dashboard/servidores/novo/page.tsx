"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewServidorPage() {
  const router = useRouter();

  // ---------------- BASIC ----------------
  const [usrNome, setUsrNome] = useState("");
  const [usrEmail, setUsrEmail] = useState("");
  const [usrCpf, setUsrCpf] = useState("");
  const [usrCelular, setUsrCelular] = useState("");
  const [usrNascimento, setUsrNascimento] = useState("");
  const [usrIdentidade, setUsrIdentidade] = useState("");
  const [usrOrgEmissor, setUsrOrgEmissor] = useState("");
  const [usrEstCivil, setUsrEstCivil] = useState("");

  // ---------------- ADDRESS ----------------
  const [usrEndereco, setUsrEndereco] = useState("");
  const [usrCidade, setUsrCidade] = useState("");
  const [usrEstado, setUsrEstado] = useState("");
  const [usrCep, setUsrCep] = useState("");
  const [usrBairro, setUsrBairro] = useState("");

  // ---------------- WORK ----------------
  const [usrMatricula, setUsrMatricula] = useState("");
  const [usrSecretaria, setUsrSecretaria] = useState("");
  const [usrCargo, setUsrCargo] = useState("");
  const [usrAdmissao, setUsrAdmissao] = useState("");
  const [usrSalLiquido, setUsrSalLiquido] = useState("");

  // ---------------- DATA LISTS ----------------
  const [secretarias, setSecretarias] = useState<any[]>([]);
  const [cargos, setCargos] = useState<any[]>([]);
  const [bairros, setBairros] = useState<any[]>([]);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    async function loadData() {
      try {
        const [sec, car, bai] = await Promise.all([
          api.get("/secretarias"),
          api.get("/cargos"),
          api.get("/bairros"),
        ]);

        setSecretarias(sec.data);
        setCargos(car.data);
        setBairros(bai.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    loadData();
  }, []);

  // ---------------- CREATE ----------------
  async function handleCreateServidor(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/newuser", {
        usrNome,
        usrEmail,
        usrCpf,
        usrCelular,
        usrNascimento,
        usrIdentidade,
        usrOrgEmissor,
        usrEstCivil,
        usrEndereco,
        usrCidade,
        usrEstado,
        usrCep,
        usrBairro,
        usrMatricula,
        usrSecretaria,
        usrCargo,
        usrAdmissao,
        usrSalLiquido,
      });

      alert("Servidor cadastrado com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro ao cadastrar servidor");
    }
  }

  // ---------------- UI ----------------
  return (
    <div className="flex flex-col gap-6 p-6">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Novo Servidor</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCreateServidor} className="space-y-6">
            <Tabs defaultValue="basicos" className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
                <TabsTrigger value="basicos">Básicos</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="trabalho">Trabalho</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="outros">Outros</TabsTrigger>
              </TabsList>

              {/* ---------------- BASIC TAB ---------------- */}
              <TabsContent value="basicos" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nome</Label>
                      <Input value={usrNome} onChange={(e) => setUsrNome(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value={usrEmail} onChange={(e) => setUsrEmail(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label>CPF</Label>
                      <Input value={usrCpf} onChange={(e) => setUsrCpf(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label>Celular</Label>
                      <Input value={usrCelular} onChange={(e) => setUsrCelular(e.target.value)} required />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Data de Nascimento</Label>
                      <Input type="date" value={usrNascimento} onChange={(e) => setUsrNascimento(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Identidade</Label>
                      <Input value={usrIdentidade} onChange={(e) => setUsrIdentidade(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Orgão Emissor</Label>
                      <Input value={usrOrgEmissor} onChange={(e) => setUsrOrgEmissor(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Estado Civil</Label>
                      <Input value={usrEstCivil} onChange={(e) => setUsrEstCivil(e.target.value)} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ---------------- ADDRESS TAB ---------------- */}
              <TabsContent value="endereco" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Endereço</Label>
                      <Input value={usrEndereco} onChange={(e) => setUsrEndereco(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input value={usrCidade} onChange={(e) => setUsrCidade(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>CEP</Label>
                      <Input value={usrCep} onChange={(e) => setUsrCep(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Bairro</Label>
                      <Select onValueChange={(value) => setUsrBairro(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o bairro" />
                        </SelectTrigger>
                        <SelectContent>
                          {bairros.map((b) => (
                            <SelectItem key={b.baiId} value={String(b.baiId)}>
                              {b.baiDescricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Input value={usrEstado} onChange={(e) => setUsrEstado(e.target.value)} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ---------------- WORK TAB ---------------- */}
              <TabsContent value="trabalho" className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Matrícula</Label>
                      <Input value={usrMatricula} onChange={(e) => setUsrMatricula(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Secretaria</Label>
                      <Select onValueChange={(value) => setUsrSecretaria(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a secretaria" />
                        </SelectTrigger>
                        <SelectContent>
                          {secretarias.map((s) => (
                            <SelectItem key={s.secId} value={String(s.secId)}>
                              {s.secDescricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Data de Admissão</Label>
                      <Input type="date" value={usrAdmissao} onChange={(e) => setUsrAdmissao(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Cargo</Label>
                      <Select onValueChange={(value) => setUsrCargo(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                        <SelectContent>
                          {cargos.map((c) => (
                            <SelectItem key={c.crgId} value={String(c.crgId)}>
                              {c.crgDescricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Salário Líquido</Label>
                      <Input value={usrSalLiquido} onChange={(e) => setUsrSalLiquido(e.target.value)} />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* ---------------- SUBMIT ---------------- */}
            <div className="flex justify-end pt-6">
              <Button type="submit" className="min-w-[200px]">
                Salvar Servidor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
