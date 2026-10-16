// Conteúdo de demonstração. Só aparece enquanto o Supabase não está configurado,
// para o site poder ser visto e testado antes de o banco existir.
import type { ArtigoComEditoria, Editoria } from '@/lib/tipos';

export const EDITORIAS_EXEMPLO: Editoria[] = [
  { id: 'e1', nome: 'IA Aplicada', slug: 'ia-aplicada', descricao: 'Como usar IA no trabalho real: ferramentas, agentes e casos práticos.', ordem: 1, ativa: true },
  { id: 'e2', nome: 'Comunicação Política', slug: 'comunicacao-politica', descricao: 'Mandatos, campanhas, narrativa e reputação.', ordem: 2, ativa: true },
  { id: 'e3', nome: 'Dados Eleitorais', slug: 'dados-eleitorais', descricao: 'Leitura de votos, mapas e análise de eleições.', ordem: 3, ativa: true },
  { id: 'e4', nome: 'Automação e Atendimento', slug: 'automacao-atendimento', descricao: 'WhatsApp, fluxos e atendimento com IA.', ordem: 4, ativa: true },
  { id: 'e5', nome: 'Estratégia e Posicionamento', slug: 'estrategia-posicionamento', descricao: 'Branding, autoridade, narrativa e presença digital.', ordem: 5, ativa: true },
  { id: 'e6', nome: 'Setor Público e Terceiro Setor', slug: 'setor-publico', descricao: 'Comunicação pública, OSCs, parcerias e projetos sociais.', ordem: 6, ativa: true },
  { id: 'e7', nome: 'Negócios Digitais', slug: 'negocios-digitais', descricao: 'Cursos online, lançamentos, tráfego e vendas.', ordem: 7, ativa: true },
];

const ed = (slug: string) => EDITORIAS_EXEMPLO.find((e) => e.slug === slug) || null;

const base = {
  palavras_secundarias: [],
  capa_url: null,
  relacionados: [],
  status: 'publicado' as const,
  criado_em: '2026-10-01T12:00:00Z',
  atualizado_em: '2026-10-01T12:00:00Z',
};

export const ARTIGOS_EXEMPLO: ArtigoComEditoria[] = [
  {
    ...base,
    id: 'a1',
    titulo: 'Como saber onde um candidato teve mais votos?',
    slug: 'como-saber-onde-candidato-teve-mais-votos',
    resumo: 'Os boletins de urna do TSE mostram a votação de cada candidato seção por seção. Veja como transformar esses dados em um mapa que orienta a agenda.',
    editoria_id: 'e3',
    editoria: ed('dados-eleitorais'),
    tags: ['TSE', 'mapa de votos', 'boletim de urna'],
    palavra_chave: 'onde o candidato teve mais votos',
    capa_alt: 'Mapa com regiões coloridas pela quantidade de votos',
    publicado_em: '2026-10-14T12:00:00Z',
    faq: [
      { pergunta: 'Os dados de votação por seção são públicos?', resposta: 'Sim. O TSE publica os boletins de urna de cada seção eleitoral logo após a apuração, e qualquer pessoa pode consultar.' },
      { pergunta: 'Dá para comparar duas eleições?', resposta: 'Dá. Cruzando os boletins de anos diferentes, é possível ver em quais seções o candidato cresceu ou perdeu votos.' },
    ],
    corpo: `A forma mais precisa de saber onde um candidato teve mais votos é olhar os boletins de urna, seção por seção. O TSE publica esses dados depois de cada eleição, e com eles dá para montar um mapa que mostra exatamente onde estão os eleitores.

## Por que olhar por seção, e não por cidade?

O total por cidade esconde diferenças enormes. Um candidato pode ir muito bem em três bairros e quase não existir no resto. Olhando por seção eleitoral, essas diferenças aparecem.

## O que o mapa de votos mostra na prática?

- Onde o candidato é forte e precisa manter presença
- Onde ele cresceu de uma eleição para outra
- Onde ele perdeu espaço e vale entender o porquê

## Como usar isso na agenda?

Com o mapa na mão, a equipe decide onde fazer reunião, onde colocar liderança e onde investir em comunicação. A agenda deixa de ser intuição e passa a ser leitura de dado.

O [Mapa de Votos BR](/ferramentas#mapa-de-votos) faz essa leitura para qualquer candidato do Brasil.`,
  },
  {
    ...base,
    id: 'a2',
    titulo: 'O que é um agente de IA para atendimento no WhatsApp?',
    slug: 'o-que-e-agente-de-ia-atendimento-whatsapp',
    resumo: 'Um agente de IA responde clientes no WhatsApp na hora, entende o que cada um precisa e marca o próximo passo. Entenda como funciona e quando vale a pena.',
    editoria_id: 'e4',
    editoria: ed('automacao-atendimento'),
    tags: ['WhatsApp', 'atendimento', 'agentes de IA'],
    palavra_chave: 'agente de IA para WhatsApp',
    capa_alt: 'Celular com uma conversa de atendimento no WhatsApp',
    publicado_em: '2026-10-10T12:00:00Z',
    faq: [
      { pergunta: 'O cliente sabe que está falando com uma IA?', resposta: 'Deve saber. Um bom agente se apresenta como assistente de IA logo na primeira mensagem.' },
      { pergunta: 'A IA substitui a equipe?', resposta: 'Não. Ela faz o primeiro atendimento e passa para uma pessoa quando a conversa pede.' },
    ],
    corpo: `Um agente de IA para atendimento no WhatsApp é um assistente que responde mensagens sozinho, a qualquer hora, entende o que a pessoa precisa e leva a conversa até um próximo passo, como um horário marcado.

## Qual a diferença para um chatbot comum?

O chatbot antigo segue um menu: "digite 1 para isso, 2 para aquilo". O agente de IA conversa em linguagem natural, entende perguntas fora do roteiro e responde com o tom da sua marca.

## Quando vale a pena ter um?

- Quando você perde cliente por demora na resposta
- Quando a equipe gasta horas com as mesmas perguntas
- Quando as mensagens chegam fora do horário comercial

## O que um bom agente precisa ter?

Identidade clara, conhecimento sobre o seu negócio, regras do que pode e não pode dizer, e um caminho para passar a conversa para uma pessoa.

A [SecretárIA](/ferramentas#secretaria) é um agente assim, e é ela quem atende quem chama o Tiago no WhatsApp.`,
  },
  {
    ...base,
    id: 'a3',
    titulo: 'Por que seu mandato faz muito e aparece pouco?',
    slug: 'por-que-mandato-faz-muito-aparece-pouco',
    resumo: 'Fazer muito e mostrar pouco é um problema de narrativa, não de trabalho. Veja como organizar a comunicação do mandato para o eleitor perceber o que é feito.',
    editoria_id: 'e2',
    editoria: ed('comunicacao-politica'),
    tags: ['mandato', 'narrativa', 'posicionamento'],
    palavra_chave: 'comunicação de mandato',
    capa_alt: 'Plenário com microfone em primeiro plano',
    publicado_em: '2026-10-05T12:00:00Z',
    faq: [
      { pergunta: 'Postar mais resolve?', resposta: 'Raramente. Sem uma narrativa clara, mais posts só aumentam o ruído.' },
    ],
    corpo: `Quando um mandato faz muito e aparece pouco, o problema quase nunca é falta de trabalho. É falta de uma narrativa que junte as entregas em uma história que o eleitor entende e lembra.

## Onde a comunicação costuma falhar?

- Cada ação é divulgada solta, sem ligação com uma causa
- A linguagem é de gabinete, não de quem vai ler
- Fala-se de tudo, e por isso nada marca

## Como organizar a narrativa?

Escolha poucas bandeiras, de duas a três. Ligue cada entrega a uma delas. Repita essas bandeiras com consistência, em formatos diferentes.

## Como saber se está funcionando?

Pergunte a quem não é da equipe o que o mandato faz. Se a resposta sair em uma frase, a narrativa está pronta.

Esse é o trabalho da [Consultoria Estratégica](/solucoes#consultoria).`,
  },
];
