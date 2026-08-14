#!/usr/bin/env Rscript
# =============================================================================
# Figure 4. Forest plots of univariable (a) and multivariable (b) logistic
#           regression for massive haemoptysis, training cohort.
#
# Runs standalone -- no data required. The odds ratios below are the final
# values from the adopted model, in which bronchial artery-pulmonary fistula
# and bronchial artery malformation are combined into a single bronchial
# artery abnormality (BAA) term.
#
# To regenerate the tables from the fitted objects instead of using the values
# below, see the block at the end of this file.
#
# Output: Fig4_forest.tiff (600 dpi) and Fig4_forest.pdf
# Dependencies: none beyond base R + grDevices
# =============================================================================

# ---- Panel a: univariable, 16 rows -----------------------------------------
# 17 candidate variables in the original screen; BAPF and BAM are one BAA row.
uni <- data.frame(
  var = c("Age", "Sex", "Smoking status", "Duration of smoking", "Cancer",
          "Tuberculosis", "Bronchiectasis", "Fungal infection", "BAA",
          "Antiplatelet drugs", "Antithrombotic drugs", "PLT", "D-dimer",
          "INR", "Fibrinogen", "Rad-score"),
  or  = c(1.02, 1.40, 0.89, 1.00, 0.64, 4.23, 2.36, 1.14, 5.27,
          0.46, 1.13, 1.00, 1.13, 0.09, 0.57, 7.96),
  lo  = c(0.983, 0.563, 0.392, 0.977, 0.171, 1.429, 1.031, 0.339, 1.960,
          0.055, 0.113, 0.990, 0.920, 0.001, 0.386, 2.745),
  hi  = c(1.047, 3.461, 2.037, 1.018, 2.368, 12.505, 5.409, 3.838, 14.162,
          3.921, 11.244, 1.003, 1.380, 7.670, 0.830, 23.105),
  p   = c("0.360", "0.472", "0.789", "0.813", "0.501", "0.009", "0.042",
          "0.831", "0.001", "0.480", "0.919", "0.290", "0.247", "0.284",
          "0.004", "<0.001"),
  stringsAsFactors = FALSE
)

# ---- Panel b: multivariable, 4 rows ----------------------------------------
mul <- data.frame(
  var = c("Tuberculosis", "BAA", "Fibrinogen", "Rad-score"),
  or  = c(5.18, 4.32, 0.65, 4.73),
  lo  = c(1.419, 1.325, 0.446, 1.530),
  hi  = c(18.931, 14.098, 0.947, 14.632),
  p   = c("0.013", "0.015", "0.025", "0.007"),
  stringsAsFactors = FALSE
)

# ---- Integrity checks ------------------------------------------------------
stopifnot(
  "panel a must have 16 rows"        = nrow(uni) == 16,
  "panel b must have 4 rows"         = nrow(mul) == 4,
  "BAPF/BAM must not appear"         = !any(grepl("BAPF|BAM", c(uni$var, mul$var))),
  "BAA must appear in both panels"   = all(c("BAA" %in% uni$var, "BAA" %in% mul$var)),
  "CIs must bracket the estimate"    = all(uni$lo <= uni$or & uni$or <= uni$hi) &&
                                       all(mul$lo <= mul$or & mul$or <= mul$hi)
)

# ---- Style -----------------------------------------------------------------
COL_PT   <- "#2C5F8A"   # marker + interval, same in both panels
COL_REF  <- "grey45"    # OR = 1 reference line
CEX_LAB  <- 0.82        # row labels and numeric columns
PCH_PT   <- 15          # filled square
XLIM     <- c(0.001, 30)
TICKS    <- c(0.001, 0.01, 0.1, 1, 10, 30)

# OR to 2 dp as in the running text; CI bounds to 3 dp as in Table 2, so that
# near-null per-unit variables (PLT 0.990-1.003) do not collapse to 1.00-1.00.
# Plain hyphen, not an en dash: the TIFF device font has no en-dash glyph.
fmt_ci <- function(or, lo, hi) sprintf("%.2f (%.3f-%.3f)", or, lo, hi)

# margin line positions for the three text columns
LINE_VAR <- 10.6   # variable name, side 2
LINE_OR  <- 0.6    # OR (95% CI), side 4
LINE_P   <- 8.6    # P value,     side 4

# ---- One panel -------------------------------------------------------------
draw_panel <- function(d, tag) {
  n <- nrow(d)
  ypos <- n:1   # first variable at the top

  par(mar = c(if (tag == "b") 4.2 else 2.6, 11.4, 2.2, 12.4), mgp = c(2.2, 0.6, 0))
  plot(NA, xlim = XLIM, ylim = c(0.4, n + 0.9), log = "x",
       axes = FALSE, xlab = "", ylab = "")

  abline(v = 1, lty = 2, col = COL_REF, lwd = 1)

  segments(d$lo, ypos, d$hi, ypos, col = COL_PT, lwd = 1.5)
  segments(d$lo, ypos - 0.16, d$lo, ypos + 0.16, col = COL_PT, lwd = 1.5)
  segments(d$hi, ypos - 0.16, d$hi, ypos + 0.16, col = COL_PT, lwd = 1.5)
  points(d$or, ypos, pch = PCH_PT, col = COL_PT, cex = 1.05)

  axis(1, at = TICKS, labels = format(TICKS, scientific = FALSE, trim = TRUE),
       cex.axis = CEX_LAB, tcl = -0.3)
  if (tag == "b") mtext("Odds ratio (log scale)", side = 1, line = 2.6, cex = 0.9)

  # text columns live in the margins, so they cannot run into the plot region
  mtext(d$var, side = 2, at = ypos, line = LINE_VAR, las = 1, adj = 0, cex = CEX_LAB)
  mtext(fmt_ci(d$or, d$lo, d$hi), side = 4, at = ypos, line = LINE_OR,
        las = 1, adj = 0, cex = CEX_LAB)
  mtext(d$p, side = 4, at = ypos, line = LINE_P, las = 1, adj = 0, cex = CEX_LAB)

  # column headers
  mtext("OR (95% CI)", side = 4, at = n + 0.85, line = LINE_OR,
        las = 1, adj = 0, cex = CEX_LAB, font = 2)
  mtext(expression(bold(italic(P))), side = 4, at = n + 0.85, line = LINE_P,
        las = 1, adj = 0, cex = CEX_LAB)

  # panel tag, outer left
  mtext(tag, side = 3, line = 0.6, adj = 0, at = grconvertX(-0.34, "npc", "user"),
        cex = 1.3, font = 2)
}

# ---- Draw to both devices --------------------------------------------------
render <- function() {
  layout(matrix(1:2, ncol = 1), heights = c(nrow(uni) + 2.5, nrow(mul) + 4.5))
  par(family = "sans")
  draw_panel(uni, "a")
  draw_panel(mul, "b")
}

tiff("Fig4_forest.tiff", width = 8.6, height = 8.4, units = "in",
     res = 600, compression = "lzw")
render()
dev.off()

pdf("Fig4_forest.pdf", width = 8.6, height = 8.4)
render()
dev.off()

cat("Fig4_forest.tiff and Fig4_forest.pdf written.\n")
cat(sprintf("  panel a: %d rows, panel b: %d rows\n", nrow(uni), nrow(mul)))

# =============================================================================
# Optional: regenerate the two tables from the fitted objects, to confirm the
# hard-coded values above. Replace the object names with your own.
#
#   uni_from_fit <- function(varname, data, outcome = "y") {
#     f <- glm(as.formula(paste(outcome, "~", varname)), data = data,
#              family = binomial)
#     ci <- exp(confint.default(f))[2, ]
#     data.frame(var = varname, or = exp(coef(f))[2],
#                lo = ci[1], hi = ci[2],
#                p = format.pval(summary(f)$coefficients[2, 4], digits = 3))
#   }
#
#   mul_from_fit <- function(fit) {
#     ci <- exp(confint.default(fit))[-1, , drop = FALSE]
#     data.frame(var = rownames(ci), or = exp(coef(fit))[-1],
#                lo = ci[, 1], hi = ci[, 2],
#                p = summary(fit)$coefficients[-1, 4])
#   }
#
# BAA must be built before either call:
#   dat$BAA <- as.integer(dat$BAPF == 1 | dat$BAM == 1)
# =============================================================================
