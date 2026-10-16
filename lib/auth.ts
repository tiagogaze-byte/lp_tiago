import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { umaLinha } from './db';

const COOKIE = 'sessao_painel';
const DURACAO_DIAS = 30;

export type Sessao = { usuarioId: string; clienteId: string; nome: string; email: string; perfil: 'dono' | 'admin' | 'editor' };

// Chave de assinatura: AUTH_SECRET, se existir; senão, derivada do endereço do banco (que já é secreto).
function chave() {
  const base = process.env.AUTH_SECRET || process.env.DATABASE_URL || '';
  return createHash('sha256').update(`painel:${base}`).digest();
}

function assinar(dados: string) {
  return createHmac('sha256', chave()).update(dados).digest('base64url');
}

export async function gerarHash(senha: string) {
  return bcrypt.hash(senha, 12);
}

export async function conferirSenha(senha: string, hash: string) {
  return bcrypt.compare(senha, hash);
}

export function criarSessao(usuarioId: string) {
  const expira = Date.now() + DURACAO_DIAS * 864e5;
  const dados = Buffer.from(JSON.stringify({ u: usuarioId, e: expira })).toString('base64url');
  cookies().set(COOKIE, `${dados}.${assinar(dados)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(expira),
  });
}

export function encerrarSessao() {
  cookies().delete(COOKIE);
}

function lerCookie(): string | null {
  const valor = cookies().get(COOKIE)?.value;
  if (!valor) return null;
  const [dados, assinatura] = valor.split('.');
  if (!dados || !assinatura) return null;
  const esperado = Buffer.from(assinar(dados));
  const recebido = Buffer.from(assinatura);
  if (esperado.length !== recebido.length || !timingSafeEqual(esperado, recebido)) return null;
  try {
    const { u, e } = JSON.parse(Buffer.from(dados, 'base64url').toString());
    if (typeof u !== 'string' || Date.now() > e) return null;
    return u;
  } catch {
    return null;
  }
}

export async function sessaoAtual(): Promise<Sessao | null> {
  const usuarioId = lerCookie();
  if (!usuarioId) return null;
  const linha = await umaLinha<{ id: string; cliente_id: string; nome: string; email: string; perfil: Sessao['perfil'] }>(
    'select u.id, u.cliente_id, u.nome, u.email, u.perfil from usuarios u join clientes c on c.id = u.cliente_id where u.id = $1 and c.situacao = $2',
    [usuarioId, 'ativo'],
  );
  if (!linha) return null;
  return { usuarioId: linha.id, clienteId: linha.cliente_id, nome: linha.nome, email: linha.email, perfil: linha.perfil };
}

export async function exigirSessao(): Promise<Sessao> {
  const sessao = await sessaoAtual();
  if (!sessao) redirect('/admin/login');
  return sessao;
}
