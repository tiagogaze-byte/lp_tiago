# Portal tiagogaze.com.br

Site pessoal do Tiago Azevedo, com blog editorial e painel próprio para publicar artigos.

## Como está montado

| Parte | O que usa | Para quê |
| --- | --- | --- |
| Site | Next.js 14, hospedado na Vercel | Páginas, blog e painel |
| Banco | Supabase (PostgreSQL) | Artigos, editorias e login do painel |
| Imagens | Supabase Storage, pasta `capas` | Capas e imagens dos artigos |
| Textos fixos | `content/site.ts` | Soluções, ferramentas, trajetória, contato |

Cada publicação no painel atualiza o site na hora, sem novo deploy.

## Ligar o banco (uma vez só)

1. Crie um projeto em supabase.com (o plano gratuito serve).
2. Abra **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**. Isso cria as tabelas, as regras de segurança, a pasta de imagens e as sete editorias.
3. Em **Authentication > Users > Add user**, crie seu login com `tiago.gaze@gmail.com` e uma senha forte. O arquivo de esquema já cadastra esse e-mail como administrador.
4. Em **Project Settings > API**, copie a **Project URL** e a chave **anon public**.

## Ligar na Vercel

No projeto `lp-tiago` da Vercel, em **Settings > Environment Variables**, cadastre:

| Nome | Valor |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | a Project URL do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | a chave anon public |
| `NEXT_PUBLIC_SITE_URL` | `https://www.tiagogaze.com.br` |

Depois, em **Settings > Domains**, adicione `www.tiagogaze.com.br` e `tiagogaze.com.br`, e siga as instruções de DNS que a Vercel mostrar no seu registro de domínio.

Enquanto o banco não estiver ligado, o blog mostra três artigos de exemplo e o painel avisa que falta configurar.

## Publicar um artigo

1. Entre em `tiagogaze.com.br/admin` com seu e-mail e senha.
2. Clique em **Novo artigo**.
3. Preencha título, resumo, texto, editoria, tags, palavra-chave e perguntas frequentes.
4. Escolha o status: **Rascunho** (só você vê), **Agendado** (entra no ar na data escolhida) ou **Publicado**.
5. Salve. A caixa **Checagem** mostra o que falta para o artigo render bem no Google e nas IAs.

Formatação do texto: `## Subtítulo`, `**negrito**`, `*itálico*`, `[texto do link](/ferramentas)`, `- item de lista`. A barra do editor faz isso com um clique, e a aba **Prévia** mostra como vai ficar.

## Editorias

Em **Painel > Editorias** você cria, renomeia, reordena, desativa ou exclui editorias. Desativar esconde do site sem apagar nada. Excluir só funciona quando a editoria não tem artigos.

## Mudar textos fixos do site

Soluções, ferramentas, áreas de experiência, WhatsApp e e-mail ficam em `content/site.ts`. Edite, faça commit e a Vercel publica sozinha.

## Para buscadores e IAs

O site já gera, sozinho e sempre atualizado:

- `/sitemap.xml`: lista de todas as páginas e artigos
- `/robots.txt`: libera buscadores e robôs de IA, bloqueia só o `/admin`
- `/feed.xml`: feed RSS do blog
- `/llms.txt`: resumo do site em texto puro, feito para assistentes de IA
- Dados estruturados em cada página: pessoa, artigo, perguntas frequentes e caminho de navegação

## Rodar no computador (opcional)

```bash
npm install
cp .env.example .env.local   # e preencha com os dados do Supabase
npm run dev                  # abre em http://localhost:3000
```

A LP anterior está guardada na pasta `legacy/`.
