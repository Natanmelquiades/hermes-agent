# Mapa de Backlog — Hermes Desktop pt-BR

> **Status:** Cobertura visual em andamento — publicação upstream bloqueada
> **Fonte:** [`../prd/hermes-desktop-pt-br-prd.md`](../prd/hermes-desktop-pt-br-prd.md)
> **Escopo:** Hermes Desktop; validação inicial no Windows
> **Locale canônico:** `pt-br` — **Português (Brasil)**
> **Atualizado em:** 2026-08-20

---

## 1. Objetivo deste mapa

Este documento organiza a sequência de trabalho necessária para tornar pt-BR um locale oficial do Hermes Desktop. Ele **não cria stories de implementação**, não cria tarefas remotas, não altera o repositório oficial Hermes e não substitui o processo AIOX completo de épicos/stories. O checkpoint técnico autorizado foi publicado somente no fork pessoal.

A criação de stories detalhadas está liberada para o trabalho local porque o checkout possui `.aiox-core/core-config.yaml`, o gate técnico foi executado e a Story 1.7 foi criada em branch separada. A publicação upstream continua bloqueada até a cobertura visual e a coordenação com os mantenedores.

As restrições que permanecem são:

1. o PRD exige coordenação upstream antes de abrir uma contribuição formal;
2. a PR upstream #86292 foi verificada como incompatível com a `main` analisada e não deve ser usada como base direta;
3. nenhum PR ou merge no repositório oficial é permitido nesta etapa.

---

## 2. Gate global de entrada

Nenhum item de implementação pode passar para **Pronto para story** até que todos os itens abaixo sejam concluídos e tenham evidência registrada:

- [ ] Coordenação registrada na [issue #40239](https://github.com/NousResearch/hermes-agent/issues/40239), sem abrir PR concorrente.
- [x] Estratégia local para os trabalhos existentes, incluindo a [PR #86292](https://github.com/NousResearch/hermes-agent/pull/86292), documentada.
- [x] Checkout limpo da `main` atual definido como fonte de verdade.
- [x] Baseline de typecheck, lint e testes executado no mesmo ambiente que será usado para o candidato.
- [x] Falhas preexistentes e falhas dependentes do locale do host separadas das regressões introduzidas pelo pt-BR.
- [x] Autorização explícita para iniciar implementação recebida.

**Estado atual do gate:** ✅ **Checkpoint publicado no fork pessoal; cobertura visual em andamento; publicação upstream bloqueada**

---

## 3. Backlog ordenado por dependência

| Ordem | Item | Tipo | Estado | Depende de | Resultado de planejamento esperado |
|---:|---|---|---|---|---|
| 0 | BL-00 — Decisão de coordenação upstream | Governança | ✅ Concluído localmente | Nenhum | Estratégia local registrada; sem escrita remota. |
| 1 | BL-01 — Baseline técnico reproduzível | Qualidade | ✅ Concluído com CONCERNS | BL-00 | Baseline e falhas ambientais registrados. |
| 2 | BL-02 — Inventário do contrato de tradução atual | Arquitetura | ✅ Concluído | BL-01 | Contrato `Translations` atual usado como fonte. |
| 3 | BL-03 — Registro formal de locale e aliases | Implementação | ✅ Concluído | BL-02 + autorização | `pt-br`, seletor, aliases e persistência implementados. |
| 4 | BL-04 — Catálogo pt-BR completo e revisão linguística | Conteúdo/UI | ✅ Concluído com revisão final | BL-02 + autorização | Catálogo completo estruturalmente e revisado. |
| 5 | BL-05 — Cobertura automatizada de i18n | Qualidade | ✅ Concluído | BL-03 + BL-04 | 27 testes direcionados passaram; completude 0 ausências. |
| 6 | BL-06 — Aceitação manual no Windows | QA | ✅ Concluído com CONCERNS | BL-05 | Troca visual passou; persistência E2E requer backend configurado. |
| 7 | BL-07 — Preparação de contribuição upstream | Entrega | 🚧 Checkpoint no fork; PR upstream bloqueada | BL-00 a BL-06 | Branch de checkpoint publicada no fork; nenhum PR/merge oficial. |
| 8 | BL-08 — Cobertura visual e strings hardcoded | Qualidade/UI | 🔄 Em andamento | BL-03 a BL-07 | Matriz por tela e Story 1.7; migração visual ainda pendente. |

---

## 4. Detalhamento dos itens

### BL-00 — Decisão de coordenação upstream

- **Objetivo:** definir como colaborar sem duplicar PRs já abertas.
- **Fonte no PRD:** seção 13.1 a 13.3.
- **Executor recomendado:** @sm em parceria com @pm; publicação/remoto somente com @github-devops ou autorização explícita do usuário.
- **Restrições:** não abrir PR concorrente; não fazer commit na branch da PR #86292; não fazer cherry-pick do catálogo obsoleto sem reconciliação.
- **Critérios para liberar BL-01:**
  - [ ] abordagem escolhida: contribuir, consolidar ou substituir com justificativa;
  - [ ] referência a issue e PRs existentes preparada;
  - [ ] o plano preserva atribuição de autoria para trechos realmente reaproveitados.

### BL-01 — Baseline técnico reproduzível

- **Objetivo:** obter uma linha de base verificável da `main` atual antes de avaliar pt-BR.
- **Fonte no PRD:** NFR-008, seção 10.1 e seção 17.
- **Executor recomendado:** @qa com suporte de @architect.
- **Restrições:** não atribuir falha à localização sem comparar baseline e candidato no mesmo ambiente.
- **Critérios para liberar BL-02:**
  - [ ] commit exato da `main` registrado;
  - [ ] `npm ci`, typecheck, lint e testes relevantes executados no baseline;
  - [ ] resultados e falhas preexistentes documentados;
  - [ ] sensibilidade ao locale do host, se houver, isolada.

### BL-02 — Inventário do contrato de tradução atual

- **Objetivo:** mapear a fonte de verdade antes de criar qualquer catálogo novo.
- **Fonte no PRD:** FR-003, NFR-007 e seção 9.
- **Executor recomendado:** @architect.
- **Restrições:** `Translations` da `main` escolhida é a fonte de verdade; fork antigo serve somente como referência linguística parcial.
- **Critérios para liberar BL-03 e BL-04:**
  - [ ] arquivos e testes impactados confirmados;
  - [ ] assinaturas de interpoladores identificadas;
  - [ ] superfícies de plugins Desktop internos inventariadas;
  - [ ] diferenças entre catálogos existentes e o contrato atual registradas.

### BL-03 — Registro formal de locale e aliases

- **Objetivo:** preparar a mudança mínima que torna `pt-br` selecionável e persistente.
- **Fonte no PRD:** FR-001, FR-002, seção 5 e seção 9.
- **Executor recomendado:** @dev.
- **Pré-condição adicional:** autorização explícita para implementação.
- **Escopo planejado:** `types.ts`, `languages.ts`, `catalog.ts` e testes correlatos.
- **Critérios de aceite futuros:**
  - [ ] `pt-br` é o ID interno/persistido;
  - [ ] `pt-BR`, `pt_BR` e `ptbr` normalizam para `pt-br`;
  - [ ] o seletor exibe **Português (Brasil)**;
  - [ ] configurações não relacionadas são preservadas ao salvar `display.language`.

### BL-04 — Catálogo pt-BR completo e revisão linguística

- **Objetivo:** produzir a cópia pt-BR do Desktop sem alterar identificadores operacionais.
- **Fonte no PRD:** FR-003, FR-006, FR-007 e glossário da seção 11.
- **Executor recomendado:** @dev, com revisão humana de português brasileiro.
- **Pré-condição adicional:** autorização explícita para implementação.
- **Restrições:**
  - não traduzir comandos, IDs, protocolos, URLs, providers, modelos, MCPs ou nomes próprios;
  - preservar interpoladores e suas assinaturas;
  - não usar fallback em inglês como substituto de cobertura planejada.
- **Critérios de aceite futuros:**
  - [ ] catálogo satisfaz `Translations` da `main` escolhida;
  - [ ] erros linguísticos conhecidos da PR #86292 não são propagados;
  - [ ] terminologia está consistente com o glossário aprovado.

### BL-05 — Cobertura automatizada de i18n

- **Objetivo:** impedir regressões no ciclo de vida do locale.
- **Fonte no PRD:** seção 10.2 e Definition of Done.
- **Executor recomendado:** @qa, com suporte de @dev.
- **Pré-condição adicional:** BL-03 e BL-04 concluídos em branch autorizada.
- **Cobertura planejada:** aliases, persistência, rollback, `document.lang`, `dir`, runtime, interpolação, fallback e bundles de plugin.
- **Critérios de aceite futuros:**
  - [ ] typecheck passa;
  - [ ] lint passa sem erro introduzido pelo pt-BR;
  - [ ] testes pt-BR foram adicionados e passam;
  - [ ] resultado do candidato foi comparado ao baseline.

### BL-06 — Aceitação manual no Windows

- **Objetivo:** validar a experiência real do usuário no Desktop Windows.
- **Fonte no PRD:** NFR-001, NFR-002 e seção 10.3.
- **Executor recomendado:** @qa.
- **Pré-condição adicional:** BL-05 concluído.
- **Cenários planejados:** troca de idioma, reinício, tema claro/escuro, escala maior, sessões, Settings, Profiles, Connections, Files, Terminal, Preview, Review, menus e retorno a outro locale.
- **Critérios de aceite futuros:**
  - [ ] não há truncamento impeditivo nos fluxos P0;
  - [ ] acessibilidade e textos de estado estão compreensíveis;
  - [ ] dados operacionais e comandos permanecem intactos;
  - [ ] não há regressão observável ao retornar para outro idioma.

### BL-07 — Preparação de contribuição upstream

- **Objetivo:** preparar uma contribuição revisável e honesta.
- **Fonte no PRD:** NFR-006, seção 13 e Definition of Done.
- **Executor recomendado:** @github-devops, após validação de @qa e revisão de @architect.
- **Pré-condição adicional:** todos os itens anteriores concluídos e autorização explícita para operação remota.
- **Critérios de aceite futuros:**
  - [ ] branch parte da `main` atual;
  - [ ] diff limitado à localização Desktop e seus testes;
  - [ ] comandos de validação e seus resultados são incluídos na descrição;
  - [ ] issue/PRs relacionados são referenciados;
  - [ ] a descrição não promete merge, release ou aprovação da Nous Research.

### BL-08 — Cobertura visual e strings hardcoded

- **Objetivo:** confirmar que os textos visíveis do Desktop realmente passam pelo mecanismo i18n e que a experiência em Português (Brasil) não fica parcialmente em inglês.
- **Fonte:** Story 1.7 e `docs/qa/ptbr-visual-coverage-matrix.md`.
- **Executor recomendado:** @dev, com quality gate @qa e revisão arquitetural quando houver mudança de fronteira.
- **Branch de trabalho:** `work/desktop-ptbr-visual-coverage`, baseada na `origin/main` atual e integrada ao checkpoint `f71932021b`.
- **Escopo:** telas P0/P1, strings hardcoded em TSX/TS, labels de acessibilidade, placeholders, tooltips, estados vazios/erro/carregamento e validação visual Windows/Electron.
- **Restrições:** preservar comandos, IDs, URLs, protocolos, providers/modelos, nomes técnicos, logs e conteúdo dinâmico; não criar mecanismo i18n paralelo.
- **Critérios de aceite:**
  - [ ] matriz de cobertura atualizada com evidência por tela;
  - [ ] candidatos hardcoded classificados como traduzíveis ou técnicos/dinâmicos;
  - [ ] strings traduzíveis migradas para o catálogo existente;
  - [ ] testes focados e validação visual passam;
  - [ ] falhas gerais preexistentes continuam separadas e documentadas;
  - [ ] nenhum PR/merge no repositório oficial sem nova autorização explícita.

---

## 5. Matriz de rastreabilidade

| Requisito do PRD | Itens de backlog que o atendem |
|---|---|
| FR-001 — Idioma selecionável | BL-02, BL-03, BL-05, BL-06 |
| FR-002 — Persistência | BL-03, BL-05, BL-06 |
| FR-003 — Catálogo completo e tipado | BL-02, BL-04, BL-05 |
| FR-004 — Troca em runtime | BL-03, BL-05, BL-06 |
| FR-005 — Fallback seguro | BL-04, BL-05 |
| FR-006 — Cobertura Desktop | BL-02, BL-04, BL-06, BL-08 |
| FR-007 — Integridade operacional | BL-02, BL-04, BL-05, BL-06 |
| NFR-007 — Fonte de verdade | BL-01, BL-02, BL-05 |
| NFR-008 — Baseline reproduzível | BL-01, BL-05 |
| NFR-009 — Segurança do diff | BL-02, BL-07, BL-08 |

---

## 6. Critério para converter itens em stories

Os itens deste mapa só podem ser convertidos em stories AIOX quando:

1. o gate global de entrada estiver liberado;
2. `aiox-core/core-config.yaml` estiver presente e configurado;
3. houver uma estrutura de épico aprovada pelo papel de produto;
4. o repositório de trabalho e a `main` de referência estiverem definidos;
5. a implementação tiver autorização explícita do usuário.

Este documento registra a execução local concluída. Qualquer operação remota continua dependente de revisão e autorização explícitas.
