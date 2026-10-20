import re, glob
from tp import tables
U='/mnt/user-data/uploads/'
FILES={ 'katanas':'1792395379057_Katanas_-_Eldenpedia.html','straight':'1792395379059_Straight_Swords_-_Eldenpedia.html',
 'greatswords':'1792395379061_Greatswords_-_Eldenpedia.html','colossal':'1792395379062_Colossal_Swords_-_Eldenpedia.html',
 'staves':'1792395379064_Staves_-_Eldenpedia.html','seals':'1792395379066_Sacred_Seals_-_Eldenpedia.html'}
CAT={'katanas':'Katana','straight':'Straight Sword','greatswords':'Greatsword','colossal':'Colossal Sword','staves':'Glintstone Staff','seals':'Sacred Seal'}
def num(x):
    x=x.strip()
    return float(x) if re.fullmatch(r'-?\d+(\.\d+)?',x) else None
def load():
    out=[]; issues=[]
    for k,f in FILES.items():
        T=tables(U+f); t=max(T,key=len)
        for r in t[1:]:
            if len(r)<26 or not r[1]: continue
            off = 1 if k in ('staves','seals') else 0   # no "Skill" column
            w=num(r[3-off])
            reqs=[num(x) or 0.0 if x.strip() else 0.0 for x in r[21:26]]
            grades=[x.strip() for x in r[16:21]]
            if w is None: issues.append((k,r[1],'weight',r[3-off])); continue
            if any(x.strip() and num(x) is None for x in r[21:26]): issues.append((k,r[1],'req',r[21:26]))
            out.append(dict(cat=CAT[k],name=r[1],weight=w,req=[int(x) for x in reqs],grades=grades))
    return out,issues
if __name__=='__main__':
    rows,iss=load()
    from collections import Counter
    print(Counter(r['cat'] for r in rows)); print('issues',iss)
    for r in rows: print(r['cat'][:5],'|',r['name'],'|',r['weight'],'|',r['req'],'|',''.join(g or '-' for g in r['grades']))
