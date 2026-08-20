# Aceitação Windows — Story 1.5

> **Instância:** Electron isolado, `HERMES_DESKTOP_USER_DATA_DIR` temporário
> **Renderer:** Vite `http://127.0.0.1:5174`
> **CDP:** `127.0.0.1:9223`
> **Data:** 2026-08-20

## Cenários executados

| Cenário | Resultado | Evidência |
|---|---|---|
| Renderer inicia em inglês | PASS | DOM reportou `lang="en"`, `dir="ltr"`. |
| Settings → Appearance | PASS | Painel Appearance renderizado no Electron isolado. |
| Seletor exibe Português (Brasil) | PASS | `role=option` continha `Português (Brasil)pt-br`. |
| Troca English → pt-BR sem reinício | PASS | Após clique: `lang="pt-br"`, `dir="ltr"`; texto mudou para “Nova sessão”, “Capacidades”, “Mensagens”, “Aparência”, “Idioma”. |
| Catálogo P0 visível | PASS | Shell, sidebar, Settings, Appearance, idioma e estados de gateway exibiram pt-BR. |
| Persistência após reinício isolado | CONCERNS | A instância fake iniciou em “needs setup” sem backend/config client funcional; após reiniciar voltou a inglês. A persistência do fluxo real está coberta pelo teste unitário do `I18nProvider`, mas a aceitação E2E exige backend Desktop configurado. |
| `dir` em pt-BR | PASS | `dir="ltr"`. |
| Retorno a outro locale | Não executado nesta sessão | Deve ser executado com backend/config client ativo; o teste de runtime/contexto cobre a troca. |

## Observações

- A falha de persistência manual não foi atribuída ao catálogo: a instância isolada não possuía backend Hermes configurado e mostrou “needs setup”.
- Nenhum prompt de senha, pagamento ou autenticação foi aceito.
- A instância normal do Hermes do usuário não foi encerrada nem modificada.

## Gate

```yaml
schema: 1
story: '1.5'
gate: CONCERNS
status_reason: 'A troca visual para pt-BR e os atributos lang/dir passaram no Electron isolado; a persistência E2E ficou limitada pela ausência de backend/configuração na instância fake, enquanto o fluxo unitário de persistência passa.'
reviewer: 'Quinn / Orion'
reviewed_revision: 'branch:feat/desktop-pt-br'
top_issues:
  - id: 'E2E-1.5-001'
    severity: medium
    finding: 'Instância fake isolada iniciou sem backend/configuração e não permitiu confirmar persistência após reinício.'
    suggested_action: 'Repetir com gateway local configurado ou validação manual de instalação Windows real.'
waiver:
  active: false
```
