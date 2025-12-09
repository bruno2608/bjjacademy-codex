# Módulos e Telas – Aluno

## Navegação principal do aluno
- **Home (`/home`)**: hero de aluno (`HeroAlunoDashboard` via `useHeroAlunoDashboard`) e cards de acesso rápido para check-in, aulas, evolução. Role hardcoded para aluno no código atual.
- **Dashboard (`/dashboard`)**: placeholder textual; a navegação mostra o item, mas a tela ainda não traz métricas do aluno.

## Presenças e check-in
- **Check-in diário (`/checkin`)**: lista treinos do dia, status do check-in e calendário com marcação de presença/pendência. Usa `usePresencasStore`, `useTreinosStore`, `useCurrentAluno`; registra check-in (`registrarCheckin`) e alerta quando treino está fechado.
- **Hub de check-in (`/aluno/checkin`)**: cartões para escolher QR Code ou manual; lista últimos 5 check-ins do aluno com status e origem.
- **Check-in manual (`/aluno/checkin/manual`)**: confirma presença do dia com um clique (`registrarCheckinManual`), exibe confirmação e bloqueia duplicidade.
- **Check-in por QR Code (`/aluno/checkin/qrcode`)**: simula leitura do QR dinâmico da academia (`registrarCheckinQrCode`); mostra feedback de sucesso/erro e mensagem de uso.
- **Histórico de presenças (`/historico-presencas`)**: timeline filtrável (meses/faixa/status/treino) com totais; compartilhada com staff.

## Evolução e jornada
- **Evolução (`/evolucao`)**: usa `useAlunoDashboard` para calcular faixa atual, grau, aulas no grau, meta de aulas e projeção de próxima graduação; renderiza timeline combinando histórico do aluno + planos de graduação em `graduacoesStore`.
- **Graduações planejadas**: não há rota dedicada ao aluno; visão vem da timeline/planejamento em `/evolucao`.

## Agenda e perfil
- **Treinos (`/treinos`)**: grade semanal em leitura, agrupada por dia da semana a partir de `useTreinosStore`.
- **Perfil do aluno (`/perfil`)**: edição de nome/telefone/email/avatar; faixa/grau/plano em leitura; sincroniza `userStore` e `alunosStore` quando o aluno é o usuário logado.

## Onboarding e recuperação (mock)
- **Cadastro público (`/cadastro`)**: formulário com validações locais (nome/email/username/senha/código de convite), sem persistência real; TODO para integrar com authMockService.
- **Primeiro acesso / convite (`/acesso-convite`, `/primeiro-acesso`)**: valida token `BJJ-XXXXXX` e coleta dados; fluxo mockado sem criação real de usuário.
- **Esqueci/redefinir senha (`/esqueci-senha`, `/redefinir-senha`, `/forgot-password`, `/reset-password`)**: telas existem, porém sem integração backend.

## Observações de implementação
- Todos os dados exibidos para o aluno vêm das stores abastecidas por serviços mockados; alterações persistem em `localStorage`.
- RBAC: aluno tem acesso apenas às rotas mapeadas para `ALUNO` em `config/siteMap.ts` (check-in, dashboards, histórico, perfil, treinos); middleware redireciona para `/home` ou `/unauthorized` ao acessar telas restritas.
