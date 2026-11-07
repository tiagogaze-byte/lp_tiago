// Temas de cor do portal. Cada cliente escolhe um no painel (Aparência).
// O tema só troca as variáveis de cor do globals.css; o layout é o mesmo para todos.

export type Tema = {
  id: string;
  nome: string;
  modo: 'escuro' | 'claro';
  fundo: string; // cor principal do fundo
  fundoProfundo: string; // faixas e rodapé
  destaque: string; // botões, links, detalhes
  destaqueEscuro: string; // fim do degradê dos botões
  textoNoDestaque: string; // texto escrito em cima do destaque
  titulo?: string; // cor dos títulos, quando diferente do texto
};

export const TEMAS: Tema[] = [
  { id: 'grafite-laranja', nome: 'Grafite e laranja', modo: 'escuro', fundo: '#0f1014', fundoProfundo: '#0a0a0c', destaque: '#ff5f33', destaqueEscuro: '#d83b10', textoNoDestaque: '#ffffff' },
  { id: 'grafite-verde', nome: 'Grafite e verde', modo: 'escuro', fundo: '#0e1211', fundoProfundo: '#090c0b', destaque: '#2fbf71', destaqueEscuro: '#14804a', textoNoDestaque: '#ffffff' },
  { id: 'marinho-dourado', nome: 'Marinho e dourado', modo: 'escuro', fundo: '#0d1320', fundoProfundo: '#080c16', destaque: '#d9ad45', destaqueEscuro: '#a87f1f', textoNoDestaque: '#16120a' },
  { id: 'vinho-coral', nome: 'Vinho e coral', modo: 'escuro', fundo: '#160d10', fundoProfundo: '#0e080a', destaque: '#f0566c', destaqueEscuro: '#b0243c', textoNoDestaque: '#ffffff' },
  { id: 'noite-violeta', nome: 'Noite e violeta', modo: 'escuro', fundo: '#100e17', fundoProfundo: '#0a0910', destaque: '#9b6cff', destaqueEscuro: '#6d33e0', textoNoDestaque: '#ffffff' },
  { id: 'areia-laranja', nome: 'Areia e laranja', modo: 'claro', fundo: '#faf8f5', fundoProfundo: '#f1ede7', destaque: '#df4515', destaqueEscuro: '#b0330c', textoNoDestaque: '#ffffff' },
  { id: 'claro-verde', nome: 'Claro e verde', modo: 'claro', fundo: '#f6f9f7', fundoProfundo: '#eaf1ec', destaque: '#16803d', destaqueEscuro: '#0f5f2d', textoNoDestaque: '#ffffff' },
  { id: 'lavanda-ameixa', nome: 'Lavanda e ameixa', modo: 'claro', fundo: '#f8f5fa', fundoProfundo: '#efe7f4', destaque: '#7a4da0', destaqueEscuro: '#56306f', textoNoDestaque: '#ffffff', titulo: '#56306f' },
  { id: 'claro-azul', nome: 'Claro e azul', modo: 'claro', fundo: '#f7f9fc', fundoProfundo: '#e9eff7', destaque: '#1d4ed8', destaqueEscuro: '#1e3a8a', textoNoDestaque: '#ffffff' },
];

export const TEMA_PADRAO = TEMAS[0];

export function temaPorId(id?: string | null): Tema {
  return TEMAS.find((t) => t.id === id) || TEMA_PADRAO;
}

function hexParaRgb(hex: string) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

// Variáveis CSS de um tema. Usada no site, no painel e na prévia da tela Aparência.
export function variaveisDoTema(tema: Tema): Record<string, string> {
  const rgb = hexParaRgb(tema.destaque);
  const claro = tema.modo === 'claro';
  const tinta = claro ? '20, 21, 26' : '255, 255, 255';
  return {
    '--bg': tema.fundo,
    '--bg-fundo': tema.fundoProfundo,
    '--superficie': `rgba(${tinta}, ${claro ? 0.035 : 0.03})`,
    '--superficie-forte': `rgba(${tinta}, ${claro ? 0.065 : 0.06})`,
    '--borda': `rgba(${tinta}, ${claro ? 0.11 : 0.08})`,
    '--borda-forte': `rgba(${tinta}, ${claro ? 0.2 : 0.16})`,
    '--texto': claro ? '#14151a' : '#ffffff',
    '--texto-suave': claro ? '#55575f' : '#a0a0a0',
    '--texto-fraco': claro ? '#83858d' : '#6b6b70',
    '--laranja': tema.destaque,
    '--laranja-escuro': tema.destaqueEscuro,
    '--laranja-suave': `rgba(${rgb}, ${claro ? 0.12 : 0.1})`,
    '--gradiente': `linear-gradient(135deg, ${tema.destaque} 0%, ${tema.destaqueEscuro} 100%)`,
    '--sombra-laranja': `rgba(${rgb}, ${claro ? 0.22 : 0.25})`,
    '--texto-no-destaque': tema.textoNoDestaque,
    'color-scheme': claro ? 'light' : 'dark',
    ...(tema.titulo ? { '--titulo': tema.titulo } : {}),
  };
}

// Pares de fonte. Só a fonte dos títulos muda; o texto corrido continua o mesmo.
export const FONTES = [
  { id: 'moderna', nome: 'Moderna', descricao: 'Títulos sem serifa, diretos', titulo: "'Outfit', 'Helvetica Neue', Arial, sans-serif" },
  { id: 'elegante', nome: 'Elegante', descricao: 'Títulos com serifa, acolhedores', titulo: "'Lora', Georgia, 'Times New Roman', serif" },
] as const;

export type IdFonte = (typeof FONTES)[number]['id'];

export function fontePorId(id?: string | null) {
  return FONTES.find((f) => f.id === id) || FONTES[0];
}

export function cssDoTema(tema: Tema, fonte?: string | null) {
  const variaveis = { ...variaveisDoTema(tema), '--fonte-titulo': fontePorId(fonte).titulo };
  const linhas = Object.entries(variaveis).map(([k, v]) => `${k}:${v}`);
  return `:root{${linhas.join(';')}}`;
}
