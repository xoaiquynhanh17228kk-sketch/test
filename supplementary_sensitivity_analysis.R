# =============================================================================
# Supplementary analyses for the massive-hemoptysis clinical-radiomic nomogram
# Addresses reviewer requests:
#   P1-1  BAA ascertainment: angiography x severity cross-tabs + sensitivity analyses
#   P2-4  Bootstrap optimism-corrected discrimination (AUC/C-index)
#   P2-5  PPV / NPV with 95% CIs
#
# HOW TO USE
#   1. Prepare ONE data frame `d` with one row per patient (N = 188) and columns:
#        outcome      : massive hemoptysis, 1 = yes / 0 = no
#        cohort       : "train" or "validation"
#        TB           : tuberculosis, 1/0
#        BAA          : bronchial artery abnormality (as analyzed), 1/0
#        fibrinogen   : numeric
#        Rad_score    : numeric (the linear-predictor Rad-score you already built)
#        angio        : bronchial artery angiography performed, 1 = yes / 0 = no
#   2. Set the file path below and check the column names.
#   3. Run top to bottom. All numbers print to the console.
# NOTE: this reuses your existing R packages; nothing here re-selects radiomic
#       features, so it does not overwrite your Rad-score.
# =============================================================================

## ---- 0. packages ----------------------------------------------------------
need <- c("rms", "pROC", "mice")
for (p in need) if (!requireNamespace(p, quietly = TRUE)) install.packages(p)
library(rms); library(pROC); library(mice)

## ---- 1. load your data ----------------------------------------------------
# d <- read.csv("PATH/TO/your_188_patients.csv")     # <-- EDIT
# or: d <- readxl::read_excel("PATH/TO/your_data.xlsx")
stopifnot(all(c("outcome","cohort","TB","BAA","fibrinogen","Rad_score","angio") %in% names(d)))
d$outcome <- as.integer(d$outcome)
train <- subset(d, cohort == "train")
valid <- subset(d, cohort == "validation")

auc_ci <- function(y, p) {           # helper: AUC + DeLong 95% CI
  r <- pROC::roc(y, p, quiet = TRUE)
  sprintf("%.3f (%.3f-%.3f)", as.numeric(pROC::auc(r)),
          as.numeric(pROC::ci.auc(r))[1], as.numeric(pROC::ci.auc(r))[3])
}

# =============================================================================
# P1-1a  Cross-tabulations (the reviewer's 2x2x2)
# =============================================================================
cat("\n== angiography x severity (whole cohort) ==\n")
print(t1 <- table(angiography = d$angio, massive = d$outcome)); print(fisher.test(t1))
cat("\n== BAA x severity (whole cohort) ==\n")
print(t2 <- table(BAA = d$BAA, massive = d$outcome)); print(fisher.test(t2))
cat("\n== BAA x severity, ONLY among angiographied patients (n=63) ==\n")
sub <- subset(d, angio == 1)
print(t3 <- table(BAA = sub$BAA, massive = sub$outcome)); print(fisher.test(t3))
cat("\n== angiography rate by severity (did more severe patients get angiography?) ==\n")
print(round(prop.table(table(massive = d$outcome, angio = d$angio), 1), 3))

# =============================================================================
# P1-1b  Sensitivity analysis 1 -- refit on the ANGIOGRAPHIED subset only
#        (BAA is genuinely assessed in everyone here)
# =============================================================================
cat("\n== Sensitivity 1: multivariable model in angiographied patients (n=63) ==\n")
fit_sub <- glm(outcome ~ TB + BAA + fibrinogen + Rad_score, data = sub, family = binomial)
print(round(exp(cbind(OR = coef(fit_sub), confint(fit_sub))), 3))
cat("AUC (angiographied subset):", auc_ci(sub$outcome, predict(fit_sub, type = "response")), "\n")

# =============================================================================
# P1-1c  Sensitivity analysis 2 -- treat BAA of NON-angiographied patients as
#        MISSING (not negative) and multiply-impute, then pool
# =============================================================================
cat("\n== Sensitivity 2: BAA set to NA when not angiographied, multiple imputation ==\n")
di <- d; di$BAA[di$angio == 0] <- NA          # unknown, not 'negative'
imp <- mice(di[, c("outcome","TB","BAA","fibrinogen","Rad_score")],
            m = 20, seed = 123, printFlag = FALSE)
fit_mi <- with(imp, glm(outcome ~ TB + BAA + fibrinogen + Rad_score, family = binomial))
print(summary(pool(fit_mi), conf.int = TRUE, exponentiate = TRUE)[, c("term","estimate","2.5 %","97.5 %","p.value")])

# =============================================================================
# P1-1d  Simplest robustness check -- DROP BAA entirely
#        (clinical = TB + fibrinogen; combined = TB + fibrinogen + Rad_score)
# =============================================================================
cat("\n== Models WITHOUT BAA (training-fit, evaluated in both cohorts) ==\n")
clin_noBAA <- glm(outcome ~ TB + fibrinogen, data = train, family = binomial)
comb_noBAA <- glm(outcome ~ TB + fibrinogen + Rad_score, data = train, family = binomial)
for (nm in c("train","valid")) {
  dd <- get(nm)
  cat(sprintf("  [%s] clinical(no BAA) AUC = %s | combined(no BAA) AUC = %s\n", nm,
      auc_ci(dd$outcome, predict(clin_noBAA, dd, type="response")),
      auc_ci(dd$outcome, predict(comb_noBAA, dd, type="response"))))
}

# =============================================================================
# P2-4  Bootstrap optimism-corrected discrimination for the full nomogram
#       rms::validate gives the optimism-corrected Dxy -> corrected AUC.
#       (Fit on the TRAINING cohort; 1000 bootstrap resamples.)
# =============================================================================
cat("\n== Bootstrap optimism-corrected AUC (training cohort, B=1000) ==\n")
dd <- datadist(train); options(datadist = "dd")
f <- lrm(outcome ~ TB + BAA + fibrinogen + Rad_score, data = train, x = TRUE, y = TRUE)
v <- validate(f, B = 1000)
dxy_orig <- v["Dxy","index.orig"]; dxy_corr <- v["Dxy","index.corrected"]
cat(sprintf("  Apparent AUC   = %.3f\n", dxy_orig/2 + 0.5))
cat(sprintf("  Optimism-corrected AUC = %.3f  (optimism = %.3f)\n",
            dxy_corr/2 + 0.5, (dxy_orig - dxy_corr)/2))
# NOTE: this corrects the FINAL model. A fully rigorous version would wrap the
# whole pipeline (ICC + mRMR + LASSO) inside the bootstrap; that requires the
# 1315-feature matrix and is a larger job -- tell me if you want that version.

# =============================================================================
# P2-5  PPV / NPV with 95% CIs at the operating cut-point (p = 0.249)
# =============================================================================
cat("\n== PPV / NPV at cut-point 0.249 ==\n")
wilson <- function(k,n){ if(n==0) return(c(NA,NA)); p<-k/n; z<-1.96; d<-1+z^2/n
  c((p+z^2/(2*n)-z*sqrt(p*(1-p)/n+z^2/(4*n^2)))/d,
    (p+z^2/(2*n)+z*sqrt(p*(1-p)/n+z^2/(4*n^2)))/d) }
# uses the full nomogram fitted above (f); adjust 'newdata' per cohort
for (nm in c("train","valid")) {
  dd <- get(nm)
  pr <- predict(f, dd, type = "fitted"); cls <- as.integer(pr >= 0.249)
  TP<-sum(cls==1 & dd$outcome==1); FP<-sum(cls==1 & dd$outcome==0)
  TN<-sum(cls==0 & dd$outcome==0); FN<-sum(cls==0 & dd$outcome==1)
  ppv<-TP/(TP+FP); npv<-TN/(TN+FN)
  cat(sprintf("  [%s] PPV=%.3f (%.3f-%.3f)  NPV=%.3f (%.3f-%.3f)\n", nm,
      ppv, wilson(TP,TP+FP)[1], wilson(TP,TP+FP)[2],
      npv, wilson(TN,TN+FN)[1], wilson(TN,TN+FN)[2]))
}
cat("\nDone.\n")
