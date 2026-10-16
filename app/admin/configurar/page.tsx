import { redirect } from 'next/navigation';
import { FormConfigurar } from '@/components/admin/FormConfigurar';
import { existeUsuario } from '../acoes';

export default async function Configurar() {
  if (await existeUsuario()) redirect('/admin/login');

  return (
    <div className="container login-caixa" style={{ maxWidth: 480 }}>
      <div style={{ display: 'grid', gap: 10 }}>
        <span className="marca">
          Tiago Azevedo<span style={{ color: 'var(--laranja)' }}>.</span>
        </span>
        <h1 style={{ fontSize: '1.8rem' }}>Configurar o painel</h1>
        <p style={{ color: 'var(--texto-suave)' }}>
          Crie seu acesso de administrador. Ao confirmar, o banco é preparado e os artigos e editorias atuais do site são copiados pra ele.
          Esta tela só aparece uma vez.
        </p>
      </div>
      <FormConfigurar />
    </div>
  );
}
