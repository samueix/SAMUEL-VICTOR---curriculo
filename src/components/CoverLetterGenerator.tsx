import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText, Building, Sparkles } from 'lucide-react';
import { PersonalInfo } from '../types';

interface CoverLetterGeneratorProps {
  personalInfo: PersonalInfo;
}

export default function CoverLetterGenerator({ personalInfo }: CoverLetterGeneratorProps) {
  const [companyName, setCompanyName] = useState('');
  const [roleName, setRoleName] = useState('Analista de Suporte de TI');
  const [focusArea, setFocusArea] = useState('general_curriculo');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const company = companyName ? companyName : 'sua renomada empresa';
    const role = roleName ? roleName : 'Analista de TI';
    
    let bodyText = '';

    if (focusArea === 'suporte_redes') {
      bodyText = `Com mais de ${personalInfo.experienceYears} anos de sólida experiência na área de tecnologia, sendo grande parte desse tempo dedicado ao suporte N1/N2 e à infraestrutura de redes na LINKCE TELECOM, desenvolvi um perfil altamente técnico e resolutivo. Tenho sólida vivência em roteamento TCP/IP, configurações de switches, gerenciamento de chamados sob padrões de service desk, e atendimento qualificado ao usuário final.`;
    } else if (focusArea === 'redes_infra') {
      bodyText = `Ao longo da minha trajetória, especializei-me no diagnóstico físico e lógico de ativos de rede. Minhas certificações como Ubiquiti Enterprise Wireless Admin (UEWA) e capacitações em infraestrutura de Fibra Óptica FTTH me qualificam para projetar, instalar e gerenciar redes Wi-Fi e cabeamento estruturado com alto nível de imunidade a ruídos e máxima performance corporativa.`;
    } else if (focusArea === 'admin_ops') {
      bodyText = `Ao longo da minha carreira, desenvolvi uma forte aptidão para a organização de fluxos operacionais, otimização de rotinas de trabalho e gestão de informações cruciais. Minha sólida familiaridade com ferramentas de escritório (como planilhas inteligentes, relatórios e painéis dinâmicos), aliada à facilidade de aprender novos sistemas e à disciplina no controle de demandas, me capacita a organizar atividades administrativas com foco absoluto em produtividade, conformidade e redução de gargalos na operação.`;
    } else {
      bodyText = `Atualmente cursando Tecnólogo em Cibersegurança (em andamento) na Uniasselvi, busco sempre alinhar o suporte técnico operacional às melhores práticas de governança de TI (ITIL v4) e diretrizes de conformidade da LGPD. Minha proatividade e foco na resolução de incidentes no primeiro contato (FCR) garantem que a infraestrutura tecnológica trabalhe em plena sintonia com os objetivos de produtividade do negócio.`;
    }

    let template = '';

    if (focusArea === 'general_curriculo') {
      template = `Prezada equipe de Seleção,

Gostaria de manifestar meu forte interesse em fazer parte de sua equipe e contribuir para o crescimento de sua organização. Apresento um currículo amplo e de destaque, com sólido histórico de ${personalInfo.experienceYears} anos de atuação profissional, englobando as áreas de suporte técnico de TI N1/N2, infraestrutura de redes locais e de telecomunicação, além de excelente aptidão para rotinas operacionais e administrativas.

Acredito que a combinação da minha bagagem prática — incluindo certificações profissionais de destaque como Ubiquiti Enterprise Wireless Admin (UEWA) — com meu compromisso em otimizar fluxos de trabalho e elevar a eficiência operacional me torna um candidato altamente capacitado a gerar valor de forma imediata para o negócio. Minhas experiências anteriores, tanto em ambiente corporativo como no desenvolvimento de soluções e projetos freelancer de redes, comprovam minha flexibilidade de atuação e excelência no diagnóstico rápido de incidentes.

Busco uma oportunidade onde possa empregar minha dedicação, disciplina organizacional e proatividade. Possuo carteira de habilitação (${personalInfo.cnh}), aberto a novas oportunidades (${personalInfo.availability}), com possibilidade de atuação presencial (${personalInfo.location}), híbrida ou remota.

Estou à inteira disposição para uma entrevista, onde poderei detalhar minhas competências práticas e como meu portfólio de qualificações pode suprir as demandas atuais do seu time.

Agradeço imensamente pela leitura do meu perfil e pela consideração de minha candidatura.

Atenciosamente,
${personalInfo.fullName}
${personalInfo.email} | ${personalInfo.phone}`;
    } else {
      template = `Prezada equipe de Recrutamento da ${company},

Gostaria de manifestar meu forte interesse na oportunidade para a vaga de ${role}. Acompanho a atuação de mercado da ${company} e acredito que meu perfil proativo, técnico e focado em soluções ágeis de tecnologia esteja em perfeita harmonia com os valores e demandas de sua equipe.

${bodyText}

Acredito que posso contribuir de forma imediata para otimizar os processos de suporte, garantir a estabilidade da infraestrutura e prover uma experiência de atendimento excepcional para os colaboradores e clientes da ${company}.

Estou à total disposição para agendarmos uma entrevista, onde poderei detalhar minhas qualificações práticas e como posso somar ao seu time de TI. Possuo CNH (${personalInfo.cnh}) e total disponibilidade para atuação (${personalInfo.location}, presencial, híbrido ou remoto).

Agradeço a atenção e consideração.

Atenciosamente,
${personalInfo.fullName}
${personalInfo.email} | ${personalInfo.phone}`;
    }

    setGeneratedLetter(template);
    setCopied(false);
  };

  useEffect(() => {
    handleGenerate();
  }, [companyName, roleName, focusArea]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E6E1D6] p-6 sm:p-8 rounded-[12px] hover:shadow-[4px_4px_0px_#0F766E] transition-all duration-200">
      <div className="flex items-center gap-3 mb-2 pb-3 border-b border-[#E6E1D6]">
        <div className="w-9 h-9 rounded-full bg-[#F1EEE6] flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />
        </div>
        <h3 className="font-display text-lg sm:text-xl font-bold text-[#1B2430]">
          Gerador de Carta de Apresentação
        </h3>
      </div>
      
      <p className="text-sm text-[#4A5565] mb-6 max-w-2xl leading-relaxed font-medium">
        Personalize o pitch profissional informando a empresa e o cargo pretendido para estruturar as qualificações conforme a necessidade de contratação.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1B2430] flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />
              Nome da Empresa
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ex: Linkce Telecom / Empresa X"
              className="w-full bg-[#FFFFFF] border border-[#E6E1D6] rounded-[8px] px-3.5 py-2.5 text-[#1B2430] placeholder-[#4A5565]/60 text-sm font-medium focus:outline-none focus:border-[#0F766E] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1B2430] block">
              Cargo Pretendido
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Ex: Analista de Redes / Suporte N2"
              className="w-full bg-[#FFFFFF] border border-[#E6E1D6] rounded-[8px] px-3.5 py-2.5 text-[#1B2430] placeholder-[#4A5565]/60 text-sm font-medium focus:outline-none focus:border-[#0F766E] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#1B2430] block">
              Foco do Pitch Técnico
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { id: 'general_curriculo', title: 'Carta Geral (Interesse & Destaque)', desc: 'Sem empresa fixa. Destaca trajetória de 5 anos, mobilidade e CNH.' },
                { id: 'suporte_redes', title: 'Foco em Suporte Técnico N1/N2 & Atendimento', desc: 'Vivência em service desk, resolução de incidentes e atendimento.' },
                { id: 'redes_infra', title: 'Foco em Redes, Telecom & Wi-Fi', desc: 'Certificações Ubiquiti UEWA, FTTH e ativos de conectividade.' },
                { id: 'seg_govern', title: 'Foco em Cibersegurança & ITIL', desc: 'Tecnólogo em Cibersegurança (em andamento), conformidade LGPD e boas práticas ITIL.' },
                { id: 'admin_ops', title: 'Rotinas Operacionais & Gestão de Demandas', desc: 'Organização de processos, relatórios técnicos e produtividade.' }
              ].map(opt => (
                <label 
                  key={opt.id}
                  className={`flex items-start gap-3 p-3.5 rounded-[8px] border cursor-pointer transition-all ${
                    focusArea === opt.id 
                      ? 'bg-[#F1EEE6] border-[#0F766E]' 
                      : 'bg-[#FFFFFF] border-[#E6E1D6] hover:border-[#0F766E]'
                  }`}
                >
                  <input
                    type="radio"
                    name="focus"
                    checked={focusArea === opt.id}
                    onChange={() => setFocusArea(opt.id)}
                    className="mt-1 accent-[#0F766E] cursor-pointer"
                  />
                  <div>
                    <strong className="text-[#1B2430] block font-bold text-sm">
                      {opt.title}
                    </strong>
                    <span className="text-xs text-[#4A5565] block mt-0.5 font-medium leading-snug">
                      {opt.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-[#0F766E] hover:bg-[#0C5F58] text-white font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.2} />
            <span>Gerar Carta de Apresentação</span>
          </button>
        </div>

        {/* Letter Output Display */}
        <div className="lg:col-span-7 flex flex-col h-full self-stretch justify-between">
          {generatedLetter ? (
            <div className="bg-[#FFFBF2] border border-[#E6E1D6] p-5 sm:p-6 rounded-[12px] flex-1 flex flex-col justify-between min-h-[340px]">
              <div className="text-xs sm:text-sm text-[#1B2430] font-sans overflow-y-auto max-h-[380px] leading-relaxed whitespace-pre-wrap pr-1 select-all font-medium">
                {generatedLetter}
              </div>
              
              <div className="mt-4 pt-4 border-t border-[#E6E1D6] flex justify-end gap-2 no-print">
                <button
                  onClick={handleCopy}
                  className="px-5 py-2.5 bg-[#FFFFFF] hover:bg-[#F1EEE6] text-[#1B2430] border border-[#E6E1D6] hover:border-[#0F766E] hover:text-[#0F766E] rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#0F766E]" strokeWidth={2.5} aria-hidden="true" />
                      <span>Copiado com Sucesso!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#1B2430]" strokeWidth={2.2} aria-hidden="true" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#FFFBF2] border border-dashed border-[#E6E1D6] p-8 rounded-[12px] text-center flex flex-col items-center justify-center min-h-[340px] h-full text-[#4A5565]">
              <FileText className="w-10 h-10 mb-3 text-[#0F766E]" strokeWidth={2} aria-hidden="true" />
              <p className="text-sm font-bold text-[#1B2430]">Preencha os campos ao lado para gerar a carta</p>
              <p className="text-xs mt-1 text-[#4A5565]">O texto gerado pode ser copiado diretamente para e-mails ou LinkedIn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
