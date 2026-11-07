import { CLIENTE_PADRAO } from '@/lib/db';
import { identidadeDoSite } from '@/lib/identidade';

export const revalidate = 60;

// Navegadores e buscadores pedem /favicon.ico por conta própria: manda para o ícone certo do site.
export async function GET(request: Request) {
  const id = await identidadeDoSite();
  const destino = id.faviconUrl || (CLIENTE_PADRAO === 'tiagogaze' ? '/icone-tiago.svg' : '/icone.svg');
  return Response.redirect(new URL(destino, request.url), 302);
}
