# Epic 1 — Hermes Desktop: Português (Brasil) oficial

> **Epic ID:** EPIC-1
> **Status:** Done with CONCERNS — entrega local; publicação upstream bloqueada
> **Produto:** Hermes Desktop
> **Plataforma de validação:** Windows
> **Locale:** `pt-br`
> **Fonte:** `docs/prd/hermes-desktop-pt-br-prd.md`
> **Backlog:** `docs/backlog/hermes-desktop-pt-br-backlog-map.md`
> **Remote writes:** desabilitadas; entrega local até revisão explícita

## Objetivo

Adicionar Português (Brasil) como locale oficial, selecionável e persistente do Hermes Desktop, utilizando o mecanismo de i18n existente, sem alterar backend, protocolos, comandos, IDs ou dados operacionais.

## Contexto do sistema existente

O Desktop é um renderer React/TypeScript/Vite dentro de um shell Electron. A infraestrutura existente de i18n está em `apps/desktop/src/i18n/` e já possui `Locale`, `Translations`, `TRANSLATIONS`, normalização de idioma, `I18nProvider`, runtime translator, selector e testes.

O catálogo pt-BR precisa ser construído contra o contrato `Translations` da `main` atual. A PR upstream #86292 foi analisada como referência linguística, mas está desatualizada e não é base técnica aprovada.

## Stories

| Story | Título | Executor | Quality gate | Dependência | Estado |
|---|---|---|---|---|---|
| 1.1 | Baseline técnico e coordenação upstream | @architect | @pm | Nenhuma | Ready |
| 1.2 | Registro formal do locale pt-br e aliases | @dev | @architect | 1.1 | Ready |
| 1.3 | Catálogo completo pt-BR | @dev | @architect | 1.2 | Ready |
| 1.4 | Testes de i18n, fallback e persistência | @dev | @architect | 1.3 | Ready |
| 1.5 | Aceitação do Desktop no Windows | @dev | @architect | 1.4 | Ready |
| 1.6 | Preparação da entrega upstream local | @devops | @architect | 1.5 | Ready |

## Waves

As stories são deliberadamente sequenciais. Stories 1.2 e 1.3 alteram o mesmo subsistema e não devem ser executadas em paralelo.

```text
Wave 0: 1.1 — baseline e coordenação
Wave 1: 1.2 — registro do locale
Wave 2: 1.3 — catálogo pt-BR
Wave 3: 1.4 — testes
Wave 4: 1.5 — aceitação Windows
Wave 5: 1.6 — entrega local e relatório upstream
```

## Riscos principais

- Catálogo antigo pode não satisfazer o contrato atual.
- Fallback em inglês pode mascarar chaves não traduzidas.
- Textos maiores podem causar truncamento no Windows.
- Tradução pode alterar acidentalmente identificadores ou placeholders.
- PRs upstream concorrentes podem causar duplicação.

## Definition of Done do épico

- [x] Todas as stories foram executadas com seus critérios de aceite verificados.
- [x] `pt-br` está registrado, selecionável e persistente em testes do provider.
- [x] Catálogo satisfaz o `Translations` atual.
- [x] Fallback, aliases, runtime e rollback estão testados.
- [x] Typecheck e lint passam no checkout final.
- [x] Testes Desktop relevantes passam ou falhas preexistentes estão isoladas e documentadas.
- [x] Aceitação manual Windows concluída no renderer isolado, com CONCERNS de backend E2E.
- [x] Nenhum push, PR ou merge remoto foi feito automaticamente.
- [x] Entrega local contém diff, testes, decisões e instruções de revisão.

## Handoff

Após a conclusão do épico, @devops poderá preparar uma contribuição upstream, mas a publicação remota permanece uma decisão separada do usuário.
