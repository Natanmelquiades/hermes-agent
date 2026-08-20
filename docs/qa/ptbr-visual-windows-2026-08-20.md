# Evidência visual Windows/Electron — pt-BR

**Data:** 2026-08-20<br>
**Branch:** `work/desktop-ptbr-visual-coverage`<br>
**Commit observado:** `84aabe4a1e`<br>
**Ambiente:** instância Electron isolada, `HERMES_HOME` e `user-data-dir` temporários, renderer em `127.0.0.1:5174`, CDP em `9334`.

## Procedimento

1. Iniciar o renderer da branch.
2. Abrir uma instância Electron isolada, sem tocar na instalação normal do Hermes.
3. Selecionar `Português (Brasil)` pelo seletor de idioma.
4. Percorrer Model Settings, Capacidades → Ferramentas → Computer Use e Sobre → Zona de perigo.
5. Confirmar `document.documentElement.lang === "pt-br"` e observar o texto renderizado via DOM e captura visual.
6. Não executar autenticação, desinstalação, pagamento, alteração de credenciais ou qualquer ação destrutiva.

## Superfícies observadas

### Model Settings

- Labels de modelos auxiliares, visão, extração da web, compactação, hub de habilidades, aprovação, MCP, títulos e curador em pt-BR.
- Mixture of Agents, providers, presets, modelos, IDs e entradas `provider:model` preservados como dados técnicos.
- Evidência: `evidence/ptbr-model-settings.png`.

### Computer Use

- Descrição da ferramenta e do provider `cua-driver` em pt-BR.
- Status `Pronto`, saúde do driver, SmartScreen, permissões e ações visíveis em pt-BR.
- `cua-driver`, `background`, versão e identificadores técnicos preservados.
- Evidência: `evidence/ptbr-computer-use.png`.

### Uninstall / Danger zone

- `Zona de perigo`, desinstalação, descrição e opção de remover somente a interface de chat em pt-BR.
- Caminho do app e dados operacionais permanecem dinâmicos.
- O modal/ação destrutiva não foi executado; a validação parou antes da confirmação final.
- Evidência: `evidence/ptbr-uninstall-danger-zone.png`.

## Resultado

- `lang="pt-br"`: confirmado.
- `dir="ltr"`: confirmado.
- Resíduos observados e corrigidos nesta rodada: descrição do toolset e do provider `cua-driver`.
- Nenhuma credencial, token ou segredo foi lido ou registrado.
- Persistência após reinício e fluxos que exigem backend configurado continuam pendentes.

## Gates do checkpoint

- `npm run lint`: passou, com 120 warnings gerais preexistentes e 0 erros.
- `npm run typecheck`: passou.
- `npm run validate:port-denylist`: não executável; o script não existe no `apps/desktop/package.json` nem no `package.json` raiz.
- `npm test`: não passou — 31 falhas e 6.769 testes passaram em 6.804 executados. As falhas abrangem fixtures Electron/Windows, billing, formatação dependente de locale e o fixture conhecido de truncamento; não foram tratadas como regressões desta alteração.
- Testes direcionados de Skills/toolset/i18n: passaram — 64 testes.

## Gateway e Connections

- `Conexão do gateway`, modos local/Cloud/remoto/SSH, diagnóstico e ações de reconexão foram observados em pt-BR.
- O label persistido `This device` é exibido como `Este dispositivo` somente na camada visual; o ID/valor operacional continua `local`/`This device`.
- O editor remoto foi aberto sem salvar: `Nome`, `URL do gateway`, autenticação, token da sessão, cabeçalhos extras e ações aparecem em pt-BR.
- Placeholders, hosts, URLs, `OAuth`, `WebSocket`, `CF-Access-Client-Id` e demais identificadores técnicos foram preservados.
- Evidências: `evidence/ptbr-gateway.png` e `evidence/ptbr-connection-editor.png`.

## Skills e MCP

- Tabs e controles do Desktop (`Habilidades`, `Ferramentas`, `MCP`, `Atualizar as instaladas`, `Novo servidor`, `Instalar`, `Salvar`) foram observados em pt-BR.
- Badges de proveniência `learned`/`hub` e o toolset Computer Use aparecem localizados quando aplicável.
- O iframe do Skills Hub mantém conteúdo e seletor de idioma próprios; não é alterado pelo locale do Desktop.
- Descrições de catálogo MCP, nomes de servidores, transportes (`http`/`stdio`), auth (`OAuth`/`API key`) e JSON são metadados técnicos preservados.
- Nenhum servidor foi instalado, importado ou salvo durante a validação.
- Evidências: `evidence/ptbr-skills.png` e `evidence/ptbr-mcp.png`.
