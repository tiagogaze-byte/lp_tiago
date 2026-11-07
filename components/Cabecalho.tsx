'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU, linkWhatsApp } from '@/content/site';
import { IconeWhatsApp } from './Icones';
import { Marca, type DadosMarca } from './Marca';

export function Cabecalho({ marca }: { marca: DadosMarca }) {
  const caminho = usePathname();
  const ativo = (href: string) => caminho === href || caminho.startsWith(href + '/');

  return (
    <header className="cabecalho">
      <div className="container">
        <Marca marca={marca} />
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
