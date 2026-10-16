// Run:  node --experimental-strip-types scripts/verify-eldenring.mjs
// Checks the engine against numbers copied separately from the wiki pages.
import * as E from '../src/lib/eldenring.ts'

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
const enc = E.encodeBuild({ classId: 'samurai', stats: st, gearWeight: 55.5, targetLevel: 90 })
const dec = E.decodeBuild('?' + enc)
eq('share roundtrip', JSON.stringify(dec?.stats), JSON.stringify(st))
eq('share weight', dec?.gearWeight, 55.5)

console.log(`\n${pass} checks passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
