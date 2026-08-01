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

> 图号已按首次引用顺序重编。**新旧对照：新 Fig 6 = 旧 Fig 9；新 Fig 7 = 旧 Fig 8；新 Fig 8 = 旧 Fig 6；新 Fig 9 = 旧 Fig 7。** 请同步更新 Discussion 及正文其他位置的图号交叉引用。

---

## Results

### Patient characteristics

Between 1 January 2021 and 30 June 2025, 188 consecutive patients admitted with haemoptysis met the eligibility criteria and were retrospectively enrolled. The cohort was then split at random in a 7:3 ratio into a training set (n=131) and an internal validation set (n=57). Figure 1 summarises screening, grouping, and the imaging and modelling workflow. Forty-two patients (22.34%) presented with massive haemoptysis and formed the case group; the remaining 146 (77.66%) had mild-to-moderate haemoptysis and formed the control group. Cases accounted for 30 of 131 patients (22.90%) in the training set and 12 of 57 (21.05%) in the validation set (p=0.929).

The realised partition was similar across all recorded baseline variables: age (overall median 61 years, IQR 54 to 70; p=0.222), sex (130/188 male, 69.15%; p=0.709), smoking status (113/188 ever-smokers, 60.11%; p=0.688), duration of smoking, comorbid cancer, tuberculosis, bronchiectasis and fungal infection, bronchial artery–pulmonary fistula (BAPF), bronchial artery malformation (BAM), antiplatelet and antithrombotic medication, platelet count (PLT), D-dimer (D-D), international normalised ratio (INR) and fibrinogen (Fib), with no comparison reaching p<0.10 (Table 1). Because the two sets were generated by random splitting rather than by any allocation rule, these p-values describe the partition actually obtained and are not tests of a substantive hypothesis.

### Radiomic feature selection and construction of the Rad-score

Two thoracic radiologists independently delineated three-dimensional regions of interest on each baseline contrast-enhanced chest CT volume in 3D Slicer v5.3.0. Images were resampled to 0.5 × 0.5 × 0.5 mm, filtered (Laplacian of Gaussian and wavelet) and normalised before extraction of shape, first-order and texture descriptors (GLCM, GLRLM, GLSZM, NGTDM and GLDM). **Every selection step was performed within the training set alone**, so that no information from the validation set entered feature reduction or coefficient estimation.

Features with an inter-reader intraclass correlation coefficient (ICC) at or below 0.75 were discarded, and the survivors were further pruned by the maximum-relevance minimum-redundancy (mRMR) algorithm. Approximately 35 features entered the least absolute shrinkage and selection operator (LASSO) step (Figure 2b, upper axis). Ten-fold cross-validation minimised the binomial deviance at log(λ)=−3.3748, and this value was adopted for the final signature; the more parsimonious one-standard-error solution (log(λ)=−2.2584) retained only two features and was not used (Figure 2a and 2b).

Six features survived at the selected λ (Figure 2c). Four carried positive weights: RunVariance.11 (β=0.306), Idn.6 (β=0.271), Imc1.9 (β=0.198) and MCC.7 (β=0.055). One carried a negative weight, SmallAreaEmphasis.8 (β=−0.173). The remaining term, ZoneVariance.2, was retained with a coefficient of 0.002 and therefore contributes negligibly to the score. The signature is dominated by run-length, co-occurrence and size-zone texture descriptors rather than by shape or first-order intensity, indicating that intralesional heterogeneity rather than lesion size drives the radiomic signal. The Rad-score, defined as the linear combination of these six features weighted by their LASSO coefficients, was computed for every patient in both sets using the training-derived coefficients and was carried forward as a single composite predictor.

### Variables associated with massive haemoptysis

Six variables were associated with massive haemoptysis in univariable logistic regression (Table 2, Figure 3a): tuberculosis (OR 4.23, 95% CI 1.43 to 12.51; p=0.009), bronchiectasis (OR 2.36, 95% CI 1.03 to 5.41; p=0.042), BAPF (OR 4.88, 95% CI 1.60 to 14.90; p=0.005), BAM (OR 3.84, 95% CI 1.03 to 14.31; p=0.045), fibrinogen (OR 0.57, 95% CI 0.39 to 0.83; p=0.004) and the Rad-score (OR 7.96, 95% CI 2.75 to 23.11; p<0.001). Age, sex, smoking status, duration of smoking, malignancy, fungal infection, antiplatelet and antithrombotic use, PLT, D-D and INR showed no association (all p>0.20). The confidence intervals for tuberculosis, BAPF, BAM and the Rad-score are wide and their lower bounds lie close to unity, which is consistent with the small number of events available (42 in total, 30 in the training set).

Four variables remained independently associated with massive haemoptysis after mutual adjustment (Table 2, Figure 3b): tuberculosis (OR 4.96, 95% CI 1.39 to 17.70; p=0.014), BAPF (OR 4.09, 95% CI 1.11 to 15.04; p=0.034), fibrinogen (OR 0.65, 95% CI 0.45 to 0.95; p=0.026) and the Rad-score (OR 5.21, 95% CI 1.70 to 15.94; p=0.004). Bronchiectasis and BAM did not retain independent associations. Higher fibrinogen was associated with a lower probability of massive presentation. With 30 events and four retained predictors, the multivariable model operates at roughly 7.5 events per variable, below the conventional threshold of ten, so the adjusted point estimates should be read as provisional.

### Nomogram development and discrimination

A clinical–radiomic nomogram was constructed from the four independent variables, converting each into a partial point score and mapping the total to an individualised probability of massive haemoptysis at presentation (Figure 4). The Rad-score carries the largest weight, spanning the full 0 to 100 point range across its observed interval of −4 to 0.5. Fibrinogen contributes up to approximately 50 points on an inverted scale, so that lower values attract more points. Tuberculosis and BAPF contribute approximately 21 and 19 points respectively when present. Total scores range from 0 to 160, and the diagnostic probability scale becomes informative above a total of roughly 80 points.

Discrimination was good in the training set, with an area under the receiver operating characteristic curve (AUC) of 0.840 (95% CI 0.764 to 0.915), accuracy 0.817 (107/131), sensitivity 0.733 (22/30) and specificity 0.842 (85/101). In the internal validation set the point estimate remained similar but the estimate was far less precise: AUC 0.781 (95% CI 0.614 to 0.949), accuracy 0.719 (41/57), sensitivity 0.667 (8/12) and specificity 0.733 (33/45) (Table 3, Figure 5). The validation interval spans 0.335 AUC units and its lower bound approaches the 0.5 no-discrimination line, so the validation result is compatible with performance ranging from marginal to excellent and should not be read as confirmation of the training estimate.

### Incremental value of the radiomic and clinical components

Three models were compared in the training set (Figure 6). Model A, the Rad-score alone, achieved an AUC of 0.761 (95% CI 0.672 to 0.850). Model B, the clinical model combining tuberculosis, BAPF and fibrinogen, achieved 0.769 (95% CI 0.663 to 0.876). Model C, the combined clinical–radiomic nomogram, achieved the numerically highest value at 0.840 (95% CI 0.764 to 0.915). The three confidence intervals overlap substantially, and no formal comparison of correlated ROC curves (DeLong test) or reclassification analysis (NRI, IDI) was performed. The apparent gain from combining the clinical and radiomic components is therefore suggestive rather than established. Single-variable ROC analyses for each candidate predictor are shown for reference in Figure 7, where the combined nomogram curve lies outside every individual predictor curve across most of the operating range and the Rad-score is the strongest single contributor.

### Calibration and clinical utility

In the training set the nomogram showed close agreement between estimated and observed probabilities, with a Brier score of 0.129, Dxy 0.679 and R² 0.364 (Figure 8a). The calibration intercept of 0.000 and slope of 1.000 are apparent values obtained on the data used to fit the model; no bootstrap optimism correction was applied, so they quantify fit rather than transportability.

Calibration was weaker in the internal validation set (Figure 8b). The Brier score was 0.138, Dxy 0.563 and R² 0.228, and the logistic calibration curve lay below the diagonal across most of its range, with a calibration intercept of −0.688 and a slope of 0.804. This pattern indicates systematic overestimation of the probability of massive haemoptysis, becoming pronounced above an estimated probability of approximately 0.4, where the maximum absolute error reached 0.251 (E90 0.222, average error 0.088). The Hosmer–Lemeshow test detected no significant departure from the fitted model in either set (training χ²=9.11, df=8, p=0.333; validation χ²=10.76, df=8, p=0.216), but with 57 patients and 12 events in the validation set this test has little power, and a non-significant result cannot be taken as evidence of adequate calibration. Recalibration of the intercept would be required before the estimated probabilities could be used as absolute risks outside the development sample.

Decision-curve analysis indicated net benefit over the treat-all and treat-none strategies over a clinically usable range of threshold probabilities (Figure 9). In the training set the nomogram was the preferred strategy from approximately 0.05 to 0.70, with net benefit falling to zero or marginally below beyond 0.72. In the internal validation set the advantage held from approximately 0.05 to 0.60, after which net benefit oscillated around zero; few patients received estimated probabilities in that upper range, so the high-threshold portion of the validation curve is unstable. Across the threshold band most relevant to triage at presentation, roughly 0.10 to 0.40, the nomogram retained a positive net benefit in both sets.

---

### 修订后的图注（Figure legends）

**Figure 1.** Flowchart of patient screening, grouping, and the imaging and modelling workflow. All feature-selection steps were performed within the training cohort only. BAPF, bronchial artery–pulmonary fistula; BAM, bronchial artery malformation; ICC, intraclass correlation coefficient; mRMR, maximum relevance minimum redundancy; LASSO, least absolute shrinkage and selection operator; GLCM, grey-level co-occurrence matrix; GLRLM, grey-level run-length matrix; GLSZM, grey-level size-zone matrix; NGTDM, neighbouring grey-tone difference matrix; GLDM, grey-level dependence matrix; ROI, region of interest; ROC, receiver operating characteristic; DCA, decision-curve analysis.

**Figure 2.** Radiomic feature selection by LASSO logistic regression in the training cohort. (a) LASSO coefficient profiles against log(λ). (b) Ten-fold cross-validation curve of binomial deviance; the green dashed line marks log(λ.min)=−3.3748, which was adopted, and the blue dashed line marks log(λ.1se)=−2.2584. (c) The six retained features and their coefficients.

**Figure 3.** Forest plots of (a) univariable and (b) multivariable logistic regression for massive haemoptysis in the training cohort. Squares denote odds-ratio point estimates and horizontal lines the 95% confidence intervals. Arrowheads in (a) indicate intervals extending beyond the plotted axis.

**Figure 4.** Nomogram for the individualised probability of massive haemoptysis at presentation, built from tuberculosis, BAPF, fibrinogen and the Rad-score. Fibrinogen is plotted on a descending scale, so lower values attract more points.

**Figure 5.** ROC curves of the clinical–radiomic nomogram in (a) the training cohort and (b) the internal validation cohort.

**Figure 6.** *(previously Figure 9)* Comparison of ROC curves for three models in the training cohort. Model A, Rad-score alone; Model B, clinical model (tuberculosis, BAPF and fibrinogen); Model C, combined clinical–radiomic nomogram. Confidence intervals overlap and no formal test of curve difference was performed.

**Figure 7.** *(previously Figure 8)* ROC curves for each individual candidate predictor and for the combined nomogram (Nomo) in the training cohort. TB and BAPF are binary variables, so their curves consist of two linear segments.

**Figure 8.** *(previously Figure 6)* Calibration of the nomogram in (a) the training cohort and (b) the internal validation cohort. The grey line is the ideal diagonal, the solid black line the logistic calibration curve and the dotted line the non-parametric estimate. Training values are apparent and uncorrected for optimism. Hosmer–Lemeshow: training χ²=9.11, df=8, p=0.333; validation χ²=10.76, df=8, p=0.216.

**Figure 9.** *(previously Figure 7)* Decision-curve analysis in (a) the training cohort and (b) the internal validation cohort, showing net benefit of the nomogram against the treat-all and treat-none reference strategies.

**Table 3 footnote (建议新增).** Accuracy, sensitivity and specificity were derived at a single cut-point of estimated probability; the cut-point and its derivation (for example the Youden index in the training cohort) should be stated and the same value applied to the validation cohort.

---

## D. 尚未闭合的数据缺口（无法从图中读出，需作者补充）

这些内容**没有**写进正文，因为图里没有对应数据，凭空写会构成编造。

1. **判定阈值（cut-point）**：Table 3 的 accuracy/sensitivity/specificity 必须依赖某个概率切点。图中未给出。请说明切点数值与来源（通常为训练集 Youden 指数），并确认验证集沿用同一切点而非重新寻优。
2. **Rad-score 的组间分布**：全文未报告 massive 组 vs non-massive 组的 Rad-score 中位数/IQR，也未报告训练集 vs 验证集的 Rad-score 分布。这是放射组学论文的标准报告项，审稿人几乎必问。建议补一张箱线图或在 Table 1 增加一行。
3. **特征筛选各步的数量级联**：提取特征总数 → ICC>0.75 后剩余 → mRMR 后剩余（图 2b 上轴提示约 35）→ LASSO 后 6 个。正文目前只能写「约 35 个进入 LASSO」，建议改为精确数字。
4. **ICC 的实际取值**：流程图写了「n=20 做观察者内/间一致性检验」，但未报告 ICC 范围或中位数。
5. **DeLong 检验**：Model A/B/C 的两两比较 p 值，以及 NRI / IDI。没有这些，「联合模型更优」只能停留在描述层面（已按此处理）。
6. **验证集校准的处理方案**：Fig 8b 显示系统性高估（截距 −0.688）。请确认是否要（a）如实报告并在 Discussion 讨论，或（b）补做截距再校准并报告校准后指标。目前正文按 (a) 处理。
7. **Fig 7（旧 8）的 AUC 数值**：原图注承诺给出各变量 AUC，图中无数值。建议在图中加注，或按修订后的图注表述。
8. **文末两条无关参考文献**（Ao Q et al. 铁死亡与类风湿关节炎；Shen H et al. α7 nAChR 与慢性间歇低氧）与本研究无关，应删除。
9. **样本量/EPV**：30 events ÷ 4 predictors = 7.5 EPV，低于常规下限 10。正文已如实说明，建议 Discussion 的 Limitations 呼应，或补做 bootstrap 内部验证（500–1000 次）报告乐观度校正后的 AUC 与校准斜率。
