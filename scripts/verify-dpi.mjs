// Run:  node --experimental-strip-types scripts/verify-dpi.mjs
import * as D from '../src/lib/dpi.ts'
import { SENS_GAMES, cmPer360 as siteCm, convertSens } from '../src/data/sensitivityGames.ts'

let pass = 0, fail = 0
const eq = (n, got, want) => { if (got === want) pass++; else { fail++; console.log(`FAIL ${n}: got ${got}, want ${want}`) } }
const near = (n, got, want, tol = 1e-9) => { if (Math.abs(got - want) <= tol) pass++; else { fail++; console.log(`FAIL ${n}: got ${got}, want ${want}`) } }
const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100

// Published example (calculate.co.nz): CS2, 800 DPI, 0.35 sens -> 58.44 in, 148.4 cm
near('example in', r2(D.inchesPer360(800, 0.35, 0.022)), 58.44, 1e-9)
near('example cm', r1(D.cmPer360(800, 0.35, 0.022)), 148.4, 1e-9)
eq('edpi', D.edpi(800, 0.35), 280)

// Numbers shown in the approved mockup (Valorant 800 x 0.35)
near('val cm', r1(D.cmPer360(800, 0.35, 0.07)), 46.7); near('val in', r2(D.inchesPer360(800, 0.35, 0.07)), 18.37)
near('val 180', r1(D.cmPer360(800, 0.35, 0.07) / 2), 23.3); near('val 90', r1(D.cmPer360(800, 0.35, 0.07) / 4), 11.7)
near('cs2 800x1', r1(D.cmPer360(800, 1, 0.022)), 52.0)
near('apex 800x1.4', r1(D.cmPer360(800, 1.4, 0.022)), 37.1)

// Same feel at other DPI (mockup table) and exactness for every game
eq('400', D.sensForNewDpi(0.35, 800, 400), 0.7); eq('1600', D.sensForNewDpi(0.35, 800, 1600), 0.175)
eq('3200', D.sensForNewDpi(0.35, 800, 3200), 0.0875)
for (const g of SENS_GAMES) for (const to of [400, 1600, 3200]) {
  const ns = D.sensForNewDpi(0.7, 800, to)
  near(`feel ${g.id} ${to}`, D.cmPer360(to, ns, g.yaw), D.cmPer360(800, 0.7, g.yaw), 1e-9)
  // agrees with the Sensitivity Converter's own formulas
  near(`site cm ${g.id}`, D.cmPer360(800, 0.7, g.yaw), siteCm(0.7, 800, g.yaw), 1e-9)
  near(`site convert ${g.id}`, D.sensForNewDpi(0.7, 800, to), convertSens(0.7, 800, to, g.yaw, g.yaw), 1e-12)
}

// Rounding example
eq('round 2', D.roundTo(0.175, 2), 0.18)
near('round error %', Math.round((D.roundTo(0.175, 2) / 0.175 - 1) * 1000) / 10, 2.9)
near('faster from rounding', r1(D.percentFaster(D.cmPer360(1600, 0.175, 0.07), D.cmPer360(1600, 0.18, 0.07))), 2.9)

// Find DPI for a target
near('find dpi', Math.round(D.dpiForTarget(40, 0.35, 0.07)), 933)
near('find sens @800', Math.round(D.sensForTarget(40, 800, 0.07) * 1000) / 1000, 0.408)
near('round trip', D.cmPer360(D.dpiForTarget(40, 0.35, 0.07), 0.35, 0.07), 40, 1e-9)

// Compare
const A = D.cmPer360(800, 0.35, 0.07), B = D.cmPer360(1600, 0.2, 0.07)
near('B cm', r1(B), 40.8); near('B faster', r1(D.percentFaster(A, B)), 14.3); near('B less travel', r1(D.percentLessTravel(A, B)), 12.5)
near('valorant vs cs2 faster', r1(D.percentFaster(D.cmPer360(800, 1, 0.022), A)), 11.4)
near('valorant vs cs2 travel', r1(D.percentLessTravel(D.cmPer360(800, 1, 0.022), A)), 10.2)

// Pad fit (mockup: 45 cm pad)
const f = D.padFit(A, 45)
eq('fits360', f.fits360, false); eq('fits180', f.fits180, true); near('spare180', r1(f.spare180), 21.7); near('over360', r1(f.over360), 1.7)
eq('fits when big', D.padFit(30, 45).fits360, true)

// Screen PPI (widely published values)
near('1080p 24in', r2(D.ppi(1920, 1080, 24)), 91.79); near('1440p 27in', r2(D.ppi(2560, 1440, 27)), 108.79)
near('4k 27in', r2(D.ppi(3840, 2160, 27)), 163.18); near('pixel mm', Math.round(D.pixelSizeMm(D.ppi(2560, 1440, 27)) * 1000) / 1000, 0.233)

// Bad input never gives NaN or Infinity
for (const v of [0, -1, NaN, Infinity]) {
  eq(`bad cm ${v}`, D.cmPer360(v, 1, 0.07), 0); eq(`bad edpi ${v}`, D.edpi(800, v), 0)
  eq(`bad sensForNewDpi ${v}`, D.sensForNewDpi(1, 800, v), 0); eq(`bad ppi ${v}`, D.ppi(1920, 1080, v), 0)
}

// Share links
const ids = SENS_GAMES.map(g => g.id)
const st = { gameId: 'valorant', dpi: 800, sens: 0.35, padCm: 45 }
const back = D.decodeState('?' + D.encodeState(st), ids)
eq('share round trip', JSON.stringify(back), JSON.stringify(st))
eq('share bad game', D.decodeState('?g=nope&d=800&s=1', ids), null); eq('share bad dpi', D.decodeState('?g=cs2&d=0&s=1', ids), null)
eq('games count', SENS_GAMES.length, 14)

console.log(`\n${pass} checks passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
