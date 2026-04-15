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
  const [usrCartao, setUsrCartao] = useState("");
  const [usrCelular, setUsrCelular] = useState("");
  const [usrNascimento, setUsrNascimento] = useState("");
  const [usrIdentidade, setUsrIdentidade] = useState("");
  const [usrOrgEmissor, setUsrOrgEmissor] = useState("");
  const [usrEstCivil, setUsrEstCivil] = useState("");
  const [usrTipCadastro, setUsrTipCadastro] = useState("");
  const [usrPassword, setUsrPassword] = useState("");
  const [usrConjuge, setUsrConjuge] = useState("");
  const [usrNasConjuge, setUsrNasConjuge] = useState("");
  const [usrPai, setUsrPai] = useState("");
  const [usrMae, setUsrMae] = useState("");

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
  const [usrSalBruto, setUsrSalBruto] = useState("");
  const [usrSalBase, setUsrSalBase] = useState("");
  const [usrFonResid, setUsrFonResid] = useState("");
  const [usrTrabalho, setUsrTrabalho] = useState("");
  const [usrTipContrato, setUsrTipContrato] = useState("");
  const [usrFonTrabalho, setUsrFonTrabalho] = useState("");

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
        usrCartao,
        usrCelular,
        usrCpf,
        usrMatricula,
        usrSecretaria,
        usrNascimento,
        usrTipCadastro,
        usrIdentidade,
        usrOrgEmissor,
        usrEstCivil,
        usrEndereco,
        usrBairro,
        usrCidade,
        usrEstado,
        usrCep,
        usrFonResid,
        usrTrabalho,
        usrAdmissao,
        usrSalLiquido,
        usrSalBase,
        usrSalBruto,
        usrPassword,
        usrTipContrato,
        usrFonTrabalho,
        usrCargo,
        usrConjuge,
        usrNasConjuge,
        usrPai,
        usrMae,
      });

      alert("Servidor cadastrado com sucesso!");
      router.back();
    } catch (error) {
      alert("Erro ao cadastrar servidor");
    }
  }

  // ---------------- UI ----------------
  return (
  <div className="flex flex-col gap-6 p-6 w-full min-h-screen bg-gray-50">

    <Card className="w-full min-h-[85vh] rounded-2xl shadow-sm border bg-white">
      
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-purple-800">
          Cadastro do Servidor(a)
        </CardTitle>
      </CardHeader>

      <CardContent className="bg-gray-50 rounded-b-2xl">
        <form onSubmit={handleCreateServidor} className="space-y-8">

          <Tabs defaultValue="basicos" className="w-full">

            {/* TABS */}
            <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full bg-white">
              <TabsTrigger value="basicos">Básicos</TabsTrigger>
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="trabalho">Trabalho</TabsTrigger>
            </TabsList>

            {/* ================= BASICOS ================= */}
            <TabsContent value="basicos" className="pt-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* DADOS PESSOAIS */}
                <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Dados Pessoais
                  </h3>

                  <Input placeholder="Nome completo" value={usrNome} onChange={(e) => setUsrNome(e.target.value)} />
                  <Input placeholder="Email" value={usrEmail} onChange={(e) => setUsrEmail(e.target.value)} />

                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="CPF" value={usrCpf} onChange={(e) => setUsrCpf(e.target.value)} />
                    <Input placeholder="Celular" value={usrCelular} onChange={(e) => setUsrCelular(e.target.value)} />
                  </div>
                </div>

                {/* DOCUMENTOS */}
                <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Documentos
                  </h3>
                  <h3 className="text-sm font-normal text-gray-500 ">
                    Data de Nascimento
                  </h3>
                  <Input type="date" value={usrNascimento} onChange={(e) => setUsrNascimento(e.target.value)} />

                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Identidade" value={usrIdentidade} onChange={(e) => setUsrIdentidade(e.target.value)} />
                    <Input placeholder="Orgão Emissor" value={usrOrgEmissor} onChange={(e) => setUsrOrgEmissor(e.target.value)} />
                  </div>

                  <Input placeholder="Estado Civil" value={usrEstCivil} onChange={(e) => setUsrEstCivil(e.target.value)} />
                </div>

                {/* FAMILIA */}
                <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Família
                  </h3>

                  <Input placeholder="Cônjuge" value={usrConjuge} onChange={(e) => setUsrConjuge(e.target.value)} />
                  <h3 className="text-sm font-normal text-gray-500 ">
                    Nascimento Cônjuge
                  </h3>
                  <Input type="date" value={usrNasConjuge} onChange={(e) => setUsrNasConjuge(e.target.value)} />

                  <Input placeholder="Tipo de Cadastro" value={usrTipCadastro} onChange={(e) => setUsrTipCadastro(e.target.value)} />

                  <div className="grid grid-cols-1 gap-3">
                    <Input placeholder="Pai" value={usrPai} onChange={(e) => setUsrPai(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <Input placeholder="Mãe" value={usrMae} onChange={(e) => setUsrMae(e.target.value)} />
                  </div>
                </div>

              </div>
            </TabsContent>

            {/* ================= ENDERECO ================= */}
            <TabsContent value="endereco" className="pt-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    Localização
                  </h3>

                  <Input placeholder="Endereço" value={usrEndereco} onChange={(e) => setUsrEndereco(e.target.value)} />
                  <Input placeholder="Cidade" value={usrCidade} onChange={(e) => setUsrCidade(e.target.value)} />

                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="CEP" value={usrCep} onChange={(e) => setUsrCep(e.target.value)} />
                    <Input placeholder="Estado" value={usrEstado} onChange={(e) => setUsrEstado(e.target.value)} />
                  </div>
                </div>

                <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    Bairro
                  </h3>
                  <Select onValueChange={(value) => setUsrBairro(value)}>
                    <SelectTrigger className="w-full h-11">
                      <SelectValue placeholder="Selecione o bairro" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {bairros.map((b) => (
                        <SelectItem key={b.baiId} value={String(b.baiId)}>
                          {b.baiDescricao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* ================= TRABALHO ================= */}
            <TabsContent value="trabalho" className="pt-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    Profissional
                  </h3>

                  <Input placeholder="Matrícula" value={usrMatricula} onChange={(e) => setUsrMatricula(e.target.value)} />

                  <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">
                      Secretaria
                    </h3>
                    <Select onValueChange={(value) => setUsrSecretaria(value)}>
                      <SelectTrigger className="w-full h-11 text-sm">
                        <SelectValue placeholder="Selecione a secretaria" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {secretarias.map((s) => (
                          <SelectItem key={s.secId} value={String(s.secId)}>
                            {s.secDescricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <h3 className="text-sm font-normal text-gray-500 ">
                    Data Admissão
                  </h3>
                  <Input type="date" value={usrAdmissao} onChange={(e) => setUsrAdmissao(e.target.value)} />
                </div>

                <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    Cargo e Salários
                  </h3>

                  <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase">
                      Cargo
                    </h3>
                    <Select onValueChange={(value) => setUsrCargo(value)}>
                      <SelectTrigger className="w-full h-11 text-sm">
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {cargos.map((c) => (
                          <SelectItem key={c.crgId} value={String(c.crgId)}>
                            {c.crgDescricao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input placeholder="Salário Líquido" value={usrSalLiquido} onChange={(e) => setUsrSalLiquido(e.target.value)} />
                  <Input placeholder="Salário Bruto" value={usrSalBruto} onChange={(e) => setUsrSalBruto(e.target.value)} />
                  <Input placeholder="Salário Base" value={usrSalBase} onChange={(e) => setUsrSalBase(e.target.value)} />
                </div>
                <div className="border rounded-xl p-5 space-y-4 bg-white shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    Acesso
                  </h3>

                  <Input placeholder="Cartão Servidor" value={usrCartao} onChange={(e) => setUsrCartao(e.target.value)} />
                  <Input type="password" placeholder="Senha" value={usrPassword} onChange={(e) => setUsrPassword(e.target.value)} />
                </div>

              </div>
            </TabsContent>

          </Tabs>

          {/* BOTÃO */}
          <div className="flex justify-end pt-6">
            <Button type="submit" className="min-w-[220px] h-11 text-base">
              Salvar Servidor
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>

  </div>
);
}
