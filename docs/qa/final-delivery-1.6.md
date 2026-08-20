# Entrega local — Story 1.6 / EPIC-1

> **Branch:** `feat/desktop-pt-br`
> **Base:** `main` em `27562ad5f80e90f7d552f92dbd4af7f1f511c3c8`
> **Locale:** `pt-br`
> **Escopo:** Hermes Desktop; validação inicial no Windows
> **Remote writes:** não realizadas
> **Data:** 2026-08-20

## Implementação

Arquivos de produto:

- `apps/desktop/src/i18n/types.ts`
- `apps/desktop/src/i18n/languages.ts`
- `apps/desktop/src/i18n/catalog.ts`
- `apps/desktop/src/i18n/pt-br.ts`

Arquivos de teste:

- `apps/desktop/src/i18n/languages.test.ts`
- `apps/desktop/src/i18n/context.test.tsx`
- `apps/desktop/src/i18n/runtime.test.ts`
- `apps/desktop/src/i18n/catalog.test.ts`
- `apps/desktop/src/components/language-switcher.test.tsx`

Artefatos AIOX e QA:

- `.aiox-core/core-config.yaml`
- `docs/stories/epics/epic-1-hermes-desktop-ptbr.md`
- `docs/stories/1.1-baseline-upstream.story.md`
- `docs/stories/1.2-locale-registration.story.md`
- `docs/stories/1.3-ptbr-catalog.story.md`
- `docs/stories/1.4-i18n-tests.story.md`
- `docs/stories/1.5-windows-acceptance.story.md`
- `docs/stories/1.6-upstream-delivery.story.md`
- `docs/qa/baseline-1.1.md`
- `docs/qa/upstream-coordination-1.1.md`
- `docs/qa/windows-acceptance-1.5.md`
- `docs/qa/gates/`

## Comportamento verificado

- `pt-br` é locale tipado e registrado no catálogo.
- `pt-BR`, `pt_BR` e `ptbr` normalizam para `pt-br`.
- O seletor exibe **Português (Brasil)**.
- O runtime aplica `lang="pt-br"` e `dir="ltr"`.
- A interface isolada mudou para português em runtime.
- O catálogo cobre todos os caminhos estáticos do inglês: auditoria `missing=0`.
- A persistência e o rollback estão cobertos por testes do `I18nProvider`.
- A troca no seletor é coberta por teste UI.
- A tradução não altera comandos, IDs, protocolos, URLs ou nomes técnicos operacionais.

## Validações finais

| Validação | Resultado |
|---|---|
| `npm ci` | PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS — 0 erros; warnings preexistentes do repositório permanecem. |
| Testes direcionados pt-BR | PASS — 5 arquivos, 27 testes. |
| Auditoria de completude | PASS — 0 caminhos ausentes. |
| `npm run build` | PASS — Vite, Electron main/preload, staging Windows e assert de `dist`. |
| `npm run test:ui` candidato | 5.169 testes passaram, 4 falharam; mesmas falhas ambientais/preexistentes do baseline. |
| `npm run test:desktop:platforms` candidato | 1.468 testes passaram, 27 falharam; falhas Windows/MSYS/WSL/SSH/permissão preexistentes; uma falha de limpeza EPERM variou no ambiente. |
| Aceitação visual Electron isolada | PASS com CONCERNS de persistência E2E sem backend configurado. |
| Push/PR/merge remoto | NÃO EXECUTADOS. |

## Bloqueios conhecidos

1. A suíte completa do repositório já falha no Windows/MSYS em testes de permissões, SSH, WSL, caminhos Unix e fixtures de billing/locale. Nenhuma falha aponta para os arquivos pt-BR.
2. `npm audit` da `main` reporta 6 vulnerabilidades altas transitivas. A iniciativa não executou `npm audit fix` porque isso mudaria o escopo da tradução.
3. A instância Electron fake usada para aceitação visual não tinha backend/configuração suficiente para provar persistência após reinício. A persistência do código passa nos testes unitários do provider.
4. A contribuição upstream ainda não foi publicada. A issue #40239 e as PRs concorrentes devem ser coordenadas antes de qualquer push.

## Decisão de entrega

A tradução está **implementada localmente e pronta para revisão técnica/linguística**, mas a contribuição upstream permanece **CONCERNS**, não publicada, até:

- revisão final por falante nativo;
- validação Windows com backend/configuração reais para persistência E2E;
- coordenação na issue #40239;
- decisão explícita sobre criação de PR.
