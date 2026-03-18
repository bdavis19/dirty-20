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
- The app shell consists of a persistent top navigation bar and two views: the generator view (default) and the results view. Only one view is visible at a time.

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
  10. Navigates to the results view.

---

## 8. Shop Output Table

- The table has four columns: **Name, Rarity, Type, Qty, Price**.
- The Qty column displays the quantity of each item. Mundane items roll 1d6. Common consumable magic items roll 1d6-3, minimum 1. Potions of Healing roll 1d10 minus 2 per rarity level above common (minimum 1): common 1d10, uncommon 1d10-2, rare 1d10-4, very rare 1d10-6. All other items display 1.
- Price displays in the most appropriate D&D currency denomination (cp, sp, ep, gp). Marked-up prices that fall between denominations may display as mixed currency (e.g. 1 ep 1 sp 2 cp). If a markup was applied and the adjusted price differs from the base price, the base price is shown in parentheses: 1 gp 5 sp (1 gp). The Price column header displays "Price" when no markup is applied, and "Price Markup (Base Price)" when markup is active.
- Items flagged as `priceless: true` display **"Priceless"** in the Price column regardless of markup.
- Items with no price data display **"—"**.
- Before any generation, the table is hidden and the empty-state message is shown.
- After generation, the table is shown and the empty-state message is hidden.
- The Qty column displays quantities as editable number inputs. Users can click any qty field to change it directly, and tab between rows. Editing a qty value triggers the unsaved changes warning.

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
- Closing the modal (✕ button or clicking outside the dialog) dismisses it without loading anything.
- When a shop is loaded, both `markup-percent` and `markup-applied` are restored to the saved markup value.
- The unsaved changes warning is hidden after a shop is loaded.
- The Shop Browser can be opened from both the generator view and the results view.

---

## 14. Print View

- Clicking **Print** opens a new browser tab with a clean, print-formatted version of the current shop.
- If the items table is empty, an alert informs the user to generate a shop first. No tab is opened.
- The print view includes: the shop name as a heading, a markup note (e.g. "+25%") if markup is non-zero, and a table with Name, Rarity, Type, and Price columns.
- The browser's print dialog is triggered automatically when the tab opens.
- The print view is styled for readability on paper (serif font, bordered table, no background colors).
- If pop-ups are blocked, an alert instructs the user to allow pop-ups.

---

## 15. Authentication & Cloud Storage

- The app requires a Google account to use. A login screen is shown on first load.
- Clicking Sign in with Google opens a Google OAuth popup. On success, the login screen is hidden and the app is shown.
- All shops and settings are stored in Firebase Firestore, scoped to the signed-in user's UID.
- Users can only access their own shops and settings — no cross-user data access is possible.
- Data is accessible from any browser and any device after signing in.
- The app is hosted on GitHub Pages and requires no local server or installation.
- On sign-in, the user's email is checked against the allowedUsers Firestore collection. If no matching document exists, the user is signed out and an error message is displayed on the login screen. Access is denied without exposing app content.

---

## 16. Navigation & Views

- The top bar is always visible and contains the app title, nav links, and user controls.
- Clicking a nav link navigates to that tool's generator view.
- Clicking ← New Shop from the results view resets all generator fields to defaults and returns to the generator view.
- Loading a saved shop navigates to the results view.

---

## 17. Themes

- A theme dropdown is visible in the top bar at all times after sign-in.
- Five themes are available: **Generic D&D**, **Ravenloft**, **Forgotten Realms**,
  **Greyhawk**, **Deadwell**.
- Selecting a theme immediately applies it to the entire UI by swapping a class
  on `<body>`. No page reload is required.
- Each theme controls color palette and typography (heading and body fonts).
- The selected theme persists per user in Firestore under the existing
  `users/{uid}/settings/main` document as a `theme` field.
- On sign-in, the saved theme preference is loaded and applied before the rest
  of the app initializes, preventing a flash of the wrong theme.
- If no theme preference has been saved, **Generic D&D** is the default.
- Generic D&D and Greyhawk are light themes (parchment backgrounds, dark text).
  Ravenloft, Forgotten Realms, and Deadwell are dark themes.
- Themes apply globally to all views: generator, results, and the shop browser
  modal.

---

## 18. Merchant NPC — Persistence

- The merchant object is saved as part of the shop data under the `merchant` key.
- When a shop is loaded, all merchant fields (species, name, background, appearance, personalities, quirks, likes, dislikes) are restored exactly.
- The collapsed/expanded state of the merchant section is also saved and restored.
- Shops saved before the merchant feature was added (no `merchant` key) generate a fresh merchant on load.
- Clicking ← New Shop clears all merchant fields.

---

## 19. Shop Details

- A Shop Details section appears on the results view between the Merchant section and the output table.
- The section contains four fields: **Location**, **Appearance**, **Quirk**, and **Security**.
- Each field is populated with one randomly selected value at generation time.
- Each field has a ⟳ reroll button that replaces its value with a new random pick from the corresponding data array.
- The section is collapsible. Clicking **▲ Collapse** hides the body; clicking **▼ Expand** restores it.
- Collapsed state is saved with the shop and restored on load.
- All four fields are free-text editable by the user.
- Shop Details are saved with the shop via `buildShopData()` and restored via `applyLoadedShop()`.
- Shops saved before this feature was added will have a fresh set of details generated on load.
- Clicking ← New Shop clears all four fields.