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

---

# nature-skills

All 19 skills from [`Yuan1z0825/nature-skills`](https://github.com/Yuan1z0825/nature-skills)
(Apache 2.0), under `.claude/skills/nature/` — Nature-style manuscript writing
and publication-quality figures.

No MCP servers and no API keys required, unlike ARIS. Descriptions total ~2.9k
tokens.

| Group | Skills |
|-------|--------|
| Writing | `nature-writing` `nature-polishing` `nature-response` `nature-reviewer` `nature-proposal-writer` |
| Figures & data | `nature-figure` `nature-data` `nature-statistics` |
| Literature | `nature-academic-search` `nature-reader` `nature-citation` `nature-ref-verifier` `nature-downloader` `nature-literature-pipeline` |
| Output | `nature-paper2ppt` `nature-paper-card` `nature-paper-to-patent` |
| Support | `nature-shared` `nature-experiment-log` |

`nature-shared` is referenced as `../nature-shared` by three skills, so keep it
alongside the others.

`nature-figure/assets/` carries 34 MB of rendered PNG previews next to the
`plot_*.py` scripts that produce them. Both are kept here; the upload zips drop
the previews.

Python packages are not vendored — matplotlib, seaborn, pdfplumber, python-docx,
python-pptx, pymupdf, playwright, and pybliometrics appear across the scripts.
`nature-academic-search` bundles its own MCP server for Scopus (needs
pybliometrics credentials); the skill's other sources work without it.

Licensed Apache 2.0 — see `.claude/skills/nature/LICENSE`.

---

# claude-scholar (curated subset)

8 skills selected from [`Galaxy-Dawn/claude-scholar`](https://github.com/Galaxy-Dawn/claude-scholar)
(45 total, MIT), under `.claude/skills/scholar/`.

`research-ideation` `writing-anti-ai` `citation-verification` `results-analysis`
`results-report` `paper-self-review` `post-acceptance`
`latex-conference-template-organizer` — ~730 tokens of descriptions against
~3.4k for all 45.

Most of the upstream collection is aimed elsewhere: 15 software-engineering
skills (debugging, frontend, git, UI review, Kaggle), 7 on authoring Claude Code
skills and plugins, and 6 built on an Obsidian vault with Zotero.

Four upstream skills are named `nature-writing`, `nature-polishing`,
`nature-response`, and `nature-data`, colliding with the nature-skills already
installed here. Upstream's are v0.2.0 and roughly half the size, so they are
excluded to avoid overwriting the fuller versions. `doc-coauthoring` is excluded
as well — it ships with Claude by default.

Two of the eight do overlap with nature-skills and are kept for the different
angle each takes: `results-analysis` against `nature-statistics`,
`paper-self-review` against `nature-reviewer`.

A ninth, `publication-chart-skill`, was installed and later removed — see the
figure-skill note at the end of this file.

No eval, exec, pickle.loads, shell=True, or piped-shell installs in these eight.
Outbound hosts are Crossref, Semantic Scholar, DOI, and arXiv.

Upstream hooks (`security-guard.js`, `session-start.js`, and others) are not
installed — they resolve through plugin paths that only exist for plugin
installs.

Licensed MIT — see `.claude/skills/scholar/LICENSE`.

---

# scipilot-figure-skill

[`Haojae/scipilot-figure-skill`](https://github.com/Haojae/scipilot-figure-skill)
(MIT), a single skill under `.claude/skills/scipilot-figure-skill/` — ~197 tokens.

Positions itself as a visualization advisor rather than a plotting tool: it
profiles the data first (column types, sample size, distribution, outliers,
grouping, correlation), asks what argument the figure should make, and picks the
chart from data shape and intent. It refuses common scientific plotting errors —
mean bars over small samples that hide the distribution, dual Y axes, pie charts,
truncated Y axes, rainbow colormaps, categorical points joined by lines.

Bilingual. Chinese mode configures Noto Sans CJK / Source Han Sans / SimHei and
fixes the minus-sign tofu box, and supports the Chinese-journal convention of
SimSun body text with Times New Roman numerals.

Stack is matplotlib + seaborn + SciencePlots for static output and plotly for
interactive; `requirements.txt` also lists Pillow, numpy, pandas, and scipy, with
SciencePlots, pypdf, kaleido, and PyMuPDF optional (upstream says it degrades
gracefully without them).

The scan found nothing — no eval, exec, pickle.loads, shell=True, subprocess, or
piped-shell installs. The only URL in the scripts is a github.com doc link.

Licensed MIT — see `.claude/skills/scipilot-figure-skill/LICENSE`.

## Figure skills: two, not three

Installing this one briefly made three figure skills, competing for the same
"draw me a chart" requests. `publication-chart-skill` was removed as the one
overlapping the other two most; `scipilot-figure-skill` and `nature-figure`
remain, split by what they are good at — scipilot decides *what* to plot and
handles Chinese-journal typography, nature-figure handles Nature-family
templates, multi-panel layout, and export.

One thing did not survive the cut: `publication-chart-skill` carried
`pubtab-recipes.md`, 133 lines on publication-grade *tables*. Neither remaining
skill covers table formatting to that depth. If you need it back, it is in git
history, or upstream at `Galaxy-Dawn/claude-scholar`.

The handoff pointers in `results-report` and `results-analysis`, which named
`publication-chart-skill`, now name the two remaining figure skills.
