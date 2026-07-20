'use client';

import React, { useState } from 'react';
import { ACCENT } from './constants';
import { Logo } from './Logo';

const links = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#faq', label: 'Dúvidas' },
  { href: '#preco', label: 'Preço' },
];

export const Header: React.FC = () => {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#0b1f3aee',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #ffffff14',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <Logo variant="header" />

        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-200 hover:text-white"
              style={{ fontSize: 14, color: '#d9dee8', textDecoration: 'none', fontWeight: 500 }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#agendamento"
            className="transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{
              background: ACCENT,
              color: '#1a1200',
              fontWeight: 700,
              fontSize: 13.5,
              padding: '9px 18px',
              borderRadius: 8,
              textDecoration: 'none',
            }}
          >
            Agendar agora
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuAberto((v) => !v)}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          className="md:hidden"
          style={{ background: 'transparent', border: 'none', padding: 6, cursor: 'pointer' }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round">
            {menuAberto ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          menuAberto ? 'max-h-96' : 'max-h-0'
        }`}
        style={{ background: '#0b1f3a', borderTop: menuAberto ? '1px solid #ffffff14' : 'none' }}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '12px 24px 20px', gap: 16 }}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuAberto(false)}
              style={{ fontSize: 15, color: '#d9dee8', textDecoration: 'none', fontWeight: 500 }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#agendamento"
            onClick={() => setMenuAberto(false)}
            className="transition-transform duration-200 active:scale-95"
            style={{
              background: ACCENT,
              color: '#1a1200',
              fontWeight: 700,
              fontSize: 14,
              padding: '11px 18px',
              borderRadius: 8,
              textDecoration: 'none',
              textAlign: 'center',
              marginTop: 4,
            }}
          >
            Agendar agora
          </a>
        </nav>
      </div>
    </header>
  );
};
