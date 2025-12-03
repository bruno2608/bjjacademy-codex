# Autenticação e Check-in — Guia Central (MVP + visão futura)

Este documento consolida todos os fluxos de autenticação e presença do BJJ Academy PWA multi-academia. Ele deve ser a fonte única de verdade para telas (Next.js + Tailwind + DaisyUI), integrações futuras com Supabase/API e definições de dados.

- **PWA multi-academia**: o usuário sempre está vinculado a uma academia. Para papéis de staff, menus e permissões variam conforme o papel e a academia atual.
- **Estado atual**: os fluxos ainda usam mocks/stores locais, mas o comportamento descrito já antecipa a migração para API/Supabase.
- **Escopo MVP de autenticação + check-in**: login com mock, cadastro público de aluno via código de convite, primeiro acesso por convite, “esqueci/redefinir senha”, troca de senha logado, check-in manual do aluno e check-in por QR Code (leitura pelo aluno; geração pelo staff).

## 1. Visão geral de autenticação e papéis

Papéis principais e como eles enxergam o produto:

- **Aluno**: faz login, conclui cadastro/primeiro acesso, faz check-in manual ou por QR Code, vê dashboard do aluno.
- **Instrutor**: staff de apoio; vê presenças, pode gerar QR e registrar presença de alunos. Não promove papéis.
- **Professor**: staff líder da aula; controla presença, gera QR e pode promover **Instrutor**. Pode atribuir papéis para alunos da própria academia (instrutor) mas não para admin.
- **Admin da academia**: gerencia convites, configura papéis locais (promove alunos para instrutor/professor), acessa menus de QR e presenças.
- **Admin_TI**: visão técnica global. Acesso total, modo teste/impersonação, configura parâmetros (ex.: TTL do QR no futuro) e pode promover qualquer papel.

Regras de promoção (por papel):

- **Admin_TI →** pode atribuir `ADMIN`, `PROFESSOR`, `INSTRUTOR`, `ALUNO` (em qualquer academia) e habilitar usuários piloto.
- **Admin →** pode atribuir `PROFESSOR` ou `INSTRUTOR` a membros da própria academia e remover staff locais.
- **Professor →** pode promover alunos a `INSTRUTOR` na mesma academia.
- **Instrutor/Aluno →** não podem promover.

## 2. Mapa de telas do fluxo de autenticação

| Rota/tela | Campos | Validações de front | Estados de erro/sucesso | Redirecionamento em sucesso |
| --- | --- | --- | --- | --- |
| **/login** | email, senha, checkbox **Lembrar de mim** | campos obrigatórios; e-mail com regex simples; senha mínima de 10 caracteres; `rememberMe` boolean | Erro credenciais inválidas; usuário não habilitado; erro genérico | Dashboard do papel (`/dashboard` staff, `/dashboard-aluno` aluno). Respeita `redirect=/rota` se for caminho interno permitido. |
| **/signup** (cadastro público de aluno) | nomeCompleto, email, senha, confirmacaoSenha, telefone (opcional), dataNascimento (opcional), faixaAtual, grauAtual, codigoConviteSufixo, aceiteTermos | validações conforme tabela de campos; código de convite obrigatório | Erros de validação por campo; código inválido/expirado | Login automático e redirecionamento para dashboard do aluno. |
| **/forgot-password** | email | e-mail obrigatório e formato válido | Mensagem sempre genérica de envio de link (não revela se e-mail existe) | Mantém na tela com confirmação de envio. |
| **/reset-password** (token na query) | nova senha, confirmacaoSenha | senha mínima de 10 caracteres; confirmação igual à senha; token não expirado | Token inválido/expirado; senha fraca; erros genéricos | Redireciona para `/login` após sucesso com mensagem “senha alterada”. |
| **/primeiro-acesso** (via convite) | email (pré-preenchido ou bloqueado), nomeCompleto, senha, confirmacaoSenha, telefone (opcional), dataNascimento (opcional), faixaAtual, grauAtual, aceiteTermos | mesmas regras do cadastro; validação do token/convite | Convite inválido/consumido; erros de campo | Login automático e direciona para dashboard conforme papel no convite (aluno ou staff). |
| **Troca de senha (área logada)** | senha atual, nova senha, confirmacaoSenha | senha atual obrigatória; nova senha mínima 10 caracteres; confirmação igual | Senha atual incorreta; nova senha fraca; sucesso com aviso persistente | Mantém usuário logado; feedback inline. |

Notas gerais:
- Todos os formulários devem ser mobile-first (sem rolagem forçada). Feedback visual consistente (alertas para erro, banners de sucesso) e loading nos botões.
- Mensagens sensíveis (ex.: forgot-password) não devem vazar existência de conta.

## 3. Fluxos completos (passo a passo)

### Login
1. Usuário acessa `/login` (ou é redirecionado pelo middleware com `redirect=/rota`).
2. Preenche e-mail e senha, opcionalmente marca **Lembrar de mim** (controla duração do token/sessão; cookie de longa duração quando marcado).
3. Submete; se credenciais válidas e papéis permitidos, autentica e persiste token/localStorage.
4. Redireciona para `redirect` (se for caminho interno autorizado) ou para dashboard do papel (`/dashboard` staff, `/dashboard-aluno` aluno).

### Cadastro público de aluno (/signup)
1. Aluno acessa link público de cadastro da academia.
2. Informa **código de convite** (sufixo de 6 caracteres) + dados pessoais (nomeCompleto, e-mail, senha, confirmação, faixaAtual/grauAtual, telefone opcional, dataNascimento opcional) + aceiteTermos.
3. Front valida campos; backend valida convite (formato `BJJ-XXXXXX`, vigente e vinculado à academia).
4. Cria usuário como **ALUNO** vinculado à academia do convite.
5. Efetua login automático e envia para `/dashboard-aluno`.

### Cadastro de professor/instrutor/admin
- Usa a mesma UI de `/signup` ou `/primeiro-acesso`, mas o papel é atribuído por quem tem permissão:
  - Admin_TI pode criar/promover qualquer papel.
  - Admin pode criar professor/instrutor da própria academia.
  - Professor pode promover aluno → instrutor.
- Fluxo: criar convite com papel desejado → usuário completa dados → login automático → dashboard conforme papel (staff → `/dashboard`).

### Primeiro acesso via convite (/primeiro-acesso)
1. Usuário recebe link com token de convite (contém academia e papel sugerido).
2. Tela pré-preenche e bloqueia o e-mail do convite; solicita demais campos (nomeCompleto, senha, confirmação, opcional telefone/dataNascimento, faixaAtual/grauAtual, aceiteTermos).
3. Valida token (não expirado/consumido) e cria conta com papel do convite.
4. Faz login automático e redireciona para dashboard do papel.

### Esqueci / redefinir senha
1. `/forgot-password`: usuário informa e-mail; front valida formato e exibe mensagem de envio de link, sem confirmar existência.
2. Backend gera token de reset (hash + expiração curta) e envia link.
3. `/reset-password?token=...`: usuário define nova senha + confirmação; valida token e força senha mínima de 10 caracteres.
4. Em sucesso, invalida token, registra `used_at`, e redireciona para `/login` com aviso de sucesso.

### Troca de senha logado (MVP)
1. Dentro da área autenticada (perfil/conta), o usuário informa **senha atual**, **nova senha** e **confirmação**.
2. Front valida presença e igualdade de confirmação; backend valida senha atual e políticas de força.
3. Sucesso mantém sessão ativa; mostra confirmação. Erros: senha atual inválida ou senha fraca.
4. **Fase 2**: incluir exigência de logout global em todos os dispositivos ao trocar senha.

## 4. Fluxo de Check-in (Manual + QR Code)

### Visão geral
- Check-in manual do aluno e leitura de QR Code fazem parte do MVP. Geração de QR é feita por staff (professor/instrutor/admin/admin_ti). Logs avançados e modo totem ficam para fase futura.
- QR é **dinâmico por aula/horário/dia**, com expiração curta (TTL padrão 60s). Ao gerar, a aula fica **em andamento** e o professor é marcado presente automaticamente (origem `sistema`).

### Aluno — check-in manual
1. Acessa `/checkin` e vê “Treinos de hoje”.
2. Seleciona o treino e registra presença manual (origem `manual`).
3. Presença fica **pendente** até confirmação do professor ou fechamento da aula (pode virar **confirmado** ao fechar chamada).

### Aluno — check-in por QR Code
1. Acessa `/checkin/qrcode` com câmera embutida.
2. Lê QR válido dentro do TTL (token vinculado a treino/academia).
3. Backend valida token, vínculo do aluno e status da aula.
4. Registra presença automaticamente com status **confirmado** e origem `qr-code`.
5. Exibe modal de sucesso com opções **“Tentar novamente”** ou **“Voltar para check-in manual”** (`/checkin`).
6. “Treinos de hoje” atualiza status para **CONFIRMADO** em tempo real.

### Staff — check-in e QR
- **Menus estruturados para staff:**
  - **Presenças ▼**
    - **Check-in de Alunos** → `/presencas/check-in`
    - **Pendências de aprovação** → `/presencas/pendencias`
    - **Revisão de Presenças** → `/presencas/revisao`
  - **QR Code ▼** (somente professor/instrutor/admin/admin_ti)
    - **QR Code da Academia** → `/qrcode`
    - **Histórico de Validações** → `/qrcode/historico`
    - **Validar QR Code** → `/qrcode/validar` (oculto no MVP; fase futura para modo totem/carteirinha)

- **Geração de QR (staff)**
  1. Acessa `/qrcode`, sistema sugere a aula do dia; staff pode trocar manualmente.
  2. Ao gerar QR: aula vai para `em-andamento`; presença do professor marcada (`sistema`).
  3. QR tem **TTL 60s** (ajustável futuramente por Admin_TI). Sem botão de download no MVP.

- **Check-in de alunos pelo staff (/presencas/check-in)**
  1. Staff inicia aula/chamada, marca presenças manualmente.
  2. Pode fechar aula, convertendo pendentes para **confirmado** e registrando ausências.
  3. Leituras de QR aparecem em tempo real na lista de presenças do professor.

- **Planos futuros**: modo **Validar QR** como totem, logs detalhados (IP, device, localização) em revisão, compartilhamento/download de QR.

## 5. Modo Teste / Usuário piloto (Admin_TI)

- **Impersonação**: Admin_TI pode ativar modo teste para simular papéis (aluno, professor, etc.) sem alterar a autenticação real. A navegação usa o usuário “efetivo” simulado.
- **Presenças não persistem**: check-ins feitos em modo teste não devem ser registrados como presença real (conceito para backend futuro).
- **LGPD/segurança**: uso restrito a debugging e validação de fluxo; evitar acesso a dados pessoais reais. Registrar aviso em UI (banner) quando ativo.

## 6. Tabela de Campos de Autenticação (validação + dados)

| Campo | Telas onde aparece | Validação de front | Normalização no backend | Tipo/coluna sugerida | Observações de UX e segurança |
| --- | --- | --- | --- | --- | --- |
| email | login, signup, esqueci senha, primeiro acesso | obrigatório; regex simples de e-mail; sem espaços | `trim().toLowerCase()` antes de salvar/comparar | `varchar(254)` **UNIQUE**, indexada; comparação case-insensitive | Auto-foco no login; não expor se e-mail existe em mensagens de erro |
| senha | login, signup, primeiro acesso, reset, troca de senha | mínimo 10 caracteres; bloquear senhas óbvias (ex.: 123456, "senha") | armazenar apenas hash (bcrypt/Argon2id); nunca em texto puro | `text` ou `varchar` para hash (ex.: 255) | Exibir requisitos; botão de mostrar/ocultar senha |
| confirmacaoSenha | signup, primeiro acesso, reset, troca de senha | deve ser igual à senha; só no front | não persiste | — | Mostrar erro imediato se divergir |
| nomeCompleto | signup, primeiro acesso | obrigatório; mínimo 2 palavras; máx. ~120 caracteres | `trim()` + colapsar espaços múltiplos | `varchar(120)` | Usado em dashboards e convites; respeitar acentuação |
| username (fase 2) | geração automática, opcional em perfil | regex `^[a-z][a-z0-9._]{2,19}$`; começa com letra, minúsculo | gerar `primeiroNome + iniciais + sufixo numérico` para conflitos | `varchar(20)` **UNIQUE** | Exibir sugestão e disponibilidade; não obrigatório no MVP |
| telefone | signup, primeiro acesso (opcional) | máscara BR `(99) 99999-9999`; sem letras | armazenar apenas dígitos (`5534999999999`) | `varchar(16)` | Campo opcional; mostrar DDI predefinido BR |
| dataNascimento | signup, primeiro acesso (opcional) | se preenchido, não pode ser futura | armazenar `date` | `date` | Usar datepicker; validar timezone |
| faixaAtual | signup, primeiro acesso | select controlado (lista de faixas) | armazenar slug/ID da faixa | `varchar(50)` | Combina com `grauAtual`; obrigatório no onboarding |
| grauAtual | signup, primeiro acesso | inteiro 0–4 | armazenar inteiro | `smallint` | Validar faixa + grau coerentes |
| codigoConviteSufixo (front) | signup, primeiro acesso | 6 caracteres alfanuméricos `^[A-Za-z0-9]{6}$` | montar `BJJ-XXXXXX`, maiúsculo, salvar em `codigo_convite` | `varchar(10)` **UNIQUE** | Campo obrigatório no cadastro; feedback se inválido/expirado |
| aceiteTermos | signup, primeiro acesso | checkbox obrigatório | gravar boolean e timestamp (`aceitou_termos_em`) | `boolean`, `timestamp` | Bloquear submit sem aceite; link para termos |
| rememberMe | login | checkbox opcional | controla duração do token/sessão; não persiste em perfil | — | Mostrar tooltip sobre “manter conectado” |
| redirect (query) | login | aceitar apenas caminhos internos whitelisted | sanitizar e validar contra lista de rotas permitidas | — | Evitar open redirect; cair para dashboard se inválido |
| tokenReset (conceitual) | reset-password | token com expiração curta; validado no backend | armazenar hash + `expires_at`; marcar `used_at`, `ip_criacao` | tabela `password_reset_tokens` | Mensagens genéricas; bloquear reutilização |

## 7. Modelo de Dados (conceitual para autenticação e check-in)

> Referência conceitual para Supabase/API. Não é SQL final, apenas entidades e campos-chave.

- **usuarios**: `id`, `email`, `senha_hash`, `nome_completo`, `username` (futuro), `telefone`, `data_nascimento`, `faixa_atual`, `grau_atual`, `status` (ativo/piloto/bloqueado), `created_at`, `updated_at`.
- **usuarios_papeis**: `usuario_id`, `papel` (`ALUNO`, `INSTRUTOR`, `PROFESSOR`, `ADMIN`, `ADMIN_TI`), `academia_id`, `ativo_desde`, `ativo_ate` (opcional), `criado_por`.
- **academias**: `id`, `nome`, `codigo_convite` (`BJJ-XXXXXX`), `status`, `created_at`, `updated_at`.
- **password_reset_tokens**: `id`, `usuario_id`, `token_hash`, `expires_at`, `used_at`, `created_at`, `ip_criacao` (opcional).
- **convites**: `id`, `codigo_convite`, `papel_sugerido`, `academia_id`, `email` (opcional), `expires_at`, `used_at`, `created_at`, `criado_por`.
- **presencas**: `id`, `aluno_id`, `treino_id`, `aula_id`, `status` (`pendente`, `confirmado`, `ausente`, `cancelado`), `origem_registro` (`manual`, `qr-code`, `sistema`), `registrado_em`, `registrado_por` (para ações do staff), `ip`/`device` (futuro).
- **aulas**: `id`, `treino_id`, `data`, `hora_inicio`, `hora_fim`, `status_aula` (`planejada`, `em-andamento`, `fechada`), `professor_id`.
- **qrcode_logs** (fase 2): `id`, `aula_id`, `token_hash`, `usuario_id` (leitor), `resultado`, `ip`, `device`, `created_at`.

## 8. Referências de UX

- Seguir layout atual de login (card escuro com gradiente, formulário à direita) e manter padrão mobile-first.
- Telas de cadastro/esqueci senha/reset devem seguir padrões modernos (feedback imediato de erros, botões de loading, mensagens neutras em recuperação de senha).
- Não alterar o design nesta etapa; usar este documento como contrato funcional para próximas sprints.
