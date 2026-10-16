import { get } from '@vercel/blob';

// Entrega as imagens de um espaço Blob privado. Os nomes têm sufixo aleatório,
// então cada arquivo nunca muda e pode ficar em cache por um ano.
export async function GET(_request: Request, { params }: { params: { caminho: string[] } }) {
  const caminho = params.caminho.map(decodeURIComponent).join('/');
  if (!caminho.startsWith('clientes/') || caminho.includes('..')) return new Response('Não encontrado', { status: 404 });

  try {
    const resultado = await get(caminho, { access: 'private' });
    if (!resultado || resultado.statusCode !== 200) return new Response('Não encontrado', { status: 404 });
    return new Response(resultado.stream, {
      headers: {
        'Content-Type': resultado.blob.contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      },
    });
  } catch {
    return new Response('Não encontrado', { status: 404 });
  }
}
