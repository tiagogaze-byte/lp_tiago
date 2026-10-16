export function gerarSlug(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function tempoDeLeitura(markdown: string) {
  const palavras = markdown.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

export function formatarData(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  });
}

export function listaDeTexto(valor: FormDataEntryValue | null) {
  return String(valor || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}
