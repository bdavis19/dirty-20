// merchantData.js
// Data banks and tables for the Merchant Generator.
// Name and appearance banks are scaffolded as placeholders (populated in Phase M5).
// Quirk bank is scaffolded as placeholder (populated in Phase M6).
// Backgrounds, personalities, biases, species, and creature tables are fully hardcoded.

// ---------------------------------------------------------------------------
// Name banks — keyed by species/creature subtype. Populated in Phase M5.
// ---------------------------------------------------------------------------

const MERCHANT_NAMES = {
  human:         ["Aldric", "Brenna", "Corvin"],
  halfElf:       ["Aelindra", "Soren", "Lyra"],
  halfOrc:       ["Grolk", "Marga", "Durva"],
  highElf:       ["Aerindel", "Caladwen", "Thalion"],
  woodElf:       ["Faelyn", "Riven", "Sylara"],
  darkElf:       ["Zilvra", "Nathrae", "Szordrin"],
  hillDwarf:     ["Bofri", "Hilda", "Tordin"],
  mountainDwarf: ["Durgin", "Helga", "Morgran"],
  duergar:       ["Thordak", "Grendis", "Varka"],
  gnome:         ["Fizwick", "Nimbly", "Trizzie"],
  halfling:      ["Rosie", "Pip", "Tomlin"],
  tiefling:      ["Zara", "Mordecai", "Seriva"],
  dragonborn:    ["Kriv", "Nala", "Arjhan"],
  humanoid:      ["Gritch", "Varsha", "Rokk"],
  default:       ["Stranger", "Wanderer", "Unnamed"]
};

// ---------------------------------------------------------------------------
// Appearance banks — keyed by species. Populated in Phase M5.
// ---------------------------------------------------------------------------

const MERCHANT_APPEARANCES = {
  human:         ["Weathered face, calloused hands", "Broad shoulders, cropped gray hair"],
  halfElf:       ["Pointed ears, hazel eyes", "Tall and lean with a graceful bearing"],
  halfOrc:       ["Prominent tusks, olive-green skin", "Heavy brow, scar across the jaw"],
  highElf:       ["Pale and sharp-featured, silver hair", "Elegant posture, violet eyes"],
  woodElf:       ["Tanned skin, leaf-pattern tattoos", "Bright green eyes, unruly brown hair"],
  darkElf:       ["White hair, crimson eyes", "Obsidian skin, imperious gaze"],
  hillDwarf:     ["Braided copper beard, stout frame", "Ruddy cheeks, long braided hair"],
  mountainDwarf: ["Granite-gray beard, barrel chest", "Scarred forearms, iron-gray hair"],
  duergar:       ["Ashen skin, hollow eyes", "Gaunt frame, perpetual scowl"],
  gnome:         ["Wild white hair, sparkling blue eyes", "Tiny but wiry, large round spectacles"],
  halfling:      ["Curly hair, rosy cheeks", "Small and quick, bright inquisitive eyes"],
  tiefling:      ["Ram horns, violet skin", "Pointed tail, gold slit-pupil eyes"],
  dragonborn:    ["Copper scales, amber eyes", "Broad snout, crest of spines"],
  default:       ["Unremarkable features", "Difficult to describe clearly"]
};

// ---------------------------------------------------------------------------
// Quirk bank — flat array. Populated in Phase M6.
// ---------------------------------------------------------------------------

const MERCHANT_QUIRKS = [
  "Hums while counting coin",
  "Refuses to shake hands",
  "Keeps a lucky charm visible at all times",
  "Never makes eye contact",
  "Speaks in a conspiratorial whisper",
  "Constantly fidgets with something on the counter"
];

// ---------------------------------------------------------------------------
// Background table — 1d20
// ---------------------------------------------------------------------------

const MERCHANT_BACKGROUNDS = [
  "Acolyte",
  "Charlatan",
  "Criminal",
  "Entertainer",
  "Folk Hero",
  "Guild Artisan",
  "Hermit",
  "Noble",
  "Outlander",
  "Sage",
  "Sailor",
  "Soldier",
  "Urchin",
  "Far Traveler",
  "Haunted One",
  "Knight",
  "Pirate",
  "City Watch",
  "Clan Crafter",
  "Courtier"
];

// ---------------------------------------------------------------------------
// Personality table — 1d20
// ---------------------------------------------------------------------------

const MERCHANT_PERSONALITIES = [
  "Boastful",
  "Cautious",
  "Cheerful",
  "Cowardly",
  "Curious",
  "Cynical",
  "Flirtatious",
  "Generous",
  "Gruff",
  "Honest",
  "Inquisitive",
  "Lazy",
  "Meticulous",
  "Mysterious",
  "Nervous",
  "Paranoid",
  "Sarcastic",
  "Secretive",
  "Superstitious",
  "Talkative"
];

// ---------------------------------------------------------------------------
// Bias tables — 1d20 each (positive and negative)
// ---------------------------------------------------------------------------

const MERCHANT_BIASES = [
  "The poor",
  "The rich",
  "Adventurers",
  "The clergy",
  "Soldiers",
  "Magic users",
  "Elves",
  "Dwarves",
  "Halflings",
  "Tieflings",
  "Half-orcs",
  "Gnomes",
  "Merchants",
  "Nobles",
  "Outlanders",
  "Scholars",
  "Sailors",
  "Thieves",
  "The City Guard",
  "Travelers"
];

// ---------------------------------------------------------------------------
// Species table — nested roll structure
// Top roll: 1d8
// ---------------------------------------------------------------------------

const MERCHANT_SPECIES_TABLE = {
  // 1–2: Human branch
  human: {
    weight: 2, // occupies slots 1–2
    subroll: {
      1: "Human",
      2: "Human",
      3: "Human",
      4: "Human",
      5: "Half-Elf",
      6: "Half-Orc"
    }
  },
  // 3: Elf branch
  elf: {
    weight: 1,
    subroll: {
      1: "High Elf",
      2: "High Elf",
      3: "Wood Elf",
      4: "Wood Elf",
      5: "Dark Elf",
      6: "Dark Elf"
    }
  },
  // 4: Dwarf branch
  dwarf: {
    weight: 1,
    subroll: {
      1: "Hill Dwarf",
      2: "Hill Dwarf",
      3: "Hill Dwarf",
      4: "Mountain Dwarf",
      5: "Mountain Dwarf",
      6: "Mountain Dwarf",
      7: "Duergar",
      8: "Duergar"
    }
  },
  // 5: Gnome
  gnome:     { weight: 1, result: "Gnome" },
  // 6: Halfling
  halfling:  { weight: 1, result: "Halfling" },
  // 7: Tiefling
  tiefling:  { weight: 1, result: "Tiefling" },
  // 8: Dragonborn branch
  dragonborn: {
    weight: 1,
    subroll: {
      1:  "Black Dragonborn",
      2:  "Blue Dragonborn",
      3:  "Brass Dragonborn",
      4:  "Bronze Dragonborn",
      5:  "Copper Dragonborn",
      6:  "Gold Dragonborn",
      7:  "Green Dragonborn",
      8:  "Red Dragonborn",
      9:  "Silver Dragonborn",
      10: "White Dragonborn"
    }
  }
};

// ---------------------------------------------------------------------------
// Creature table — nested roll structure
// Top roll: 1d10
// ---------------------------------------------------------------------------

const MERCHANT_CREATURE_TABLE = {
  // 1: Humanoid
  humanoid: {
    subroll: {
      1: "Bugbear",
      2: "Gnoll",
      3: "Goblin",
      4: "Hobgoblin",
      5: "Kobold",
      6: "Lizardfolk",
      7: "Merfolk",
      8: "Orc"
    }
  },
  // 2: Giant
  giant: {
    subroll: {
      1: "Cloud Giant",   // 1d2 between Cloud and Storm resolved here
      2: "Storm Giant",
      3: "Cyclops",
      4: "Ettin",
      5: "Fire Giant",    // 1d2 between Fire and Frost resolved here
      6: "Frost Giant",
      7: "Hill Giant",
      8: "Stone Giant"    // note: original table has 1d6; expanded to 1d8 to fit all entries cleanly
    }
  },
  // 3: Dragon — same 10 colors as Dragonborn
  dragon: {
    subroll: {
      1:  "Black Dragon",
      2:  "Blue Dragon",
      3:  "Brass Dragon",
      4:  "Bronze Dragon",
      5:  "Copper Dragon",
      6:  "Gold Dragon",
      7:  "Green Dragon",
      8:  "Red Dragon",
      9:  "Silver Dragon",
      10: "White Dragon"
    }
  },
  // 4: Monstrosity
  monstrosity: {
    subroll: {
      1: "Centaur",
      2: "Drider",
      3: "Ettercap",
      4: "Medusa",
      5: "Minotaur",
      6: "Sphinx"
    }
  },
  // 5: Celestial
  celestial: {
    subroll: {
      1: "Couatl",
      2: "Deva",
      3: "Planetar",
      4: "Unicorn"
    }
  },
  // 6: Construct
  construct: {
    subroll: {
      1: "Clay Golem",
      2: "Flesh Golem",
      3: "Iron Golem",
      4: "Stone Golem"
    }
  },
  // 7: Elemental
  elemental: {
    subroll: {
      1: "Azer",
      2: "Djinni",
      3: "Efreeti",
      4: "Gargoyle"
    }
  },
  // 8: Fey
  fey: {
    subroll: {
      1: "Dryad",
      2: "Hag",
      3: "Pixie",
      4: "Satyr"
    }
  },
  // 9: Fiend
  fiend: {
    subroll: {
      1: "Balor",
      2: "Imp",
      3: "Pit Fiend",
      4: "Quasit",
      5: "Rakshasa",
      6: "Succubus"
    }
  },
  // 10: Undead
  undead: {
    subroll: {
      1: "Banshee",
      2: "Ghast",
      3: "Ghost",
      4: "Lich",
      5: "Mummy",
      6: "Vampire"
    }
  }
};