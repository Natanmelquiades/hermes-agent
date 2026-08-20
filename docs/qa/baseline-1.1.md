# Baseline técnico — Story 1.1

> **Checkout:** `D:\EMPRESAS E PROJETOS\My Softwares And Sass\Hermes PT\hermes-agent`
> **Branch:** `main`
> **Commit:** `27562ad5f80e90f7d552f92dbd4af7f1f511c3c8`
> **Data da execução:** 2026-08-20
> **Escopo:** `apps/desktop`

## Ambiente e instalação

- `npm ci`: **PASS**
- Dependências instaladas: 1.292 pacotes adicionados; 1.300 auditados.
- `npm audit`: **FAIL/ALERTA DE BASELINE** — 6 vulnerabilidades de alta severidade transitivas, incluindo cadeia envolvendo `vite`/`postcss`/`sanitize-html`. Essas vulnerabilidades pertencem ao estado atual do repositório e não foram introduzidas pelo diff pt-BR.

## Gates executados

| Comando | Resultado | Observação |
|---|---|---|
| `npm run typecheck` | PASS | TypeScript renderer, Electron e E2E sem erros. |
| `npm run lint` | PASS | 0 erros; 120 warnings preexistentes de lint. |
| `npm run test:desktop:platforms` | FAIL baseline | 1.469 testes passaram, 26 falharam, 4 foram ignorados em 109 arquivos. |
| `npm run test:ui` | FAIL baseline | 547 arquivos passaram, 3 falharam; 5.165 testes passaram e 4 falharam. |

## Falhas observadas no teste Electron

As falhas são compatíveis com o ambiente Windows/MSYS atual e não têm relação com i18n:

- permissões Unix esperadas (`0600`/`0644`) em testes de hardening;
- comportamento de `ssh-config`/Includes;
- regex de caminho Unix em `ssh-connection`;
- comportamento de sockets e ControlMaster SSH;
- caminhos WSL/UNC;
- staging de dependências nativas Darwin.

Essas falhas devem permanecer documentadas como baseline. Não serão corrigidas dentro da iniciativa pt-BR.

## Falhas observadas no teste UI

As quatro falhas ocorreram em testes já existentes de billing, formatação de uso e truncamento de payload. Uma delas compara separador de milhar, que apareceu como `.` no ambiente atual em vez de `,`; as outras dependem de fixtures de billing e do output de truncamento. Nenhuma falha aponta para arquivos ou comportamento do locale pt-BR.

## Decisão do gate

```yaml
schema: 1
story: '1.1'
gate: CONCERNS
status_reason: 'Typecheck e lint passam na main; a suíte de plataformas possui 26 falhas preexistentes relacionadas ao ambiente Windows/MSYS e há 6 vulnerabilidades altas no audit do estado atual.'
reviewer: 'Orion / QA baseline'
reviewed_revision: 'commit:27562ad5f80e90f7d552f92dbd4af7f1f511c3c8'
top_issues:
  - id: 'TEST-BASELINE-001'
    severity: medium
    finding: '26 falhas na suíte Electron no baseline Windows/MSYS.'
    suggested_action: 'Isolar como baseline; não alterar dentro da story pt-BR.'
  - id: 'SEC-BASELINE-001'
    severity: high
    finding: 'npm audit reporta 6 vulnerabilidades altas na árvore de dependências atual.'
    suggested_action: 'Tratar em iniciativa de dependências separada; não executar npm audit fix neste escopo.'
waiver: { active: false }
```

## Liberação para a próxima etapa

A implementação de i18n pode prosseguir **somente** porque os gates que protegem o catálogo (`typecheck` e `lint`) estão verdes e as falhas restantes foram classificadas como baseline. A suíte `test:ui` também foi registrada como falha preexistente/ambiental.
