# Fluxos Críticos de UX

## Login (mock atual)
1. Usuário acessa `/login`; tema é forçado para `zdark` e salvo em `localStorage` (`zekai-ui-theme`).
2. Preenche `identifier` (email ou usuário) e `senha`; validações locais exigem ambos os campos.
3. `handleSubmit` chama `userStore.login` → `authMockService.authMockLogin`, que verifica whitelist de usuários piloto e senha fixa `BJJ@pilot2025`.
4. Roles são normalizados, persistidos em cookie `bjj_roles` e `localStorage` (`bjj_token`, `bjj_user`); erros tratados: convite pendente, usuário inativo, credenciais inválidas.
5. Redirecionamento: query `redirect` segura (rota interna) ou fallback `/home` / `/dashboard`. Middleware reforça o RBAC em todas as rotas.
⚠ Dados e autenticação são inteiramente mockados; não há backend real.

## Onboarding / Primeiro acesso (mock)
1. **Convite**: `/acesso-convite` ou alias `/primeiro-acesso` aceita token `token` (query), sugere papel e pré-preenche email/nome.
2. Validação do convite é local (sem API); formulário coleta senha, dados pessoais e aceita termos. Campos de faixa/grau iniciais são opcionais.
3. **Cadastro público**: `/cadastro` aceita nome, email, username, senha, telefone, data de nascimento, faixa/grau e código de convite opcional; valida formato de username, senha ≥ 10 chars e termos.
4. Submissão apenas loga no console e redireciona para `/login` após sucesso local.
⚠ Fluxo não cria usuário real; integrações com auth/backoffice são planejadas.

## Check-in e presenças
1. **Aluno** acessa `/checkin` ou `/aluno/checkin`. A tela lista treinos ativos do dia (`useTreinosStore`) e check-ins do aluno (`usePresencasStore.carregarPorAluno`).
2. Ao clicar em **Registrar check-in** (`/checkin`), chama `presencasStore.registrarCheckin` com status `PENDENTE`; modal informa análise pelo professor. Em `/aluno/checkin/manual` grava PRESENTE via `registrarCheckinManual`; em `/aluno/checkin/qrcode` grava PRESENTE via `registrarCheckinQrCode`.
3. **Staff** acessa `/presencas/check-in` para confirmar manualmente, `/presencas/pendencias` para aprovar/reprovar pendentes e `/presencas/revisao` para revisar/excluir últimos 30 dias. Fechamento de treino troca pendentes para PRESENTE (regra no service).
4. **Histórico** em `/historico-presencas` consolida registros com filtros e totais.
⚠ Fontes de dados vêm de `data/mocks`/`data/mocks/db`, persistidas em `localStorage`; integração com API/BD é planejada.

## Evolução / Faixas
1. Aluno abre `/evolucao`; hook `useAlunoDashboard` coleta aluno logado (`useCurrentAluno`), regras de faixa, aulas no grau e graduações planejadas (`graduacoesStore`).
2. Tela mostra card de progresso de faixa (BjjBeltProgressCard), timeline combinando histórico do aluno + planos, e projeção da próxima graduação (percentual, aulas, estimativa).
3. Dados de faixa/grau são resolvidos por `faixaSlug` → `getFaixaConfigBySlug`; regras são mockadas no store de grad rules ou mockDb.
⚠ Cálculos dependem das stores mockadas; sem persistência externa.

## Gestão de alunos (staff)
1. Staff abre `/alunos`; `useAlunosStore` carrega alunos mockados e `useStaffDashboard` injeta métricas (ativos, totais, check-ins na semana, graduações pendentes).
2. Filtros: nome (≥3 letras), faixa, status, treinos frequentes (derivado de presenças). Busca usa slugs normalizados de faixa/status.
3. Ações: criar aluno via modal (salva em store e ressincroniza presenças), editar (leva para `/alunos/[id]` – ainda vazio) e excluir (diálogo de confirmação).
4. Tabela exibe faixa/grau com `BjjBeltStrip`, plano, status e contato; filtros e contadores são recalculados após qualquer operação.
⚠ Sem integração com API; rota de detalhe não implementada.
