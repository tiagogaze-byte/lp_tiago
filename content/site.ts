// Todo o texto fixo do site mora aqui. Para mudar uma frase, edite este arquivo.

export const SITE = {
  nome: 'Tiago Azevedo',
  assinatura: 'Estratégia Narrativa e IA Aplicada',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tiagogaze.com.br',
  descricao:
    'O gap entre o que você faz e o que o mercado percebe está custando caro. Tiago Azevedo fecha esse gap com estratégia narrativa e IA aplicada.',
  whatsapp: '5531997180531',
  whatsappExibicao: '(31) 99718-0531',
  email: 'tiago.gaze@gmail.com',
  cidade: 'Belo Horizonte',
};

export function linkWhatsApp(mensagem = 'Olá, Tiago! Vim pelo site e quero conversar.') {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const MENU = [
  { href: '/solucoes', rotulo: 'Soluções' },
  { href: '/ferramentas', rotulo: 'Ferramentas' },
  { href: '/trajetoria', rotulo: 'Trajetória' },
  { href: '/blog', rotulo: 'Blog' },
  { href: '/contato', rotulo: 'Contato' },
];

export type Solucao = {
  id: string;
  nome: string;
  paraQuem: string;
  entrega: string[];
  frase: string;
};

export const SOLUCOES: Solucao[] = [
  {
    id: 'consultoria',
    nome: 'Consultoria Estratégica',
    paraQuem: 'Líderes, mandatos e marcas que precisam ser entendidos mais rápido.',
    entrega: ['Diagnóstico', 'Narrativa de marca', 'Posicionamento de autoridade', 'Plano de conteúdo e fluxo de aprovação'],
    frase: 'Antes de falar mais alto, é preciso falar a coisa certa.',
  },
  {
    id: 'ia-aplicada',
    nome: 'IA Aplicada',
    paraQuem: 'Equipes que perdem tempo com tarefa repetida e atendimento manual.',
    entrega: ['Agentes de IA para atendimento e conteúdo', 'Automação de fluxos de trabalho', 'Integração com WhatsApp e com os sistemas que você já usa'],
    frase: 'A tecnologia a serviço da sua voz, nunca no lugar dela.',
  },
  {
    id: 'inteligencia-eleitoral',
    nome: 'Inteligência Eleitoral',
    paraQuem: 'Mandatos, pré-candidatos e equipes de campanha.',
    entrega: ['Mapas de votação seção a seção com dados do TSE', 'Comparativo entre eleições e candidatos', 'Cruzamento com a base de apoio'],
    frase: 'Saber onde estão os votos muda onde você coloca sua agenda.',
  },
  {
    id: 'negocios-digitais',
    nome: 'Negócios Digitais',
    paraQuem: 'Especialistas que querem transformar conhecimento em produto.',
    entrega: ['Estruturação de cursos e programas online', 'Landing pages', 'Esteira de lançamento e automação de vendas'],
    frase: 'Do conhecimento acumulado ao produto que vende sozinho.',
  },
  {
    id: 'capacitacao',
    nome: 'Capacitação em IA',
    paraQuem: 'Equipes de empresas, organizações e setor público.',
    entrega: ['Palestras práticas', 'Treinamentos com casos do dia a dia', 'Linguagem simples, sem tecniquês'],
    frase: 'IA não é mágica. É ferramenta, e dá pra aprender a usar.',
  },
];

export type Ferramenta = { id: string; nome: string; faz: string; resolve: string };
export type AreaFerramentas = { id: string; nome: string; ferramentas: Ferramenta[] };

export const AREAS_FERRAMENTAS: AreaFerramentas[] = [
  {
    id: 'atendimento',
    nome: 'Atendimento e Comunicação',
    ferramentas: [
      { id: 'secretaria', nome: 'SecretárIA', faz: 'Atende no WhatsApp, qualifica o contato e agenda a conversa com você.', resolve: 'Oportunidade perdida por demora na resposta.' },
      { id: 'uai-hub', nome: 'UAI Hub', faz: 'CRM e central de atendimento no WhatsApp, com IA e equipe humana trabalhando juntas.', resolve: 'Contatos espalhados e atendimento só em horário comercial.' },
      { id: 'central-sms', nome: 'Central de SMS', faz: 'Transforma celulares Android numa central própria de SMS para avisos, lembretes e confirmações.', resolve: 'Custo alto por mensagem nas plataformas de SMS.' },
    ],
  },
  {
    id: 'politica',
    nome: 'Política e Mandatos',
    ferramentas: [
      { id: 'polaris', nome: 'Polaris', faz: 'Estratégia política com especialistas de IA, cada um olhando uma área.', resolve: 'Decisão tomada no escuro ou com um olhar só.' },
      { id: 'mapa-de-votos', nome: 'Mapa de Votos BR', faz: 'Votação de qualquer candidato do Brasil, seção a seção, com dados oficiais do TSE.', resolve: 'Falta de dado para decidir onde atuar.' },
      { id: 'mobiliza', nome: 'Mobiliza', faz: 'CRM de mobilização com rede de apoiadores, mapa e atendimento com IA.', resolve: 'Base de apoio em planilha e contatos que vão embora com quem sai da equipe.' },
    ],
  },
  {
    id: 'gestao-publica',
    nome: 'Gestão Pública e Terceiro Setor',
    ferramentas: [
      { id: 'gfarp', nome: 'GFARP', faz: 'Gestão de demandas, emendas e parcerias, com semáforo de prazos e relatórios prontos.', resolve: 'Prazo perdido e processo parado sem ninguém saber onde.' },
      { id: 'portal-parcerias', nome: 'Portal de Parcerias', faz: 'Planos de trabalho e prestação de contas de parcerias com OSCs, com conferência de notas fiscais por IA.', resolve: 'Planilhas, e-mails e conferência manual nota por nota.' },
      { id: 'conselhos', nome: 'Plataforma de Conselhos', faz: 'Gestão de conselhos, fundos e editais, com rastreamento de processos e documentos enviados uma vez só.', resolve: 'Processo que some entre setores e OSC reenviando a mesma certidão.' },
    ],
  },
  {
    id: 'organizacoes',
    nome: 'Igrejas e Organizações',
    ferramentas: [
      { id: 'celeiro', nome: 'Celeiro', faz: 'Gestão financeira, de membros e de comunicação para igrejas com sede e congregações.', resolve: 'Tesouraria no caderno e sede sem visão das filiais.' },
    ],
  },
];

export const TOTAL_FERRAMENTAS = AREAS_FERRAMENTAS.reduce((n, a) => n + a.ferramentas.length, 0);

export const AREAS_EXPERIENCIA = [
  { area: 'Comunicação política', feito: 'Coordenação de campanhas municipais, estaduais e federais desde 2012; comunicação de mandatos; roteiros e discursos.' },
  { area: 'Setor público e social', feito: 'Mobilização social em projeto de saúde pública com universidade; comunicação institucional; projetos com organizações da sociedade civil.' },
  { area: 'Mercado', feito: 'Publicidade, live marketing, eventos, marketing digital e tráfego pago para negócios no Brasil e nos EUA.' },
  { area: 'Educação', feito: 'Docência na educação profissional, coordenação de agência experimental, capacitação em IA para servidores públicos.' },
  { area: 'Tecnologia', feito: 'Ferramentas de IA, automação de WhatsApp, portais e painéis de dados.' },
];
