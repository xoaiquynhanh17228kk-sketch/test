# Results — Nature 风格稿

> `nature-writing` · task=manuscript · paper_type=research · section=experiments · language=zh-to-en · journal=nature
> 数据来源：已定版统计量（联合模型 AUC 0.850/0.794，BAM 并入 BAPF 后的重新拟合）。本文件不含编辑批注，批注与待办见 `Results_revised.md`。

---

## Terminology Ledger

| Canonical term | First-use definition | 源稿中出现过的变体 | Decision |
|---|---|---|---|
| massive haemoptysis | 24 h volume > 500 ml or single episode > 100 ml | massive hemoptysis, 大咯血 | 英式拼写 haemoptysis，全文统一 |
| BAA | bronchial artery abnormality (BAPF and/or BAM) | BAPF (Include BAM)、BAPF | **BAA**（用户选定）。图轴、表头、正文一致 |
| BAPF | bronchial artery–pulmonary fistula | BAPF | 仅在定义 BAA 时出现一次 |
| BAM | bronchial artery malformation | BAM | 同上 |
| Rad-score | LASSO-weighted linear combination of six radiomic features | Rad_Score, Rad Score | 连字符形式 **Rad-score** |
| combined model | Rad-score + tuberculosis + BAA + fibrinogen | ModA、Model A、nomogram | 正文用描述性名称；ModA/B/C 仅在图注定义 |
| clinical model | tuberculosis + BAA + fibrinogen | ModB、Model B | 同上 |
| training cohort / validation cohort | n = 131 / n = 57 | training set, test set, 训练集, 验证集 | **cohort**，全文统一 |
| AUC | area under the receiver operating characteristic curve | AUC, C (ROC), C-index | 首次展开后用 AUC |
| NRI / IDI | continuous net reclassification improvement / integrated discrimination improvement | NRI, IDI | 首次展开 |

**冲突已解决**：`ModA` 在旧图中指 Rad-score、新图中指联合模型。正文一律不用字母，只用描述性名称。

---

## Draft

### Cohort composition

Between 1 January 2021 and 30 June 2025, 188 consecutive patients admitted with haemoptysis met the eligibility criteria (Fig. 1). Forty-two patients (22.3%) presented with massive haemoptysis and 146 (77.7%) with mild-to-moderate haemoptysis. We split the cohort at random in a 7:3 ratio into a training cohort (*n* = 131) and an internal validation cohort (*n* = 57), in which cases accounted for 30 (22.9%) and 12 (21.1%) of patients respectively (*P* = 0.929).

Baseline characteristics were comparable between cohorts for age, sex, smoking status and duration, comorbid cancer, tuberculosis, bronchiectasis and fungal infection, antiplatelet and antithrombotic use, platelet count, D-dimer, international normalised ratio and fibrinogen (all *P* ≥ 0.10; Table 1). The single exception was bronchial artery abnormality (BAA), a composite of bronchial artery–pulmonary fistula and bronchial artery malformation, which represent variants of the same abnormal bronchial arterial vasculature. Present in 38 of 188 patients (20.2%) overall, BAA was almost twice as prevalent in the validation cohort (17 of 57, 29.8%) as in the training cohort (21 of 131, 16.0%; *P* = 0.049). The partition was generated at random, so this difference reflects the split obtained rather than differential ascertainment, but it bears on the between-cohort comparisons reported below.

### A six-feature radiomic signature tracks massive haemoptysis

Two thoracic radiologists delineated three-dimensional regions of interest on each baseline contrast-enhanced chest CT volume. After resampling to 0.5 × 0.5 × 0.5 mm, Laplacian-of-Gaussian and wavelet filtering and intensity normalisation, we extracted shape, first-order and texture descriptors. All feature reduction and coefficient estimation were confined to the training cohort, so that no validation data informed the signature.

Features with an inter-reader intraclass correlation coefficient at or below 0.75 were discarded and the remainder pruned by maximum-relevance minimum-redundancy selection, leaving approximately 35 features for least absolute shrinkage and selection operator (LASSO) logistic regression. Ten-fold cross-validation minimised binomial deviance at log(λ) = −3.3748 (Fig. 2a,b); the one-standard-error solution retained only two features and was not used. Six features survived: RunVariance.11 (β = 0.306), Idn.6 (β = 0.271), Imc1.9 (β = 0.198), MCC.7 (β = 0.055), SmallAreaEmphasis.8 (β = −0.173) and ZoneVariance.2 (β = 0.002, a negligible contribution) (Fig. 2c). Run-length, co-occurrence and size-zone texture descriptors dominate the signature; no shape or first-order intensity feature was retained.

The resulting Rad-score, computed for every patient from the training-derived coefficients, was higher in massive than in non-massive haemoptysis in the training cohort (median −1.043, interquartile range (IQR) −1.189 to −0.706 versus −1.361, IQR −1.640 to −1.062; Mann–Whitney *U*, *P* = 1.49 × 10⁻⁵; Fig. 3a and Table 4). The difference ran in the same direction in the validation cohort (−1.029, IQR −1.275 to −0.596 versus −1.189, IQR −1.523 to −0.954) but did not reach significance (*P* = 0.122; Fig. 3b), a comparison resting on 12 cases.

### Four variables carry independent associations

Five variables were associated with massive haemoptysis on univariable logistic regression (Table 2 and Fig. 4a): tuberculosis (odds ratio (OR) 4.23, 95% confidence interval (CI) 1.43–12.51, *P* = 0.009), bronchiectasis (OR 2.36, 95% CI 1.03–5.41, *P* = 0.042), BAA (OR 5.27, 95% CI 1.96–14.16, *P* = 0.001), fibrinogen (OR 0.57, 95% CI 0.39–0.83, *P* = 0.004) and the Rad-score (OR 7.96, 95% CI 2.75–23.11, *P* < 0.001). Age, sex, smoking, malignancy, fungal infection, antiplatelet and antithrombotic use, platelet count, D-dimer and international normalised ratio showed no association (all *P* > 0.20).

Four variables retained independent associations after mutual adjustment (Table 2 and Fig. 4b): tuberculosis (OR 5.18, 95% CI 1.42–18.93, *P* = 0.013), BAA (OR 4.32, 95% CI 1.33–14.10, *P* = 0.015), fibrinogen (OR 0.65, 95% CI 0.45–0.95, *P* = 0.025) and the Rad-score (OR 4.73, 95% CI 1.53–14.63, *P* = 0.007). Higher fibrinogen carried lower odds of massive presentation. Bronchiectasis did not survive adjustment. With 30 events and four predictors the model runs at 7.5 events per variable, below the conventional minimum of ten, and the confidence intervals are correspondingly wide.

### A clinical–radiomic nomogram discriminates massive haemoptysis

We combined the four independent variables into a nomogram (Fig. 5). The Rad-score carries the greatest weight, followed by fibrinogen, which is plotted on a descending scale so that lower values contribute more points; tuberculosis and BAA each contribute a smaller fixed amount when present.

At a cut-point of 0.255, set by the maximum Youden index in the training cohort and applied unchanged to validation, the nomogram achieved an AUC of 0.850 (95% CI 0.775–0.925), sensitivity 0.767 (23 of 30), specificity 0.842 (85 of 101) and accuracy 0.824 (108 of 131) in training (Table 3 and Fig. 6a). Validation values were an AUC of 0.794 (95% CI 0.631–0.958), sensitivity 0.750 (9 of 12), specificity 0.667 (30 of 45) and accuracy 0.684 (39 of 57) (Fig. 6b). Specificity fell by 0.175 between cohorts while sensitivity was marginally higher. An unpaired DeLong test did not separate the two AUCs (*D* = 0.604, d.f. = 80.7, *P* = 0.547), but the training estimate is apparent and the validation cohort holds 12 events, so that comparison is weakly powered in both directions.

### The radiomic component adds to clinical variables in the training cohort

We compared three models within each cohort (Table 5 and Fig. 7c,d). In training, the combined model reached an AUC of 0.850 (95% CI 0.775–0.925), against 0.796 (95% CI 0.693–0.898) for the clinical model of tuberculosis, BAA and fibrinogen, and 0.761 (95% CI 0.672–0.850) for the Rad-score alone. Validation values were 0.794 (95% CI 0.631–0.958), 0.744 (95% CI 0.555–0.934) and 0.647 (95% CI 0.456–0.839).

Paired DeLong tests separated the combined model from the Rad-score alone in training (ΔAUC 0.089, *Z* = 2.058, *P* = 0.040) but not from the clinical model (ΔAUC 0.054, *Z* = 1.841, *P* = 0.066), and the Rad-score and clinical models did not differ from one another (*Z* = −0.514, *P* = 0.608). Three comparisons were made per cohort, and *P* = 0.040 does not clear a Bonferroni-corrected threshold of 0.0167. No comparison reached significance in validation (*P* = 0.170, 0.333 and 0.506).

Reclassification metrics favoured the combined model more strongly than the change in AUC did. Against the clinical model, adding the Rad-score gave a continuous net reclassification improvement (NRI) of 0.428 (95% CI 0.029–0.827, *P* = 0.036) and an integrated discrimination improvement (IDI) of 0.062 (95% CI 0.013–0.111, *P* = 0.013) in training. Neither reached significance in validation (NRI 0.544, 95% CI −0.076 to 1.165, *P* = 0.085; IDI 0.064, 95% CI −0.044 to 0.171, *P* = 0.245) (Table 6). Continuous NRI rejects the null more readily than its nominal level implies, and the lower bound of the training estimate sits close to zero.

Among individual predictors, the nomogram curve lay outside every single variable across most of the operating range in training (Fig. 7a). In validation the fibrinogen curve fell below the diagonal over much of its range (Fig. 7b).

### Calibration degrades in the validation cohort

Calibration was close in training, with a Brier score of 0.126, Somers' *D*xy 0.700, *R*² 0.376, a maximum absolute error of 0.101, E90 0.058 and an average error of 0.024 (Fig. 8a). The calibration intercept of 0.000 and slope of 1.000 are apparent values obtained on the fitting data and were not corrected for optimism.

Calibration deteriorated in validation (Fig. 8b). The Brier score was 0.141, *D*xy 0.589 and *R*² 0.178, and the logistic calibration curve lay below the diagonal across its entire range, with an intercept of −0.781 and a slope of 0.741. The nomogram therefore overestimated the probability of massive haemoptysis systematically, and increasingly so at higher estimates: the calibration curve corresponds to observed proportions of 0.253, 0.382 and 0.561 at estimated probabilities of 0.4, 0.6 and 0.8, an absolute overestimation of 0.15 to 0.24 across that range, with a maximum absolute error of 0.237 (E90 0.206, average error 0.111). Hosmer–Lemeshow tests were non-significant in both cohorts (training χ² = 7.572, d.f. = 8, *P* = 0.476; validation χ² = 9.213, d.f. = 8, *P* = 0.325); with 12 validation events, however, the test has little power and does not detect the departure that the intercept and slope quantify.

Decision-curve analysis showed net benefit over treat-all and treat-none strategies from threshold probabilities of approximately 0.05 to 0.72 in training and approximately 0.05 to 0.60 in validation (Fig. 9). Beyond those points net benefit approached and then fell below zero, and few patients received estimates in that range, so the upper portion of each curve is unstable. Across the band from 0.10 to 0.40, the range most relevant to triage at presentation, net benefit was clearly positive in both cohorts.

---

## Section outline

- **Cohort composition** — 188 patients, 7:3 split, one baseline imbalance (BAA, *P* = 0.049) surfaced immediately rather than buried.
- **Radiomic signature** — leakage boundary stated first, then LASSO selection, then the six features, then the group separation that justifies carrying the Rad-score forward.
- **Independent associations** — the BAPF/BAM merge declared before any regression number appears, then univariable, then adjusted.
- **Nomogram discrimination** — construction, weights, then both cohorts at one fixed cut-point.
- **Incremental value** — the paper's central question, answered with three metrics that do not fully agree.
- **Calibration and net benefit** — the honest counterweight: discrimination holds, calibration does not.

## Assumptions or missing inputs

1. **Percentages reduced to one decimal** (22.3% rather than 22.34%). With *n* = 188 one patient shifts a proportion by 0.53%, so two decimals is false precision. Tables may retain their current precision; confirm if you want prose and tables identical.
2. **Nomogram point allocations read from the figure**, not from `nomogram()` output. Confirm 0–100 / ~55 / ~23 / ~21 and total 0–180.
3. **Approximately 35 features entering LASSO** is read from the Fig. 2b upper axis. The exact cascade (extracted → post-ICC → post-mRMR) is still outstanding.
4. **Observed proportions at estimated 0.6 and 0.8** (≈0.42 and ≈0.55) are read from the validation calibration curve. Replace with exact values if available.
5. **Merge timing undeclared.** The Methods must state whether combining BAPF and BAM preceded or followed inspection of outcome data, since the merge moved the combined-model AUC from 0.840 to 0.850.
6. Artwork items unchanged from the audit file: the two decision-curve panels are transposed, the nomogram axis still reads BAPF, the validation ROC still carries the 0.447 annotation, and the training boxplot x-axis carries a stray zero.

## Claim–evidence map

| Claim | Evidence | Status |
|---|---|---|
| A six-feature radiomic signature separates the two presentations | Fig. 2c; Fig. 3a, *P* = 1.49 × 10⁻⁵ | supported (training); validation *P* = 0.122, indeterminate |
| Four variables are independently associated | Table 2 adjusted ORs, all *P* < 0.05 | supported, but 7.5 events per variable |
| The nomogram discriminates well | AUC 0.850 / 0.794, Table 3 | supported in training; validation CI 0.631–0.958 is wide |
| The radiomic component adds to clinical variables | ΔAUC 0.054 *P* = 0.066; NRI *P* = 0.036; IDI *P* = 0.013 | **partially supported** — reclassification yes, ΔAUC no, validation neither |
| The nomogram is well calibrated | Training apparent intercept 0.000 / slope 1.000; validation −0.781 / 0.741 | **not supported in validation** — systematic overestimation |
| The nomogram yields net clinical benefit | Fig. 9, positive across 0.10–0.40 | supported within the stated band only |

## Why this structure

- **Claim-bearing subheadings.** Nature Results headings state the finding, not the topic. "Calibration degrades in the validation cohort" tells a scanning reader the result; "Calibration and clinical utility" does not.
- **The imbalance is declared in paragraph two, not the Discussion.** BAA at *P* = 0.049 is the mechanism most likely to explain the validation specificity drop and the calibration shift. Hiding it until Limitations invites the reviewer to find it first.
- **The incremental-value section reports three metrics that disagree.** ΔAUC says no, NRI and IDI say yes, validation says nothing. Reporting only the significant ones would be the single most likely source of a post-review integrity problem.
- **Calibration is given its own claim-bearing heading rather than being folded into a utility paragraph.** The validation intercept of −0.781 is the paper's main weakness; a heading that names it is more defensible than one that softens it.

## 中文说明（主要结构选择）

1. **小标题改为结论式**。Nature 的 Results 小标题写的是"发现了什么"，不是"这一节讲什么"。例如把「Calibration and clinical utility」改成「Calibration degrades in the validation cohort」。

2. **BAA 基线失衡提前到第二段**。原稿把它当作普通基线项，但它很可能就是验证集特异度下降（0.842→0.667）和校准偏移的成因。放在前面，读者读到后面的性能差异时已有解释；留到 Limitations 会显得是被审稿人问出来的。

3. **增量价值一节如实呈现三个指标的分歧**。ΔAUC 说不显著（*P* = 0.066），NRI/IDI 说显著（0.036 / 0.013），验证集全部不显著。只挑显著的写是这类论文最常见的完整性问题，也是最容易在审稿或发表后被追究的一处。

4. **模型不用 A/B/C 字母**。新旧图中 ModA/ModC 含义相反，正文用描述性名称可完全绕开，字母只在图注定义。

5. **Nature 排版细节**：正文中图用缩写 `Fig. 7c,d`，表写全 `Table 5`；*P*、*n*、*Z*、*D*xy、*R*² 斜体；`d.f.` 表示自由度；百分比一位小数；全文无破折号（Nature 正文不用 em dash）。

6. **观察与解释分离**。Results 只写观察到什么，机制性解释（为什么验证集校准更差、为什么合并后判别力升而校准降）全部留给 Discussion。
