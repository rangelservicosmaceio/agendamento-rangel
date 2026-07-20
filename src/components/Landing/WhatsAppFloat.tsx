import React from 'react';
import { buildWhatsAppLink } from './constants';

export const WhatsAppFloat: React.FC = () => {
  const waLink = buildWhatsAppLink('Olá! Vi a página e quero agendar um serviço.');

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener"
      aria-label="Chamar no WhatsApp"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] w-12 h-12 sm:w-[58px] sm:h-[58px] rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-95"
      style={{
        background: '#25d366',
        boxShadow: '0 12px 26px -8px #000000aa',
        textDecoration: 'none',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0b1f3a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="sm:w-7 sm:h-7">
        <path d="M21 11.5a8.5 8.5 0 01-12.3 7.6L4 20l1-4.5A8.5 8.5 0 1121 11.5z" />
        <path d="M8.5 10.5c.3 2 2.2 3.9 4.2 4.2" />
      </svg>
    </a>
  );
};
