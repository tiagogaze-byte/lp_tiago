# Portal tiagogaze.com.br

Site pessoal do Tiago Azevedo, com blog editorial e painel próprio para publicar artigos.

## Como está montado

| Parte | O que usa | Para quê |
| --- | --- | --- |
| Site | Next.js 14, hospedado na Vercel | Páginas, blog e painel |
| Banco | Neon (PostgreSQL), conectado pela aba Storage da Vercel | Artigos, editorias, clientes e logins |
| Imagens | Vercel Blob (tiagogaze-imagens) | Capas e imagens dos artigos |
| Textos fixos | `content/site.ts` | Soluções, ferramentas, trajetória, contato |

Cada publicação no painel atualiza o site na hora, sem novo deploy.

## Ligar o banco (uma vez só)

1. Na Vercel, aba **Storage**, conecte um banco **Neon** e um **Blob** ao projeto. As chaves vão sozinhas para o projeto.
2. Publique o site e abra `/admin/configurar`.
3. Crie seu acesso (nome, e-mail e senha). Nesse momento o banco é preparado e os artigos e editorias atuais são copiados para ele.

Essa tela só aparece uma vez. Depois disso, o acesso é por `/admin/login`.

Enquanto o banco não estiver configurado, o blog mostra os artigos que estão em `content/exemplos.ts`.

## Domínio

Em **Settings > Domains** do projeto na Vercel, adicione `www.tiagogaze.com.br` e `tiagogaze.com.br` e siga as instruções de DNS que a Vercel mostrar no seu registro de domínio.

## Publicar um artigo

1. Entre em `tiagogaze.com.br/admin` com seu e-mail e senha.
2. Clique em **Novo artigo**.
3. Preencha título, resumo, texto, editoria, tags, palavra-chave e perguntas frequentes.
4. Escolha o status: **Rascunho** (só você vê), **Agendado** (entra no ar na data escolhida) ou **Publicado**.
5. Salve. A caixa **Checagem** mostra o que falta para o artigo render bem no Google e nas IAs.

Para editar, clique no artigo na lista. A capa fica na coluna da direita (**Enviar imagem**, até 4 MB, ideal 1600 × 900 px).

## Agenda editorial

Em **Painel > Agenda** você vê o mês em calendário: publicados em verde, agendados em amarelo. Clique no **+** de um dia para começar um artigo já programado para aquela data. Artigos agendados entram no ar sozinhos na data marcada (em até um minuto).

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
cp .env.example .env.local   # e preencha com os dados do Neon e do Blob
npm run dev                  # abre em http://localhost:3000
```

A LP anterior está guardada na pasta `legacy/`.
