# Status de Autenticação e Check-in — Resumo

> **Fonte única:** use [`docs/auth-and-checkin-flow.md`](./auth-and-checkin-flow.md) como referência principal de autenticação, papéis e fluxos de check-in (manual + QR). Este arquivo apenas registra o panorama rápido do MVP e as limitações atuais.

## Panorama rápido
- Login e papéis ainda dependem de mocks; não há onboarding real nem recuperação de senha.
- Check-in manual e QR estão prototipados: `/checkin` para aluno, `/presencas/check-in` e `/qrcode` para staff, com QR dinâmico e presença automática do professor ao abrir a aula.
- Rota `/qrcode/validar` existe para visão futura (modo totem/carteirinha), mas fica oculta no MVP.

## Itens de atenção
- Consolidar comportamentos, mensagens e TTL do QR conforme o guia central na implementação real (Supabase/API).
- Registrar diferenciação de origem de presença (`manual`, `qr`) e status (`pendente`, `confirmado`, `ausente`, etc.) para auditoria.
- Modo teste (`ADMIN_TI`) deve continuar sinalizado visualmente e, no futuro, gerar logs de auditoria.
