"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {api } from "@/lib/api";

type Bairro = {
  baiId: string;
  baiDescricao: string;
};

export type Secretaria = {
  secId: string;
  secDescricao: string;
};
// -------- CARGO --------
export type Cargo = {
  crgId: string;
  crgDescricao: string;
};

// -------- TIPO DE CONTRATO --------
export type TipoContrato = {
  tipId: string;
  tipDescricao: string;
  tipParcelas?: string;
};

// -------- ORGÃO ADMINISTRATIVO --------
export type Orgao = {
  orgId: string;
  orgDescricao: string;
};

// -------- SERVIDOR --------
export type Servidor = {
  usrId: string;
  usrNome: string;
  usrCpf: string;
  usrCpfAntigo?: string;
  usrEndereco: string;
  usrNumero: string;
  usrBairro: string;
  usrTelefone: string;
  usrCelular: string;
  usrEmail: string;
  usrMatricula: string;
  usrCargo: string;
  usrSecretaria: string;
  usrTipoContrato: string;
};

// -------- FORM DE SERVIDOR --------
export type ServidorForm = {
  usrNome: string;
  usrCpf: string;
  usrCpfAntigo: string;
  usrEndereco: string;
  usrNumero: string;
  usrBairro: string;
  usrTelefone: string;
  usrCelular: string;
  usrEmail: string;
  usrMatricula: string;
  usrCargo: string;
  usrSecretaria: string;
  usrTipoContrato: string;
};

// -------- RESPOSTA PADRÃO DA API --------
export type ApiResponse<T> = {
  data: T;
};

export default function EditServidorPage() {
  const router = useRouter();
  const params = useParams();

  const [activeTab, setActiveTab] = useState("basicos");

  const [form, setForm] = useState({
    usrNome: "",
    usrEmail: "",
    usrCelular: "",
    usrCpf: "",
    usrNascimento: "",
    usrTipCadastro: "",
    usrIdentidade: "",
    usrOrgEmissor: "",
    usrEstCivil: "",
    usrConjuge: "",
    usrNasConjuge: "",

    usrEndereco: "",
    usrCidade: "",
    usrEstado: "",
    usrCep: "",
    usrBairro: "",
    usrFonResid: "",

    usrMatricula: "",
    usrTrabalho: "",
    usrSecretaria: "",
    usrAdmissao: "",
    usrSalLiquido: "",
    usrSalBruto: "",
    usrSalBase: "",
    usrTipContrato: "",
    usrFonTrabalho: "",
    usrCargo: "",

    usrCartao: "",
    usrObsBloqueio: "",

    usrPai: "",
    usrMae: "",
  });

  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [tipos, setTipos] = useState([]);
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [parametros, setParametros] = useState([]);
  const [seqcartao, setSeqCartao] = useState('');

  const [usrCartao, setUsrCartao] = useState("");

  const $arr_alfa = ["1828","9283","2837","8374","3746","7465","4650","6502","5029","0291","2918","9183","1837","8374","3746","7465","4653","6539","5391","3918","9182","1827","8274","2745","7456","4568","5682","6821","8211","2191","1918", "2755"];
  var nroCartao = '';

  useEffect(() => {
    const id = params?.usrId;

    if (!id) return;

    api.get(`searchUser/${id}`).then((res) => {
      const u = res.data[0];
      setForm((prev) => ({ ...prev, ...u }));
    });

    api.get("secretarias").then((r) => setSecretarias(r.data));
    api.get("cargos").then((r) => setCargos(r.data));
    api.get("bairros").then((r) => setBairros(r.data));
    api.get("tipos").then((r) => setTipos(r.data));
  }, [params]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSelect(name: keyof typeof form, value: string) {
    setForm({ ...form, [name]: value });    
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    api.put(`altservidor/${params.usrId}`, form).then(() => {
        alert("Servidor alterado com sucesso!");
        router.back();
    });
  }

  async function handleCartao() {
    if (usrCartao) return;

    api.get(`parametros`).then(response => {
      setParametros(response.data);
      setSeqCartao(response.data[0].parSeqCartao);

      let newDate = new Date()
      let $_dia = newDate.getDate();
      let parInicial = '8321';
      let parSecundary = $arr_alfa[$_dia];
      let parFinal = parseInt(response.data[0].parSeqCartao);
      let nroCartao = parInicial + parSecundary + parFinal;
      setUsrCartao(nroCartao);
      setForm((prev) => ({
        ...prev,
        usrCartao: nroCartao,
      }));
      console.log(response.data[0].parSeqCartao);
      console.log(nroCartao);
    })
  }
  
  return (
    <div className="p-6">
      <Card className="shadow-lg rounded-2xl">
        <CardContent className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Editar Servidor</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="basicos">Básicos</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="trabalho">Trabalho</TabsTrigger>
                <TabsTrigger value="operacional">Operacional</TabsTrigger>
                <TabsTrigger value="filiacao">Filiação</TabsTrigger>
              </TabsList>

              {/* BASICOS */}
              <TabsContent value="basicos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Nome</Label>
                      <Input name="usrNome" value={form.usrNome} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input name="usrEmail" value={form.usrEmail} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Nascimento</Label>
                      <Input
                        type="date"
                        name="usrNascimento"
                        value={form.usrNascimento}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <Label>Celular</Label>
                      <Input name="usrCelular" value={form.usrCelular} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Tipo Cadastro</Label>
                      <Input name="usrTipCadastro" value={form.usrTipCadastro} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>CPF</Label>
                      <Input name="usrCpf" value={form.usrCpf} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Identidade</Label>
                      <Input name="usrIdentidade" value={form.usrIdentidade} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Órgão Emissor</Label>
                      <Input name="usrOrgEmissor" value={form.usrOrgEmissor} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Estado Civil</Label>
                      <Input name="usrEstCivil" value={form.usrEstCivil} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Cônjuge</Label>
                      <Input name="usrConjuge" value={form.usrConjuge} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ENDERECO */}
              <TabsContent value="endereco">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Endereço</Label>
                      <Input name="usrEndereco" value={form.usrEndereco} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Cidade</Label>
                      <Input name="usrCidade" value={form.usrCidade} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>CEP</Label>
                      <Input name="usrCep" value={form.usrCep} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Bairro</Label>
                      <Select value={form.usrBairro} onValueChange={(v) => handleSelect("usrBairro", v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            {bairros.map((b) => (
                                <SelectItem key={b.baiId} value={b.baiId}>
                                    {b.baiDescricao}
                                </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Estado</Label>
                      <Input name="usrEstado" value={form.usrEstado} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Fone Residencial</Label>
                      <Input name="usrFonResid" value={form.usrFonResid} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TRABALHO */}
              <TabsContent value="trabalho">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Matrícula</Label>
                      <Input name="usrMatricula" value={form.usrMatricula} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Secretaria</Label>
                      <Select value={form.usrSecretaria} onValueChange={(v) => handleSelect("usrSecretaria", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {secretarias.map((s) => (
                            <SelectItem key={s.secId} value={s.secId}>
                              {s.secDescricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Data Admissão</Label>
                      <Input
                        type="date"
                        name="usrAdmissao"
                        value={form.usrAdmissao}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Cargo</Label>
                      <Select value={form.usrCargo} onValueChange={(v) => handleSelect("usrCargo", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {cargos.map((c) => (
                            <SelectItem key={c.crgId} value={c.crgId}>
                              {c.crgDescricao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Salário Líquido</Label>
                      <Input name="usrSalLiquido" value={form.usrSalLiquido} onChange={handleChange} />
                    </div>

                    <div>
                      <Label>Salário Bruto</Label>
                      <Input name="usrSalBruto" value={form.usrSalBruto} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* OPERACIONAL */}
              <TabsContent value="operacional">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Cartão Servidor</Label>
                      <Input placeholder="Cartão Servidor" value={form.usrCartao || ""} onChange={handleChange} />
                      <Button
                        type="button"
                        onClick={handleCartao}
                        disabled={!!form.usrCartao}
                      >
                        Gerar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Observação de Bloqueio</Label>
                      <Input
                        name="usrObsBloqueio"
                        value={form.usrObsBloqueio}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* FILIACAO */}
              <TabsContent value="filiacao">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Pai</Label>
                    <Input name="usrPai" value={form.usrPai} onChange={handleChange} />
                  </div>

                  <div>
                    <Label>Mãe</Label>
                    <Input name="usrMae" value={form.usrMae} onChange={handleChange} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Button className="w-full md:w-auto" type="submit">
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
