'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconeWhatsApp } from './Icones';
import { Marca, type DadosMarca } from './Marca';

type ItemMenu = { href: string; rotulo: string };

export function Cabecalho({ marca, menu, whatsapp }: { marca: DadosMarca; menu: ItemMenu[]; whatsapp: string | null }) {
  const caminho = usePathname();
  const ativo = (href: string) => (href === '/' ? caminho === '/' : caminho === href || caminho.startsWith(href + '/'));

  return (
    <header className="cabecalho">
      <div className="container">
        <Marca marca={marca} />
        <nav className="menu" aria-label="Principal">
          {menu.map((item) => (
            <Link key={item.href} href={item.href} aria-current={ativo(item.href) ? 'page' : undefined}>
              {item.rotulo}
            </Link>
          ))}
          {whatsapp && (
            <a className="botao botao-primario botao-pequeno" href={whatsapp} target="_blank" rel="noopener">
              <IconeWhatsApp />
              Conversar
            </a>
          )}
        </nav>
        <details className="menu-celular">
          <summary>Menu</summary>
          <nav aria-label="Principal no celular">
            {menu.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.rotulo}
              </Link>
            ))}
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener">
                Falar no WhatsApp
              </a>
            )}
          </nav>
        </details>
      </div>
    </header>
  );
}
