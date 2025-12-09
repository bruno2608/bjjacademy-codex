# Contexto do Produto e Personas

## Contexto de negócio
- Academias de Jiu-Jitsu multiunidade precisam controlar cadastro de alunos/staff, matrículas, turmas/treinos, check-ins, presenças e evolução de faixas/graus.
- O PWA atual entrega o fluxo principal de presença e acompanhamento de evolução usando dados mockados; integrações com API/banco são planejadas para manter os mesmos contratos de services/stores.

## Papéis e objetivos
- **Aluno**: registra presenças (manual ou QR), consulta agenda (`/treinos`), acompanha histórico (`/historico-presencas`) e progresso de graduação (`/evolucao`), edita dados básicos em `/perfil`.
- **Instrutor**: confirma/ajusta presenças (`/presencas/check-in`, `/presencas/pendencias`, `/presencas/revisao`), usa histórico consolidado, acompanha alunos e graduações.
- **Professor**: tudo do instrutor + gestão de graduações (`/graduacoes/*`) e configurações (regras, treinos, tipos).
- **Admin / Dono / Staff**: acesso amplo às telas do staff e configurações; usa mesmos componentes de navegação e RBAC.
- **Admin TI**: acesso total, com compatibilidade de alias `ti` → `ADMIN_TI`; pode usar impersonação mockada no `userStore` para QA.

## Papéis no código
- Enum central em `config/roles.ts`: `ALUNO`, `INSTRUTOR`, `PROFESSOR`, `ADMIN`, `ADMIN_TI` (`ROLE_KEYS` e aliases `ROLE_ALIASES`).
- Permissões básicas em `ROLE_PERMISSIONS` (edição própria, graduação, ver área admin) e herança de papéis via `normalizeRoles` (professor inclui instrutor+aluno, admin inclui todos).
- Navegação e RBAC: `config/siteMap.ts` define rotas permitidas por papel; `middleware.ts` lê `bjj_roles` e redireciona quando não autorizado; `lib/navigation.js` monta menus top/drawer/QR por papel.

## Estados de usuário e sessão
- Status de usuário referenciados em tipos e serviços: `invited | active | inactive` (`types/session.ts`, `authMockService` mapeia erros `USUARIO_CONVITE_PENDENTE` e `USUARIO_INATIVO`).
- Sessão mockada em `store/userStore.ts`: persistência local (`bjj_token`, `bjj_roles`, `bjj_user`, `bjj_impersonation`), hidratação automática e impersonação opcional.
- Login atual exige senha piloto `BJJ@pilot2025` e usuário presente na whitelist mock (montada a partir de `data/mocks/db`).
