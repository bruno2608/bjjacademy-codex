# Modelo de Dados — BJJ Academy Codex (MVP)

> **Status:** 08/12/2025  
> **Escopo:** Documentação de domínio + proposta de “mock DB” centralizado. Não altera o sistema visual de faixas (cores/tokens/palette).

## 1) Visão geral do modelo
- PWA multi-academia com papéis (`ALUNO`, `INSTRUTOR`, `PROFESSOR`, `ADMIN`, `ADMIN_TI`), autenticação mockada e check-in manual/QR.
- Entidades principais: academias, usuários, papéis/atribuições, matrículas, faixas (domínio), regras de graduação, graduações, turmas, aulas (instâncias), presenças, convites/reset de senha, logs/QR (futuro).
- Diferenciar: **faixas de domínio** (regras de graduação) vs **sistema visual** (BJJ_BELT_VISUALS/BjjBeltStrip). O visual não é alterado por este documento.

## 2) Entidades de domínio (MVP)

### academias
- Campos: `id`, `nome`, `codigo_convite` (BJJ-XXXXXX), `ativo`, `criado_em`, `atualizado_em`.
- Relações: `usuarios_papeis.academia_id`, `matriculas.academia_id`, `turmas.academia_id`, `aulas.academia_id`.

### usuarios
- Campos: `id`, `email`, `senha_hash`, `nome_completo`, `telefone`, `data_nascimento`, `status` (`invited/active/inactive`), `faixa_atual_slug`, `grau_atual`, `aceitou_termos`, `aceitou_termos_em`, `criado_em`, `atualizado_em`.
- Relações: `usuarios_papeis.usuario_id`, `matriculas.usuario_id`, `presencas.aluno_id`, `graduacoes.usuario_id`, `password_reset_tokens.usuario_id`.

### papeis (enum/tabela de referência)
- Valores: `ALUNO`, `INSTRUTOR`, `PROFESSOR`, `ADMIN`, `ADMIN_TI`.
- Consumido por `usuarios_papeis.papel`.

### usuarios_papeis
- Campos: `id`, `usuario_id`, `academia_id`, `papel`, `criado_em`.
- Relações: fk para `usuarios`, fk para `academias`.

### matriculas
- Campos: `id`, `usuario_id`, `academia_id`, `status` (`ativa/inativa/pause`), `plano` (texto), `data_inicio`, `data_fim`, `criado_em`, `atualizado_em`.
- Relações: fk `usuario_id` → `usuarios`, fk `academia_id` → `academias`.

### faixas (domínio, não visual)
- Campos: `id`, `slug` (ex.: `azul`, `preta-professor`), `nome`, `categoria` (`ADULTO/INFANTIL/HONORIFICA`), `graus_maximos`, `ordem` (progressão), `tipo_preta` (`padrao/competidor/professor`), `ativa` (bool).
- Relações: referenciada por `regras_graduacao.faixa_slug`, `graduacoes.faixa_slug`, `usuarios.faixa_atual_slug`.

### regras_graduacao
- Campos: `id`, `faixa_slug`, `grau` (0..n), `aulas_minimas`, `tempo_minimo_meses`, `meta_aulas_no_grau` (progress bar), `observacoes`.
- Relações: fk `faixa_slug` → `faixas.slug`.

### graduacoes
- Campos: `id`, `usuario_id`, `faixa_slug`, `grau` (nullable), `data`, `instrutor`, `descricao`, `origem` (`manual/sistema`), `criado_em`.
- Relações: fk `usuario_id` → `usuarios`; fk `faixa_slug` → `faixas.slug`.

### turmas
- Campos: `id`, `academia_id`, `nome`, `descricao`, `nivel` (texto), `dias_da_semana` (array), `horario_inicio`, `horario_fim`, `instrutor_id` (staff principal), `ativa`.
- Relações: fk `academia_id` → `academias`; fk `instrutor_id` → `usuarios`; `aulas.turma_id`.

### aulas (instâncias de treino)
- Campos: `id`, `turma_id`, `academia_id`, `data`, `horario_inicio`, `horario_fim`, `status` (`aberta`, `encerrada`, `cancelada`), `origem_abertura` (`sistema/professor`), `qr_token` (dinâmico), `qr_expires_at`.
- Relações: fk `turma_id` → `turmas`; fk `academia_id` → `academias`; `presencas.aula_id`.

### presencas
- Campos: `id`, `aula_id`, `aluno_id`, `data_hora`, `status` (`confirmada`, `falta`, `justificada`, `pendente`, `cancelada`), `origem` (`manual`, `qr`), `registrado_por` (usuario_id), `criado_em`.
- Relações: fk `aula_id` → `aulas`; fk `aluno_id` → `usuarios`.

### convites
- Campos: `id`, `token_hash`, `email`, `papel_sugerido`, `academia_id`, `expires_at`, `used_at`, `created_at`, `criado_por`.
- Relações: fk `academia_id` → `academias`; usado no fluxo `/primeiro-acesso`.

### password_reset_tokens
- Campos: `id`, `usuario_id`, `token_hash`, `expires_at`, `used_at`, `created_at`.
- Relações: fk `usuario_id` → `usuarios`.

### qrcode_logs (futuro)
- Campos: `id`, `aula_id`, `aluno_id`, `token_qr`, `resultado` (`sucesso/erro/expirado`), `ip`, `user_agent`, `criado_em`.
- Relações: fk `aula_id`, fk `aluno_id`.

## 3) Mocks atuais encontrados
- Diretório `data/` (legados): `mockAlunos.ts`, `mockPresencas.ts`, `mockGraduacoes.ts`, `mockInstrutores.ts`. Usados por telas legadas; campos misturam visual (faixa texto) e domínio.
- Diretório `data/mocks/` (mais recente/canonical):
  - `mockUsuarios`, `mockPapeis`, `mockUsuariosPapeis`, `mockAcademias`, `mockMatriculas`, `mockTurmas`, `mockAulasInstancias`, `mockQrCheckin`, `mockAlunos` (versão resumida).
  - `bjjBeltMocks`/`bjjBeltUtils` (apenas visual, paleta OK).
- Serviços que consomem mocks (via `services/*`):
  - auth/usuarios/papeis: `authMockService`, `usuariosService`, `papeisService`, `usuarios_papeis` via mocks em `data/mocks`.
  - academias/matriculas/turmas/aulas: `academiasService`, `matriculasService`, `turmasService`, `aulasService` leem `data/mocks`.
  - presenças: `presencasService` ainda lê `data/mockPresencas` (legado).
  - dashboards: `useAlunoDashboard`, `useStaffDashboard` chamam apenas `getFaixaConfigBySlug` (visual) — não usam regras de graduação de domínio.
  - QR: `qrCheckinService` usa `data/mocks/mockQrCheckin`.
- Estado atual: faixas visuais bem definidas; não há tabela/mock de regras de graduação ou de faixas de domínio separada dos mocks visuais. Presenças/graduações têm duplicação (`data/mockGraduacoes` vs nada em `data/mocks`). Alguns dados “inventados na tela” persistem (dashboards calculam estatísticas sem fonte única).

## 4) Proposta de “mock DB” centralizado
- Estrutura sugerida em `/data/mocks/db`:
```
/data/mocks/db
  academias.mock.ts
  usuarios.mock.ts
  papeis.mock.ts           // enum/lista
  usuariosPapeis.mock.ts
  matriculas.mock.ts
  faixas.mock.ts           // domínio (slug, categoria, grausMaximos, ordem, tipo_preta)
  regrasGraduacao.mock.ts  // aulas/tempo por grau/faixa
  graduacoes.mock.ts
  turmas.mock.ts
  aulas.mock.ts            // instâncias (data/hora/status/qr)
  presencas.mock.ts
  convites.mock.ts
```
- Agregador:
```ts
export const mockDb = {
  academias,
  usuarios,
  papeis,
  usuariosPapeis,
  matriculas,
  faixas,
  regrasGraduacao,
  graduacoes,
  turmas,
  aulas,
  presencas,
  convites,
} as const;
```
- Consumo:
  - Serviços (ex.: `dashboardAluno.service.ts`, `dashboardStaff.service.ts`, `perfil.service.ts`) devem ler do `mockDb` em vez de inventar dados em cada hook/tela.
  - `presencasService` e `graduações` migram para `data/mocks/db/presencas.mock.ts`/`graduacoes.mock.ts`.
  - Stores Zustand podem receber o mock via serviço (ex.: `loadDashboardAluno` chama serviço que lê `mockDb`).

### Separação faixa de domínio vs visual
- Faixas de domínio: tabela `faixas.mock.ts` + `regrasGraduacao.mock.ts` definem slug, categoria, graus, aulas/tempo mínimos.
- Sistema visual: permanece em `src/tokens/bjjBeltTokens.ts`, `src/design/bjj/bjjBeltPalette.ts`, `data/mocks/bjjBeltMocks.ts`, componentes BJJ (`BjjBeltStrip`, `BjjBeltProgressCard`). Não mover nem misturar nos mocks de domínio.
- Ligação sugerida nas telas: resolver faixa do aluno pelo slug (domínio) e, em seguida, resolver visual via `getFaixaConfigBySlug` apenas para renderização.

## 5) Exemplos de campos (mock DB)
- `faixas.mock.ts`: `{ slug: "azul", nome: "Faixa Azul", categoria: "ADULTO", grausMaximos: 4, ordem: 2, tipoPreta: null, ativa: true }`.
- `regrasGraduacao.mock.ts`: `{ faixaSlug: "azul", grau: 1, aulasMinimas: 50, tempoMinimoMeses: 6, metaAulasNoGrau: 125 }`.
- `graduacoes.mock.ts`: `{ usuarioId: "u1", faixaSlug: "roxa", grau: null, data: "2024-05-10", instrutor: "prof-1", origem: "manual" }`.
- `aulas.mock.ts`: `{ id: "a1", turmaId: "t1", academiaId: "aca1", data: "2025-12-08", horario_inicio: "19:00", horario_fim: "20:30", status: "aberta", qr_token: "abc", qr_expires_at: ... }`.
- `presencas.mock.ts`: `{ id: "p1", aulaId: "a1", alunoId: "u3", status: "confirmada", origem: "qr", data_hora: "...", registrado_por: "uInstrutor" }`.

## 6) Como as telas usariam
- Configuração de Graduação (admin): lê `faixas` + `regrasGraduacao`, permite editar metas; visual de faixas (BJJ) só para exibir strip.
- Evolução / Dashboard do aluno: pega `usuarios.faixa_atual_slug` + `graduacoes` + `regrasGraduacao` para progressão; renderiza strip com `getFaixaConfigBySlug`.
- Dashboards staff: usam `aulas`, `presencas`, `turmas`, `usuarios_papeis` para compor métricas; faixas visuais apenas para cards e badges.

## 7) Próximos passos (checklist)
- Migrar mocks legados (`data/mockPresencas`, `data/mockGraduacoes`, `data/mockAlunos`) para a estrutura `/data/mocks/db`.
- Centralizar serviços para ler `mockDb` (ex.: `presencasService`, `dashboard` services) e remover dados inventados em hooks.
- Criar mocks de `faixas` (domínio) e `regrasGraduacao` alinhados aos slugs existentes em `bjjBeltMocks`.
- Adicionar `mockDb` exportado para facilitar consumo futuro por Supabase/API.
- Manter sistema visual de faixas intacto; apenas referenciá-lo por slug para renderização.
