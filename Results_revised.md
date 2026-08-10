# Results — 修订版（基于九张结果图的数据再分析）

> 模式：`academic-paper` → `revision`
> 输入：`Results.docx`（原文 + Figure 1–9）
> 本文件包含四部分：**A. 图像数据再分析记录** → **B. 修订路线图** → **C. 修订后 Results 正文（英文）** → **D. 尚未闭合的数据缺口**

---

## A. 图像数据再分析记录（Figure-by-figure read-out）

只记录图中**实际可读出**的数值，不做外推。

| 图 | 图中实际承载的信息 | 原文是否使用 |
|---|---|---|
| Fig 1 流程图 | 188 例 → 分组标准（massive: 24 h >500 mL 或单次 >100 mL）；7:3 随机拆分 → 训练 131 / 测试 57；**特征选择全部在训练集内完成**；重采样 0.5×0.5×0.5 mm；LoG + Wavelet 滤波；ICC>0.75（可重复性子集 n=20）→ mRMR → LASSO（10 折 CV） | 部分。「所有筛选步骤仅在训练集执行」这一关键设计未写入正文 |
| Fig 2a/2b LASSO | log(λ.min) = **−3.3748**，log(λ.1se) = **−2.2584**；2b 上轴显示进入 LASSO 的特征数约 **35**；λ.min 处保留 **6** 个特征（λ.1se 处仅 2 个）→ 说明**采用的是 λ.min** | 未使用。原文只说「最优 λ 由十折交叉验证选出」，无数值 |
| Fig 2c 系数 | RunVariance.11 = **0.306**；Idn.6 = **0.271**；Imc1.9 = **0.198**；MCC.7 = **0.055**；ZoneVariance.2 = **0.002**；SmallAreaEmphasis.8 = **−0.173** | 完全未使用 |
| Fig 3a 单因素 | 精确 p：TB 0.009；Bronchiectasis 0.042；BAPF 0.005；BAM 0.045；fib 0.004；Rad_Score <0.001 | 原文降级为 `<0.01` / `<0.05` 阈值式表述 |
| Fig 3b 多因素 | 精确 p：TB 0.014；BAPF 0.034；fib 0.026；Rad_Score 0.004 | 同上 |
| Fig 4 列线图 | 分值分配：Rad_Score 跨度 −4→0.5 对应 **0→100 分**（权重最大）；fib 9→0 对应 **0→约 50 分**（反向）；TB=1 约 **21 分**；BAPF=1 约 **19 分**；总分 0–160；概率刻度 0.1–0.9 | 未使用。原文未说明各预测因子的相对权重 |
| Fig 5 ROC | 训练 AUC 0.840 (0.764–0.915)；验证 AUC 0.781 (0.614–0.949) | 已使用 |
| Fig 6（原编号 9）多模型 ROC | ModA 0.761 (0.672–0.850)；ModB 0.769 (0.663–0.876)；ModC 0.840 (0.764–0.915)。**三条 CI 大幅重叠，图中无 DeLong 检验** | 已使用，但结论强度超出证据 |
| Fig 7（原编号 8）单变量 ROC | 图中**仅有图例（BAPF / fib / Nomo / Rad_Score / TB），无任何 AUC 数值**；Nomo 曲线整体位于最外侧，Rad_Score 次之 | 图注承诺「AUC for each individual variable」，图中并未给出 → 图注与图不符 |
| Fig 8（原编号 6）校准曲线 | **训练**：Dxy 0.679、C 0.840、R² 0.364、Brier **0.129**、Intercept **0.000**、Slope **1.000**、Emax 0.091、E90 0.058、Eavg 0.025 → 截距恰为 0、斜率恰为 1，说明这是**表观（apparent）校准，未做 bootstrap 乐观度校正**。**验证**：Dxy 0.563、C 0.781、R² 0.228、Brier **0.138**、Intercept **−0.688**、Slope **0.804**、Emax **0.251**、E90 **0.222**、Eavg **0.088**；logistic 校准曲线**明显位于对角线下方**，即**系统性高估**风险，0.4 以上尤为明显 | ❌ **原文与图直接冲突**：原文称「估计值与观测值曲线在全概率范围内贴合对角线」 |
| Fig 9（原编号 7）DCA | **两个子图（a 训练 / b 验证）**。训练：净获益优于 All/None 约在阈值 **0–0.72**，0.73–0.78 略低于 0。验证：优势区间约 **0–0.60**，0.60–0.77 在 0 附近震荡甚至略负。All 线过零点分别约 0.23 / 0.21（与患病率一致） | 原文按单图描述，且未给出阈值区间上界 |

---

## B. 修订路线图（Revision Roadmap）

严重度：**H** = 影响结论可信度/投稿即被质疑；**M** = 报告规范；**L** = 表述精度。

| # | 问题 | 严重度 | 处理 | 声明强度变动（claim-strength ladder） |
|---|---|---|---|---|
| R1 | 校准段落与 Fig 8b 冲突：验证集截距 −0.688、斜率 0.804、Emax 0.251，曲线明显低于对角线，原文却称「全范围贴合对角线」 | **H** | 改写为「训练集表观校准良好；验证集存在系统性高估，尤其在预测概率 >0.4 区间」 | **降级**（"well calibrated in both cohorts" → "acceptable in training, systematic overestimation in validation"）。授权依据：图中数值直接证伪原表述 |
| R2 | 训练集 Intercept=0.000/Slope=1.000 为表观值，被当作校准性能证据 | **H** | 明确标注 apparent、未做 bootstrap 乐观度校正 | **降级**，加入方法学限定 |
| R3 | HL 检验不显著被当作「校准良好」的证据（验证集 n=57，检验效能极低） | **H** | 改为「HL 检验未发现显著偏离，但在该样本量下阴性结果不足以支持校准良好」，并补报 Brier / 斜率 / 截距 / Eavg / Emax | **降级** |
| R4 | Model A/B/C 比较：0.761 vs 0.769 vs 0.840，CI 大幅重叠，无 DeLong/NRI/IDI，却直接断言 C「最高」 | **H** | 改为「数值上最高」，明确说明 CI 重叠且未做正式比较检验 | **降级**（"highest AUC" → "numerically highest; CIs overlap substantially and no formal test was performed"） |
| R5 | 图号引用顺序错乱（Fig 9 先于 Fig 8 出现），多数期刊为技术性退稿点 | **H** | 按首次引用顺序重编号：旧 9→**新 6**；旧 8→**新 7**；旧 6→**新 8**；旧 7→**新 9**。Fig 1–5 不变 | 无 |
| R6 | 「retrospectively enrolled and **randomly allocated**」易被误读为随机分组临床试验 | **H** | 改为 "randomly split in a 7:3 ratio"，并点明为回顾性设计中的数据划分 | 无（术语更正） |
| R7 | Fig 2 全部定量信息未写入正文（λ、进入 LASSO 的特征数、6 个特征名与系数） | **M** | 补入 log(λ.min)=−3.3748、约 35 个特征进入 LASSO、6 个保留特征及其系数；并如实指出 ZoneVariance.2 系数 0.002 实际贡献可忽略 | 无（新增事实） |
| R8 | 「特征筛选仅在训练集完成」这一关键防泄漏设计只在流程图里，正文未写 | **M** | 写入正文（这是审稿人必查项） | 无 |
| R9 | 精确 p 值可得却用阈值式 `<0.05` / `<0.01` | **M** | 全部替换为 Fig 3 中的精确 p 值 | 无 |
| R10 | 敏感度/特异度无分子分母，且未说明判定阈值来源 | **M** | 补 22/30、85/101、8/12、33/45 等计数；阈值来源标为待作者确认（见 D 部分） | 无 |
| R11 | 列线图各预测因子相对权重未报告 | **M** | 补入 Rad-score 0–100 分、fib 0–50 分、TB≈21 分、BAPF≈19 分 | 无（新增事实） |
| R12 | DCA 为双子图但按单图描述，且阈值区间无上界 | **M** | 分训练/验证报告，给出约 0–0.70 与 0–0.60 的区间及高阈值端失效 | **降级**（去掉无界的 "across the clinically plausible range"） |
| R13 | 验证集 AUC 95% CI 0.614–0.949 极宽，原文以「performance was maintained」一笔带过 | **M** | 保留结论但加精度限定 | **降级** |
| R14 | Table 1 训练/验证 p 值被当作「组间均衡」的证据（随机划分下该检验无推断意义） | **L** | 保留表格，正文改为描述性表述 | **降级** |
| R15 | Fig 1 图注含占位符 `BAPF, 1, 2;`；缩写定义不全 | **L** | 补全为 bronchial artery–pulmonary fistula 等 | 无 |
| R16 | Fig 7（旧 8）图注承诺给出各变量 AUC，图中无数值 | **L** | 改写图注以匹配实际图形；或建议作者在图中加注 AUC（见 D 部分） | 无 |
| R17 | 文末残留两条与本研究无关的参考文献（类风湿关节炎铁死亡、α7 nAChR 与慢性间歇低氧） | **L** | 标记为需删除 | 无 |

**声明强度总结**：本轮共 8 处**降级**（削弱）、0 处**升级**。所有降级均由图中数值直接授权，无静默移动。

---

## C. 修订后 Results 正文

> 图号已按首次引用顺序重编，并纳入新增的 Rad-score 分布图。**主文仍为 9 图**（把与多模型 ROC 高度重复的单变量 ROC 移入补充材料）。
>
> | 新 | 内容 | 原编号 |
> |---|---|---|
> | Fig 1 | 流程图 | 1 |
> | Fig 2 | LASSO 特征筛选 | 2 |
> | **Fig 3** | **Rad-score 组间分布（新增，(a) 训练 (b) 验证）** | — |
> | Fig 4 | 森林图 | 3 |
> | Fig 5 | 列线图 | 4 |
> | Fig 6 | 列线图 ROC | 5 |
> | **Fig 7** | **四联图：(a)(b) 单变量 ROC，(c)(d) 模型比较，均含双队列（新，取代旧 8 + 旧 9）** | 8 + 9 |
> | Fig 8 | 校准曲线 | 6 |
> | Fig 9 | DCA | 7 |
>
> 主文 9 图，全部含训练 + 验证双队列，不再需要 Supplementary Figure。表格 6 张（Table 1–3 不变，新增 Rad-score 分布、模型 AUC+DeLong 合并表、NRI/IDI）。**请同步更新 Discussion 及正文其他位置的图号与表号交叉引用**，尤其是任何引用过 Model A/B/C 字母的地方（含义已颠倒）。

---

## Results

### Patient characteristics

Between 1 January 2021 and 30 June 2025, 188 consecutive patients admitted with haemoptysis met the eligibility criteria and were retrospectively enrolled. The cohort was then split at random in a 7:3 ratio into a training set (n=131) and an internal validation set (n=57). Figure 1 summarises screening, grouping, and the imaging and modelling workflow. Forty-two patients (22.34%) presented with massive haemoptysis and formed the case group; the remaining 146 (77.66%) had mild-to-moderate haemoptysis and formed the control group. Cases accounted for 30 of 131 patients (22.90%) in the training set and 12 of 57 (21.05%) in the validation set (p=0.929).

The realised partition was similar across all recorded baseline variables: age (overall median 61 years, IQR 54 to 70; p=0.222), sex (130/188 male, 69.15%; p=0.709), smoking status (113/188 ever-smokers, 60.11%; p=0.688), duration of smoking, comorbid cancer, tuberculosis, bronchiectasis and fungal infection, bronchial artery–pulmonary fistula (BAPF), bronchial artery malformation (BAM), antiplatelet and antithrombotic medication, platelet count (PLT), D-dimer (D-D), international normalised ratio (INR) and fibrinogen (Fib), with no comparison reaching p<0.10 (Table 1). Because the two sets were generated by random splitting rather than by any allocation rule, these p-values describe the partition actually obtained and are not tests of a substantive hypothesis.

### Radiomic feature selection and construction of the Rad-score

Two thoracic radiologists independently delineated three-dimensional regions of interest on each baseline contrast-enhanced chest CT volume in 3D Slicer v5.3.0. Images were resampled to 0.5 × 0.5 × 0.5 mm, filtered (Laplacian of Gaussian and wavelet) and normalised before extraction of shape, first-order and texture descriptors (GLCM, GLRLM, GLSZM, NGTDM and GLDM). **Every selection step was performed within the training set alone**, so that no information from the validation set entered feature reduction or coefficient estimation.

Features with an inter-reader intraclass correlation coefficient (ICC) at or below 0.75 were discarded, and the survivors were further pruned by the maximum-relevance minimum-redundancy (mRMR) algorithm. Approximately 35 features entered the least absolute shrinkage and selection operator (LASSO) step (Figure 2b, upper axis). Ten-fold cross-validation minimised the binomial deviance at log(λ)=−3.3748, and this value was adopted for the final signature; the more parsimonious one-standard-error solution (log(λ)=−2.2584) retained only two features and was not used (Figure 2a and 2b).

Six features survived at the selected λ (Figure 2c). Four carried positive weights: RunVariance.11 (β=0.306), Idn.6 (β=0.271), Imc1.9 (β=0.198) and MCC.7 (β=0.055). One carried a negative weight, SmallAreaEmphasis.8 (β=−0.173). The remaining term, ZoneVariance.2, was retained with a coefficient of 0.002 and therefore contributes negligibly to the score. The signature is dominated by run-length, co-occurrence and size-zone texture descriptors rather than by shape or first-order intensity, indicating that intralesional heterogeneity rather than lesion size drives the radiomic signal. The Rad-score, defined as the linear combination of these six features weighted by their LASSO coefficients, was computed for every patient in both sets using the training-derived coefficients and was carried forward as a single composite predictor.

The Rad-score was higher in patients presenting with massive haemoptysis than in those with mild-to-moderate haemoptysis in the training cohort (median −1.043, IQR −1.189 to −0.706, n=30 versus median −1.361, IQR −1.640 to −1.062, n=101; Mann–Whitney U, p=1.49 × 10⁻⁵). The difference ran in the same direction in the internal validation cohort (median −1.029, IQR −1.275 to −0.596, n=12 versus median −1.189, IQR −1.523 to −0.954, n=45) but did not reach statistical significance (p=0.122). With 12 cases available for that comparison, this is an indeterminate rather than a negative result (Figure 3, Table 4).

### Variables associated with massive haemoptysis

Six variables were associated with massive haemoptysis in univariable logistic regression (Table 2, Figure 4a): tuberculosis (OR 4.23, 95% CI 1.43 to 12.51; p=0.009), bronchiectasis (OR 2.36, 95% CI 1.03 to 5.41; p=0.042), BAPF (OR 4.88, 95% CI 1.60 to 14.90; p=0.005), BAM (OR 3.84, 95% CI 1.03 to 14.31; p=0.045), fibrinogen (OR 0.57, 95% CI 0.39 to 0.83; p=0.004) and the Rad-score (OR 7.96, 95% CI 2.75 to 23.11; p<0.001). Age, sex, smoking status, duration of smoking, malignancy, fungal infection, antiplatelet and antithrombotic use, PLT, D-D and INR showed no association (all p>0.20). The confidence intervals for tuberculosis, BAPF, BAM and the Rad-score are wide and their lower bounds lie close to unity, which is consistent with the small number of events available (42 in total, 30 in the training set).

Before multivariable modelling, BAPF and BAM were combined into a single bronchial artery abnormality variable. Both lesions are abnormalities of the bronchial arterial circulation; their univariable odds ratios were closely similar (4.88 and 3.84) with widely overlapping confidence intervals; and each was individually uncommon (27 and 18 patients respectively), so that combining them increases the number of events supporting the term and narrows its interval.

The multivariable model therefore comprised tuberculosis, the combined bronchial artery abnormality, fibrinogen and the Rad-score (Table 2, Figure 4b). Bronchiectasis, although associated on univariable testing, did not retain an independent association and was not carried into the final model. Higher fibrinogen was associated with a lower probability of massive presentation. With 30 events and four retained predictors, the model operates at roughly 7.5 events per variable, below the conventional threshold of ten, so the adjusted point estimates should be read as provisional.

> ⛔ **本段的调整后 OR 待补。** 原稿 Table 2 多因素列的四个 OR（tuberculosis 4.96、BAPF 4.09、fibrinogen 0.65、Rad-score 5.21）出自**合并前**的模型（BAPF 单独入模、BAM 在多因素中被剔除），不描述已采用的模型，故已从正文移除而非沿用。请提供合并后模型的四个调整 OR、95% CI 与 p 值，并同步重绘 Figure 4b。
>
> **命名建议**：合并后的变量若仍标注为「BAPF」会与原始 BAPF 混淆（列线图旧版轴标即为 BAPF）。建议改用 **bronchial artery abnormality (BAA)**，定义为 BAPF 和/或 BAM，并在 Table 1 增加该合并变量一行（含合并后的 n 与百分比；注意两者若有重叠，n 不等于 27+18）。
>
> **Methods 必须交代**：合并的依据，以及该决定是在查看结局数据**之前**还是**之后**作出的。这一点会被审稿人追问——合并使联合模型 AUC 从 0.840 升至 0.850，若属事后调整则须如实披露并在 Limitations 说明其对乐观度的影响。上文列出的三条依据（同属支气管动脉异常、单因素 OR 相近、各自事件数偏少）是可用的正当理由，但不能替代对时序的说明。

### Nomogram development and discrimination

A clinical–radiomic nomogram was constructed from the four independent variables, converting each into a partial point score and mapping the total to an individualised probability of massive haemoptysis at presentation (Figure 5). The Rad-score carries the largest weight. Fibrinogen is plotted on a descending scale, so that lower values attract more points, and tuberculosis and the bronchial artery abnormality each contribute a smaller fixed number of points when present.

> ⛔ **列线图待重绘，分值分配待补。** 现有 Figure 5 出自合并前的模型，其轴标为「BAPF」而非合并变量，因此分值分配（Rad-score 0–100、fibrinogen 0–50、TB≈21、BAPF≈19、总分 0–160）不适用于已采用的模型。上文已改为只描述权重次序这一预期稳健的定性特征；请提供重绘后的列线图，我再把具体分值填回。

A single classification cut-point of 0.255 in estimated probability was derived from the maximum Youden index of the training-set ROC curve. This cut-point was then applied unchanged to the internal validation set; no cut-point was re-optimised in the validation data.

Discrimination was good in the training cohort, with an area under the receiver operating characteristic curve (AUC) of 0.850 (95% CI 0.775 to 0.925), sensitivity 0.767 (23/30) and specificity 0.842 (85/101) at the 0.255 cut-point, giving an accuracy of 0.824 (108/131). In the internal validation cohort the point estimate remained similar but was far less precise: AUC 0.794 (95% CI 0.631 to 0.958) (Table 3, Figure 6). The validation interval spans 0.327 AUC units and its lower bound lies close to the 0.5 no-discrimination line, so the validation result is compatible with performance ranging from marginal to excellent and should not be read as confirmation of the training estimate.

An unpaired DeLong test comparing the two cohorts did not detect a difference between the training and validation AUCs (D=0.604, df=80.7, p=0.547). Two features of this comparison limit what it establishes. The training AUC is an apparent estimate obtained on the data used to fit the model and is therefore optimistically biased, whereas the validation AUC is not, so the two quantities are not exchangeable. The validation set also contains only 12 events, which leaves the test with little power to detect a drop in discrimination. The result therefore indicates that the available data do not detect deterioration between cohorts, not that discrimination has been shown to be stable. This comparison is also distinct from the between-model comparisons reported in the next section, and the two cannot substitute for one another.

### Incremental value of the radiomic and clinical components

Three models were compared within each cohort: the Rad-score alone, the clinical model combining tuberculosis, BAPF and fibrinogen, and the combined clinical–radiomic nomogram (Figure 7c and 7d, Table 5). In the training cohort the combined model reached an AUC of 0.850 (95% CI 0.775 to 0.925), against 0.796 (95% CI 0.693 to 0.898) for the clinical model and 0.761 (95% CI 0.672 to 0.850) for the Rad-score alone. The corresponding validation figures were 0.794 (95% CI 0.631 to 0.958), 0.744 (95% CI 0.555 to 0.934) and 0.647 (95% CI 0.456 to 0.839).

Paired DeLong tests gave a mixed picture. In the training cohort the combined model outperformed the Rad-score alone (ΔAUC 0.089; Z=2.058, p=0.040), but its advantage over the clinical model did not reach significance (ΔAUC 0.054; Z=1.841, p=0.066), and the Rad-score and clinical models did not differ from one another (Z=−0.514, p=0.608). Three pairwise comparisons were made in each cohort, so the nominal p of 0.040 does not survive a Bonferroni-corrected threshold of 0.0167. None of the three comparisons reached significance in the internal validation cohort (p=0.170, 0.333 and 0.506 respectively).

Reclassification metrics were more favourable to the combined model than the change in AUC was. Adding the Rad-score to the clinical model yielded a continuous net reclassification improvement of 0.428 (95% CI 0.029 to 0.827; p=0.036) and an integrated discrimination improvement of 0.062 (95% CI 0.013 to 0.111; p=0.013) in the training cohort (Table 6). Neither reached significance in validation (NRI 0.544, 95% CI −0.076 to 1.165, p=0.085; IDI 0.064, 95% CI −0.044 to 0.171, p=0.245). Continuous NRI is known to reject the null more often than its nominal level implies, and the lower bound of the training estimate lies only just above zero, so it carries less weight than the IDI result.

Taken together, the incremental value of the radiomic component over clinical variables alone is supported by the reclassification metrics in the training cohort, is not supported by the change in AUC in that cohort, and is not confirmed by either metric in the internal validation cohort, where 12 events leave every comparison underpowered. Single-variable ROC curves are shown in Figure 7a and 7b. The combined nomogram lies outside every individual predictor across most of the operating range in the training cohort, whereas in validation the fibrinogen curve falls below the diagonal over much of its range, indicating that this variable alone carries little discriminative information in that sample.

### Calibration and clinical utility

> ⛔ **整段数字待重算。** 现有校准图是**旧模型**生成的，证据是图内打印的 Somers' Dxy：训练集 0.679 = 2×0.840−1，验证集 0.563 = 2×0.781−1，对应的正是已被弃用的 0.840/0.781。采用 0.850/0.794 后，Dxy 应分别变为约 0.700 与 0.588，而 Brier、截距、斜率、Emax、E90、Eavg、R²、以及 Hosmer–Lemeshow 的 χ² 全部会跟着变。下文保留旧值以维持句式，**投稿前必须用新拟合重新生成校准图并逐一替换**。定性结论（验证集系统性高估）预计仍成立，但幅度不可照搬。

In the training set the nomogram showed close agreement between estimated and observed probabilities, with a Brier score of 0.129, Dxy 0.679 and R² 0.364 (Figure 8a). The calibration intercept of 0.000 and slope of 1.000 are apparent values obtained on the data used to fit the model; no bootstrap optimism correction was applied, so they quantify fit rather than transportability.

Calibration was weaker in the internal validation set (Figure 8b). The Brier score was 0.138, Dxy 0.563 and R² 0.228, and the logistic calibration curve lay below the diagonal across most of its range, with a calibration intercept of −0.688 and a slope of 0.804. This pattern indicates systematic overestimation of the probability of massive haemoptysis, becoming pronounced above an estimated probability of approximately 0.4, where the maximum absolute error reached 0.251 (E90 0.222, average error 0.088). The Hosmer–Lemeshow test detected no significant departure from the fitted model in either set (training χ²=9.11, df=8, p=0.333; validation χ²=10.76, df=8, p=0.216), but with 57 patients and 12 events in the validation set this test has little power, and a non-significant result cannot be taken as evidence of adequate calibration. Recalibration of the intercept would be required before the estimated probabilities could be used as absolute risks outside the development sample.

> ⚠️ **DCA 亦为旧模型生成**，阈值区间需按新拟合重跑后核对。定性结论（临床可用区间内净获益为正）预计稳健。

Decision-curve analysis indicated net benefit over the treat-all and treat-none strategies over a clinically usable range of threshold probabilities (Figure 9). In the training set the nomogram was the preferred strategy from approximately 0.05 to 0.70, with net benefit falling to zero or marginally below beyond 0.72. In the internal validation set the advantage held from approximately 0.05 to 0.60, after which net benefit oscillated around zero; few patients received estimated probabilities in that upper range, so the high-threshold portion of the validation curve is unstable. Across the threshold band most relevant to triage at presentation, roughly 0.10 to 0.40, the nomogram retained a positive net benefit in both sets.

---

### 修订后的图注（Figure legends）

**Figure 1.** Flowchart of patient screening, grouping, and the imaging and modelling workflow. All feature-selection steps were performed within the training cohort only. BAPF, bronchial artery–pulmonary fistula; BAM, bronchial artery malformation; ICC, intraclass correlation coefficient; mRMR, maximum relevance minimum redundancy; LASSO, least absolute shrinkage and selection operator; GLCM, grey-level co-occurrence matrix; GLRLM, grey-level run-length matrix; GLSZM, grey-level size-zone matrix; NGTDM, neighbouring grey-tone difference matrix; GLDM, grey-level dependence matrix; ROI, region of interest; ROC, receiver operating characteristic; DCA, decision-curve analysis.

**Figure 2.** Radiomic feature selection by LASSO logistic regression in the training cohort. (a) LASSO coefficient profiles against log(λ). (b) Ten-fold cross-validation curve of binomial deviance; the green dashed line marks log(λ.min)=−3.3748, which was adopted, and the blue dashed line marks log(λ.1se)=−2.2584. (c) The six retained features and their coefficients.

**Figure 3.** *(new)* Distribution of the Rad-score by presentation group in (a) the training cohort and (b) the internal validation cohort. Boxes show the median and interquartile range, whiskers extend to 1.5 times the interquartile range, and individual patients are overlaid. Groups were compared by the Mann–Whitney U test. ✅ 面板顺序已修正（(a) n=131，(b) n=57），星号已改为 p 值。⚠️ **仍需处理：**(1) 训练集面板的 p 目前显示 `<0.01`，而 Table 4 写的是 `＜0.05`，我此前依据初版图的 `****` 写成 `<0.0001` —— 三处不一致，**请提供精确 p 并统一**；(2) 训练集面板 x 轴标签 `No massive hemoptysis0` 有多余的 `0`。

**Figure 4.** *(previously Figure 3)* Forest plots of (a) univariable and (b) multivariable logistic regression for massive haemoptysis in the training cohort. Squares denote odds-ratio point estimates and horizontal lines the 95% confidence intervals. Arrowheads in (a) indicate intervals extending beyond the plotted axis. ⛔ **面板 (b) 需重绘**：现图出自 BAPF/BAM 合并前的模型。面板 (a) 可保留。

**Figure 5.** *(previously Figure 4)* Nomogram for the individualised probability of massive haemoptysis at presentation, built from tuberculosis, the combined bronchial artery abnormality, fibrinogen and the Rad-score. Fibrinogen is plotted on a descending scale, so lower values attract more points. ⛔ **需重绘**：现图轴标为 BAPF（合并前变量），分值分配亦出自旧拟合。

**Figure 6.** *(previously Figure 5)* ROC curves of the clinical–radiomic nomogram in (a) the training cohort and (b) the internal validation cohort. The classification cut-point of 0.255 was derived from the maximum Youden index in the training cohort and applied unchanged to the validation cohort. ⚠️ **制图注意：验证集面板上标注的 0.447 必须删除** —— 那是验证集自身优化的切点，留在图上会被读作切点在验证集重新寻优。

**Figure 7.** *(new four-panel figure, replacing previous Figures 8 and 9)* ROC analysis of individual predictors and of the three candidate models. (a) Individual candidate predictors in the training cohort and (b) in the internal validation cohort; TB and BAPF are binary, so their curves consist of two linear segments, and Nomo denotes the combined nomogram. (c) Model comparison in the training cohort and (d) in the internal validation cohort. ModA, combined clinical–radiomic model; ModB, clinical model (tuberculosis, BAPF and fibrinogen); ModC, Rad-score alone. ⚠️ **注意：ModA/ModB/ModC 的含义与原稿旧图完全颠倒**（旧图 ModA=Rad-score、ModC=联合）。正文已改用描述性名称以避免混淆；若 Discussion 中引用过旧的字母编号，必须一并更正。图 (a)(b) 面板不显示各变量的 AUC 数值，图注亦不应承诺给出。

**Figure 8.** *(previously Figure 6)* Calibration of the nomogram in (a) the training cohort and (b) the internal validation cohort. The grey line is the ideal diagonal, the solid black line the logistic calibration curve and the dotted line the non-parametric estimate. Training values are apparent and uncorrected for optimism. Hosmer–Lemeshow: training χ²=9.11, df=8, p=0.333; validation χ²=10.76, df=8, p=0.216.

**Figure 9.** *(previously Figure 7)* Decision-curve analysis in (a) the training cohort and (b) the internal validation cohort, showing net benefit of the nomogram against the treat-all and treat-none reference strategies.

**Table 3 footnote (建议新增).** Accuracy, sensitivity and specificity were derived at an estimated-probability cut-point of 0.255, obtained from the maximum Youden index of the training-cohort ROC curve and applied unchanged to the internal validation cohort.

**Table 4.** Distribution of the Rad-score by presentation group in the training and internal validation cohorts. 建议：删除冗余的 IQR 列（IQR = Q3 − Q1，四组均已核对相符：0.578 / 0.483 / 0.570 / 0.679），只保留 Median (Q1, Q3)；`Mann–Whitney U` 由数据列改为表注，适用于全部四行。

**Table 5.** *(合并原 Table 5 与 Table 6)* Discrimination of the combined, clinical and Rad-score models, and pairwise comparison by DeLong's test, in the training and internal validation cohorts. 建议列：Cohort / Comparison / AUC (Model 1) / AUC (Model 2) / Z / P。原 Table 5 的三列 AUC 已完整包含在原 Table 6 之中，无须单列。表注定义：combined model = Rad-score + TB + BAPF + fibrinogen；clinical model = TB + BAPF + fibrinogen。

**Table 6.** *(原 Table 7)* Continuous NRI and IDI of the combined model compared with the clinical model, in the training and internal validation cohorts.

---

## D-1. 补充材料回执（2026-08-02 收到的三项答复）

作者针对 D 部分第 1、2、5 项提供了补充材料。**三项都收到了，但都不能直接照单写入正文**，原因如下。

### ⛔ 阻断项 P1（H）：AUC 数值与正文冲突，必须先定版

| 来源（按内容指称，不用图号） | 训练集 AUC | 验证集 AUC |
|---|---|---|
| Table 3 + 列线图 ROC 图 | **0.840** (0.764–0.915) | **0.781** (0.614–0.949) |
| 校准曲线图内的 C(ROC) | 0.840 | 0.781 |
| 多模型比较图的 ModC | 0.840 (0.764–0.915) | — |
| **补充材料 ROC 图 + DeLong 输出** | **0.850** (0.775–0.925) | **0.794** (0.631–0.958) |

差值 0.010 / 0.013，**不是四舍五入能解释的**。原稿三处独立图形互相印证 0.840 / 0.781；补充材料是唯一给出 0.850 / 0.794 的来源。

连带的第二处不一致：补充材料训练集 ROC 图上标注切点 0.255 对应 **(spec 0.842, sens 0.767)**，而 Table 3 训练集写的是 **sens 0.733**, spec 0.842。特异度对得上，敏感度差 1 例（23/30 vs 22/30）。这与 AUC 差异同源，指向**模型被重新拟合过**。

**处理方式（当前稿采用）**：正文暂时保留原稿的 0.840 / 0.781，因为它有三处图形互证。**请作者确认哪一次分析为最终版**，然后让下列五处同时改成同一套数字：Table 3、列线图 ROC 图（新 Fig 6）、多模型比较图的 ModC（新 Fig 7）、校准曲线图内的 C(ROC)（新 Fig 8）、以及 DeLong 输出。目前状态下投出去，审稿人对照图与表就会发现同一模型有两套 AUC。

### ⛔ 阻断项 P2（H）：Rad-score 箱线图的训练集/验证集标签互换

- 文档中**第一张**（标注"训练集"）：病例组 **12 个散点**，对照组约 45 个，合计 ≈57，标记 **ns** → 这是**验证集**。
- 文档中**第二张**（标注"验证集"）：病例组约 **30 个散点**，对照组约 100 个，合计 ≈131，标记 **\*\*\*\*** → 这是**训练集**。

答复正文的叙述（训练集显著、验证集不显著）**是对的**，错的是两张图的摆放顺序/题注。请在制图时对调，否则图与文直接矛盾。

### ⚠️ P3（H）：DeLong 检验回答的不是原来提出的问题

补充材料做的是：**同一个模型**在训练集 vs 验证集之间的**非配对** DeLong（D=0.604, df=80.7, p=0.547）。

原先 D 部分第 5 项要的是：**同一队列内** Model A（Rad-score 单独）vs Model B（临床）vs Model C（联合）的**配对** DeLong。这两者license 的结论完全不同：

- 补充材料的检验 → 只能说「没有检测到训练集到验证集的判别力下降」。
- 原先需要的检验 → 才能支撑「联合模型优于其单一成分」这一句。

因此 **"Incremental value" 一节的降级表述必须保留**，不能因为收到了一个 DeLong 就改口。

补充说明两点局限（已写入正文）：(a) 训练集 AUC 是表观值、带乐观偏倚，拿它和无偏的验证集 AUC 做检验，不显著更多反映的是**检验效能不足**而非稳定性得证；(b) 验证集仅 12 个事件。

### ✅ 可直接采用的部分

1. **切点**：训练集 ROC 最大约登指数 → **0.255**，固定应用于验证集。这正是审稿人想看到的做法，已写入正文。
2. **Rad-score 分布方向与显著性**：训练集病例组显著更高（\*\*\*\*，即 p<0.0001）；验证集同方向但未达显著。已写入正文。
3. **验证集图上的 0.447 必须从投稿图中删除**。作者已说明那只是"内部探索性结果"，但只要它印在图上，审稿人就会认为切点在验证集重新优化过——这恰恰是放射组学论文最常见的过拟合质疑。

### 仍缺的数字（正文中已留占位）

- Rad-score 各组的**中位数与 IQR**（四个数值：训练集两组、验证集两组）。从箱线图目测约为：训练集 −1.35 vs −1.04，验证集 −1.19 vs −1.03，但目测值不可写入正文。
- 验证集组间比较的**精确 p 值**（图上只有 "ns"）。
- 训练集用的**检验方法**（Mann–Whitney U 还是 t 检验）。

---

## D-1b. 第二批补充材料回执（问题 1–4 的答复）

### ✅ 已修好

- **箱线图标签互换已修正**。现在 (a) 训练集 n≈131、标 `<0.01`，(b) 验证集 n≈57、标 `0.122`，顺序与题注一致；星号也已换成 p 值。
- **Table 4 数值与箱线图逐一吻合**（四组箱体中位数与 Q1/Q3 我逐个核对过），n 值 101/30/45/12 与队列构成一致。IQR 列与 Q3−Q1 亦全部相符。
- **问题 4 提供的正是此前所缺的队列内配对 DeLong**（Table 6）加 NRI/IDI（Table 7）。六个 DeLong 的 Z 与 p 互相自洽，NRI/IDI 的点估计、CI 宽度与 p 也自洽 —— 这两张表算术上没有问题。
- **新四联图补齐了验证集面板**。原稿的单变量 ROC 与模型比较都只有训练集，现在两者都有双队列，这是实质性改进。

### ⛔ 新发现 P4（H）：Model A/B/C 的字母含义新旧完全颠倒

| | ModA | ModB | ModC |
|---|---|---|---|
| 原稿多模型 ROC 图 | Rad-score (0.761) | 临床 (0.769) | 联合 (0.840) |
| **新图 + 新 Table 5** | **联合 (0.850)** | 临床 (0.796) | **Rad-score (0.761)** |

A 与 C 对调了。新图与新表内部一致，但与原稿图完全相反。

**处理方式**：正文一律改用描述性名称（the combined nomogram / the clinical model / the Rad-score alone），字母只在 Fig 7 图注与 Table 5 中定义。这样无论最终采用哪套字母都不会出错。**但 Discussion 里若引用过 Model A/B/C，必须逐处核对。**

### 🔑 P1 的根因已查明：模型重新拟合，**BAM 并入 BAPF**（作者 2026-08-10 确认）

这一条把之前所有对不上的地方一次性解释清楚了：

| 现象 | 是否被「合并 BAM+BAPF」解释 |
|---|---|
| 临床模型 0.769 → 0.796 | ✅ 模型成分变了 |
| 联合模型 0.840 → 0.850 | ✅ 同上 |
| **Rad-score 单独模型 0.761 纹丝不动** | ✅ 该模型不含临床变量，本就不该受影响 |
| 训练集切点 0.255 处敏感度 22/30 → 23/30 | ✅ 预测概率变了，一例跨过切点 |

我此前猜的「列线图总分 vs 线性预测值」是错的，真正原因是变量重编码。

**合并本身有正当依据**（建议写进 Methods）：
- BAPF 与 BAM 同属支气管动脉循环异常，临床上可归为一类；
- 两者单因素 OR 相近（4.88 vs 3.84），CI 大幅重叠；
- 各自事件数偏少（27 例、18 例），CI 都很宽（1.60–14.90、1.03–14.31），合并后该项估计更稳定。

⚠️ **但必须交代时序**：合并使联合模型 AUC 由 0.840 升至 0.850。若该决定是在查看结局数据之后作出的，属事后调整，须如实披露并在 Limitations 说明其对乐观度估计的影响。上述三条理由是充分的正当性依据，但替代不了对「何时决定」的说明。

**命名**：合并后仍叫「BAPF」会与原始 BAPF 混淆。建议改为 **bronchial artery abnormality (BAA)**，定义为 BAPF 和/或 BAM。

#### 合并所波及的范围

**确定失效、必须重做：**

| 对象 | 原因 |
|---|---|
| Table 2 多因素列（四个 OR 全部） | 出自合并前模型 |
| Figure 4b 多因素森林图 | 同上 |
| **Figure 5 列线图**（轴标 + 全部分值） | 轴标仍是 BAPF，分值出自旧拟合 |
| Table 3 验证集三项指标 | 旧拟合 |
| Figure 8 校准曲线（全部统计量） | 已由 Dxy 判据证明为旧拟合 |
| Figure 9 DCA | 旧拟合 |
| Table 1 | 需增加合并变量一行（注意 BAPF 与 BAM 若有重叠，合并后 n ≠ 27+18） |

**不受影响、可保留：**
Table 2 单因素列与 Figure 4a（单因素结果本身仍有效）、Figure 2 与 Rad-score 构建、Table 4 与 Figure 3、Table 5/6 DeLong、Table 7 NRI/IDI、Figure 7 四联图（后四项本就出自新拟合）。

EPV 不变：合并后预测因子仍是 4 个，30 events ÷ 4 = 7.5。

### ✅ P1 数值已定版：采用 0.850 / 0.796 / 0.794

作者确认**训练集联合模型 0.850、临床模型 0.796**，即新一次拟合为最终版。正文的判别力一节与模型比较一节均已改用此套数字，两节现已内部一致。

**由此产生的连带影响（重要）：**

1. **校准图确认是旧模型生成的，整段数字失效。** 判据是图内打印的 Somers' Dxy 与 C 统计量的恒等关系 Dxy = 2C − 1：

   | | 图内 Dxy | 旧模型 2C−1 | 新模型 2C−1 |
   |---|---|---|---|
   | 训练 | 0.679 | 0.840 → **0.680** ✅ | 0.850 → 0.700 |
   | 验证 | 0.563 | 0.781 → **0.562** ✅ | 0.794 → 0.588 |

   两个队列都指向旧模型。因此 Brier（0.129 / 0.138）、截距（0.000 / −0.688）、斜率（1.000 / 0.804）、Emax（0.091 / 0.251）、E90、Eavg、R²、以及 HL 的 χ²（9.11 / 10.76）**全部需要用新拟合重新生成**。正文已在该节开头加了显著标记。

2. **Table 3 训练集三项指标已更新。** 新版 ROC 图在切点 0.255 处标注 (spec 0.842, sens 0.767)，反解得 23/30 与 85/101，故准确率 = 108/131 = 0.824。与旧值相比只有敏感度差 1 例（22→23）。**这三个数是我从图注反解的，请核对。**

3. **Table 3 验证集三项指标仍缺。** 新版验证集 ROC 只标注了 0.447 这个（须删除的）验证集自优化切点，没有标注 0.255 处的操作点。旧值 0.667 / 0.733 / 0.719 是旧模型算的，**不能与新 AUC 并列**。正文已暂时移除，请补：新模型在切点 0.255 下验证集的敏感度、特异度、准确率。

4. **DCA 亦为旧模型生成**，阈值区间需重跑核对。

5. ~~请确认列线图与 Table 2 的多因素 OR 是否出自同一次拟合~~ → ✅ **已答复：模型重新拟合过，BAM 并入 BAPF。** 因此列线图与 Table 2 多因素列**均出自旧拟合，均需重做**。详见上方「合并所波及的范围」。

### ~~⛔ P1：AUC 两套数字~~（以下为定版前的分析记录，保留备查）

新材料**全部**使用 0.850 / 0.794（ROC 图、DeLong 输出、Table 5、Table 6、四联图 c/d 面板），原稿 Table 3、列线图 ROC、校准图仍是 0.840 / 0.781。

一条重要线索：**Rad-score 单独模型的 AUC 新旧完全一致（0.761，CI 也一致）**，变的只有临床模型（0.769→0.796）和联合模型（0.840→0.850）。这说明 Rad-score 本身稳定，改变发生在临床变量进入模型的方式上。

一个待验证的假设：0.840 可能是**列线图总分**的 AUC（分值离散化后略降），0.850 是**模型线性预测值**的 AUC。若成立，两者可并存但必须分别标注。**但该假设解释不了临床模型 0.769→0.796**（临床模型没有列线图），所以仍需回原始脚本查证。

**若最终采用 0.850 / 0.794，需同步重做**：Table 3 的四项指标、校准图（图内 C(ROC) 及截距/斜率/Brier/Emax 全部会变）、DCA，并确认列线图分值与 Table 2 的多因素 OR 是否随之改变。

### ✅ 训练集 Rad-score 的 p 值已定：1.49 × 10⁻⁵

正文已改用精确值。回头看，初版图的 `****`（p<0.0001）是**对的**，二版图的 `<0.01` 和 Table 4 的 `＜0.05` 都严重低报了自己的结果。**请把 Fig 3a 与 Table 4 都改成 `p=1.49 × 10⁻⁵`**（或按目标期刊惯例写 `p<0.001`），三处统一。

### 制图遗留（两项未动）

- 验证集 ROC 上的 `0.447` 标注仍在，**必须删除**。
- 训练集箱线图 x 轴仍是 `No massive hemoptysis0`。

---

## D-2. 尚未闭合的数据缺口（无法从图中读出，需作者补充）

这些内容**没有**写进正文，因为图里没有对应数据，凭空写会构成编造。

1. ~~**判定阈值（cut-point）**~~ → ✅ **已解决**（0.255，训练集 Youden，固定应用于验证集）。附带要求：验证集 ROC 图上的 0.447 标注须删除。
2. ~~**Rad-score 的组间分布**~~ → ✅ **已解决**（Table 4 四组 median/IQR + n + Mann–Whitney U + 验证集 p=0.122；图标签互换已修正）。**唯一残留**：训练集精确 p（现有三种写法）。
3. **特征筛选各步的数量级联**：提取特征总数 → ICC>0.75 后剩余 → mRMR 后剩余（图 2b 上轴提示约 35）→ LASSO 后 6 个。正文目前只能写「约 35 个进入 LASSO」，建议改为精确数字。
4. **ICC 的实际取值**：流程图写了「n=20 做观察者内/间一致性检验」，但未报告 ICC 范围或中位数。
5. ~~**DeLong 检验**~~ → ✅ **已解决**。队列内配对 DeLong（Table 6）+ NRI/IDI（Table 7）均已提供，"Incremental value" 一节已据此重写。结论并非一边倒：训练集中联合模型显著优于 Rad-score 单独（p=0.040，但未通过 Bonferroni），**对临床模型的优势未达显著（p=0.066）**，而重分类指标显著（NRI p=0.036，IDI p=0.013）；验证集全部不显著。正文已如实并列报告两类指标的分歧。
6. **验证集校准的处理方案**：Fig 8b 显示系统性高估（截距 −0.688）。请确认是否要（a）如实报告并在 Discussion 讨论，或（b）补做截距再校准并报告校准后指标。目前正文按 (a) 处理。
7. ~~**单变量 ROC 图的 AUC 数值**~~ → ✅ **已按图注表述解决**。新四联图的 (a)(b) 面板同样不显示各变量 AUC，修订后的图注不再作此承诺，图文一致。
7b. **AUC 版本核对（最高优先，见 D-1b 的 P1）** → 🔴 **未解决**。这是目前唯一阻断定稿的问题。
8. **文末两条无关参考文献**（Ao Q et al. 铁死亡与类风湿关节炎；Shen H et al. α7 nAChR 与慢性间歇低氧）与本研究无关，应删除。
9. **样本量/EPV**：30 events ÷ 4 predictors = 7.5 EPV，低于常规下限 10。正文已如实说明，建议 Discussion 的 Limitations 呼应，或补做 bootstrap 内部验证（500–1000 次）报告乐观度校正后的 AUC 与校准斜率。
