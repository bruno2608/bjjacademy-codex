# 🥋 **BJJ Academy — PWA (Next.js + Tailwind)**

Bem-vindo à base do novo **BJJ Academy PWA**, plataforma web progressiva focada na gestão completa de academias de Jiu-Jitsu. O projeto une a identidade "Zenko Focus" com uma camada visual gamificada inspirada nas versões mobile [`bjjacademyapp`](https://github.com/bruno2608/bjjacademyapp) e backend [`bjj-academy-api`](https://github.com/bruno2608/bjj-academy-api).

- PWA com cache inicial e ícones completos.
- Rotas protegidas por middleware + RBAC centralizado.
- Dados mockados em Zustand com persistência local para simular produção.

## 🧩 **Requisitos**

- **Node.js 18+**
- **npm** (ou compatível)

## 🛠️ **Como executar localmente**

```bash
npm install
npm run dev
# Acesse http://localhost:3000
```

### Comandos principais

- `npm run dev`: ambiente de desenvolvimento com hot reload.
- `npm run build`: build otimizado de produção (App Router).
- `npm run start`: sobe o build gerado.
- `npm run lint`: validações do Next.js + ESLint.

## 🔐 **Autenticação mock e perfis**

- Login em `/login` aceita qualquer e-mail/senha e gera token fake.
- Papéis são inferidos pelo e-mail (campos contendo `admin`, `ti`, `aluno`/`student`) ou pela seleção manual.
- Dados persistem em `localStorage`/cookies (`bjj_token`, `bjj_roles`, `bjj_user`), permitindo refresh sem perder sessão.

## 🚀 **Stack principal**

- **Next.js 14** (App Router) + **React 18**
- **Tailwind CSS 3** com tema “Zenko Focus” (preto, branco, vermelho e cinzas)
- **Zustand** para estado global mockado
- **Lucide React** para ícones
- **next-pwa** com `manifest.json`, service worker custom e cache offline

## 🎯 **O que já está pronto**

| Área | Destaques |
| --- | --- |
| Autenticação | Tela de login remodelada com hero informativo, seleção de papéis mock e token persistido (localStorage). |
| Dashboard (staff) | Hero `PageHero`, cards gradiente e alternância entre visões **Geral · Presenças · Graduações**. |
| Alunos | CRUD mockado com formulário em modal, distribuição de faixas e destaques para próximos graduandos. |
| Presenças (staff) | Registro rápido focado no check-in do dia, dropdown de sessão do dia, múltiplos treinos e correção via modal dedicado. |
| Graduações | Tela inspirada no app com hero, cards progressivos, linha do tempo e agendamento por grau/faixa. |
| Configurações | Hub com Regras de Graduação editáveis, Horários de Treino com persistência local e Tipos de Treino customizáveis. |
| Permissões | Site map centralizado, middleware de RBAC e navegação (sidebar/mobile/tablet) filtrada pelos papéis do usuário. |
| Área do Aluno | Layout separado com dashboard próprio, check-in, treinos do aluno, evolução e perfil editável (nome/contato/foto) via `/perfil`; histórico de presenças e relatórios pessoais acessíveis pelo menu do usuário. |
| Check-in do Aluno | Tela dedicada com lógica automática/pendente conforme horário do treino e status visível ao professor. |
| PWA | Manifesto completo, service worker com cache básico e ícones em múltiplos tamanhos. |

## 🧪 **Mocks e persistência**

- Seeds em `data/` abastecem stores do Zustand (`alunos`, `presenças`, `treinos`, `graduacoes`).
- Alterações são guardadas em `localStorage` para simular ambiente real sem backend.
- Middleware (`middleware.ts`) lê papéis persistidos para redirecionar usuários não autorizados.

## 📍 **Rotas úteis**

- `/login`: seleção de papel e acesso inicial.
- `/dashboard`, `/dashboard-instrutor`: visões de staff.
- `/dashboard-aluno`, `/checkin`: jornada do aluno com status em tempo real.
- `/configuracoes/*`: gestão de regras de graduação, horários e tipos de treino.

## 🧭 **Mapa da estrutura**

```
app/
  (authenticated)/
    dashboard-instrutor/
    dashboard/
    alunos/
      [id]/
    presencas/
      historico/
    graduacoes/
    regras-graduacao/
    horarios/
    tipos-treino/
    configuracoes/
      graduacao/
      treinos/
      tipos-treino/
    relatorios/
    historico-presencas/
    perfil/
  (student)/
    dashboard-aluno/
    treinos/
    checkin/
    evolucao/
  login/
components/
  ui/
services/
  api.js
  alunosService.js
  presencasService.js
  graduacoesService.js
store/
  userStore.ts
  treinosStore.ts
  tiposTreinoStore.ts
  graduationRulesStore.ts
public/
  icons/
  manifest.json
  service-worker.js
styles/
  globals.css
  tailwind.css
```

### Perfis e permissões

- **Aluno (`student`):** acessa `(student)` com `/dashboard-aluno`, `/checkin`, `/treinos`, `/evolucao`, histórico em `/presencas/historico`, `/perfil` (apenas nome/telefone/foto) e relatórios pessoais. Tentativas de abrir telas administrativas redirecionam para o dashboard do aluno.
- **Instrutor/Professor (`instructor`/`teacher`):** utilizam `(authenticated)` com `/dashboard-instrutor`, presenças, check-in manual, `/graduacoes`, `/regras-graduacao`, `/horarios`, `/tipos-treino`, `/relatorios`, `/presencas/historico` (qualquer aluno) e `/perfil` editável.
- **Admin/TI (`admin`/`ti`):** têm acesso total, incluindo as configurações da academia e cadastros avançados.
- **Site map + middleware:** `config/siteMap.ts`, `config/roles.ts` e `middleware.ts` filtram links e protegem as rotas com RBAC centralizado baseado no papel salvo via Zustand.

## 📌 Funções por perfil, telas e ações

| Perfil | Telas liberadas | Ações permitidas |
| --- | --- | --- |
| **Aluno (`aluno`/`student`)** | `/dashboard-aluno`, `/checkin`, `/treinos`, `/evolucao`, `/historico-presencas`, `/perfil`, `/relatorios` | Check-in próprio (status automático ou pendente), visualizar treinos do dia, acompanhar evolução e progresso de faixas, consultar histórico e relatórios pessoais, editar informações básicas do perfil. |
| **Instrutor (`instrutor`/`instructor`)** | Tudo do aluno + `/dashboard`, `/presencas`, `/alunos`, `/relatorios` | Registrar/editar presenças de qualquer aluno, aprovar/recusar check-ins pendentes, lançar ausências justificadas, cadastrar/editar alunos via modal, acessar relatórios e visão geral do painel staff. |
| **Professor (`professor`/`teacher`)** | Tudo do instrutor + `/configuracoes`, `/configuracoes/graduacao`, `/configuracoes/treinos`, `/configuracoes/tipos-treino`, `/graduacoes` | Fechar treinos do dia, configurar regras de graduação, horários e tipos de treino, criar/editar agendamentos de graduação, marcar treinos como fechados para impedir check-ins tardios. |
| **Admin/TI (`admin`/`ti`)** | Acesso total (qualquer rota) | Todas as ações anteriores, além de manutenção ampla de dados mockados, testes de RBAC e navegação irrestrita para QA. |

> As permissões são derivadas de `config/siteMap.ts` e normalizadas em `config/roles.ts`, garantindo coerência entre a navegação (sidebar, mobile e hero links) e o middleware de rota.

### Check-in do aluno (mock)

- **Treinos do dia** são carregados da store de presenças com horário, professor e tipo (Gi/No-Gi).
- **Regras de horário:** check-in automático até o início do treino ou +30min; fora desse intervalo abre modal de confirmação e registra status **pendente** para aprovação do professor.
- **Limites:** um registro por treino, com status exibido no histórico do aluno e na tela de presenças do professor.

## 🧾 Regras de negócios principais

- **RBAC centralizado:** papéis são normalizados (`config/roles.ts`) e persistidos no `localStorage`/cookies pela `userStore`, aplicando o filtro de rotas no `middleware.ts` e nos componentes de navegação.
- **Janela de check-in do aluno:** a store `presencasStore` considera uma janela de **30 minutos** a partir do horário do treino; dentro dela o status é `CHECKIN` com hora registrada, fora dela o registro fica como `PENDENTE` para aprovação docente. Check-ins duplicados são ignorados para o mesmo aluno/treino/data.
- **Fechamento de treino:** ao usar **fechamento rápido** (`presencasStore.fecharTreinoRapido`), todos os check-ins viram `CONFIRMADO`, ausências são criadas automaticamente para alunos ativos sem registro e o treino fica marcado como fechado, bloqueando novos check-ins.
- **Controle de status de presenças:** professores/instrutores podem aprovar (`CONFIRMADO`), rejeitar (`AUSENTE`) ou justificar (`AUSENTE_JUSTIFICADA`) registros, inclusive cancelar treinos específicos do dia.
- **Regras de graduação configuráveis:** matriz completa em `config/graduationRules.ts` com requisitos de idade mínima, tempo de faixa, aulas mínimas e faixas seguintes. A `graduationRulesStore` permite ajustes por faixa ou por grau (stripe) com persistência local.
- **Sincronização de alunos:** toda alteração de presença recalcula progressão de alunos (`presencasStore` → `alunosStore`), mantendo contadores de aulas no grau/faixa atual para dashboards e timelines.

### Componentes compartilhados de UI

- `PageHero`: cartão heroico reutilizado nas páginas do painel.
- `Card`, `Table`, `AttendanceTable`, `Modal`, `PresenceForm`, `GraduationList`, `GraduationTimeline`.
- Botões, inputs e cards seguem a mesma linguagem visual (bordas arredondadas, gradientes suaves, brilho vermelho).

## 🤝 **Contribuindo**

1. `git checkout -b feature/nova-feature`
2. `git commit -m "feat: descrição"`
3. Abra um Pull Request descrevendo a melhoria

## 📄 **Licença**

Projeto proprietário de **Bruno Alves França**.

---

> **BJJ Academy — Evolve Your Training**
>
> Estrutura pronta para conectar com a API oficial e escalar o sistema de gestão da sua academia.
