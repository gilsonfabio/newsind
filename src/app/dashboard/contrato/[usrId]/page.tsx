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
import { api } from "@/lib/api";

(pdfMake as any).vfs = pdfFonts.vfs;

interface Servidor {
  usrNome: string;
  usrIdentidade: string;
  usrOrgEmissor: string;
  usrCpf: string;
  usrMatricula: string;
  crgDescricao: string;
  usrTrabalho: string;
  usrEndereco: string;
  baiDescricao: string;
  usrCep: string;
  usrCelular: string;
  orgDescricao: string;
  usrTipContrato: string;
  secDescricao: string;
}

export default function PdfCnvContrato() {
  const router = useRouter();
  const [servidor, setServidor] = useState<Servidor | null>(null);
  const params = useParams();

  const dateNow = moment();
  const dia = dateNow.format("DD");
  const mes = dateNow.format("MMMM");
  const ano = dateNow.format("YYYY");

  useEffect(() => {
    const srvId = params.usrId;
    api.get(`pdfSrvContrato/${srvId}`).then((resp) => {
      setServidor(resp.data);
    });
  }, [params]);

  const emitePdf = () => {
    if (!servidor) return;

    const docDefinition: any = {
      pageSize: "A4",
      pageMargins: [15, 50, 15, 40],
      content: [
        {
          text: "CONTRATO DE CONVÊNIO/AUTORIZAÇÃO DE DESCONTO EM FOLHA DE PAGAMENTO.\n\n",
          fontSize: 15,
          bold: true,
          alignment: "center",
        },
        {
          text: [
            "CONTRATO DE CONVÊNIO para utilização do Cartão CALDASCARD que entre si fazem A Associação Cultural, Esportiva e Social",
            "dos Servidores Públicos Municipais de Caldas Novas e o Servidor Público estável, Comissionado/Contratado adiante qualificado.\n\n",
            "Por este instrumento que fazem de um lado, como CONTRATADO a Associação Cultural, Esportiva e Social dos Servidores Públicos",
            " Municipais de Caldas Novas, do Estado de Goiás, com sede nesta cidade, a Avenida E, Quadra AI 04, Lote 01, Estância Itanhangá I, ",
            "inscrita no CNPJ sob o nº.: 33458971000139, neste ato representada por sua diretora Financeira ",
            { text: "ROSIMEIRE PEREIRA MARTINS", fontSize: 12, bold: true },
            ", brasileiro, solteira, servidor público, portador no RG nº.: 3254870, CPF nº.:624.087.801-44 ; ao qual gerenciará a consignação dos filiados do a  ",
            { text: "SINDICATO DOS SERVIDORES PÚBLICOS MUNICIPAIS DE CALDAS NOVAS - SINDICALDAS ", fontSize: 12 },
            ", entidade sindical sem fins lucrativos, inscrita no CNPJ sob o número 00.619.564/0001-07, com sede na Av.E, Qd AI 04 LT 01 Estancia Itanhanga I,",
            " Cep 75680-368 - Caldas Novas- Goiás, por meio de seu Presidente, nos termos do Estatuto Social e ata de eleição e posse que possam fazer parte ",
            "integrante do presente instrumento, representado, pelo presidente, senhor ",
            { text: "EURÍPEDES ISRAEL DE MORAIS ", fontSize: 12, bold: true },
            ", brasileiro, casado, servidor público, inscrito no CPF: 228.434.691.04, portador da cédula de identidade nº 1145789 SSP/GO, e de outro lado, ",
            "como CONTRATANTE, o servidor público municipal, efetivo/não efetivo, e em exercício de cargo comissionado/contratado a seguir qualificado:\n\n",
          ],
        },
        { text: `Nome do Servidor: ${servidor.usrNome}\n\n`, fontSize: 10 },
        {
          text: `Nº Identidade: ${servidor.usrIdentidade} / Orgão Emissor: ${servidor.usrOrgEmissor} / Nº CPF: ${servidor.usrCpf}\n\n`,
          fontSize: 10,
        },
        {
          text: `Matricula: ${servidor.usrMatricula} / Cargo: ${servidor.crgDescricao} / Lotação: ${servidor.usrTrabalho} / Orgão Adm: ${servidor.orgDescricao} / ${servidor.secDescricao}\n\n`,
          fontSize: 10,
        },
        {
          text: `Endereço: ${servidor.usrEndereco} / Bairro: ${servidor.baiDescricao} / Cep: ${servidor.usrCep}\n\n`,
          fontSize: 10,
        },
        { text: `Telefones: ${servidor.usrCelular}\n\n`, fontSize: 10 },
        { text: "Com base nas normas legais vigentes, ajustam e celebram entre si o presente contrato, regendo-se o mesmo pelas cláusulas e condições seguintes:\n\n", fontSize: 10 },
      ],
    };

    // ========================== CLÁUSULAS ==========================
    const clausulas = [
      {
        title: "Cláusula primeira – ",
        content: [
          "A Associação por meio deste, se obriga a fornecer o Cartão CALDASCARD para operações de crédito nos estabelecimentos conveniados com a Associação Cultural,",
          "Esportiva e Social dos Servidores Públicos Municipais de Caldas Novas.\n\n",
          { text: "Parágrafo 1º", fontSize: 10, bold: true },
          ": A Associação poderá conferir ao CONTRATANTE um crédito de até 30% (trinta por cento) do salário-liquido, aferido pelo último demonstrativo de pagamento salarial,",
          "no sistema parcelado e em caso de comprometimento deste percentual, poderá por analise da administradora, conceder mais 15% (quinze por cento) no sistema rotativo",
          "(uma vez) para compra exclusiva de alimentos, remédios e itens de primeira necessidade, conforme regras do estatuto sindical.\n\n",
          { text: "Parágrafo 2º", fontSize: 10, bold: true },
          ": O CONTRATANTE (servidor público) autoriza o desconto em folha de pagamento...",
        ],
      },
      // Continue adicionando todas as cláusulas aqui seguindo o mesmo padrão...
    ];

    clausulas.forEach((cl) => {
      docDefinition.content.push({ text: cl.title, fontSize: 10, bold: true });
      cl.content.forEach((c) => docDefinition.content.push(typeof c === "string" ? { text: c, fontSize: 10 } : c));
    });

    // ========================== PARTE FINAL ==========================
    docDefinition.content.push(
      { text: "Testemunha 1: _________________________________ CPF:______________________", fontSize: 10, margin: [0, 5, 0, 5] },
      { text: "Testemunha 2: _________________________________ CPF:______________________", fontSize: 10, margin: [0, 5, 0, 20] },
    );

    // ========================== PARTE FINAL ==========================
    
    docDefinition.content.push(
      // Forçar quebra de página antes da nota promissória
      { text: '', pageBreak: 'before' },

      // Nota promissória na segunda página
      { text: "Vencimento: _________de ______________de ___________", fontSize: 12, bold: true, alignment: "right", margin: [0, 0, 0, 10] },
      { text: "Nº _________________                                                                                                   R$:________________________", fontSize: 12, bold: true, margin: [0, 0, 0, 20] },

      { text: "No dia _    _______ __________________________________________de____________________________________de", fontSize: 10, margin: [0, 0, 0, 5] },
      { text: "_____________________________ pagar ________ por esta única via de NOTA PROMISSÓRIA a Associação", fontSize: 10, margin: [0, 0, 0, 5] },
      { text: "Cultural,   Esportiva   e   Social   dos   Servidores   Públicos   Municipais  de  Caldas  Novas  CPF/CNPJ", fontSize: 10, alignment: "justify", margin: [0, 0, 0, 5] },
      { text: "33.458.971/0001-39 ou à sua ordem, a quantia de _____________________________________________________", fontSize: 10, margin: [0, 0, 0, 5] },
      { text: "em moeda corrente deste país, pagável em ____________________________________________________________", fontSize: 10, margin: [0, 0, 0, 5] },
      { text: "Emitente:__________________________________________                       Data de Emissão: ______/______/_______", fontSize: 10, margin: [0, 0, 0, 5] },
      { text: "CPF/CNPJ:__________________________________Endereço:________________________________________________", fontSize: 10, margin: [0, 0, 0, 5] },
      { text: "_______________________________________________________________________________________________________", fontSize: 10, margin: [0, 0, 0, 20] },
      { text: "Ass.do emitente__________________________________________", fontSize: 10, alignment: "center", margin: [0, 0, 0, 5] }
    );

    pdfMake.createPdf(docDefinition).open();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Botão voltar */}
      <div className="w-full max-w-3xl mb-6 flex items-center">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.back()}
        >
          {/* Ícone de voltar */}
          <ArrowLeft size={18} />
          Voltar
        </Button>
      </div>

      {/* Card principal responsivo */}
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl border border-gray-200">
        <CardContent className="flex flex-col items-center justify-center gap-6 py-10 px-6 sm:px-10">
          {/* Ícone do arquivo */}
          <FileText size={48} className="text-blue-600" />

          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Abrir Contrato PDF
          </h2>

          {/* Dados do usuário */}
          <div className="w-full bg-gray-100 rounded-lg p-4 text-center shadow-inner">
            <p className="text-gray-700 font-medium">
              <span className="font-semibold">Nome:</span> {servidor?.usrNome || "—"}
            </p>
            <p className="text-gray-700 font-medium mt-1">
              <span className="font-semibold">Matricula:</span> {servidor?.usrMatricula || "—"}
            </p>
          </div>

          {/* Botão gerar PDF */}
          <Button size="lg" className="w-full mt-4" onClick={emitePdf}>
            Abrir PDF Contrato
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
