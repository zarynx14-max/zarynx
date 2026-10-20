// Run:  node --experimental-strip-types scripts/verify-eldenring.mjs
// Checks the engine against numbers copied separately from the wiki pages.
import * as E from '../src/lib/eldenring.ts'
import { ARMOR_ROWS, TALISMAN_ROWS, WEAPON_ROWS } from '../src/data/eldenringGear.ts'

let pass = 0, fail = 0
function eq(name, got, want) {
  if (got === want) pass++
  else { fail++; console.log(`FAIL ${name}: got ${got}, want ${want}`) }
}

// classes
for (const c of E.CLASSES) eq(`class ${c.id} sum`, E.sumStats(c.stats), 79 + c.level)

// HP: the wiki "Change" column, typed separately from the table itself
const hpChange = [4,8,10,12,13,15,16,18,18, 20,21,21,23,23,25,25,26,26,28, 28,29,29,31,31,33,37,40,41,43,
  43,44,44,45,46,46,46,47,47,48, 26,27,26,26,26,25,25,25,24,24, 23,23,22,21,21,20,19,18,16,13,
  6,6,6,6,6,6,6,6,6,5, 6,6,6,5,6,5,6,5,6,5, 5,6,5,5,5,5,5,5,4,5, 5,4,4,4,4,4,4,3,3]
eq('hp change count', hpChange.length, 98)
hpChange.forEach((d, i) => eq(`hp vigor ${i + 2}`, E.hpFor(i + 2) - E.hpFor(i + 1), d))
eq('hp 1', E.hpFor(1), 300); eq('hp 40', E.hpFor(40), 1450); eq('hp 60', E.hpFor(60), 1900); eq('hp 99', E.hpFor(99), 2100)

// FP: wiki Change column for Mind 2..40
const fpChange = [3,3,3,3,3,3,4,13,3,4,3,3,3,4,5,5,5,6,5,5,5,6,5,5,5,6,5,5,5,6,5,5,5,6,7,7,7,7,7]
eq('fp change count', fpChange.length, 39)
fpChange.forEach((d, i) => eq(`fp mind ${i + 2}`, E.fpFor(i + 2) - E.fpFor(i + 1), d))
eq('fp 1', E.fpFor(1), 40)
const fpAnchors = { 38: 221, 41: 242, 50: 300, 60: 350, 80: 401, 99: 450 }
for (const [m, v] of Object.entries(fpAnchors)) eq(`fp anchor ${m}`, E.fpFor(+m), v)
eq('fp gain at 41', E.fpFor(41) - E.fpFor(40), 7)
eq('fp gain at 50', E.fpFor(50) - E.fpFor(49), 7)
eq('fp gain at 60', E.fpFor(60) - E.fpFor(59), 4)
eq('fp gain at 80', E.fpFor(80) - E.fpFor(79), 3)
eq('fp gain at 99', E.fpFor(99) - E.fpFor(98), 3)

// Stamina: wiki rows Endurance 11..40 and anchors
const sta = [97,99,101,103,105,106,108,110,111,113,115,116,118,120,121,123,125,126,128,130,131,132,133,135,136,137,138,140,141,142]
sta.forEach((v, i) => eq(`stamina end ${i + 11}`, E.staminaFor(i + 11), v))
const staAnchors = { 41: 143, 46: 150, 50: 155, 60: 158, 80: 164, 99: 170, 1: 80 }
for (const [e, v] of Object.entries(staAnchors)) eq(`stamina anchor ${e}`, E.staminaFor(+e), v)

// Equip load: wiki "gains" column for Endurance 9..99, typed separately
const gains = {
  9:1.6,10:1.6,11:1.6,12:1.6,13:1.5,14:1.6,15:1.6,16:1.6,17:1.6,18:1.6,19:1.6,20:1.6,21:1.5,22:1.6,23:1.6,24:1.6,25:1.6,
  26:1.0,27:1.1,28:1.2,29:1.2,30:1.2,31:1.3,32:1.3,33:1.3,34:1.3,35:1.3,36:1.3,37:1.4,38:1.3,39:1.4,40:1.4,
  41:1.4,42:1.4,43:1.4,44:1.4,45:1.4,46:1.5,47:1.4,48:1.4,49:1.5,50:1.5,51:1.4,52:1.5,53:1.5,54:1.4,55:1.5,56:1.5,57:1.5,58:1.5,59:1.5,60:1.5,
  61:1.0,62:1.1,63:1.0,64:1.0,65:1.0,66:1.1,67:1.0,68:1.0,69:1.0,70:1.1,71:1.0,72:1.0,73:1.0,74:1.1,75:1.0,76:1.0,77:1.0,78:1.1,79:1.0,80:1.0,
  81:1.0,82:1.1,83:1.0,84:1.0,85:1.0,86:1.1,87:1.0,88:1.0,89:1.0,90:1.1,91:1.0,92:1.0,93:1.0,94:1.1,95:1.0,96:1.0,97:1.0,98:1.1,99:1.0,
}
// The wiki rounds each Equip Load value separately, so one printed gain differs by 0.1
// from subtracting the printed values (End 28: 74.1 -> 75.2 is printed as +1.2). Both
// values were re-checked against the page text, so that one row is expected.
const roundingQuirk = { 28: 1.1 }
for (const [e, g] of Object.entries(gains)) {
  const d = Math.round((E.equipLoadFor(+e) - E.equipLoadFor(+e - 1)) * 10) / 10
  eq(`equip gain end ${e}`, d, roundingQuirk[e] ?? g)
}
eq('equip 8', E.equipLoadFor(8), 45.0); eq('equip 25', E.equipLoadFor(25), 72.0)
eq('equip 60', E.equipLoadFor(60), 120.0); eq('equip 99', E.equipLoadFor(99), 160.0)

// Runes: wiki "runes to next" for levels 1..37
const rn = [673,689,706,723,740,757,775,793,811,829,847,1038,1238,1445,1659,1882,2113,2353,2601,2857,3122,3395,3678,3970,4270,4580,4899,5228,5567,5915,6273,6640,7018,7407,7805,8214,8633]
rn.forEach((v, i) => eq(`runes level ${i + 1}`, E.runesForNextLevel(i + 1), v))
eq('runes level 74', E.runesForNextLevel(74), 32675)
eq('runes level 105', E.runesForNextLevel(105), 68501)
eq('runes level 138', E.runesForNextLevel(138), 126618)
const totals = { 12: 8343, 13: 9381, 20: 22672, 30: 64238, 37: 113510, 74: 811275, 105: 2319467, 138: 5447566 }
for (const [l, t] of Object.entries(totals)) eq(`total runes to ${l}`, E.runesBetween(1, +l), t)
eq('runes 100 to 150', E.runesBetween(100, 150), 5114581)

// Roll types and share links
eq('roll light', E.rollTypeFor(29, 100), 'Light'); eq('roll medium', E.rollTypeFor(30, 100), 'Medium')
eq('roll heavy', E.rollTypeFor(70, 100), 'Heavy'); eq('roll over', E.rollTypeFor(100.1, 100), 'Overloaded')
const st = E.meetRequirements('samurai', { strength: 20, dexterity: 30 })
eq('meet req str', st.strength, 20); eq('meet req keeps base', st.vigor, 12)
const enc = E.encodeBuild({ classId: 'samurai', stats: st, gearWeight: 55.5, targetLevel: 90, armor: ['Steel Helm','','',''], talismans: ['Arsenal Charm','','',''], weapons: ['Uchigatana','','','','',''] })
const dec = E.decodeBuild('?' + enc)
eq('share roundtrip', JSON.stringify(dec?.stats), JSON.stringify(st))
eq('share weight', dec?.gearWeight, 55.5)
eq('share armor', dec?.armor[0], 'Steel Helm'); eq('share tal', dec?.talismans[0], 'Arsenal Charm'); eq('share weapon', dec?.weapons[0], 'Uchigatana')


// ── Talismans: effects read from the wiki text ──
const tal = Object.fromEntries(TALISMAN_ROWS.map(r => [r[0], E.parseTalismanEffect(r[2])]))
const modOf = (n, k) => tal[n]?.[k]
const series = [
  ['Crimson Amber Medallion', 'hp', [6, 7, 8, 10]],
  ['Cerulean Amber Medallion', 'fp', [7, 9, 11, 12.5]],
  ['Viridian Amber Medallion', 'stamina', [11, 13, 15, 17]],
]
for (const [base, key, vals] of series) {
  ;[base, base + ' +1', base + ' +2', base + ' +3'].forEach((n, i) => eq(`${n} ${key}`, modOf(n, key), vals[i]))
}
eq('Arsenal Charm', modOf('Arsenal Charm', 'equip'), 15)
eq('Arsenal Charm+1', modOf('Arsenal Charm+1', 'equip'), 17)
eq("Great-Jar's Arsenal", modOf("Great-Jar's Arsenal", 'equip'), 19)
eq('Favor +2 hp', modOf("Erdtree's Favor +2", 'hp'), 4); eq('Favor +2 stamina', modOf("Erdtree's Favor +2", 'stamina'), 10); eq('Favor +2 equip', modOf("Erdtree's Favor +2", 'equip'), 8)
eq('Favor hp', modOf("Erdtree's Favor", 'hp'), 3); eq('Favor stamina', modOf("Erdtree's Favor", 'stamina'), 7); eq('Favor equip', modOf("Erdtree's Favor", 'equip'), 5)
eq('Soreseal vig', tal["Radagon's Soreseal"].stats.vigor, 5); eq('Soreseal end', tal["Radagon's Soreseal"].stats.endurance, 5)
eq('Scarseal str', tal["Radagon's Scarseal"].stats.strength, 3); eq('Scarseal mind none', tal["Radagon's Scarseal"].stats.mind, undefined)
eq('Marika Soreseal mind', tal["Marika's Soreseal"].stats.mind, 5); eq('Marika Scarseal arcane', tal["Marika's Scarseal"].stats.arcane, 3)
for (const [n, k] of [['Starscourge Heirloom','strength'],['Prosthesis-Wearer Heirloom','dexterity'],['Stargazer Heirloom','intelligence'],['Two Fingers Heirloom','faith'],['Outer God Heirloom','arcane']])
  eq(`${n} ${k}`, tal[n].stats[k], 5)
eq('Primal Glintstone Blade hp', modOf('Primal Glintstone Blade', 'hp'), -15)
eq('Turtle has no stat mods', tal['Green Turtle Talisman'], null)
eq('family variants', E.talismanFamily('Crimson Amber Medallion +2'), E.talismanFamily('Crimson Amber Medallion'))
eq('family arsenal', E.talismanFamily("Great-Jar's Arsenal"), E.talismanFamily('Arsenal Charm+1'))
eq('family seals', E.talismanFamily("Radagon's Soreseal"), E.talismanFamily("Radagon's Scarseal"))
eq('talisman count', TALISMAN_ROWS.length, 155)

// Fextralife example: at 99 Vigor and 99 Endurance, Erdtree's Favor +2 adds 84 HP, 17 stamina, 12.8 equip load
const max99 = E.classStats('wretch'); for (const k of E.STAT_KEYS) max99[k] = 99
const plain99 = E.computeBuildWithGear('wretch', max99, [])
const fav99 = E.computeBuildWithGear('wretch', max99, [E.parseTalismanEffect(TALISMAN_ROWS.find(r => r[0] === "Erdtree's Favor +2")[2])])
eq('favor +84 hp', fav99.hp - plain99.hp, 84); eq('favor +17 stamina', fav99.stamina - plain99.stamina, 17)
eq('favor +12.8 equip', Math.round((fav99.equipLoad - plain99.equipLoad) * 10) / 10, 12.8)
const soreseal = E.parseTalismanEffect("Raises Vigor, Endurance, Strength, and Dexterity by 5, but increases all damage taken by 15%.")
const w40 = E.classStats('wretch'); w40.vigor = 40; w40.endurance = 25
const withSore = E.computeBuildWithGear('wretch', w40, [soreseal])
eq('soreseal hp uses vigor 45', withSore.hp, E.hpFor(45)); eq('soreseal equip uses end 30', withSore.equipLoad, E.equipLoadFor(30))
eq('soreseal does not change level', withSore.level, E.computeBuild('wretch', w40).level)
const stack = E.computeBuildWithGear('wretch', max99, [{ hp: 8 }, { hp: 4 }])
eq('hp talismans multiply', stack.hp, Math.floor(2100 * 1.08 * 1.04))
const capped = E.computeBuildWithGear('wretch', max99, [soreseal]); eq('effective cap 99', capped.effective.vigor, 99)

// ── Armor data sanity ──
eq('armor rows', ARMOR_ROWS.length, 712)
for (const r of ARMOR_ROWS) {
  if (!(r[2] > 0 && r[2] < 100)) { fail++; console.log('FAIL armor weight', r[0], r[2]) } else pass++
  if (!['h', 'c', 'a', 'l'].includes(r[1])) { fail++; console.log('FAIL armor slot', r[0]) } else pass++
  if (r[0].includes('[[')) { fail++; console.log('FAIL armor name', r[0]) } else pass++
}
const names = ARMOR_ROWS.map(r => r[1] + r[0]); eq('armor names unique', new Set(names).size, names.length)
const got = n => ARMOR_ROWS.find(r => r[0] === n)
eq('Albinauric Mask weight', got('Albinauric Mask')?.[2], 3.8); eq('Albinauric Mask poise', got('Albinauric Mask')?.[3], 3)
eq('Greathelm weight', got('Greathelm')?.[2], 5.9); eq('Greathelm poise', got('Greathelm')?.[3], 7)
eq("Astrologer Hood weight", got('Astrologer Hood')?.[2], 1.7); eq("All-Knowing Helm poise", got('All-Knowing Helm')?.[3], 5)


// ── Weapons ──
eq('weapon rows', WEAPON_ROWS.length, 106)
const cnt = {}; for (const r of WEAPON_ROWS) cnt[r[1]] = (cnt[r[1]] ?? 0) + 1
eq('katanas', cnt['Katana'], 10); eq('straight swords', cnt['Straight Sword'], 23); eq('greatswords', cnt['Greatsword'], 25)
eq('colossal swords', cnt['Colossal Sword'], 16); eq('staves', cnt['Glintstone Staff'], 20); eq('seals', cnt['Sacred Seal'], 12)
eq('weapon names unique', new Set(WEAPON_ROWS.map(r => r[0])).size, WEAPON_ROWS.length)
for (const r of WEAPON_ROWS) {
  const ok = r[2] >= 0 && r[2] < 60 && r[3].length === 5 && r[3].every(n => Number.isInteger(n) && n >= 0 && n <= 99) && r[4].length === 5
  if (!ok) { fail++; console.log('FAIL weapon row', r[0]) } else pass++
}
// Second source: GameWith's katana list (weight and Str/Dex/Int/Fai/Arc requirements), compared with the Eldenpedia page
const katanas = {
  'Uchigatana': [5.5, [11, 15, 0, 0, 0]], 'Nagakiba': [7.0, [18, 22, 0, 0, 0]], 'Meteoric Ore Blade': [7.5, [15, 14, 18, 0, 0]],
  'Moonveil': [6.5, [12, 18, 23, 0, 0]], 'Rivers of Blood': [6.5, [12, 18, 0, 0, 20]], 'Serpentbone Blade': [6.0, [11, 22, 0, 0, 0]],
  'Hand of Malenia': [7.0, [16, 48, 0, 0, 0]], 'Dragonscale Blade': [5.5, [12, 20, 0, 0, 0]],
}
for (const [n, [w, rq]] of Object.entries(katanas)) {
  const row = WEAPON_ROWS.find(r => r[0] === n)
  eq(`${n} weight`, row?.[2], w); eq(`${n} reqs`, JSON.stringify(row?.[3]), JSON.stringify(rq))
}
// Requirement helpers
const mr = E.maxRequirements([[11, 15, 0, 0, 0], [12, 18, 23, 0, 0], [0, 0, 0, 14, 20]])
eq('max req str', mr.strength, 12); eq('max req dex', mr.dexterity, 18); eq('max req int', mr.intelligence, 23); eq('max req fai', mr.faith, 14); eq('max req arc', mr.arcane, 20)
const sf = E.shortfall([12, 18, 23, 0, 0], E.classStats('samurai'))
eq('shortfall count', sf.length, 2); eq('shortfall dex', sf.find(x => x.key === 'dexterity')?.need - sf.find(x => x.key === 'dexterity')?.have, 3)
eq('shortfall str', sf.find(x => x.key === 'strength') === undefined, true)

console.log(`\n${pass} checks passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
