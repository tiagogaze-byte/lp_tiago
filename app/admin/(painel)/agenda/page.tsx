import Link from 'next/link';
import { agendaDoMes, rascunhosSemData, type ItemAgenda } from '@/lib/admin';
import { exigirSessao } from '@/lib/auth';

type Props = { searchParams: { mes?: string } };

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const ROTULO = { publicado: 'Publicado', agendado: 'Agendado', rascunho: 'Rascunho' } as const;

// Datas no horário de Brasília (UTC-3).
function diaLocal(iso: string) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(new Date(iso));
}
function horaLocal(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}
function hojeLocal() {
  return diaLocal(new Date().toISOString());
}
function somarMes(ano: number, mes: number, delta: number) {
  const d = new Date(Date.UTC(ano, mes - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export default async function Agenda({ searchParams }: Props) {
  const { clienteId } = await exigirSessao();
  const atual = /^\d{4}-\d{2}$/.test(searchParams.mes || '') ? searchParams.mes! : hojeLocal().slice(0, 7);
  const [ano, mes] = atual.split('-').map(Number);

  const inicio = `${atual}-01T00:00:00-03:00`;
  const fim = `${somarMes(ano, mes, 1)}-01T00:00:00-03:00`;
  const [itens, rascunhos] = await Promise.all([agendaDoMes(clienteId, inicio, fim), rascunhosSemData(clienteId)]);

  const porDia = new Map<string, ItemAgenda[]>();
  for (const item of itens) {
    if (!item.publicado_em) continue;
    const dia = diaLocal(item.publicado_em);
    porDia.set(dia, [...(porDia.get(dia) || []), item]);
  }

  const primeiroDiaSemana = new Date(Date.UTC(ano, mes - 1, 1)).getUTCDay();
  const diasNoMes = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  const celulas: (string | null)[] = [
    ...Array.from({ length: primeiroDiaSemana }, () => null),
    ...Array.from({ length: diasNoMes }, (_, i) => `${atual}-${String(i + 1).padStart(2, '0')}`),
  ];
  while (celulas.length % 7 !== 0) celulas.push(null);

  const hoje = hojeLocal();
  const agendadosNoMes = itens.filter((i) => i.status === 'agendado').length;
  const publicadosNoMes = itens.filter((i) => i.status === 'publicado').length;

  return (
    <>
      <div className="admin-titulo">
        <div style={{ display: 'grid', gap: 4 }}>
          <h1>Agenda editorial</h1>
          <span style={{ color: 'var(--texto-fraco)', fontSize: '0.9rem' }}>
            {publicadosNoMes} publicado(s) e {agendadosNoMes} agendado(s) em {MESES[mes - 1]}
          </span>
        </div>
        <div className="linha-acoes">
          <Link href={`/admin/agenda?mes=${somarMes(ano, mes, -1)}`} className="botao botao-secundario botao-pequeno" aria-label="Mês anterior">
            ←
          </Link>
          <strong style={{ minWidth: 150, textAlign: 'center', fontFamily: 'var(--fonte-titulo)', textTransform: 'capitalize' }}>
            {MESES[mes - 1]} {ano}
          </strong>
          <Link href={`/admin/agenda?mes=${somarMes(ano, mes, 1)}`} className="botao botao-secundario botao-pequeno" aria-label="Próximo mês">
            →
          </Link>
          <Link href="/admin/agenda" className="botao-texto">
            Hoje
          </Link>
        </div>
      </div>

      <div className="agenda-legenda">
        <span className="status status-publicado">Publicado</span>
        <span className="status status-agendado">Agendado</span>
        <span className="status status-rascunho">Rascunho com data</span>
        <span style={{ color: 'var(--texto-fraco)' }}>Clique num dia para programar um artigo nele.</span>
      </div>

      <div className="envolve-tabela">
        <div className="agenda">
          {DIAS.map((d) => (
            <div key={d} className="agenda-cabeca">
              {d}
            </div>
          ))}
          {celulas.map((dia, i) =>
            dia ? (
              <div key={dia} className={`agenda-dia ${dia === hoje ? 'hoje' : ''} ${dia < hoje ? 'passado' : ''}`}>
                <div className="agenda-numero">
                  <span>{Number(dia.slice(8))}</span>
                  {dia >= hoje && (
                    <Link href={`/admin/artigos/novo?data=${dia}`} className="agenda-mais" aria-label={`Programar artigo em ${dia}`}>
                      +
                    </Link>
                  )}
                </div>
                {(porDia.get(dia) || []).map((item) => (
                  <Link key={item.id} href={`/admin/artigos/${item.id}`} className={`agenda-item agenda-${item.status}`} title={`${ROTULO[item.status]} · ${item.titulo}`}>
                    <small>{item.publicado_em ? horaLocal(item.publicado_em) : ''}</small>
                    <span>{item.titulo}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div key={`vazio-${i}`} className="agenda-dia agenda-fora" />
            ),
          )}
        </div>
      </div>

      <section style={{ marginTop: 40, display: 'grid', gap: 14, maxWidth: 820 }}>
        <h2 style={{ fontSize: '1.2rem' }}>Rascunhos sem data</h2>
        {rascunhos.length === 0 ? (
          <p style={{ color: 'var(--texto-fraco)' }}>Nenhum rascunho esperando data. Use o + num dia do calendário para começar um artigo já programado.</p>
        ) : (
          <div className="envolve-tabela">
            <table className="tabela-admin">
              <tbody>
                {rascunhos.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link href={`/admin/artigos/${r.id}`} className="titulo-link">
                        {r.titulo}
                      </Link>
                    </td>
                    <td style={{ color: 'var(--texto-suave)' }}>{r.editoria_nome || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
