import { bancoConfigurado, consulta, umaLinha } from './db';
import { identidadeDoSite } from './identidade';
import type { Pagina } from './tipos';

// Leitura pública das páginas em blocos do cliente.

export async function paginaPublicada(slug: string): Promise<Pagina | null> {
  if (!bancoConfigurado()) return null;
  const { clienteId } = await identidadeDoSite();
  if (!clienteId) return null;
  try {
    return await umaLinha<Pagina>(
      'select id, titulo, slug, descricao, no_menu, ordem, publicada, blocos from paginas where cliente_id = $1 and slug = $2 and publicada',
      [clienteId, slug],
    );
  } catch {
    return null;
  }
}

export async function paginasPublicadas(): Promise<{ slug: string; atualizado_em: string }[]> {
  if (!bancoConfigurado()) return [];
  const { clienteId } = await identidadeDoSite();
  if (!clienteId) return [];
  try {
    return await consulta('select slug, atualizado_em::text from paginas where cliente_id = $1 and publicada order by ordem', [clienteId]);
  } catch {
    return [];
  }
}
