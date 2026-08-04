// 开题报告 PPT 生成器 —— 6 分钟版
// 汇报时长限定 6 分钟（约 360 s），故正文压缩至 13 页讲述 + 致谢 + 备用页索引，
// 原按评分表重排的 33 页详情页整体降为备用页，提问时按索引跳转。
// 输出：开题报告_6分钟版.pptx —— 正文 15 页 + 备用 43 页 = 58 页
// 用法：node scripts/build_deck_v3.js

const pptxgen = require("pptxgenjs");
const fs = require("fs");

// ---------- 配色（与 figures/ 中的预实验配图统一） ----------
const NAVY = "0B3C5D";   // 主色，占视觉主导
const TEAL = "1D7874";   // 辅色
const RED = "C0392B";    // 强调色，同时是 CIH 组色
const BLUE = "1F6FB4";   // CIH+BHD 组色
const GREY = "6E6E6E";   // Sham 组色
const LIGHT = "F2F5F7";
const INK = "1F2933";
const MUTED = "5A6B7B";
const WHITE = "FFFFFF";
const GOLD = "B08333";

// 评分模块 → 颜色（重复出现的视觉母题：右上角圆角标签）
const MODCOLOR = { A: TEAL, B: NAVY, C: GOLD, D: RED, E: MUTED };

const FONT = "微软雅黑";
const W = 13.333, H = 7.5;
const M = 0.55;                 // 页边距
const BODY_TOP = 1.32;
const BODY_H = H - BODY_TOP - 0.75;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "罗玲";
pres.title = "博士学位论文开题报告";

let pageNo = 0;
let BACKUP = false;   // true 时页面右下角加「备用页」标记

// ---------- 通用构件 ----------
function chrome(slide, spec) {
  pageNo += 1;
  slide.addText(spec.title, {
    x: M, y: 0.40, w: W - M * 2 - 2.0, h: 0.62, margin: 0,
    fontFace: FONT, fontSize: 25, bold: true, color: NAVY, valign: "middle",
  });
  if (spec.mod) {
    slide.addShape(pres.ShapeType.roundRect, {
      x: W - M - 1.75, y: 0.50, w: 1.75, h: 0.40, rectRadius: 0.19,
      fill: { color: MODCOLOR[spec.mod] },
    });
    slide.addText(spec.modLabel, {
      x: W - M - 1.75, y: 0.50, w: 1.75, h: 0.40, margin: 0,
      fontFace: FONT, fontSize: 11, bold: true, color: WHITE, align: "center", valign: "middle",
    });
  }
  if (spec.lead) {
    slide.addText(spec.lead, {
      x: M, y: 1.00, w: W - M * 2, h: 0.32, margin: 0,
      fontFace: FONT, fontSize: 13, italic: true, color: MUTED, valign: "middle",
    });
  }
  slide.addText(String(spec.page || pageNo), {
    x: W - M - 0.9, y: H - 0.62, w: 0.9, h: 0.32, margin: 0,
    fontFace: FONT, fontSize: 10, color: MUTED, align: "right", valign: "middle",
  });
  if (spec.foot) {
    slide.addText(spec.foot, {
      x: M, y: H - 0.62, w: W - M * 2 - 1.0, h: 0.32, margin: 0,
      fontFace: FONT, fontSize: 10, color: MUTED, valign: "middle",
    });
  }
  if (BACKUP) {
    slide.addShape(pres.ShapeType.roundRect, {
      x: W - M - 2.05, y: H - 0.63, w: 1.0, h: 0.34, rectRadius: 0.16,
      fill: { color: "E3E8EC" },
    });
    slide.addText("备用页", {
      x: W - M - 2.05, y: H - 0.63, w: 1.0, h: 0.34, margin: 0,
      fontFace: FONT, fontSize: 9.5, color: MUTED, align: "center", valign: "middle",
    });
  }
  if (spec.notes) slide.addNotes(spec.notes);
}

function bullets(slide, items, box, size) {
  const fs_ = size || 14;
  slide.addText(
    items.map((t, i) => ({
      text: typeof t === "string" ? t : t.text,
      options: {
        bullet: true, breakLine: i !== items.length - 1,
        fontFace: FONT, fontSize: fs_,
        color: (typeof t === "object" && t.hi) ? RED : INK,
        bold: !!(typeof t === "object" && t.b),
        paraSpaceAfter: 7,
      },
    })),
    Object.assign({ margin: 0, valign: "top", lineSpacing: fs_ * 1.55 }, box)
  );
}

// 图占位框
function figBox(slide, box, caption) {
  slide.addShape(pres.ShapeType.roundRect, Object.assign({}, box, {
    rectRadius: 0.06, fill: { color: LIGHT },
    line: { color: MUTED, width: 1, dashType: "dash" },
  }));
  slide.addText(
    [
      { text: "【图位】", options: { fontFace: FONT, fontSize: 13, bold: true, color: MUTED, breakLine: true } },
      { text: caption, options: { fontFace: FONT, fontSize: 11.5, color: MUTED } },
    ],
    Object.assign({}, box, { margin: 0.16, align: "center", valign: "middle" })
  );
}

// 图片（已有成图）
function figImage(slide, box, path, caption) {
  slide.addImage(Object.assign({ path: path }, box));
  if (caption) {
    slide.addText(caption, {
      x: box.x, y: box.y + box.h + 0.05, w: box.w, h: 0.3, margin: 0,
      fontFace: FONT, fontSize: 10, color: MUTED, align: "center",
    });
  }
}

// 卡片行
function cards(slide, list, box, opts) {
  const o = opts || {};
  const cols = o.cols || list.length;
  const rows = Math.ceil(list.length / cols);
  const gap = o.gap || 0.24;
  const cw = (box.w - gap * (cols - 1)) / cols;
  const ch = (box.h - gap * (rows - 1)) / rows;
  list.forEach((c, i) => {
    const r = Math.floor(i / cols), k = i % cols;
    const x = box.x + k * (cw + gap), y = box.y + r * (ch + gap);
    slide.addShape(pres.ShapeType.roundRect, {
      x: x, y: y, w: cw, h: ch, rectRadius: 0.07,
      fill: { color: c.fill || LIGHT },
      line: { color: c.line || "DDE4E9", width: 1 },
    });
    const runs = [];
    if (c.tag) runs.push({ text: c.tag, options: { fontFace: FONT, fontSize: 10.5, bold: true, color: c.tagColor || TEAL, breakLine: true } });
    runs.push({ text: c.head, options: { fontFace: FONT, fontSize: c.headSize || 15, bold: true, color: c.headColor || NAVY, breakLine: !!c.body } });
    if (c.body) runs.push({ text: c.body, options: { fontFace: FONT, fontSize: c.bodySize || 12, color: c.bodyColor || INK } });
    slide.addText(runs, {
      x: x + 0.16, y: y + 0.12, w: cw - 0.32, h: ch - 0.24,
      margin: 0, valign: "top", lineSpacing: o.lineSpacing || 19,
    });
  });
}

// 简易表格
function table(slide, head, rows, box, colW) {
  const body = [
    head.map((h) => ({ text: h, options: { fontFace: FONT, fontSize: 12, bold: true, color: WHITE, fill: { color: NAVY }, valign: "middle", align: "left", margin: 6 } })),
    ...rows.map((r, ri) =>
      r.map((c) => ({
        text: typeof c === "string" ? c : c.t,
        options: {
          fontFace: FONT, fontSize: 11.5,
          color: (typeof c === "object" && c.hi) ? RED : INK,
          bold: !!(typeof c === "object" && c.b),
          fill: { color: ri % 2 ? WHITE : LIGHT }, valign: "middle", margin: 6,
        },
      }))
    ),
  ];
  slide.addTable(body, Object.assign({ colW: colW, border: { type: "solid", color: "DDE4E9", pt: 1 }, autoPage: false }, box));
}

// 深色版式（封面 / 总结 / 致谢 / 分节）
function darkSlide() {
  const s = pres.addSlide();
  s.background = { color: NAVY };
  return s;
}

// 标准内容页
function contentSlide(spec) {
  const s = pres.addSlide();
  chrome(s, spec);
  return s;
}


// ============================================================
// 正文（6 分钟版）：13 页讲述 + 致谢 + 备用页索引
// 配时：A 70 s · B 90 s · C 35 s · D 110 s · E 25 s（含开场与翻页余量）
// ============================================================

// —— M1 封面 ——
{
  const s = darkSlide();
  pageNo += 1;
  s.addText("博士学位论文开题报告", {
    x: M + 0.3, y: 1.45, w: W - M * 2 - 0.6, h: 0.45, margin: 0,
    fontFace: FONT, fontSize: 16, color: "9FC3D8", charSpacing: 3,
  });
  s.addText("半夏厚朴汤调节内质网-线粒体接触点几何重塑\n改善慢性间歇性低氧海马认知障碍的机制研究", {
    x: M + 0.3, y: 2.0, w: W - M * 2 - 0.6, h: 1.9, margin: 0,
    fontFace: FONT, fontSize: 30, bold: true, color: WHITE, lineSpacing: 44,
  });
  s.addText("ERMCS · 脂质过氧化传播与放大 · 距离梯度因果验证", {
    x: M + 0.3, y: 4.0, w: W - M * 2 - 0.6, h: 0.4, margin: 0,
    fontFace: FONT, fontSize: 14, italic: true, color: "7FB3CC",
  });
  s.addText(
    [
      { text: "汇报人：骆　玲　　2025 级同等学历专业博士", options: { fontFace: FONT, fontSize: 13, color: "CFE0EA", breakLine: true } },
      { text: "导　师：吕　洋　教授", options: { fontFace: FONT, fontSize: 13, color: "CFE0EA", breakLine: true } },
      { text: "专　业：老年医学　　研究方向：睡眠呼吸障碍与神经损伤机制", options: { fontFace: FONT, fontSize: 13, color: "CFE0EA", breakLine: true } },
      { text: "汇报日期：【填】", options: { fontFace: FONT, fontSize: 13, color: "CFE0EA" } },
    ],
    { x: M + 0.3, y: 4.85, w: 8.4, h: 1.7, margin: 0, lineSpacing: 24 }
  );
  s.addText("6 分钟版 · 正文 13 页 · 备用页见文末索引", {
    x: W - M - 4.3, y: H - 0.95, w: 4.0, h: 0.4, margin: 0,
    fontFace: FONT, fontSize: 11, color: "7FB3CC", align: "right",
  });
  s.addNotes("【约 10 s】各位老师好，我汇报的题目是《半夏厚朴汤调节内质网-线粒体接触点几何重塑改善慢性间歇性低氧海马认知障碍的机制研究》。时间关系，我按评分表的五个板块讲要点，细节都放在备用页。");
}

// —— M2 汇报提纲 ——
{
  const s = contentSlide({
    title: "汇报提纲", lead: "按《重庆医科大学研究生学位论文开题报告评分指标》的五个板块组织　·　全程 6 分钟",
    notes: "【约 10 s】一句话带过：顺序与各位手上的评分表一致；分值最高的第四部分包含已完成的第一作者综述与预实验结果。不要逐条念。",
  });
  cards(s, [
    { tag: "A　20 分　约 62 s", head: "一、选题依据", body: "临床问题与切入点 · 假说与关键问题 · 创新点\n研究内容 · 理论意义与应用价值 · 预期目标", tagColor: TEAL, headColor: TEAL, bodySize: 11.5 },
    { tag: "B　20 分　约 80 s", head: "二、研究方法", body: "技术路线 · 三队列四模块\n统计与质控 · 风险预案 · 12 个月进度", tagColor: NAVY, headColor: NAVY, bodySize: 11.5 },
    { tag: "C　20 分　约 30 s", head: "三、研究条件", body: "学术条件与依托平台 · 实验设备条件\n经费概算、来源与落实 · 伦理", tagColor: GOLD, headColor: GOLD, bodySize: 11.5 },
    { tag: "D　30 分　约 130 s　分值最高", head: "四、文献综述及研究基础", body: "领域动态与核心分歧 · 文献查阅量化\n第一作者综述 · 预实验结果与局限", tagColor: RED, headColor: RED, bodySize: 11.5 },
    { tag: "E　10 分　约 22 s", head: "五、总结", body: "三句话收口", tagColor: MUTED, headColor: MUTED, bodySize: 11.5 },
    { tag: "", head: "细节全部保留在备用页", body: "文献、TEM 指标定义、组学决策树、经费明细、\n完整风险表与进度表等，提问时随时调出", tagColor: MUTED, headColor: INK, headSize: 13, bodySize: 11.5 },
  ], { x: M, y: BODY_TOP + 0.28, w: W - M * 2, h: BODY_H - 0.28 }, { cols: 3, gap: 0.3 });
}

// —— M3 A 选题依据 ——
{
  const s = contentSlide({
    title: "选题依据：临床问题与切入点", mod: "A", modLabel: "A 选题依据",
    lead: "★ 立论基于近年公开发表的前沿证据，而非课题组既有数据 —— 开题报告正文中已明确声明",
    notes: "【约 35 s】三句话：一，OSA 相关认知障碍存在治疗缺口，CPAP 对已成神经损伤逆转有限；二，现有机制研究停留在终末效应层面，没回答损伤从何处启动、为何在特定细胞器区域被放大；三，两条公开证据一衔接，就把切入点指向 ERMCS。最后一条补注必须讲——空间首发热点不等于时间起始事件。",
  });
  bullets(s, [
    { text: "临床缺口：CPAP 纠正气道阻塞，对已形成的神经损伤逆转有限，依从性亦差", b: true },
    "　海马对反复低氧-复氧高度敏感；去除缺氧刺激后认知恢复并不完全 → 有结构与分子基础",
    { text: "机制缺口：现有研究集中于氧化应激、神经炎症、铁代谢等终末效应层面", b: true },
    "　未回答：损伤从何处启动？为何在特定细胞器区域被放大？—— 亚细胞器空间结构层面认识不足",
    { text: "证据一：CIH 海马的脂质过氧化—铁代谢—GPX4/ACSL4 级联已有较充分文献支持", b: true },
    { text: "证据二：Sassano 2025 Nat Cell Biol —— ERMCS 是磷脂过氧化的空间首发热点", b: true },
    { text: "→ 两条证据衔接，提出以 ERMCS 为切入点解释 CIH 海马损伤", b: true, hi: true },
    "　该衔接属跨系统外推（证据等级 Extrapolated，见第 9 页证据地图）—— 在 CIH 海马中检验它，正是本课题的任务",
    { text: "★ 关键补注：局部磷脂氢过氧化物在时间上先于可测的接触扩张", hi: true },
    { text: "　故几何更宜理解为过氧化「传播与放大」的控制变量，而非时间起始事件", hi: true, b: true },
  ], { x: M, y: BODY_TOP + 0.28, w: 7.6, h: BODY_H - 0.28 }, 12.5);
  figImage(s, { x: M + 7.95, y: BODY_TOP + 0.28, w: W - M * 2 - 7.95, h: BODY_H - 0.28 }, "figures/f05.png");
}

// —— M4 A 假说 · 关键问题 · 创新点 ——
{
  const s = contentSlide({
    title: "科学假说 · 关键科学问题 · 创新点", mod: "A", modLabel: "A 选题依据",
    notes: "【约 27 s】假说读一遍即可。三个关键问题按现象→因果→机制一句话带过。创新点只讲第②条振荡接触模型——那是最原创的一条。右栏的意义与预期目标一句话扫过即可，但必须出现（评分表 A 栏四项细目中的两项）。若被问「你到底认为几何是不是起因」：这正是本课题要判定的问题之一，判据来自队列 C。",
  });
  s.addShape(pres.ShapeType.roundRect, { x: M, y: BODY_TOP, w: W - M * 2, h: 1.30, rectRadius: 0.07, fill: { color: "FBEEEC" }, line: { color: RED, width: 1.4 } });
  s.addText([
    { text: "假说　", options: { fontFace: FONT, fontSize: 13, bold: true, color: RED } },
    { text: "CIH 反复低氧-复氧暴露 → 海马 CA1 锥体神经元 ERMCS 几何病理性重塑（", options: { fontFace: FONT, fontSize: 13, color: INK } },
    { text: "方向不预设、双侧检验", options: { fontFace: FONT, fontSize: 13, bold: true, color: RED } },
    { text: "）→ 形成更易发生磷脂过氧化的脂质微域 → 放大神经元损伤 → 海马依赖性认知障碍；\n", options: { fontFace: FONT, fontSize: 13, color: INK, breakLine: true } },
    { text: "BHD 通过使 ERMCS 几何趋向 Sham 水平降低脂质过氧化敏感性，并经由无偏组学判定的下游通路发挥保护。", options: { fontFace: FONT, fontSize: 13, color: INK } },
  ], { x: M + 0.2, y: BODY_TOP + 0.11, w: W - M * 2 - 0.4, h: 1.08, margin: 0, valign: "middle", lineSpacing: 18 });

  cards(s, [
    { tag: "问题一 · 现象", head: "是否存在可量化、可重复的\nERMCS 几何重塑？", body: "模块一：TEM 五指标 ＋ 原位 PLA", tagColor: TEAL, headSize: 12.5, bodySize: 11 },
    { tag: "问题二 · 因果位置", head: "该重塑是起始事件、传播放大\n环节，还是伴随现象？", body: "队列 C 周期内时点 vs 队列 A 慢性时点", tagColor: RED, headColor: RED, headSize: 12.5, bodySize: 11 },
    { tag: "问题三 · 机制", head: "BHD 是否依赖调控几何？\n经何下游通路保护？", body: "模块二组学 ＋ 模块三 EML 距离梯度", tagColor: TEAL, headSize: 12.5, bodySize: 11 },
  ], { x: M, y: BODY_TOP + 1.48, w: 8.5, h: 1.62 }, { cols: 3, gap: 0.24 });

  bullets(s, [
    { text: "研究内容：四个模块 —— ① 表型与 ERMCS 形态学　② CA1 子区 TMT 组学　③ 周期内动态　④ EML 距离梯度因果验证（第 6 页展开）", b: true },
    { text: "创新点", b: true },
    { text: "① 首次在哺乳动物在体 CIH 海马中检验 ERMCS 几何的因果作用（既有证据均来自非 CIH 细胞体系）", b: true },
    { text: "② 提出并检验「振荡接触」模型，尝试调和文献中相互矛盾的终点观察 —— 本课题最具原创性的一条", b: true, hi: true },
    { text: "③ 首次将 BHD 的神经保护与 ERMCS 结构重塑相联系，并预设依赖性判据（G9 vs G6）", b: true },
    { text: "④ 首次将 EML 距离梯度工具用于中枢神经系统药理学，且不预设剂量-反应形状", b: true },
    { text: "⑤ 建立多层级证据体系并预先锁定统计终点层级；以动物为生物学重复", b: true },
  ], { x: M, y: BODY_TOP + 3.22, w: 8.5, h: BODY_H - 3.22 }, 11);
  cards(s, [
    { tag: "理论意义", head: "", body: "把 CIH 海马损伤的解释层级，从并列的分子通路提升到细胞器接触几何这一空间层面", headSize: 1, tagColor: TEAL, bodySize: 10.5 },
    { tag: "应用价值", head: "", body: "为 OSA 相关认知障碍提供结构层面的上游干预方向；为半夏厚朴汤的临床再评价与二次开发提供实验依据", headSize: 1, tagColor: TEAL, bodySize: 10.5 },
    { tag: "预期目标与成果", head: "", body: "博士学位论文主体 + SCI 论文 ≥1 篇；L1「BHD 逆转 CIH-ERMCS 重塑」为必胜底，L2–L4 受挫时仍可独立成文", headSize: 1, tagColor: TEAL, bodySize: 10.5 },
  ], { x: M + 8.85, y: BODY_TOP + 1.48, w: W - M * 2 - 8.85, h: BODY_H - 1.48 }, { cols: 1, gap: 0.16, lineSpacing: 12 });
}

// —— M5 B 总体技术路线 ——
{
  const s = contentSlide({
    title: "总体技术路线", mod: "B", modLabel: "B 研究方法",
    lead: "设计原则：先结构、后组学、再因果 —— 分层推进，避免全链条同时失败　·　M6 决策会议为全课题关键节点",
    notes: "【约 20 s】按箭头顺序走一遍，只点三处：入口是三队列；中间 M6 决策会议锁定下游通路；出口是 EML 距离梯度因果验证。不要展开细节。",
  });
  figImage(s, { x: M, y: BODY_TOP + 0.3, w: W - M * 2, h: BODY_H - 0.3 }, "figures/f15.png");
}

// —— M6 B 三队列与四模块 ——
{
  const s = contentSlide({
    title: "研究对象、三队列设计与四个研究模块", mod: "B", modLabel: "B 研究方法",
    lead: "C57BL/6J 雄性小鼠　·　造模 21% O₂ ↔ 7.5±0.5% O₂，1 cycle/min，6 h/d × 6 周　·　BHD 7.01 g/kg/d 灌胃",
    notes: "【约 30 s】重点讲三个取材时点：队列 C 在末次循环的复氧相结束即刻（周期内瞬变）、队列 B 在末次暴露次日晨（暴露末、未做行为学）、队列 A 在行为学结束后（约 7–10 d，带恢复期成分，但能与同一动物的行为数据配对）。三点覆盖瞬变—暴露末—恢复期。若被问「队列 A 的 TEM 是不是慢性暴露状态」：要承认它带恢复期成分，暴露末的形态学由队列 B 的取材时点提供。队列 C 不设加药组是因为它回答的不是药效问题——主动说，否则会被当成设计漏洞追问。",
  });
  table(s, ["队列", "分组与样本量", "取材时点", "主要读出"], [
    [{ t: "队列 A", b: true }, "Sham / CIH / CIH+BHD，n=8/组，共 24 只", "行为学结束后（末次暴露后约 7–10 d）", "MWM、NOR、TEM、PLA、WB、生化、IHC"],
    [{ t: "队列 B", b: true }, "Sham / CIH / CIH+BHD，n=4/组，共 12 只", "CIH 结束次日晨（不做行为学，避免应激干扰组学）", "CA1 显微切割 ＋ TMT 16-plex 蛋白组学"],
    [{ t: "队列 C", b: true, hi: true }, { t: "Sham / CIH，n=8/组，共 16 只", hi: true }, { t: "W6 末次低氧-复氧循环的复氧相结束即刻", hi: true, b: true }, { t: "TEM、PLA、4-HNE —— 周期内急性时点证据", hi: true }],
  ], { x: M, y: BODY_TOP + 0.28, w: W - M * 2 }, [1.3, 3.5, 4.2, 5.23]);
  cards(s, [
    { tag: "模块一 · 队列 A", head: "表型与 ERMCS 形态学", body: "行为学 ＋ 海马病理 ＋ TEM 五指标 ＋ 原位 PLA", tagColor: NAVY, headSize: 13.5, bodySize: 11.5 },
    { tag: "模块二 · 队列 B", head: "CA1 子区 TMT 组学", body: "显微切割 ＋ 16-plex ＋ 双轴生信 → 锁定下游通路", tagColor: NAVY, headSize: 13.5, bodySize: 11.5 },
    { tag: "模块三 · 队列 C", head: "周期内动态", body: "复氧相急性时点 vs 慢性时点，检验相位结构", tagColor: NAVY, headSize: 13.5, bodySize: 11.5 },
    { tag: "模块四 · 体外", head: "EML 距离梯度因果验证", body: "HT22 + H/R；15 / 20 / 30 nm 三档；检验剂量反应", tagColor: NAVY, headSize: 13.5, bodySize: 11.5 },
  ], { x: M, y: BODY_TOP + 2.60, w: W - M * 2, h: 1.28 }, { cols: 4, gap: 0.24, lineSpacing: 14 });
  s.addShape(pres.ShapeType.roundRect, { x: M, y: H - 2.00, w: W - M * 2, h: 1.26, rectRadius: 0.07, fill: { color: LIGHT }, line: { color: "DDE4E9", width: 1 } });
  s.addText([
    { text: "总动物数 52 只（24+12+16），计 15% 备用后购买 60 只　·　n=8/组 依 ERMICC_std 效应量与设计效应测算（ICC=0.2，40 点/鼠 ≈ 4.55 有效独立观测）\n", options: { fontFace: FONT, fontSize: 10.5, color: INK, breakLine: true } },
    { text: "三个取材时点覆盖「瞬变 — 暴露末 — 恢复期」：队列 C 周期内复氧相即刻 · 队列 B 末次暴露次日晨 · 队列 A 行为学后（可与同一动物的行为数据配对，但带恢复期成分）\n", options: { fontFace: FONT, fontSize: 10.5, bold: true, color: NAVY, breakLine: true } },
    { text: "队列 C 不设加药组：它回答的是「几何改变处于何种因果位置」，药效判读在队列 A（含行为-结构配对）与体外 G9 vs G6 完成", options: { fontFace: FONT, fontSize: 10.5, color: INK } },
  ], { x: M + 0.2, y: H - 1.94, w: W - M * 2 - 0.4, h: 1.14, margin: 0, valign: "middle", lineSpacing: 15 });
}

// —— M7 B 统计 · 质控 · 风险 · 进度 ——
{
  const s = contentSlide({
    title: "统计设计、质量控制、风险预案与进度", mod: "B", modLabel: "B 研究方法",
    notes: "【约 30 s】只讲三句：第一，主要终点是唯一的 ERMICC_std，三级终点分层在揭盲前锁定；第二，实验单位是动物不是接触点，报 n 必须报动物数，否则构成伪重复；第三，右侧三项方法学局限是我自己在综述里提出的判据，主动交代。进度条指一下 M6 决策会议即可，不要逐条念。若被问毕业时间：M1 起算的十二个月完成主体数据与成文，之后预留送审与答辩窗口（起始月与预留期见图注）。",
  });
  bullets(s, [
    { text: "★ 主要终点（唯一）：ERMICC_std，双侧 α=0.05；关键次要终点：接触覆盖率、平均最小膜间距（Bonferroni α=0.025）；余为探索性（BH-FDR）", b: true, hi: true },
    { text: "　三级终点分层与全部几何终点的双侧检验，均于揭盲前锁定", b: true },
    { text: "★ TEM 的 ERMCS 指标采用线性混合效应模型：指标 ~ 组别 + (1 | 动物/神经元)", b: true, hi: true },
    { text: "　数据三层嵌套（接触点 ⊂ 神经元 ⊂ 动物），实验单位是动物而非接触点；报 n 必须报动物数，严禁以接触点数作 n —— 那构成伪重复，会低估标准误", hi: true },
    "三组比较 one-way ANOVA + Tukey（正态）／ Kruskal-Wallis + Dunn；组学 BH-FDR 校正",
    { text: "距离-结局关系形状不预设，两步检验：omnibus → 线性对比与二次对比在同一模型内并列拟合", b: true },
    "戊二醛储存天数作协变量；体重作协变量；效应量必报；全程双盲编码与双人独立定量",
    { text: "其他风险：阴性结果如实报告；几何方向若与预期相反，可提「急性扩张 + 慢性破坏」时程模型（情形 H）；EML 质粒四级获取路径已备", b: true },
  ], { x: M, y: BODY_TOP, w: 7.3, h: 3.30 }, 11.5);

  s.addShape(pres.ShapeType.roundRect, { x: M + 7.65, y: BODY_TOP, w: W - M * 2 - 7.65, h: 3.30, rectRadius: 0.07, fill: { color: "FBEEEC" }, line: { color: "E8C4BE", width: 1.4 } });
  s.addText([
    { text: "★ 主动交代 · 三项方法学局限\n", options: { fontFace: FONT, fontSize: 12, bold: true, color: RED, breakLine: true } },
    { text: "均出自本人综述提出的「决定性实验」判据\n", options: { fontFace: FONT, fontSize: 10, color: MUTED, breakLine: true } },
    { text: "S1　以 2D TEM 而非 3D 电镜量化\n", options: { fontFace: FONT, fontSize: 10, bold: true, color: NAVY, breakLine: true } },
    { text: "→ 以组间相对差异为结论依据；系统随机取样 + 双盲定量 + 第三方仲裁；3D EM 列为后续基金方向\n", options: { fontFace: FONT, fontSize: 10, color: INK, breakLine: true } },
    { text: "S2　队列 C 仅一个周期内时点，非完整相位序列\n", options: { fontFace: FONT, fontSize: 10, bold: true, color: NAVY, breakLine: true } },
    { text: "→ 定位为「首个周期内时点」，足以回答最小判别问题；完整相位序列另行立项\n", options: { fontFace: FONT, fontSize: 10, color: INK, breakLine: true } },
    { text: "S3　铁死亡因果依组学判定，无遗传操作\n", options: { fontFace: FONT, fontSize: 10, bold: true, color: NAVY, breakLine: true } },
    { text: "→ 不预设下游为铁死亡；若组学指向铁死亡，再补两种机制不同的 rescue", options: { fontFace: FONT, fontSize: 10, color: INK } },
  ], { x: M + 7.81, y: BODY_TOP + 0.12, w: W - M * 2 - 7.97, h: 3.06, margin: 0, valign: "top", lineSpacing: 12 });

  figImage(s, { x: 0.74, y: BODY_TOP + 3.48, w: 11.86, h: 1.80 }, "figures/fp5.png");
}

// —— M8 C 研究条件 ——
{
  const s = contentSlide({
    title: "研究条件：学术条件、实验平台、经费与伦理", mod: "C", modLabel: "C 研究条件",
    notes: "【约 30 s】按评分表 C 栏三项细目走：一，学术条件——导师团队方向对口，且造模与行为学流程已由本人跑过一轮；二，设备条件——所需平台均为校内共享或成熟外协，两项要求高的已配套控制措施；若被问 MWM 有没有跑过，如实答：这一轮预实验只做了 NOR，MWM 与旷场排在 M1 预试；三，经费——14.85 万控制在 15 万以内，来源已落实，核心问题优先、拓展验证递进。伦理一句话带过：按 60 只动物报批，M1 完成。",
  });
  s.addShape(pres.ShapeType.roundRect, { x: M, y: BODY_TOP, w: W - M * 2, h: 0.86, rectRadius: 0.07, fill: { color: "FBF3E2" }, line: { color: GOLD, width: 1.4 } });
  s.addText([
    { text: "学术条件　", options: { fontFace: FONT, fontSize: 12, bold: true, color: GOLD } },
    { text: "依托学科：重庆医科大学【填】老年医学　·　导师：吕　洋 教授（睡眠呼吸障碍与神经损伤机制）\n", options: { fontFace: FONT, fontSize: 11.5, color: INK, breakLine: true } },
    { text: "本人 / 课题组已自行完成：文献调研与第一作者综述（初稿）· 4 周 CIH 造模验证 · NOR 流程预试与范式修订 · 海马组织取材固定（TEM 制样中）", options: { fontFace: FONT, fontSize: 11, color: INK } },
  ], { x: M + 0.2, y: BODY_TOP + 0.06, w: W - M * 2 - 0.4, h: 0.74, margin: 0, valign: "middle", lineSpacing: 16 });

  table(s, ["所需平台 / 技术", "落实方式", "成熟度", "波动风险控制"], [
    ["动物平台、CIH 造模舱", "校内共享；已完成 4 周造模验证", { t: "已跑通", b: true }, "每周 SpO₂ 抽测；双 O₂ 监测、漏气报警、紧急制氧"],
    ["行为学：NOR / MWM / 旷场", { t: "校内共享；本轮仅 NOR 完成预试", b: true, hi: true }, { t: "NOR 需复测\nMWM 待预试", b: true, hi: true }, { t: "NOR 六项修正已落实待复测（第 12 页）；MWM 为主实验记忆学主判据，尚未预试，排入 M1 完成参数标定", hi: true }],
    ["透射电镜", "校内共享（需预约档期）", { t: "要求高", b: true, hi: true }, { t: "固定 SOP、全组配平、系统随机取样、双盲定量 + 第三方仲裁", hi: true }],
    ["蛋白组学 TMT 16-plex", "外协成熟路径", { t: "要求高", b: true, hi: true }, { t: "单设组学队列避免行为学应激；4 个 pooled QC 通道；CV<20%", hi: true }],
    ["病理 / IHC、共聚焦 PLA、细胞培养", "校内共享 + 病理科外协", { t: "成熟", b: true }, "统一批次；PLA 四类对照同批处理；转染效率预试验证"],
  ], { x: M, y: BODY_TOP + 0.94, w: W - M * 2 }, [3.0, 2.9, 1.35, 4.98]);

  table(s, ["经费科目", "万元", "主要用途 / 落实情况"], [
    [{ t: "材料费", b: true }, { t: "6.95", b: true }, "动物、药材、抗体、试剂盒、Addgene 质粒、细胞耗材"],
    [{ t: "测试化验加工费", b: true }, { t: "5.90", b: true }, "TMT 组学、TEM、PLA、共聚焦机时、外协检测"],
    ["劳务 / 出版 / 差旅", "2.00", "研究生劳务、论文发表与文献、学术交流"],
    [{ t: "合计", b: true }, { t: "14.85", b: true, hi: true }, { t: "严格控制在 15 万元以内；核心问题优先，拓展验证递进", b: true }],
    [{ t: "经费来源", b: true, hi: true }, { t: "【填】", b: true, hi: true }, { t: "【填：导师课题编号 / 科室经费 / 研究生创新项目】　已落实【填】万元", b: true, hi: true }],
  ], { x: M, y: BODY_TOP + 3.25, w: 8.35 }, [1.9, 1.0, 5.45]);

  s.addShape(pres.ShapeType.roundRect, { x: M + 8.70, y: BODY_TOP + 3.25, w: W - M * 2 - 8.70, h: 1.90, rectRadius: 0.07, fill: { color: LIGHT }, line: { color: "DDE4E9", width: 1 } });
  bullets(s, [
    { text: "伦理与学术规范", b: true },
    "IACUC：按 60 只动物（含队列 A/B/C）报批，计划 M1 完成审查，批件下达前不启动动物实验",
    "3R：队列 B 不做行为学、队列 C 与 A 共用慢性背景，均为减少动物用量的设计",
    "原始数据按 FAIR 原则归档（组学数据拟存 PRIDE / GEO）",
  ], { x: M + 8.88, y: BODY_TOP + 3.35, w: W - M * 2 - 9.06, h: 1.70 }, 10.5);
}

// —— M9 D 文献综述 ——
{
  const s = contentSlide({
    title: "文献综述：证据地图与核心分歧", mod: "D", modLabel: "D 文献综述",
    lead: "PubMed + Web of Science，建库至 2026 年 7 月，四组检索词交叉　·　逐篇标注证据等级与实验系统",
    notes: "【约 33 s】这一页要传达的是「不只是读过文献，而是对文献做了分级评估」。检索漏斗的四个数字必须是真实数字，不得估算——评委会问「你精读了多少篇」。核心一句：跨系统外推的推理距离是显式可见的。分歧一栏要点出——提示破坏的两项恰是间歇低氧＋哺乳动物在体，与本模型最接近，所以我不预设方向。",
  });
  table(s, ["证据域", "实验系统", "已直接证明", "对 CIH 海马 CA1 仍未证明", "等级"], [
    ["CIH 与认知", "大鼠 / 小鼠在体", "空间学习、氧化应激、CA1 突触可塑性改变", "低氧血症、睡眠片段化与共病的相对贡献未分离", { t: "Direct", b: true }],
    ["CIH 与铁死亡", "大鼠海马；幼鼠前额叶", "Fe²⁺、脂质过氧化、GPX4/ACSL4 改变；药物挽救改善认知", "无研究在同批动物中同时具备 CA1 分辨率与 ERMCS 测量", { t: "Direct（不完整）", b: true }],
    ["ERMCS 过氧化热点", "人/鼠细胞系；化学诱导；非 CIH", "磷脂氢过氧化物起于 ERMCS 并向线粒体扩散", "对 CIH 神经元的适用性；每个循环内首发事件的方向", { t: "Extrapolated", b: true, hi: true }],
    ["CIH 与接触重塑", "小鼠心肌；小鼠脑 DA 神经元", "CIH 破坏 MAM 信号；破坏 Mfn2–Plin5 系链且恢复系链具保护性", "海马接触是扩张、解偶联还是振荡；是否存在细胞类型差异", { t: "Supportive", b: true }],
  ], { x: M, y: BODY_TOP + 0.28, w: W - M * 2 }, [1.55, 2.15, 3.5, 3.75, 1.28]);
  cards(s, [
    { tag: "核心分歧 · 提示接触扩张", head: "Sassano 2025 肿瘤细胞　Yan 2026 鱼肝细胞（持续低氧）　Jiang 2026 小鼠脊髓神经元（SCI）", body: "", tagColor: BLUE, headColor: BLUE, headSize: 11.5, fill: "EDF3FA", line: "C4D9EE" },
    { tag: "核心分歧 · 提示接触破坏 / 系链解体", head: "Moulin 2022 小鼠心 ＋ 人心房（IH 21 d）　Zhai 2026 小鼠脑 DA 神经元（CIH）", body: "", tagColor: RED, headColor: RED, headSize: 11.5, fill: "FBEEEC", line: "E8C4BE" },
  ], { x: M, y: BODY_TOP + 3.45, w: W - M * 2, h: 1.02 }, { cols: 2, gap: 0.3, lineSpacing: 16 });
  s.addText([
    { text: "文献查阅　", options: { fontFace: FONT, fontSize: 11.5, bold: true, color: MUTED } },
    { text: "检索命中【填】篇 → 去重初筛后【填】篇 → 全文精读【填】篇 → 引用【填】篇（近 5 年占【填】%）；另手工追溯核心文献的参考与引证文献\n", options: { fontFace: FONT, fontSize: 11.5, color: INK, breakLine: true } },
    { text: "★ 提示破坏的两项恰是「间歇低氧 ＋ 哺乳动物在体」，与本课题模型最接近 → 故对全部几何终点采用双侧检验，方向由数据判定", options: { fontFace: FONT, fontSize: 12.5, bold: true, color: NAVY } },
  ], { x: M, y: H - 1.58, w: W - M * 2, h: 0.86, margin: 0, valign: "middle", lineSpacing: 17 });
}

// —— M10 D 研究基础① 综述与方法学准备 ——
{
  const s = contentSlide({
    title: "研究基础①：第一作者综述与方法学准备", mod: "D", modLabel: "D 研究基础",
    notes: "【约 25 s】开口第一句：本课题的科学问题不是临时想到的，是我系统梳理这个领域之后自己提出并写成文章的框架。综述提出的振荡接触模型、四级证据分级、三模型证伪标准，就是本开题报告第 A、B、D 三部分的骨架。",
  });
  s.addShape(pres.ShapeType.roundRect, { x: M, y: BODY_TOP, w: W - M * 2, h: 1.72, rectRadius: 0.08, fill: { color: "FBF3E2" }, line: { color: GOLD, width: 1.5 } });
  s.addText([
    { text: "★ 已完成第一作者机制综述　", options: { fontFace: FONT, fontSize: 15, bold: true, color: GOLD } },
    { text: "罗玲 第一作者 / 吕洋 通讯作者　·　状态：初稿已完成、拟投稿　·　正文九章 + 5 图 2 表\n", options: { fontFace: FONT, fontSize: 12, color: INK, breakLine: true } },
    { text: "Oscillating ER–Mitochondria Contacts in Chronic Intermittent Hypoxia: A Falsifiable Framework for Ferroptosis and Cognitive Impairment\n", options: { fontFace: FONT, fontSize: 11, italic: true, color: NAVY, breakLine: true } },
    { text: "→ 提出振荡接触模型（本课题队列 C 的理论依据）　→ 建立四级证据分级（上一页证据地图）　→ 给出三模型证伪标准（预先写明什么结果会推翻本模型）", options: { fontFace: FONT, fontSize: 12, bold: true, color: INK } },
  ], { x: M + 0.22, y: BODY_TOP + 0.14, w: W - M * 2 - 0.44, h: 1.54, margin: 0, valign: "top", lineSpacing: 19 });
  cards(s, [
    { tag: "① 文献调研", head: "", body: "两库四组检索词交叉检索\n形成三条证据链梳理与研究空白定位\n核心引用【填】篇", headSize: 1, tagColor: TEAL, bodySize: 11.5 },
    { tag: "② 方案迭代收敛", head: "", body: "V1.0 全押铁死亡（高崩盘）→ V3.0 ERMCS 降级（事后判定为失误）→ V4.0 质粒获取风险 → V4.1 改用可商购 EML → V4.2–4.5 逐项闭合；每一版由一次风险识别驱动", headSize: 1, tagColor: TEAL, bodySize: 11.5 },
    { tag: "③ 方法学准备成果", head: "", body: "TEM 五指标体系 + 三级终点分层\n固定 SOP 与全组配平铁律\n取样量与设计效应测算\n抗体种属核查与更换、EML 引文一手核实与更正", headSize: 1, tagColor: TEAL, bodySize: 11.5 },
  ], { x: M, y: BODY_TOP + 1.92, w: W - M * 2, h: 2.25 }, { cols: 3, gap: 0.3 });
  s.addShape(pres.ShapeType.roundRect, { x: M, y: BODY_TOP + 4.25, w: W - M * 2, h: 0.72, rectRadius: 0.07, fill: { color: "EDF3FA" }, line: { color: BLUE, width: 1.5 } });
  s.addText([
    { text: "④ 已完成预实验：", options: { fontFace: FONT, fontSize: 13, bold: true, color: BLUE } },
    { text: "预实验（2026-07-22 轮次；Sham / CIH / CIH+BHD 各 n=3，CIH 4 周）—— 造模成立；海马组织已取材固定，TEM 制样 / 拍照进行中，ERMCS 量化待判读　→ 见下两页", options: { fontFace: FONT, fontSize: 12, color: INK } },
  ], { x: M + 0.2, y: BODY_TOP + 4.32, w: W - M * 2 - 0.4, h: 0.58, margin: 0, valign: "middle" });
}

// —— M11 D 研究基础② 预实验结果 ——
{
  const s = contentSlide({
    title: "研究基础②：预实验结果 —— 造模成立，行为学呈方向性信号", mod: "D", modLabel: "D 研究基础",
    lead: "预实验 2026-07-22 轮次　·　雄性 C57BL/6J 9 只（n=3/组）　·　CIH 6 h/d × 28 d　·　BHD 工作日给药共 20 次、100 µL/只　·　均值±SD",
    notes: "【约 37 s】给药口径先说清：低氧连续 28 天，但灌胃只在工作日、共 20 次，累积 140.2 g/kg，折合全程平均 5.01 g/kg/d——低于文献的每日 7.01，主实验改为每日给药。然后三句话：第一，造模成立——三组增重范围完全不重叠，CIH 较 Sham 少 41.9%；第二，不依赖物体区域判定的三项轨迹与姿态指标方向完全一致，Sham 正常、CIH 恶化、加药回复；第三，依赖区域判定的两项（新物体潜伏期、分析区进入次数）与 DI 共用同一个被判定为有误的判定点，本轮不作为独立证据——这一层要自己讲，讲了是严谨，被问出来是漏洞。最后交代增重悖论：加药组增重更低但活动量更高，这恰恰说明活动量差异不是体重掉出来的。n=3 只作方向性判断，不用来推算样本量。",
  });
  figImage(s, { x: 0.87, y: BODY_TOP + 0.30, w: 11.60, h: 3.71 }, "figures/fp4.png");
  cards(s, [
    { tag: "结论一 · 造模成立", head: "三组增重完全不重叠", body: "P<0.001；CIH 较 Sham 减少 41.9%（d = −9.05）。本轮无 SpO₂ 等暴露验证，判据仅为体表型 → 主实验加每周 SpO₂ 与 W3 海马 4-HNE / Fe²⁺ 抽检", tagColor: RED, headColor: RED, headSize: 12.5, bodySize: 10 },
    { tag: "结论二 · 可用证据", head: "三项轨迹 / 姿态指标方向一致", body: "总路程、不动时间、蜷缩姿态：Sham 正常 → CIH 恶化 → 加药回复，均达预设方向性信号标准", tagColor: BLUE, headColor: BLUE, headSize: 12.5, bodySize: 10 },
    { tag: "★ 主动交代", head: "两项须降级 · 增重悖论", body: "新物体潜伏期与分析区进入次数依赖区域判定，与 DI 同受影响；加药组增重更低而活动量更高 → 活动量差异非体重驱动（主实验以体重为协变量）", tagColor: GOLD, headColor: GOLD, headSize: 12.5, bodySize: 10, fill: "FBF3E2", line: "E4D2A8" },
  ], { x: M, y: BODY_TOP + 4.14, w: W - M * 2, h: BODY_H - 4.14 }, { cols: 3, gap: 0.28, lineSpacing: 13 });
}

// —— M11b TEM 初步结果（数据到位后取消注释启用；启用后配时 D 组 +25 s，从第 5 页匀）——
// {
//   const s = contentSlide({
//     title: "研究基础②补：海马 CA1 TEM 的 ERMCS 初步量化", mod: "D", modLabel: "D 研究基础",
//     lead: "预实验 2026-07-22 轮次取材　·　n=【填】/组　·　双盲编码定量　·　主要终点 ERMICC_std",
//     notes: "【约 25 s】只讲两句：一，能在 CA1 稳定分辨 ER 与线粒体膜并完成五指标量化，说明制样与判读流程跑通；二，组间差异的方向按预设双侧检验判读，不预设方向。n 小，只作可行性判断。",
//   });
//   figImage(s, { x: M, y: BODY_TOP + 0.30, w: 7.4, h: 3.9 }, "figures/fp6.png");
//   bullets(s, [
//     { text: "流程可行性：CA1 锥体神经元 ER 与线粒体膜界面可稳定分辨，五指标均可量化", b: true },
//     "ERMICC_std（主要终点）：Sham 【填】 vs CIH 【填】 vs CIH+BHD 【填】",
//     "接触覆盖率 / 平均最小膜间距（关键次要终点）：【填】",
//     "≤10 nm 紧密接触比例 / 线粒体形态（探索性）：【填】",
//     { text: "判读：本轮 n 小，仅作制样与判读流程的可行性判断，不作方向性结论", b: true, hi: true },
//   ], { x: M + 7.75, y: BODY_TOP + 0.30, w: W - M * 2 - 7.75, h: 3.9 }, 11);
// }

// —— M12 D 研究基础③ 预实验局限与修正 ——
{
  const s = contentSlide({
    title: "研究基础③：预实验的局限与主实验修正", mod: "D", modLabel: "D 研究基础",
    lead: "★ 主动交代：本轮新物体识别未建立有效读出，尚不能判断 CIH 对识别记忆的影响，亦不能判断 BHD 的干预效应",
    notes: "【约 35 s】这一页是加分项，不要跳。关键一句：正常对照组自己都没有表现出可靠的新物体偏好，那么任何组间比较都不可解释——所以我不拿这一轮的 DI 说事。六条局限都是自己查出来的，且每条都有修正方案；最后一句讲判读规则：决定主实验能否开展的核心指标是 TEM 的 ERMCS 量化，它现在还在制样拍照、结果没出来——这一点要自己讲清楚，不能让评委以为预实验已经全部完成；行为学本轮未获支持不构成 No-Go。",
  });
  figImage(s, { x: M, y: BODY_TOP + 0.30, w: 6.15, h: 3.87 }, "figures/fp3.png");
  bullets(s, [
    { text: "六项局限主要来自方法学而非样本量 —— 逐项已有修正", b: true },
    { text: "① 探索以身体中心点落区计时　→ 改鼻尖点判定（朝向物体、≤2 cm、伴嗅闻触碰），抽 2–3 只人工双盲计时校验（ICC ≥0.80）", hi: true },
    { text: "　该判定点同时波及 DI、新物体潜伏期、分析区进入次数（三者一并降级）；总路程 / 不动时间 / 蜷缩姿态不经区域判定，仍可用", b: true, hi: true },
    "② 熟悉期原定 2 天实际执行 1 天　→ 恢复 2 天训练",
    "③ 物体种类与左右位置未平衡　→ 动物间做双重平衡",
    "④ 运行顺序与分组共线，各组距末次低氧的间隔随之不同　→ 组间交错随机，并统一「末次低氧 → 行为学」间隔",
    "⑤ 软件「活跃状态」模块参数未配置，数据无效已剔除　→ 主实验前完成阈值设定",
    "⑥ 加药组增重偏低　→ 增加摄食饮水监测，必要时设半剂量组",
    { text: "⑦ 给药与低氧不同步：低氧连续 28 d，灌胃仅工作日共 20 次（周末停药），累积剂量为标称的 71%　→ 主实验改为每日给药", hi: true },
    "⑧ 给药体积固定 100 µL/只，未按体重校正（仅在 20 g 时恰为 7.01 g/kg）　→ 按每周体重调整体积，体重纳入协变量",
    { text: "复测判读：Sham 组 DI 须显著 > 0（与 MWM 首次预试同期完成）；若仍不成立，改人工盲法计时，并以 MWM 为唯一记忆学主判据、NOR 降为次要报告", b: true },
  ], { x: M + 6.5, y: BODY_TOP + 0.30, w: W - M * 2 - 6.5, h: 3.87 }, 10);
  s.addShape(pres.ShapeType.roundRect, { x: M, y: H - 1.58, w: W - M * 2, h: 0.84, rectRadius: 0.07, fill: { color: "EDF3FA" }, line: { color: BLUE, width: 1.5 } });
  s.addText([
    { text: "按预实验预设的判读规则：", options: { fontFace: FONT, fontSize: 12, bold: true, color: BLUE } },
    { text: "决定主实验能否开展的核心指标是海马 CA1 TEM 的 ERMCS 量化 ——", options: { fontFace: FONT, fontSize: 12, color: INK } },
    { text: "该指标目前制样 / 拍照进行中，结果待判读", options: { fontFace: FONT, fontSize: 12, bold: true, color: RED } },
    { text: "（预计【填】）。行为学本轮未获支持", options: { fontFace: FONT, fontSize: 12, color: INK } },
    { text: "不构成 No-Go", options: { fontFace: FONT, fontSize: 12, bold: true, color: BLUE } },
    { text: "，但提示 NOR 流程须在主实验前完成优化，并与 MWM 首次预试同期进行。", options: { fontFace: FONT, fontSize: 12, color: INK } },
  ], { x: M + 0.2, y: H - 1.50, w: W - M * 2 - 0.4, h: 0.68, margin: 0, valign: "middle", lineSpacing: 17 });
}

// —— M13 E 总结 ——
{
  const s = darkSlide();
  pageNo += 1;
  s.addText("总　结", { x: M + 0.3, y: 0.6, w: 6, h: 0.6, margin: 0, fontFace: FONT, fontSize: 26, bold: true, color: WHITE });
  s.addText([
    { text: "一、", options: { fontFace: FONT, fontSize: 15, bold: true, color: "9FC3D8" } },
    { text: "本课题回答一个问题：慢性间歇性低氧是否通过内质网-线粒体接触点的几何重塑放大海马神经元损伤，半夏厚朴汤能否通过纠正该重塑发挥保护。\n\n", options: { fontFace: FONT, fontSize: 15, color: WHITE, breakLine: true } },
    { text: "二、", options: { fontFace: FONT, fontSize: 15, bold: true, color: "9FC3D8" } },
    { text: "采用「先结构、后组学、再因果」三层递进路径；几何改变的方向与距离-结局关系的形状均不预设，由数据判定；并预先写明什么结果会推翻本模型。\n\n", options: { fontFace: FONT, fontSize: 15, color: WHITE, breakLine: true } },
    { text: "三、", options: { fontFace: FONT, fontSize: 15, bold: true, color: "9FC3D8" } },
    { text: "已有第一作者同题机制综述与造模有效性预实验作为基础；技术路径、经费测算与风险预案明确，具备可实施性。", options: { fontFace: FONT, fontSize: 15, color: WHITE } },
  ], { x: M + 0.3, y: 1.5, w: 6.6, h: 4.6, margin: 0, valign: "top", lineSpacing: 26 });
  figImage(s, { x: M + 7.4, y: 1.5, w: W - M * 2 - 7.4, h: 4.6 }, "figures/f35.png");
  s.addText(String(pageNo), { x: W - M - 0.9, y: H - 0.62, w: 0.9, h: 0.32, margin: 0, fontFace: FONT, fontSize: 10, color: "7FB3CC", align: "right" });
  s.addNotes("【约 25 s】三句话念完即可，不要加内容。念完停一拍，让评委把页面看完，再进致谢。");
}

// —— M14 致谢 ——
{
  const s = darkSlide();
  pageNo += 1;
  s.addText("恳请各位专家批评指正", { x: 0, y: 2.9, w: W, h: 0.9, margin: 0, fontFace: FONT, fontSize: 34, bold: true, color: WHITE, align: "center" });
  s.addText("感谢导师与各共享实验平台的支持", { x: 0, y: 3.95, w: W, h: 0.5, margin: 0, fontFace: FONT, fontSize: 15, color: "9FC3D8", align: "center" });
  s.addNotes("汇报结束。进入提问环节后，按下一页索引调出对应备用页。");
}

// —— M15 备用页索引 ——
{
  const s = contentSlide({
    title: "备用页索引", lead: "以下均不在 6 分钟汇报中展示，提问时按页码直接跳转（放映时输入页码 + 回车）",
    notes: "自己汇报前务必把这一页的页码背熟或打印出来放手边。最常被问的是 TEM 指标定义（B3）、样本量测算（B4）、统计伪重复问题（备用页统计与质控汇总）与预实验 NOR 内部效度。",
  });
  cards(s, [
    { tag: "A 选题依据", head: "P16–P22", body: "临床问题 · 平面化困境 · 切入点 · 科学假说全文（表述纪律三条）· 创新点与可行性 · 理论意义与应用价值 · 预期成果 L1–L4", tagColor: TEAL, headColor: TEAL, headSize: 15, bodySize: 11 },
    { tag: "B 研究方法", head: "P23–P37", body: "动物模型与三队列 · 队列 C 设计理由 · 振荡接触模型 · BHD 制备与剂量 · 模块一至四各论 · TEM SOP · PLA · TMT 组学 · 组学决策树 · EML 距离梯度 · 核心逻辑与统计设计 · 统计与质控汇总 · 竞争模型与证伪标准 · 完整风险表 · 12 个月进度表", tagColor: NAVY, headColor: NAVY, headSize: 15, bodySize: 11 },
    { tag: "C 研究条件", head: "P38–P39", body: "平台与技术条件全表 · 经费概算与落实路径（含预算构成图）", tagColor: GOLD, headColor: GOLD, headSize: 15, bodySize: 11 },
    { tag: "D 文献与研究基础", head: "P40–P48", body: "检索策略 · 研究进展时间轴 · 核心分歧详解 · BHD 进展与不足 · 预实验四页（造模 / 运动与动机 / NOR / 局限）· 后续预实验计划 P1–P6", tagColor: RED, headColor: RED, headSize: 15, bodySize: 11 },
    { tag: "B1–B10 补充资料", head: "P49–P58", body: "完整参考文献 · 造模参数与 SpO₂ 监测 · TEM 五指标定义与公式 · 样本量与设计效应测算 · EML 质粒清单与获取路径 · 抗体核查表 · 组学决策树八情形 · 伦理与数据管理 · 经费明细 · 公开数据集横向比较", tagColor: MUTED, headColor: MUTED, headSize: 15, bodySize: 11 },
    { tag: "最常被追问", head: "六处预演答案", body: "① 实验单位是动物不是接触点（伪重复）\n② 2D TEM 与 3D EM 的取舍\n③ Sham 组 DI 不显著，这批数据还能用吗\n④ 几何是起因还是放大环节\n⑤ 队列 C 为什么不设加药组\n⑥ 经费来源与伦理批件到位情况", tagColor: RED, headColor: INK, headSize: 15, bodySize: 10.5, fill: "FBEEEC", line: "E8C4BE" },
  ], { x: M, y: BODY_TOP + 0.28, w: W - M * 2, h: BODY_H - 0.28 }, { cols: 3, gap: 0.28 });
}

// ============================================================
// 备用页（不讲，供答辩提问时调出）
// ============================================================
BACKUP = true;

// —— 3 临床问题 ——
{
  const s = contentSlide({
    title: "临床问题：阻塞性睡眠呼吸暂停相关认知障碍", mod: "A", modLabel: "A 选题依据",
    notes: "3 分钟部分的第一页。要点是治疗缺口：CPAP 只解决气道阻塞，对已形成的神经损伤逆转有限。注意口径：CIH 是 OSA 的重要成分，不是其完整实验替代——被问到时要能答。",
  });
  bullets(s, [
    "OSA 全球负担大，但认知损害在不同队列与神经心理域间高度异质",
    "CIH 是 OSA 的核心病理生理成分，但不是其完整的实验替代",
    "海马对反复低氧-复氧高度敏感：空间学习记忆下降、CA1 突触可塑性受损",
    { text: "即便去除缺氧刺激，认知恢复并不完全 → 有结构与分子基础", b: true },
    { text: "CPAP 纠正气道阻塞，对已成神经损伤逆转有限，且依从性问题突出", hi: true },
    { text: "→ 治疗缺口：需要从损伤机制层面寻找上游干预靶点", b: true },
  ], { x: M, y: BODY_TOP, w: 6.6, h: BODY_H });
  figImage(s, { x: M + 6.95, y: BODY_TOP, w: W - M * 2 - 6.95, h: BODY_H }, "figures/f03.png");
}


// —— 4 平面化困境 ——
{
  const s = contentSlide({
    title: "现有机制研究的「平面化」困境", mod: "A", modLabel: "A 选题依据",
    notes: "这一页是为切入点一页做铺垫。核心一句：现有研究回答了『发生了什么』，没回答『从何处启动、为何在特定细胞器区域被放大』。",
  });
  bullets(s, [
    "现有机制集中于氧化应激、神经炎症、线粒体功能障碍、铁代谢紊乱、突触可塑性",
    "多数研究停留在终末效应层面：测到了标志物的变化",
    { text: "但未回答：损伤从何处启动？为何在特定细胞器区域被放大？", b: true, hi: true },
    "亚细胞器空间结构层面的认识不足",
    "而 ERMCS 恰好同时参与脂质转运、钙交换、线粒体动力学与应激信号",
  ], { x: M, y: BODY_TOP, w: 6.6, h: BODY_H });
  figImage(s, { x: M + 6.95, y: BODY_TOP, w: W - M * 2 - 6.95, h: BODY_H }, "figures/f04.png");
}


// —— 5 切入点 ——
{
  const s = contentSlide({
    title: "切入点：两条公开证据的衔接", mod: "A", modLabel: "A 选题依据",
    lead: "★ 立论基于近年公开发表的前沿证据，而非课题组既有数据——这一点在开题报告正文中已明确声明",
    notes: "务必讲清『空间首发热点』与『时间起始事件』的区别。Sassano 2025 证明的是空间热点；在时间上局部过氧化先于接触扩张。这个区分是本课题与综述口径一致的关键，也是最容易被追问的一点。",
  });
  bullets(s, [
    { text: "证据一：CIH 海马损伤的脂质过氧化—铁代谢—GPX4/ACSL4 级联已有较充分文献支持", b: true },
    { text: "证据二：Sassano 2025 Nat Cell Biol 证实 ERMCS 是磷脂过氧化的空间首发热点", b: true },
    "两条证据衔接 → 提出以 ERMCS 为切入点解释 CIH 海马损伤",
    { text: "关键补注：在该研究中，局部磷脂氢过氧化物在时间上先于可测的接触扩张", hi: true },
    { text: "故几何更宜理解为脂质过氧化「传播与放大」的控制变量，而非时间起始事件", hi: true, b: true },
  ], { x: M, y: BODY_TOP + 0.3, w: 6.6, h: BODY_H - 0.3 });
  figImage(s, { x: M + 6.95, y: BODY_TOP + 0.3, w: W - M * 2 - 6.95, h: BODY_H - 0.3 }, "figures/f05.png");
}


// —— 12 科学假说 ——
{
  const s = contentSlide({
    title: "科学假说", mod: "A", modLabel: "A 选题依据",
    notes: "表述纪律是本页的核心，也是与已完成综述保持口径一致的关键。若被问『你到底认为几何是不是起因』——答：这正是本课题要判定的问题之一，判据来自队列 C。",
  });
  bullets(s, [
    { text: "CIH 反复低氧-复氧暴露 → 海马 CA1 锥体神经元 ERMCS 几何病理性重塑（方向不预设）", b: true },
    "→ 形成更易发生磷脂过氧化的脂质微域 → 放大神经元损伤 → 海马依赖性认知障碍",
    { text: "BHD 通过使 ERMCS 几何趋向 Sham 水平，降低脂质过氧化敏感性，并经由无偏组学判定的下游通路发挥保护", b: true },
  ], { x: M, y: BODY_TOP, w: 7.2, h: 1.7 }, 14);
  s.addShape(pres.ShapeType.roundRect, { x: M, y: BODY_TOP + 1.85, w: 7.2, h: 2.62, rectRadius: 0.07, fill: { color: "FBEEEC" }, line: { color: RED, width: 1 } });
  s.addText([
    { text: "★ 表述纪律（与课题组综述一致）\n", options: { fontFace: FONT, fontSize: 13, bold: true, color: RED, breakLine: true } },
    { text: "① 空间上：ERMCS 是磷脂过氧化的首发热点与反应微域\n", options: { fontFace: FONT, fontSize: 12.5, color: INK, breakLine: true } },
    { text: "② 时间上：局部过氧化可先于接触扩张 → 几何控制「传播与放大」，不主张其为起始事件\n", options: { fontFace: FONT, fontSize: 12.5, color: INK, breakLine: true } },
    { text: "③ driver 与 amplifier 之争本身是本课题待判定的问题之一，判据来自队列 C 的周期内时点", options: { fontFace: FONT, fontSize: 12.5, color: INK } },
  ], { x: M + 0.2, y: BODY_TOP + 1.96, w: 6.8, h: 2.44, margin: 0, valign: "top", lineSpacing: 18 });
  s.addText("末端环节的充分性证据：Hambright 2017 —— 成年前脑神经元 Gpx4 条件敲除即产生 MWM 空间学习记忆缺陷与海马神经退行", {
    x: M, y: BODY_TOP + 4.62, w: 7.2, h: 0.5, margin: 0, fontFace: FONT, fontSize: 11.5, color: MUTED, lineSpacing: 17,
  });
  figImage(s, { x: M + 7.55, y: BODY_TOP, w: W - M * 2 - 7.55, h: BODY_H }, "figures/f12.png");
}


// —— 31 创新点与可行性 ——
{
  const s = contentSlide({
    title: "创新点与可行性分析", mod: "A", modLabel: "A 选题依据",
    notes: "第 2 条（振荡接触模型）是最具原创性的一条，若时间紧只讲这一条。可行性四点讲快。",
  });
  bullets(s, [
    { text: "① 首次在哺乳动物在体 CIH 海马中检验 ERMCS 几何的因果作用", b: true },
    "　确立其为脂质过氧化传播与放大的结构性控制变量；既有机制证据均来自非 CIH 细胞体系",
    { text: "② 提出并检验「振荡接触」模型，尝试调和文献中相互矛盾的终点观察", b: true, hi: true },
    "　基于氧限制的链式反应，设周期内取材时点，与慢性时点构成急性-慢性对照",
    { text: "③ 首次将 BHD 的神经保护与 ERMCS 结构重塑相联系，并预设严格的依赖性判据", b: true },
    "　G9 vs G6 即「几何被独立操控后保护是否仍存在」这一判据的直接实现",
    { text: "④ 首次将 EML 距离梯度工具用于中枢神经系统药理学，且不预设剂量-反应形状", b: true },
    { text: "⑤ 建立多层级证据体系并预先锁定统计终点层级", b: true },
    "　形态学 + 邻近检测 + 组学 + 距离梯度因果操控；以动物为生物学重复的嵌套模型",
  ], { x: M, y: BODY_TOP, w: 7.8, h: BODY_H }, 12);
  cards(s, [
    { tag: "可行性 ①", head: "临床问题明确", body: "CIH 与认知障碍关系清晰，评价终点有现实意义", tagColor: TEAL, headSize: 12.5, bodySize: 11 },
    { tag: "可行性 ②", head: "理论支点新颖扎实", body: "有一手核实的前沿证据与自建的可证伪框架", tagColor: TEAL, headSize: 12.5, bodySize: 11 },
    { tag: "可行性 ③", head: "分层设计降低风险", body: "先结构、后组学、再因果，避免全链条同时失败", tagColor: TEAL, headSize: 12.5, bodySize: 11 },
    { tag: "可行性 ④", head: "平台与经费已落实", body: "关键质粒可商购，四级获取路径已备", tagColor: TEAL, headSize: 12.5, bodySize: 11 },
  ], { x: M + 8.15, y: BODY_TOP, w: W - M * 2 - 8.15, h: BODY_H }, { cols: 1, gap: 0.12 });
}


// —— 6 理论意义 / 应用价值 / 预期目标 ——
{
  const s = contentSlide({
    title: "理论意义 · 应用价值 · 预期目标", mod: "A", modLabel: "A 选题依据",
    notes: "A 组四项细目在此收口。预期成果不要说过头：SCI 论文 ≥1 篇是稳妥表述。",
  });
  cards(s, [
    { tag: "理论意义", head: "从通路验证推进到\n亚细胞器互作微环境", body: "把 CIH 海马损伤的解释层级，从并列的分子通路提升到细胞器接触几何这一空间层面", tagColor: TEAL },
    { tag: "应用价值", head: "上游干预新靶点 ＋\n中医药现代机制依据", body: "为 OSA 相关认知障碍提供结构层面的干预方向；为半夏厚朴汤的临床再评价与二次开发提供实验依据", tagColor: TEAL },
    { tag: "预期目标", head: "博士论文主体 ＋\nSCI 论文 ≥1 篇", body: "形成「表型—结构—组学—因果验证」一体化证据链；为后续基金申报奠定基础", tagColor: TEAL },
  ], { x: M, y: BODY_TOP, w: W - M * 2, h: BODY_H - 0.4 }, { cols: 3, gap: 0.3 });
}


// —— 34 预期成果 ——
{
  const s = contentSlide({
    title: "预期目标与成果形式", mod: "A", modLabel: "A 选题依据",
    notes: "L1 是必胜底：即使 L2–L4 都不理想，BHD 逆转 CIH-ERMCS 病理重塑本身仍可独立成文。这一层设计是可行性的核心保障。",
  });
  cards(s, [
    { tag: "L1 · 必胜底", head: "结构层面的表型证据", body: "明确 CIH 海马损伤是否伴随 ERMCS 几何重塑，以及 BHD 的逆转效应。即使后续模块受挫，本层可独立成文", tagColor: TEAL },
    { tag: "L2 · 机制深度", head: "下游执行通路锁定", body: "通过 CA1 子区 TMT 组学锁定与 ERMCS 相关的关键下游通路，为后续深入奠定基础", tagColor: TEAL },
    { tag: "L3 · 因果性", head: "距离梯度因果链", body: "建立 EML 距离梯度体外验证体系，证明 ERMCS 膜间距与损伤程度、药物效应存在因果联系", tagColor: NAVY },
    { tag: "L4 · 最理想", head: "完整机制模型", body: "L1+L2+L3 叠加下游通路确证，形成「几何—过氧化—损伤—干预」闭环", tagColor: NAVY },
  ], { x: M, y: BODY_TOP, w: 8.4, h: BODY_H }, { cols: 2, gap: 0.28 });
  bullets(s, [
    { text: "成果形式", b: true },
    "形成博士学位论文主体研究内容",
    "力争发表高质量 SCI 论文 1 篇以上",
    "第一作者机制综述一篇（已完成初稿，拟投稿）",
    "为后续基金申报与成果转化提供依据",
  ], { x: M + 8.75, y: BODY_TOP + 0.2, w: W - M * 2 - 8.75, h: BODY_H - 0.2 }, 12.5);
}


// —— 16 动物模型与三队列 ——
{
  const s = contentSlide({
    title: "动物模型、分组与三队列设计", mod: "B", modLabel: "B 研究方法",
    notes: "队列 B 不做行为学是为了避免应激干扰组学，这一点要主动说。总动物数 52 只 + 15% 备用 = 购买 60 只，与预算页对得上。",
  });
  bullets(s, [
    { text: "造模：21% O₂ →（30 s 内降至）7.5±0.5% O₂ →（30 s 内回升）21%，1 cycle/min", b: true },
    "每日 10:00–16:00 共 6 h，持续 6 周；Sham 组同舱同时段、维持常氧",
    "每周 SpO₂ 抽测（每组 2–3 只）；W3 中期抽检海马 4-HNE 与 Fe²⁺",
    { text: "三组：Sham（常氧＋生理盐水）／ CIH（＋生理盐水）／ CIH+BHD（7.01 g/kg/d 灌胃）", b: true },
  ], { x: M, y: BODY_TOP, w: W - M * 2, h: 1.62 }, 12.5);
  table(s, ["队列", "分组与样本量", "取材时点", "主要读出"], [
    [{ t: "队列 A", b: true }, "Sham / CIH / CIH+BHD，n=8/组，共 24 只", "行为学结束后（末次暴露后约 7–10 d）", "MWM、NOR、TEM、PLA、WB、生化、IHC"],
    [{ t: "队列 B", b: true }, "Sham / CIH / CIH+BHD，n=4/组，共 12 只", "CIH 结束次日晨（不做行为学，避免应激干扰组学）", "CA1 显微切割 ＋ TMT 16-plex 蛋白组学"],
    [{ t: "队列 C", b: true, hi: true }, { t: "Sham / CIH，n=8/组，共 16 只", hi: true }, { t: "W6 末次低氧-复氧循环的复氧相结束即刻", hi: true, b: true }, { t: "TEM、PLA、4-HNE —— 周期内急性时点证据", hi: true }],
  ], { x: M, y: BODY_TOP + 1.75, w: W - M * 2 }, [1.3, 3.5, 4.2, 5.23]);
  s.addText("总动物数 52 只（24 + 12 + 16），考虑 15% 备用后计划购买 60 只", {
    x: M, y: H - 1.35, w: W - M * 2, h: 0.36, margin: 0, fontFace: FONT, fontSize: 12.5, bold: true, color: NAVY, valign: "middle",
  });
}


// —— 17 队列 C 设计理由 ——
{
  const s = contentSlide({
    title: "队列 C 为什么改为「周期内取材」", mod: "B", modLabel: "B 研究方法",
    notes: "先讲统计学理由（30 秒），再翻到下一页讲化学理由——那才是真正有分量的。",
  });
  bullets(s, [
    { text: "原设计：W2 / W4 / W6 三个时点，各 n=4", b: true },
    "问题：三个时点均属慢性暴露阶段，结果高度冗余；且各仅 n=4，功效不足",
    { text: "现设计：Sham 与 CIH 两组各 n=8，在单次低氧-复氧循环的复氧相结束即刻灌注取材", b: true, hi: true },
    "与队列 A 的 W6 慢性时点构成「急性 vs 慢性」对照",
    "可检验：接触几何是否随每次复氧发生瞬变，并在慢性期发生漂移",
    { text: "实施提示：须在 6 h 暴露窗口内完成灌注，事前与电镜平台协调档期", b: true },
    "Sham 组在同一时钟时点取材，以配平昼夜节律",
  ], { x: M, y: BODY_TOP, w: 7.0, h: BODY_H }, 13.5);
  figImage(s, { x: M + 7.35, y: BODY_TOP, w: W - M * 2 - 7.35, h: BODY_H }, "figures/f17.png");
}


// —— 17b 振荡接触模型 ——
{
  const s = contentSlide({
    title: "振荡接触模型：队列 C 的理论依据", mod: "B", modLabel: "B 研究方法",
    lead: "★ 本课题最具原创性的设计依据 —— 来自课题组已完成综述提出的模型",
    notes: "全场最值得讲透的一页，约 45 秒。核心一句：缺氧相在攒底物，复氧相才真正开始烧。所以决定损伤的不是平均氧分压，而是复氧转换的次数和陡度——这恰好就是 CIH 与持续低氧的区别。讲稿全文见 docs/综述整合到PPT.md §6。",
  });
  figImage(s, { x: M, y: BODY_TOP + 0.3, w: 6.5, h: BODY_H - 0.3 }, "figures/f17b.png");
  s.addShape(pres.ShapeType.roundRect, { x: M + 6.85, y: BODY_TOP + 0.3, w: W - M * 2 - 6.85, h: 1.15, rectRadius: 0.07, fill: { color: LIGHT }, line: { color: "DDE4E9", width: 1 } });
  s.addText([
    { text: "模型　", options: { fontFace: FONT, fontSize: 12, bold: true, color: NAVY } },
    { text: "每次复氧产生瞬时的接触范围/通量脉冲；数周后氧化损伤、系链周转与线粒体碎裂使稳定耦合基线下移 → 急性扩张与慢性破坏是同一过程的两个时间投影", options: { fontFace: FONT, fontSize: 12, color: INK } },
  ], { x: M + 7.0, y: BODY_TOP + 0.4, w: W - M * 2 - 7.15, h: 0.95, margin: 0, valign: "middle", lineSpacing: 18 });
  bullets(s, [
    { text: "论证一（钙与氧化物转移）：复氧相重复提供跨接触转移的机会", b: true },
    { text: "论证二（氧限制的链式反应 · 第一性原理）：", b: true, hi: true },
    "　磷脂过氧化的传播是自由基链式反应，在过氧自由基步骤消耗分子氧 → 组织氧下降时速率受限",
    "　Minikes 2025：低氧适应细胞抗铁死亡，且不走经典 PHD–HIF 轴——低氧抑制 KDM6A → 下调 ACSL4/ETNK1",
    { text: "→ 缺氧相攒底物，复氧相才允许链式反应发生", b: true, hi: true },
    { text: "→ 支配变量是复氧转换的次数与陡度，而非平均氧张力（这正是 CIH 区别于持续低氧之处）", b: true },
    "可检验预测：累积低氧剂量相同时，少而长的循环应比多而短的循环产生更少的磷脂过氧化",
  ], { x: M + 6.85, y: BODY_TOP + 1.65, w: W - M * 2 - 6.85, h: BODY_H - 1.65 }, 10.5);
}


// —— 18 BHD 制备、质控与剂量 ——
{
  const s = contentSlide({
    title: "半夏厚朴汤制备、质控与剂量依据", mod: "B", modLabel: "B 研究方法",
    notes: "剂量出处要讲清：7.01 g/kg 是文献三剂量梯度中的中剂量，且在两项独立研究中均为最优——不是我们自己定的。",
  });
  bullets(s, [
    { text: "组成：制半夏 12 g、厚朴 9 g、茯苓 12 g、生姜 15 g、紫苏叶 6 g（共 54 g）", b: true },
    "制备：10 倍量水浸泡 30 min → 武火煮沸后文火 30 min → 滤过；药渣 8 倍量水复煎 20 min → 合并滤液",
    "水浴浓缩至生药浓度 1.4 g/mL；每批留样 5 mL，−80 ℃ 保存",
    { text: "批次质控：每批煎剂 HPLC 指纹图谱（C18 柱，乙腈-水梯度），重点定量和厚朴酚与厚朴酚", b: true },
    { text: "批间和厚朴酚浓度 CV ≤ 15%", b: true, hi: true },
    { text: "剂量 7.01 g/kg/d 的出处：", b: true },
    "　文献三剂量梯度（3.51 / 7.01 / 14.02 g/kg）中的中剂量",
    "　且在 Song 2022（心功能）与 Yang 2024（神经行为）两项独立研究中均为最优剂量",
  ], { x: M, y: BODY_TOP, w: 7.4, h: BODY_H }, 13);
  figImage(s, { x: M + 7.75, y: BODY_TOP, w: W - M * 2 - 7.75, h: BODY_H }, "figures/f18.png");
}


// —— 19 模块一 表型与形态学 ——
{
  const s = contentSlide({
    title: "模块一：表型与 ERMCS 形态学量化", mod: "B", modLabel: "B 研究方法",
    lead: "行为学方案依预实验结果作了修订（详见备用页 · 预实验局限与优化）",
    notes: "终点三级分层是 B 组的关键得分点，必须单独成表展示，并强调『揭盲前锁定』。术语注一句话带过，但能显示功底。",
  });
  bullets(s, [
    { text: "行为学：MWM 为海马依赖性记忆主判据，NOR 为次要判据（因预实验 NOR 未建立有效读出）", b: true, hi: true },
    "　NOR 依预实验修正：鼻尖点判定探究行为、熟悉期恢复 2 天、物体与左右位置双重平衡、组间交错随机、≥20 s 预注册排除，全程双盲",
    "病理：HE、Nissl、TUNEL、IHC 三联（4-HNE / Iba1 / GFAP）",
    { text: "TEM 五指标：接触间距、ERMICC、接触覆盖率、≤10 nm 紧密接触比例、线粒体形态", b: true },
    "取样量依嵌套数据设计效应测算：ICC=0.2 时每动物约 40 次测量后信息量饱和 → 5–8 神经元 × ≥8 线粒体",
  ], { x: M, y: BODY_TOP + 0.28, w: 6.6, h: 2.62 }, 11.5);
  table(s, ["层级", "指标", "检验水准"], [
    [{ t: "主要终点（唯一）", b: true, hi: true }, { t: "ERMICC_std", b: true }, { t: "双侧 α = 0.05", b: true }],
    ["关键次要终点", "接触覆盖率、平均最小膜间距", "Bonferroni，α = 0.025"],
    ["探索性终点", "≤10 nm 紧密接触比例、ERMICC_tcw、线粒体形态", "BH-FDR，须显式标注"],
  ], { x: M, y: BODY_TOP + 3.05, w: 6.6 }, [1.75, 3.15, 1.7]);
  s.addText("★ 五个指标须于揭盲前锁定层级", { x: M, y: H - 1.28, w: 6.6, h: 0.3, margin: 0, fontFace: FONT, fontSize: 12, bold: true, color: RED });
  figImage(s, { x: M + 6.95, y: BODY_TOP + 0.28, w: W - M * 2 - 6.95, h: BODY_H - 0.98 }, "figures/f19.png");
  s.addText("术语：ERMCS 指纳米级结构接触，MAM 保留给生化富集组分 —— 分离结果不得当作接触几何的测量证据", {
    x: M + 6.95, y: H - 1.28, w: W - M * 2 - 6.95, h: 0.55, margin: 0, fontFace: FONT, fontSize: 10.5, color: MUTED, lineSpacing: 15,
  });
}


// —— 20 TEM SOP ——
{
  const s = contentSlide({
    title: "模块一：TEM 取材固定 SOP 与偏倚控制", mod: "B", modLabel: "B 研究方法",
    notes: "『全组配平铁律』是本页要留在评委脑子里的一句话。若被问 2D vs 3D EM，转到备用页风险表的 S1 主动交代。",
  });
  bullets(s, [
    { text: "灌注固定是决定性步骤，优先级高于后固定延迟；逐只记录灌注是否达标", b: true },
    "缓冲液优选 0.1 M 二甲砷酸钠替代 PBS；渗透压控制在 300–330 mOsm；加 1–2 mM CaCl₂ 稳定膜",
    "取材后 ≤24 h 内完成 OsO₄ 后固定；若必须延迟，洗去高浓度戊二醛后转存稀固定液，4 ℃ 密封",
    { text: "★ 全组配平铁律：三组必须同批次、同储存时长处理，严禁某组先做另一组后做", b: true, hi: true },
    "系统随机取样（随机起点 + 固定间隔），不得由观察者挑选神经元",
    { text: "线粒体纳入标准不得按「是否有明显接触」筛选", b: true },
    "逐只记录戊二醛储存天数，纳入混合模型作协变量",
    "图像采集与 ImageJ 定量全程双盲；两人独立定量，差异 >15% 引入第三方仲裁",
  ], { x: M, y: BODY_TOP, w: 7.4, h: BODY_H }, 13);
  figImage(s, { x: M + 7.75, y: BODY_TOP, w: W - M * 2 - 7.75, h: BODY_H }, "figures/f20.png");
}


// —— 21 PLA ——
{
  const s = contentSlide({
    title: "模块一：原位 PLA 与抗体验证", mod: "B", modLabel: "B 研究方法",
    lead: "换抗体与设对照都是在下单前完成的核查 —— 这本身就是前期准备的一部分",
    notes: "这一页看起来是技术细节，但它是『方法学准备充分』最有力的证据之一。主动讲，别等被问。",
  });
  bullets(s, [
    { text: "分子对：IP3R1 × VDAC1/VDAC3；试剂盒 Duolink DUO92101（Mouse/Rabbit）", b: true },
    "ER 侧一抗：Proteintech 19962-1-AP（兔多抗，未偶联）",
    { text: "更换理由：原拟用的 ab5804 官方反应种属不含小鼠、验证应用不含 WB，与本课题 C57BL/6J 小鼠及 WB 需求不匹配", hi: true },
    "19962-1-AP 反应种属含人/小鼠/大鼠，验证应用含 IHC、WB、FC、IP（观察分子量 290–300 kDa）",
    { text: "★ mouse-on-mouse 背景问题：VDAC1 一抗为鼠源、组织亦为小鼠脑，探针会结合内源性 IgG", b: true, hi: true },
    "　→ 必用 M.O.M. 阻断试剂；设「省略一抗」与「仅加单一支一抗」对照，与实验样本同批处理",
    { text: "指标严格表述为「IP3R1 与 VDAC1/VDAC3 的邻近信号」（ab14734 同时识别 VDAC1 与 VDAC3）", b: true },
    "共聚焦：CA1 锥体层每只 5 视野，计数 dots per cell，全程双盲",
  ], { x: M, y: BODY_TOP + 0.28, w: 7.4, h: BODY_H - 0.28 }, 12.5);
  figImage(s, { x: M + 7.75, y: BODY_TOP + 0.28, w: W - M * 2 - 7.75, h: BODY_H - 0.28 }, "figures/f21.png");
}


// —— 22 TMT 组学 ——
{
  const s = contentSlide({
    title: "模块二：CA1 子区 TMT 蛋白组学", mod: "B", modLabel: "B 研究方法",
    notes: "双轴生信是本页重点：第一轴问『ERMCS 相关蛋白是否被富集』，第二轴问『下游是哪条通路』。两轴分开讲。",
  });
  bullets(s, [
    { text: "样本：队列 B 12 只，CIH 结束次日晨集中处理", b: true },
    "冰冻切片 20 μm，解剖镜下显微切割 CA1（每只 ≥3 mg），液氮速冻",
    { text: "TMT 16-plex：12 个生物学样本 + 4 个 pooled QC 通道", b: true },
    "质谱：Orbitrap Exploris 480 / Q-Exactive HF-X；FDR<1%；蛋白鉴定 ≥6000",
    "差异筛选阈值：|FC| > 1.2 且 P < 0.05",
    { text: "★ 双轴生信解读：", b: true, hi: true },
    "　第一轴 — ERMCS 富集分析（GO:0044233 + Sassano 2025 基因集 + MCSdb）",
    "　第二轴 — 六类下游通路 GSEA（铁死亡 / 凋亡 / 自噬 / 突触 / 炎症 / 线粒体）",
    "PPI 网络（STRING + Cytoscape），cytoHubba 计算 HUB 蛋白；与已发表 CIH-海马组学数据集横向比较",
  ], { x: M, y: BODY_TOP, w: 7.4, h: BODY_H }, 12.5);
  figImage(s, { x: M + 7.75, y: BODY_TOP, w: W - M * 2 - 7.75, h: BODY_H }, "figures/f22.png");
}


// —— 23 决策会议与决策树 ——
{
  const s = contentSlide({
    title: "M6 方向决策会议与决策树", mod: "B", modLabel: "B 研究方法",
    lead: "依据 ERMCS 形态学与组学结果共同决定下游深挖方向 —— 全课题的关键节点",
    notes: "情形 G 与情形 H 是本页必讲的两条。特别是 G：阴性亦为结论，不得反复调参直到出现差异——这句话主动说出来，评委会记住。",
  });
  table(s, ["情形", "ERMCS 表现", "组学富集最强通路", "深挖方向"], [
    ["A–F", "CIH 显著改变 + BHD 显著逆转", "铁死亡 / 凋亡 / 自噬 / 突触 / 炎症", "按富集最强通路展开，配合距离梯度因果链"],
    [{ t: "G（阴性）", b: true, hi: true }, { t: "CIH 与 Sham 间无显著差异", hi: true }, "—", { t: "阴性亦为结论，如实报告；转向预设的 CA3/DG 次要脑区。不得以反复调参直至出现差异的方式处理", hi: true, b: true }],
    [{ t: "H（反方向）", b: true, hi: true }, { t: "CIH 显著减小接触", hi: true }, "任一通路", { t: "叙事改为「CIH 使 ERMCS 解偶联 / BHD 恢复接触」；配合队列 C 可提出「急性扩张 + 慢性破坏」时程依赖模型", hi: true, b: true }],
  ], { x: M, y: BODY_TOP + 0.28, w: W - M * 2 }, [1.5, 2.9, 2.7, 5.13]);
  figImage(s, { x: M, y: BODY_TOP + 3.05, w: W - M * 2, h: BODY_H - 3.25 }, "figures/f23.png");
}


// —— 24 EML 距离梯度 ——
{
  const s = contentSlide({
    title: "模块三：EML 距离梯度因果验证", mod: "B", modLabel: "B 研究方法",
    notes: "强调统计单位：独立实验次数才是 n，复孔只降技术噪声。这是细胞实验最常被挑的点。",
  });
  bullets(s, [
    { text: "细胞与模型：HT22 永生化海马神经元；H/R（1% O₂ 4 h → 复氧 12 h）体外模拟 CIH", b: true },
    "工具：EML（ER-Mitochondria Linker）系列，Lim 实验室存放于 Addgene，15 / 20 / 30 nm 三档可公开商购",
    "以 myosin-VI 刚性单 α-helix 为 spacer，将 ER-OMM 距离固定于目标值",
    "转染效率 ≥40%（mRFP⁺ 计数验证）；FACS 分选 mRFP⁺ 细胞后进行 H/R",
    { text: "★ 10 组设计；每组 3 复孔 × ≥4 次独立实验", b: true, hi: true },
    { text: "　独立实验次数才是统计单位，复孔仅用于降低技术噪声、不计入 n", hi: true },
    { text: "五维读出：", b: true },
    "　① CCK-8 / LDH　② IP3R1-VDAC1/VDAC3 PLA 验证 EML 实际工作　③ BODIPY 581/591 C11 + Liperfluo",
    "　④ 依组学结果选 1–2 条通路指标　⑤ mRFP 荧光共定位",
  ], { x: M, y: BODY_TOP, w: 7.3, h: BODY_H }, 12.5);
  figImage(s, { x: M + 7.65, y: BODY_TOP, w: W - M * 2 - 7.65, h: BODY_H }, "figures/f24.png");
}


// —— 25 核心逻辑与统计设计 ——
{
  const s = contentSlide({
    title: "模块三：核心科学逻辑与统计设计", mod: "B", modLabel: "B 研究方法",
    lead: "★ 距离-结局关系的形状不作预设 —— 这正是本模块要回答的问题",
    notes: "最后一条呼应必须讲出来：综述里提判据、课题里做验证，连成闭环。这是全场最能体现研究者连续思考的一处。",
  });
  bullets(s, [
    { text: "① 形状不预设。", b: true, hi: true },
    "　Dematteis 2024（EML 工具原始论文）报告距离与钙转移/氧化代谢呈钟形、峰值约 20 nm；Csordas 2010 独立报告双相效应并提示存在最优间隙宽度",
    { text: "　但铁死亡易感性是否同样呈钟形，尚无任何研究在距离梯度上验证过 —— 这正是本实验要回答的问题", b: true },
    "　两步检验：omnibus ANOVA/K-W 检验整体效应 → 同一模型内并列拟合线性对比与二次对比并同时报告",
    "　若真实关系为钟形而检验假定单调，两端效应相互抵消、功效趋近于零",
    { text: "② BHD 是否依赖 ERMCS 几何？", b: true, hi: true },
    "　预设单一成对比较：G9（H/R + 30 nm-EML + BHD）vs G6（H/R + 30 nm-EML），双侧，Bonferroni α = 0.025",
    "　距离 × BHD 交互检验所需样本量约为主效应的 4 倍，功效不足 → 降级为探索性并明确标注",
  ], { x: M, y: BODY_TOP + 0.28, w: 7.5, h: 3.9 }, 11);
  s.addShape(pres.ShapeType.roundRect, { x: M, y: BODY_TOP + 4.2, w: 7.5, h: 0.95, rectRadius: 0.07, fill: { color: "FBEEEC" }, line: { color: RED, width: 1 } });
  s.addText([
    { text: "★ 必讲的呼应：", options: { fontFace: FONT, fontSize: 12.5, bold: true, color: RED } },
    { text: "课题组综述 §8.1 提出，任何针对 ERMCS 的治疗主张都必须检验「当几何被独立操控后保护是否仍存在」—— G9 vs G6 正是这一判据的直接实现。", options: { fontFace: FONT, fontSize: 12.5, color: INK } },
  ], { x: M + 0.18, y: BODY_TOP + 4.3, w: 7.15, h: 0.75, margin: 0, valign: "middle", lineSpacing: 19 });
  figImage(s, { x: M + 7.85, y: BODY_TOP + 0.28, w: W - M * 2 - 7.85, h: BODY_H - 0.28 }, "figures/f25.png");
}


// —— 26 统计与质控汇总 ——
{
  const s = contentSlide({
    title: "统计学方法与质量控制汇总", mod: "B", modLabel: "B 研究方法",
    notes: "『实验单位是动物，不是接触点』这句一定要说。它同时呼应课题组综述 §7.1 的方法学要求。",
  });
  bullets(s, [
    "软件：GraphPad Prism 9.0 / R 4.3 + ggplot2；正态性 Shapiro-Wilk，方差齐性 Levene",
    "三组比较：one-way ANOVA + Tukey HSD（正态）／ Kruskal-Wallis + Dunn（非正态）",
    "时序资料：repeated-measures two-way ANOVA；多组学：Benjamini-Hochberg FDR 校正",
    { text: "★ TEM 的 ERMCS 指标采用线性混合效应模型：指标 ~ 组别 + (1 | 动物/神经元)", b: true, hi: true },
    { text: "　数据为三层嵌套（接触点 ⊂ 神经元 ⊂ 动物），实验单位是动物而非接触点", b: true },
    { text: "　报告 n 时必须报动物数，严禁以接触点数作 n —— 那构成伪重复，会低估标准误、使 P 值虚低", hi: true },
    "　预设敏感性分析：先在动物层面取均值再作组间比较，两法结论应一致；不一致以混合模型为准",
    "戊二醛储存天数纳入模型作协变量；效应量必报（Cohen's d 或 η²）；全部分析双盲编码",
  ], { x: M, y: BODY_TOP, w: 7.6, h: BODY_H }, 12.5);
  figImage(s, { x: M + 7.95, y: BODY_TOP, w: W - M * 2 - 7.95, h: BODY_H }, "figures/f26.png");
}


// —— 10b 竞争模型与证伪标准 ——
{
  const s = contentSlide({
    title: "竞争模型与证伪标准", mod: "B", modLabel: "B 研究方法",
    lead: "直接复用综述 Table 2 · 本课题采用第三行的振荡接触模型",
    notes: "这一页是 B 组『科研思维严谨』的顶级材料。最右一列是重点——主动写明什么结果会推翻自己的模型。讲稿约 30 秒，见 docs/综述整合到PPT.md §5。",
  });
  table(s, ["模型", "预测的首发事件", "接触解偶联后的预测", "什么结果会削弱它"], [
    ["Bulk ER-first", "弥散 / 分布式的 ER 磷脂过氧化", "早期 ER 氧化仍在，线粒体扩散可改变", "解偶联在 ER 整体氧化态改变之前即消除早期氧化"],
    ["Contact-amplifier", "ERMCS 亚域的局部磷脂氢过氧化物，随后接触扩张", "初始 ER 氧化可能仍在，但传播与线粒体 ROS 减少", "几何操控既不改变局部氧化，也不改变其跨细胞器传播"],
    [{ t: "Oscillatory contact（本课题采用）", b: true }, { t: "复氧相关联的接触范围或通量脉冲，叠加稳定耦合的缓慢丧失", b: true }, { t: "可诱导的、标定的解偶联可减少相位关联氧化与累积损伤", b: true }, { t: "高时间分辨成像显示跨循环与慢性暴露中几何稳定且单调", b: true, hi: true }],
  ], { x: M, y: BODY_TOP + 0.28, w: W - M * 2 }, [2.5, 3.3, 3.5, 2.93]);
  s.addText("本课题预先写明什么结果会推翻自己的模型 —— 队列 C 与 EML 距离梯度就是按最右一列的判据设计的", {
    x: M, y: H - 1.55, w: W - M * 2, h: 0.42, margin: 0,
    fontFace: FONT, fontSize: 13, bold: true, color: NAVY, valign: "middle",
  });
}


// —— 32 风险与应对 ——
{
  const s = contentSlide({
    title: "主要风险与应对措施", mod: "B", modLabel: "B 研究方法",
    lead: "下三项为方法学局限，来自本人综述第七章提出的「决定性实验」判据 —— 主动交代",
    notes: "S1–S3 三项要主动讲。统一话术：这不是遗漏，是我自己在综述里对这个领域提出的完整判据；本课题在博士学位论文的资源边界内，先完成其中可判别性最高的部分。",
  });
  table(s, ["风险 / 局限", "可能影响", "应对措施"], [
    ["CIH 未诱导明显 ERMCS 改变", "主假说受挑战", "查脑区、时点与制样质量；转 CA3/DG；阴性亦如实报告"],
    ["几何改变方向与预期相反", "叙事需调整", "情形 H 对称深挖；配合队列 C 可提出「急性扩张 + 慢性破坏」时程模型，反而更强"],
    ["EML 到货延迟或转染不足", "体外验证延期", "提前 M1 订购；联系 Lim 实验室；国内合成兜底；慢病毒 / FACS 富集"],
    ["TEM 定量者间差异较大", "数据稳定性下降", "双盲两人独立定量；差异 >15% 第三方仲裁；储存天数纳入协变量"],
    ["全雄性局限", "外推受限", "limitations 明确说明；预留雌性小队列"],
    [{ t: "BHD 7.01 g/kg/d 可能存在胃肠道反应", b: true, hi: true }, { t: "预实验中 CIH+BHD 增重低于 CIH", hi: true }, { t: "主实验增加摄食量与饮水量监测；必要时设半剂量组；剂量仍以文献最优中剂量为起点", hi: true }],
    [{ t: "S1　以 2D TEM 而非 3D / 连续切片电镜量化", b: true, hi: true }, { t: "无法获得完整三维分布，绝对值不可与外部文献硬比", hi: true }, { t: "以组间相对差异为结论依据；系统随机取样；双盲仲裁；可选高压冷冻/冷冻替代佐证。3D EM 列为后续基金方向", hi: true }],
    [{ t: "S2　队列 C 仅一个周期内时点，非完整相位序列", b: true, hi: true }, { t: "无法分辨低氧前 / 氧最低点 / 复氧早期 / 恢复后", hi: true }, { t: "定位为「首个周期内时点」，受动物数与电镜档期约束；足以回答最小判别问题，完整相位序列另行立项", hi: true }],
    [{ t: "S3　铁死亡因果依赖组学判定，无遗传操作", b: true, hi: true }, { t: "若下游确为铁死亡，因果强度弱于完整标准", hi: true }, { t: "本课题不预设下游为铁死亡；若组学指向铁死亡，再补做两种机制不同的 rescue 并同测凋亡与炎症通路", hi: true }],
  ], { x: M, y: BODY_TOP + 0.28, w: W - M * 2 }, [3.6, 3.1, 5.53]);
}


// —— 33 进度安排 ——
{
  const s = contentSlide({
    title: "研究进度安排（12 个月）", mod: "B", modLabel: "B 研究方法",
    notes: "M6 决策会议是关键节点，用醒目色标出。预实验 P1–P4 与 M1–M2 的动物到位、伦理报批、质粒订购并行，不占用主队列档期——被问「预实验会不会拖慢进度」时这样答。",
  });
  table(s, ["时间", "主要内容", "阶段里程碑"], [
    ["M1", "IACUC 报批；60 只小鼠到货；Addgene 订购 EML 质粒；预实验 P1、P2 启动", "动物到位 + 质粒订购"],
    ["M2", "队列 C 启动（复氧相取材）；质粒到货 + 测序验证；TEM 固定延迟自检", "周期内数据 + 质粒到位"],
    ["M3", "队列 A、B 启动 CIH + BHD 干预；HT22 转染条件优化", "干预启动 + 转染条件"],
    ["M4", "队列 A 行为学（MWM 主判据）；队列 B W6 取材送 TMT", "行为学 + 组学样本"],
    ["M5", "队列 A 取材；TEM / PLA 制样；组学数据采集；HT22 H/R 模型建立", "TEM + PLA + 组学原始数据"],
    [{ t: "M6", b: true, hi: true }, { t: "双轴生信分析 + 方向决策会议", b: true, hi: true }, { t: "★ 关键节点：锁定下游执行通路", b: true, hi: true }],
    ["M7–M8", "按决策会议情形执行深度通路验证", "机制验证完成"],
    ["M9", "体外 H/R + EML 距离梯度因果实验（10 组）", "距离-表型剂量响应曲线"],
    ["M10–M12", "数据整合、机制图绘制、论文撰写与投稿准备", "博士论文主体数据 + 投稿稿件"],
  ], { x: M, y: BODY_TOP, w: W - M * 2 }, [1.3, 6.5, 4.43]);
}


// —— 29 平台与技术条件 ——
{
  const s = contentSlide({
    title: "实验平台与技术条件", mod: "C", modLabel: "C 研究条件",
    notes: "把技术成熟度分级讲出来：多数是成熟技术，TEM 与组学要求高但已有降低波动的四项措施。",
  });
  table(s, ["所需平台 / 技术", "落实方式", "成熟度", "波动风险控制"], [
    ["动物实验平台、CIH 造模舱", "校内共享", { t: "成熟", b: true }, "每周 SpO₂ 抽测；双 O₂ 监测、漏气报警、紧急制氧"],
    ["行为学：NOR / MWM / 旷场", { t: "校内共享；本轮仅 NOR 完成预试", b: true, hi: true }, { t: "NOR 需复测\nMWM 待预试", b: true, hi: true }, { t: "NOR 范式修订已完成待复测；MWM 与旷场尚未预试，排入 M1；全程操作与分析双盲", hi: true }],
    ["海马病理学与免疫组化", "校内共享 + 病理科外协", { t: "成熟", b: true }, "外协 IHC 60 张，统一批次"],
    ["透射电镜", "校内共享平台（需预约档期）", { t: "要求高", b: true, hi: true }, { t: "固定 SOP、全组配平、系统随机取样、双盲定量 + 第三方仲裁", hi: true }],
    ["共聚焦显微平台（PLA）", "校内共享", { t: "成熟", b: true }, "四类对照同批处理"],
    ["蛋白组学（TMT 16-plex）", "外协成熟路径", { t: "要求高", b: true, hi: true }, { t: "单独设组学队列避免行为学应激；4 个 pooled QC 通道；CV<20%", hi: true }],
    ["分子生物学与细胞培养", "课题组 + 校内共享", { t: "成熟", b: true }, "转染效率预实验验证（P5）"],
  ], { x: M, y: BODY_TOP, w: W - M * 2 }, [3.0, 3.2, 1.35, 4.68]);
}


// —— 30 经费概算 ——
{
  const s = contentSlide({
    title: "经费概算与落实路径", mod: "C", modLabel: "C 研究条件",
    lead: "总预算 14.85 万元，严格控制在 15 万元以内",
    notes: "落实策略是本页重点：核心问题优先、拓展验证递进。这样即使经费执行有波动，主线也能保证完成。",
  });
  s.addChart(pres.ChartType.doughnut, [{
    name: "预算构成", labels: ["材料费", "测试化验加工费", "劳务费", "出版/文献费", "差旅费"],
    values: [6.95, 5.90, 1.10, 0.50, 0.40],
  }], {
    x: M, y: BODY_TOP + 0.3, w: 5.4, h: BODY_H - 0.5,
    chartColors: [NAVY, TEAL, GOLD, MUTED, "A9B8C3"],
    showLegend: true, legendPos: "b", legendFontSize: 11, legendFontFace: FONT,
    showValue: true, dataLabelFontSize: 11, dataLabelFontFace: FONT, dataLabelColor: WHITE,
    showTitle: true, title: "预算构成（万元）", titleFontSize: 13, titleFontFace: FONT, titleColor: NAVY,
    holeSize: 45,
  });
  table(s, ["科目", "金额（万元）", "主要用途"], [
    [{ t: "材料费", b: true }, { t: "6.95", b: true }, "动物、药材、抗体、试剂盒、Addgene 质粒、细胞培养耗材"],
    [{ t: "测试化验加工费", b: true }, { t: "5.90", b: true }, "TMT 组学、TEM、PLA、共聚焦机时、外协检测"],
    ["劳务费", "1.10", "研究生劳务及临时辅助工作"],
    ["出版 / 文献费", "0.50", "论文发表、文献获取与知识产权申请"],
    ["差旅费", "0.40", "学术交流与平台对接"],
    [{ t: "合计", b: true }, { t: "14.85", b: true, hi: true }, { t: "严格控制在 15 万元以内", b: true }],
  ], { x: M + 5.75, y: BODY_TOP + 0.3, w: W - M * 2 - 5.75 }, [1.85, 1.35, 3.03]);
  s.addShape(pres.ShapeType.roundRect, { x: M + 5.75, y: H - 1.75, w: W - M * 2 - 5.75, h: 1.0, rectRadius: 0.07, fill: { color: LIGHT }, line: { color: "DDE4E9", width: 1 } });
  s.addText([
    { text: "落实策略　", options: { fontFace: FONT, fontSize: 12, bold: true, color: NAVY } },
    { text: "核心问题优先（主队列 + TMT 组学 + EML 因果验证）；拓展验证递进（入脑活性成分、靶向氧化脂质组按中期结果择机启动）", options: { fontFace: FONT, fontSize: 12, color: INK } },
  ], { x: M + 5.92, y: H - 1.66, w: W - M * 2 - 6.1, h: 0.82, margin: 0, valign: "middle", lineSpacing: 18 });
}


// —— 7 文献检索策略 ——
{
  const s = contentSlide({
    title: "文献检索策略与范围", mod: "D", modLabel: "D 文献综述",
    lead: "该检索已形成一篇第一作者综述（即备用页所附第一作者综述）",
    notes: "D 组『文献查阅情况』的得分要件。检索式必须能当场复述。若被问命中篇数与精读篇数，须填真实数字，不得估算。",
  });
  bullets(s, [
    { text: "数据库：PubMed + Web of Science，建库至 2026 年 7 月", b: true },
    "四组检索词交叉：",
    "　暴露 — intermittent hypoxia / obstructive sleep apnea",
    "　死亡程序 — ferroptosis / lipid peroxidation / GPX4 / ACSL4 / labile iron",
    "　细胞器界面 — ER–mitochondria contact site / MAM / tethering",
    "　结局 — hippocampus / CA1 / cognition / synaptic plasticity",
    "手工筛查核心机制文献的参考文献与引证文献",
    { text: "因直接相关文献极少，不设最低质量过滤；改为逐篇标注证据等级与实验系统", hi: true, b: true },
  ], { x: M, y: BODY_TOP + 0.28, w: 7.1, h: BODY_H - 0.28 }, 13);
  figImage(s, { x: M + 7.45, y: BODY_TOP + 0.28, w: W - M * 2 - 7.45, h: BODY_H - 0.28 }, "figures/f07.png");
}


// —— 9 时间轴 ——
{
  const s = contentSlide({
    title: "铁死亡与 ERMCS 研究进展", mod: "D", modLabel: "D 文献综述",
    notes: "三个里程碑要能一口气讲下来。最后一条的补注是本页重点，也是与假说表述纪律呼应的地方。",
  });
  cards(s, [
    { tag: "2017 · Science", head: "PDZD8", body: "哺乳动物神经元 ER–线粒体锚定的重要分子 → 神经系统接触稳态具有明确分子基础", tagColor: TEAL },
    { tag: "2024 · Commun Biol", head: "距离本身是参数", body: "ER–线粒体距离是决定线粒体 Ca²⁺ 摄取与氧化代谢效率的关键参数，且呈钟形、峰值约 20 nm", tagColor: TEAL },
    { tag: "2025 · Nat Cell Biol", head: "空间首发热点", body: "ERMCS 是磷脂过氧化的首发热点；人为改变接触几何可改变铁死亡敏感性", tagColor: RED, headColor: RED },
  ], { x: M, y: BODY_TOP, w: W - M * 2, h: 2.4 }, { cols: 3, gap: 0.3 });
  slide9note(s);
  function slide9note(sl) {
    sl.addShape(pres.ShapeType.roundRect, { x: M, y: BODY_TOP + 2.65, w: W - M * 2, h: 0.95, rectRadius: 0.07, fill: { color: "FBEEEC" }, line: { color: RED, width: 1 } });
    sl.addText([
      { text: "★ 关键补注：", options: { fontFace: FONT, fontSize: 13.5, bold: true, color: RED } },
      { text: "在该模型中，局部磷脂氢过氧化物在时间上先于可测的接触扩张。因此「空间首发热点」≠「时间起始事件」——接触几何更可能控制过氧化的传播与放大。", options: { fontFace: FONT, fontSize: 13.5, color: INK } },
    ], { x: M + 0.2, y: BODY_TOP + 2.75, w: W - M * 2 - 0.4, h: 0.75, margin: 0, valign: "middle", lineSpacing: 21 });
  }
  figImage(s, { x: M, y: BODY_TOP + 3.75, w: W - M * 2, h: BODY_H - 3.95 }, "figures/f09.png");
}


// —— 10 方向分歧 ——
{
  const s = contentSlide({
    title: "核心分歧：ERMCS 在损伤中是扩张还是破坏？", mod: "D", modLabel: "D 文献综述",
    lead: "本课题不预设方向，采用双侧检验，由数据判定",
    notes: "这是文献综述部分最重要的一页。注意强调：提示破坏的两项恰是『间歇低氧 + 哺乳动物在体』，与本模型最接近。Jiang 2026 要单独交代，它是目前最强的 contact-upstream 证据，主动说出来比被问出来好。",
  });
  cards(s, [
    { tag: "提示 接触扩张", head: "Sassano 2025 · 肿瘤细胞\nYan 2026 · 鱼肝细胞（持续低氧）\nJiang 2026 · 小鼠脊髓神经元（SCI）", body: "", tagColor: BLUE, headSize: 12.5, headColor: BLUE, fill: "EDF3FA", line: "C4D9EE" },
    { tag: "提示 接触破坏 / 系链解体", head: "Moulin 2022 · 小鼠心 ＋ 人心房（IH 21 d）\nZhai 2026 · 小鼠脑 DA 神经元（CIH）", body: "", tagColor: RED, headSize: 12.5, headColor: RED, fill: "FBEEEC", line: "E8C4BE" },
  ], { x: M, y: BODY_TOP + 0.28, w: W - M * 2, h: 2.05 }, { cols: 2, gap: 0.35 });
  bullets(s, [
    { text: "注意：提示破坏的两项恰是「间歇低氧 ＋ 哺乳动物在体」，与本课题模型最接近", b: true, hi: true },
    "Jiang 2026 需单独交代：目前最强的 in vivo 神经元 contact-upstream 证据（SCD1 缺失先于并导致接触异常扩张，SCD1 回补与 LXRα 激动可逆转），且双向可操控",
    "但脊髓损伤是单次急性机械损伤、无复氧循环，与 CIH 的暴露结构不同",
    { text: "→ 故本课题对全部几何终点采用双侧检验，方向由数据判定", b: true },
  ], { x: M, y: BODY_TOP + 2.55, w: 7.2, h: BODY_H - 2.75 }, 12.5);
  figImage(s, { x: M + 7.55, y: BODY_TOP + 2.55, w: W - M * 2 - 7.55, h: BODY_H - 2.75 }, "figures/f10.png");
}


// —— 11 BHD 进展与不足 ——
{
  const s = contentSlide({
    title: "半夏厚朴汤研究进展与不足", mod: "D", modLabel: "D 文献综述",
    notes: "最后一条是综述自己提出的判据，务必讲——它直接引出 G9 vs G6 的设计。",
  });
  bullets(s, [
    "半夏厚朴汤源自《金匮要略》，现代药理提示抗炎、抗氧化、调节应激反应",
    "Song 2022：减轻 CIH 诱导的心肌铁毒性损伤与线粒体超微结构破坏",
    "Yang 2024：抑制 CIH 小鼠脑内铁超载与神经炎症，改善神经元损伤",
    "剂量学基础明确：7.01 g/kg/d 为两项独立研究三剂量梯度中的最优中剂量",
    { text: "三个未回答的问题：", b: true },
    "　① CIH 是否诱导海马神经元 ERMCS 几何重塑？",
    "　② BHD 的保护是否依赖该重塑的逆转？",
    "　③ 几何变化与下游损伤之间是否存在剂量-反应关系？",
    { text: "★ 综述判据：现有 BHD 研究均未证明 CA1 铁死亡，也未证明 ERMCS 正常化", hi: true, b: true },
  ], { x: M, y: BODY_TOP, w: 7.4, h: BODY_H }, 13);
  figImage(s, { x: M + 7.75, y: BODY_TOP, w: W - M * 2 - 7.75, h: BODY_H }, "figures/f11.png");
}


// —— P1 预实验设计与造模验证 ——
{
  const s = contentSlide({
    title: "预实验：设计与造模验证", mod: "D", modLabel: "D 研究基础",
    lead: "预实验 2026-07-22 轮次　·　C57BL/6J 雄性 9 只，Sham / CIH / CIH+BHD 各 n=3　·　CIH 4 周",
    notes: "先讲造模成立：三组增重完全不重叠，CIH 较 Sham 少 41.9%。然后主动交代 CIH+BHD 增重比 CIH 更低这件事——不讲的话评委看表就会问。",
  });
  bullets(s, [
    { text: "造模：21% O₂ 经 30–60 s 降至 7.5±0.5% O₂ 后恢复，1 min/cycle", b: true },
    "　10:00–16:00（6 h/d），连续 4 周；Sham 同舱同时段持续 21% O₂",
    { text: "给药：工作日进舱前 30 min 灌胃，共 20 次；1.4 g/mL、100 µL/只（按 20 g 体重折 7.01 g/kg/d）；对照组等体积生理盐水", hi: true },
    "　累积 140.2 g/kg，折合全程平均 5.01 g/kg/d —— 低氧连续 28 d 而给药仅 20 次，周末为无保护暴露",
    "读出：体重每周 1 次共 5 次；全部动物完成行为学后统一取材（总时程 42 d = 适应 7 + 低氧 28 + 行为学 7）",
    "　新物体识别：方案定训练 2 d + 正式 1 d，实际执行 1 次熟悉期（300 s）+ 测试期（300 s）",
    { text: "判读规则（预设）：n=3/组统计效力不足，以方向性判断为主", b: true, hi: true },
    "　P<0.10 或 |d|≥0.8 视为方向性信号；不以 P 值作唯一依据，不以本轮效应量推算主实验样本量",
    { text: "结论：4 周造模成立 —— 三组增重数值范围完全不重叠（ANOVA P<0.001）", b: true, hi: true },
  ], { x: M, y: BODY_TOP + 0.28, w: 6.35, h: BODY_H - 0.28 }, 12);
  figImage(s, { x: M + 6.7, y: BODY_TOP + 0.28, w: W - M * 2 - 6.7, h: BODY_H - 0.28 }, "figures/fp1.png");
}


// —— P2 预实验运动与动机 ——
{
  const s = contentSlide({
    title: "预实验：运动与探索动机指标", mod: "D", modLabel: "D 研究基础",
    lead: "★ 须按是否经过物体区域判定分层：轨迹 / 姿态三项可用；新物体潜伏期与分析区进入次数与 DI 同源，降级为提示",
    notes: "这是本轮最有分量的一组结果，但必须分层讲。总路程、不动时间、蜷缩姿态是纯轨迹与姿态指标，不经过物体区域判定，方向一致且达预设方向性信号标准；新物体接近潜伏期与熟悉期分析区进入次数依赖与 DI 相同的区域判定点，本轮一并降级。相关分析只作提示：n=9 功效有限，主实验以体重为协变量。",
  });
  figImage(s, { x: M, y: BODY_TOP + 0.30, w: W - M * 2, h: BODY_H - 0.30 }, "figures/fp2.png");
}


// —— P3 预实验 NOR ——
{
  const s = contentSlide({
    title: "预实验：新物体识别未建立有效读出", mod: "D", modLabel: "D 研究基础",
    lead: "★ 主动交代：本轮不足以判断 CIH 对识别记忆的影响，亦不足以判断 BHD 的干预效应",
    notes: "主动把问题讲出来。关键一句：正常对照组自己都没有表现出可靠的新物体偏好，那么任何组间比较都不可解释。藏着不讲，一句「你对照组的 DI 显著吗」就会当场暴露。",
  });
  figImage(s, { x: M, y: BODY_TOP + 0.30, w: 7.15, h: BODY_H - 0.30 }, "figures/fp3.png");
  bullets(s, [
    { text: "组间无差异", b: true },
    "　DI：Sham 0.31±0.45、CIH 0.24±0.07、CIH+BHD 0.42±0.39（F=0.20，P=0.826）",
    "　新物体探索占比 65.4% / 62.1% / 70.9%，结论一致",
    { text: "内部效度不成立（关键）", b: true, hi: true },
    "　Sham 组 DI 未显著偏离 0（P=0.356，95% CI −0.81 至 +1.42）",
    "　组内新旧物体探索时间亦无差异（P=0.393）",
    { text: "质控：测试期探索时长达 20 s 阈值者仅 3/9", b: true, hi: true },
    "　CIH+BHD 组 0/3，其 DI 由 3.95–16.14 s 的极短探索时长算出",
    { text: "→ 探索样本量不足是 DI 波动过大的直接原因", b: true },
  ], { x: M + 7.5, y: BODY_TOP + 0.30, w: W - M * 2 - 7.5, h: BODY_H - 0.30 }, 11);
}


// —— P4 预实验局限与优化 ——
{
  const s = contentSlide({
    title: "预实验局限与主实验优化", mod: "D", modLabel: "D 研究基础",
    lead: "本轮行为学的局限主要来自方法学而非样本量 —— 逐项已有修正方案",
    notes: "这一页是加分项。六条局限都是自己查出来的，且每条都有对应修正。最后的 No-Go 规则要讲：决定主实验能否开展的核心指标是 TEM 的 ERMCS 量化，目前制样拍照进行中、结果待判读；行为学本轮未获支持不构成 No-Go。",
  });
  table(s, ["#", "本轮的问题", "主实验的修正"], [
    ["1", { t: "探索行为以身体中心点落区计时", b: true }, { t: "改用鼻尖点判定（朝向物体、距离 ≤2 cm、伴嗅闻或触碰）；抽 2–3 只视频人工双盲计时校验", b: true }],
    ["2", "熟悉期训练量不足：原定 2 天，实际执行 1 天", "恢复 2 天训练（探索时长普遍偏低与位置偏好未消除的可能原因）"],
    ["3", "物体与位置未做平衡", "新物体的种类与左右位置在动物间做双重平衡"],
    ["4", "运行顺序与分组共线（Sham → CIH+BHD → CIH 固定顺序）", "改为组间交错随机"],
    ["5", "软件「活跃状态」模块参数未配置，该模块数据无效", "主实验前完成阈值设定；本轮已将该模块排除在分析之外"],
    ["6", { t: "CIH+BHD 增重低于 CIH（1.30 vs 2.40 g）", b: true, hi: true }, { t: "提示可能存在胃肠道反应或摄食抑制；增加摄食量与饮水量监测，并考虑设置半剂量组", b: true, hi: true }],
  ], { x: M, y: BODY_TOP + 0.28, w: W - M * 2 }, [0.5, 4.7, 7.03]);
  s.addShape(pres.ShapeType.roundRect, { x: M, y: H - 1.62, w: W - M * 2, h: 0.88, rectRadius: 0.07, fill: { color: "EDF3FA" }, line: { color: BLUE, width: 1.6 } });
  s.addText([
    { text: "按预实验预设的判读规则：", options: { fontFace: FONT, fontSize: 12, bold: true, color: BLUE } },
    { text: "决定主实验能否开展的核心指标是海马 CA1 TEM 的 ERMCS 量化 ——", options: { fontFace: FONT, fontSize: 12, color: INK } },
    { text: "该指标目前制样 / 拍照进行中，结果待判读", options: { fontFace: FONT, fontSize: 12, bold: true, color: RED } },
    { text: "（预计【填】）。行为学本轮未获支持", options: { fontFace: FONT, fontSize: 12, color: INK } },
    { text: "不构成 No-Go", options: { fontFace: FONT, fontSize: 12, bold: true, color: BLUE } },
    { text: "，但提示 NOR 流程须在主实验前完成优化，并与 MWM 首次预试同期进行。", options: { fontFace: FONT, fontSize: 12, color: INK } },
  ], { x: M + 0.22, y: H - 1.52, w: W - M * 2 - 0.44, h: 0.68, margin: 0, valign: "middle", lineSpacing: 20 });
}


// —— 28 后续预实验计划 ——
{
  const s = contentSlide({
    title: "后续预实验计划（M1–M2）", mod: "D", modLabel: "D 研究基础",
    notes: "本页的重点在最右一列：每一项都有不通过时的处置路径。收尾一句——关键假设不存在「赌一把」的环节。",
  });
  s.addShape(pres.ShapeType.roundRect, { x: M, y: BODY_TOP, w: W - M * 2, h: 0.68, rectRadius: 0.07, fill: { color: "E8F3EC" }, line: { color: "5B9E78", width: 1.5 } });
  s.addText("✔ 已完成：CIH 造模有效性验证（预实验 2026-07-22 轮次，n=3/组，4 周）　✔ 已完成：NOR 流程预试，识别六项方法学问题并完成方案修订　◐ 进行中：海马 TEM 制样 / 拍照", {
    x: M + 0.2, y: BODY_TOP + 0.05, w: W - M * 2 - 0.4, h: 0.58, margin: 0,
    fontFace: FONT, fontSize: 11.5, bold: true, color: "2E6B4F", valign: "middle",
  });
  table(s, ["#", "待验证事项", "时间", "通过判读标准", "不通过 → 处置"], [
    ["P0", { t: "★ 海马 CA1 TEM 的 ERMCS 量化判读（本轮取材，制样 / 拍照进行中）", b: true, hi: true }, { t: "进行中\n预计【填】", b: true, hi: true }, { t: "能在 CA1 锥体神经元稳定分辨 ER 与线粒体膜并完成五指标量化；组间可比", b: true, hi: true }, { t: "查制样与包埋质量、复检固定延迟；必要时重新取材。此项为主实验能否开展的核心判读指标", b: true, hi: true }],
    ["P1", { t: "行为学范式修正后复测（六项修正落实）＋ MWM 首次预试", b: true }, "M1", { t: "Sham 组 DI 显著 > 0；鼻尖点评分与人工盲法计时 ICC ≥0.80；MWM 完成水温 / 平台 / 泳道 / 遮蔽物参数标定", b: true }, "改人工盲法计时；MWM 作为唯一记忆学主判据；若 MWM 亦不稳定，改用 Barnes 迷宫"],
    ["P2", "IP3R1 一抗验证（19962-1-AP 于小鼠海马）", "M1", "IHC-P 在 CA1 呈预期分布；PLA 四类对照背景可接受", "更换 ER 侧抗体，保持一鼠一兔搭配，PLA 试剂盒不变"],
    ["P3", { t: "TEM 固定延迟敏感性自检", b: true }, "M1–M2", "同一动物组织分第 1 天与第 4–5 天上锇酸，比较 ERMICC / ≤10 nm 比例 / 膜间距", "据实测差异固化储存天数安全上限；储存天数纳入模型作协变量"],
    ["P4", "EML 质粒到货与测序验证", "M2", "Addgene 到货，测序比对与 15/20/30 nm 构建一致", "联系存放者 Lim 实验室；国内基因合成兜底（4–6 周）"],
    ["P5", "HT22 转染效率", "M2–M3", "mRFP⁺ 细胞占比 ≥40%", "换 jetOPTIMUS；慢病毒包装；FACS 分选"],
    ["P6", "造模深度验证", "M1–M6", "每周 SpO₂ 抽测；W3 中期抽检海马 4-HNE 与 Fe²⁺", "检查低氧舱参数与循环曲线；必要时延长造模周期"],
  ], { x: M, y: BODY_TOP + 0.82, w: W - M * 2 }, [0.5, 2.75, 0.9, 4.3, 3.78]);
  s.addText("每一项关键假设都有明确的验证时点与不通过处置路径 —— 不存在「赌一把」的环节", {
    x: M, y: H - 1.05, w: W - M * 2, h: 0.36, margin: 0, fontFace: FONT, fontSize: 12.5, bold: true, color: NAVY, valign: "middle",
  });
}


// ============================================================
// 备用页 B1–B10（不讲，供答辩提问时调出）
// ============================================================
const backups = [
  ["B1", "完整参考文献", "按引用顺序排列；核心 14 篇 + 本次新增 8 篇（Minikes 2025、Hambright 2017、Jiang 2026、Zhai 2026、Moulin 2022、Yan 2026、Csordas 2010/2018、Dematteis 2024）"],
  ["B2", "CIH 造模参数与 SpO₂ 监测细节", "循环曲线图；每周抽测记录表；低氧舱安全措施（双 O₂ 监测、漏气报警、紧急制氧）"],
  ["B3", "TEM 五指标完整定义与计算公式", "ERMICC 计算式；接触覆盖率定义；≤10 nm 判定规则；线粒体形态四参数"],
  ["B4", "样本量与设计效应测算过程", "ICC=0.2 下每动物测量数与有效独立观测数的对应关系（40 次≈4.55；120 次≈4.84）"],
  ["B5", "EML 质粒清单与四级获取路径", "Addgene 编号；引文更正说明（原误记作者、期刊、实验室三项均误）；国内合成兜底方案与成本"],
  ["B6", "抗体清单与种属 / 应用核查表", "逐条列出反应种属、验证应用、稀释比；标注 ab5804 → 19962-1-AP 的更换依据"],
  ["B7", "组学决策树完整八情形表", "情形 A–H 全表，含 ERMCS 表现、组学富集、深挖方向与目标期刊层级"],
  ["B8", "伦理、3R 与数据管理", "IACUC 批件状态；3R 原则的队列设计体现；原始数据按 FAIR 原则归档（GEO / PRIDE）"],
  ["B9", "经费明细两张表", "材料费明细（含 Addgene 质粒采购说明）；测试化验加工费明细"],
  ["B10", "与已发表 CIH-海马蛋白组学数据集的横向比较", "拟比较的公开数据集列表与比较维度"],
];
backups.forEach(([id, title, body]) => {
  const s = pres.addSlide();
  pageNo += 1;
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 0.5, w: 1.15, h: 0.4, rectRadius: 0.19, fill: { color: MUTED } });
  s.addText(id, { x: M, y: 0.5, w: 1.15, h: 0.4, margin: 0, fontFace: FONT, fontSize: 12, bold: true, color: WHITE, align: "center", valign: "middle" });
  s.addText(title, { x: M + 1.35, y: 0.45, w: W - M * 2 - 1.35, h: 0.5, margin: 0, fontFace: FONT, fontSize: 23, bold: true, color: NAVY, valign: "middle" });
  s.addText("备用页 · 不在正式汇报中展示，供提问环节调出", { x: M, y: 1.05, w: W - M * 2, h: 0.3, margin: 0, fontFace: FONT, fontSize: 11.5, italic: true, color: MUTED });
  figBox(s, { x: M, y: 1.55, w: W - M * 2, h: H - 1.55 - 0.85 }, body);
  s.addText(String(pageNo), { x: W - M - 0.9, y: H - 0.62, w: 0.9, h: 0.32, margin: 0, fontFace: FONT, fontSize: 10, color: MUTED, align: "right" });
});

pres.writeFile({ fileName: "开题报告_6分钟版.pptx" }).then((f) => {
  console.log("written:", f, "| slides:", pageNo);
});
