import Link from 'next/link';
import { MENU, SITE, linkWhatsApp } from '@/content/site';
import { IconeWhatsApp } from './Icones';
import { Marca, type DadosMarca } from './Marca';

export function Rodape({ marca }: { marca: DadosMarca }) {
  return (
    <>
      <footer className="rodape">
        <div className="container">
          <div className="rodape-grade">
            <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
              <Marca marca={marca} estilo={{ color: 'var(--texto)' }} />
              <p>{marca.slogan}</p>
              <p>{SITE.cidade}, atendimento em todo o Brasil.</p>
            </div>
            <div>
              <h4>Navegação</h4>
              <ul>
                {MENU.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.rotulo}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Contato</h4>
              <ul>
                <li>
                  <a href={linkWhatsApp()} target="_blank" rel="noopener">
                    WhatsApp {SITE.whatsappExibicao}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
                </li>
                <li>
                  <Link href="/privacidade">Política de privacidade</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="rodape-base">
            <span>© {new Date().getFullYear()} {marca.nome}</span>
            <span>Estratégia Narrativa · IA Aplicada · Resultados reais</span>
          </div>
        </div>
      </footer>
      <a className="whatsapp-flutuante" href={linkWhatsApp()} target="_blank" rel="noopener" aria-label="Falar com o Tiago no WhatsApp">
        <IconeWhatsApp />
      </a>
    </>
  );
}
