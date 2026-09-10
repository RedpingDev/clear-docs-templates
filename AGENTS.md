# Repository guidance

- This repository contains reusable documentation templates, examples, guides, and optional Node.js tooling.
- Read `docs/style-guide.md` before changing templates or reader-facing Docs. Read `examples/source-notes.md` before changing the fictional backup-tool examples.
- Apply the Docs layout rules to `docs/`, `templates/`, and `examples/` Markdown. Do not impose that layout on README, AGENTS, changelogs, contribution instructions, or GitHub issue/PR templates.
- Keep both READMEs structured around Best-README-Template: `README.md` in English and `README.ko.md` in Korean, with language links at the top. Keep their content aligned when making changes; templates, guides, and examples remain Korean.
- Keep generated PNG diagrams next to matching Mermaid sources. Update the source, PNG, alt text, caption, and related prose together.
- Run `npm run check` for documentation edits. For tooling or diagram/layout changes, also run `npm run check:scope`, `npm run diagrams`, and `npm run preview` as relevant. Report actual checks and unverified environments.
- After initial publication, use a `codex/` branch and a pull request to `main`. Record changes affecting templates or usage in `CHANGELOG.md`.
- Do not commit user-level Codex instructions, personal paths, private project details, dependencies, caches, or `.qa` artifacts. Public Codex setup instructions must use a replaceable local path.
- Keep CI read-only. Do not introduce automatic commits or automatic merging.
