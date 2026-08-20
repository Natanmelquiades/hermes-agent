# Matriz de cobertura visual — Hermes Desktop pt-BR

> **Story:** 1.7 — Cobertura visual e migração de strings de interface pt-BR<br>
> **Branch:** `work/desktop-ptbr-visual-coverage`<br>
> **Base:** `origin/main` em `c47f0b4590` + checkpoint `f71932021b`<br>
> **Locale:** `pt-br` / **Português (Brasil)**<br>
> **Plataforma prioritária:** Windows/Electron<br>
> **Estado:** inventário inicial; nenhuma superfície é considerada concluída sem evidência visual registrada.

## Critério de classificação

- **P0:** fluxo essencial ou tela que o usuário encontra no primeiro uso.
- **P1:** configuração ou ferramenta importante, mas não necessária para iniciar uma sessão.
- **P2:** superfície auxiliar, experimental, de desenvolvimento ou de baixa frequência.
- **Traduzível:** texto de interface que deve usar o catálogo.
- **Técnico/dinâmico:** preservar quando for comando, ID, URL, nome próprio, provider/modelo, ferramenta, skill/MCP, log, traceback, fixture ou conteúdo do modelo.

## Inventário por superfície

| Superfície | Prioridade | Componentes/áreas de origem | Sinais iniciais | Estado | Evidência exigida |
|---|---:|---|---|---|---|
| Boot e onboarding | P0 | `src/components/desktop-install-overlay.tsx`, `src/components/first-run-remote-form.tsx`, `src/components/onboarding/` | Catálogo possui chaves de boot/install; revisar labels literais e estados | Pendente | Screenshot/registro de English → pt-BR e retorno para English |
| Chat principal | P0 | `src/app/chat/`, `src/components/assistant-ui/` | Timeline e reações receberam primeiro lote; preservar conteúdo de mensagens e nomes de ferramentas | Em implementação — validação visual pendente | Sessão nova, sessão existente, erro, carregamento e estado vazio |
| Compositor e comandos | P0 | `src/app/chat/composer/` | `/help`, comandos e referências inline são operacionais; labels auxiliares são traduzíveis | Pendente | Compositor, anexos, snippets, quick actions e autocomplete |
| Seletor de idioma e aparência | P0 | `src/components/language-switcher.tsx`, `src/app/settings/` | Fluxo pt-BR já validado parcialmente | Parcialmente validado | Troca, persistência, rollback, tema claro/escuro e escala |
| Configurações gerais | P0 | `src/app/settings/` | Painel de memória e `custom-endpoints-settings.tsx` receberam superfícies tipadas; ainda há seções pendentes | Em implementação — validação visual pendente | Busca, seções, labels, tooltips, empty/error/loading states |
| Modelos e providers | P0 | `src/app/settings/model-settings.tsx`, `src/components/onboarding/providers.tsx` | Mixture of Agents recebeu labels tipados; nomes de providers/modelos permanecem | Em implementação — validação visual pendente | Seleção, fallback, credenciais e mensagens de erro |
| Ferramentas e skills | P1 | `src/app/skills/`, configurações de toolsets | Nomes técnicos e skills são dados; descrições e estados são interface | Pendente | Ativar/desativar, busca, ordenação, configuração e estados vazios |
| MCP | P1 | superfícies MCP em `src/app/` e `src/components/` | Preservar URLs, comandos, IDs e nomes de servidores | Pendente | Adicionar, remover, conectar, falhar e deep link |
| Gateway e webhooks | P1 | `src/app/settings/gateway-settings.tsx`, superfícies de webhooks | Catálogo pt-BR já contém mensagens; conferir telas hardcoded | Pendente | Conectar, desconectar, status, webhooks e erros |
| Connections e perfis | P1 | `src/app/settings/connections-registry.tsx`, `src/app/profiles/` | Placeholders e hosts são dados; labels e descrições são traduzíveis | Pendente | Criar/editar/remover, remoto/local e validação |
| Memória | P1 | `src/app/settings/memory/` | `provider-config-panel.tsx` migrou loading, retry, configuração e status de campos para `t.ui` | Em implementação — validação visual pendente | Provider, dados, habilitar/desabilitar e erros |
| Computer Use | P1 | `src/app/settings/computer-use-panel.tsx` | Status, permissões e estados do `cua-driver` receberam superfície tipada | Em implementação — validação visual pendente | Windows/Linux/macOS, permissões, driver health e erros |
| Uninstall / Danger zone | P1 | `src/app/settings/uninstall-section.tsx` | Modalidades gui/lite/full e confirmação usam cópia tipada; dados do caminho permanecem dinâmicos | Em implementação — validação visual pendente | Opções, confirmação destrutiva, erro e encerramento do app |
| Files, Terminal, Preview e Review | P1 | `src/app/right-sidebar/`, `src/components/pane-shell/` | Superfícies técnicas misturam UI com comandos/caminhos | Pendente | Abrir painéis, empty/error states, menus e acessibilidade |
| Status stack e tarefas | P1 | `src/app/chat/composer/status-stack/`, `src/components/chat/` | Catálogo possui estados; conferir componentes fora do provider | Pendente | Agentes, subagentes, objetivos, tarefas e worktree |
| Atualização e instalação | P1 | `src/app/updates/`, `src/components/desktop-install-overlay.tsx` | Mensagens de atualização precisam de revisão visual e pluralização | Pendente | Baixar, aplicar, reiniciar, erro e backend remoto |
| Quick Entry e pet overlay | P2 | `src/app/quick-entry/`, `src/app/pet-overlay/` | Placeholder e ações `Open in Hermes` do overlay migrados para `t.ui` | Em implementação — validação visual pendente | Entrada rápida, abrir Hermes, mensagem e acessibilidade |
| Menus, tooltips e acessibilidade | P0 | `src/components/ui/`, menus e dialogs | Zoomable, split-button e labels de progresso/reação receberam primeiro lote | Em implementação — validação visual pendente | Navegação por teclado, leitor de tela e foco |
| Billing/fixtures | P2 | `src/app/settings/billing/` | Fixtures de desenvolvimento podem permanecer técnicas; UI real deve ser classificada | Pendente | Separar fixture/dev-only de interface de produção |

## Candidatos hardcoded confirmados na auditoria inicial

Estes itens são sinais de investigação, não autorização automática para traduzir:

- `src/components/ui/zoomable.tsx`: `Zoom out`, `Reset`, `Zoom in`, `Close`.
- `src/components/ui/split-button.tsx`: `More actions`.
- `src/components/pet/pet-egg-hatch.tsx`: `Hatching progress`.
- `src/components/assistant-ui/thread/timeline.tsx`: `Conversation timeline`.
- `src/components/assistant-ui/thread/message-reactions.tsx`: `Search…`, `More emoji`; `Reacted by Hermes` deve ser classificado.
- `src/app/pet-overlay/pet-overlay-app.tsx`: `Message…`, `Open in Hermes`.
- `src/app/settings/computer-use-panel.tsx`: `Accessibility`, `Screen Recording` — revisar se são nomes de permissões do sistema.
- `src/app/settings/billing/index.tsx`: `Plan`, `Payment & credits`, `Usage`, `Invoices` e labels de fixture.
- `src/app/settings/uninstall-section.tsx`: `Danger zone`.
- `src/app/settings/model-settings.tsx`: `Mixture of Agents`, `Preset`, `Aggregator`.
- `src/app/settings/memory/provider-config-panel.tsx`: `Loading memory provider settings...`.
- `src/app/settings/custom-endpoints-settings.tsx`: `Custom Endpoints`, `Delete endpoint`, `No custom endpoints`, `Add an OpenAI-compatible endpoint below.`.

## Regras de evidência

1. Uma linha só pode ser marcada como **Concluída** quando a tela for aberta nos dois locales e o resultado for observado.
2. A auditoria estrutural `missing=0` não substitui esta matriz.
3. Strings dinâmicas devem ser testadas com dados representativos, sem capturar segredos.
4. Nomes técnicos preservados devem ser marcados como **Técnico/dinâmico**, não como falha de tradução.
5. Falhas da suíte geral de Windows/MSYS devem ser referenciadas separadamente em `docs/qa/`.
6. Toda alteração deve continuar usando `apps/desktop/src/i18n/`; não criar mecanismo paralelo.

## Próximo lote recomendado

1. Seletor/Settings e onboarding.
2. Chat/compositor e status stack.
3. Modelos/providers e Connections.
4. Gateway/webhooks, skills e MCP.
5. Files/Terminal/Preview/Review e superfícies auxiliares.

## Estado da matriz

```text
Superfícies inventariadas: 19
Concluídas com evidência visual: 0
Parcialmente implementadas: 8
Parcialmente validadas: 1 (idioma/aparência)
Pendentes de auditoria visual: 10
```
