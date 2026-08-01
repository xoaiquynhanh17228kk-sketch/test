import openpyxl, numpy as np
from scipy import stats
def load(p):
    ws=openpyxl.load_workbook(p,data_only=True).active
    d={}
    for r in list(ws.iter_rows(values_only=True))[3:]:
        if r[6] is None: continue
        d[str(r[6]).strip()]=dict(dist=float(r[10]),speed=float(r[11]),immob=float(r[13]),
                                  old=float(r[27]),new=float(r[31]),
                                  latold=float(r[29]),latnew=float(r[33]))
    return d
te=load('/root/.claude/uploads/c60c223b-baa8-536c-b103-79f6b939775e/d586c272-______.xlsx')
tr=load('/root/.claude/uploads/c60c223b-baa8-536c-b103-79f6b939775e/c6afc2c9-______.xlsx')
G={'Sham':['对照1','对照2','对照3'],'CIH':['CIH-1','CIH-2','CIH-3'],
   'BHD':['CHI-BIO-CD3-1','CHI-BIO-CD3-2','CHI-BIO-CD3-3']}

def arr(src,k): return {g:np.array([src[i][k] for i in ids]) for g,ids in G.items()}

print("== 组间比较（n=3/组，one-way ANOVA + Kruskal-Wallis）==")
for name,src,k in [('T2 总路程',te,'dist'),('T2 平均速度',te,'speed'),('T2 不动时间%',te,'immob'),
                   ('T1 总路程',tr,'dist'),('T1 不动时间%',tr,'immob')]:
    a=arr(src,k)
    F,p=stats.f_oneway(a['Sham'],a['CIH'],a['BHD'])
    H,pk=stats.kruskal(a['Sham'],a['CIH'],a['BHD'])
    t,pt=stats.ttest_ind(a['Sham'],a['CIH'])
    t2,pt2=stats.ttest_ind(a['CIH'],a['BHD'])
    # Hedges g Sham vs CIH
    def g_(x,y):
        n1,n2=len(x),len(y); sp=np.sqrt(((n1-1)*x.std(ddof=1)**2+(n2-1)*y.std(ddof=1)**2)/(n1+n2-2))
        d=(x.mean()-y.mean())/sp; return d*(1-3/(4*(n1+n2)-9))
    print(f"{name:<12} ANOVA F={F:6.2f} p={p:.4f} | KW p={pk:.4f} | Sham vs CIH p={pt:.4f} g={g_(a['Sham'],a['CIH']):+.2f} | CIH vs BHD p={pt2:.4f} g={g_(a['BHD'],a['CIH']):+.2f}")

print()
print("== 判别指数 DI 单样本 t 检验（H0: DI=0，即无新旧偏好）==")
for g,ids in G.items():
    di=np.array([(te[i]['new']-te[i]['old'])/(te[i]['new']+te[i]['old']) for i in ids])
    t,p=stats.ttest_1samp(di,0)
    print(f"{g:<6} DI={di.mean():+.3f} ± {di.std(ddof=1):.3f}  t={t:+.2f} p={p:.4f}   {'★ 显著偏好旧物体' if p<0.05 and di.mean()<0 else ''}")

print()
print("== 探究总时间是否达到 NOR 通行纳入阈值（T1 与 T2 均 ≥20 s）==")
for g,ids in G.items():
    for i in ids:
        t1=tr[i]['old']+tr[i]['new']; t2=te[i]['old']+te[i]['new']
        flag='✗ 应排除' if (t1<20 or t2<20) else '✓'
        print(f"{i:<16} T1={t1:6.2f}s  T2={t2:6.2f}s   {flag}")

print()
print("== 首次接近新物体 vs 旧物体（潜伏期，s）==")
for g,ids in G.items():
    first_new=sum(1 for i in ids if te[i]['latnew']<te[i]['latold'])
    print(f"{g:<6} 先接近新物体的动物数 = {first_new}/3")
