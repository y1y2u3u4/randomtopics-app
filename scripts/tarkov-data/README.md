# Tarkov data build (/tarkov-random-weapon-generator)

Source: community Escape from Tarkov Wiki (Fandom) via its MediaWiki API (`action=parse&page=Weapons|Ballistics&prop=wikitext`).

1. Save the two parse responses as `wiki.json` (Weapons) and `ball.json` (Ballistics) in a temp dir.
2. `python3 parse_weapons.py <tmp>/wiki.json <tmp>/weapons_raw.json`
3. `python3 parse_ammo.py <tmp>/ball.json <tmp>/ammo_raw.json`
4. `python3 build_data.py <tmp> <repo>` — classes, ammo, downloads missing weapon renders to `public/tarkov/weapons/*.webp` (needs `cwebp`/`dwebp`).
5. `python3 emit_ts.py <tmp>/tarkov_data.json <repo>/src/data/tarkovWeapons.ts`, then update the revision dates in the header/constants.
6. `node scripts/tarkov-regression.mjs`

Weapon renders are © Battlestate Games, mirrored for identification only.
