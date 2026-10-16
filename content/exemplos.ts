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

  // ---------- Artigos do Tiago ----------
  {
    ...base,
    id: 'a4',
    titulo: 'O que é comunicação estratégica e por que ela é essencial para empresas e organizações?',
    slug: 'o-que-e-comunicacao-estrategica',
    resumo: 'Comunicação estratégica é o planejamento e a execução de ações de comunicação alinhadas aos objetivos de uma organização, para construir relações, reputação e resultados mensuráveis.',
    editoria_id: 'e5',
    editoria: ed('estrategia-posicionamento'),
    tags: ['comunicação estratégica', 'planejamento', 'reputação'],
    palavra_chave: 'comunicação estratégica',
    capa_alt: 'Equipe reunida planejando a comunicação de uma organização',
    publicado_em: '2026-10-15T12:00:00Z',
    faq: [
      { pergunta: 'Toda empresa precisa de comunicação estratégica?', resposta: 'Sim. A complexidade varia conforme o porte, mas qualquer organização precisa comunicar objetivos, valores e propostas de maneira consistente.' },
      { pergunta: 'Comunicação estratégica é a mesma coisa que marketing?', resposta: 'Não. Marketing trabalha com mercado, valor e relacionamento comercial. A comunicação estratégica também abrange reputação, comunicação interna, relações institucionais e outros públicos.' },
      { pergunta: 'Como medir os resultados?', resposta: 'Por indicadores relacionados aos objetivos: reconhecimento, participação, engajamento qualificado, geração de oportunidades, reputação e conversões.' },
    ],
    corpo: `Comunicação estratégica é o planejamento e a execução de ações de comunicação alinhadas aos objetivos de uma organização. Seu propósito não é apenas transmitir mensagens, mas construir relacionamentos, fortalecer reputações, orientar decisões e contribuir para resultados mensuráveis.

## Qual é a diferença entre comunicação e comunicação estratégica?

Comunicar é transmitir uma informação. Comunicar estrategicamente é compreender por que aquela informação precisa ser transmitida, para quem, por quais canais e com qual resultado esperado.

Uma empresa pode publicar diariamente nas redes sociais sem desenvolver uma estratégia de comunicação. A frequência, isoladamente, não significa que exista planejamento.

A comunicação estratégica exige objetivos claros, conhecimento dos públicos, posicionamento consistente e acompanhamento de indicadores.

## Quais são os pilares da comunicação estratégica?

Cinco elementos sustentam uma estratégia eficiente:

1. **Diagnóstico:** compreender o cenário, os desafios e as oportunidades.
2. **Objetivos:** estabelecer o que a organização pretende alcançar.
3. **Públicos:** identificar necessidades, comportamentos e expectativas.
4. **Mensagens e canais:** definir o conteúdo e os meios mais adequados.
5. **Avaliação:** acompanhar indicadores e ajustar as ações.

Esses elementos precisam funcionar de maneira integrada.

## Como aplicar comunicação estratégica na prática?

Imagine uma organização que deseja ampliar sua participação em determinada comunidade.

Antes de criar anúncios ou campanhas, é necessário compreender como as pessoas percebem a instituição, quais são suas principais necessidades e quais canais realmente utilizam.

A partir desse diagnóstico, torna-se possível desenvolver mensagens relevantes, escolher interlocutores e estabelecer indicadores de participação e confiança.

Em projetos de mobilização social, como os relacionados à prevenção da dengue, essa lógica é especialmente importante. A comunicação precisa transformar informação em compreensão, confiança e participação.

## Por que a comunicação estratégica é importante?

Porque reduz a distância entre o que uma organização pretende comunicar e aquilo que seus públicos efetivamente compreendem.

Uma estratégia bem construída também evita esforços dispersos, melhora a utilização de recursos e favorece a consistência institucional.

## Conclusão

Comunicação estratégica não começa pela escolha de um canal. Começa pela compreensão do problema que precisa ser resolvido.

Esse é o ponto de partida da [Consultoria Estratégica](/solucoes#consultoria).`,
  },
  {
    ...base,
    id: 'a5',
    titulo: 'Como criar um planejamento de marketing digital eficiente?',
    slug: 'como-criar-planejamento-de-marketing-digital',
    resumo: 'Um planejamento de marketing digital eficiente começa pelo diagnóstico do negócio, define objetivos mensuráveis e organiza públicos, canais, investimentos e indicadores.',
    editoria_id: 'e7',
    editoria: ed('negocios-digitais'),
    tags: ['marketing digital', 'planejamento', 'indicadores'],
    palavra_chave: 'planejamento de marketing digital',
    capa_alt: 'Quadro com etapas de um planejamento de marketing',
    publicado_em: '2026-10-12T12:00:00Z',
    faq: [
      { pergunta: 'Uma pequena empresa precisa de planejamento de marketing?', resposta: 'Sim. Um planejamento simples pode evitar desperdício de orçamento e orientar prioridades.' },
      { pergunta: 'Quanto investir em marketing digital?', resposta: 'Não existe percentual universal. O investimento depende de margem, objetivos, concorrência, capacidade comercial e retorno esperado.' },
      { pergunta: 'O que fazer quando uma campanha não gera resultados?', resposta: 'Investigar a oferta, o público, a mensagem, a experiência de conversão e os indicadores antes de aumentar o orçamento.' },
    ],
    corpo: `Um planejamento de marketing digital eficiente começa pelo diagnóstico do negócio, define objetivos mensuráveis, identifica públicos prioritários e organiza canais, conteúdos, investimentos e indicadores. Seu sucesso depende da integração entre estratégia, execução e análise.

## Por onde começar um planejamento de marketing?

O primeiro passo é compreender o negócio.

Isso significa responder a perguntas fundamentais: quem compra, por que compra, quais problemas o produto resolve, como os clientes chegam até a empresa e quais obstáculos dificultam a conversão.

Sem esse entendimento, o marketing corre o risco de produzir campanhas visualmente atraentes, mas comercialmente pouco relevantes.

## Quais etapas não podem faltar?

Um planejamento pode ser organizado em sete etapas:

1. Diagnóstico de mercado e concorrência.
2. Definição de objetivos e metas.
3. Identificação de públicos e jornadas de compra.
4. Posicionamento e proposta de valor.
5. Seleção de canais e estratégias.
6. Definição de orçamento e cronograma.
7. Monitoramento e otimização.

Essas etapas não precisam gerar um documento excessivamente complexo. Precisam orientar decisões reais.

## Como escolher os canais de marketing?

A escolha depende do comportamento do público e dos objetivos da organização.

O Google pode ser especialmente relevante quando as pessoas já procuram uma solução. As redes sociais podem contribuir para descoberta, relacionamento e reconhecimento. O e-mail e o CRM ajudam a desenvolver relações com contatos existentes.

O importante é não confundir presença em muitos canais com eficiência.

## Como definir indicadores?

Os indicadores devem corresponder aos resultados esperados.

Uma campanha de reconhecimento pode acompanhar alcance qualificado e lembrança de marca. Uma estratégia de geração de oportunidades pode avaliar leads, custo por lead, taxa de conversão e qualidade comercial.

Em projetos de marketing para empresas de serviços, inclusive negócios voltados ao mercado norte-americano, essa integração entre comunicação e processo comercial é particularmente importante.

## Com que frequência revisar o planejamento?

Indicadores operacionais podem ser acompanhados semanalmente, enquanto avaliações estratégicas costumam exigir períodos maiores, dependendo do ciclo de compra.

A revisão deve considerar resultados, mudanças no mercado e capacidade operacional.

## Conclusão

Marketing digital eficiente não é uma coleção de publicações e anúncios. É um sistema de decisões que conecta objetivos comerciais, comunicação e análise de resultados.

Veja como isso vira projeto em [Negócios Digitais](/solucoes#negocios-digitais).`,
  },
  {
    ...base,
    id: 'a6',
    titulo: 'Como a inteligência artificial está transformando a comunicação e o marketing?',
    slug: 'como-a-ia-esta-transformando-comunicacao-e-marketing',
    resumo: 'A IA amplia a capacidade de analisar informações, produzir conteúdo, automatizar tarefas e apoiar decisões. O maior potencial aparece quando complementa a experiência humana.',
    editoria_id: 'e1',
    editoria: ed('ia-aplicada'),
    tags: ['inteligência artificial', 'marketing', 'produtividade'],
    palavra_chave: 'inteligência artificial na comunicação',
    capa_alt: 'Pessoa trabalhando com uma ferramenta de inteligência artificial no computador',
    publicado_em: '2026-10-08T12:00:00Z',
    faq: [
      { pergunta: 'É possível usar IA em pequenas empresas?', resposta: 'Sim. Pequenas equipes podem utilizá-la em planejamento, organização, atendimento e produção assistida de conteúdo.' },
      { pergunta: 'Conteúdo produzido com IA prejudica o SEO?', resposta: 'O uso de IA, por si só, não determina a qualidade de um conteúdo. Originalidade, utilidade, precisão e aderência às políticas dos buscadores são fatores mais relevantes.' },
      { pergunta: 'A IA pode tomar decisões de marketing sozinha?', resposta: 'Ela pode apoiar análises e recomendações, mas decisões com impacto financeiro, reputacional ou humano devem contar com supervisão adequada.' },
    ],
    corpo: `A inteligência artificial está transformando a comunicação ao ampliar a capacidade de analisar informações, produzir versões de conteúdo, automatizar tarefas e apoiar decisões. Seu maior potencial aparece quando complementa a experiência humana, em vez de substituir o pensamento estratégico.

## Onde a inteligência artificial pode ser aplicada?

As aplicações incluem pesquisa, organização de informações, análise de dados, produção de conteúdo, atendimento, planejamento editorial e automação de processos.

Uma equipe pode utilizar IA para comparar abordagens de campanha, estruturar perguntas de pesquisa, identificar padrões em comentários e produzir versões preliminares de materiais.

Entretanto, esses resultados precisam de revisão humana, especialmente quando envolvem informações técnicas, institucionais ou sensíveis.

## A inteligência artificial substitui o profissional de comunicação?

Ela automatiza determinadas atividades e modifica competências exigidas pelo mercado, mas não elimina a necessidade de compreender contextos, públicos, objetivos e consequências.

Uma ferramenta pode sugerir dezenas de títulos. A escolha de qual mensagem é adequada depende de conhecimento sobre a marca, o público e a situação.

O diferencial profissional passa a incluir a capacidade de formular problemas, avaliar respostas e integrar ferramentas aos processos de trabalho.

## Como utilizar IA com responsabilidade?

Três cuidados são fundamentais.

- **Verificação:** informações, números e referências produzidos por sistemas de IA precisam ser conferidos.
- **Privacidade:** dados pessoais e informações confidenciais exigem tratamento adequado e respeito às políticas e leis aplicáveis.
- **Transparência:** conteúdos e processos devem respeitar compromissos éticos, direitos autorais e expectativas legítimas dos públicos.

## Como começar a implementar IA?

O caminho mais eficiente é identificar tarefas repetitivas ou processos que consomem tempo excessivo.

Depois, é possível testar aplicações de baixo risco, estabelecer critérios de qualidade e medir o ganho real de produtividade.

A adoção de IA não deve começar pela ferramenta mais popular, mas pelo problema que a organização precisa resolver.

## Conclusão

O futuro da comunicação não depende apenas de dominar ferramentas de inteligência artificial. Depende de saber combiná-las com estratégia, repertório, responsabilidade e sensibilidade humana.

É assim que funciona a [IA Aplicada](/solucoes#ia-aplicada) e a [Capacitação em IA](/solucoes#capacitacao).`,
  },
  {
    ...base,
    id: 'a7',
    titulo: 'O que é gestão de projetos e como aplicá-la à comunicação e ao marketing?',
    slug: 'gestao-de-projetos-na-comunicacao-e-marketing',
    resumo: 'Gestão de projetos organiza recursos, pessoas, prazos e riscos para alcançar um objetivo. Na comunicação, transforma ideias criativas em entregas coordenadas e com qualidade.',
    editoria_id: 'e5',
    editoria: ed('estrategia-posicionamento'),
    tags: ['gestão de projetos', 'campanhas', 'produtividade'],
    palavra_chave: 'gestão de projetos',
    capa_alt: 'Quadro de tarefas de um projeto de comunicação',
    publicado_em: '2026-10-03T12:00:00Z',
    faq: [
      { pergunta: 'Qual a diferença entre processo e projeto?', resposta: 'Projeto é um esforço temporário com objetivo específico. Processo é uma sequência recorrente de atividades.' },
      { pergunta: 'Toda campanha precisa de gerente de projetos?', resposta: 'Não necessariamente de um cargo exclusivo, mas precisa de alguém responsável pela coordenação das entregas.' },
      { pergunta: 'Qual o principal indicador de sucesso?', resposta: 'O cumprimento de prazo e orçamento é importante, mas o sucesso também depende da qualidade da entrega e dos objetivos alcançados.' },
    ],
    corpo: `Gestão de projetos é a organização de recursos, pessoas, atividades, prazos e riscos para alcançar um objetivo definido. Na comunicação e no marketing, ela permite transformar ideias criativas em entregas coordenadas, com responsabilidades claras e critérios de qualidade.

## Por que campanhas de marketing precisam de gestão de projetos?

Uma campanha pode envolver redatores, designers, profissionais de mídia, fornecedores, equipes comerciais e responsáveis pela aprovação.

Sem coordenação, atrasos e retrabalhos comprometem a qualidade das entregas.

A gestão de projetos estabelece uma estrutura para que todos compreendam o que precisa ser feito, quem é responsável e quando cada atividade deve acontecer.

## Quais são as etapas de um projeto de comunicação?

Um modelo simples pode ser dividido em cinco fases:

1. **Iniciação:** definição do problema, objetivos e envolvidos.
2. **Planejamento:** escopo, orçamento, cronograma e responsabilidades.
3. **Execução:** desenvolvimento das atividades previstas.
4. **Monitoramento:** acompanhamento de entregas, custos e riscos.
5. **Encerramento:** avaliação dos resultados e registro de aprendizados.

Em campanhas eleitorais, por exemplo, a gestão envolve simultaneamente produção de materiais, equipes, fornecedores, contratos, cronogramas e controles financeiros.

## Qual metodologia utilizar?

Metodologias tradicionais são úteis quando o escopo e as entregas podem ser definidos antecipadamente.

Abordagens ágeis favorecem ciclos curtos, revisões frequentes e adaptação a mudanças.

Na prática, projetos de comunicação frequentemente utilizam modelos híbridos, combinando planejamento estruturado com flexibilidade operacional.

## Como evitar problemas de execução?

Um dos instrumentos mais importantes é a definição clara de responsabilidades.

Também é necessário estabelecer fluxos de aprovação, critérios de conclusão, prioridades e rotinas de acompanhamento.

Ferramentas digitais podem facilitar a organização, mas não substituem acordos claros entre as pessoas.

## Conclusão

Criatividade e organização não são forças opostas. A gestão de projetos cria condições para que boas ideias sejam executadas com consistência.

Conheça a [Consultoria Estratégica](/solucoes#consultoria), que inclui fluxo de aprovação e plano de conteúdo.`,
  },
  {
    ...base,
    id: 'a8',
    titulo: 'Como construir uma marca forte e um posicionamento relevante?',
    slug: 'como-construir-marca-forte-e-posicionamento',
    resumo: 'Uma marca forte une identidade reconhecível, proposta de valor clara e experiências consistentes. O posicionamento define como a organização quer ser percebida frente às alternativas.',
    editoria_id: 'e5',
    editoria: ed('estrategia-posicionamento'),
    tags: ['branding', 'posicionamento', 'marca'],
    palavra_chave: 'posicionamento de marca',
    capa_alt: 'Elementos de identidade visual de uma marca sobre a mesa',
    publicado_em: '2026-10-01T12:00:00Z',
    faq: [
      { pergunta: 'Branding é apenas para grandes empresas?', resposta: 'Não. Negócios locais, profissionais autônomos e organizações sociais também constroem marcas.' },
      { pergunta: 'Posicionamento é a mesma coisa que slogan?', resposta: 'Não. O slogan pode expressar parte do posicionamento, mas não o define sozinho.' },
      { pergunta: 'Quando uma marca precisa mudar seu posicionamento?', resposta: 'Quando há mudanças relevantes no público, no mercado, na oferta ou quando a percepção atual deixa de representar o valor entregue.' },
    ],
    corpo: `Construir uma marca forte significa desenvolver uma identidade reconhecível, uma proposta de valor clara e experiências consistentes ao longo do tempo. O posicionamento define como a organização deseja ser percebida em relação às alternativas disponíveis.

## Qual é a diferença entre marca e identidade visual?

Identidade visual é o conjunto de elementos gráficos que representa uma organização, incluindo logotipo, cores e tipografia.

Marca é um conceito mais amplo. Envolve reputação, percepções, experiências, associações e expectativas.

Uma identidade visual bem desenvolvida contribui para o reconhecimento, mas não compensa experiências negativas ou promessas que a empresa não consegue cumprir.

## Como definir o posicionamento?

O posicionamento deve responder a quatro perguntas:

- Quem é o público prioritário?
- Qual problema a organização resolve?
- Que valor oferece?
- Por que alguém deveria escolhê-la?

As respostas precisam ser sustentadas pela realidade do produto ou serviço.

## O que torna uma marca memorável?

Consistência, diferenciação relevante e experiências positivas.

Uma hamburgueria tradicional, por exemplo, pode valorizar sua história e sua relação com a cidade. Uma empresa de serviços pode construir seu posicionamento a partir da confiança, da conveniência e da qualidade do atendimento.

Em ambos os casos, o diferencial precisa aparecer não apenas na publicidade, mas na experiência entregue.

## Como medir a força de uma marca?

Indicadores possíveis incluem reconhecimento espontâneo, buscas pela marca, preferência, retenção, recomendação e percepção de atributos.

O conjunto de indicadores depende do estágio e dos objetivos do negócio.

## Conclusão

Marcas fortes não são construídas apenas por aquilo que dizem sobre si mesmas. São construídas pela coerência entre promessa, comunicação e experiência.

Esse é o trabalho de narrativa e posicionamento da [Consultoria Estratégica](/solucoes#consultoria).`,
  },
];
