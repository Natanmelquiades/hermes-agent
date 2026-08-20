# PRD — Português Brasileiro oficial para o Hermes Desktop no Windows

> **Status:** Implementação local concluída — revisão final CONCERNS; publicação upstream bloqueada
> **Produto:** Hermes Desktop
> **Plataforma da primeira entrega:** Windows
> **Localidade canônica:** `pt-br`
> **Nome exibido:** Português (Brasil)
> **Repositório-base:** [`NousResearch/hermes-agent`](https://github.com/NousResearch/hermes-agent)
> **Fonte técnica analisada:** branch `main`, commit `27562ad5f80e90f7d552f92dbd4af7f1f511c3c8`; revisão da PR #86292, head `e4ea87e777e4aab9a4b1ed0c3a873b9779f4167b` (consultados em 2026-08-20)
> **Licença do repositório:** MIT
> **Fora do escopo:** backend, CLI, TUI, Web Dashboard, documentação e instalador NSIS nesta primeira entrega

---

## 1. Resumo executivo

Adicionar **Português (Brasil)** como um idioma selecionável e persistente do Hermes Desktop no Windows, utilizando a mesma infraestrutura que já atende `en`, `zh`, `zh-hant`, `ja` e `ar`.

O usuário deverá selecionar **Português (Brasil)** no seletor de idiomas do Desktop. A escolha será salva em `display.language`, continuará ativa após reiniciar o aplicativo e trocará a interface em tempo de execução, sem quebrar sessões, perfis, conexões, ferramentas, atalhos, comandos, plugins ou dados operacionais.

A implementação não criará um segundo mecanismo de internacionalização, não fará substituição textual em massa e não alterará o backend. Ela estenderá o i18n tipado já presente em `apps/desktop/src/i18n`.

---

## 2. Problema

O Hermes Desktop já possui infraestrutura de i18n, seletor de idioma, persistência de configuração, fallback em inglês e testes. Entretanto, o código atual não lista `pt-br` entre suas localidades selecionáveis.

Para um usuário brasileiro, isso causa uma experiência em inglês mesmo quando a aplicação já possui uma arquitetura preparada para outros idiomas. Traduzir somente rótulos pontuais — como “New”, menus ou barras — não resolve o problema: deixaria a aplicação inconsistente, dificultaria manutenção e poderia quebrar mensagens interpoladas, acessibilidade e fluxos de troca de idioma.

---

## 3. Objetivo do produto

Disponibilizar uma experiência oficial de interface em português brasileiro no Hermes Desktop para Windows, com o mesmo comportamento técnico dos idiomas já suportados.

### 3.1 Resultado esperado para o usuário

Um usuário poderá:

1. abrir o Hermes Desktop no Windows;
2. abrir o seletor de idioma;
3. escolher **Português (Brasil)**;
4. ver a interface Desktop em português brasileiro;
5. continuar usando sessões, perfis, panes, terminal, arquivos, preview, configurações e conexões normalmente;
6. reiniciar o aplicativo e continuar em português;
7. retornar a qualquer outro idioma sem perda de configurações não relacionadas.

### 3.2 Objetivos mensuráveis

- `pt-br` aparece como opção no seletor de idioma do Desktop.
- A seleção persiste em `display.language` sem sobrescrever outras configurações.
- O renderer aplica `lang="pt-br"` e `dir="ltr"` ao documento ao selecionar o idioma.
- As strings estáticas do catálogo Desktop em inglês possuem equivalentes pt-BR no catálogo final.
- Toda chave ausente continua com fallback para inglês, sem erro de interface.
- Os testes de idioma, runtime, seletor e persistência passam antes de abrir uma contribuição upstream.
- A validação manual de Windows confirma que não há truncamento impeditivo em fluxos prioritários.

---

## 4. Escopo

### 4.1 Incluído — Hermes Desktop no Windows

- seletor de idioma;
- barra lateral, barra de título e barra de status;
- nova sessão, nova aba, nova janela e menus associados;
- chat, composer, aprovações, perguntas estruturadas e tool activity;
- configurações, perfis, conexões e gateways visíveis no Desktop;
- arquivos, preview, terminal, review, artifacts, skills, agentes, cron e messaging quando utilizarem o catálogo Desktop;
- estados de carregamento, vazio, erro, recuperação e atualização pertencentes ao renderer;
- tooltips, placeholders, rótulos de acessibilidade e atalhos exibidos pelo Desktop;
- notificações cuja cópia seja formada pelo renderer a partir do catálogo Desktop;
- built-in Desktop plugins que optarem por fornecer bundle `pt-br`;
- persistência, rollback visual em erro de gravação e fallback para inglês;
- testes unitários e de UI do pacote `apps/desktop`;
- teste manual de aceitação no Windows.

### 4.2 Fora do escopo desta versão

- backend Python, `agent/i18n.py` e `locales/*.yaml`;
- Hermes CLI, TUI, gateway de mensageria e Web Dashboard;
- respostas geradas pelo modelo;
- logs, tracebacks, saída crua de ferramentas e terminal;
- comandos como `/new`, `/model` e `/reset`;
- IDs, eventos, rotas, payloads JSON, protocolos IPC/WebSocket e nomes de APIs;
- nomes de modelos, providers, ferramentas, skills, MCPs, plugins e variáveis de ambiente;
- documentação, README, site e materiais de marketing;
- tradução do instalador NSIS/MSI;
- menus, caixas de diálogo ou componentes fornecidos pelo próprio Windows;
- suporte formal para macOS ou Linux nesta primeira entrega;
- tradução de plugins de terceiros, que permanecem responsáveis por seus próprios bundles.

> O foco em Windows não deve introduzir condicionais que degradem macOS ou Linux. A mudança de catálogo é cross-platform por natureza; a validação de aceitação desta iniciativa será Windows.

---

## 5. Decisão de localidade

### 5.1 Identificador canônico

O identificador interno e persistido será:

```text
pt-br
```

Motivos:

- segue o padrão BCP 47 em forma normalizada já usado pelo Desktop, como `zh-hant`;
- distingue português brasileiro de outras variantes futuras;
- é coerente com a PR upstream existente que já propõe `apps/desktop/src/i18n/pt-br.ts`;
- permite que o seletor e a configuração operem como os demais idiomas.

### 5.2 Aliases aceitos

A normalização aceitará somente identificadores de configuração equivalentes e os converterá para `pt-br`:

```text
pt-br
pt-BR
pt_BR
ptbr
```

A lista final de aliases deve permanecer pequena, determinística e testada. Nomes humanos como `Português (Brasil)` pertencem à busca do seletor, não ao formato persistido de `display.language`. O identificador salvo depois de uma escolha pelo Desktop permanece `pt-br`.

### 5.3 Nome no seletor

```text
Português (Brasil)
```

O seletor já exibe o endônimo e também permite pesquisa por nome em inglês e código. A nova localidade deve aparecer da mesma forma, sem bandeiras nacionais.

---

## 6. Descoberta técnica — código real analisado

### 6.1 Infraestrutura existente

O Desktop já possui os componentes necessários:

| Arquivo | Responsabilidade confirmada |
|---|---|
| `apps/desktop/src/i18n/types.ts` | Define o union type `Locale` e o contrato tipado `Translations`. |
| `apps/desktop/src/i18n/en.ts` | Catálogo-base em inglês; possui 3.343 linhas na revisão analisada. |
| `apps/desktop/src/i18n/catalog.ts` | Registra cada catálogo em `TRANSLATIONS`. |
| `apps/desktop/src/i18n/languages.ts` | Declara opções, aliases, normalização e valor persistido de cada idioma. |
| `apps/desktop/src/i18n/context.tsx` | Carrega e grava `display.language`, aplica `document.lang`/`dir`, atualiza locale em runtime e reverte a interface se a gravação falhar. |
| `apps/desktop/src/i18n/runtime.ts` | Resolve mensagens pela sequência localidade ativa → inglês → chave. |
| `apps/desktop/src/components/language-switcher.tsx` | Mostra e troca as opções de idioma com persistência. |
| `apps/desktop/src/i18n/define-locale.ts` | Mescla uma tradução parcial com o inglês para fallback tipado. |
| `apps/desktop/src/i18n/plugin-i18n.ts` | Faz plugins seguirem `display.language`, com fallback do plugin para inglês. |
| `apps/desktop/src/main.tsx` | Já monta o aplicativo dentro de `I18nProvider`. |

### 6.2 Fluxo atual que será reutilizado

```text
Usuário seleciona Português (Brasil)
        │
        ▼
LanguageSwitcher.selectLocale('pt-br')
        │
        ▼
I18nProvider.setLocale('pt-br')
        ├── atualiza a interface de forma otimista
        ├── aplica document.lang = 'pt-br' e dir = 'ltr'
        ├── atualiza o tradutor em runtime
        └── salva display.language = 'pt-br'
                │
                ├── sucesso: mantém pt-br
                └── falha: reverte para o idioma anterior e mostra erro

Leitura de uma chave:
pt-br → en → nome da chave
```

### 6.3 Consequência arquitetural

Não há necessidade de alterar a fronteira Electron ↔ renderer, o backend ou os contratos de sessão. O locale é uma preferência de apresentação controlada pelo renderer e persistida na configuração Hermes já existente.

A tradução de menus e componentes próprios do Desktop deve continuar no renderer. Textos que pertencem ao Windows continuam sendo responsabilidade do sistema operacional e não devem ser simulados pelo aplicativo.

---

## 7. Requisitos funcionais

### FR-001 — Idioma oficial selecionável

O Desktop deve disponibilizar `pt-br` como locale reconhecido e **Português (Brasil)** como opção no seletor.

**Critérios de aceite**

- `Locale` reconhece `pt-br`.
- `LOCALE_OPTIONS` inclui `pt-br` com o endônimo correto.
- `LOCALE_META` disponibiliza seus metadados para o seletor existente.
- O usuário pode localizar a opção por nome e por código.

### FR-002 — Persistência igual aos demais idiomas

Ao selecionar pt-BR, o Desktop deve gravar `display.language: pt-br` usando o fluxo já existente.

**Critérios de aceite**

- Configurações não relacionadas são preservadas.
- Ao abrir novamente o Desktop, `display.language: pt-br` carrega o catálogo correto.
- Se a gravação falhar, o locale visível retorna ao valor anterior.

### FR-003 — Catálogo completo e tipado

Deve existir um catálogo `apps/desktop/src/i18n/pt-br.ts` de português brasileiro alinhado ao contrato `Translations`.

**Critérios de aceite**

- O catálogo atende ao contrato tipado final, evitando chaves novas sem tradução.
- Strings com interpolação preservam assinatura, parâmetros e comportamento.
- Nomes técnicos que fazem parte de identificadores operacionais não são alterados.
- Traduções pt-BR utilizam linguagem natural de produto para o Brasil.

> Para a primeira contribuição oficial, o objetivo é um catálogo completo tipado, e não uma coleção mínima de overrides. `defineLocale()` permanece uma proteção de fallback e não substitui a revisão de cobertura.

### FR-004 — Troca de interface em runtime

Ao trocar o idioma, o conteúdo renderizado pelo Desktop deve atualizar sem exigir reinício.

**Critérios de aceite**

- Rótulos, menus, barras, mensagens estáticas, tooltips e controles cobertos passam para pt-BR na mesma sessão.
- `document.documentElement.lang` é `pt-br`.
- `document.documentElement.dir` permanece `ltr`.
- O idioma pode ser trocado de volta para inglês, chinês, japonês ou árabe sem regressão.

### FR-005 — Fallback seguro

Uma chave ausente em pt-BR não pode tornar a interface inutilizável.

**Critérios de aceite**

- `translateNow()` resolve pt-BR, depois inglês e, no último caso, retorna a chave.
- Plugin sem bundle pt-BR usa seu bundle inglês, conforme o comportamento atual.
- Uma ausência é visível para revisão de qualidade, mas não causa erro de runtime.

### FR-006 — Cobertura da experiência Desktop

As strings estáticas que já pertencem ao catálogo Desktop devem receber tradução pt-BR, com prioridade para os fluxos de maior uso.

**Prioridade P0**

- seletor de idiomas;
- criação e navegação de sessões;
- sidebar, titlebar, statusbar e menus;
- composer, ações de mensagem e estados de chat;
- configurações, conexão e perfis;
- confirmação, aprovação, erro, carregamento e recuperação;
- arquivos, terminal, preview, review e ações de panes;
- labels de acessibilidade e atalhos.

**Prioridade P1**

- overlays menos frequentes;
- fluxos de plugins Desktop incluídos no build;
- mensagens de atualização e telas de instalação administradas pelo renderer;
- textos de recursos experimentais.

### FR-007 — Integridade operacional

A localização não deve alterar dados ou protocolos.

**Critérios de aceite**

- IDs como `session.new`, `view.showTerminal` e chaves de ferramenta permanecem identicamente estáveis.
- Slash commands, modelos, providers, MCPs, nomes de plugins, URLs e variáveis de ambiente não são traduzidos como identificadores.
- Sessões, conexões local/remota/cloud, perfis e ferramentas continuam operando com o locale pt-BR ativo.

---

## 8. Requisitos não funcionais

### NFR-001 — Acessibilidade

Todos os textos acessíveis dentro do catálogo devem manter significado correto em português, incluindo `aria-label`, descrições e mensagens de estado.

### NFR-002 — Layout no Windows

A tradução deve ser validada em janela Desktop no Windows, em tema claro e escuro, incluindo textos mais longos que os equivalentes em inglês.

### NFR-003 — Performance

A troca de idioma deve reutilizar o `I18nProvider` e os catálogos já carregados, sem introduzir chamadas de rede, reinício de backend ou reconstrução de conexões.

### NFR-004 — Manutenibilidade

Toda nova string core criada no futuro deve permanecer sob o contrato `Translations`, de modo que `pt-br` participe das verificações de tipo.

### NFR-005 — Compatibilidade

A alteração não deve exigir mudança de esquema de configuração, somente a adição de um valor válido para `display.language`.

### NFR-006 — Contribuição upstream

A entrega deve respeitar as orientações do repositório: alteração pequena, testada, sem mecanismo paralelo e sem alterações irrelevantes no mesmo PR.

### NFR-007 — Catálogo sincronizado com a fonte de verdade

O catálogo pt-BR deve ser produzido e validado contra o contrato `Translations` da `main` escolhida para a contribuição. Um catálogo de fork antigo não é aceito como fonte de verdade.

**Métrica de aceite:** `npm run typecheck` deve terminar com exit code `0` no checkout que contém o diff final.

### NFR-008 — Evidência reprodutível de testes

Antes de atribuir uma falha à localização, a mesma suíte deve ser executada no checkout `main` sem o diff pt-BR e no checkout candidato, no mesmo ambiente. Falhas preexistentes ou dependentes de locale do host devem ser registradas separadamente e não mascarar falhas introduzidas pela localização.

### NFR-009 — Segurança de supply chain e de conteúdo

O diff de localização não pode introduzir dependências, scripts, telemetria, chamadas de rede, leitura de segredos, mudança de permissões ou alteração de protocolos. Referências a tokens e senhas podem existir somente como cópia de interface já prevista pelo contrato de traduções.

---

## 9. Arquitetura e arquivos previstos

| Arquivo | Alteração prevista | Motivo |
|---|---|---|
| `apps/desktop/src/i18n/types.ts` | Adicionar `'pt-br'` ao union `Locale`. | Faz pt-BR ser um locale de primeira classe em toda a tipagem. |
| `apps/desktop/src/i18n/languages.ts` | Adicionar opção, nome, código persistido e aliases normalizados. | Torna o idioma selecionável e reconhece `ptbr`/`pt-BR`. |
| `apps/desktop/src/i18n/catalog.ts` | Importar e registrar `ptBR`. | Faz o catálogo ser resolvido pelo contexto e runtime. |
| `apps/desktop/src/i18n/pt-br.ts` | Criar o catálogo pt-BR. | Fornece a cópia exibida na interface. |
| `apps/desktop/src/i18n/languages.test.ts` | Cobrir aliases e persistência de `pt-br`. | Impede regressão na normalização. |
| `apps/desktop/src/i18n/context.test.tsx` | Cobrir carregamento, gravação, rollback e atributos do documento. | Protege o ciclo de vida do idioma. |
| `apps/desktop/src/i18n/runtime.test.ts` | Cobrir lookup, interpolação e fallback pt-BR. | Protege textos usados fora de componentes React. |
| `apps/desktop/src/components/language-switcher.test.tsx` | Selecionar Português (Brasil) e verificar persistência. | Protege o fluxo que o usuário utiliza. |
| Bundles de plugins Desktop incluídos | Adicionar `pt-br` quando houver interface própria no escopo. | Evita inglês em plugins internos; terceiros continuam com fallback. |

### Arquivos que não devem ser alterados na primeira entrega

- `agent/i18n.py`;
- `locales/pt.yaml`;
- `apps/desktop/electron/main.ts`, salvo descoberta de uma string de UI criada pelo main process que não possa ser resolvida pelo renderer;
- protocolos IPC;
- comandos do backend;
- instaladores Windows;
- `.claude`, `.codex`, `.gemini` ou configurações específicas de IDE.

---

## 10. Estratégia de qualidade e validação

### 10.1 Testes automatizados obrigatórios

No checkout do Hermes, executar pelo menos:

```bash
cd apps/desktop
npm run typecheck
npm run lint
npm run test:ui
npm run test:desktop:platforms
```

E, quando a alteração atingir caminhos de empacotamento, instalação, update ou release:

```bash
npm run test:desktop:all
```

### 10.2 Casos de teste necessários

1. `normalizeLocale('pt-BR')` resolve para `pt-br`.
2. `normalizeLocale('pt_br')` resolve para `pt-br`.
3. `normalizeLocale('ptbr')` resolve para `pt-br`.
4. `localeConfigValue('pt-br')` retorna `pt-br`.
5. Configuração `display.language: pt-br` inicia o renderer em pt-BR.
6. O seletor mostra e salva Português (Brasil) preservando outras configurações.
7. Falha de persistência reverte a interface para o locale anterior.
8. `document.lang` muda para `pt-br` e `dir` permanece `ltr`.
9. `translateNow()` resolve uma string e uma interpolação em pt-BR.
10. Chave ausente em pt-BR cai para inglês sem falhar.
11. Plugin sem `pt-br` usa inglês; plugin com `pt-br` usa a tradução brasileira.

### 10.3 Aceitação manual no Windows

Validar em uma instalação Desktop Windows:

- trocar de English para Português (Brasil);
- criar sessão, aba e janela;
- abrir Settings, Profiles e Connections;
- abrir Files, Terminal, Preview e Review;
- usar menus contextuais e atalhos visíveis;
- alternar tema claro/escuro;
- verificar tela em escala padrão e uma escala maior;
- reiniciar o aplicativo e confirmar persistência;
- retornar para outro locale;
- confirmar que textos operacionais, comandos e nomes técnicos não foram corrompidos.

---

## 11. Glossário inicial pt-BR

| Termo fonte | Padrão inicial |
|---|---|
| New session | Nova sessão |
| New session tab | Nova aba de sessão |
| New window | Nova janela |
| Sidebar | Barra lateral |
| Settings | Configurações |
| Workspace | Área de trabalho |
| Gateway | Gateway |
| Provider | Provedor |
| Tool | Ferramenta |
| Skill | Skill |
| Plugin | Plugin |
| Profile | Perfil |
| Connection | Conexão |
| Preview | Visualização |
| Review | Revisão |
| Artifact | Artefato |
| Retry | Tentar novamente |
| Fallback | Alternativa de segurança / fallback, conforme contexto |

Identificadores técnicos permanecem em inglês quando forem valores operacionais, como `MCP`, `worktree`, `API key`, comandos, URLs e nomes próprios.

---

## 12. Riscos e mitigação

| Risco | Impacto | Mitigação |
|---|---|---|
| Criar mais uma PR duplicada | Alto | Coordenar ou contribuir para uma PR existente antes de iniciar código. |
| Catálogo parcial esconder lacunas via fallback | Alto | Meta de catálogo pt-BR completo tipado e auditoria de cobertura. |
| Alterar placeholders/interpoladores | Alto | Preservar assinaturas TypeScript e cobrir com testes runtime. |
| Traduzir IDs, comandos ou contratos | Alto | Separar valor exibido de identificador e revisar diff por categorias. |
| Texto pt-BR truncar no Windows | Médio | Teste visual/manual em superfícies prioritárias e escala maior. |
| Tradução de plugin interno faltar | Médio | Inventariar bundles internos e adicionar pt-BR onde aplicável; fallback para terceiros. |
| Upstream avançar enquanto o trabalho é preparado | Médio | Rebase frequente e branch pequena focada em i18n. |
| Catálogo de fork ficar incompatível com `Translations` | Alto | Partir da `main` atual; tratar `npm run typecheck` como gate bloqueante; não copiar catálogo sem reconciliação de chaves. |
| Confundir fallback em inglês com cobertura pt-BR | Alto | Exigir catálogo completo tipado e revisão de chaves/strings antes da validação manual. |
| PR parecer segura por não executar código, mas permanecer inviável | Alto | Avaliar segurança, compatibilidade, qualidade linguística e CI como critérios independentes. |
| Falhas da suíte dependerem do locale do ambiente | Médio | Executar baseline sem diff no mesmo host, documentar falhas preexistentes e estabilizar o ambiente de teste antes de concluir a validação. |
| CI ausente ou somente revisão automatizada superficial | Alto | Exigir execução local dos gates obrigatórios e anexar saídas verificáveis ao PR. |
| Divergência terminológica | Médio | Manter glossário e revisão linguística antes do PR. |
| Escopo crescer para backend/installer | Médio | Manter esta versão Desktop Windows; abrir iniciativa separada para novas superfícies. |

---

## 13. Dependência, avaliação upstream e decisão de contribuição

### 13.1 Trabalhos existentes identificados

- [PR #76863](https://github.com/NousResearch/hermes-agent/pull/76863) — `feat(desktop): add Brazilian Portuguese (pt-BR) locale (i18n)`.
- [PR #86292](https://github.com/NousResearch/hermes-agent/pull/86292) — `feat(desktop): add Brazilian Portuguese localization`.
- [PR #78528](https://github.com/NousResearch/hermes-agent/pull/78528) — pt-BR junto com correções de boot.
- [Issue #40239](https://github.com/NousResearch/hermes-agent/issues/40239) — solicitação de suporte pt-BR no Desktop.

### 13.2 Evidência verificada para a PR #86292

A PR #86292 foi analisada como candidata e **não é uma base aprovada para contribuição direta**.

| Aspecto | Evidência verificada | Decisão |
|---|---|---|
| Escopo de segurança | O diff contém catálogo/localidade; não foram encontrados `eval`, `child_process`, novas dependências, chamadas de rede, leitura de segredos ou código executável novo. | Baixo risco de execução maliciosa no diff analisado. |
| Histórico | Head da PR: `e4ea87e...`; comparação contra a `main` analisada: `ahead_by=2`, `behind_by=1822`, estado `diverged`. | Não usar a branch como base de implementação. |
| Contrato de tipos | Ao reaplicar o catálogo sobre a `main` atual, `npm run typecheck` falhou com múltiplas chaves obrigatórias ausentes e incompatibilidades de assinatura. | Bloqueador crítico. |
| Lint | `npm run lint` falhou por ordenação de import em `apps/desktop/src/i18n/catalog.ts`. | Bloqueador até correção e nova validação. |
| Qualidade pt-BR | Foram confirmados erros como `Restaurar padrãos`, `resposta pronto`, `Nenhum resultados encontrado` e `Gateway Configurações salvo`. | Exige revisão linguística integral por falante nativo. |
| Testes/CI | A PR não tinha check-runs do projeto; o status apresentado era apenas revisão automatizada. Não foram adicionados testes pt-BR. | Evidência insuficiente para merge. |
| Suíte UI local | `npm run test:ui` teve 4 falhas, algumas compatíveis com sensibilidade ao locale do host; não houve baseline sem o diff na mesma execução. | Não usar este resultado para culpar a tradução; registrar e reproduzir com baseline. |

### 13.3 Decisão arquitetural obrigatória

1. **Não fazer commit na branch da PR #86292 e não fazer cherry-pick do catálogo sem reconciliação.**
2. **Não abrir uma nova PR concorrente antes de coordenar na issue #40239 e revisar as PRs abertas.**
3. Se houver autorização upstream para consolidar, a implementação deve nascer da `main` atual, com autoria preservada quando houver trechos aproveitáveis e revisáveis.
4. A referência ao trabalho anterior deve ser explícita no issue/PR; aceitação upstream não é presumida.

Essa decisão preserva segurança, evita duplicação e impede que um catálogo obsoleto use fallback em inglês para ocultar cobertura incompleta.

---

## 14. Plano de entrega

### Fase A — Coordenação upstream e baseline

- registrar na issue `#40239` a intenção de consolidar a tradução, sem abrir PR concorrente;
- revisar as PRs existentes, incluindo seus diffs, status e distância da `main`;
- documentar que a PR `#86292` é referência linguística parcial, não base técnica;
- criar checkout limpo da `main` atual e executar os gates de baseline no mesmo ambiente do candidato;
- registrar separadamente qualquer falha preexistente ou dependente do locale do host.

### Fase B — Implementação do locale

- adicionar ou corrigir `pt-br` na tipagem, catálogo, opções e aliases;
- gerar o catálogo a partir do `Translations` da `main` atual e mantê-lo completo/tipado;
- revisar integralmente o texto com glossário, assinatura de interpoladores e revisão humana pt-BR;
- adaptar bundles internos de plugin dentro do escopo;
- não alterar backend ou instalador.

### Fase C — Testes e revisão

- adicionar testes pt-BR para aliases, persistência, rollback, runtime, fallback, seletor e plugins;
- executar testes automatizados previstos e compará-los ao baseline;
- revisar interpolação e fallback;
- executar aceitação manual no Windows;
- revisar glossário, acessibilidade e truncamentos.

### Fase D — Contribuição

- rebasear sobre `main`;
- manter commits focados;
- incluir descrição clara de escopo e validação;
- referenciar issue/PRs de coordenação e indicar claramente o que foi ou não reaproveitado;
- enviar para revisão upstream sem prometer merge ou prazo.

---

## 15. Não objetivos e decisões futuras

O backend já possui uma arquitetura de i18n separada e também possui catálogos portugueses parciais. Ele será avaliado em uma iniciativa posterior, após o Desktop Windows estar estável.

Da mesma forma, a tradução do instalador, macOS, Linux, Web Dashboard, TUI, CLI, documentação e conteúdo gerado por modelo não deve ser inserida furtivamente nesta PR. Cada uma dessas superfícies possui ciclo de release, requisitos e fontes de verdade próprios.

---

## 16. Definition of Done

A entrega pt-BR para o Hermes Desktop Windows estará pronta para revisão quando:

- [ ] `pt-br` é uma localidade tipada, selecionável e persistente.
- [ ] O seletor mostra **Português (Brasil)**.
- [ ] O catálogo pt-BR cobre o contrato `Translations` da `main` escolhida e `npm run typecheck` passa.
- [ ] Placeholders e funções de interpolação foram validados.
- [ ] Fallback para inglês está testado.
- [ ] Troca e rollback de idioma estão testados.
- [ ] `document.lang='pt-br'` e `dir='ltr'` foram verificados.
- [ ] Principais fluxos do Desktop foram validados manualmente no Windows.
- [ ] IDs, comandos, protocolos e dados operacionais não foram alterados.
- [ ] O escopo não contém backend, CLI, TUI, Web Dashboard ou instalador.
- [ ] A estratégia de coordenação com as PRs pt-BR existentes foi decidida e documentada.
- [ ] Nenhum conteúdo da PR #86292 foi incorporado sem revisão de compatibilidade e qualidade linguística.
- [ ] `npm run lint` passa sem erros introduzidos pelo pt-BR.
- [ ] Os testes Desktop relevantes passam no checkout escolhido; falhas preexistentes foram reproduzidas no baseline e documentadas separadamente.
- [ ] O diff pt-BR não adiciona dependências, scripts, telemetria, chamadas de rede ou acesso a segredos.
- [ ] O PR segue licença MIT, preserva avisos aplicáveis e não declara aprovação oficial da Nous Research.

---

## 17. Evidências de validação desta revisão

| Item | Resultado | Interpretação |
|---|---|---|
| Clone da `main` | Concluído em checkout temporário; HEAD `27562ad5f80e90f7d552f92dbd4af7f1f511c3c8`. | Base técnica inspecionada. |
| `npm ci` | Concluído; o auditor do npm reportou vulnerabilidades transitivas do repositório, fora do diff pt-BR. | Não atribuir essas vulnerabilidades à localização; tratá-las como risco separado do projeto. |
| Reaplicação do conteúdo de #86292 na `main` | O catálogo provocou falhas de typecheck por divergência de contrato. | Confirma que o fork antigo não é base segura de integração. |
| `npm run lint` | Falhou por ordenação de import no catálogo. | A contribuição candidata não passou o gate. |
| `npm run test:ui` | 4 falhas; não houve baseline sem diff no mesmo ambiente. | Resultado inconclusivo para regressão pt-BR; requer reprodução controlada. |

## 18. Handoff

Após a execução local, o próximo passo é a revisão final linguística/Windows e a coordenação upstream. As stories AIOX foram criadas e executadas localmente; a publicação remota permanece separada.

Nenhum push, PR ou merge remoto deve ocorrer até que a estratégia de contribuição existente seja aprovada explicitamente.
