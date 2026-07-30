# test

Academic Research Skills (ARS) installed as Claude Code project skills.

## What's here

[`Imbad0202/academic-research-skills`](https://github.com/Imbad0202/academic-research-skills)
v3.19.0 — a research → write → review → revise → finalize pipeline for Claude Code.

| Path | Contents |
|------|----------|
| `.claude/skills/deep-research/` | 13-agent research team — literature review, PRISMA systematic review, meta-analysis, fact-check |
| `.claude/skills/academic-paper/` | 12-agent paper writing — style calibration, LaTeX/DOCX/PDF output, revision coach, citation formats |
| `.claude/skills/academic-paper-reviewer/` | 5-reviewer peer review simulation (EIC + 3 reviewers + Devil's Advocate) |
| `.claude/skills/academic-pipeline/` | 10-stage orchestrator chaining the three above |
| `.claude/skills/shared/` | Shared protocols, contracts, and JSON schemas |
| `.claude/skills/scripts/` | Deterministic checkers the skills invoke (citation verification, claim audit, token conservation) |
| `.claude/commands/` | 16 `/ars-*` slash commands |
| `.claude/agents/` | 3 subagents (`synthesis_agent`, `research_architect_agent`, `report_compiler_agent`) |
| `.claude/CLAUDE.md` | Skill overview, changelog, and path-resolution notes |

## Usage

Run Claude Code from this repository. The skills load automatically; the slash
commands are available directly:

```text
/ars-plan            Socratic chapter-by-chapter paper planning
/ars-lit-review      literature review on a topic
/ars-3w              three-way (WHY/HOW/WHAT) literature scan
/ars-full            full academic-paper pipeline
/ars-reviewer        simulate peer review of a manuscript
/ars-citation-check  verify citations
```

`.claude/skills/MODE_REGISTRY.md` lists all 27 modes.

## Optional dependencies

Markdown output needs nothing extra. Pandoc is required for DOCX, and
tectonic + Source Han Serif TC for APA 7.0 PDF.

## Installation method

Vendored per upstream `docs/SETUP.md` **Method 1 (project skills)**. Hooks are
not installed and test files are omitted — see `.claude/CLAUDE.md` for details.

To update, re-copy from a fresh clone of the upstream repository.

## License

ARS is © 2026 Cheng-I Wu, licensed
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) (non-commercial).
Full text in `.claude/skills/LICENSE`; attribution and third-party notices in
`.claude/skills/NOTICE.md` and `.claude/skills/THIRD_PARTY.md`.

---

# Scientific Agent Skills (curated subset)

32 skills selected from
[`K-Dense-AI/scientific-agent-skills`](https://github.com/K-Dense-AI/scientific-agent-skills)
(158 total, MIT), under `.claude/skills/scientific/`.

Upstream advises against installing the whole collection, and its own weekly
scan (`docs/security-report.md`, cisco-ai-skill-scanner 2.0.12) flags 13 skills
CRITICAL or HIGH. Every skill here is rated safe by that scan — SAFE, LOW, or
MEDIUM, none CRITICAL or HIGH. Descriptions total ~3.6k tokens against ~16k for
all 158.

| Area | Skills |
|------|--------|
| Imaging & neuro | `pathml` `pydicom` `neurokit2` `neuropixels-analysis` `omero-integration` `imaging-data-commons` `scientific-visualization` |
| Molecular & cell bio | `scanpy` `anndata` `pydeseq2` `bulk-rnaseq` `pathway-enrichment` `biopython` `database-lookup` `gget` |
| Stats & plotting | `statistical-analysis` `statistical-power` `statsmodels` `scikit-learn` `matplotlib` `seaborn` `exploratory-data-analysis` `uncertainty-and-units` |
| Writing & literature | `scientific-writing` `peer-review` `paper-lookup` `paperclip` `pyzotero` `scholar-evaluation` `venue-templates` `research-grants` `exa-search` |

Excluded as CRITICAL/HIGH upstream: `citation-management` `literature-review`
`research-lookup` `scientific-slides` `scientific-schematics` `infographics`
`latex-posters` `autoskill` `pacsomatic` `xlsx` `geomaster` `histolab` `modal`.

Most skills need Python packages that are not vendored here; each `SKILL.md`
lists its own requirements. Upstream uses `uv` as the package manager.

Licensed MIT, © 2025 K-Dense Inc. — see `.claude/skills/scientific/LICENSE.md`.
