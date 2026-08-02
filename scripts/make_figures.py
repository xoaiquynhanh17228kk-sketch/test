#!/usr/bin/env python3
"""开题报告 PPT 全部示意图生成器（23 张）

按 scripts/build_deck.js 中各图位的实际英寸尺寸出图，故图内字号即幻灯片上的字号。
用法：python3 scripts/make_figures.py   → 输出到 figures/f03.png … figures/f35.png
"""
import os, math
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Polygon, Rectangle, Ellipse, Wedge

for cand in ["WenQuanYi Zen Hei", "Noto Sans CJK SC", "Source Han Sans SC", "SimHei"]:
    if any(cand in f.name for f in font_manager.fontManager.ttflist):
        plt.rcParams["font.sans-serif"] = [cand]; break
plt.rcParams.update({"axes.unicode_minus": False, "savefig.dpi": 220})

NAVY = "#0B3C5D"; TEAL = "#1D7874"; RED = "#C0392B"; BLUE = "#1F6FB4"
GREY = "#6E6E6E"; LIGHT = "#F2F5F7"; INK = "#1F2933"; MUTED = "#5A6B7B"
GOLD = "#B08333"; GREEN = "#2E6B4F"; WHITE = "#FFFFFF"
OUT = "figures"
os.makedirs(OUT, exist_ok=True)


def canvas(w, h):
    fig = plt.figure(figsize=(w, h))
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis("off")
    return fig, ax


def box(ax, x, y, w, h, text="", fc=LIGHT, ec="#DDE4E9", tc=INK, fs=9, weight="normal",
        r=0.012, lw=1.2, ha="center", pad=0.0, va="center", ls="solid"):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad={pad},rounding_size={r}",
                                fc=fc, ec=ec, lw=lw, linestyle=ls, zorder=2))
    if text:
        tx = x + w / 2 if ha == "center" else x + 0.02
        ax.text(tx, y + h / 2, text, ha=ha, va=va, fontsize=fs, color=tc,
                weight=weight, zorder=3, linespacing=1.45)


def arrow(ax, x1, y1, x2, y2, c=MUTED, lw=1.6, style="-|>", ms=9, ls="solid"):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle=style, mutation_scale=ms,
                                 color=c, lw=lw, linestyle=ls, zorder=4,
                                 shrinkA=0, shrinkB=0))


def title(ax, t, fs=11, c=NAVY, y=0.975):
    ax.text(0.5, y, t, ha="center", va="top", fontsize=fs, color=c, weight="bold")


def note(ax, t, fs=8, c=MUTED, y=0.018):
    ax.text(0.5, y, t, ha="center", va="bottom", fontsize=fs, color=c, linespacing=1.4)


def save(fig, name):
    fig.savefig(f"{OUT}/{name}.png", facecolor="white")
    plt.close(fig); print("  ", name)


# ── F03 临床问题链路 ────────────────────────────────────────────────
def f03():
    fig, ax = canvas(5.28, 5.43)
    title(ax, "OSA 相关认知障碍的病理链路", 11.5)
    chain = [("阻塞性睡眠呼吸暂停 OSA", NAVY, WHITE),
             ("慢性间歇性低氧 CIH\n反复低氧–复氧循环", RED, WHITE),
             ("海马 CA1 氧化应激\n突触可塑性受损", "#E8C4BE", INK),
             ("空间学习记忆下降\n海马依赖性认知障碍", "#FBEEEC", INK)]
    y = 0.775; hh = 0.105
    for i, (t, fc, tc) in enumerate(chain):
        box(ax, 0.10, y, 0.80, hh, t, fc=fc, ec=fc, tc=tc, fs=9.5,
            weight="bold" if i < 2 else "normal")
        if i < 3:
            arrow(ax, 0.5, y - 0.004, 0.5, y - 0.043, c=RED, lw=1.8)
        y -= 0.148
    ax.text(0.5, 0.293, "即便去除缺氧刺激，认知恢复并不完全\n→ 提示存在结构与分子基础",
            ha="center", va="center", fontsize=9, color=RED, weight="bold", linespacing=1.5)
    box(ax, 0.06, 0.045, 0.88, 0.20, "", fc="#F7F9FA", ec=MUTED)
    ax.text(0.5, 0.212, "现有治疗：CPAP 的三点局限", ha="center", va="center",
            fontsize=9.5, color=NAVY, weight="bold")
    for i, t in enumerate(["① 仅纠正气道阻塞，不针对已成的神经损伤",
                           "② 对已形成的结构损伤逆转有限",
                           "③ 长期依从性问题突出"]):
        ax.text(0.10, 0.165 - i * 0.042, t, ha="left", va="center", fontsize=8.6, color=INK)
    note(ax, "→ 治疗缺口：需要从损伤机制层面寻找上游干预靶点")
    save(fig, "f03")


# ── F04 平面化 vs 空间结构 ─────────────────────────────────────────
def f04():
    fig, ax = canvas(5.28, 5.43)
    ax.text(0.25, 0.965, "现有研究：平面化分子事件", ha="center", fontsize=10, color=MUTED, weight="bold")
    ax.text(0.77, 0.965, "本课题：亚细胞器空间结构", ha="center", fontsize=10, color=NAVY, weight="bold")
    ax.plot([0.5, 0.5], [0.06, 0.93], color="#DDE4E9", lw=1.2, ls=(0, (4, 4)))
    for i, t in enumerate(["氧化应激", "神经炎症", "线粒体功能障碍", "铁代谢紊乱", "突触可塑性下降"]):
        box(ax, 0.045, 0.79 - i * 0.105, 0.41, 0.078, t, fc=LIGHT, ec="#CBD5DC", fs=9)
    for i in range(5):
        arrow(ax, 0.25, 0.79 - i * 0.105 - 0.002, 0.25, 0.30, c="#C3CED6", lw=1.0)
    box(ax, 0.045, 0.215, 0.41, 0.085, "终末效应\n（测到了什么变化）", fc="#E9EDF0", ec="#CBD5DC", fs=9)
    ax.text(0.25, 0.135, "未回答：\n从何处启动？\n为何在特定区域被放大？", ha="center", va="center",
            fontsize=8.8, color=RED, weight="bold", linespacing=1.5)
    # 右：ER–线粒体接触
    ax.add_patch(Ellipse((0.78, 0.60), 0.30, 0.20, fc="#D9E6F2", ec=BLUE, lw=1.6, zorder=2))
    ax.text(0.78, 0.60, "线粒体", ha="center", va="center", fontsize=9, color=BLUE, weight="bold", zorder=3)
    ax.add_patch(Rectangle((0.575, 0.46), 0.035, 0.36, fc="#F6E3C8", ec=GOLD, lw=1.6, zorder=2))
    ax.text(0.593, 0.855, "内质网", ha="center", va="center", fontsize=9, color=GOLD, weight="bold")
    ax.annotate("", xy=(0.628, 0.60), xytext=(0.611, 0.60),
                arrowprops=dict(arrowstyle="<|-|>", color=RED, lw=1.5, mutation_scale=8))
    ax.text(0.62, 0.545, "膜间距\n10–30 nm", ha="center", va="top", fontsize=8.2, color=RED, linespacing=1.35)
    box(ax, 0.545, 0.24, 0.435, 0.145,
        "接触区同时承担\n脂质转运 · 钙交换\n线粒体动力学 · 应激信号", fc="#EDF3FA", ec=BLUE, fs=8.6)
    ax.text(0.77, 0.17, "→ 损伤在何处被放大，\n是一个空间结构问题", ha="center", va="center",
            fontsize=9, color=NAVY, weight="bold", linespacing=1.5)
    note(ax, "示意图，非实验数据")
    save(fig, "f04")


# ── F05 两条证据汇聚 ───────────────────────────────────────────────
def f05():
    fig, ax = canvas(5.28, 5.13)
    title(ax, "两条公开证据的衔接", 11.5)
    box(ax, 0.04, 0.72, 0.44, 0.185,
        "证据一\nCIH 海马损伤的\n脂质过氧化—铁代谢—\nGPX4/ACSL4 级联", fc="#EDF3FA", ec=BLUE, tc=INK, fs=8.8)
    box(ax, 0.52, 0.72, 0.44, 0.185,
        "证据二\nSassano 2025\nERMCS 是磷脂过氧化的\n空间首发热点", fc="#FBEEEC", ec=RED, tc=INK, fs=8.8)
    arrow(ax, 0.26, 0.715, 0.44, 0.60, c=BLUE, lw=1.8)
    arrow(ax, 0.74, 0.715, 0.56, 0.60, c=RED, lw=1.8)
    ax.add_patch(Circle((0.5, 0.535), 0.062, fc=NAVY, ec=NAVY, zorder=3))
    ax.text(0.5, 0.535, "?", ha="center", va="center", fontsize=22, color=WHITE, weight="bold", zorder=4)
    ax.text(0.5, 0.435, "CIH 是否通过 ERMCS 几何重塑\n放大海马神经元损伤？",
            ha="center", va="center", fontsize=9.5, color=NAVY, weight="bold", linespacing=1.5)
    box(ax, 0.04, 0.10, 0.92, 0.245, "", fc="#FBEEEC", ec=RED)
    ax.text(0.5, 0.315, "★ 一个必须区分的问题", ha="center", va="center", fontsize=9.5, color=RED, weight="bold")
    ax.text(0.08, 0.245, "空间上", ha="left", va="center", fontsize=9, color=RED, weight="bold")
    ax.text(0.26, 0.245, "接触区是磷脂过氧化的首发热点（成立）", ha="left", va="center", fontsize=8.8, color=INK)
    ax.text(0.08, 0.175, "时间上", ha="left", va="center", fontsize=9, color=RED, weight="bold")
    ax.text(0.26, 0.175, "局部过氧化先于可测的接触扩张", ha="left", va="center", fontsize=8.8, color=INK)
    ax.text(0.5, 0.125, "→ 几何控制「传播与放大」，而非「起始」", ha="center", va="center",
            fontsize=9, color=RED, weight="bold")
    note(ax, "立论基于公开发表的前沿证据，非课题组既有数据")
    save(fig, "f05")


# ── F07 检索流程 ───────────────────────────────────────────────────
def f07():
    fig, ax = canvas(4.78, 5.15)
    title(ax, "检索流程", 11.5)
    groups = [("暴露", "intermittent hypoxia\nobstructive sleep apnea", TEAL),
              ("死亡程序", "ferroptosis · lipid peroxidation\nGPX4 · ACSL4 · labile iron", RED),
              ("细胞器界面", "ER–mitochondria contact site\nMAM · tethering", BLUE),
              ("结局", "hippocampus · CA1\ncognition · synaptic plasticity", GOLD)]
    y = 0.855
    for name, terms, c in groups:
        box(ax, 0.06, y, 0.88, 0.086, "", fc="#FAFCFD", ec=c, lw=1.3)
        ax.text(0.115, y + 0.043, name, ha="left", va="center", fontsize=8.8, color=c, weight="bold")
        ax.text(0.36, y + 0.043, terms, ha="left", va="center", fontsize=7.6, color=INK, linespacing=1.4)
        y -= 0.098
    ax.text(0.5, 0.505, "× 四组交叉检索", ha="center", va="center", fontsize=9.5, color=NAVY, weight="bold")
    arrow(ax, 0.5, 0.482, 0.5, 0.446, c=NAVY)
    steps = [("PubMed + Web of Science（建库至 2026-07）", LIGHT, INK),
             ("命中 【填】 篇", LIGHT, INK),
             ("手工筛查参考文献与引证文献 → 精读 【填】 篇", LIGHT, INK),
             ("纳入核心文献 【填】 篇", "#EDF3FA", NAVY)]
    y = 0.375
    for i, (t, fc, tc) in enumerate(steps):
        box(ax, 0.08, y, 0.84, 0.056, t, fc=fc, ec="#CBD5DC", tc=tc, fs=8.4,
            weight="bold" if i == 3 else "normal")
        if i < 3: arrow(ax, 0.5, y - 0.002, 0.5, y - 0.020, c=MUTED, lw=1.2)
        y -= 0.076
    box(ax, 0.08, 0.040, 0.84, 0.082,
        "直接相关文献极少 → 不设最低质量过滤\n改为逐篇标注证据等级与实验系统",
        fc="#FBEEEC", ec=RED, tc=RED, fs=8.4, weight="bold")
    save(fig, "f07")


# ── F09 时间轴 ─────────────────────────────────────────────────────
def f09():
    fig, ax = canvas(12.23, 1.48)
    ax.plot([0.06, 0.94], [0.52, 0.52], color="#CBD5DC", lw=2.5, zorder=1)
    pts = [(0.17, "2017", "Science", "PDZD8：神经元 ER–线粒体锚定分子", TEAL),
           (0.45, "2024", "Commun Biol", "距离本身是钙摄取与氧化代谢的关键参数", BLUE),
           (0.75, "2025", "Nat Cell Biol", "ERMCS 是磷脂过氧化的空间首发热点", RED)]
    for x, yr, jr, t, c in pts:
        ax.add_patch(Circle((x, 0.52), 0.008, fc=c, ec=WHITE, lw=1.5, zorder=3))
        ax.text(x, 0.80, f"{yr} · {jr}", ha="center", va="center", fontsize=9.5, color=c, weight="bold")
        ax.text(x, 0.24, t, ha="center", va="center", fontsize=9, color=INK)
    ax.annotate("", xy=(0.955, 0.52), xytext=(0.93, 0.52),
                arrowprops=dict(arrowstyle="-|>", color="#CBD5DC", lw=2.5, mutation_scale=12))
    box(ax, 0.845, 0.13, 0.145, 0.60,
        "时间顺序\n局部过氧化\n▼\n接触扩张", fc="#FBEEEC", ec=RED, tc=RED, fs=8, weight="bold")
    save(fig, "f09")


# ── F10 天平 ───────────────────────────────────────────────────────
def f10():
    fig, ax = canvas(4.68, 2.68)
    title(ax, "证据方向分歧", 10.5, y=0.99)
    ax.plot([0.5, 0.5], [0.14, 0.52], color=MUTED, lw=2.5)
    ax.plot([0.15, 0.85], [0.60, 0.44], color=MUTED, lw=2.5)
    ax.add_patch(Polygon([[0.44, 0.14], [0.56, 0.14], [0.5, 0.30]], closed=True, fc=MUTED, ec=MUTED))
    # 左盘（扩张，稍高）
    ax.plot([0.15, 0.15], [0.60, 0.70], color=MUTED, lw=1.2)
    box(ax, 0.02, 0.70, 0.30, 0.20, "提示扩张\n3 项\n（细胞 / 鱼肝 / 脊髓）",
        fc="#EDF3FA", ec=BLUE, tc=BLUE, fs=8, weight="bold")
    # 右盘（破坏，稍低）
    ax.plot([0.85, 0.85], [0.44, 0.54], color=MUTED, lw=1.2)
    box(ax, 0.67, 0.54, 0.31, 0.22, "提示破坏\n2 项\n间歇低氧 + 在体哺乳动物",
        fc="#FBEEEC", ec=RED, tc=RED, fs=8, weight="bold")
    ax.text(0.5, 0.055, "→ 不预设方向，双侧检验，由数据判定",
            ha="center", va="center", fontsize=9, color=NAVY, weight="bold")
    save(fig, "f10")


# ── F11 研究空白韦恩图 ─────────────────────────────────────────────
def f11():
    fig, ax = canvas(4.48, 5.43)
    title(ax, "研究空白定位", 11.5)
    cs = [((0.50, 0.740), RED, "CIH 海马\n神经损伤", (0.50, 0.845)),
          ((0.375, 0.560), BLUE, "ERMCS\n几何", (0.255, 0.462)),
          ((0.625, 0.560), TEAL, "中药复方\n（BHD）", (0.745, 0.462))]
    for (cx, cy), c, lab, (lx, ly) in cs:
        ax.add_patch(Circle((cx, cy), 0.190, fc=c, ec=c, alpha=0.13, lw=1.8, zorder=2))
        ax.add_patch(Circle((cx, cy), 0.190, fc="none", ec=c, lw=1.8, zorder=3))
        ax.text(lx, ly, lab, ha="center", va="center", fontsize=8.6, color=c, weight="bold", zorder=5)
    ax.add_patch(Circle((0.5, 0.625), 0.043, fc=WHITE, ec=RED, lw=1.8, ls=(0, (3, 2)), zorder=6))
    ax.text(0.5, 0.625, "空集", ha="center", va="center", fontsize=8.2, color=RED, weight="bold", zorder=7)
    box(ax, 0.05, 0.055, 0.90, 0.215, "", fc="#F7F9FA", ec="#CBD5DC")
    ax.text(0.5, 0.240, "三个尚未回答的问题", ha="center", va="center", fontsize=9.5, color=NAVY, weight="bold")
    for i, t in enumerate(["① CIH 是否诱导海马 ERMCS 几何重塑？",
                           "② BHD 的保护是否依赖该重塑的逆转？",
                           "③ 几何变化与损伤是否存在剂量-反应？"]):
        ax.text(0.09, 0.190 - i * 0.045, t, ha="left", va="center", fontsize=8.4, color=INK)
    save(fig, "f11")


# ── F12 机制示意 ───────────────────────────────────────────────────
def f12():
    fig, ax = canvas(4.68, 5.43)
    title(ax, "假说机制示意", 11.5)

    def organelles(y0, gap, c, dots=False):
        """在 y0 基线上画 ER + 线粒体；gap = 两者的水平间隙"""
        er_x, er_w = 0.215, 0.042
        mito_cx = 0.615
        ax.add_patch(Rectangle((er_x, y0), er_w, 0.185, fc="#F6E3C8", ec=GOLD, lw=1.5, zorder=3))
        ax.text(er_x + er_w / 2, y0 + 0.158, "ER", ha="center", va="center",
                fontsize=7.8, color="#8A6520", weight="bold", zorder=4)
        ax.add_patch(Ellipse((mito_cx, y0 + 0.093), 0.30, 0.165,
                             fc="#D9E6F2", ec=BLUE, lw=1.5, zorder=3))
        ax.text(mito_cx, y0 + 0.093, "线粒体", ha="center", va="center",
                fontsize=8.4, color=BLUE, zorder=4)
        lx, rx = er_x + er_w, mito_cx - 0.15
        ax.annotate("", xy=(rx, y0 + 0.093), xytext=(lx, y0 + 0.093),
                    arrowprops=dict(arrowstyle="<|-|>", color=c, lw=1.4, mutation_scale=7))
        ax.text((lx + rx) / 2, y0 + 0.048, gap, ha="center", va="center",
                fontsize=8.2, color=c, weight="bold")
        if dots:
            for j in range(6):
                ax.add_patch(Circle((lx + 0.012 + j * 0.038, y0 + 0.145 - (j % 2) * 0.014),
                                    0.0105, fc=RED, ec="none", alpha=0.8, zorder=5))

    # Sham 面板
    box(ax, 0.045, 0.715, 0.80, 0.215, "", fc="#FAFCFD", ec="#CBD5DC", lw=1.2)
    box(ax, 0.062, 0.745, 0.105, 0.040, "Sham", fc=GREY, ec=GREY, tc=WHITE, fs=8.4, weight="bold")
    organelles(0.740, "d", GREY)

    # CIH 面板
    box(ax, 0.045, 0.430, 0.80, 0.225, "", fc="#FDF7F6", ec="#E8C4BE", lw=1.2)
    box(ax, 0.062, 0.520, 0.105, 0.040, "CIH", fc=RED, ec=RED, tc=WHITE, fs=8.4, weight="bold")
    organelles(0.485, "d ?", RED, dots=True)
    ax.add_patch(Circle((0.075, 0.462), 0.0105, fc=RED, ec="none", alpha=0.8, zorder=5))
    ax.text(0.098, 0.462, "磷脂过氧化：起于接触区，并向线粒体传播", ha="left", va="center",
            fontsize=7.8, color=RED)

    arrow(ax, 0.42, 0.710, 0.42, 0.662, c=RED, lw=2.0)
    ax.text(0.445, 0.686, "CIH 反复低氧–复氧", ha="left", va="center", fontsize=8.2, color=RED)
    arrow(ax, 0.905, 0.455, 0.905, 0.905, c=TEAL, lw=2.0)
    ax.text(0.928, 0.68, "BHD\n使几何\n趋向\nSham", ha="left", va="center",
            fontsize=8.0, color=TEAL, weight="bold", linespacing=1.5)

    box(ax, 0.045, 0.305, 0.91, 0.080, "", fc="#FFF6E8", ec=GOLD, lw=1.4)
    ax.text(0.50, 0.345, "d 的改变方向不预设 —— 扩张或减少，均由数据判定",
            ha="center", va="center", fontsize=8.4, color=GOLD, weight="bold")

    box(ax, 0.045, 0.055, 0.91, 0.185, "", fc="#FBEEEC", ec=RED, lw=1.6)
    ax.text(0.5, 0.213, "几何在链条中的位置", ha="center", va="center", fontsize=9, color=RED, weight="bold")
    ax.text(0.5, 0.158, "接触区 ＝ 磷脂过氧化的空间首发热点",
            ha="center", va="center", fontsize=8.4, color=INK)
    ax.text(0.5, 0.103, "几何控制过氧化的「传播与放大」\n而非其时间上的「起始」",
            ha="center", va="center", fontsize=8.4, color=RED, weight="bold", linespacing=1.45)
    note(ax, "示意图，膜间距未按真实比例绘制", 7.8, MUTED, 0.012)
    save(fig, "f12")


# ── F13 三级递进 ───────────────────────────────────────────────────
def f13():
    fig, ax = canvas(12.23, 1.55)
    labs = [("现象", "是否存在可量化、可重复的 ERMCS 几何重塑", TEAL, 0.20),
            ("因果", "该重塑是起始事件、传播放大环节，还是伴随现象", RED, 0.42),
            ("机制", "BHD 是否依赖几何？经何下游通路实现保护", NAVY, 0.64)]
    for i, (k, t, c, yb) in enumerate(labs):
        x = 0.045 + i * 0.325
        box(ax, x, yb - 0.16, 0.285, 0.32, "", fc="#FAFCFD", ec=c, lw=1.6)
        ax.text(x + 0.022, yb + 0.055, k, ha="left", va="center", fontsize=11, color=c, weight="bold")
        ax.text(x + 0.022, yb - 0.075, t, ha="left", va="center", fontsize=8.4, color=INK)
        if i < 2:
            arrow(ax, x + 0.288, yb, x + 0.322, yb + 0.20, c=MUTED, lw=1.8)
    save(fig, "f13")


# ── F14 证据金字塔 ─────────────────────────────────────────────────
def f14():
    fig, ax = canvas(3.58, 5.43)
    title(ax, "四层证据架构", 11)
    tiers = [("L4", "最理想\n完整机制模型", NAVY, WHITE),
             ("L3", "因果性\n距离梯度因果链", "#1C5E80", WHITE),
             ("L2", "机制深度\n组学锁定通路", "#4E88A6", WHITE),
             ("L1", "必胜底\n表型 + 结构证据", "#9CC0D4", INK)]
    yb = 0.79; hh = 0.155
    for i, (tag, t, fc, tc) in enumerate(tiers):
        half = 0.13 + i * 0.135
        ax.add_patch(Polygon([[0.5 - half, yb], [0.5 + half, yb],
                              [0.5 + half - 0.055, yb + hh], [0.5 - half + 0.055, yb + hh]],
                             closed=True, fc=fc, ec=WHITE, lw=2, zorder=2))
        ax.text(0.5, yb + hh / 2, f"{tag}　{t}", ha="center", va="center",
                fontsize=8.6, color=tc, weight="bold", zorder=3, linespacing=1.4)
        yb -= hh + 0.012
    ax.text(0.5, 0.155, "即使 L2–L4 受挫，\nL1 仍可独立成文",
            ha="center", va="center", fontsize=9, color=RED, weight="bold", linespacing=1.5)
    note(ax, "分层设计降低「全链条同时失败」的风险")
    save(fig, "f14")


# ── F15 总体技术路线 ───────────────────────────────────────────────
def f15():
    fig, ax = canvas(12.23, 5.13)
    ax.text(0.5, 0.955, "先结构 → 后组学 → 再因果", ha="center", va="center",
            fontsize=13, color=NAVY, weight="bold")
    stage = [("① 造模与干预", "CIH 6 周 + BHD 灌胃\nSham / CIH / CIH+BHD", NAVY),
             ("② 表型确认", "MWM（主判据）+ NOR\nHE / Nissl / TUNEL / IHC", NAVY),
             ("③ 结构鉴定", "TEM 五指标 + 原位 PLA\n三级终点揭盲前锁定", RED)]
    for i, (h, b, c) in enumerate(stage):
        x = 0.045 + i * 0.315
        box(ax, x, 0.615, 0.27, 0.23, "", fc="#FAFCFD", ec=c, lw=1.8)
        ax.text(x + 0.135, 0.795, h, ha="center", va="center", fontsize=10.5, color=c, weight="bold")
        ax.text(x + 0.135, 0.695, b, ha="center", va="center", fontsize=8.8, color=INK, linespacing=1.5)
        if i < 2: arrow(ax, x + 0.273, 0.73, x + 0.312, 0.73, c=MUTED, lw=2.0, ms=12)
    arrow(ax, 0.949, 0.73, 0.968, 0.73, c=MUTED, lw=2.0, ms=12)
    arrow(ax, 0.968, 0.715, 0.968, 0.515, c=MUTED, lw=2.0, ms=12)
    arrow(ax, 0.968, 0.485, 0.717, 0.485, c=MUTED, lw=2.0, ms=12)
    box(ax, 0.36, 0.385, 0.35, 0.20, "", fc="#FAFCFD", ec=NAVY, lw=1.8)
    ax.text(0.535, 0.545, "④ 组学筛选", ha="center", va="center", fontsize=10.5, color=NAVY, weight="bold")
    ax.text(0.535, 0.455, "CA1 子区显微切割 + TMT 16-plex\n双轴生信：ERMCS 富集 / 六类通路 GSEA",
            ha="center", va="center", fontsize=8.8, color=INK, linespacing=1.5)
    arrow(ax, 0.355, 0.485, 0.315, 0.485, c=MUTED, lw=2.0, ms=12)
    box(ax, 0.055, 0.385, 0.255, 0.20, "", fc="#FBEEEC", ec=RED, lw=2.2)
    ax.text(0.1825, 0.545, "★ M6 方向决策会议", ha="center", va="center", fontsize=10.5, color=RED, weight="bold")
    ax.text(0.1825, 0.455, "依据结构证据 + 组学结果\n共同锁定下游执行通路", ha="center", va="center",
            fontsize=8.8, color=INK, linespacing=1.5)
    arrow(ax, 0.1825, 0.38, 0.1825, 0.315, c=RED, lw=2.0, ms=12)
    box(ax, 0.055, 0.115, 0.42, 0.195, "", fc="#FAFCFD", ec=NAVY, lw=1.8)
    ax.text(0.265, 0.272, "⑤ 因果验证", ha="center", va="center", fontsize=10.5, color=NAVY, weight="bold")
    ax.text(0.265, 0.183, "HT22 + H/R；EML 15/20/30 nm 距离梯度\n检验几何—表型剂量反应；G9 vs G6 判定依赖性",
            ha="center", va="center", fontsize=8.8, color=INK, linespacing=1.5)
    arrow(ax, 0.48, 0.212, 0.525, 0.212, c=MUTED, lw=2.0, ms=12)
    box(ax, 0.53, 0.115, 0.415, 0.195, "", fc="#EDF3FA", ec=BLUE, lw=2.0)
    ax.text(0.7375, 0.272, "⑥ 完整机制模型", ha="center", va="center", fontsize=10.5, color=BLUE, weight="bold")
    ax.text(0.7375, 0.183, "ERMCS 几何重塑 → 脂质过氧化 / 下游通路\n→ 认知损害 → BHD 干预",
            ha="center", va="center", fontsize=8.8, color=INK, linespacing=1.5)
    note(ax, "分层推进：每一层各自可独立成立，避免全链条同时失败", 8.5, MUTED, 0.03)
    save(fig, "f15")


# ── F17 单次低氧-复氧循环 ──────────────────────────────────────────
def f17():
    fig, ax = canvas(4.88, 5.43)
    title(ax, "队列 C：周期内取材时点", 11.5)
    axc = fig.add_axes([0.13, 0.42, 0.80, 0.36])
    t = np.linspace(0, 3, 900); o2 = np.empty_like(t)
    for i, ti in enumerate(t):
        ph = ti % 1.0
        if ph < 0.08: o2[i] = 21 - (21 - 7.5) * (ph / 0.08)
        elif ph < 0.5: o2[i] = 7.5
        elif ph < 0.58: o2[i] = 7.5 + (21 - 7.5) * ((ph - 0.5) / 0.08)
        else: o2[i] = 21
    axc.plot(t, o2, color=NAVY, lw=2)
    axc.fill_between(t, 7.5, o2, where=(o2 > 7.6), color=BLUE, alpha=0.10)
    axc.axvline(2.58, color=RED, lw=2, ls=(0, (4, 2)))
    axc.plot([2.58], [21], marker="v", color=RED, ms=10, clip_on=False)
    axc.text(2.50, 15.4, "取材\n复氧相结束即刻", color=RED, fontsize=8.6, weight="bold",
             ha="right", va="center", linespacing=1.4)
    axc.set_ylim(5, 23.5); axc.set_xlim(0, 3)
    axc.set_ylabel("吸入氧浓度 (%)", fontsize=8.5); axc.set_xlabel("时间（每循环 1 min）", fontsize=8.5)
    axc.set_yticks([7.5, 21]); axc.set_yticklabels(["7.5", "21"], fontsize=8)
    axc.set_xticks([0, 1, 2, 3]); axc.tick_params(labelsize=8)
    axc.spines[["top", "right"]].set_visible(False)
    ax.text(0.5, 0.335, "取材点选在复氧相 —— 因为链式过氧化在缺氧相受氧限制",
            ha="center", va="center", fontsize=9, color=RED, weight="bold")
    box(ax, 0.05, 0.055, 0.90, 0.245, "", fc="#F7F9FA", ec="#CBD5DC")
    ax.text(0.5, 0.272, "与原设计的对比", ha="center", va="center", fontsize=9.5, color=NAVY, weight="bold")
    for i, (a, b, c) in enumerate([("原设计", "W2 / W4 / W6 三时点，各 n=4", MUTED),
                                   ("问题", "三点同属慢性期，冗余且功效不足", RED),
                                   ("现设计", "两组各 n=8，复氧相即刻取材", NAVY),
                                   ("对照", "与队列 A 的 W6 构成急性 vs 慢性", NAVY)]):
        ax.text(0.09, 0.222 - i * 0.043, a, ha="left", va="center", fontsize=8.4, color=c, weight="bold")
        ax.text(0.28, 0.222 - i * 0.043, b, ha="left", va="center", fontsize=8.4, color=INK)
    save(fig, "f17")


# ── F17b 振荡接触模型 ──────────────────────────────────────────────
def f17b():
    fig, ax = canvas(6.5, 5.13)
    ax.text(0.5, 0.965, "振荡接触模型", ha="center", va="center", fontsize=12.5, color=NAVY, weight="bold")
    axc = fig.add_axes([0.10, 0.44, 0.86, 0.42])
    t = np.linspace(0, 42, 4000)
    baseline = 1.0 - 0.42 * (t / 42) ** 0.8
    pulses = np.zeros_like(t)
    for k in range(14):
        c = 1.5 + k * 3.0
        amp = 0.45 * (1 - 0.45 * k / 14)
        pulses += amp * np.exp(-((t - c) ** 2) / (2 * 0.32 ** 2))
    axc.plot(t, baseline, color=BLUE, lw=2.2, label="稳定耦合的基线（慢性下移）")
    axc.plot(t, baseline + pulses, color=RED, lw=1.3, alpha=0.9, label="复氧相瞬时脉冲（急性扩张）")
    for k in range(14):
        axc.axvspan(1.5 + k * 3.0 - 0.42, 1.5 + k * 3.0 + 0.42, color=RED, alpha=0.045)
    axc.set_xlim(0, 42); axc.set_ylim(0.35, 1.65)
    axc.set_xlabel("暴露时间（连续的低氧–复氧循环 → 数周）", fontsize=8.5)
    axc.set_ylabel("ERMCS 接触范围 / 通量", fontsize=8.5)
    axc.set_yticks([]); axc.set_xticks([])
    axc.legend(fontsize=8, frameon=False, loc="upper right")
    axc.spines[["top", "right"]].set_visible(False)
    axc.annotate("急性：扩张", xy=(4.5, 1.28), xytext=(7.5, 1.50), fontsize=8.4, color=RED,
                 weight="bold", arrowprops=dict(arrowstyle="->", color=RED, lw=1.2))
    axc.annotate("慢性：耦合丧失", xy=(38, 0.60), xytext=(27, 0.44), fontsize=8.4, color=BLUE,
                 weight="bold", arrowprops=dict(arrowstyle="->", color=BLUE, lw=1.2))
    ax.text(0.5, 0.365, "急性扩张与慢性破坏 = 同一过程的两个时间投影",
            ha="center", va="center", fontsize=10, color=NAVY, weight="bold")
    box(ax, 0.03, 0.055, 0.94, 0.275, "", fc="#FBEEEC", ec=RED)
    ax.text(0.5, 0.297, "为什么复氧相才是关键：氧限制的链式反应", ha="center", va="center",
            fontsize=9.5, color=RED, weight="bold")
    for i, (a, b) in enumerate([("缺氧相", "链式过氧化在过氧自由基步骤消耗氧 → 速率受限；底物与不稳定铁累积"),
                                ("复氧相", "氧被恢复到已被「预备」的膜上 → 链式反应被允许发生"),
                                ("推论", "支配变量是复氧转换的次数与陡度，而非平均氧张力")]):
        ax.text(0.06, 0.242 - i * 0.056, a, ha="left", va="center", fontsize=8.6, color=RED, weight="bold")
        ax.text(0.17, 0.242 - i * 0.056, b, ha="left", va="center", fontsize=8.4, color=INK)
    ax.text(0.5, 0.078, "可检验预测：累积低氧剂量相同时，少而长的循环 → 更少的磷脂过氧化",
            ha="center", va="center", fontsize=8.6, color=NAVY, weight="bold")
    save(fig, "f17b")


# ── F18 BHD 制备 + 指纹图谱 ────────────────────────────────────────
def f18():
    fig, ax = canvas(4.48, 5.43)
    title(ax, "制备流程与批次质控", 11.5)
    herbs = "制半夏 12 g · 厚朴 9 g · 茯苓 12 g\n生姜 15 g · 紫苏叶 6 g（共 54 g）"
    steps = [(herbs, "#F6E3C8", GOLD), ("10 倍量水浸泡 30 min", LIGHT, "#CBD5DC"),
             ("武火煮沸 → 文火 30 min → 滤过", LIGHT, "#CBD5DC"),
             ("药渣 8 倍量水复煎 20 min → 合并", LIGHT, "#CBD5DC"),
             ("水浴浓缩至 1.4 g/mL；每批留样 -80 ℃", "#EDF3FA", BLUE)]
    y = 0.845
    for i, (t, fc, ec) in enumerate(steps):
        hh = 0.085 if i == 0 else 0.062
        box(ax, 0.06, y, 0.88, hh, t, fc=fc, ec=ec, fs=8.2)
        if i < 4: arrow(ax, 0.5, y - 0.002, 0.5, y - 0.028, c=MUTED, lw=1.2)
        y -= hh + 0.032
    axc = fig.add_axes([0.14, 0.155, 0.79, 0.24])
    x = np.linspace(0, 10, 1500); sig = np.zeros_like(x)
    for c, a, w in [(1.2, 0.15, 0.09), (2.4, 0.22, 0.10), (3.6, 0.30, 0.09),
                    (5.1, 0.95, 0.11), (6.3, 0.78, 0.11), (7.6, 0.25, 0.10), (8.8, 0.18, 0.09)]:
        sig += a * np.exp(-((x - c) ** 2) / (2 * w ** 2))
    axc.plot(x, sig, color=NAVY, lw=1.3)
    axc.annotate("和厚朴酚", xy=(5.1, 0.95), xytext=(3.4, 1.12), fontsize=8, color=RED,
                 weight="bold", arrowprops=dict(arrowstyle="->", color=RED, lw=1))
    axc.annotate("厚朴酚", xy=(6.3, 0.78), xytext=(7.3, 1.05), fontsize=8, color=RED,
                 weight="bold", arrowprops=dict(arrowstyle="->", color=RED, lw=1))
    axc.set_ylim(0, 1.35); axc.set_xlim(0, 10)
    axc.set_xlabel("保留时间", fontsize=8); axc.set_ylabel("吸收", fontsize=8)
    axc.set_xticks([]); axc.set_yticks([])
    axc.spines[["top", "right"]].set_visible(False)
    ax.text(0.5, 0.095, "HPLC 指纹图谱（示意）", ha="center", va="center", fontsize=8.6, color=MUTED)
    ax.text(0.5, 0.04, "批间和厚朴酚浓度 CV ≤ 15%", ha="center", va="center",
            fontsize=9, color=RED, weight="bold")
    save(fig, "f18")


# ── F19 TEM 五指标 ─────────────────────────────────────────────────
def f19():
    fig, ax = canvas(5.28, 4.45)
    title(ax, "TEM 五指标定义", 11.5)
    ER_X, ER_W, ER_Y, ER_H = 0.10, 0.05, 0.44, 0.42
    CX, CY, A, B = 0.52, 0.65, 0.20, 0.165
    ax.add_patch(Rectangle((ER_X, ER_Y), ER_W, ER_H, fc="#F6E3C8", ec=GOLD, lw=1.7, zorder=2))
    ax.text(ER_X + ER_W / 2, ER_Y + ER_H + 0.035, "ER", ha="center", fontsize=8.6,
            color=GOLD, weight="bold")
    ax.add_patch(Ellipse((CX, CY), 2 * A, 2 * B, fc="#D9E6F2", ec=BLUE, lw=1.8, zorder=2))
    ax.text(CX + 0.045, CY, "线粒体", ha="center", va="center", fontsize=9, color=BLUE, zorder=4)
    for k in range(3):  # 嵴
        ax.plot([CX + 0.02 + k * 0.055, CX + 0.05 + k * 0.055],
                [CY + 0.085, CY + 0.045], color=BLUE, lw=0.9, alpha=0.55, zorder=3)

    # ③ 接触界面（沿线粒体面向 ER 的左弧）
    th = np.linspace(np.radians(148), np.radians(212), 120)
    ax.plot(CX + A * np.cos(th), CY + B * np.sin(th), color=RED, lw=3.6,
            solid_capstyle="round", zorder=5)
    # ④ ≤10 nm 紧密接触（③ 的子段）
    th2 = np.linspace(np.radians(170), np.radians(192), 60)
    ax.plot(CX + A * np.cos(th2), CY + B * np.sin(th2), color="#6E1F16", lw=3.6,
            solid_capstyle="round", zorder=6)

    # ① 膜间距
    ax.annotate("", xy=(CX - A + 0.004, CY), xytext=(ER_X + ER_W, CY),
                arrowprops=dict(arrowstyle="<|-|>", color=RED, lw=1.4, mutation_scale=8))
    ax.text((ER_X + ER_W + CX - A) / 2, CY + 0.055, "①", ha="center", va="center",
            fontsize=9.5, color=RED, weight="bold")
    ax.text(0.245, 0.755, "③", ha="center", va="center", fontsize=9.5, color=RED, weight="bold")
    ax.plot([0.262, 0.300], [0.752, 0.735], color=RED, lw=0.9)
    ax.text(0.245, 0.545, "④", ha="center", va="center", fontsize=9.5, color="#6E1F16", weight="bold")
    ax.plot([0.262, 0.310], [0.548, 0.575], color="#6E1F16", lw=0.9)
    ax.text(0.80, 0.845, "⑤", ha="center", va="center", fontsize=9.5, color=BLUE, weight="bold")
    ax.plot([0.788, 0.700], [0.838, 0.760], color=BLUE, lw=0.9)
    ax.text(0.795, 0.475, "②", ha="center", va="center", fontsize=9.5, color=NAVY, weight="bold")
    ax.plot([0.783, 0.680], [0.482, 0.545], color=NAVY, lw=0.9)

    items = [("①", "ER–线粒体接触间距（nm）", RED),
             ("②", "ERMICC ＝ 接触长度 ÷（线粒体周长 × 间距）", NAVY),
             ("③", "接触长度占线粒体外膜周长比例（%）", RED),
             ("④", "≤10 nm 紧密接触占总接触长度比例（%）", "#6E1F16"),
             ("⑤", "线粒体形态：长径 / 长短轴比 / 嵴密度 / 碎裂指数", BLUE)]
    for i, (n, t, c) in enumerate(items):
        y = 0.315 - i * 0.055
        ax.text(0.055, y, n, ha="left", va="center", fontsize=8.8, color=c, weight="bold")
        ax.text(0.115, y, t, ha="left", va="center", fontsize=8.4, color=INK)
    note(ax, "示意图，未按真实比例；② 为唯一主要终点（ERMICC_std）", 7.8, MUTED, 0.012)
    save(fig, "f19")


# ── F20 TEM SOP ────────────────────────────────────────────────────
def f20():
    fig, ax = canvas(4.48, 5.43)
    title(ax, "取材固定 SOP", 11.5)
    steps = [("经心脏灌注固定", "PBS 冲尽血液 → 4% PFA + 2.5% 戊二醛\n灌注质量是 ERMCS 保存的首要决定因素", RED),
             ("取材与初固定", "≤1 mm³ 小块；cacodylate 缓冲\n渗透压 300–330 mOsm；1–2 mM CaCl₂", NAVY),
             ("OsO₄ 后固定", "目标 ≤24 h 内完成\n必须延迟则转存稀固定液、4 ℃ 密封", NAVY),
             ("脱水 → 包埋 → 切片", "梯度乙醇 → Epon812 → 70–90 nm → 铀铅双染", MUTED),
             ("双盲定量", "系统随机取样；两人独立；差异 >15% 第三方仲裁", NAVY)]
    y = 0.845; hh = 0.115
    for i, (h, b, c) in enumerate(steps):
        box(ax, 0.05, y, 0.90, hh, "", fc="#FAFCFD", ec=c, lw=1.4)
        ax.text(0.085, y + hh - 0.032, h, ha="left", va="center", fontsize=9, color=c, weight="bold")
        ax.text(0.085, y + 0.032, b, ha="left", va="center", fontsize=7.6, color=INK, linespacing=1.4)
        if i < 4: arrow(ax, 0.5, y - 0.002, 0.5, y - 0.023, c=MUTED, lw=1.2)
        y -= hh + 0.027
    box(ax, 0.05, 0.055, 0.90, 0.135, "", fc="#FBEEEC", ec=RED, lw=2.0)
    ax.text(0.5, 0.155, "★ 全组配平铁律", ha="center", va="center", fontsize=10, color=RED, weight="bold")
    ax.text(0.5, 0.095, "Sham / CIH / CIH+BHD 必须同批次、同储存时长处理\n严禁某组先做、另一组后做",
            ha="center", va="center", fontsize=8.2, color=INK, linespacing=1.5)
    save(fig, "f20")


# ── F21 PLA 原理 + 四类对照 ────────────────────────────────────────
def f21():
    fig, ax = canvas(4.48, 5.15)
    title(ax, "原位 PLA 原理与对照设计", 11)
    box(ax, 0.04, 0.615, 0.92, 0.305, "", fc="#FAFCFD", ec="#CBD5DC", lw=1.1)
    ax.add_patch(Rectangle((0.10, 0.680), 0.045, 0.175, fc="#F6E3C8", ec=GOLD, lw=1.5, zorder=3))
    ax.text(0.1225, 0.872, "ER", ha="center", fontsize=8, color=GOLD, weight="bold")
    ax.add_patch(Ellipse((0.60, 0.7675), 0.30, 0.155, fc="#D9E6F2", ec=BLUE, lw=1.5, zorder=3))
    ax.text(0.635, 0.7675, "线粒体", ha="center", va="center", fontsize=8.2, color=BLUE, zorder=4)
    ax.plot([0.145, 0.205], [0.7675, 0.7675], color=GOLD, lw=2.2, zorder=4)
    ax.text(0.148, 0.712, "IP3R1", fontsize=7.6, color=GOLD, weight="bold", ha="left")
    ax.plot([0.450, 0.390], [0.7675, 0.7675], color=BLUE, lw=2.2, zorder=4)
    ax.text(0.365, 0.712, "VDAC1/3", fontsize=7.6, color=BLUE, weight="bold", ha="left")
    ax.add_patch(Circle((0.2975, 0.7675), 0.034, fc="none", ec=RED, lw=1.7,
                        ls=(0, (2, 1.5)), zorder=5))
    ax.text(0.2975, 0.7675, "<40 nm", ha="center", va="center", fontsize=6.6,
            color=RED, weight="bold", zorder=6)
    ax.text(0.5, 0.645, "邻近 → 探针连接 → 滚环扩增 → 荧光点", ha="center", va="center",
            fontsize=8.2, color=RED, weight="bold")
    ax.text(0.5, 0.578, "读出：CA1 锥体层每细胞荧光点数（dots per cell）",
            ha="center", va="center", fontsize=8.2, color=INK)

    box(ax, 0.04, 0.395, 0.92, 0.155, "", fc="#FBEEEC", ec=RED, lw=1.6)
    ax.text(0.5, 0.518, "★ mouse-on-mouse 背景问题", ha="center", va="center",
            fontsize=9, color=RED, weight="bold")
    ax.text(0.5, 0.445, "VDAC 一抗为鼠源、组织亦为小鼠脑 → 探针会结合内源性小鼠 IgG\n必须使用 M.O.M. 阻断试剂",
            ha="center", va="center", fontsize=8, color=INK, linespacing=1.5)

    ax.text(0.5, 0.348, "四类对照（须与实验样本同批处理）", ha="center", va="center",
            fontsize=9, color=NAVY, weight="bold")
    ctrls = [("A", "完整双一抗", "实验组"), ("B", "省略一抗、仅加探针", "判读背景"),
             ("C", "仅兔一抗（IP3R1）", "判非特异连接"), ("D", "仅鼠一抗（VDAC）", "判非特异连接")]
    for i, (n, t, u) in enumerate(ctrls):
        y = 0.285 - i * 0.055
        box(ax, 0.05, y - 0.023, 0.90, 0.046, "", fc="#FAFCFD" if i % 2 else LIGHT,
            ec="#DDE4E9", lw=0.9)
        ax.text(0.085, y, n, ha="left", va="center", fontsize=8.4, color=NAVY, weight="bold")
        ax.text(0.155, y, t, ha="left", va="center", fontsize=8.2, color=INK)
        ax.text(0.635, y, u, ha="left", va="center", fontsize=8, color=MUTED)
    note(ax, "指标表述：IP3R1 与 VDAC1/VDAC3 的邻近信号", 7.8, MUTED, 0.015)
    save(fig, "f21")


# ── F22 显微切割 + 双轴 ────────────────────────────────────────────
def f22():
    fig, ax = canvas(4.48, 5.43)
    title(ax, "CA1 显微切割与双轴分析", 11)
    th = np.linspace(0.35 * np.pi, 1.75 * np.pi, 200)
    ax.plot(0.46 + 0.26 * np.cos(th), 0.775 + 0.115 * np.sin(th), color=MUTED, lw=1.4)
    ax.plot(0.46 + 0.17 * np.cos(th), 0.775 + 0.072 * np.sin(th), color=MUTED, lw=1.4)
    th2 = np.linspace(0.62 * np.pi, 1.20 * np.pi, 80)
    ax.plot(0.46 + 0.215 * np.cos(th2), 0.775 + 0.094 * np.sin(th2), color=RED, lw=4, solid_capstyle="round")
    ax.text(0.30, 0.905, "CA1", fontsize=9, color=RED, weight="bold")
    ax.text(0.68, 0.845, "CA3", fontsize=8.2, color=MUTED)
    ax.text(0.50, 0.665, "DG", fontsize=8.2, color=MUTED)
    ax.text(0.5, 0.605, "冰冻切片 20 μm → 解剖镜下显微切割 CA1（每只 ≥3 mg）",
            ha="center", va="center", fontsize=8.2, color=INK)
    box(ax, 0.06, 0.505, 0.88, 0.062, "TMT 16-plex：12 生物学样本 + 4 pooled QC",
        fc="#EDF3FA", ec=BLUE, fs=8.4, weight="bold")
    ax.text(0.5, 0.455, "FDR<1%　鉴定 ≥6000　|FC|>1.2 且 P<0.05",
            ha="center", va="center", fontsize=8, color=MUTED)
    arrow(ax, 0.30, 0.425, 0.24, 0.375, c=RED, lw=1.6)
    arrow(ax, 0.70, 0.425, 0.76, 0.375, c=NAVY, lw=1.6)
    box(ax, 0.045, 0.145, 0.43, 0.225, "", fc="#FBEEEC", ec=RED, lw=1.6)
    ax.text(0.26, 0.335, "第一轴", ha="center", va="center", fontsize=9, color=RED, weight="bold")
    ax.text(0.26, 0.235, "ERMCS 富集分析\n\nGO:0044233\nSassano 2025 基因集\nMCSdb", ha="center",
            va="center", fontsize=7.8, color=INK, linespacing=1.5)
    box(ax, 0.525, 0.145, 0.43, 0.225, "", fc="#EDF3FA", ec=BLUE, lw=1.6)
    ax.text(0.74, 0.335, "第二轴", ha="center", va="center", fontsize=9, color=BLUE, weight="bold")
    ax.text(0.74, 0.235, "六类下游通路 GSEA\n\n铁死亡 · 凋亡 · 自噬\n突触 · 炎症 · 线粒体", ha="center",
            va="center", fontsize=7.8, color=INK, linespacing=1.5)
    ax.text(0.5, 0.085, "两轴共同判读 → M6 决策会议锁定方向",
            ha="center", va="center", fontsize=9, color=NAVY, weight="bold")
    note(ax, "海马结构为示意图", 8, MUTED, 0.02)
    save(fig, "f22")


# ── F23 决策树 ─────────────────────────────────────────────────────
def f23():
    fig, ax = canvas(12.23, 2.18)
    box(ax, 0.355, 0.76, 0.29, 0.21, "M6 决策会议\nERMCS 形态学 + 组学结果",
        fc="#FBEEEC", ec=RED, tc=RED, fs=9.5, weight="bold", lw=1.8)
    outs = [(0.035, "情形 A–F", "CIH 显著改变\n+ BHD 显著逆转", "按富集最强通路深挖\n配合距离梯度因果链", NAVY, "#FAFCFD"),
            (0.355, "情形 G（阴性）", "CIH 与 Sham 无显著差异", "阴性亦为结论，如实报告\n转向预设的 CA3/DG", RED, "#FBEEEC"),
            (0.675, "情形 H（反方向）", "CIH 显著减小接触", "改为「解偶联 / BHD 恢复接触」\n配合队列 C 提出时程依赖模型", RED, "#FBEEEC")]
    for x, tag, cond, act, c, fc in outs:
        box(ax, x, 0.06, 0.29, 0.56, "", fc=fc, ec=c, lw=1.6)
        ax.text(x + 0.145, 0.545, tag, ha="center", va="center", fontsize=9.5, color=c, weight="bold")
        ax.text(x + 0.145, 0.415, cond, ha="center", va="center", fontsize=8.2, color=MUTED)
        ax.text(x + 0.145, 0.215, act, ha="center", va="center", fontsize=8.4, color=INK, linespacing=1.5)
        arrow(ax, 0.5, 0.755, x + 0.145, 0.635, c=MUTED, lw=1.4)
    ax.text(0.015, 0.90, "完整八情形表见备用页 B7", ha="left", va="center",
            fontsize=8, color=MUTED)
    save(fig, "f23")


# ── F24 10 组设计矩阵 ──────────────────────────────────────────────
def f24():
    fig, ax = canvas(4.58, 5.43)
    title(ax, "体外 10 组设计", 11.5)
    rows = [("G1", "Vehicle + mRFP", "常氧", "基线", GREY),
            ("G2", "H/R + mRFP", "H/R", "阳性损伤模型", RED),
            ("G3", "H/R + mRFP + BHD", "H/R", "BHD 体外保护", TEAL),
            ("G4", "H/R + 15 nm-EML", "H/R", "距离梯度 1", BLUE),
            ("G5", "H/R + 20 nm-EML", "H/R", "距离梯度 2", BLUE),
            ("G6", "H/R + 30 nm-EML", "H/R", "距离梯度 3", BLUE),
            ("G7", "H/R + 15 nm + BHD", "H/R", "紧接触时 BHD 是否起效", TEAL),
            ("G8", "H/R + 20 nm + BHD", "H/R", "中等接触时 BHD 效应", TEAL),
            ("G9", "H/R + 30 nm + BHD", "H/R", "★ 与 G6 配对：依赖性判据", RED),
            ("G10", "（可选）H/R + 5 nm", "H/R", "加分组", MUTED)]
    y = 0.885; hh = 0.076
    for i, (g, tr, cond, aim, c) in enumerate(rows):
        hi = g in ("G6", "G9")
        box(ax, 0.04, y - hh, 0.92, hh - 0.008, "",
            fc="#FBEEEC" if hi else ("#FAFCFD" if i % 2 else LIGHT),
            ec=RED if hi else "#DDE4E9", lw=1.6 if hi else 0.9)
        ax.text(0.075, y - hh / 2, g, ha="left", va="center", fontsize=8.6,
                color=c, weight="bold")
        ax.text(0.155, y - hh / 2, tr, ha="left", va="center", fontsize=8, color=INK)
        ax.text(0.545, y - hh / 2, aim, ha="left", va="center", fontsize=7.8,
                color=RED if hi else MUTED, weight="bold" if hi else "normal")
        y -= hh
    ax.annotate("", xy=(0.028, y + hh * 1.0), xytext=(0.028, y + hh * 4.0),
                arrowprops=dict(arrowstyle="<|-|>", color=RED, lw=1.6, mutation_scale=7))
    ax.text(0.5, 0.075, "每组 3 复孔 × ≥4 次独立实验",
            ha="center", va="center", fontsize=9, color=NAVY, weight="bold")
    ax.text(0.5, 0.028, "独立实验次数才是统计单位；复孔仅降低技术噪声，不计入 n",
            ha="center", va="center", fontsize=8, color=RED)
    save(fig, "f24")


# ── F25 钟形 vs 单调 ───────────────────────────────────────────────
def f25():
    fig, ax = canvas(4.38, 5.15)
    title(ax, "距离–结局关系：形状不预设", 10.5)
    d = np.linspace(12, 33, 300)
    a1 = fig.add_axes([0.17, 0.615, 0.77, 0.245])
    a1.plot(d, 0.30 + 0.62 * np.exp(-((d - 20) ** 2) / (2 * 4.6 ** 2)), color=BLUE, lw=2.2)
    a1.set_title("钟形（存在最优距离）", fontsize=9.5, color=BLUE, pad=5)
    a2 = fig.add_axes([0.17, 0.285, 0.77, 0.245])
    a2.plot(d, 0.92 - 0.030 * (d - 12), color=MUTED, lw=2.2)
    a2.set_title("单调（越远越轻）", fontsize=9.5, color=MUTED, pad=5)
    for a in (a1, a2):
        a.set_xlim(12, 33); a.set_ylim(0.15, 1.05)
        a.set_xticks([15, 20, 30]); a.set_xticklabels(["15", "20", "30"], fontsize=8)
        a.set_yticks([]); a.tick_params(labelsize=8)
        a.spines[["top", "right"]].set_visible(False)
        a.set_ylabel("功能 / 损伤", fontsize=8)
        for x in (15, 20, 30):
            a.axvline(x, color="#DDE4E9", lw=0.9, ls=(0, (3, 3)), zorder=0)
    a2.set_xlabel("ER–线粒体膜间距 (nm)", fontsize=8)
    a1.annotate("峰值约 20 nm\n（钙转移 / 氧化代谢已知）", xy=(20.4, 0.90), xytext=(23.2, 0.40),
                fontsize=7.8, color=BLUE, linespacing=1.4,
                arrowprops=dict(arrowstyle="->", color=BLUE, lw=1))
    box(ax, 0.04, 0.030, 0.92, 0.125, "", fc="#FBEEEC", ec=RED, lw=1.6)
    ax.text(0.5, 0.127, "铁死亡易感性是哪一种？", ha="center", va="center",
            fontsize=9, color=RED, weight="bold")
    ax.text(0.5, 0.070, "尚无研究在距离梯度上验证过 —— 这正是本模块要回答的问题\n两步检验：整体效应 + 线性与二次对比并列拟合",
            ha="center", va="center", fontsize=8, color=INK, linespacing=1.5)
    save(fig, "f25")


# ── F26 三层嵌套 ───────────────────────────────────────────────────
def f26():
    fig, ax = canvas(4.28, 5.43)
    title(ax, "数据的三层嵌套结构", 11)
    box(ax, 0.05, 0.30, 0.90, 0.56, "", fc="#EDF3FA", ec=BLUE, lw=2.2)
    ax.text(0.5, 0.825, "动物　n = 8 / 组", ha="center", va="center",
            fontsize=10, color=BLUE, weight="bold")
    for k in range(2):
        bx = 0.10 + k * 0.44
        box(ax, bx, 0.375, 0.40, 0.40, "", fc="#FAFCFD", ec=MUTED, lw=1.4)
        ax.text(bx + 0.20, 0.715, "神经元 5–8 个/只", ha="center", va="center",
                fontsize=8.4, color=MUTED, weight="bold")
        for j in range(6):
            r, c = divmod(j, 3)
            ax.add_patch(Ellipse((bx + 0.09 + c * 0.11, 0.615 - r * 0.115), 0.075, 0.055,
                                 fc="#D9E6F2", ec=BLUE, lw=0.9, zorder=3))
        ax.text(bx + 0.20, 0.415, "线粒体 ≥8 个/神经元", ha="center", va="center",
                fontsize=7.6, color=MUTED)
    ax.annotate("", xy=(0.028, 0.86), xytext=(0.028, 0.30),
                arrowprops=dict(arrowstyle="-", color=BLUE, lw=3))
    ax.text(0.5, 0.245, "▲ 统计单位在动物这一层", ha="center", va="center",
            fontsize=10, color=RED, weight="bold")
    box(ax, 0.05, 0.045, 0.90, 0.175, "", fc="#FBEEEC", ec=RED, lw=1.6)
    ax.text(0.5, 0.188, "指标 ~ 组别 + (1 | 动物/神经元)", ha="center", va="center",
            fontsize=9.5, color=RED, weight="bold")
    ax.text(0.5, 0.105, "报告 n 时必须报动物数\n严禁以接触点数作 n —— 那构成伪重复，\n会低估标准误、使 P 值虚低",
            ha="center", va="center", fontsize=8.2, color=INK, linespacing=1.5)
    save(fig, "f26")


# ── F35 机制总图 ───────────────────────────────────────────────────
def f35():
    fig, ax = canvas(4.83, 4.6)
    fig.patch.set_facecolor("#0B3C5D")
    ax.set_facecolor("#0B3C5D")
    ax.text(0.5, 0.965, "完整机制模型", ha="center", va="center",
            fontsize=11.5, color="#FFFFFF", weight="bold")
    chain = [("CIH 反复低氧–复氧", "#9FC3D8"), ("ERMCS 几何病理性重塑", "#FFFFFF"),
             ("磷脂过氧化的传播与放大", "#FFFFFF"), ("海马 CA1 神经元损伤", "#9FC3D8"),
             ("海马依赖性认知障碍", "#9FC3D8")]
    y = 0.815; hh = 0.115
    for i, (t, tc) in enumerate(chain):
        hi = i in (1, 2)
        ax.add_patch(FancyBboxPatch((0.10, y), 0.66, hh,
                                    boxstyle="round,pad=0,rounding_size=0.02",
                                    fc="#1B5375" if hi else "#123F60",
                                    ec="#C0392B" if hi else "#2E6488", lw=1.6, zorder=2))
        ax.text(0.43, y + hh / 2, t, ha="center", va="center", fontsize=9,
                color=tc, weight="bold" if hi else "normal", zorder=3)
        if i < 4:
            arrow(ax, 0.43, y - 0.004, 0.43, y - 0.041, c="#5E8FAC", lw=1.6)
        y -= hh + 0.045
    ax.annotate("", xy=(0.80, 0.70), xytext=(0.80, 0.28),
                arrowprops=dict(arrowstyle="-|>", color="#7FD1B0", lw=2.2, mutation_scale=11))
    ax.text(0.845, 0.49, "BHD\n使几何\n趋向\nSham", ha="left", va="center",
            fontsize=8.6, color="#7FD1B0", weight="bold", linespacing=1.5)
    ax.text(0.5, 0.095, "几何 = 传播与放大的控制变量", ha="center", va="center",
            fontsize=9, color="#F5B7B1", weight="bold")
    ax.text(0.5, 0.04, "driver vs amplifier 由队列 C 判定", ha="center", va="center",
            fontsize=8, color="#9FC3D8")
    fig.savefig(f"{OUT}/f35.png", facecolor="#0B3C5D")
    plt.close(fig); print("   f35")


if __name__ == "__main__":
    print("生成示意图：")
    for fn in [f03, f04, f05, f07, f09, f10, f11, f12, f13, f14, f15,
               f17, f17b, f18, f19, f20, f21, f22, f23, f24, f25, f26, f35]:
        fn()
    print("完成，共 23 张 →", OUT)
