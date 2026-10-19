import React from 'react';
import { Mail, Phone, Linkedin, MapPin, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { PersonalInfo, Message } from '../types';
import { trackEvent } from '../services/tracker';

interface InteractiveContactProps {
  personalInfo: PersonalInfo;
  savedMessages?: Message[];
  setSavedMessages?: React.Dispatch<React.SetStateAction<Message[]>>;
}

const getFormattedWhatsappUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('text=')) return url;
  const message = "Olá Samuel, peguei seu contato pelo seu portfólio e gostaria de conversar!";
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}text=${encodeURIComponent(message)}`;
};

export default function InteractiveContact({ personalInfo }: InteractiveContactProps) {
  const shouldReduceMotion = useReducedMotion();

  const contactCards = [
    {
      title: 'WhatsApp Oficial',
      value: personalInfo.phone,
      link: getFormattedWhatsappUrl(personalInfo.whatsappUrl),
      telLink: `tel:${personalInfo.phone.replace(/[^\d+]/g, '')}`,
      icon: <Phone className="w-5 h-5 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />,
      sub: 'Abrir conversa direta imediata',
      badge: 'Contato Principal',
      eventTipo: 'clique_whatsapp' as const
    },
    {
      title: 'E-mail',
      value: personalInfo.email,
      link: `mailto:${personalInfo.email}`,
      icon: <Mail className="w-5 h-5 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />,
      sub: 'Envio de propostas e oportunidades',
      badge: 'Resposta Rápida',
      eventTipo: 'clique_email' as const
    },
    {
      title: 'LinkedIn Oficial',
      value: personalInfo.linkedinUrl ? personalInfo.linkedinUrl.replace(/(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '') : 'linkedin.com',
      link: personalInfo.linkedinUrl,
      icon: <Linkedin className="w-5 h-5 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />,
      sub: 'Conexão e recomendações técnicas',
      badge: 'Rede Profissional',
      eventTipo: 'clique_linkedin' as const
    },
    {
      title: 'Localização & Região',
      value: personalInfo.location,
      link: '#',
      icon: <MapPin className="w-5 h-5 text-[#0F766E]" strokeWidth={2.2} aria-hidden="true" />,
      sub: 'Presencial / Híbrido / Remoto',
      badge: 'Disponível Agora',
      eventTipo: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Contact Cards Grid with Stagger Motion and Solid Green Shadow on Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {contactCards.map((card, idx) => {
          const isInteractive = card.link !== '#';
          
          return (
            <motion.a
              key={idx}
              href={card.link}
              target={isInteractive ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={() => {
                if (card.eventTipo) {
                  trackEvent(card.eventTipo, `Card de Contato: ${card.title}`);
                }
              }}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={shouldReduceMotion ? undefined : { duration: 0.3, delay: idx * 0.05 }}
              className={`p-6 rounded-[12px] border border-[#E6E1D6] bg-[#FFFFFF] flex flex-col justify-between transition-all duration-200 ${
                isInteractive
                  ? 'hover:-translate-y-1 hover:shadow-[4px_4px_0px_#0F766E] group cursor-pointer'
                  : 'cursor-default'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E6E1D6]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#F1EEE6] flex items-center justify-center shrink-0">
                      {card.icon}
                    </div>
                    <span className="font-display font-bold text-sm text-[#1B2430]">
                      {card.title}
                    </span>
                  </div>
                  
                  {isInteractive && (
                    <ArrowUpRight className="w-4 h-4 text-[#4A5565] group-hover:text-[#0F766E] transition-colors" strokeWidth={2.2} aria-hidden="true" />
                  )}
                </div>
                
                <p className="font-bold text-base leading-snug break-all text-[#1B2430] mb-1">
                  {card.value}
                </p>
                <span className="text-xs text-[#4A5565] font-medium block">
                  {card.sub}
                </span>

                {card.telLink && (
                  <div className="mt-2 pt-2 border-t border-[#F1EEE6]">
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        trackEvent('clique_telefone', 'Card Contato: Ligação direta no Telefone');
                        window.location.href = card.telLink!;
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
                      title="Ligar para o número de telefone"
                    >
                      <Phone className="w-3 h-3" />
                      Ligar para o número
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-[#E6E1D6] flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#F1EEE6] text-[#0F766E] border border-[#E6E1D6]">
                  {card.badge}
                </span>
                {isInteractive && (
                  <span className="text-xs text-[#0F766E] font-bold group-hover:underline">
                    Acessar →
                  </span>
                )}
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
