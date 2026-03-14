# Magic Item Shop Generator

A locally-hosted web application for D&D 5e Dungeon Masters to generate, customize, save, and print magic item shop inventories. Built with plain HTML/CSS/JS — no frameworks, no build step, no internet required after setup.

---

## Features

- **Shop Generator** — Set quantities per rarity tier (mundane through legendary) using static numbers or dice notation (e.g. `2d4`, `1d6+2`)
- **Filters** — Filter by magic item type, mundane category, overall category (combat, consumable, gamechanging, etc.), and price range
- **Presets** — Built-in presets for Village, Small Town, Large Town, Small City, Large City, and General Store; save your own custom presets too
- **Markup / Markdown** — Apply a percentage markup or discount to all prices; save named markup presets (e.g. "Black Market -15%")
- **Shop Naming** — Enter a name manually or generate a random one from a procedural list
- **Save & Load** — Save shops as JSON files in a folder you choose; browse, rename, and delete saved shops from within the app
- **Print View** — Clean formatted layout for printing or saving as PDF via the browser

---

## Requirements

- **Python 3** — used to run the local web server ([python.org](https://www.python.org/downloads/))
- **Chrome or Edge** — required for the File System Access API (save/load functionality)

---

## Setup (Windows)

### 1. Install Python

Download and install Python 3 from [python.org](https://www.python.org/downloads/).

> **Important:** During installation, check the box that says **"Add Python to PATH"** before clicking Install.

### 2. Clone the Repository

```bash
git clone https://github.com/bdavis19/shop-generator.git
```

Or download the ZIP from GitHub and extract it to a folder of your choice.

### 3. Start the App

Double-click **`launch.bat`** in the root of the project folder. This will:

1. Open your browser to `http://localhost:8080`
2. Start Python's built-in HTTP server in the background

A command prompt window will stay open while the server is running. Close it to stop the server.

### 4. Select a Data Folder (First Launch Only)

On first launch, the app will prompt you to select a **data folder**. This is where your settings and saved shops will be stored. You can point this at:

- A local folder anywhere on your machine
- A synced folder (e.g. Google Drive or OneDrive) to share shops across multiple computers

The app will remember your selection on future launches.

---

## Project Structure

```
/shop-generator
  index.html              ← main app
  launch.bat              ← starts the server and opens browser
  /css
    style.css
  /js
    app.js                ← main application logic
    generator.js          ← shop generation and dice rolling
    nameGenerator.js      ← procedural shop name generation
    fileSystem.js         ← File System Access API, save/load
    print.js              ← print view logic
  /data
    items.json            ← full item database
```

### User Data (stored in your chosen folder)

```
/[your chosen folder]
  settings.json           ← markup presets, custom presets, default filters
  /shops
    ShopName.json         ← one file per saved shop
```

---

## launch.bat

The `launch.bat` file at the root of the project is what starts the app. Its contents:

```bat
@echo off
start "" http://localhost:8080
python -m http.server 8080
pause
```

If you need to run it on a different port, change both `8080` values to the same port number.

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

- The save/load system uses the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API), which is only supported in **Chrome and Edge**. Firefox is not supported.
- All prices are displayed as whole numbers in gold pieces (gp).
- Items marked as priceless display "Priceless" instead of a price.
- Quantity fields accept dice notation: `2d6`, `1d4+1`, `1d10-2`, etc. Results are capped at 10 per rarity.
- Potions of Healing (all tiers) can be included via checkbox and do not count against rarity totals.