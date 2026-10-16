import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { sessaoAtual } from '@/lib/auth';
import { gerarSlug } from '@/lib/util';

const TIPOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const LIMITE = 4 * 1024 * 1024; // 4 MB

// Recebe uma imagem do painel e guarda na Vercel Blob, numa pasta do cliente.
export async function POST(request: Request) {
  const sessao = await sessaoAtual();
  if (!sessao) return NextResponse.json({ erro: 'Sua sessão expirou. Entre de novo no painel.' }, { status: 401 });

  const form = await request.formData();
  const arquivo = form.get('arquivo');
  if (!(arquivo instanceof File)) return NextResponse.json({ erro: 'Nenhuma imagem foi enviada.' }, { status: 400 });
  if (!TIPOS.includes(arquivo.type)) return NextResponse.json({ erro: 'Use uma imagem JPG, PNG, WebP, GIF ou AVIF.' }, { status: 400 });
  if (arquivo.size > LIMITE) return NextResponse.json({ erro: 'A imagem passa de 4 MB. Reduza o tamanho e envie de novo.' }, { status: 400 });

  const extensao = arquivo.name.split('.').pop()?.toLowerCase() || 'jpg';
  const nome = gerarSlug(String(form.get('nome') || arquivo.name.replace(/\.[^.]+$/, ''))) || 'imagem';
  const caminho = `clientes/${sessao.clienteId}/${new Date().toISOString().slice(0, 7)}/${nome}.${extensao}`;

  try {
    const blob = await put(caminho, arquivo, { access: 'public', addRandomSuffix: true, contentType: arquivo.type });
    return NextResponse.json({ url: blob.url });
  } catch (erro) {
    return NextResponse.json({ erro: `Não foi possível guardar a imagem: ${(erro as Error).message}` }, { status: 500 });
  }
}
