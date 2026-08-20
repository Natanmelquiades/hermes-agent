# Hermes em Português Brasileiro

> **Tipo:** Ideia de produto / iniciativa de localização
> **Status:** Em validação
> **Idioma-alvo:** Português do Brasil (`pt-BR`)
> **Plataformas prioritárias:** Windows e macOS
> **Projeto-base:** Hermes Agent, da Nous Research

## 1. Ideia

Criar uma localização profissional e completa do Hermes Agent para usuários brasileiros, traduzindo a interface Desktop, menus, barras, botões, configurações, onboarding, notificações e mensagens estáticas suportadas pelo backend — sem alterar o funcionamento interno, os comandos, os identificadores ou os protocolos do sistema.

A iniciativa tem como objetivo tornar o Hermes mais acessível ao público brasileiro e preparar uma contribuição de alta qualidade para possível adoção upstream pela Nous Research.

## 2. Visão

Permitir que uma pessoa brasileira utilize o Hermes no Windows e no macOS entendendo claramente cada parte da aplicação, desde a primeira tela até recursos avançados como sessões, ferramentas, terminal, arquivos, perfis, gateways, MCP, skills e atualizações.

A tradução deve parecer parte nativa do produto: consistente, natural, acessível, tecnicamente correta e resistente às atualizações futuras do Hermes.

## 3. Problema

O Hermes Desktop já possui uma arquitetura de internacionalização, mas a cobertura atual não inclui português brasileiro de forma completa. Além disso:

- algumas áreas da interface podem continuar com textos em inglês;
- menus e barras precisam ser tratados como parte do mesmo sistema de tradução;
- o backend possui apenas uma camada parcial de mensagens estáticas traduzíveis;
- textos em português podem ocupar mais espaço que os textos originais;
- uma tradução feita diretamente no código pode quebrar placeholders, comandos, IDs e integrações;
- uma contribuição externa precisa respeitar a arquitetura, os testes e as regras de licenciamento do projeto original.

## 4. Solução proposta

Adicionar o português brasileiro como localidade oficial do Hermes, aproveitando o sistema de i18n existente.

A solução deve:

1. criar o catálogo `pt-BR` do Desktop;
2. registrar o idioma no seletor e na configuração persistida;
3. traduzir todas as strings visíveis dentro do escopo aprovado;
4. remover textos de interface hardcoded e utilizar `useI18n()`;
5. preservar fallback para inglês;
6. manter placeholders, IDs, comandos, nomes técnicos e protocolos intactos;
7. ampliar o catálogo parcial do backend apenas dentro do escopo suportado;
8. validar a experiência no Windows e no macOS;
9. documentar o glossário e as decisões terminológicas;
10. preparar PRs pequenos e revisáveis para o repositório oficial.

## 5. O que será traduzido

### Interface Desktop

- barra lateral;
- barra superior;
- barra de status;
- nova sessão, nova aba e nova janela;
- menus de sessão;
- command palette e command center;
- atalhos de teclado;
- tooltips e rótulos de acessibilidade;
- configurações;
- onboarding;
- instalação e atualização;
- perfis e conexões;
- gateways;
- providers e modelos, mantendo nomes próprios;
- skills e agentes;
- MCP;
- terminal, arquivos, preview e review;
- artifacts, cron e messaging;
- notificações;
- mensagens de erro, carregamento, vazio e recuperação.

### Backend

Mensagens estáticas que já são suportadas pelo sistema de i18n do backend e que forem confirmadas no inventário da iniciativa.

## 6. O que não será traduzido automaticamente

Não devem ser alterados por uma tradução de interface:

- IDs internos;
- rotas;
- protocolos;
- payloads JSON;
- comandos como `/new`, `/model` e `/reset`;
- nomes de modelos e providers;
- nomes de ferramentas, skills e plugins;
- caminhos de arquivos;
- variáveis de ambiente;
- código;
- saída bruta de ferramentas;
- logs e tracebacks;
- respostas geradas pelo modelo;
- qualquer conteúdo dinâmico ainda não incluído no contrato de i18n.

Esses itens poderão ser avaliados em iniciativas futuras, mas não fazem parte da primeira entrega.

## 7. Princípios

### Segurança antes de abrangência

Nenhuma tradução pode quebrar uma sessão, uma conexão, um comando, uma ferramenta ou uma atualização.

### Um sistema de tradução

Toda string visível deve passar pelo mecanismo oficial de i18n. Não serão usados scripts de substituição textual ou traduções espalhadas pelo código.

### Fallback seguro

Se uma tradução estiver ausente ou inválida, o sistema deve exibir o inglês e continuar funcionando.

### Português brasileiro natural

O texto deve ser revisado para o uso real no Brasil, evitando traduções literais, termos artificiais e inconsistências entre telas.

### Glossário consistente

Termos recorrentes devem possuir uma decisão única. Exemplos: sessão, área de trabalho, gateway, ferramenta, skill, artefato e configurações.

### Upstream-friendly

A implementação deve seguir os padrões do repositório original, ser fácil de revisar e não presumir que a Nous Research aceitará a contribuição.

## 8. Fases planejadas

### Fase 1 — Inventário

- mapear todas as strings visíveis;
- localizar textos hardcoded;
- separar interface, texto técnico e conteúdo dinâmico;
- comparar os catálogos existentes;
- identificar pontos de integração com Electron;
- definir glossário inicial;
- registrar decisões pendentes.

### Fase 2 — Infraestrutura pt-BR

- criar o catálogo brasileiro;
- registrar o idioma;
- persistir a preferência;
- garantir fallback;
- adicionar testes de idioma, chaves e placeholders.

### Fase 3 — Tradução do Desktop

- traduzir o shell principal;
- traduzir menus e barras;
- traduzir configurações e onboarding;
- traduzir painéis e estados de erro;
- revisar acessibilidade;
- validar textos longos e diferentes escalas de interface.

### Fase 4 — Backend

- revisar o suporte atual a `pt`;
- decidir a compatibilidade entre `pt` e `pt-BR`;
- ampliar as mensagens estáticas aprovadas;
- manter fora do escopo logs, tracebacks, ferramentas e respostas do modelo.

### Fase 5 — Validação

- executar testes unitários;
- executar testes de interface;
- validar Windows;
- validar macOS;
- testar instalação, atualização, perfis e conexões dentro do escopo;
- verificar acessibilidade e regressões visuais.

### Fase 6 — Contribuição upstream

- organizar commits;
- documentar decisões;
- revisar licença e avisos de terceiros;
- preparar Pull Request;
- submeter para revisão da Nous Research, sem prometer aprovação ou merge.

## 9. Critérios de qualidade

A ideia será considerada pronta para implementação quando:

- o catálogo pt-BR estiver integrado ao sistema existente;
- as strings da interface tiverem cobertura definida;
- o fallback estiver testado;
- placeholders estiverem protegidos;
- IDs, comandos e protocolos permanecerem inalterados;
- o glossário estiver documentado;
- os principais fluxos do Desktop estiverem validados em Windows e macOS;
- as áreas fora do escopo estiverem claramente documentadas;
- houver um plano de contribuição upstream.

## 10. Riscos principais

| Risco | Mitigação |
|---|---|
| Texto traduzido diretamente no código quebrar lógica | Usar chaves tipadas e separar apresentação de identificadores |
| Traduções ausentes causarem interface inconsistente | Fallback automático e teste de paridade dos catálogos |
| Português ocupar mais espaço | Testes visuais, responsividade e validação com textos longos |
| Menu ou recurso nativo permanecer em inglês | Inventário separado para Renderer e Electron |
| Backend usar `pt` e Desktop usar `pt-BR` de forma incompatível | Definir contrato de idioma antes da implementação |
| Novas atualizações reintroduzirem inglês | Regra de i18n no CI e revisão de novas strings |
| Contribuição não ser aceita upstream | Manter fork/contribuição compatível e documentada, sem depender do merge |
| Problemas com marcas ou dependências de terceiros | Preservar avisos, licença MIT e identidade oficial do projeto |

## 11. Resultado esperado

Ao final, um usuário brasileiro deverá conseguir:

- instalar e iniciar o Hermes;
- criar uma nova sessão;
- navegar pelos menus e barras;
- configurar modelos, providers e ferramentas;
- utilizar arquivos, terminal e preview;
- gerenciar perfis, sessões e conexões;
- compreender mensagens de erro e recuperação;
- alterar e manter o idioma em português;
- continuar usando comandos e identificadores técnicos sem incompatibilidade.

## 12. Questões em aberto

- O identificador oficial deverá ser `pt`, `pt-BR` ou ambos?
- A Nous Research possui uma política específica para novos idiomas?
- Quais versões de Windows e macOS serão usadas na validação?
- Linux será apenas preservado por compatibilidade ou também será testado?
- Quais mensagens do backend serão consideradas parte da primeira entrega?
- Quem fará a revisão linguística final?
- Qual será o processo de manutenção quando novas chaves forem adicionadas?
- A tradução será opt-in inicialmente ou poderá ser selecionada diretamente nas configurações?

## 13. Próximo passo recomendado

Transformar esta ideia em um PRD formal em `docs/prd/hermes-pt-br-prd.md` e, após sua aprovação, delegar ao Story Manager (`@sm`) a decomposição em épicos e histórias implementáveis.

## 14. Licença e contribuição

O Hermes Agent e o Desktop são publicados sob a licença MIT, conforme o repositório oficial. A licença permite modificar, traduzir e distribuir o software, desde que os avisos de copyright e o texto da licença sejam preservados.

A licença MIT não concede automaticamente direitos sobre marcas, logotipos ou identidade visual da Nous Research. Dependências de terceiros também devem ser respeitadas.

A iniciativa deve ser apresentada como uma contribuição de localização para o Hermes, sem declarar que é oficial ou aprovada pela Nous Research antes de uma confirmação formal.
