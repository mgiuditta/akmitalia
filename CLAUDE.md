# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Agent skills

### Issue tracker

Issues live as GitHub issues in `mgiuditta/akmitalia`, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Antislop

Il frontend pubblico sta sotto le skill `antislop:antislop` e `antislop:antislop-ui`. Prima di
scrivere UI, leggi l'ultimo report in `docs/antislop/`: le 39 voci del primo audit hanno tutte un
esito scritto, e diverse sono diventate regole in `DESIGN.md` o emendamenti a un ADR.

Due regole di metodo, che vengono da quell'audit:

- **Nessuna gerarchia fissa fra antislop e `DESIGN.md` / `docs/adr/`.** Una voce che si scontra con
  una scelta scritta lì non si corregge d'ufficio: diventa una decisione a sé, e quando è presa
  emenda il documento con cui si scontrava oppure dichiara perché quel documento resta com'è.
- **Un'affermazione sui fatti non è un problema di UI.** «Quattro anni di percorso», «anche in
  Canton Ticino»: se non c'è una fonte in `data/`, `docs/` o `PRODUCT.md`, il sito smette di
  affermarla e la domanda va al cliente, scritta nel report.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
