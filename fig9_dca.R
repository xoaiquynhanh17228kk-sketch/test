#!/usr/bin/env Rscript
# =============================================================================
# Figure 9. Decision-curve analysis of the clinical-radiomic nomogram in
#           (a) the training cohort and (b) the internal validation cohort.
#
# Regenerates the figure from the model so the whole set stays on one fit.
# Two habits keep the panels honest:
#
#   1. Panel titles are read from the names of the data list, so a label cannot
#      drift from the data it sits above.
#   2. Before drawing, the script checks each cohort's size and AUC against the
#      published values and STOPS on a mismatch, so a crossed dat_train/dat_test
#      or a wrong model is caught rather than plotted.
#
# Net benefit is computed directly rather than through rmda or dcurves, and is
# not smoothed: the validation curve genuinely oscillates near zero at high
# thresholds and the manuscript reports it that way.
#
# Output: Fig9_dca.tiff (600 dpi) and Fig9_dca.pdf
# Dependencies: none beyond base R + grDevices
# =============================================================================

# ---- EDIT THIS BLOCK ONLY --------------------------------------------------
# fit       final combined model (glm or rms::lrm), fitted on the training data
# dat_train training data frame
# dat_test  internal validation data frame
# outcome   name of the 0/1 outcome column (1 = massive haemoptysis)
#
# fit       <- your_model
# dat_train <- your_training_data
# dat_test  <- your_validation_data
outcome <- "y"
# ---------------------------------------------------------------------------

if (!exists("fit") || !exists("dat_train") || !exists("dat_test")) {
  stop("Set `fit`, `dat_train` and `dat_test` in the block above before running.")
}

# rms::lrm and glm need different predict() calls; pick automatically
predict_prob <- function(model, newdata) {
  if (inherits(model, "lrm")) {
    as.numeric(predict(model, newdata = newdata, type = "fitted"))
  } else {
    as.numeric(predict(model, newdata = newdata, type = "response"))
  }
}

# Data and labels travel together. Nothing downstream can separate them.
dat <- list(
  "Training cohort"            = list(p = predict_prob(fit, dat_train),
                                      y = as.integer(dat_train[[outcome]])),
  "Internal validation cohort" = list(p = predict_prob(fit, dat_test),
                                      y = as.integer(dat_test[[outcome]]))
)

# ---- Net benefit -----------------------------------------------------------
# NB(pt)     = TP/n - (FP/n) * pt/(1-pt)
# NB_all(pt) = prev - (1-prev) * pt/(1-pt)
# NB_none    = 0
net_benefit <- function(p, y, pt) {
  n <- length(y)
  vapply(pt, function(t) {
    pred <- p >= t
    sum(pred & y == 1) / n - (sum(pred & y == 0) / n) * (t / (1 - t))
  }, numeric(1))
}

nb_all <- function(y, pt) {
  prev <- mean(y == 1)
  prev - (1 - prev) * (pt / (1 - pt))
}

THRESHOLDS <- seq(0.005, 0.80, by = 0.005)

# ---- Guards ----------------------------------------------------------------
# Two independent checks against the published values. Update if the cohort or
# the model ever changes.
#
# Note on what does NOT work as a guard: net benefit at a threshold of zero
# always equals the prevalence, because every patient is classified positive
# there and TP is therefore the whole event count. That identity holds however
# the probabilities are aligned, so it cannot detect anything. Cohort size
# catches a transposition; AUC catches a probability/outcome mismatch.
EXPECTED <- list(
  "Training cohort"            = c(n = 131, events = 30, auc = 0.850),
  "Internal validation cohort" = c(n = 57,  events = 12, auc = 0.794)
)

# Mann-Whitney form of the AUC, so pROC is not required
auc_of <- function(p, y) {
  n1 <- sum(y == 1); n0 <- sum(y == 0)
  (sum(rank(p)[y == 1]) - n1 * (n1 + 1) / 2) / (n1 * n0)
}

cat("Panel assignment check\n")
for (nm in names(dat)) {
  y <- dat[[nm]]$y
  a <- auc_of(dat[[nm]]$p, y)
  cat(sprintf("  %-28s n = %3d, events = %2d, prevalence = %.4f, AUC = %.3f\n",
              nm, length(y), sum(y == 1), mean(y == 1), a))

  exp_n <- EXPECTED[[nm]]["n"]; exp_e <- EXPECTED[[nm]]["events"]
  exp_a <- EXPECTED[[nm]]["auc"]

  # 1. cohort identity -- the failure mode that produced the previous figure
  if (length(y) != exp_n || sum(y == 1) != exp_e) {
    stop(sprintf(paste0("'%s' has n = %d with %d events, but %d with %d were expected.\n",
                        "  The two cohorts are most likely swapped: check dat_train and dat_test."),
                 nm, length(y), sum(y == 1), exp_n, exp_e))
  }

  # 2. probabilities belong to these outcomes, and come from the adopted model
  if (abs(a - exp_a) > 0.05) {
    stop(sprintf(paste0("'%s' gives AUC %.3f but %.3f was expected.\n",
                        "  Either the probabilities do not correspond to these outcomes, or `fit`\n",
                        "  is not the adopted combined model."), nm, a, exp_a))
  }
  if (abs(a - exp_a) > 0.01) {
    warning(sprintf("'%s': AUC %.3f differs from the published %.3f.", nm, a, exp_a))
  }
}
cat("  Both cohorts match their expected size, event count and AUC.\n\n")

# ---- Style -----------------------------------------------------------------
COL_MODEL <- "#C0392B"
COL_ALL   <- "grey60"
COL_NONE  <- "black"
YLIM      <- c(-0.05, 0.26)

draw_panel <- function(nm, tag) {
  p <- dat[[nm]]$p
  y <- dat[[nm]]$y
  nb_model <- net_benefit(p, y, THRESHOLDS)
  nb_treat <- nb_all(y, THRESHOLDS)

  par(mar = c(4.6, 4.4, 2.6, 1.2), mgp = c(2.5, 0.7, 0))
  plot(NA, xlim = c(0, 0.80), ylim = YLIM, xlab = "", ylab = "",
       axes = FALSE)
  grid(nx = NULL, ny = NULL, col = "grey92", lty = 1)
  axis(1, at = seq(0, 0.8, 0.2), cex.axis = 0.85, tcl = -0.3)
  axis(2, at = seq(-0.05, 0.25, 0.05), las = 1, cex.axis = 0.85, tcl = -0.3)
  box(bty = "l")

  lines(THRESHOLDS, nb_treat, col = COL_ALL,  lwd = 1.4)
  abline(h = 0,               col = COL_NONE, lwd = 1.4)
  lines(THRESHOLDS, nb_model, col = COL_MODEL, lwd = 2.2)

  mtext("Threshold probability", side = 1, line = 2.6, cex = 0.9)
  mtext("Net benefit",           side = 2, line = 2.9, cex = 0.9)
  mtext(nm, side = 3, line = 0.6, adj = 0, cex = 0.95, font = 2)   # label from data
  mtext(tag, side = 3, line = 0.6, adj = -0.14, cex = 1.25, font = 2, xpd = NA)

  legend("topright", legend = c("Nomogram", "Treat all", "Treat none"),
         col = c(COL_MODEL, COL_ALL, COL_NONE), lwd = c(2.2, 1.4, 1.4),
         bty = "n", cex = 0.82)
}

render <- function() {
  layout(matrix(1:2, ncol = 2))
  par(family = "sans")
  draw_panel(names(dat)[1], "a")
  draw_panel(names(dat)[2], "b")
}

# ---- Threshold range where the nomogram beats both references --------------
# Computed once, outside the drawing code, so it is not printed per device.
cat("Threshold ranges where the nomogram is the preferred strategy:\n")
for (nm in names(dat)) {
  nb_model <- net_benefit(dat[[nm]]$p, dat[[nm]]$y, THRESHOLDS)
  nb_treat <- nb_all(dat[[nm]]$y, THRESHOLDS)
  useful   <- THRESHOLDS[nb_model > pmax(nb_treat, 0)]
  if (length(useful)) {
    cat(sprintf("  %-28s %.2f to %.2f\n", nm, min(useful), max(useful)))
  } else {
    cat(sprintf("  %-28s never preferred\n", nm))
  }
}
cat("\n")
tiff("Fig9_dca.tiff", width = 9.6, height = 4.6, units = "in",
     res = 600, compression = "lzw")
render()
dev.off()

pdf("Fig9_dca.pdf", width = 9.6, height = 4.6)
render()
dev.off()

cat("\nFig9_dca.tiff and Fig9_dca.pdf written.\n")
cat("Manuscript states 0.01-0.73 (training) and 0.06-0.60 (validation).\n")
cat("If the printed ranges differ materially, update the Results text to match.\n")
