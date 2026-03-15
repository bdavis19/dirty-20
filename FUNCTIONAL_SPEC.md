# Magic Item Shop Generator — Functional Specification

**Version:** 1.0  
**Last Updated:** 2026-03-15  
**Purpose:** This document defines the expected behavior of every feature in the Magic Item Shop Generator. It serves as the reference point when adding new features or fixing bugs, to ensure existing functionality is not broken.

---

## Table of Contents

1. [Page Load & Initialization](#1-page-load--initialization)
2. [Inventory Quantities](#2-inventory-quantities)
3. [Built-In Presets](#3-built-in-presets)
4. [Custom Presets](#4-custom-presets)
5. [Markup Presets](#5-markup-presets)
6. [Filters](#6-filters)
7. [Generate Button](#7-generate-button)
8. [Shop Output Table](#8-shop-output-table)
9. [Shop Name](#9-shop-name)
10. [Markup / Markdown (Output Section)](#10-markup--markdown-output-section)
11. [Unsaved Changes Warning](#11-unsaved-changes-warning)
12. [Save Shop](#12-save-shop)
13. [Load Shop / Shop Browser](#13-load-shop--shop-browser)
14. [Print View](#14-print-view)
15. [Data Folder Selection](#15-data-folder-selection)

---

## 1. Page Load & Initialization

- All filter checkboxes (Magic Types, Mundane Categories, Overall Categories) default to **checked** on page load.
- The quantity fields (Mundane through Legendary) default to **empty**.
- The markup fields (`markup-percent` and `markup-applied`) default to **0**.
- All preset dropdowns default to the placeholder option ("— Select a preset —").
- Custom presets and markup presets are loaded from `settings.json` and populated into their respective dropdowns.
- The items table is hidden and the empty-state message ("No items generated yet...") is shown.
- The unsaved changes warning is hidden.

---

## 2. Inventory Quantities

- There are six quantity fields: **Mundane, Common, Uncommon, Rare, Very Rare, Legendary**.
- Each field accepts either a plain integer (`5`) or dice notation (`2d4`, `1d6+2`, `1d10-2`).
- Invalid or empty input resolves to **0 items** for that rarity tier.
- A separate checkbox labeled **"Include Potions of Healing"** adds all four tiers of healing potions (Potion of Healing, Greater, Superior, Supreme) to the output. These do **not** count against any rarity quantity total.

---

## 3. Built-In Presets

- Six built-in presets are available: **Village, Small Town, Large Town, Small City, Large City, General Store**.
- Selecting a preset from the dropdown immediately populates:
  - All six quantity fields
  - The Include Potions of Healing checkbox
  - All filter checkboxes (Magic Types, Mundane Categories, Overall Categories)
  - Min Price and Max Price fields
- Built-in presets do **not** set a markup value.
- Built-in presets are hardcoded and cannot be edited or deleted by the user.
- After applying a preset, the dropdown resets visually but the values it applied remain in the fields.

---

## 4. Custom Presets

- Users can save the current UI state as a named custom preset.
- Clicking **"Save Current as Preset"** prompts for a name. If the name is blank or cancelled, nothing is saved.
- A saved custom preset stores:
  - All six quantity values
  - Include Potions of Healing state
  - All filter checkbox states (Magic Types, Mundane Categories, Overall Categories)
  - Min Price and Max Price values
  - The currently selected markup preset name (if any)
- Custom presets are saved to `settings.json` and persist across sessions.
- Selecting a custom preset from the dropdown applies all stored values to the UI, including restoring the markup preset dropdown to the matching option (matched by name).
- If the stored markup preset name no longer exists in settings, the markup preset dropdown is set to blank (no error).
- Clicking **"Delete"** with a custom preset selected prompts for confirmation, then removes it from `settings.json` and the dropdown.
- Clicking "Delete" with no preset selected does nothing.
- Custom presets are listed in the dropdown in the order they were saved.

---

## 5. Markup Presets

- Users can save a named markup preset consisting of a **name** and a **percentage** value (positive or negative).
- Clicking **"Save Current as Preset"** prompts for a name. If the name is blank or cancelled, nothing is saved.
- If a preset with the same name already exists, its percent value is **overwritten**.
- Markup presets are saved to `settings.json` and persist across sessions.
- Selecting a markup preset from the dropdown populates the `markup-percent` input (the top field, in the generator section) with that preset's value.
- The `markup-applied` field (in the output section) is **not** updated by selecting a markup preset — it only updates when Generate is clicked or Apply is clicked.
- Clicking **"Delete"** with a markup preset selected prompts for confirmation, then removes it from `settings.json` and the dropdown.
- Clicking "Delete" with no preset selected does nothing.
- Markup presets display in the dropdown as: `Name (+X%)` or `Name (-X%)`.

---

## 6. Filters

**Magic Types** (applies to non-mundane items only):

- Options: Armor, Potion, Ring, Rod, Scroll, Staff, Wand, Weapon, Wondrous, Ammunition.
- Only items whose `type` matches a checked option are eligible for generation.
- "Select All" checks all options in this group. "Select None" unchecks all.

**Mundane Categories** (applies to mundane-rarity items only):

- Options include adventuring gear, arcane gear, tools, etc.
- Only mundane items whose `mundaneCategory` matches a checked option are eligible.
- "Select All" checks all options in this group. "Select None" unchecks all.

**Overall Categories** (applies to all items):

- Options: Nonmagical, Consumable, Combat, Noncombat, Summoning, Gamechanging.
- An item is eligible if **at least one** of its `categories` values matches a checked option.
- "Select All" checks all options in this group. "Select None" unchecks all.

**Price Range**:

- Min Price: excludes items with a `basePrice` below this value. Empty means no minimum.
- Max Price: excludes items with a `basePrice` above this value. Empty means no maximum.
- Items with no `basePrice` (null) are **not** excluded by price range filters.

---

## 7. Generate Button

- Clicking **Generate**:
  1. Copies the value from `markup-percent` into `markup-applied`.
  2. Reads all current UI state (quantities, filters, markup, potions checkbox).
  3. For each rarity tier, rolls the quantity input and randomly selects that many unique items from the filtered pool.
  4. If the pool has fewer items than the requested quantity, all available items in that pool are returned.
  5. Appends the four Potions of Healing if the checkbox is checked.
  6. Applies the markup multiplier to all item prices (rounds to nearest integer).
  7. Sorts results by rarity order (mundane → legendary), then by type alphabetically, then by name alphabetically.
  8. Renders the results in the output table.
  9. Sets the unsaved changes warning to **visible**.

---

## 8. Shop Output Table

- The table has four columns: **Name, Rarity, Type, Qty, Price**.
- The Qty column displays the quantity of each item. Mundane items roll 1d6. Common consumable magic items roll 1d6-3, minimum 1. Potions of Healing roll 1d10 minus 2 per rarity level above common (minimum 1): common 1d10, uncommon 1d10-2, rare 1d10-4, very rare 1d10-6. All other items display 1.
- Price displays in the most appropriate D&D currency denomination (cp, sp, ep, gp). Marked-up prices that fall between denominations may display as mixed currency (e.g. 1 ep 1 sp 2 cp). If a markup was applied and the adjusted price differs from the base price, the base price is shown in parentheses: 1 gp 5 sp (1 gp). The Price column header displays "Price" when no markup is applied, and "Price Markup (Base Price)" when markup is active.
- Items flagged as `priceless: true` display **"Priceless"** in the Price column regardless of markup.
- Items with no price data display **"—"**.
- Before any generation, the table is hidden and the empty-state message is shown.
- After generation, the table is shown and the empty-state message is hidden.

---

## 9. Shop Name

- The shop name field accepts free text input.
- If left empty at save time, the shop is saved as **"Unnamed Shop"**.
- Clicking **"Get Random Names"** opens a dropdown of randomly generated shop name suggestions.
- Clicking a name in the dropdown populates the shop name field and closes the dropdown.
- A **"Get More"** option at the bottom of the dropdown generates a new set of names without closing.
- Clicking anywhere outside the dropdown closes it.

---

## 10. Markup / Markdown (Output Section)

- The `markup-applied` field in the output section reflects the markup currently applied to the visible table.
- Changing this field manually and clicking **Apply** re-applies the markup to all currently rendered items using the new percentage.
- The Apply button does **not** regenerate the item list — it only recalculates prices on the existing items.
- After Apply is clicked, the `markup-applied` value is what gets saved with the shop.
- The `markup-applied` value is independent of the `markup-percent` preset selector above — changing the preset selector does not change `markup-applied` unless Generate is clicked again.

---

## 11. Unsaved Changes Warning

- The red "Unsaved changes" warning is shown whenever the current table contents have not been saved.
- It appears when: Generate is clicked, Apply (markup) is clicked, or a shop is loaded and then modified.
- It is hidden when: a shop is successfully saved.
- It does not appear on page load before any generation has occurred.

---

## 12. Save Shop

- Clicking **Save Shop** saves the current shop to a `.json` file in the `shops/` subfolder of the selected data folder.
- If no shop name is entered, an alert prompts the user to enter one. The save is aborted.
- If no data folder has been selected, the user is prompted to pick one before saving.
- The filename is derived from the shop name, with special characters replaced by underscores.
- If a file with the same name already exists, it is **overwritten**.
- The saved file includes: shop name, all settings (quantities, filters, markup, potions), the rendered item list, a `lastModified` timestamp, and a `created` timestamp (set only on first save).
- After a successful save, the unsaved changes warning is hidden and an alert confirms the save.

---

## 13. Load Shop / Shop Browser

- Clicking **Load Shop** opens the Shop Browser modal.
- If no data folder has been selected, the user is prompted to pick one first.
- The modal lists all `.json` files in the `shops/` folder, sorted by `lastModified` descending (most recent first).
- Each row shows the shop name, last modified date, and three buttons: **Open, Rename, Delete**.
- **Open**: loads the shop, restores all UI state (name, quantities, filters, markup, items table), and closes the modal.
- **Rename**: prompts for a new name. If confirmed, renames the file and updates the shop name inside the JSON. The shop list refreshes.
- **Delete**: prompts for confirmation. If confirmed, permanently deletes the file. The shop list refreshes. This action cannot be undone.
- Closing the modal (✕ button) dismisses it without loading anything.
- When a shop is loaded, both `markup-percent` and `markup-applied` are restored to the saved markup value.
- The unsaved changes warning is hidden after a shop is loaded.

---

## 14. Print View

- Clicking **Print** opens a new browser tab with a clean, print-formatted version of the current shop.
- If the items table is empty, an alert informs the user to generate a shop first. No tab is opened.
- The print view includes: the shop name as a heading, a markup note (e.g. "+25%") if markup is non-zero, and a table with Name, Rarity, Type, and Price columns.
- The browser's print dialog is triggered automatically when the tab opens.
- The print view is styled for readability on paper (serif font, bordered table, no background colors).
- If pop-ups are blocked, an alert instructs the user to allow pop-ups.

---

## 15. Data Folder Selection

- The app requires a local data folder to save and load shops and settings.
- The folder handle is persisted in the browser's **IndexedDB** so the user does not need to re-select it on every visit.
- On any operation that requires the data folder (save, load, read/write settings), the app checks IndexedDB for a stored handle and requests permission.
- If permission is denied or no handle is stored, the user is prompted to pick a folder via the browser's directory picker.
- The app only supports **Chrome and Edge** for file system operations. Firefox does not support the File System Access API.
