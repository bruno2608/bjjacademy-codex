# 🥋 **BJJ Academy — PWA (Next.js + Tailwind)**

Bem-vindo à base do novo **BJJ Academy PWA**, plataforma web progressiva
focada na gestão completa de academias de Jiu-Jitsu. O projeto une a
identidade "Zenko Focus" com uma camada visual gamificada inspirada nas
versões mobile [`bjjacademyapp`](https://github.com/bruno2608/bjjacademyapp)
e backend [`bjj-academy-api`](https://github.com/bruno2608/bjj-academy-api).

## 🚀 **Stack principal**

- **Next.js 14** (App Router) + **React 18**
- **Tailwind CSS 3** com tema “Zenko Focus” (preto, branco, vermelho e cinzas)
- **Zustand** para estado global mockado
- **Lucide React** para ícones
- **next-pwa** com `manifest.json`, service worker custom e cache offline

## 🎯 **O que já está pronto**

| Área | Destaques |
| --- | --- |
| Autenticação | Tela de login remodelada com hero informativo e mock de token persistido (localStorage). |
| Dashboard | Hero `PageHero`, cards gradiente e alternância entre visões **Geral · Presenças · Graduações**. |
| Alunos | CRUD mockado com formulário em modal, distribuição de faixas e destaques para próximos graduandos. |
| Presenças | Registro rápido focado no check-in do dia, resumo compacto e correção via modal dedicado. |
| Graduações | Tela inspirada no app com hero, cards progressivos, linha do tempo e agendamento por grau/faixa. |
| PWA | Manifesto completo, service worker com cache básico e ícones em múltiplos tamanhos. |

## 🧭 **Mapa da estrutura**

```
app/
  (authenticated)/
    dashboard/
    alunos/
      [id]/
    presencas/
    graduacoes/
  login/
components/
  ui/
services/
  api.js
  alunosService.js
  presencasService.js
  graduacoesService.js
store/
  userStore.js
public/
  icons/
  manifest.json
  service-worker.js
styles/
  globals.css
  tailwind.css
```

### Componentes compartilhados de UI

- `PageHero`: cartão heroico reutilizado nas páginas do painel.
- `Card`, `Table`, `AttendanceTable`, `Modal`, `PresenceForm`, `GraduationList`, `GraduationTimeline`.
- Botões, inputs e cards seguem a mesma linguagem visual (bordas arredondadas, gradientes suaves, brilho vermelho).

## 🛠️ **Como executar localmente**

```bash
npm install
npm run dev
# Acesse http://localhost:3000
```

### Fluxo sugerido de validação

1. **Login mockado:** `http://localhost:3000/login` aceita qualquer
   e-mail/senha e redireciona para o dashboard gamificado.
2. **Dashboard:** explore o hero com métricas e alterne entre as visões Geral, Presenças e Graduações.
3. **Cadastro de alunos:** use o modal “Novo aluno” para preencher faixa, graus e meses na faixa.
4. **Presenças:** registre novas entradas; a visão de Presenças no dashboard reflete os indicadores ao vivo.
5. **Graduações:** agende um grau ou faixa usando as regras de tempo mínimas e ajuste o status.
6. **PWA:** instale pelo navegador ou teste o comportamento offline para
   conferir o cache inicial de páginas.

## 🎨 **Diretrizes de UI**

- Layout responsivo com sidebar desktop e menu hamburger no mobile.
- Componentes com espaçamentos generosos (`p-4`, `gap-4`).
- Paleta exclusiva do BJJ Academy:
  - Preto `#000000`
  - Branco `#FFFFFF`
  - Vermelho `#E10600`
  - Cinzas `#1A1A1A`, `#2E2E2E`, `#D9D9D9`

## 🤝 **Contribuindo**

1. `git checkout -b feature/nova-feature`
2. `git commit -m "feat: descrição"`
3. Abra um Pull Request descrevendo a melhoria

## 📄 **Licença**

Projeto proprietário de **Bruno Alves França**.

---

> **BJJ Academy — Evolve Your Training**
>
> Estrutura pronta para conectar com a API oficial e escalar o sistema
de gestão da sua academia.
