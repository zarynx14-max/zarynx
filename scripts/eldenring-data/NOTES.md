# Elden Ring data notes (v3, Oct 2026)

Source pages (saved as HTML and parsed by code, no hand typing):
- Armor: Eldenpedia "Armor". Helms also compared with Fextralife "Helms".
- Talismans: Fextralife "Talismans".
- Weapons: Eldenpedia type pages: Katanas, Straight Swords, Greatswords, Colossal Swords, Staves, Sacred Seals.

`gen.py` rebuilds `src/data/eldenringGear.ts` (paths at the top of gen.py and wp.py).
Check the data any time:  node --experimental-strip-types scripts/verify-eldenring.mjs

## Known gaps and disagreements
- Weights agree between Eldenpedia and Fextralife for 206 of 207 helms. Raging Wolf Helm differs: 4.6 (Eldenpedia) vs 4.4 (Fextralife). We use 4.6.
- POISE DISAGREES: Fextralife lists higher poise than Eldenpedia for 133 of 207 helms (by 1 to 4); heavy helms agree. We use Eldenpedia
  (its Bull-Goat set adds up to the commonly reported 100). Helms added from Fextralife have unknown poise.
- 8 helms were added from Fextralife because Eldenpedia had them blank or missing (weight only).
- Still missing (blank on Eldenpedia, no second source yet): Steel, Silver Grooved, Leontiel's, Gold Tattoo chest/arms/legs pieces and Leontiel's Hat (Altered),
  Fire Knight Armor, Maliketh's Armor (Altered). War Surgeon Gown has two conflicting rows and is left out.
  To fill them: save the Fextralife Chest Armor, Gauntlets and Leg Armor pages.
- "Oathseeker Knight Helm" was listed inside Eldenpedia's arms table by mistake and is removed from arms.
- Four sacred seals show weight 0.0 on Eldenpedia (Dragon Communion, Erdtree, Frenzied Flame, Golden Order). Not confirmed by a second source.
- Katana weights and requirements were cross-checked against GameWith's list (8 of 8 match). The other weapon types have one source only.
- Erdtree's Favor base stamina bonus: 7% on Fextralife, one other site says 6.75%. We use 7%.
- Sorcery and incantation requirements are NOT included: the Eldenpedia Sorceries/Incantations pages only list names.
