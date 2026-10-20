"""Rebuilds src/data/eldenringGear.ts from saved wiki pages. Edit the paths in wp.py / below if your files move."""
import re, json, sys
sys.path.insert(0, '.')
from tp import tables
from collections import defaultdict
import wp
U='/mnt/user-data/uploads/'
num=lambda x: bool(re.fullmatch(r'-?\d+(\.\d+)?',x))
fmt=lambda x: 'null' if x is None else (str(int(x)) if x==int(x) else str(x))

# ---------- armor (Eldenpedia) ----------
A=tables(U+'Armor_-_Eldenpedia.html')
slots=['head','chest','arms','legs']; code={'head':'h','chest':'c','arms':'a','legs':'l'}
rows=[]; report={'broken_names':[], 'no_weight':[], 'partial':[], 'ambiguous':[]}
for slot,t in zip(slots,A):
    for r in t[1:]:
        if len(r)<16: continue
        name=r[1]
        if name.startswith('[['): report['broken_names'].append((slot,name.strip('[]|'))); continue
        if slot!='head' and re.search(r'\b(Helm|Hat|Mask|Hood)\b',name) and not re.search(r'(Armor|Gauntlet|Greaves|Gloves|Boots|Robe|Garb|Attire)',name):
            report.setdefault('wrong_table',[]).append((slot,name)); continue
        vals=r[2:16]
        if not num(vals[0]): report['no_weight'].append((slot,name)); continue
        nums=[float(v) if num(v) else None for v in vals]
        if any(v is None for v in nums): report['partial'].append((slot,name))
        rows.append((slot,name,nums))
by=defaultdict(list)
for s,n,v in rows: by[(s,n)].append(v)
final=[]
for (s,n),vs in by.items():
    if len(vs)>1: report['ambiguous'].append((s,n,[v[0] for v in vs])); continue
    final.append((s,n,vs[0]))

# ---------- helms from Fextralife: fill pieces Eldenpedia lacks (weight only; poise left unknown) ----------
FX=tables(U+'1792395379067_Helms___Elden_Ring_Wiki.html')[0]
have={n.lower() for s,n,v in final if s=='head'}
added=[]
for r in FX[1:]:
    if len(r)<15 or not r[0] or r[0].lower() in have: continue
    vals=[num(x.strip()) and float(x) for x in r[1:15]]
    w=r[14].strip()
    if not num(w): continue
    d=[float(x) if num(x.strip()) else None for x in r[1:13]]
    final.append(('head',r[0],[float(w)]+d[0:8]+d[8:12]+[None])); have.add(r[0].lower()); added.append(r[0])
report['added_from_fextralife_helms']=added
still=[(s,n) for s,n in report['broken_names'] if not (s=='head' and n.lower() in have)]
report['still_missing_broken']=still

lines=[]
for s,n,v in final:
    d=','.join(fmt(x) for x in v[1:9]); rs=','.join(fmt(x) for x in v[9:13])
    lines.append(f'  [{json.dumps(n)},"{code[s]}",{fmt(v[0])},{fmt(v[13])},[{d}],[{rs}]],')

# ---------- talismans ----------
T=tables(U+'Talismans___Elden_Ring_Wiki.html')
dlcnames={r[0] for r in T[0][1:] if len(r)>=5}
seen=set(); tal=[]
for r in T[1][1:]+T[0][1:]:
    if len(r)<5 or r[0] in seen: continue
    seen.add(r[0]); tal.append((r[0],float(r[2]),r[1],r[0] in dlcnames))
tl=[f'  [{json.dumps(n)},{w},{json.dumps(e)},{1 if d else 0}],' for n,w,e,d in tal]

# ---------- weapons (Eldenpedia type pages) ----------
W,issues=wp.load(); report['weapon_parse_issues']=issues
wl=[f'  [{json.dumps(r["name"])},{json.dumps(r["cat"])},{fmt(r["weight"])},[{",".join(str(x) for x in r["req"])}],{json.dumps("".join(g or "-" for g in r["grades"]))}],' for r in W]

out='''// GENERATED from saved wiki pages (Eldenpedia, Fextralife), Oct 2026. Do not edit by hand.
// Armor row: [name, slot(h/c/a/l), weight, poise|null, [phys, strike, slash, pierce, magic, fire, lightning, holy], [immunity, robustness, focus, vitality]]
export const ARMOR_ROWS: [string, string, number, number | null, (number | null)[], (number | null)[]][] = [
'''+'\n'.join(lines)+'''
]

// Talisman row: [name, weight, effect text, isShadowOfTheErdtreeDlc]
export const TALISMAN_ROWS: [string, number, string, number][] = [
'''+'\n'.join(tl)+'''
]

// Weapon row: [name, type, weight, [strength, dexterity, intelligence, faith, arcane] requirements, scaling grades (Str Dex Int Fai Arc, "-" = none)]
export const WEAPON_ROWS: [string, string, number, number[], string][] = [
'''+'\n'.join(wl)+'''
]
'''
open('/home/claude/zarynx3/src/data/eldenringGear.ts','w').write(out)
json.dump(report,open('report.json','w'),indent=1)
print('armor',len(final),'(+%d helms from Fextralife)'%len(added),'talismans',len(tal),'weapons',len(W))
print('added helms:',added); print('still missing:',still)
