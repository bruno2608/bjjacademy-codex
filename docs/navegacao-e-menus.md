# Navegação e menus propostos

> **Status:** Atualizado em 06/12/2025  
> **Fonte principal:** [01-visao-geral-bjjacademy-codex.md](./01-visao-geral-bjjacademy-codex.md)

Consolidações para manter a navegação alinhada ao layout aprovado (sidebar STAFF + pills ALUNO) com ajustes mínimos.

## Mapa de rotas x perfis

- **STAFF (professor/instrutor/admin/ti):** `/dashboard`, `/presencas`, `/alunos`, `/graduacoes`, `/relatorios`, `/configuracoes/*`, `/perfil`, `/historico-presencas`.
- **STAFF (professor/instrutor/admin/ti):** `/dashboard`, `/presencas` (com subpaths `check-in`, `pendencias`, `revisao`), `/alunos`, `/graduacoes/proximas`, `/graduacoes/historico`, `/relatorios`, `/configuracoes/*`, `/perfil`, `/historico-presencas`; `QR Code` é injetado após Presenças para professor/admin/ti (`/qrcode`, `/qrcode/historico`, `/qrcode/validar`).
- **ALUNO:** `/dashboard`, `/checkin`, `/treinos`, `/evolucao`, `/historico-presencas`, `/perfil` (acesso pessoal). Dashboard decide layout conforme papéis.
- **Públicas:** `/login`, `/unauthorized`, `/` (redirect).

## Sidebar STAFF (mantém visual existente)

Organizar apenas a ordem e agrupamento lógico, sem alterar o componente visual:

- **Dia a dia**
  - Dashboard `/dashboard`
  - Presenças `/presencas` (inclui chamada + pendências)
- **Alunos**
  - Alunos `/alunos`
  - Histórico de presenças `/historico-presencas` (consulta ampla)
- **Graduações**
  - Graduações `/graduacoes`
- **Relatórios**
  - Relatórios `/relatorios`
- **Configurações** (mantém como seção expansível já existente)
  - Regras de graduação `/configuracoes/graduacao`
  - Horários de treino `/configuracoes/treinos`
  - Tipos de treino `/configuracoes/tipos-treino`

Observações:
- Não mexer nas classes; apenas garantir que a ordem no mapa de navegação siga o agrupamento acima.
- `Configurações` já é tratado como submenu; preservar comportamento e apenas garantir que itens filhos estejam presentes.

## Navegação ALUNO (pills no topo)

Top tabs (pills) para alunos puros, seguindo `getTopNavigationItemsForRoles`:
1. Dashboard `/dashboard`
2. Check-in `/checkin`
3. Treinos `/treinos`
4. Evolução `/evolucao`

Ações secundárias (não poluir as pills):
- Histórico de presenças `/historico-presencas` (via menu de perfil ou CTA nos cards)
- Perfil `/perfil`

## Menu de perfil (avatar)

Componentizar lista de itens e alternar conforme papel, reutilizando o `UserMenu` atual:

- **Comum (ambos):**
  - Meu perfil (`/perfil`)
  - Histórico de presenças (`/historico-presencas`)
  - Sair (logout)

- **Aluno:**
  - Solicitações/pendências de presença (atalho para `/historico-presencas` filtrado ou `/checkin`)
  - Configurações pessoais (quando existir)

- **Staff:**
  - Relatórios (`/relatorios`), quando permitido
  - Configurações → submenu com filhos de `/configuracoes`

Abertura de submenu de Configurações já existe; manter padrão e apenas garantir rótulos claros.

## Regras gerais de navegação

- **Dashboard**: mostrar apenas resumos e CTAs “Ver detalhes” para telas operacionais (`/presencas`, `/graduacoes`, `/alunos`).
- **Tabs internas**: usar quando a tela combina fluxos distintos. Aplicar já onde identificado:
  - `/presencas`: Chamada do dia × Pendências (já implementado).
  - `/graduacoes`: Próximas × Histórico (já implementado). Se sobrecarregar, considerar terceira aba “Configurações rápidas” apontando para `/configuracoes/graduacao`.
- **Divisão de rotas**: manter rotas atuais; se surgir nova funcionalidade (ex.: solicitações), avaliar como submenu em “Alunos” ou item do avatar do aluno.
- **Consistência de CTAs**: botões de cards do dashboard devem apontar para as telas especialistas e não duplicar fluxos.

## Ajustes incrementais sugeridos (sem alterar visual base)

1. Reordenar `navigationItems` para refletir os grupos acima (não mudar classes).
2. Garantir que `UserMenu` exiba histórico e perfil para ambos, e distribua Relatórios/Configurações conforme papel.
3. Expor histórico de presenças no grupo “Alunos” da sidebar para facilitar acesso rápido do staff.
4. Manter pills do aluno apenas com fluxos diários; demais itens via avatar para reduzir poluição visual.

