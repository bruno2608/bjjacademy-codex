# 🥋 **BJJ Academy — PWA (Next.js + Tailwind)**

Bem-vindo à base do novo **BJJ Academy PWA**, plataforma web progressiva
focada na gestão completa de academias de Jiu-Jitsu. O projeto foi
atualizado para incluir módulos de **controle de presenças** e
**planejamento de graduações**, inspirados nas funcionalidades dos
repositórios anteriores [`bjjacademyapp`](https://github.com/bruno2608/bjjacademyapp)
(mobile) e [`bjj-academy-api`](https://github.com/bruno2608/bjj-academy-api).

## 🚀 **Stack principal**

- **Next.js 14** (App Router) + **React 18**
- **Tailwind CSS 3** com tema “Zenko Focus” (preto, branco, vermelho e cinzas)
- **Zustand** para estado global mockado
- **Lucide React** para ícones
- **next-pwa** com `manifest.json`, service worker custom e cache offline

## 🎯 **O que já está pronto**

| Área | Destaques |
| --- | --- |
| Autenticação | Login mockado com persistência de token (localStorage) e guardas de rota. |
| Dashboard | Cards dinâmicos com métricas de alunos, presenças semanais e graduações planejadas. |
| Alunos | CRUD mockado com formulário que coleta faixa, graus, tempo na faixa e data da última graduação. |
| Presenças | Registro rápido por aluno/data com contexto de faixa/graus, alternância de status e histórico responsivo. |
| Graduações | Linha do tempo por atleta, agendamento por **grau** ou **faixa** com regras de tempo da IBJJF e atualização de status. |
| PWA | Manifesto completo, service worker com cache básico e ícones em múltiplos tamanhos. |

## 🧭 **Mapa da estrutura**

```
app/
  (authenticated)/
    dashboard/
    alunos/
      [id]/
      novo/
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

## 🛠️ **Como executar localmente**

```bash
npm install
npm run dev
# Acesse http://localhost:3000
```

### Fluxo sugerido de validação

1. **Login mockado:** `http://localhost:3000/login` aceita qualquer
   e-mail/senha e redireciona para o dashboard.
2. **Cadastro de alunos:** inclua faixa, graus e meses na faixa para validar as recomendações automáticas.
3. **Presenças:** registre novas entradas, conferindo a faixa/graus exibidos nas listagens.
4. **Graduações:** agende um grau ou faixa usando as sugestões de tempo e ajuste o status (Planejado, Em progresso, Concluído).
5. **PWA:** instale pelo navegador ou teste o comportamento offline para
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
