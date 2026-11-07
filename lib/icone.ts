import { fontePorId, type Tema } from './temas';

// Ícone da aba (favicon) gerado a partir do nome e do tema: a inicial com o ponto na cor de destaque.
// Usado quando o cliente não sobe um ícone próprio na Identidade.

export function iconeSvg(nome: string, tema: Tema, fonte?: string | null) {
  const inicial = (nome.trim()[0] || '•').toLowerCase().replace(/[<&>"']/g, '');
  const claro = tema.modo === 'claro';
  const fundo = claro ? tema.destaqueEscuro : tema.fundo;
  const letra = claro ? '#ffffff' : '#f5f5f7';
  const ponto = claro ? tema.fundo : tema.destaque;
  const serifa = fontePorId(fonte).id === 'elegante';
  const familia = serifa ? "Georgia, 'Times New Roman', serif" : "'Helvetica Neue', Arial, sans-serif";
  const larga = /[mwæœ]/.test(inicial); // letras largas encolhem para não encostar no ponto
  const tamanho = (serifa ? 44 : 42) * (larga ? 0.74 : 1);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${fundo}"/><text x="${larga ? 26 : 28}" y="47" text-anchor="middle" font-family="${familia}" font-weight="700" font-size="${tamanho}" fill="${letra}">${inicial}</text><circle cx="48" cy="45" r="5.5" fill="${ponto}"/></svg>`;
}
