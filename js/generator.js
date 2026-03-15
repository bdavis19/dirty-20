// generator.js

// Parses a quantity input and returns a rolled result, capped at 10.
// Accepts: plain numbers ("5"), dice notation ("2d4", "1d6+1", "1d10-2")
function rollDice(input) {
  const str = String(input).trim().toLowerCase();

  if (/^\d+$/.test(str)) {
    return parseInt(str, 10);
  }

  const match = str.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!match) return 0;

  const numDice = parseInt(match[1] || '1', 10);
  const sides   = parseInt(match[2], 10);
  const mod     = parseInt(match[3] || '0', 10);

  let total = mod;
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }

  return Math.max(0, total);
}

function rollItemQuantity(item) {
  // Mundane: 1d6
  if (item.rarity === 'mundane') {
    return Math.floor(Math.random() * 6) + 1;
  }

  // Common consumable magic items: 1d6-3, minimum 1
  if (item.rarity === 'common' && item.categories?.includes('consumable')) {
    return Math.max(1, (Math.floor(Math.random() * 6) + 1) - 3);
  }

  // Potions of Healing by rarity tier
  const healingPotionRolls = {
    'common':    () => Math.floor(Math.random() * 10) + 1,           // 1d10
    'uncommon':  () => Math.max(1, (Math.floor(Math.random() * 10) + 1) - 2), // 1d10-2
    'rare':      () => Math.max(1, (Math.floor(Math.random() * 10) + 1) - 4), // 1d10-4
    'very rare': () => Math.max(1, (Math.floor(Math.random() * 10) + 1) - 6), // 1d10-6
  };

  const healingPotionNames = [
    'Potion of Healing',
    'Potion of Greater Healing',
    'Potion of Superior Healing',
    'Potion of Supreme Healing',
  ];

  if (healingPotionNames.includes(item.name)) {
    return healingPotionRolls[item.rarity]?.() ?? 1;
  }

  return 1; // No quantity for other items
}

// Filters the full item list down to eligible items for a given rarity and active filters.
// Returns an array of matching items.
function filterItems(allItems, rarity, filters) {
  return allItems.filter(item => {

    // Must match the requested rarity
    if (item.rarity !== rarity) return false;

    // Magic type filter (only applies to non-mundane items)
    if (rarity !== 'mundane' && filters.magicTypes && filters.magicTypes.length > 0) {
      if (!filters.magicTypes.includes(item.type)) return false;
    }

    // Mundane category filter (only applies to mundane items)
    if (rarity === 'mundane' && filters.mundaneCategories && filters.mundaneCategories.length > 0) {
      if (!filters.mundaneCategories.includes(item.mundaneCategory)) return false;
    }

    // Overall categories filter (applies to all items)
    if (filters.overallCategories && filters.overallCategories.length > 0) {
      const hasMatch = item.categories.some(cat => filters.overallCategories.includes(cat));
      if (!hasMatch) return false;
    }

    // Price range filter — uses basePrice (Price 1) as the reference
    if (filters.minPrice != null && item.basePrice != null) {
      if (item.basePrice < filters.minPrice) return false;
    }
    if (filters.maxPrice != null && item.basePrice != null) {
      if (item.basePrice > filters.maxPrice) return false;
    }

    return true;
  });
}

// Randomly selects `count` unique items from a pool array.
// Returns an array of selected items (no duplicates).
function pickItems(pool, count) {
  if (pool.length === 0 || count === 0) return [];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

// Applies a markup/markdown percentage to an item's prices.
// Adds adjustedPrice1 and adjustedPrice2 to each item object.
// markupPercent: e.g. 25 means +25%, -15 means -15%
function applyMarkup(items, markupPercent) {
  const multiplier = 1 + (markupPercent / 100);

  return items.map(item => {
    const adj1 = item.basePrice != null
      ? Math.round(item.basePrice * multiplier)
      : null;

    const adj2 = item.basePrice2 != null
      ? Math.round(item.basePrice2 * multiplier)
      : null;

    return { ...item, adjustedPrice1: adj1, adjustedPrice2: adj2 };
  });
}

// Main orchestrator. Pulls everything together and returns the final item array.
// settings shape mirrors the saved shop schema from the Project Primer.
function generateShop(allItems, settings) {
  const { quantities, includePotionsOfHealing, markupPercent, filters } = settings;

  const rarities = [
    { key: 'mundane',   inputId: quantities.mundane },
    { key: 'common',    inputId: quantities.common },
    { key: 'uncommon',  inputId: quantities.uncommon },
    { key: 'rare',      inputId: quantities.rare },
    { key: 'very rare', inputId: quantities.veryRare },
    { key: 'legendary', inputId: quantities.legendary },
  ];

  let results = [];

  for (const { key, inputId } of rarities) {
    const count = rollDice(inputId);
    const pool  = filterItems(allItems, key, filters);
    const picks = pickItems(pool, count).map(item => ({
      ...item,
      quantity: rollItemQuantity(item)
    }));
    results = results.concat(picks);
  }

  // Potions of Healing — added separately, do not count against rarity totals
  if (includePotionsOfHealing) {
    const healingPotions = [
      'Potion of Healing',
      'Potion of Greater Healing',
      'Potion of Superior Healing',
      'Potion of Supreme Healing',
    ];
    healingPotions.forEach(name => {
      const potion = allItems.find(item => item.name === name);
      if (potion) results.push({
        ...potion,
        quantity: rollItemQuantity(potion)
      });
    });
  }

  const rarityOrder = ['mundane', 'common', 'uncommon', 'rare', 'very rare', 'legendary'];

  const sorted = applyMarkup(results, markupPercent ?? 0).sort((a, b) => {
    const rarityDiff = rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
    if (rarityDiff !== 0) return rarityDiff;
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return sorted;
}