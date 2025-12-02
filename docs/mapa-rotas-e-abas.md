# Mapa de rotas e abas

Visão geral das rotas atuais (App Router) com tabs internas e blocos principais por página.

## Rotas públicas

| Rota | Layout/Componentes | Seções principais |
| --- | --- | --- |
| `/` | Redireciona para `/login` via `redirect` em `app/page.jsx`. | — |
| `/login` | Tela gamificada de acesso (`LoginPage`). | Formulário de e-mail/senha, seleção de papéis mock, call-to-action principal. |
| `/unauthorized` | Página simples de acesso negado. | Mensagem e link de retorno (conteúdo mínimo). |

## Área STAFF (desktop com sidebar)

| Rota | Abas/Tabs | Seções e blocos principais |
| --- | --- | --- |
| `/dashboard` (Professor/Instrutor/Admin) | Não há tabs; cards em grid. | Cabeçalho do professor com ações rápidas; **Treinos de hoje/Presenças por turma**; **Presenças pendentes (Revisar envios)**; **Próximas graduações**. |
| `/presencas` | Tabs internas: **Chamada do dia** e **Pendências** (`MinimalTabs`). | Header com contexto da turma; cards de resumo (Academia, Aula, Resumo da chamada); bloco “Chamada do dia” com filtros de data/turma e tabela de alunos; bloco “Pendências” filtrável por período. |
| `/alunos` | Sem tabs; operações via modais. | Hero com contadores (alunos ativos, check-ins semanais, graduações pendentes); filtros (busca, faixa, status, treino); tabela de alunos com faixa visual; modais de criação/edição/confirmação. |
| `/graduacoes` | Tabs internas: **Próximas** (`proximas`) e **Histórico** (`historico`). | Filtros (nome, faixa, status, tipo, período); cards resumidos (contadores); lista de graduações futuras; linha do tempo/histórico com faixas. |
| `/relatorios` | Não há tabs. | Header e card placeholder para painéis analíticos. |
| `/configuracoes` | Não há tabs; hub de links. | Header de acesso administrativo; grid de cartões para **Regras de graduação**, **Horários de treino**, **Tipos de treino**. |

## Área ALUNO (topo com pills/tabs)

| Rota | Abas/Tabs | Seções e blocos principais |
| --- | --- | --- |
| `/dashboard` (quando usuário só tem papel de aluno) | Sem tabs; cards em grid. | Hero do aluno (avatar/faixa), cards de métricas (aulas no grau, presenças, faltas, check-ins pendentes), lista de últimas presenças. |
| `/checkin` | Sem tabs. | Lista de treinos do dia, calendário mensal com status, botão de check-in e modal de feedback. |
| `/treinos` | Sem tabs. | Agenda semanal por dia com lista de treinos e responsáveis. |
| `/evolucao` | Sem tabs. | Card de progresso de faixa/grau, métricas de próximo passo, histórico de graduações combinado (planejadas + concluídas). |
| `/historico-presencas` | Sem tabs. | Filtros (mês, faixa, status, treino, busca), resumo estatístico e lista detalhada de presenças. |
| `/perfil` | Sem tabs. | Formulário/visualização de dados do usuário (avatar, info básica); ações pessoais. |

## Outras rotas e utilidades

- `/belt-demo`: vitrine de componentes de faixa (apoio visual).
- `/configuracoes/*`: previsto para subseções de regras/horários/tipos de treino (links já aparecem no hub).
- `/relatorios` e `/configuracoes` ficam ocultas no menu principal para alguns papéis, mas são acessíveis via navegação expandida.

