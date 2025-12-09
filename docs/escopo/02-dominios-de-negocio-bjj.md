# Domínios de Negócio BJJAcademy

## Entidades principais
- **Academia**: unidade da rede. Possui código de convite (`codigoConvite`), contatos e flag de atividade. Relaciona-se com usuários/papéis, matrículas, turmas/treinos e aulas instanciadas.
- **Usuário / Papel**: `Usuario` guarda identidade (nome, email, avatar, status `invited/active/inactive`), enquanto `usuarios_papeis` relaciona usuário ↔ academia ↔ papel (`ALUNO`, `INSTRUTOR`, `PROFESSOR`, `ADMIN`, `ADMIN_TI`). Alias e normalização em `config/roles.ts`.
- **Aluno**: perfil esportivo do usuário (faixa/grau, plano, status ativo/inativo, histórico de graduações, aulas no grau/faixa). Sincroniza com o usuário logado via `alunoId` no `userStore`.
- **Matrícula**: vínculo do aluno com a academia/turma; status `ativo/inativo/trancado`, datas de início/fim e observações (tipado em `types/matricula.ts`).
- **Turma / Treino / Aula**: `turmas` agrupam alunos; `treinos` representam agenda semanal (nome, tipo, dia da semana, horário, ativo); `aulas` ou instâncias de treino registram a sessão de um dia (`status prevista/em_andamento/encerrada/cancelada`, horário, vínculos de academia/turma).
- **Presença**: registro por aluno/aula/treino com `status` (`PENDENTE`, `PRESENTE`, `FALTA`, `JUSTIFICADA`) e `origem` (`ALUNO`, `PROFESSOR`, `SISTEMA`, `QR_CODE`). Serviços atualizam status, fecham treinos e recalculam métricas.
- **Faixa / Regras de Graduação**: domínio de graduação define faixa (`slug`, categoria, graus máximos, ordem, tipo) e regras por faixa/grau (aulas mínimas, tempo mínimo, idade mínima). Visual das faixas (cores, ponteiras) fica separado em `data/mocks/bjjBeltMocks.ts`.
- **Graduação**: promoções planejadas ou concluídas (`tipo Faixa/Grau`, faixa atual → próxima, grau alvo, previsão/conclusão, instrutor, status `Planejado|Em progresso|Em avaliação|Pronto para avaliar|Concluído`). Históricos também vivem no perfil do aluno.
- **QR Code de check-in**: QR dinâmico por academia (renova a cada 60s no mock). Leituras geram logs (`resultado SUCESSO/FALHA`, motivo, data/hora) em `qrCheckinStore`.
- **Convite / Primeiro acesso**: fluxo mockado para validar token `BJJ-XXXXXX`, sugerir papel e coletar dados iniciais (`/acesso-convite`, `/primeiro-acesso`). Convites modelados em `data/mocks/db/convites.mock.ts`.
- **Recuperação de senha**: telas de esqueci/redefinir senha (`/esqueci-senha`, `/redefinir-senha`, `/forgot-password`, `/reset-password`) ainda mockadas; schema de `password_reset_tokens` documentado em `docs/db-model-bjjacademy-codex.md`.

## Relações conceituais
- Uma **Academia** possui muitos **Usuários** com diferentes **Papéis**; um usuário pode ter múltiplos papéis e pertencer a várias academias via `usuarios_papeis`.
- Um **Aluno** (usuário com papel ALUNO) possui **Matrículas** em academias/turmas e participa de **Aulas** (instâncias de **Treinos**).
- Cada **Aula** gera várias **Presenças** (uma por aluno inscrito), com status atualizável pelo aluno (check-in) ou staff (confirmação/reprovação/fechamento).
- A **Faixa** atual do aluno e suas **Regras de Graduação** determinam metas de aulas/tempo; **Graduações** registram conquistas e projeções futuras.
- **QR Codes** são emitidos pela academia/professor e validados pelo aluno; logs ficam disponíveis para auditoria do staff.
- **Convites** e tokens de reset de senha controlam onboarding e segurança, associados a usuários e academias.
