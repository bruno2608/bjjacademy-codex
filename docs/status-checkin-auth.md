# Status do módulo de presença e autenticação mockada

## O que existe hoje

- **Auth mock**
  - `userStore` com `effectiveUser`, suporte a impersonação/"modo teste" de TI e hidratação automática do usuário armazenado.
  - Login baseado em whitelist mock (service `authMockLogin`), gravação de roles em cookies/localStorage e normalização de perfis (ADMIN/ADMIN_TI herdam permissões de aluno e staff).
- **Área do aluno**
  - Dashboard do aluno.
  - Check-in manual do aluno (rota `/aluno/checkin/manual`).
  - Check-in por QR Code (rota `/aluno/checkin/qrcode`, com simulação de leitura).
  - Treinos do aluno.
  - Evolução.
- **Área de staff**
  - Check-in de alunos.
  - Pendências de aprovação / revisão de presenças.
  - QR Code da academia (gerar, validar e histórico de validações).

## Diagnóstico rápido

- Presenças usam store unificada (`presencasStore`) consumindo serviços mock; fluxos de aluno e staff compartilham os mesmos dados.
- Guards globais via `middleware` + `siteMap` direcionam usuários autenticados, mas páginas de aluno adicionam validação extra de role quando necessário.
- Impersonação permite que TI simule diferentes papéis sem alterar o login principal.
- O fluxo de QR Code do aluno ainda é mockado (simulação de leitura), mas já registra presença via origem `QR_CODE` na store.
- Staff possui telas próprias de QR Code estáveis; não expostas na navegação do aluno.

## Próximos passos sugeridos

- Consolidar fluxo de login/cadastro/reset de senha para preparar integração real.
- Definir interface única para backend real de presenças (incluindo origens manual/QR/professor) e alinhar mocks.
- Implementar leitura real de QR Code no aluno (camera + lib de leitura), reutilizando ações da store.
- Reforçar validações de acesso por role nas rotas de aluno/staff para evitar heranças indesejadas de permissões.
- Revisar consistência de dados entre treinos/aulas e presenças (ex.: fechamento de treinos e pendências).
