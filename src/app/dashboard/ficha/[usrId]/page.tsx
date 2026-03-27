"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";
import "moment/locale/pt-br";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowLeft } from "lucide-react";

import {api} from "@/lib/api";

(pdfMake as any).vfs = pdfFonts.vfs;

// ================== TIPOS ==================

interface Filho {
  filId: number;
  filNome: string;
  filNascimento: string;
}

interface Usuario {
  usrNome: string;
  usrEmail: string;
  usrCartao: string;
  usrCelular: string;
  usrCpf: string;
  usrMatricula: string;
  usrSecretaria: string;
  usrNascimento: string;
  usrTipCadastro: string;
  usrDatCadastro: string;
  usrIdentidade: string;
  usrOrgEmissor: string;
  usrEstCivil: string;
  usrEndereco: string;
  usrCidade: string;
  usrEstado: string;
  usrCep: string;
  usrFonResid: string;
  usrTrabalho: string;
  usrAdmissao: string;
  usrSalLiquido: number;
  usrSalBruto: number;
  usrSalBase: number;
  usrTipContrato: string;
  usrFonTrabalho: string;
  usrCargo: string;
  usrConjuge: string;
  usrNasConjuge: string;
  usrObsBloqueio: string;
  usrPai: string;
  usrMae: string;

  secDescricao: string;
  orgDescricao: string;
  crgDescricao: string;
  baiDescricao: string;
  tipDescricao: string;
}

import type { TDocumentDefinitions } from "pdfmake/interfaces";

// ================== PAGE ==================

export default function ImpFichaPage() {
  const router = useRouter();
  const params = useParams();
  const usrId = params?.usrId as string;

  const [user, setUser] = useState<Usuario | null>(null);
  const [filhos, setFilhos] = useState<Filho[]>([]);
  const [limite, setLimite] = useState(0);

  // ================== BUSCA DADOS ==================

  useEffect(() => {
    async function load() {
      const response = await api.get(`searchUser/${usrId}`);
      const data = response.data[0];

      setUser(data);

      const limiteCredito = (data.usrSalLiquido * 30) / 100;
      setLimite(limiteCredito);

      const filhosResponse = await api.get(`filiacao/${usrId}`);
      setFilhos(filhosResponse.data);
    }

    load();
  }, [usrId]);

  // ================== PDF ==================

  function gerarPdf(): void {
  if (!user) return;

  const filhosTabela = filhos.map((fil: Filho) => [
    { text: fil.filId, fontSize: 8 },
    { text: fil.filNome, fontSize: 8 },
    {
      text: moment(fil.filNascimento).locale("pt-br").format("L"),
      fontSize: 8,
    },
  ]);

  const docDefinition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [15, 50, 15, 40],
    defaultStyle: {
      fontSize: 10,
      lineHeight: 1.4, // aumenta a altura das linhas
    },

    content: [
      {
        text: "FICHA CADASTRAL DE FILIAÇÃO",
        fontSize: 15,
        bold: true,
        margin: [0, 0, 0, 20],
        alignment: "center",
      },

      // ================== DADOS PRINCIPAIS ==================

      {
        table: {
          widths: ["70%", "30%"],
          body: [
            [
              {
                text: `Nome Servidor(a): ${user.usrNome}`,
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 0],
              },
              {
                text: `Nº: ${user.usrCartao}`,
                fontSize: 12,
                bold: true,
                margin: [0, 10, 0, 0],
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["70%", "30%"],
          heights:[20],
          body: [
            [
              { text: `Email: ${user.usrEmail}`, fontSize: 9 },
              {
                text: `Data Cadastro: ${moment(user.usrDatCadastro)
                  .locale("pt-br")
                  .format("L")}`,
                fontSize: 9,
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["70%", "30%"],
          heights:[20],
          body: [
            [
              { text: `Matricula: ${user.usrMatricula}`, fontSize: 9 },
              { text: `CPF: ${user.usrCpf}`, fontSize: 9 },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["70%", "30%"],
          heights:[20],
          body: [
            [
              {
                text: `RG: ${user.usrIdentidade} - ${user.usrOrgEmissor}`,
                fontSize: 9,
              },
              {
                text: `Nascimento: ${moment(user.usrNascimento)
                  .locale("pt-br")
                  .format("L")}`,
                fontSize: 9,
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["20%", "50%", "30%"],
          heights:[20],
          body: [
            [
              { text: `Estado Civil: ${user.usrEstCivil}`, fontSize: 9 },
              { text: `Conjuge: ${user.usrConjuge}`, fontSize: 9 },
              {
                text: `Nasc Conjuge: ${moment(user.usrNasConjuge)
                  .locale("pt-br")
                  .format("L")}`,
                fontSize: 9,
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["50%", "50%"],
          heights:[20],
          body: [
            [
              { text: `Pai: ${user.usrPai}`, fontSize: 9 },
              { text: `Mãe: ${user.usrMae}`, fontSize: 9 },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["100%"],
          heights:[20],
          body: [[{ text: `Logradouro: ${user.usrEndereco}`, fontSize: 9 }]],
        },
      },

      {
        table: {
          widths: ["70%", "30%"],
          heights:[20],
          body: [
            [
              { text: `Bairro: ${user.baiDescricao}`, fontSize: 9 },
              { text: `CEP: ${user.usrCep}`, fontSize: 9 },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["70%", "30%"],
          heights:[20],
          body: [
            [
              { text: `Cidade: ${user.usrCidade}`, fontSize: 9 },
              { text: `Estado: ${user.usrEstado}`, fontSize: 9 },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["50%", "50%"],
          heights:[20],
          body: [
            [
              { text: `Telefone Residencial: ${user.usrFonResid}`, fontSize: 9 },
              { text: `Celular: ${user.usrCelular}`, fontSize: 9 },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["50%", "50%"],
          heights:[20],
          body: [
            [
              {
                text: `Tipo de Contrato: ${user.usrTipContrato} - ${user.tipDescricao}`,
                fontSize: 9,
              },
              { text: `Tipo Cadastro: ${user.usrTipCadastro}`, fontSize: 9 },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["50%", "50%"],
          heights:[20],
          body: [
            [
              { text: `Orgão Administrativo: ${user.orgDescricao}`, fontSize: 9 },
              { text: `Secretaria: ${user.secDescricao}`, fontSize: 9 },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["50%", "50%"],
          heights:[20],
          body: [
            [
              { text: `Cargo: ${user.crgDescricao}`, fontSize: 9 },
              { text: `Local Trabalho: ${user.usrTrabalho}`, fontSize: 9 },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["50%", "50%"],
          heights:[20],
          body: [
            [
              { text: `Telefone Trabalho: ${user.usrFonTrabalho}`, fontSize: 9 },
              {
                text: `Data Admissão: ${moment(user.usrAdmissao)
                  .locale("pt-br")
                  .format("L")}`,
                fontSize: 9,
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["25%", "25%", "25%", "25%"],
          heights:[20],
          body: [
            [
              {
                text: `Salario Bruto: ${Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(user.usrSalBruto)}`,
                fontSize: 9,
              },
              {
                text: `Salario Base: ${Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(user.usrSalBase)}`,
                fontSize: 9,
              },
              {
                text: `Salario Liquido: ${Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(user.usrSalLiquido)}`,
                fontSize: 9,
              },
              {
                text: `Limite Crédito: ${Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(limite)}`,
                fontSize: 9,
              },
            ],
          ],
        },
      },

      // ================== DEPENDENTES ==================

      {
        text: "DEPENDENTES",
        bold: true,
        margin: [0, 10, 0, 0],
      },

      {
        table: {
          widths: ["10%", "70%", "20%"],
          body: [
            [
              { text: "ID", fontSize: 9, bold: true },
              { text: "Nome do Dependente", fontSize: 9, bold: true },
              { text: "Nascimento", fontSize: 9, bold: true },
            ],
            ...filhosTabela,
          ],
        },
      },

      // ================== OBSERVAÇÕES ==================

      {
        text: "OBSERVAÇÕES", 
        bold: true,
        margin: [0, 10, 0, 0],
      },
      

      {
        table: {
          widths: ["100%"],
          body: [
            [
              {
                text: "1. Anexar cópia dos seguintes documentos CPF, RG, Comprovante de endereço atualizado e Contracheque.",
                fontSize: 9,
                bold: true,
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["100%"],
          body: [
            [
              {
                text: "2. Autorizo desconto em folha da contribuição sindical conforme estatuto do Sindicaldas.",
                fontSize: 9,
                bold: true,
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["100%"],
          body: [
            [
              {
                text: "3. Participam dos benefícios oferecidos pelo Sindicaldas os filiados que estejam em dia com suas contribuições.",
                fontSize: 9,
                bold: true,
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["100%"],
          body: [
            [
              {
                text: "4. Autorizo desconto da contribuição sindical mesmo estando de Licença Médica.",
                fontSize: 9,
                bold: true,
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["100%"],
          heights:[30],
          body: [
            [
              {
                text: "Caldas Novas, ______ de __________________________ de 20 ___________",
                fontSize: 9,
                bold: true,
                margin: [0, 15, 0, 0],
              },
            ],
          ],
        },
      },

      {
        table: {
          widths: ["50%"],
          body: [[{ text: "", border: [false, false, false, true] }]],
        },
      },

      {
        text: "Servidor",
        alignment: "center",
        fontSize: 9,
        bold: true,
        margin: [0, 5, 0, 0],
      },
    ],
  };

  pdfMake.createPdf(docDefinition).open();
}

  // ================== UI ==================

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
  {/* Botão voltar */}
  <div className="w-full max-w-3xl mb-6 flex items-center">
    <Button
      variant="ghost"
      className="flex items-center gap-2"
      onClick={() => router.back()}
    >
      <ArrowLeft size={18} />
      Voltar
    </Button>
  </div>

  {/* Card principal responsivo */}
  <Card className="w-full max-w-3xl shadow-xl rounded-2xl border border-gray-200">
    <CardContent className="flex flex-col items-center justify-center gap-6 py-10 px-6 sm:px-10">
      <FileText size={48} className="text-blue-600" />

      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Gerar Ficha de Filiação
      </h2>

      {/* Dados do usuário */}
      <div className="w-full bg-gray-100 rounded-lg p-4 text-center shadow-inner">
        <p className="text-gray-700 font-medium">
          <span className="font-semibold">Nome:</span> {user?.usrNome || "—"}
        </p>
        <p className="text-gray-700 font-medium mt-1">
          <span className="font-semibold">Cartão:</span> {user?.usrCartao || "—"}
        </p>
      </div>

      {/* Botão gerar PDF */}
      <Button size="lg" className="w-full mt-4" onClick={gerarPdf}>
        Abrir PDF
      </Button>
    </CardContent>
  </Card>
</div>
  );
}

