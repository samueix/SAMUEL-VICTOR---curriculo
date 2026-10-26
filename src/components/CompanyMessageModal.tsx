import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Send, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { sendCompanyRecado, trackEvent } from '../services/tracker';

interface CompanyMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUBJECT_OPTIONS = [
  '💼 Oportunidade CLT / PJ',
  '🤝 Proposta Freelance / Projeto',
  '📞 Convite para Entrevista Técnica',
  '💬 Contato Geral / Outro Recado'
];

export default function CompanyMessageModal({ isOpen, onClose }: CompanyMessageModalProps) {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [assunto, setAssunto] = useState('💼 Oportunidade CLT / PJ');
  const [mensagem, setMensagem] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fecha no pressionar da tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Trava a rolagem da página ao fundo enquanto o modal estiver aberto
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nome.trim()) {
      setErrorMessage('Por favor, informe seu nome ou o nome do responsável.');
      return;
    }
    if (!empresa.trim()) {
      setErrorMessage('Por favor, informe o nome da sua empresa ou organização.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Por favor, informe um e-mail / Gmail válido para retorno.');
      return;
    }
    if (!mensagem.trim()) {
      setErrorMessage('Por favor, escreva sua mensagem ou os detalhes da oportunidade.');
      return;
    }

    setIsSubmitting(true);

    try {
      const ok = await sendCompanyRecado({
        nome: nome.trim(),
        empresa: empresa.trim(),
        email: email.trim(),
        telefone: telefone.trim() || undefined,
        assunto,
        mensagem: mensagem.trim()
      });

      if (ok) {
        setIsSuccess(true);
        trackEvent('recado_empresa', `Recado enviado por ${empresa.trim()}`);
      } else {
        setErrorMessage('Não foi possível enviar no momento. Tente novamente ou use o contato direto.');
      }
    } catch {
      setErrorMessage('Ocorreu um erro ao enviar. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setNome('');
    setEmpresa('');
    setEmail('');
    setTelefone('');
    setMensagem('');
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in no-print overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#FFFFFF] border border-[#E6E1D6] rounded-[16px] w-full max-w-xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="p-4 sm:p-5 bg-[#FFFBF2] border-b border-[#E6E1D6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0F766E] text-white flex items-center justify-center shadow-sm shrink-0">
              <Building2 className="w-5 h-5 text-white" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display text-[#1B2430]">
                Proposta ou Mensagem Profissional
              </h3>
              <p className="text-xs text-[#4A5565] font-medium">
                Envio direto de oportunidades e recados para Samuel Nobre
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-9 h-9 flex items-center justify-center text-[#4A5565] hover:text-[#1B2430] hover:bg-[#F1EEE6] active:scale-95 rounded-full transition-all cursor-pointer border border-[#E6E1D6] shrink-0"
            aria-label="Fechar janela"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" strokeWidth={2.4} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#059669] mx-auto flex items-center justify-center border border-[#A7F3D0]">
                <CheckCircle2 className="w-8 h-8" strokeWidth={2.2} />
              </div>

              <div>
                <h4 className="text-xl font-bold font-display text-[#1B2430]">
                  Recado Enviado com Sucesso!
                </h4>
                <p className="text-sm text-[#4A5565] max-w-md mx-auto mt-2 leading-relaxed">
                  Sua mensagem e os dados da <strong>{empresa}</strong> foram entregues diretamente para o <strong>Samuel Nobre</strong>.
                </p>
                <div className="mt-4 p-3.5 bg-[#FFFBF2] border border-[#E6E1D6] rounded-xl max-w-md mx-auto text-xs text-[#0F766E] font-medium text-left">
                  ✅ Um retorno será encaminhado para o e-mail <strong>{email}</strong> {telefone ? `ou WhatsApp (${telefone})` : ''} com prioridade.
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-[#0F766E] hover:bg-[#0D655E] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                  Concluir e Voltar
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-lg bg-[#F1EEE6] hover:bg-[#E6E1D6] text-[#1B2430] font-semibold text-sm transition-all cursor-pointer"
                >
                  Enviar Outro Recado
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Nome do Contato */}
                <div>
                  <label className="block text-xs font-bold text-[#1B2430] mb-1">
                    Seu Nome / Recrutador <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#4A5565] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Mariana Silva"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[#FFFBF2] border border-[#E6E1D6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#1B2430]"
                    />
                  </div>
                </div>

                {/* Nome da Empresa */}
                <div>
                  <label className="block text-xs font-bold text-[#1B2430] mb-1">
                    Empresa / Organização <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#4A5565] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                      placeholder="Ex: Stefanini / Google / etc."
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[#FFFBF2] border border-[#E6E1D6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#1B2430]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* E-mail / Gmail de Contato */}
                <div>
                  <label className="block text-xs font-bold text-[#1B2430] mb-1">
                    E-mail / Gmail para Retorno <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#4A5565] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@empresa.com"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[#FFFBF2] border border-[#E6E1D6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#1B2430]"
                    />
                  </div>
                </div>

                {/* Telefone / WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-[#1B2430] mb-1">
                    Telefone / WhatsApp <span className="text-xs text-[#4A5565] font-normal">(opcional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#4A5565] absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(85) 99999-9999"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[#FFFBF2] border border-[#E6E1D6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#1B2430]"
                    />
                  </div>
                </div>
              </div>

              {/* Assunto / Tipo de Oportunidade */}
              <div>
                <label className="block text-xs font-bold text-[#1B2430] mb-1.5">
                  Assunto da Mensagem / Tipo de Oportunidade
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUBJECT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAssunto(opt)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        assunto === opt
                          ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-sm'
                          : 'bg-[#FFFBF2] text-[#4A5565] border-[#E6E1D6] hover:border-[#0F766E] hover:text-[#1B2430]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mensagem / Recado */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#1B2430]">
                    Mensagem / Detalhes da Vaga ou Proposta <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-[#4A5565]">
                    {mensagem.length}/1000 caracteres
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Olá Samuel, vimos seu portfólio e experiência em redes / suporte / TI e gostaríamos de saber sua disponibilidade para conversar a respeito de uma oportunidade..."
                  className="w-full p-3 text-sm bg-[#FFFBF2] border border-[#E6E1D6] rounded-lg focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] text-[#1B2430] resize-none"
                />
              </div>

              {/* Botões do Rodapé */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E6E1D6]">
                <div className="flex items-center gap-1.5 text-xs text-[#0F766E] font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mensagem enviada com prioridade direta</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-[#4A5565] hover:text-[#1B2430] hover:bg-[#F1EEE6] rounded-lg transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#0F766E] hover:bg-[#0D655E] disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Enviando mensagem...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Proposta / Recado</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
