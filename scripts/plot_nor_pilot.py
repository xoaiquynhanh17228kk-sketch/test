#!/usr/bin/env python3
"""预实验行为学配图（开题 PPT 第 27b / 27c 页）

Fig 1（27b）：CIH 造模有效性 —— 自发活动与探索行为
Fig 2（27c）：NOR 范式未成立 —— 判别指数与纳入阈值

数据：2026-07-27 旷场-迷宫-黑白箱导出，Sham/CIH/CIH+BHD 各 n=3
用法：python3 scripts/plot_nor_pilot.py [训练期.xlsx] [测试期.xlsx]
"""
import sys, os
import numpy as np
import openpyxl
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from scipy import stats

# ---------- 中文字体 ----------
for cand in ["WenQuanYi Zen Hei", "Noto Sans CJK SC", "Source Han Sans SC", "SimHei"]:
    if any(cand in f.name for f in font_manager.fontManager.ttflist):
        plt.rcParams["font.sans-serif"] = [cand]
        break
plt.rcParams.update({
    "axes.unicode_minus": False,
    "font.size": 11,
    "axes.linewidth": 1.0,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "xtick.direction": "out",
    "ytick.direction": "out",
    "figure.dpi": 120,
    "savefig.dpi": 400,
    "savefig.bbox": "tight",
})

# 全篇统一配色：Sham 灰 / CIH 红 / CIH+BHD 蓝（冗余编码：标记形状不同）
COL = {"Sham": "#6E6E6E", "CIH": "#C0392B", "CIH+BHD": "#1F6FB4"}
MRK = {"Sham": "o", "CIH": "s", "CIH+BHD": "^"}
ORDER = ["Sham", "CIH", "CIH+BHD"]
IDS = {
    "Sham": ["对照1", "对照2", "对照3"],
    "CIH": ["CIH-1", "CIH-2", "CIH-3"],
    "CIH+BHD": ["CHI-BIO-CD3-1", "CHI-BIO-CD3-2", "CHI-BIO-CD3-3"],
}


def load(path):
    ws = openpyxl.load_workbook(path, data_only=True).active
    d = {}
    for r in list(ws.iter_rows(values_only=True))[3:]:
        if r[6] is None:
            continue
        d[str(r[6]).strip()] = dict(
            dist=float(r[10]), speed=float(r[11]), immob=float(r[13]),
            objA=float(r[27]), objB=float(r[31]),
            latA=float(r[29]), latB=float(r[33]),
        )
    return d


def hedges_g(x, y):
    n1, n2 = len(x), len(y)
    sp = np.sqrt(((n1 - 1) * x.std(ddof=1) ** 2 + (n2 - 1) * y.std(ddof=1) ** 2) / (n1 + n2 - 2))
    return (x.mean() - y.mean()) / sp * (1 - 3 / (4 * (n1 + n2) - 9))


def bracket(ax, x1, x2, y, h, text, fs=9):
    ax.plot([x1, x1, x2, x2], [y, y + h, y + h, y], lw=1.0, c="k", clip_on=False)
    ax.text((x1 + x2) / 2, y + h, text, ha="center", va="bottom", fontsize=fs, clip_on=False)


def panel(ax, vals, ylabel, title, fmt="{:.0f}", pad=0.30):
    """柱 + SD 误差棒 + 个体散点，并标注两两 p 与 Hedges' g"""
    rng = np.random.default_rng(7)
    for i, g in enumerate(ORDER):
        v = vals[g]
        ax.bar(i, v.mean(), width=0.60, color=COL[g], alpha=0.28,
               edgecolor=COL[g], linewidth=1.6, zorder=1)
        ax.errorbar(i, v.mean(), yerr=v.std(ddof=1), fmt="none",
                    ecolor=COL[g], elinewidth=1.6, capsize=5, capthick=1.6, zorder=2)
        ax.scatter(i + rng.uniform(-0.11, 0.11, len(v)), v, s=34, marker=MRK[g],
                   facecolor="white", edgecolor=COL[g], linewidth=1.5, zorder=3)

    top = max(vals[g].mean() + vals[g].std(ddof=1) for g in ORDER)
    lo = min(0, min(vals[g].min() for g in ORDER))
    span = top - lo

    p01 = stats.ttest_ind(vals["Sham"], vals["CIH"]).pvalue
    g01 = hedges_g(vals["Sham"], vals["CIH"])
    p12 = stats.ttest_ind(vals["CIH"], vals["CIH+BHD"]).pvalue
    g12 = hedges_g(vals["CIH+BHD"], vals["CIH"])
    bracket(ax, 0, 1, lo + span * 1.06, span * 0.035,
            f"p={p01:.3f}, g={g01:+.2f}")
    bracket(ax, 1, 2, lo + span * 1.24, span * 0.035,
            f"p={p12:.3f}, g={g12:+.2f}")

    ax.set_xticks(range(3))
    ax.set_xticklabels(ORDER, fontsize=10)
    ax.set_ylabel(ylabel, fontsize=11)
    ax.set_title(title, fontsize=12, pad=8)
    ax.set_ylim(lo, lo + span * (1.0 + pad + 0.10))


def fig_model_validation(tr, te, out):
    fig, axes = plt.subplots(1, 3, figsize=(11.8, 3.9))
    fig.subplots_adjust(wspace=0.34)
    # 注：平均速度 = 总路程 / 300 s，与总路程完全共线，故不单列；
    #     改以训练期总路程展示效应在两个独立时段的复现性。
    specs = [
        (te, "dist", "总路程 (cm)", "测试期 自发活动"),
        (tr, "dist", "总路程 (cm)", "训练期 自发活动（独立复现）"),
        (te, "immob", "不动时间 (%)", "测试期 不动时间占比"),
    ]
    for ax, (src, key, ylab, title) in zip(axes, specs):
        panel(ax, {g: np.array([src[i][key] for i in IDS[g]]) for g in ORDER}, ylab, title)

    fig.suptitle("预实验：CIH 造模有效性验证（旷场自发活动，n=3/组）",
                 fontsize=13.5, y=1.06, fontweight="bold")
    fig.text(0.5, -0.10,
             "柱=均值，误差棒=SD，散点=个体值；独立样本 t 检验（双侧，未校正），g = Hedges' g。\n"
             "n=3/组，为趋势性预实验证据，正式实验按队列 A n=8/组执行。",
             ha="center", fontsize=9, color="#444444")
    fig.savefig(out)
    plt.close(fig)
    print("saved:", out)


def fig_nor_failure(tr, te, out):
    fig, axes = plt.subplots(1, 2, figsize=(9.4, 4.2),
                             gridspec_kw={"width_ratios": [1, 1.15]})
    rng = np.random.default_rng(11)

    # (a) 判别指数 DI
    ax = axes[0]
    ax.axhline(0, color="k", lw=1.1, ls="-", zorder=0)
    ax.axhspan(0, 1, color="#2E8B57", alpha=0.05, zorder=0)
    ax.axhspan(-1, 0, color="#C0392B", alpha=0.05, zorder=0)
    for i, g in enumerate(ORDER):
        di = np.array([(te[k]["objB"] - te[k]["objA"]) / (te[k]["objB"] + te[k]["objA"])
                       for k in IDS[g]])
        ax.bar(i, di.mean(), width=0.60, color=COL[g], alpha=0.28,
               edgecolor=COL[g], linewidth=1.6, zorder=1)
        ax.errorbar(i, di.mean(), yerr=di.std(ddof=1), fmt="none", ecolor=COL[g],
                    elinewidth=1.6, capsize=5, capthick=1.6, zorder=2)
        ax.scatter(i + rng.uniform(-0.11, 0.11, 3), di, s=34, marker=MRK[g],
                   facecolor="white", edgecolor=COL[g], linewidth=1.5, zorder=3)
        p = stats.ttest_1samp(di, 0).pvalue
        star = " ★" if p < 0.05 else ""
        ax.text(i, 0.42, f"vs 0\np={p:.3f}{star}", ha="center", va="bottom", fontsize=8.5,
                color="#C0392B" if p < 0.05 else "#666666",
                fontweight="bold" if p < 0.05 else "normal")
    ax.set_xticks(range(3)); ax.set_xticklabels(ORDER, fontsize=10)
    ax.set_ylim(-1.05, 1.05)
    ax.set_ylabel("判别指数 DI = (新-旧)/(新+旧)\n↓ 偏好旧物体　　↑ 偏好新物体（预期方向）", fontsize=10.5)
    ax.set_title("(a) 新物体判别指数", fontsize=12, pad=8)
    ax.text(0.5, 0.955, "对照组显著偏好旧物体 → 范式未成立", transform=ax.transAxes,
            ha="center", va="top", fontsize=10, color="#C0392B", fontweight="bold")

    # (b) 探究总时间 vs 20 s 纳入阈值
    ax = axes[1]
    ax.axhline(20, color="#C0392B", lw=1.3, ls="--", zorder=0)
    ax.text(0.015, 22.0, "纳入阈值 20 s", ha="left", fontsize=9,
            color="#C0392B", transform=ax.get_yaxis_transform())
    xs, labels = [], []
    pos = 0
    for g in ORDER:
        for k in IDS[g]:
            t1 = tr[k]["objA"] + tr[k]["objB"]
            t2 = te[k]["objA"] + te[k]["objB"]
            excl = (t1 < 20) or (t2 < 20)
            ax.plot([pos - 0.17, pos + 0.17], [t1, t1], lw=2.4, color=COL[g], alpha=0.45)
            ax.scatter(pos, t2, s=52, marker=MRK[g],
                       facecolor="white" if not excl else COL[g],
                       edgecolor=COL[g], linewidth=1.8, zorder=3)
            if excl:
                ax.annotate("排除", xy=(pos, t2), xytext=(pos, t2 - 13), fontsize=8.5,
                            color="#C0392B", ha="center", fontweight="bold")
            xs.append(pos)
            labels.append(k.replace("CHI-BIO-CD3", "BHD").replace("对照", "Sham"))
            pos += 1
        pos += 0.5
    ax.set_xticks(xs); ax.set_xticklabels(labels, rotation=45, ha="right", fontsize=8.5)
    ax.set_ylabel("物体探究总时间 (s)", fontsize=11)
    ax.set_title("(b) 探究总时间与纳入排除", fontsize=12, pad=8)
    ax.set_ylim(-16, 132)
    h1, = ax.plot([], [], lw=2.4, color="#888888", alpha=0.45, label="训练期 T1")
    h2 = ax.scatter([], [], s=52, marker="o", facecolor="white",
                    edgecolor="#888888", linewidth=1.8, label="测试期 T2")
    ax.legend(handles=[h1, h2], fontsize=8.5, frameon=False, loc="upper right")

    fig.suptitle("预实验：NOR 范式方法学问题（n=3/组）",
                 fontsize=13.5, y=1.04, fontweight="bold")
    fig.text(0.5, -0.13,
             "(a) 单样本 t 检验 vs DI=0；健康对照必须 DI>0 范式方可成立，实测 Sham DI=-0.363（p=0.017），方向相反。\n"
             "(b) 通行标准为 T1 与 T2 探究总时间均 ≥20 s；实心标记为应排除动物（CIH-2、BHD-1）。\n"
             "探究时间来源为软件区域停留时间，非鼻端定向探究时间 —— 这是范式失效的首要候选原因。",
             ha="center", fontsize=9, color="#444444")
    fig.savefig(out)
    plt.close(fig)
    print("saved:", out)


if __name__ == "__main__":
    up = "/root/.claude/uploads/c60c223b-baa8-536c-b103-79f6b939775e"
    p_tr = sys.argv[1] if len(sys.argv) > 1 else f"{up}/c6afc2c9-______.xlsx"
    p_te = sys.argv[2] if len(sys.argv) > 2 else f"{up}/d586c272-______.xlsx"
    tr, te = load(p_tr), load(p_te)
    os.makedirs("figures", exist_ok=True)
    fig_model_validation(tr, te, "figures/预实验_27b_造模有效性.png")
    fig_nor_failure(tr, te, "figures/预实验_27c_NOR范式问题.png")
