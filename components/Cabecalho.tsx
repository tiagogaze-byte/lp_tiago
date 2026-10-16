'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU, linkWhatsApp } from '@/content/site';
import { IconeWhatsApp } from './Icones';

export function Cabecalho() {
  const caminho = usePathname();
  const ativo = (href: string) => caminho === href || caminho.startsWith(href + '/');

  return (
    <header className="cabecalho">
      <div className="container">
        <Link href="/" className="marca">
          Tiago Azevedo<span>.</span>
        </Link>
        <nav className="menu" aria-label="Principal">
          {MENU.map((item) => (
            <Link key={item.href} href={item.href} aria-current={ativo(item.href) ? 'page' : undefined}>
              {item.rotulo}
            </Link>
          ))}
          <a className="botao botao-primario botao-pequeno" href={linkWhatsApp()} target="_blank" rel="noopener">
            <IconeWhatsApp />
            Conversar
          </a>
        </nav>
        <details className="menu-celular">
          <summary>Menu</summary>
          <nav aria-label="Principal no celular">
            {MENU.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.rotulo}
              </Link>
            ))}
            <a href={linkWhatsApp()} target="_blank" rel="noopener">
              Falar no WhatsApp
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
