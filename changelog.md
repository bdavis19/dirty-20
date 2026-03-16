# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-03-16

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

### Changed

- `index.html` — theme dropdown added to top bar.
- `js/app.js` — `initTheme()` called at start of `initApp()`.
- `css/style.css` — `#theme-controls` top bar styles added.

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
