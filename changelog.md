# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-03-15

### Added

- Qty column in the shop output table, visible for all items.
- Randomized quantities for mundane items (1d6).
- Randomized quantities for common consumable magic items (1d6-3, minimum 1).
- Randomized quantities for Potions of Healing, tiered by rarity (1d10 down to 1d10-6, minimum 1).
- All non-randomized items default to a quantity of 1.

### Changed

- Removed the 10-item cap per rarity tier from `rollDice()`.
