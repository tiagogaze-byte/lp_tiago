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
