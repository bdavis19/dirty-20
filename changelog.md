# Changelog

All notable changes to this project will be documented in this file.

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
