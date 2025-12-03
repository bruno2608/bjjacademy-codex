# Status de Autenticação e Check-in

> **Documento consolidado:** use [`docs/auth-and-checkin-flow.md`](./auth-and-checkin-flow.md) como fonte única para regras de autenticação, perfis e check-in (manual + QR). Este arquivo registra o panorama histórico do MVP e limitações atuais.

## 1. Estado atual de autenticação

- **Usuários piloto apenas**: o login aceita qualquer e-mail/senha e aplica papéis mockados (admin/ti/aluno) conforme o e-mail ou seleção manual. Não há fluxo real de cadastro.
- **Sem recuperação de acesso**: funcionalidades de "Esqueci minha senha" ou redefinição não existem; dependemos de credenciais predefinidas e mocks de usuário.
- **Impersonação/testes por ADMIN_TI**: o perfil de TI/Admin pode se autenticar e testar jornadas de aluno ou staff para validar menus, permissões e presenças, sem criar novos usuários.

## 2. Modelo de presenças (conceitual)

- **Entidades principais**: `Aluno`, `Treino`, `Aula` (instância de treino no dia/horário), `Presença`, `Log de validação de QR`.
- **Campos-chave**:
  - `Presença.status`: `nao-registrado`, `pendente`, `confirmado`, `ausente`, `cancelado` (pode existir placeholder futuro para justificativas).
  - `Presença.origem`: `manual`, `qr-code`, `sistema` (usada para rastreabilidade e auditoria).
  - `Aula.statusAula`: `planejada`, `em-andamento`, `fechada` (a geração do QR marca a aula como `em-andamento`).
  - `LogValidacaoQR`: token/treino/academia/usuario/resultado/timestamp, usado para histórico e auditoria.
- **Relações**: um `Treino` gera múltiplas `Aula` (por dia/horário); cada `Aula` contém várias `Presença` de alunos e uma presença do professor; cada leitura de QR cria um `Log de validação de QR`.

## 3. Fluxos de check-in (MVP)

### Aluno — manual

1. Acessa `/checkin` e vê "Treinos de hoje".
2. Seleciona o treino e registra presença manualmente.
3. Status fica `pendente` (ou `confirmado` quando o professor fechar a aula/chamada).

### Staff — check-in de alunos

1. Acessa **Presenças → Check-in de Alunos** (`/presencas/check-in`).
2. Inicia a aula/chamada, marca presenças, faltas ou ajustes manuais.
3. Pode fechar a aula, atualizando pendentes para `confirmado` e deixando ausências/faltas registradas.

### QR Code — staff (geração)

1. Acessa **QR Code da Academia** (`/qrcode`).
2. O sistema detecta o treino do dia e pré-seleciona a aula (com possibilidade de troca manual).
3. Gera um QR dinâmico por treino/horário, com **TTL fixo de 60s** (configuração futura para ADMIN_TI).
4. Ao gerar o QR: a aula fica `em-andamento` e o professor é marcado presente automaticamente com origem `sistema`.
5. Não há botão de download do QR no MVP.

### QR Code — aluno (leitura)

1. Acessa **Check-in por QR Code** (`/checkin/qrcode`) com câmera embutida e instruções.
2. Lê o QR válido dentro do TTL.
3. Validação (mesmo que simulada por mocks) considera token não expirado, treino correto, academia correta e vínculo do aluno à turma.
4. Registra a presença automaticamente com status `confirmado` e origem `qr-code`.
5. Exibe modal de sucesso com opções **"Tentar novamente"** ou **"Voltar para check-in manual"** (`/checkin`).
6. Atualiza "Treinos de hoje" para mostrar o status **CONFIRMADO**.

## 4. Limitações e Backlog / Fase 2

- Rota **Validar QR Code** (`/qrcode/validar`) para leitura por carteirinha/totens — ficará oculta no MVP.
- Auditoria avançada em logs (IP, device, localização, motivo de validação) e filtros avançados no histórico de validações.
- Fluxo de solicitações de correção de presença (ex.: tela "Minhas solicitações" e formulário por tipo de ajuste).
- Configuração de TTL e políticas de QR por ADMIN_TI em tela dedicada.
- Download/compartilhamento do QR e variações de layout para impressão.
