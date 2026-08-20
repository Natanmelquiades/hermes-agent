# Coordenação upstream — Story 1.1

## Decisão local

A implementação local seguirá a `main` atual do repositório oficial:

```text
NousResearch/hermes-agent
commit: 27562ad5f80e90f7d552f92dbd4af7f1f511c3c8
```

A PR #86292 será tratada somente como referência linguística parcial. O catálogo foi reaproveitado como ponto de partida, mas foi reconciliado com o contrato `Translations` atual, teve chaves ausentes adicionadas e passou por correções de tipagem e revisão pt-BR.

## Restrições

- Não fazer commit na branch da PR #86292.
- Não fazer cherry-pick de histórico antigo.
- Não abrir PR concorrente automaticamente.
- Não publicar comentário na issue #40239 sem autorização remota explícita.
- Não fazer push ou merge.

## Estratégia para futura contribuição

Quando a entrega local passar pelos gates, preparar uma única contribuição referenciando:

- issue #40239;
- PR #86292 e demais trabalhos concorrentes;
- commit-base atual;
- decisões de compatibilidade;
- resultados reais de typecheck, lint, testes e aceitação Windows.

A aceitação, consolidação ou rejeição pela Nous Research não é presumida.

## Estado

```yaml
coordination: local-decision-recorded
remote_issue_updated: false
remote_pr_created: false
remote_push: false
technical_base: current-main
old-pr-used-as: linguistic-reference-only
```
