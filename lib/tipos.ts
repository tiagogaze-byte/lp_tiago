export type Editoria = {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  ordem: number;
  ativa: boolean;
};

export type ItemFaq = { pergunta: string; resposta: string };

export type StatusArtigo = 'rascunho' | 'agendado' | 'publicado';

export type Artigo = {
  id: string;
  titulo: string;
  slug: string;
  resumo: string;
  corpo: string;
  editoria_id: string | null;
  tags: string[];
  palavra_chave: string;
  palavras_secundarias: string[];
  capa_url: string | null;
  capa_alt: string;
  faq: ItemFaq[];
  relacionados: string[];
  status: StatusArtigo;
  publicado_em: string | null;
  criado_em: string;
  atualizado_em: string;
};

export type ArtigoComEditoria = Artigo & { editoria: Editoria | null };

// ---------- Páginas em blocos ----------

export type ItemCartao = { titulo: string; texto: string };

export type Bloco =
  | { id: string; tipo: 'topo'; rotulo: string; titulo: string; destaque: string; texto: string; imagem_url: string; imagem_alt: string; botao_texto: string; botao_link: string; botao2_texto: string; botao2_link: string }
  | { id: string; tipo: 'cartoes'; rotulo: string; titulo: string; texto: string; numerados: boolean; itens: ItemCartao[] }
  | { id: string; tipo: 'texto'; rotulo: string; titulo: string; corpo: string; imagem_url: string; imagem_alt: string }
  | { id: string; tipo: 'citacao'; texto: string; autor: string }
  | { id: string; tipo: 'contato'; rotulo: string; titulo: string; texto: string }
  | { id: string; tipo: 'chamada'; titulo: string; texto: string; botao_texto: string; botao_link: string };

export type TipoBloco = Bloco['tipo'];

export type Pagina = {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  no_menu: boolean;
  ordem: number;
  publicada: boolean;
  blocos: Bloco[];
};

export type ConfigSite = {
  whatsapp?: string; // só números, com DDI: 5531999999999
  telefone?: string;
  email?: string;
  cidade?: string;
  registro?: string; // ex.: CRP 04/44138, OAB/MG 123
  blog?: boolean;
  mensagem_whatsapp?: string;
  favicon?: string; // ícone da aba enviado pelo cliente
};
