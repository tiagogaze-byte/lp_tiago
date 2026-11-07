import Link from 'next/link';
import type { Contato } from '@/lib/identidade';
import { IconeWhatsApp } from './Icones';
import { Marca, type DadosMarca } from './Marca';

type ItemMenu = { href: string; rotulo: string };

type Props = {
  marca: DadosMarca;
  menu: ItemMenu[];
  whatsapp: string | null;
  contato: Contato;
  assinaturaTiago?: boolean; // linha final fixa do site do Tiago
};

export function Rodape({ marca, menu, whatsapp, contato, assinaturaTiago }: Props) {
  return (
    <>
      <footer className="rodape">
        <div className="container">
          <div className="rodape-grade">
            <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
              <Marca marca={marca} estilo={{ color: 'var(--texto)' }} />
              {marca.slogan && <p>{marca.slogan}</p>}
              {contato.registro && <p>{contato.registro}</p>}
              {contato.cidade && <p>{assinaturaTiago ? `${contato.cidade}, atendimento em todo o Brasil.` : contato.cidade}</p>}
            </div>
            <div>
              <h4>Navegação</h4>
              <ul>
                {menu.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.rotulo}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Contato</h4>
              <ul>
                {whatsapp && (
                  <li>
                    <a href={whatsapp} target="_blank" rel="noopener">
                      WhatsApp {contato.whatsappExibicao}
                    </a>
                  </li>
                )}
                {contato.telefone && (
                  <li>
                    <a href={`tel:${contato.telefone.replace(/[^\d+]/g, '')}`}>Telefone {contato.telefone}</a>
                  </li>
                )}
                {contato.email && (
                  <li>
                    <a href={`mailto:${contato.email}`}>{contato.email}</a>
                  </li>
                )}
                <li>
                  <Link href="/privacidade">Política de privacidade</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="rodape-base">
            <span>
              © {new Date().getFullYear()} {marca.nome}
            </span>
            {assinaturaTiago && <span>Estratégia Narrativa · IA Aplicada · Resultados reais</span>}
          </div>
        </div>
      </footer>
      {whatsapp && (
        <a className="whatsapp-flutuante" href={whatsapp} target="_blank" rel="noopener" aria-label={`Falar com ${marca.nome} no WhatsApp`}>
          <IconeWhatsApp />
        </a>
      )}
    </>
  );
}
