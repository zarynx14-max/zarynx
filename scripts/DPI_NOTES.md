# DPI & eDPI Calculator notes (Oct 2026)

Check the math any time:  node --experimental-strip-types scripts/verify-dpi.mjs

- Formulas: eDPI = DPI x sens; inches/360 = 360 / (yaw x DPI x sens); cm/360 = inches x 2.54.
- Game yaw values come from src/data/sensitivityGames.ts, shared with the Sensitivity Converter
  (the script checks both tools agree for all 14 games).
- Published example used as a check: CS2, 800 DPI, 0.35 sens = 58.44 in = 148.4 cm.
- Screen PPI checked against widely published values: 24" 1080p = 91.79, 27" 1440p = 108.79, 27" 4K = 163.18.
- Not included: mouse acceleration, scoped/ADS sensitivity, "recommended eDPI" ranges (no solid source).
- Screen PPI sits on the same page for now. To move it to its own tool later, cut the "ppi" Collapsible
  in DpiCalculatorClient.tsx and the ppi helpers in src/lib/dpi.ts.
