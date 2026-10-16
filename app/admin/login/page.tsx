import { redirect } from 'next/navigation';
import { FormLogin } from '@/components/admin/FormLogin';
import { sessaoAtual } from '@/lib/auth';
import { existeUsuario } from '../acoes';

export default async function Login() {
  if (!(await existeUsuario())) redirect('/admin/configurar');
  if (await sessaoAtual().catch(() => null)) redirect('/admin');

  return (
    <div className="container login-caixa">
      <div style={{ display: 'grid', gap: 8 }}>
        <span className="marca">
          Tiago Azevedo<span style={{ color: 'var(--laranja)' }}>.</span>
        </span>
        <h1 style={{ fontSize: '1.8rem' }}>Entrar no painel</h1>
      </div>
      <FormLogin />
    </div>
  );
}
