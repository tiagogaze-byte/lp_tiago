import { randomUUID } from 'crypto';
import type { Bloco, TipoBloco } from './tipos';

// Conteúdo inicial de um site novo. O cliente troca tudo pelo painel.

export function blocoVazio(tipo: TipoBloco, id: string = randomUUID()): Bloco {
  switch (tipo) {
    case 'topo':
      return { id, tipo, rotulo: '', titulo: 'Título da página', destaque: '', texto: '', imagem_url: '', imagem_alt: '', botao_texto: '', botao_link: '', botao2_texto: '', botao2_link: '' };
    case 'cartoes':
      return { id, tipo, rotulo: '', titulo: 'Título da seção', texto: '', numerados: true, itens: [{ titulo: 'Primeiro item', texto: '' }, { titulo: 'Segundo item', texto: '' }, { titulo: 'Terceiro item', texto: '' }] };
    case 'texto':
      return { id, tipo, rotulo: '', titulo: 'Título do texto', corpo: '', imagem_url: '', imagem_alt: '' };
    case 'citacao':
      return { id, tipo, texto: 'Uma frase que resume o seu trabalho.', autor: '' };
    case 'contato':
      return { id, tipo, rotulo: 'Contato', titulo: 'Vamos conversar?', texto: '' };
    case 'chamada':
      return { id, tipo, titulo: 'Pronto para dar o próximo passo?', texto: '', botao_texto: 'Falar no WhatsApp', botao_link: 'whatsapp' };
  }
}

export function paginasIniciais(nome: string) {
  const primeiro = nome.split(' ')[0];
  return [
    {
      titulo: 'Início',
      slug: 'inicio',
      ordem: 0,
      blocos: [
        { ...(blocoVazio('topo') as Extract<Bloco, { tipo: 'topo' }>), titulo: nome, texto: 'Uma frase curta dizendo o que você faz e para quem.', botao_texto: 'Entrar em contato', botao_link: 'whatsapp', botao2_texto: 'Conhecer o trabalho', botao2_link: '/sobre' },
        blocoVazio('cartoes'),
        blocoVazio('chamada'),
      ],
    },
    {
      titulo: 'Sobre',
      slug: 'sobre',
      ordem: 1,
      blocos: [
        { ...(blocoVazio('topo') as Extract<Bloco, { tipo: 'topo' }>), rotulo: 'Sobre', titulo: `Quem é ${primeiro}`, texto: 'Sua formação, sua experiência e o jeito como você trabalha.' },
        blocoVazio('texto'),
      ],
    },
    {
      titulo: 'Contato',
      slug: 'contato',
      ordem: 9,
      blocos: [{ ...(blocoVazio('contato') as Extract<Bloco, { tipo: 'contato' }>), titulo: 'Vamos conversar?', texto: 'Escolha o canal que for melhor para você.' }],
    },
  ];
}
