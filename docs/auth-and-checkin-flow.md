# Autenticação e Check-in — Guia Central (MVP + visão futura)

> **Status:** Atualizado em 06/12/2025  
> **Fonte principal:** [01-visao-geral-bjjacademy-codex.md](./01-visao-geral-bjjacademy-codex.md)

Documento mestre para o PWA de gestão de academias de Jiu-Jitsu (Next.js 14 + Tailwind + DaisyUI + Zustand). Serve como contrato funcional entre front (mocks/services/stores atuais) e o backend futuro (Supabase + API própria). Todas as sprints de autenticação e check-in devem partir daqui.

## 1. Visão geral

- **Contexto**: PWA multi-academia com perfis de aluno e staff. Navegação e permissões dependem do papel e da academia ativa.
- **Estado atual**: ainda operamos com mocks + services + stores; não há backend real. Os fluxos descritos já refletem o comportamento esperado quando conectarmos Supabase/API.
- **Perfis de usuário**:
  - `ALUNO`
  - `INSTRUTOR`
  - `PROFESSOR`
  - `ADMIN` (admin da academia)
  - `ADMIN_TI` (visão técnica/mode teste)
- **Regras principais por papel (resumo)**:
  - `ALUNO`: check-in próprio (manual/QR), visualização de treinos e histórico.
  - `INSTRUTOR`: marca presenças da turma, pode abrir aulas/QR, sem gerir papéis.
  - `PROFESSOR`: tudo do instrutor + pode promover alunos a `INSTRUTOR` da própria academia.
  - `ADMIN`: tudo do professor + pode promover/demover `INSTRUTOR`/`PROFESSOR` na academia e gerar convites.
  - `ADMIN_TI`: visão de teste/impersonação, pode definir qualquer papel em qualquer academia, libera menus ocultos.
- **Papel desta doc**: única fonte de verdade para telas, regras de negócio, validações e modelo conceitual de dados (autenticação e check-in).

## 2. Mapa de telas de autenticação

| Rota/tela | Campos exibidos | Validações de front (MVP) | Mensagens de erro/sucesso | Redirecionamento em sucesso | Status (MVP/Fase 2) |
| --- | --- | --- | --- | --- | --- |
| **/login** | email, senha, checkbox **Lembrar de mim**, param opcional `redirect` | email e senha obrigatórios; regex simples para email; senha ≥ 10; `rememberMe` boolean | Credenciais inválidas; usuário não habilitado; mensagem genérica em falha inesperada | Respeita `redirect` interno whitelisted; senão, `/dashboard` (staff) ou `/dashboard-aluno` (aluno). Se múltiplas academias, manter seleção anterior ou pedir escolha. | **MVP** |
| **/signup** (cadastro público de aluno) | nomeCompleto, email, senha, confirmacaoSenha, telefone (opcional), dataNascimento (opcional), faixaAtual, grauAtual, codigoConviteSufixo, aceiteTermos | Campos obrigatórios conforme tabela; código de convite no formato `XXXXXX`; confirmação igual à senha | Erros de campo; código de convite inválido/expirado | Login automático e dashboard do aluno | **MVP** |
| **/forgot-password** | email | email obrigatório e válido; resposta sempre genérica | Mensagem: “Se este e-mail existir, enviaremos um link...” | Mantém na tela com alerta de envio | **Fase 2 (mock/documentado)** |
| **/reset-password** | nova senha, confirmacaoSenha; token na query | token válido; senha ≥ 10; confirmação igual | Token inválido/expirado; senha fraca; sucesso com aviso | Redireciona para `/login` com toast de sucesso | **Fase 2 (mock/documentado)** |
| **/primeiro-acesso** (via convite) | email travado do convite, nomeCompleto, senha, confirmacaoSenha, telefone (opcional), dataNascimento (opcional), faixaAtual, grauAtual, aceiteTermos | Validações iguais ao signup; validação do token/convite obrigatório | Token inválido/consumido; campos com erro; sucesso ativa conta | Login automático; dashboard conforme papel do convite (aluno ou staff) | **MVP** |
| **Troca de senha logado** (Perfil/Minha conta) | senha atual, nova senha, confirmacaoSenha | senha atual obrigatória; nova senha ≥ 10; confirmação igual; bloqueio de senhas triviais | Senha atual incorreta; senha fraca; sucesso com aviso persistente | Mantém sessão ativa; feedback inline | **MVP** |

## 3. Fluxos completos (passo a passo)

### 3.1 Login
- `/login` aceita opcional `redirect=/rota` (apenas caminhos internos; idealmente whitelist: `/dashboard`, `/checkin`, `/treinos`, `/evolucao`).
- Passos: preencher email/senha → opcional **Lembrar de mim** (sessão prolongada) → submit.
- Backend valida credenciais e papéis; salva token; normaliza papéis.
- Redireciona para `redirect` válido; se ausente/negado, dashboard padrão do papel.

### 3.2 Cadastro público de aluno (`/signup`)
- Campos: `nomeCompleto`, `email`, `senha`, `confirmacaoSenha`, `telefone` (opcional), `dataNascimento` (opcional), `faixaAtual`, `grauAtual`, `codigoConviteSufixo` (6 chars), `aceiteTermos` (obrigatório).
- Normalizar email/telefone/código antes de salvar.
- Backend valida convite (`codigo_convite` = `BJJ-XXXXXX`) e vincula academia.
- Cria usuário **ALUNO** → login automático → `/dashboard-aluno`.

### 3.3 Cadastro / convite de instrutor/professor/admin
- Cadastro público (`/signup`) **sempre** cria ALUNO.
- Convites são gerados por staff autorizado:
  - Tela no painel do professor/admin: **“Convidar por e-mail / link”** com campos: nome do convidado, e-mail, `papelSugerido` (ALUNO/INSTRUTOR/PROFESSOR), academia.
  - Ao salvar: gerar token + link (`/primeiro-acesso?token=...`) e botão “Copiar link de convite” (MVP não envia e-mail automático).
- Promoção/flags no perfil do aluno (staff): toggles “É instrutor?” / “É professor?” atualizam `usuarios_papeis`.
- Regras de quem pode promover:
  - `ADMIN_TI` → qualquer papel em qualquer academia.
  - `ADMIN` → promover/demover INSTRUTOR e PROFESSOR na própria academia.
  - `PROFESSOR` → promover alunos a `INSTRUTOR` na sua academia.
  - `ALUNO` / `INSTRUTOR` → não alteram papéis.

### 3.4 Primeiro acesso via convite (`/primeiro-acesso`)
- Usuário acessa link com token de convite.
- Email vem travado; `papelSugerido` define papel inicial (ajustável depois por Admin/Admin_TI se necessário).
- Campos: nome completo, senha + confirmação, telefone (opcional), data de nascimento (opcional), faixa/grau, aceite dos termos.
- Ao concluir: ativa usuário, faz login automático, redireciona para dashboard do papel.

### 3.5 Esqueci minha senha / redefinir senha
- `/forgot-password`: campo email; mensagem sempre genérica (“Se este e-mail existir...”); cria token de reset com expiração curta e envia link `/reset-password?token=...` (conceito, fase 2).
- `/reset-password`: valida token; campos nova senha + confirmação; salva hash, invalida token; redireciona para `/login` com sucesso.

### 3.6 Troca de senha logado
- Dentro da área autenticada (Perfil/Minha conta).
- Campos: senha atual, nova senha, confirmação.
- Apenas este fluxo é entregável no MVP; reset por e-mail pode ficar mockado/documentado.

## 4. Fluxo de Check-in (Manual + QR Code)

### 4.1 Check-in manual do aluno
- Rota `/checkin` → aba “Manual”.
- Visual com calendário/lista de treinos do dia/semana (UI já mockada).
- Ação “Registrar presença” grava `origem = 'manual'`; status inicial pode ser pendente até validação do professor.

### 4.2 Check-in manual pelo professor/instrutor
- Menu Staff: **Presenças → Check-in de Alunos** (`/presencas/check-in`).
- Professor/instrutor vê lista de alunos da turma e marca PRESENÇA/FALTA/JUSTIFICADA etc.
- Pode fechar aula e confirmar pendentes; ADMIN/ADMIN_TI pode editar registros para auditoria/correção.

### 4.3 Check-in via QR Code (MVP)
- Menus Staff:
  - **Presenças ▼** → `Check-in de Alunos` (`/presencas/check-in`), `Pendências de aprovação` (`/presencas/pendencias`), `Revisão de Presenças` (`/presencas/revisao`).
  - **QR Code ▼** (professor, instrutor, admin, admin_ti): `QR Code da Academia` (`/qrcode`), `Histórico de Validações` (`/qrcode/historico`), `Validar QR Code` (`/qrcode/validar` — criado mas oculto no MVP, visão futura).
- **Geração do QR (staff):**
  - `/qrcode` mostra QR dinâmico do treino/aula atual; tenta pré-selecionar com base no horário; professor pode trocar turma.
  - QR é dinâmico por aula/horário/dia com expiração curta (ex.: 1 minuto, renovado automaticamente). Sem download de QR fixo.
  - Ao “abrir” a aula/QR, registra presença do professor (origem `sistema`). Botão “não haverá aula” registra cancelamento.
- **Leitura do QR (aluno):**
  - `/checkin` terá subabas: `QR Code` (câmera embutida) e `Manual`.
  - Aluno lê QR; backend valida token/horário/aluno/turma; registra presença **confirmada** (`status = confirmado`, `origem = 'qr'`).
  - Feedback visual/modal de sucesso; atualização em tempo real (ou refresh mock) na tela do professor.

### 4.4 Revisão de presenças
- Rota `/presencas/revisao` lista presenças (últimos 30 dias) com filtros e destaca origem (QR vs manual).
- Fase futura: “ver detalhes” (horário exato, IP/device) e tela de pendências especiais/suspeitas.

### 4.5 Validar QR Code (visão futura)
- Rota `/qrcode/validar` como modo totem/juiz de campeonato: ler carteirinha com QR do aluno e registrar presença em eventos.
- Exibir dados básicos do aluno; registrar resultado (`sucesso`/`erro`/`expirado`).
- No MVP a rota/menú existe mas fica oculto para usuários finais.

## 5. Modo Teste / Admin_TI

- `ADMIN_TI` tem “modo teste” para impersonar usuários piloto (aluno/professor/instrutor) e validar fluxos dos dois lados.
- UI deve mostrar badge/bandeira “Modo teste / impersonando <nome>”.
- MVP: sem log detalhado; futuro: registrar em log de acesso/auditoria (LGPD) quem iniciou/encerrou impersonação e ações feitas.

## 6. Tabela de Campos de Autenticação (contrato front/back)

| Campo | Telas | Validação (front) | Normalização (back) | Tipo/coluna sugerida no banco | Observações de UX/segurança |
| --- | --- | --- | --- | --- | --- |
| email | login, signup, esqueci senha, primeiro acesso | Obrigatório; regex simples; sem espaços | `trim().toLowerCase()` antes de salvar/comparar | `varchar(254)` **UNIQUE**; comparação case-insensitive | Mensagens genéricas para não revelar existência de conta |
| senha | login, signup, primeiro acesso, reset, troca de senha | Mínimo 10 caracteres; bloquear senhas triviais | Armazenar apenas hash (bcrypt ou Argon2id) | `varchar(255)` para hash | Botão mostrar/ocultar; nunca expor critérios exatos na mensagem de erro |
| confirmacaoSenha | signup, primeiro acesso, reset, troca de senha | Deve ser igual à senha; validação só no front | Não persiste | — | Mostrar erro imediato se divergir |
| nomeCompleto | signup, primeiro acesso | Obrigatório; mínimo 2 palavras; máximo ~120 chars | `trim()` + colapsar espaços múltiplos | `varchar(120)` | Usado em convites e dashboards |
| username (fase 2) | geração automática, perfil | Regex `^[a-z][a-z0-9._]{2,19}$`; minúsculo | Gerar `primeiroNome + iniciais + número` se conflito | `varchar(20)` **UNIQUE** | Não obrigatório no MVP; exibir disponibilidade |
| telefone | signup, primeiro acesso (opcional) | Máscara BR `(99) 99999-9999`; apenas dígitos | Armazenar só dígitos (`5534999999999`) | `varchar(20)` | Opcional; indicar DDI BR por padrão |
| dataNascimento | signup, primeiro acesso (opcional) | Não permitir datas futuras | `date` | `date` | Validar timezone; usar datepicker |
| faixaAtual | signup, primeiro acesso | Dropdown controlado (tabela de faixas) | Armazenar slug/ID | `varchar(50)` | Combina com `grauAtual`; obrigatório no onboarding |
| grauAtual | signup, primeiro acesso | Inteiro 0–4 | Armazenar inteiro | `smallint` | Validar coerência com faixa |
| codigoConviteSufixo (front) / codigo_convite (persistido) | signup, primeiro acesso | 6 chars alfanuméricos `^[A-Za-z0-9]{6}$` | Montar `BJJ-XXXXXX`, uppercase | `varchar(10)` **UNIQUE** | Campo obrigatório; feedback se inválido/expirado |
| aceiteTermos | signup, primeiro acesso | Checkbox obrigatório | Gravar boolean + timestamp (`aceitou_termos_em`) | `boolean`, `timestamp` | Bloquear submit sem aceite; link para termos |
| rememberMe | login | Checkbox opcional | Controla duração do token/sessão | — | Explicar “manter conectado” |
| redirect | login | Aceitar apenas caminhos internos; preferir whitelist | Sanitizar e validar; se inválido, ignorar | — | Evitar open redirect |
| Campos de reset (conceito) | reset-password | Token obrigatório e vigente | Tabela `password_reset_tokens` com hash/expiração | `token_hash`, `expires_at`, `used_at`, `created_at` | Mensagem de envio genérica; bloquear reutilização |

## 7. Modelo de Dados (conceitual)

> Esboço mínimo para implementação futura (Supabase/API). Não são migrations.

- **usuarios**
  - id
  - email
  - username
  - senha_hash
  - nome_completo
  - telefone
  - data_nascimento
  - faixa_atual_slug
  - grau_atual
  - status (`invited`, `active`, `inactive`)
  - aceitou_termos (boolean), aceitou_termos_em (timestamp)
  - criado_em, atualizado_em

- **usuarios_papeis**
  - id
  - usuario_id
  - academia_id
  - papel (`ALUNO`, `INSTRUTOR`, `PROFESSOR`, `ADMIN`, `ADMIN_TI`)
  - criado_em

- **academias**
  - id
  - nome
  - codigo_convite (`BJJ-XXXXXX`)
  - ativo (boolean)

- **convites**
  - id
  - token_hash
  - email
  - papel_sugerido
  - academia_id
  - expires_at
  - used_at
  - created_at
  - criado_por

- **password_reset_tokens**
  - id
  - usuario_id
  - token_hash
  - expires_at
  - used_at
  - created_at

- **presencas**
  - id
  - aluno_id
  - treino_id
  - data_hora
  - status (`presente`, `falta`, `justificada`, `pendente`, `cancelada`)
  - origem (`manual`, `qr`)
  - criado_em

- **qrcode_logs** (visão futura)
  - id
  - treino_id
  - aluno_id
  - token_qr
  - resultado (`sucesso`, `erro`, `expirado` etc.)
  - ip, user_agent (futuro)
  - criado_em

