# 附件 04 · Scoping Review 可运行检索式与预检索方案

落地 `02` 号策略。**注意**：scoping review 不做地理限定（保持全国/国际证据图谱）；"单一地区"只约束 Phase 2 实证与 Phase 3 参数。本文件给出可直接粘贴运行的检索式与预检索 SOP。

---

## 1. PubMed 检索式（可直接运行）

```
(
  "tuberculosis"[MeSH Terms] OR tuberculosis[tiab] OR "latent tuberculosis"[tiab]
  OR LTBI[tiab] OR "M. tuberculosis"[tiab]
)
AND
(
  school*[tiab] OR student*[tiab] OR campus[tiab] OR university[tiab]
  OR college[tiab] OR adolescent*[tiab] OR "educational institution"[tiab]
)
AND
(
  screen*[tiab] OR "contact investigation"[tiab] OR "contact tracing"[tiab]
  OR "preventive treatment"[tiab] OR TPT[tiab] OR "preventive therapy"[tiab]
  OR "health education"[tiab] OR outbreak*[tiab] OR surveillance[tiab]
  OR management[tiab] OR "cost-effective*"[tiab] OR "cost-benefit"[tiab]
  OR "cost-utility"[tiab] OR "budget impact"[tiab] OR "economic burden"[tiab]
  OR "health polic*"[tiab] OR "public health service*"[tiab]
)
```

- **限定**：语言不限；年限先不限（scoping 求全），预检索后视量决定是否加近 10–15 年限定。
- **经济学子检索（服务 RQ2）**：在上式末尾 AND 一个纯经济学组：
  `("cost-effective*"[tiab] OR "cost-benefit"[tiab] OR "cost-utility"[tiab] OR "budget impact"[tiab] OR "economic evaluation"[tiab] OR "economic burden"[tiab] OR QALY[tiab] OR DALY[tiab])`

## 2. CNKI / 万方 检索式（中文，可直接运行）

**CNKI 专业检索：**
```
(SU=('结核' + '肺结核' + '结核感染' + '潜伏感染'))
AND (SU=('学校' + '学生' + '校园' + '高校' + '大学' + '中学' + '中职'))
AND (SU=('防控' + '筛查' + '密切接触者' + '预防性治疗' + '健康教育'
        + '聚集性疫情' + '管理' + '监测'
        + '成本效果' + '成本效益' + '卫生经济' + '预算影响'
        + '疾病负担' + '基本公共卫生服务' + '卫生政策'))
```

- 万方/维普用等价的"主题 = "组合；SinoMed 补充生物医学中文文献。
- **政策/灰色文献**：另在 WHO、国家卫健委、中国疾控中心站内检索"学校结核病 规范/指南"，学位论文库单独跑一轮。

## 3. 预检索 SOP（2 周内完成，用于估命中量 + 判 meta 可行性）

| 步骤 | 动作 | 记录 |
|------|------|------|
| 1 | 各库跑上述主检索式 | 每库命中数（建 `预检索命中记录.csv`） |
| 2 | 每库抽前 30–50 条读题录 | 估"相关率（precision）" |
| 3 | 跑经济学子检索 | 经济学文献量（判断 RQ2 证据厚度） |
| 4 | 针对 3 个候选窄问题各跑一次 | 见下表，判 meta 可行性 |
| 5 | 汇总 | 决定：加年限？调关键词？是否 PROSPERO 注册 meta |

**命中量决策规则（经验参考）**：
- 主检索总命中 < ~150 → 放宽（去年限、加同义词、加检索库）。
- 主检索 > ~3000 → 收紧（加学校场景限定词于标题、加近 15 年限定）。
- 相关率 < ~20% → 优化检索式而非直接筛全量。

## 4. meta 可行性预判（三个候选窄问题）

| 候选窄问题 | 可合并结局 | 判定门槛 |
|------------|-----------|----------|
| 学校主动筛查的结核病检出率 | 合并检出率（每 10 万 / 阳性比例） | ≥ 5–10 篇同类、人群与筛查方式相近 |
| IGRA vs TST 在学生人群一致性 | 一致率 / 阳性率差 | 结局定义统一、cut-off 可比 |
| 学生 LTBI 阳性者 TPT 完成率 | 合并完成率 | 方案与随访定义相近 |

任一满足 → PROSPERO 预注册 + 系统综述+meta（PRISMA 2020，RoB2/QUADAS-2 按类型）；均不满足 → 结构化叙述合成，不强行 meta。

## 5. 双人筛选与抽取

- 题录 → 全文双人独立，Kappa 记录，分歧第三人仲裁。
- 抽取表字段：作者/年份、地区、学段、主题/干预、结局、经济学指标、研究类型、证据强度、（若中国）政策层级。
- 全程记录 PRISMA-ScR 流程图各环节数量。
