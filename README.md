# Magic Item Shop Generator

A web application for D&D 5e Dungeon Masters to generate, customize, save, and print magic item shop inventories. Hosted on GitHub Pages — no installation or local server required.

**Live app:** https://bdavis19.github.io/dirty-20/

---

## Features

- **Shop Generator** — Set quantities per rarity tier (mundane through legendary) using static numbers or dice notation (e.g. `2d4`, `1d6+2`)
- **Filters** — Filter by magic item type, mundane category, overall category (combat, consumable, gamechanging, etc.), and price range
- **Presets** — Built-in presets for Village, Small Town, Large Town, Small City, Large City, and General Store; save your own custom presets too
- **Markup / Markdown** — Apply a percentage markup or discount to all prices; save named markup presets (e.g. "Black Market -15%")
- **Shop Naming** — Enter a name manually or generate a random one from a procedural list
- **Save & Load** — Save shops to the cloud; browse, rename, and delete saved shops from within the app
- **Print View** — Clean formatted layout for printing or saving as PDF via the browser

---

## Usage

1. Go to https://bdavis19.github.io/dirty-20/
2. Sign in with your Google account
3. Configure your shop and generate items
4. Save shops to access them from any device

No installation, no local server, no Chrome/Edge requirement — works in any modern browser.

---

## Project Structure

```
/dirty-20
  index.html              ← main app
  /css
    style.css
  /js
    main.js               ← entry point, Firebase init, auth state
    firebase.js           ← Firebase config and exports
    app.js                ← main application logic
    generator.js          ← shop generation and dice rolling
    nameGenerator.js      ← procedural shop name generation
    fileSystem.js         ← Firestore save/load (shops and settings)
    print.js              ← print view logic
  /data
    items.json            ← full item database
```

---

## Authentication & Data Storage

The app uses **Firebase Authentication** (Google Sign-In) and **Firebase Firestore** for cloud storage. Each user's shops and settings are stored privately under their own account — no user can access another user's data.

Data is stored in Firestore under the path `users/{uid}/shops` and `users/{uid}/settings`.

---

## Item Database

Items are stored in `data/items.json`. Each entry follows this schema:

```json
{
  "name": "string",
  "rarity": "mundane | common | uncommon | rare | very rare | legendary | artifact",
  "type": "armor | potion | ring | rod | scroll | staff | wand | weapon | wondrous | ammunition | gear | tool | gemstone",
  "mundaneCategory": "adventuring gear | arcane gear | ... | null",
  "categories": ["nonmagical | consumable | combat | noncombat | summoning | gamechanging"],
  "basePrice": 500,
  "priceSource": "exact | category_average | rarity_average | unknown",
  "attunement": false,
  "attunementBy": "string or null",
  "consumable": false,
  "source": "XDMG",
  "sourcePage": 244,
  "description": "string"
}
```

---

## Notes

- Prices display in D&D currency denominations (cp, sp, ep, gp).
- Items marked as priceless display "Priceless" instead of a price.
- Quantity fields accept dice notation: `2d6`, `1d4+1`, `1d10-2`, etc.
- Potions of Healing (all tiers) can be included via checkbox and do not count against rarity totals.