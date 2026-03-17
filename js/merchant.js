// merchant.js
// Merchant NPC generation logic for the Shop Merchant Generator.
// All functions are globally scoped (no module exports), consistent with codebase pattern.
// Depends on: merchantData.js (must be loaded first).

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

// Rolls a fair die with `sides` sides. Returns integer 1–sides.
function _rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// Picks a random element from an array.
function _pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Returns a random element from `arr` that is NOT in the `exclude` array.
// Falls back to any element if all are excluded.
function _pickExcluding(arr, exclude) {
  const pool = arr.filter(item => !exclude.includes(item));
  return pool.length > 0 ? _pick(pool) : _pick(arr);
}

// ---------------------------------------------------------------------------
// Species / Creature roll
// ---------------------------------------------------------------------------

/**
 * Rolls 1d2 to determine branch (species or creature), then resolves
 * sub-tables to return a specific species or creature type.
 *
 * @returns {{ speciesType: "species"|"creature", species: string }}
 */
function rollMerchantSpeciesOrCreature() {
  const branch = _rollDie(2); // 1 = species, 2 = creature

  if (branch === 1) {
    return { speciesType: "species", species: _rollSpecies() };
  } else {
    return { speciesType: "creature", species: _rollCreature() };
  }
}

function _rollSpecies() {
  // Top roll: 1d8. Slots: 1–2 = human branch, 3 = elf, 4 = dwarf, 5 = gnome,
  // 6 = halfling, 7 = tiefling, 8 = dragonborn
  const top = _rollDie(8);

  if (top <= 2) {
    // Human branch: 1d6
    const sub = _rollDie(6);
    const map = { 1: "Human", 2: "Human", 3: "Human", 4: "Human", 5: "Half-Elf", 6: "Half-Orc" };
    return map[sub];
  }
  if (top === 3) {
    // Elf branch: 1d6
    const sub = _rollDie(6);
    if (sub <= 2) return "High Elf";
    if (sub <= 4) return "Wood Elf";
    return "Dark Elf";
  }
  if (top === 4) {
    // Dwarf branch: 1d8
    const sub = _rollDie(8);
    if (sub <= 3) return "Hill Dwarf";
    if (sub <= 6) return "Mountain Dwarf";
    return "Duergar";
  }
  if (top === 5) return "Gnome";
  if (top === 6) return "Halfling";
  if (top === 7) return "Tiefling";

  // top === 8: Dragonborn branch: 1d10
  const colors = ["Black", "Blue", "Brass", "Bronze", "Copper", "Gold", "Green", "Red", "Silver", "White"];
  return `${colors[_rollDie(10) - 1]} Dragonborn`;
}

function _rollCreature() {
  // Top roll: 1d10
  const top = _rollDie(10);

  if (top === 1) {
    // Humanoid: 1d8
    const opts = ["Bugbear", "Gnoll", "Goblin", "Hobgoblin", "Kobold", "Lizardfolk", "Merfolk", "Orc"];
    return opts[_rollDie(8) - 1];
  }
  if (top === 2) {
    // Giant: resolve Cloud/Storm and Fire/Frost via 1d2 each, plus Cyclops, Ettin, Hill, Stone
    // Full weighted list: Cloud Giant, Storm Giant, Cyclops, Ettin, Fire Giant, Frost Giant, Hill Giant, Stone Giant
    const giantRoll = _rollDie(6);
    if (giantRoll === 1) return _rollDie(2) === 1 ? "Cloud Giant" : "Storm Giant";
    if (giantRoll === 2) return "Cyclops";
    if (giantRoll === 3) return "Ettin";
    if (giantRoll === 4) return _rollDie(2) === 1 ? "Fire Giant" : "Frost Giant";
    if (giantRoll === 5) return "Hill Giant";
    return "Stone Giant";
  }
  if (top === 3) {
    // Dragon: 1d10 same colors as Dragonborn
    const colors = ["Black", "Blue", "Brass", "Bronze", "Copper", "Gold", "Green", "Red", "Silver", "White"];
    return `${colors[_rollDie(10) - 1]} Dragon`;
  }
  if (top === 4) {
    const opts = ["Centaur", "Drider", "Ettercap", "Medusa", "Minotaur", "Sphinx"];
    return opts[_rollDie(6) - 1];
  }
  if (top === 5) {
    const opts = ["Couatl", "Deva", "Planetar", "Unicorn"];
    return opts[_rollDie(4) - 1];
  }
  if (top === 6) {
    const opts = ["Clay Golem", "Flesh Golem", "Iron Golem", "Stone Golem"];
    return opts[_rollDie(4) - 1];
  }
  if (top === 7) {
    const opts = ["Azer", "Djinni", "Efreeti", "Gargoyle"];
    return opts[_rollDie(4) - 1];
  }
  if (top === 8) {
    const opts = ["Dryad", "Hag", "Pixie", "Satyr"];
    return opts[_rollDie(4) - 1];
  }
  if (top === 9) {
    const opts = ["Balor", "Imp", "Pit Fiend", "Quasit", "Rakshasa", "Succubus"];
    return opts[_rollDie(6) - 1];
  }
  // top === 10: Undead
  const opts = ["Banshee", "Ghast", "Ghost", "Lich", "Mummy", "Vampire"];
  return opts[_rollDie(6) - 1];
}

// ---------------------------------------------------------------------------
// Background
// ---------------------------------------------------------------------------

/**
 * Rolls 1d20 against MERCHANT_BACKGROUNDS.
 * @returns {string}
 */
function rollMerchantBackground() {
  return MERCHANT_BACKGROUNDS[_rollDie(20) - 1];
}

// ---------------------------------------------------------------------------
// Personality
// ---------------------------------------------------------------------------

/**
 * Rolls 1d20 against MERCHANT_PERSONALITIES, excluding any already in `existing`.
 * Used for initial generation and per-item reroll.
 *
 * @param {string[]} existing — personalities already assigned to this merchant
 * @returns {string}
 */
function rollMerchantPersonality(existing) {
  return _pickExcluding(MERCHANT_PERSONALITIES, existing);
}

// ---------------------------------------------------------------------------
// Biases
// ---------------------------------------------------------------------------

/**
 * Rolls two entries from MERCHANT_BIASES: one positive, one negative.
 * Ensures they are not the same entry.
 *
 * @param {string} existingPositive — current positive bias (used for reroll exclusion)
 * @param {string} existingNegative — current negative bias (used for reroll exclusion)
 * @returns {{ positive: string, negative: string }}
 */
function rollMerchantBiases(existingPositive, existingNegative) {
  const positive = _pickExcluding(MERCHANT_BIASES, [existingNegative]);
  const negative = _pickExcluding(MERCHANT_BIASES, [positive]);
  return { positive, negative };
}

// ---------------------------------------------------------------------------
// Name lookup
// ---------------------------------------------------------------------------

// Maps a species/creature string to a MERCHANT_NAMES bank key.
function _nameKey(species) {
  const map = {
    "Human":           "human",
    "Half-Elf":        "halfElf",
    "Half-Orc":        "halfOrc",
    "High Elf":        "highElf",
    "Wood Elf":        "woodElf",
    "Dark Elf":        "darkElf",
    "Hill Dwarf":      "hillDwarf",
    "Mountain Dwarf":  "mountainDwarf",
    "Duergar":         "duergar",
    "Gnome":           "gnome",
    "Halfling":        "halfling",
    "Tiefling":        "tiefling"
  };

  // Dragonborn (any color)
  if (species.endsWith("Dragonborn")) return "dragonborn";

  // Humanoid subtypes
  const humanoids = ["Bugbear","Gnoll","Goblin","Hobgoblin","Kobold","Lizardfolk","Merfolk","Orc"];
  if (humanoids.includes(species)) return "humanoid";

  return map[species] || "default";
}

// ---------------------------------------------------------------------------
// Appearance lookup
// ---------------------------------------------------------------------------

function _appearanceKey(species) {
  // Appearance keys mirror name keys for species; creatures fall back to default.
  return _nameKey(species);
}

// ---------------------------------------------------------------------------
// Quirk lookup
// ---------------------------------------------------------------------------

/**
 * Picks a quirk from MERCHANT_QUIRKS excluding those already chosen.
 * @param {string[]} existing
 * @returns {string}
 */
function rollMerchantQuirk(existing) {
  return _pickExcluding(MERCHANT_QUIRKS, existing);
}

// ---------------------------------------------------------------------------
// Main orchestrator
// ---------------------------------------------------------------------------

/**
 * Generates a full merchant object with all fields.
 * @returns {object} merchant — matches the merchant data structure in the spec
 */
function generateMerchant() {
  const { speciesType, species } = rollMerchantSpeciesOrCreature();

  const background = rollMerchantBackground();

  // 1–3 personalities, no repeats
  const personalityCount = _rollDie(3);
  const personalities = [];
  for (let i = 0; i < personalityCount; i++) {
    personalities.push(rollMerchantPersonality(personalities));
  }

  // Name from species bank
  const nameBank = MERCHANT_NAMES[_nameKey(species)] || MERCHANT_NAMES.default;
  const name = _pick(nameBank);

  // Appearance from species bank
  const appearanceBank = MERCHANT_APPEARANCES[_appearanceKey(species)] || MERCHANT_APPEARANCES.default;
  const appearance = _pick(appearanceBank);

  // 1–3 quirks, no repeats
  const quirkCount = _rollDie(3);
  const quirks = [];
  for (let i = 0; i < quirkCount; i++) {
    quirks.push(rollMerchantQuirk(quirks));
  }

  // Biases
  const { positive: biasPositive, negative: biasNegative } = rollMerchantBiases(null, null);

  return {
    speciesType,
    species,
    name,
    background,
    personalities,
    appearance,
    quirks,
    biasPositive,
    biasNegative,
    collapsed: false
  };
}