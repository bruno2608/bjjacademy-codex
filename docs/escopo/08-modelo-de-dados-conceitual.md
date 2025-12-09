# Modelo de Dados Conceitual

> Baseado nos mocks tipados em `data/mocks/db` e nos tipos em `types/*`. Representa relações de negócio; colunas/implementação física serão definidas na API/BD.

## Entidades e relações
- **Academia**
  - possui muitos **Usuários** (via **UsuáriosPapéis**)
  - possui muitas **Matrículas**, **Turmas**, **Aulas** e **Presenças** associadas
  - emite **Convites** e **QR Codes** de check-in
- **Usuário**
  - pertence a muitas **Academias** com papéis distintos (tabela **UsuáriosPapéis**)
  - pode ser **Aluno** (perfil esportivo) e/ou **Staff** (instrutor/professor/admin)
  - tem **Status** (`invited/active/inactive`), `faixaAtualSlug`, `grauAtual`, contatos
- **Papel** / **UsuáriosPapéis**
  - enum de papéis (`ALUNO`, `INSTRUTOR`, `PROFESSOR`, `ADMIN`, `ADMIN_TI`)
  - relacionamento N:N entre Usuário e Academia, determinando permissões e menus
- **Aluno**
  - representa o praticante (faixa/grau, plano, status ativo/inativo, histórico de graduações, aulas no grau/faixa)
  - vincula-se a **Usuário** via `alunoId`
  - possui muitas **Matrículas**, **Presenças** e **Graduações**
- **Matrícula**
  - liga **Aluno/Usuário** à **Academia** (e opcionalmente à **Turma**)
  - controla `status` (`ativo/inativo/trancado`), datas de início/fim e plano
- **Turma / Treino / AulaInstância**
  - **Turma** pertence à Academia e agrupa alunos
  - **Treino** define o agendamento semanal (nome/tipo/dia/horário/ativo)
  - **AulaInstância** materializa o treino em uma data/hora, com `status prevista/em_andamento/encerrada/cancelada`
  - cada **Aula** gera **Presenças**
- **Presença**
  - registro por aluno/aula/treino, com `status PENDENTE|PRESENTE|FALTA|JUSTIFICADA` e `origem ALUNO|PROFESSOR|SISTEMA|QR_CODE`
  - relaciona-se a **Aluno**, **Aula/Treino**, **Turma** e **Academia**; possui timestamps e observação
- **Faixa**
  - catálogo de faixas (slug, nome, categoria, graus máximos, ordem, tipo preta)
  - usada por **Alunos**, **Graduações** e **Regras de Graduação**
- **Regras de Graduação**
  - requisitos por faixa/grau (aulas mínimas, tempo mínimo, idade mínima, meta de aulas no grau)
  - referenciam **Faixa**
- **Graduação**
  - promoções planejadas ou concluídas (`tipo Faixa/Grau`, faixa atual → próxima, grau alvo, previsão/conclusão, instrutor, status)
  - pertencem a um **Aluno/Usuário** e a uma **Faixa**
- **Convite**
  - token de primeiro acesso (`BJJ-XXXXXX`), vinculado a **Academia**, com papel sugerido, expiração e uso
- **QR Code / Logs**
  - tokens dinâmicos por Academia/Aula; logs de validação registram resultado, motivo, data/hora, aluno (quando identificado)
- **Recuperação de senha**
  - tokens de reset associados a **Usuário**, com expiração/uso

## Notas
- Faixas visuais (cores/ponteiras) ficam em `data/mocks/bjjBeltMocks.ts` e são resolvidas por `faixaSlug`; não fazem parte do domínio de BD, apenas do design system.
- Mocks atuais replicam esse modelo de forma simplificada; serviços e stores usam clones em memória e `localStorage`, mas contratos já refletem as entidades acima.
