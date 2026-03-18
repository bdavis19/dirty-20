# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed

- Brief theme flash on page refresh — an inline script immediately after `<body>` reads the cached theme from `localStorage` and applies the body class before any rendering occurs, eliminating the default theme flicker while Firestore loads.

## [v3.4.0] 2026-03-17

### Added

- `js/shopDetailsData.js` — new file with four placeholder data arrays (`SHOP_LOCATIONS`, `SHOP_APPEARANCES`, `SHOP_QUIRKS`, `SHOP_SECURITY`) for the Shop Details Generator.
- `js/shopDetails.js` — Shop Details generation logic: `generateShopDetails()`, `renderShopDetails()`, `readShopDetailsFromUI()`, and `initShopDetails()` with collapse toggle and delegated reroll button wiring.
- `index.html`: `#shop-details-section` added to results view between `#merchant-section` and `#output-section` — collapsible section with Location, Appearance, Quirk, and Security fields, each with a reroll button.
- `js/app.js`: `initShopDetails()` called in `initApp()`.
- `js/app.js`: Generate button now calls `generateShopDetails()` and `renderShopDetails()` after shop generation.
- `js/app.js`: `buildShopData()` now includes `shopDetails: readShopDetailsFromUI()` in the returned shop object.
- `js/app.js`: `applyLoadedShop()` restores shop details via `renderShopDetails()`; shops without a saved `shopDetails` key generate a fresh one.
- `js/app.js`: `resetGeneratorForm()` clears all four `#shop-detail-*` fields.
- `index.html`: script tags for `js/shopDetailsData.js` and `js/shopDetails.js` added before `main.js`.
- `js/shopDetailsData.js`: all four arrays populated — 40 locations, 29 appearances, 108 quirks, 108 security entries.

### Fixed

- `css/style.css`: `#shop-details-header` styles added — matches `#merchant-header` layout with `space-between`, correct button size (`0.8rem`, `0.25rem 0.75rem` padding), and hover state. Collapse/expand button now sits to the right of the section title in both Merchant and Shop Details sections.
- `css/style.css`: `#shop-details-body.hidden` rule added for collapse visibility toggle.
- `css/style.css`: `#merchant-header` and `#shop-details-header` changed from `justify-content: space-between` to `gap: 0.75rem` — collapse/expand buttons now sit immediately to the right of their section title rather than at the far right edge.

## [3.3.0] - 2026-03-17

### Added

- `js/merchant.js`: merchant NPC generation logic (Phase M1) — species/creature
  rolls with full sub-tables, background, personality, bias, quirk, and name
  resolution; `generateMerchant()` orchestrator returns a complete merchant object.
- `js/merchantData.js`: data scaffold — hardcoded tables for backgrounds,
  personalities, biases, species, and creature types; placeholder banks for
  names, appearances, and quirks (to be populated in phases M5/M6).
- `index.html`: `#merchant-section` added to results view above `#output-section` —
  collapsible section with fields for Species/Creature Type, Name, Background,
  Appearance, Personality (multi), Quirks (multi), Likes, and Dislikes (Phase M2).
- `css/style.css`: merchant section styles — `.merchant-row` two-column flex layout,
  `.merchant-field` label/input/button stack, `.merchant-multi-row` for personality
  and quirk rows, `.btn-reroll` and `.btn-remove-item` secondary button styles,
  `#merchant-body.hidden` visibility toggle.
- `js/merchant.js`: `renderMerchant(merchantData)` — populates all merchant
  UI fields from a merchant object (Phase M3).
- `js/merchant.js`: `initMerchant()` — wires collapse toggle, all reroll
  buttons, add/remove for personality and quirk rows (Phase M3).
- `js/merchant.js`: species/creature inline reroll panel with branch and
  per-type checkboxes; constrained reroll respects checked pool only.
- `js/app.js`: `generateMerchant()` + `renderMerchant()` called on Generate;
  `initMerchant()` called in `initApp()`.
- `css/style.css`: `.merchant-species-panel` styles for the inline
  species/creature reroll panel.
- `js/merchant.js`: `readMerchantFromUI()` — reads all merchant UI fields and collapsed state back into a merchant object for persistence.
- `js/app.js`: merchant data is now saved with the shop via `readMerchantFromUI()` in `buildShopData()`.
- `js/app.js`: merchant fields are restored on shop load via `renderMerchant()` in `applyLoadedShop()`; shops without a saved merchant generate a fresh one.
- `js/app.js`: `resetGeneratorForm()` now clears all merchant UI fields.
- `js/merchantData.js`: `MERCHANT_NAMES` populated with full name banks for all
  species and creature type keys (Phase M5).
- `js/merchantData.js`: `MERCHANT_APPEARANCES` replaced with a flat array of ~200
  appearance descriptors shared across all species and creature types (Phase M5).
- `js/merchantData.js`: `MERCHANT_QUIRKS` populated with 118 quirk entries covering speech patterns, mannerisms, habits, and physical tics (Phase M6).

### Changed

- `js/merchant.js`: appearance lookup simplified — `_appearanceKey()` removed;
  `generateMerchant()` and the appearance reroll handler now draw directly from
  the flat `MERCHANT_APPEARANCES` array.

### Fixed

- `js/merchantData.js` and `js/merchant.js` not loaded — added script tags to `index.html`.
- Species/creature reroll panel now remembers branch and per-type
  checkbox selections between opens.
- Clicking Roll no longer closes the species/creature reroll panel;
  selections persist and the button can be clicked repeatedly.
- `js/merchant.js`: `renderMerchant()` now restores the collapsed/expanded state of the merchant section and updates the toggle button label accordingly.
- `js/merchant.js`: `_nameKey()` now maps all creature subtypes (giant, dragon,
  monstrosity, celestial, construct, elemental, fey, fiend, undead) to their
  respective name bank keys; previously all non-humanoid creatures fell through
  to the `default` fallback.

## [3.2.0] - 2026-03-16

### Added

- Qty column in the shop output table is now a directly editable number input.
- Users can tab through qty fields row by row to adjust quantities quickly.
- Editing any qty field triggers the unsaved changes warning.

### Fixed

- Loaded shops now render qty as an editable input (was still rendering as plain text).
- Blur-to-zero and keydown filtering now apply correctly to loaded shops.

## [3.1.0] - 2026-03-16

### Added

- 5 setting-specific visual themes selectable from the top bar:
  Generic D&D (default, light parchment), Ravenloft (dark gothic),
  Forgotten Realms (dark navy/gold), Greyhawk (light sepia),
  Deadwell (dark Egyptian gold).
- Theme preference persists per user in Firestore settings.
- `css/themes.css` — theme definitions as body classes overriding
  CSS custom properties and fonts.
- `js/themes.js` — theme switching, Firestore load/save, dropdown
  initialization.
- 13 D&D class themes: Artificer, Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard.
- New Google Fonts import for class theme fonts.
- Theme dropdown now uses optgroups (Worlds / Classes).

### Changed

- `index.html` — theme dropdown added to top bar.
- `js/app.js` — `initTheme()` called at start of `initApp()`.
- `css/style.css` — `#theme-controls` top bar styles added.

### Fixed

- Deadwell theme font (`sketsa_ramadhanregular`) now loads correctly
  via quoted base64 data URI.
- Font restricted to letters only via `unicode-range`; numbers and
  special characters fall back to EB Garamond.
- Deadwell heading sizes increased (h2: 1.75rem, h3: 1.25rem,
  app title: 1.4rem) for better readability.
- Deadwell theme now applies heading font and sizing to the
  Saved Shops modal header.
- Shop browser ✕ button now correctly closes the modal (event
  listener was missing from initFileSystem).
- Nav-link appearance broken across multiple themes (Barbarian, Cleric, Fighter, Generic, Greyhawk, Ravenloft) due to theme button rules overriding `.nav-link` styles. Scoped nav-link rules to `#main-nav .nav-link` for sufficient specificity.

## [3.0.0] - 2026-03-16

### Changed

- Item database moved from `data/items.json` (public static file) to
  Firestore `items` collection, grouped by source book.
- App now loads item data from Firestore on sign-in instead of fetching
  a static JSON file.

### Removed

- `data/items.json` removed from the repository.

## [2.2.0] - 2026-03-15

### Added

- Top navigation bar replacing the old page header, containing the app title, tool nav links, and user bar.
- Page-switching framework: Generate now navigates to a dedicated results view instead of appending to the bottom of the same page.
- "← New Shop" button on the results view resets all generator fields and returns to the generator view.
- Loading a saved shop via the Shop Browser also navigates to the results view.
- Load Shop button on the generator view, so saved shops can be opened without generating first.

### Fixed

- Generating a new shop no longer carries over the name from a previously loaded shop.
- Opening a saved shop from the Shop Browser now correctly navigates to the results view and displays the item table.

### Changed

- App title changed from "Magic Item Shop Generator" to "Dirty 20" in the UI and page title.
- Generator and results are now separate views; the page no longer scrolls through both at once.

## [2.1.0] - 2026-03-15

### Added

- Access control via Firestore `allowedUsers` collection. Only users whose email
  exists as a document ID in that collection can sign in.
- Unauthorized users are signed out automatically and shown an error message on
  the login screen.

## [2.0.3] - 2025-03-15

Adds robots file to discourage search engines

### Added

- robots.txt
- meta data to index.html

## [2.0.2] - 2026-03-15

Add sign out and user display.

### Added

- Sign out button visible after authentication.
- Signed-in user's email displayed in the user bar.

## [2.0.1] - 2026-03-15

Bug fixes for Firebase migration.

### Fixed

- App scripts not loading after Firebase migration (missing script tags in index.html).
- App initialization not running after auto sign-in due to module/non-module script timing.
- initApp function missing from app.js after refactor.

```

**Commit message:**
```

fix: restore script tags and app initialization after Firebase migration

## [2.0.0] - 2026-03-15

Migrated to Firebase for GitHub Pages hosting and cross-device support.

### Added

- Google Sign-In authentication via Firebase Auth.
- Cloud storage for shops and settings via Firebase Firestore.
- Login screen displayed before app loads; app hidden until authenticated.
- Per-user data isolation — users can only access their own shops and settings.

### Changed

- Save/load system replaced: local File System Access API removed, Firestore used instead.
- App is now hosted on GitHub Pages at https://bdavis19.github.io/dirty-20/
- App no longer requires Chrome/Edge exclusively — any modern browser is supported.
- App no longer requires a local web server to run.
- README updated to reflect GitHub Pages hosting, Firebase auth, and removal of local setup instructions.

### Removed

- Local data folder selection (no longer needed).
- IndexedDB handle persistence (no longer needed).
- `launch.bat` is no longer the primary way to run the app.

## [1.3.0] - 2026-03-15

### Added

- Shop browser modal can now be closed by clicking anywhere on the backdrop outside the dialog box, in addition to the ✕ button.

```

---

**Functional Spec** — in section 13, update:

> - Closing the modal (✕ button) dismisses it without loading anything.

To:

> - Closing the modal (✕ button or clicking outside the dialog) dismisses it without loading anything.

---

**Commit Message:**
```

feat: close shop browser modal by clicking outside dialog

## [1.2.0] - 2026-03-15

Currency display overhaul and markup bug fixes.

### Added

- Prices now display in appropriate D&D currency denominations (cp, sp, ep, gp).
- Marked-up prices that fall between denominations display as mixed currency (e.g. `1 ep 1 sp 2 cp`).
- Price column header now dynamically displays "Price" when no markup is applied, and "Price Markup (Base Price)" when markup is active.

### Fixed

- Markup percentage was not being applied when clicking Generate.
- Prices were not displaying when loading a saved shop.
- Apply markup button had no effect on loaded shops.
- Sub-gold priced items were not affected by markup due to rounding to 0 gp.

## [1.1.0] - 2026-03-15

### Added

- Qty column in the shop output table, visible for all items.
- Randomized quantities for mundane items (1d6).
- Randomized quantities for common consumable magic items (1d6-3, minimum 1).
- Randomized quantities for Potions of Healing, tiered by rarity (1d10 down to 1d10-6, minimum 1).
- All non-randomized items default to a quantity of 1.

### Changed

- Removed the 10-item cap per rarity tier from `rollDice()`.
