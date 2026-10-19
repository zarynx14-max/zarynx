# Elden Ring gear data notes (Oct 2026)

Source pages, saved as HTML and parsed by code (no hand typing):
- Armor: Eldenpedia (eldenring.wiki.gg/wiki/Armor)
- Talismans: Fextralife (eldenring.wiki.fextralife.com/talisman)

`gen.py` rebuilds `src/data/eldenringGear.ts` from those two saved pages (edit the file paths at the top).
`missing-rows.json` lists armor rows left out because the source page had broken or unclear data:
- 18 pieces whose rows were blank on the wiki: Steel set (4), Silver Grooved set (5 incl. Altered), Leontiel's set (5 incl. Altered), Gold Tattoo (3), Broken Gold Mask
- Fire Knight Armor and Maliketh's Armor (Altered): weight missing
- War Surgeon Gown: two different rows with the same name (6.9 and 6.1 weight), so it is ambiguous
- Brave's Cord Circlet, Brave's Leather Helm, Brave's Bracer, Brave's Legwraps, Golden Prosthetic, Millicent's Gloves are kept, but poise (and Focus) is unknown

Check the data any time with:  node --experimental-strip-types scripts/verify-eldenring.mjs

Known open question: Erdtree's Favor base stamina bonus is 7% on Fextralife, one other site says 6.75%.
