#!/usr/bin/env python3
"""预实验（Pilot V4.5 赛道 A）配图 —— 数据源：《预实验造模验证与行为学结果》

C57BL/6J 雄性 9 只，Sham / CIH / CIH+BHD 各 n=3；CIH 4 周，NOR 于造模结束后进行。
仅有组水平的均值±标准差，故不绘制个体散点。
用法：python3 scripts/make_pilot_figures.py → figures/fp1.png fp2.png fp3.png
"""
import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import FancyBboxPatch

for cand in ["WenQuanYi Zen Hei", "Noto Sans CJK SC", "Source Han Sans SC", "SimHei"]:
    if any(cand in f.name for f in font_manager.fontManager.ttflist):
        plt.rcParams["font.sans-serif"] = [cand]; break
plt.rcParams.update({"axes.unicode_minus": False, "savefig.dpi": 220})

NAVY = "#0B3C5D"; RED = "#C0392B"; BLUE = "#1F6FB4"; GREY = "#6E6E6E"
LIGHT = "#F2F5F7"; INK = "#1F2933"; MUTED = "#5A6B7B"; GOLD = "#B08333"
GROUPS = ["Sham", "CIH", "CIH+BHD"]
COL = [GREY, RED, BLUE]
MRK = ["o", "s", "^"]
OUT = "figures"; os.makedirs(OUT, exist_ok=True)


def bars(ax, means, sds, ylabel, ptxt=None, fs=9, ymin=None):
    x = np.arange(3)
    for i in range(3):
        ax.bar(i, means[i], width=0.62, color=COL[i], alpha=0.28,
               edgecolor=COL[i], linewidth=1.6, zorder=1)
        ax.errorbar(i, means[i], yerr=sds[i], fmt="none", ecolor=COL[i],
                    elinewidth=1.6, capsize=5, capthick=1.6, zorder=2)
    ax.set_xticks(x); ax.set_xticklabels(GROUPS, fontsize=fs)
    ax.set_ylabel(ylabel, fontsize=fs)
    ax.tick_params(labelsize=fs - 0.5)
    ax.spines[["top", "right"]].set_visible(False)
    top = max(m + s for m, s in zip(means, sds))
    lo = ymin if ymin is not None else 0
    ax.set_ylim(lo, lo + (top - lo) * 1.32)
    if ptxt:
        ax.text(0.5, 0.965, ptxt, transform=ax.transAxes, ha="center", va="top",
                fontsize=fs - 0.5, color=MUTED)


def note_box(fig, x, y, w, h, head, body, ec=RED, fc="#FBEEEC", hfs=10, bfs=8.6):
    ax = fig.add_axes([x, y, w, h]); ax.axis("off")
    ax.add_patch(FancyBboxPatch((0, 0), 1, 1, boxstyle="round,pad=0,rounding_size=0.02",
                                fc=fc, ec=ec, lw=1.6, transform=ax.transAxes))
    ax.text(0.5, 0.78, head, ha="center", va="center", fontsize=hfs, color=ec,
            weight="bold", transform=ax.transAxes)
    ax.text(0.5, 0.34, body, ha="center", va="center", fontsize=bfs, color=INK,
            transform=ax.transAxes, linespacing=1.5)


# ── fp1 造模验证：体重 ───────────────────────────────────────────────
def fp1():
    fig = plt.figure(figsize=(6.0, 4.6))
    fig.text(0.5, 0.965, "造模验证：4 周体重变化", ha="center", va="top",
             fontsize=11.5, color=NAVY, weight="bold")

    a1 = fig.add_axes([0.10, 0.575, 0.37, 0.315])
    base = [19.77, 20.20, 19.90]; fin = [23.90, 22.60, 21.20]
    bsd = [0.06, 0.17, 0.35]; fsd = [0.30, 0.20, 0.26]
    for i in range(3):
        a1.errorbar([0, 1], [base[i], fin[i]], yerr=[bsd[i], fsd[i]], color=COL[i],
                    marker=MRK[i], ms=6, lw=2, capsize=4, mfc="white", mew=1.6,
                    label=GROUPS[i])
    a1.set_xlim(-0.25, 1.25); a1.set_xticks([0, 1])
    a1.set_xticklabels(["第 0 天", "第 28 天"], fontsize=8.5)
    a1.set_ylabel("体重 (g)", fontsize=8.5); a1.tick_params(labelsize=8)
    a1.legend(fontsize=7.6, frameon=False, loc="upper left")
    a1.spines[["top", "right"]].set_visible(False)
    a1.set_title("体重", fontsize=9.5, color=NAVY, pad=4)

    a2 = fig.add_axes([0.60, 0.575, 0.36, 0.315])
    bars(a2, [4.13, 2.40, 1.30], [0.25, 0.10, 0.10], "28 d 增重 (g)",
         "ANOVA P < 0.001", fs=8.5)
    a2.set_title("增重", fontsize=9.5, color=NAVY, pad=4)
    a2.annotate("", xy=(1, 2.40 + 0.35), xytext=(0, 4.13 + 0.45),
                arrowprops=dict(arrowstyle="-", color=INK, lw=1))
    a2.text(0.5, 4.62, "-41.9%   d = -9.05", ha="center", fontsize=7.6, color=RED, weight="bold")

    ax = fig.add_axes([0.06, 0.285, 0.90, 0.215]); ax.axis("off")
    rows = [["", "Sham", "CIH", "CIH+BHD", "ANOVA P"],
            ["基线体重 (g)", "19.77±0.06", "20.20±0.17", "19.90±0.35", "0.132"],
            ["终末体重 (g)", "23.90±0.30", "22.60±0.20", "21.20±0.26", "<0.001"],
            ["28 d 增重 (g)", "4.13±0.25", "2.40±0.10", "1.30±0.10", "<0.001"],
            ["增重率 (%)", "20.91±1.23", "11.88±0.51", "6.54±0.61", "<0.001"]]
    colx = [0.0, 0.30, 0.475, 0.655, 0.855]
    for r, row in enumerate(rows):
        yy = 1 - r * 0.205
        if r == 0:
            ax.add_patch(FancyBboxPatch((0, yy - 0.155), 1, 0.175,
                                        boxstyle="round,pad=0,rounding_size=0.01",
                                        fc=NAVY, ec=NAVY, transform=ax.transAxes))
        for c, cell in enumerate(row):
            ax.text(colx[c] + (0.02 if c == 0 else 0), yy - 0.068, cell,
                    ha="left" if c == 0 else "center", va="center",
                    fontsize=8, color="white" if r == 0 else INK,
                    weight="bold" if r == 0 else "normal", transform=ax.transAxes)
    note_box(fig, 0.06, 0.045, 0.90, 0.20,
             "★ 需主动交代：CIH+BHD 增重低于 CIH（1.30 vs 2.40 g，d = -11.00）",
             "提示 7.01 g/kg/d 可能存在胃肠道反应或摄食抑制\n"
             "主实验拟增加摄食量与饮水量监测，并考虑设置半剂量组",
             hfs=9, bfs=8.2)
    fig.savefig(f"{OUT}/fp1.png", facecolor="white"); plt.close(fig); print("   fp1")


# ── fp2 运动与动机 ──────────────────────────────────────────────────
def fp2():
    fig = plt.figure(figsize=(12.2, 4.0))
    fig.text(0.5, 0.965, "运动与探索动机：Sham 正常 → CIH 恶化 → CIH+BHD 回复",
             ha="center", va="top", fontsize=12.5, color=NAVY, weight="bold")
    specs = [([903.2, 666.2, 961.6], [113.1, 198.6, 95.1], "总路程 (cm)", "ANOVA P = 0.094"),
             ([22.89, 39.10, 20.09], [5.16, 17.08, 3.01], "不动时间占比 (%)", "K–W P = 0.061"),
             ([71.7, 227.7, 113.8], [69.7, 82.6, 55.8], "新物体接近潜伏期 (s)", "ANOVA P = 0.080"),
             ([45.80, 116.46, 54.35], [1.44, 48.15, 13.21], "蜷缩姿态时间 (s)", "ANOVA P = 0.046")]
    for i, (m, sd, ylab, pt) in enumerate(specs):
        a = fig.add_axes([0.055 + i * 0.243, 0.335, 0.175, 0.50])
        bars(a, m, sd, ylab, pt, fs=8.5)
    ax = fig.add_axes([0.045, 0.045, 0.91, 0.215]); ax.axis("off")
    ax.add_patch(FancyBboxPatch((0, 0), 1, 1, boxstyle="round,pad=0,rounding_size=0.02",
                                fc="#EDF3FA", ec=BLUE, lw=1.6, transform=ax.transAxes))
    ax.text(0.5, 0.72, "四项指标方向一致，且均满足预设的方向性信号标准（P<0.10 或 |d|≥0.8）",
            ha="center", va="center", fontsize=10, color=BLUE, weight="bold", transform=ax.transAxes)
    ax.text(0.5, 0.28,
            "熟悉期「分析区进入次数」是本轮唯一 P<0.05 的行为学项目：Sham 17.67±4.04 vs CIH 6.67±0.58（P=0.024，d = -3.81）　·　"
            "28 d 增重与总路程、不动时间、DI 均无相关（|r|≤0.13），排除体重差异所致",
            ha="center", va="center", fontsize=8.4, color=INK, transform=ax.transAxes)
    fig.savefig(f"{OUT}/fp2.png", facecolor="white"); plt.close(fig); print("   fp2")


# ── fp3 NOR 辨别指数与质控 ──────────────────────────────────────────
def fp3():
    fig = plt.figure(figsize=(7.0, 4.4))
    fig.text(0.5, 0.965, "新物体识别：本轮未建立有效的辨别记忆读出",
             ha="center", va="top", fontsize=11.5, color=NAVY, weight="bold")

    a1 = fig.add_axes([0.085, 0.375, 0.375, 0.475])
    m = [0.31, 0.24, 0.42]; sd = [0.45, 0.07, 0.39]
    x = np.arange(3)
    a1.axhline(0, color="k", lw=1.1, zorder=0)
    for i in range(3):
        a1.bar(i, m[i], width=0.62, color=COL[i], alpha=0.28,
               edgecolor=COL[i], linewidth=1.6, zorder=1)
        a1.errorbar(i, m[i], yerr=sd[i], fmt="none", ecolor=COL[i], elinewidth=1.6,
                    capsize=5, capthick=1.6, zorder=2)
    for i, p in enumerate(["P=0.356", "P=0.030", "P=0.204"]):
        a1.text(i, -0.72, f"对 0：{p}", ha="center", fontsize=7.4,
                color=RED if i == 1 else MUTED)
    a1.set_xticks(x); a1.set_xticklabels(GROUPS, fontsize=8.5)
    a1.set_ylabel("辨别指数 DI", fontsize=8.5); a1.set_ylim(-0.85, 1.0)
    a1.tick_params(labelsize=8); a1.spines[["top", "right"]].set_visible(False)
    a1.set_title("组间无差异　ANOVA P = 0.826", fontsize=9, color=MUTED, pad=4)

    a2 = fig.add_axes([0.60, 0.375, 0.36, 0.475])
    bars(a2, [42.88, 14.66, 10.24], [31.32, 12.91, 6.10], "测试期总探索时间 (s)",
         "ANOVA P = 0.173", fs=8.5)
    a2.axhline(20, color=RED, lw=1.4, ls=(0, (4, 2)))
    a2.text(2.42, 21.5, "20 s 纳入阈值", ha="right", fontsize=7.6, color=RED)
    tops = [42.88 + 31.32, 14.66 + 12.91, 10.24 + 6.10]
    for i, t in enumerate(["2/3", "1/3", "0/3"]):
        a2.text(i, tops[i] + 3.5, f"达标 {t}", ha="center", fontsize=7.6,
                color=RED if i == 2 else MUTED, weight="bold" if i == 2 else "normal")
    a2.set_title("探索时长普遍不足", fontsize=9, color=MUTED, pad=4)

    note_box(fig, 0.045, 0.045, 0.91, 0.265,
             "★ 内部效度不成立 —— 本轮结果不足以判断 CIH 或 BHD 对识别记忆的影响",
             "正常对照组自身未表现出可靠的新物体偏好（DI 对 0：P=0.356，95% CI -0.81 至 +1.42）\n"
             "组内新旧物体探索时间亦无差异（P=0.393）；测试期达标率仅 3/9，CIH+BHD 组 0/3\n"
             "→ 该结论需在方法学优化后重新评估（见下页）", hfs=9.5, bfs=8.2)
    fig.savefig(f"{OUT}/fp3.png", facecolor="white"); plt.close(fig); print("   fp3")


if __name__ == "__main__":
    print("生成预实验配图：")
    fp1(); fp2(); fp3()
    print("完成 →", OUT)
