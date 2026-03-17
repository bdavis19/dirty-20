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
  const appearance = _pick(MERCHANT_APPEARANCES);

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

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

/**
 * Populates all merchant UI fields from a merchant data object.
 * @param {object} merchantData — full merchant object (from generateMerchant or saved shop)
 */
function renderMerchant(merchantData) {
  document.getElementById('merchant-species').value        = merchantData.species      || '';
  document.getElementById('merchant-name').value           = merchantData.name         || '';
  document.getElementById('merchant-background').value     = merchantData.background   || '';
  document.getElementById('merchant-appearance').value     = merchantData.appearance   || '';
  document.getElementById('merchant-bias-positive').value  = merchantData.biasPositive || '';
  document.getElementById('merchant-bias-negative').value  = merchantData.biasNegative || '';

  _renderMultiField('merchant-personalities', merchantData.personalities || [], 'personality');
  _renderMultiField('merchant-quirks',        merchantData.quirks        || [], 'quirk');

  // Store current merchant data on the section element for reroll access
  const section = document.getElementById('merchant-section');
  section._merchantData = JSON.parse(JSON.stringify(merchantData));

  // Restore collapsed state
  const body = document.getElementById('merchant-body');
  const btn  = document.getElementById('btn-toggle-merchant');
  const shouldCollapse = merchantData.collapsed === true;
  body.classList.toggle('hidden', shouldCollapse);
  btn.textContent = shouldCollapse ? '▼ Expand' : '▲ Collapse';
}

// ---------------------------------------------------------------------------
// Read UI → merchant object
// ---------------------------------------------------------------------------

/**
 * Reads current merchant UI state back into a merchant object.
 * Includes collapsed state of the section.
 * @returns {object} merchant
 */
function readMerchantFromUI() {
  const collapsed = document.getElementById('merchant-body').classList.contains('hidden');
  const section   = document.getElementById('merchant-section');
  const md        = section._merchantData || {};

  return {
    speciesType:   md.speciesType || 'species',
    species:       document.getElementById('merchant-species').value.trim(),
    name:          document.getElementById('merchant-name').value.trim(),
    background:    document.getElementById('merchant-background').value.trim(),
    appearance:    document.getElementById('merchant-appearance').value.trim(),
    personalities: _readMultiValues('merchant-personalities'),
    quirks:        _readMultiValues('merchant-quirks'),
    biasPositive:  document.getElementById('merchant-bias-positive').value.trim(),
    biasNegative:  document.getElementById('merchant-bias-negative').value.trim(),
    collapsed,
  };
}

/**
 * Renders a list of values into a multi-row field container.
 * Each row: [text input] [⟳ reroll] [− remove]
 *
 * @param {string} containerId — id of the container div
 * @param {string[]} values    — array of string values
 * @param {string} type        — 'personality' or 'quirk'
 */
function _renderMultiField(containerId, values, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  values.forEach(value => _appendMultiRow(container, value, type));
  _updateMultiControls(containerId, type);
}

/**
 * Appends a single multi-row (input + reroll + remove) to a container.
 * @param {HTMLElement} container
 * @param {string} value
 * @param {string} type — 'personality' or 'quirk'
 */
function _appendMultiRow(container, value, type) {
  const row = document.createElement('div');
  row.className = 'merchant-multi-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = value;

  const rerollBtn = document.createElement('button');
  rerollBtn.className = 'btn-reroll';
  rerollBtn.textContent = '⟳';
  rerollBtn.dataset.multiType = type;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'btn-remove-item';
  removeBtn.textContent = '−';
  removeBtn.dataset.multiType = type;

  row.appendChild(input);
  row.appendChild(rerollBtn);
  row.appendChild(removeBtn);
  container.appendChild(row);
}

/**
 * Updates visibility of remove buttons and the add button based on current count.
 * @param {string} containerId
 * @param {string} type — 'personality' or 'quirk'
 */
function _updateMultiControls(containerId, type) {
  const container = document.getElementById(containerId);
  const rows = container.querySelectorAll('.merchant-multi-row');
  const count = rows.length;
  const addBtnId = type === 'personality' ? 'btn-add-personality' : 'btn-add-quirk';

  rows.forEach(row => {
    row.querySelector('.btn-remove-item').style.display = count > 1 ? '' : 'none';
  });

  const addBtn = document.getElementById(addBtnId);
  addBtn.style.display = count >= 3 ? 'none' : '';
}

// ---------------------------------------------------------------------------
// Helper: read current multi-field values from DOM
// ---------------------------------------------------------------------------

function _readMultiValues(containerId) {
  return [...document.getElementById(containerId).querySelectorAll('.merchant-multi-row input')]
    .map(input => input.value.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Species/Creature reroll panel
// ---------------------------------------------------------------------------

/**
 * Builds and toggles the inline species/creature reroll panel below the species field.
 */
function _toggleSpeciesPanel() {
  const field = document.getElementById('merchant-species').closest('.merchant-field');
  let panel = document.getElementById('merchant-species-panel');

  if (panel) {
    panel.remove();
    return;
  }

  const section = document.getElementById('merchant-section');
  const saved = section._speciesPanel || {};

  panel = document.createElement('div');
  panel.id = 'merchant-species-panel';
  panel.className = 'merchant-species-panel';

  panel.innerHTML = `
    <div class="species-panel-branch">
      <label><input type="checkbox" id="sp-check-species" /> Species</label>
      <label><input type="checkbox" id="sp-check-creature" /> Creature Type</label>
    </div>
    <div id="sp-species-options" class="species-panel-options">
      <label><input type="checkbox" class="sp-species-type" value="human" /> Human</label>
      <label><input type="checkbox" class="sp-species-type" value="elf" /> Elf</label>
      <label><input type="checkbox" class="sp-species-type" value="dwarf" /> Dwarf</label>
      <label><input type="checkbox" class="sp-species-type" value="gnome" /> Gnome</label>
      <label><input type="checkbox" class="sp-species-type" value="halfling" /> Halfling</label>
      <label><input type="checkbox" class="sp-species-type" value="tiefling" /> Tiefling</label>
      <label><input type="checkbox" class="sp-species-type" value="dragonborn" /> Dragonborn</label>
    </div>
    <div id="sp-creature-options" class="species-panel-options">
      <label><input type="checkbox" class="sp-creature-type" value="humanoid" /> Humanoid</label>
      <label><input type="checkbox" class="sp-creature-type" value="giant" /> Giant</label>
      <label><input type="checkbox" class="sp-creature-type" value="dragon" /> Dragon</label>
      <label><input type="checkbox" class="sp-creature-type" value="monstrosity" /> Monstrosity</label>
      <label><input type="checkbox" class="sp-creature-type" value="celestial" /> Celestial</label>
      <label><input type="checkbox" class="sp-creature-type" value="construct" /> Construct</label>
      <label><input type="checkbox" class="sp-creature-type" value="elemental" /> Elemental</label>
      <label><input type="checkbox" class="sp-creature-type" value="fey" /> Fey</label>
      <label><input type="checkbox" class="sp-creature-type" value="fiend" /> Fiend</label>
      <label><input type="checkbox" class="sp-creature-type" value="undead" /> Undead</label>
    </div>
    <button id="sp-roll-btn">Roll</button>
  `;

  field.appendChild(panel);

  const checkSpecies  = panel.querySelector('#sp-check-species');
  const checkCreature = panel.querySelector('#sp-check-creature');
  const speciesOpts   = panel.querySelector('#sp-species-options');
  const creatureOpts  = panel.querySelector('#sp-creature-options');
  const rollBtn       = panel.querySelector('#sp-roll-btn');

  // Restore saved state, defaulting to all-species-checked on first open
  const defaultSpeciesTypes  = ['human','elf','dwarf','gnome','halfling','tiefling','dragonborn'];
  const defaultCreatureTypes = ['humanoid','giant','dragon','monstrosity','celestial','construct','elemental','fey','fiend','undead'];

  checkSpecies.checked  = saved.wantSpecies  ?? true;
  checkCreature.checked = saved.wantCreature ?? false;

  panel.querySelectorAll('.sp-species-type').forEach(cb => {
    cb.checked = saved.speciesTypes
      ? saved.speciesTypes.includes(cb.value)
      : defaultSpeciesTypes.includes(cb.value);
  });
  panel.querySelectorAll('.sp-creature-type').forEach(cb => {
    cb.checked = saved.creatureTypes
      ? saved.creatureTypes.includes(cb.value)
      : defaultCreatureTypes.includes(cb.value);
  });

  function saveState() {
    section._speciesPanel = {
      wantSpecies:  checkSpecies.checked,
      wantCreature: checkCreature.checked,
      speciesTypes:  [...panel.querySelectorAll('.sp-species-type:checked')].map(el => el.value),
      creatureTypes: [...panel.querySelectorAll('.sp-creature-type:checked')].map(el => el.value),
    };
  }

  function updatePanelVisibility() {
    speciesOpts.style.display  = checkSpecies.checked  ? '' : 'none';
    creatureOpts.style.display = checkCreature.checked ? '' : 'none';
    rollBtn.disabled = !checkSpecies.checked && !checkCreature.checked;
    saveState();
  }

  panel.addEventListener('change', () => {
    updatePanelVisibility();
  });

  // Apply initial visibility
  updatePanelVisibility();

  rollBtn.addEventListener('click', () => {
    const md = section._merchantData || {};

    const wantSpecies  = checkSpecies.checked;
    const wantCreature = checkCreature.checked;

    let branch;
    if (wantSpecies && wantCreature) {
      branch = Math.random() < 0.5 ? 'species' : 'creature';
    } else if (wantSpecies) {
      branch = 'species';
    } else {
      branch = 'creature';
    }

    let newSpecies, newSpeciesType;

    if (branch === 'species') {
      const checked = [...panel.querySelectorAll('.sp-species-type:checked')].map(el => el.value);
      if (checked.length === 0) return;
      newSpeciesType = 'species';
      newSpecies = _rollSpeciesFromPool(checked);
    } else {
      const checked = [...panel.querySelectorAll('.sp-creature-type:checked')].map(el => el.value);
      if (checked.length === 0) return;
      newSpeciesType = 'creature';
      newSpecies = _rollCreatureFromPool(checked);
    }

    document.getElementById('merchant-species').value = newSpecies;
    section._merchantData = { ...md, species: newSpecies, speciesType: newSpeciesType };
    // Panel stays open — user can keep rolling
  });
}

/**
 * Rolls a species result constrained to the given pool of branch keys.
 * @param {string[]} pool — e.g. ['human', 'elf', 'dragonborn']
 * @returns {string}
 */
function _rollSpeciesFromPool(pool) {
  const branch = pool[Math.floor(Math.random() * pool.length)];
  const map = {
    human:      () => { const s = _rollDie(6); return s <= 4 ? 'Human' : s === 5 ? 'Half-Elf' : 'Half-Orc'; },
    elf:        () => { const s = _rollDie(6); return s <= 2 ? 'High Elf' : s <= 4 ? 'Wood Elf' : 'Dark Elf'; },
    dwarf:      () => { const s = _rollDie(8); return s <= 3 ? 'Hill Dwarf' : s <= 6 ? 'Mountain Dwarf' : 'Duergar'; },
    gnome:      () => 'Gnome',
    halfling:   () => 'Halfling',
    tiefling:   () => 'Tiefling',
    dragonborn: () => {
      const colors = ["Black","Blue","Brass","Bronze","Copper","Gold","Green","Red","Silver","White"];
      return `${colors[_rollDie(10) - 1]} Dragonborn`;
    }
  };
  return (map[branch] || map.human)();
}

/**
 * Rolls a creature result constrained to the given pool of category keys.
 * @param {string[]} pool — e.g. ['humanoid', 'dragon']
 * @returns {string}
 */
function _rollCreatureFromPool(pool) {
  const cat = pool[Math.floor(Math.random() * pool.length)];
  const map = {
    humanoid:    () => { const opts = ["Bugbear","Gnoll","Goblin","Hobgoblin","Kobold","Lizardfolk","Merfolk","Orc"]; return opts[_rollDie(8) - 1]; },
    giant:       () => { const g = _rollDie(6); if (g===1) return _rollDie(2)===1?'Cloud Giant':'Storm Giant'; if (g===2) return 'Cyclops'; if (g===3) return 'Ettin'; if (g===4) return _rollDie(2)===1?'Fire Giant':'Frost Giant'; if (g===5) return 'Hill Giant'; return 'Stone Giant'; },
    dragon:      () => { const colors=["Black","Blue","Brass","Bronze","Copper","Gold","Green","Red","Silver","White"]; return `${colors[_rollDie(10)-1]} Dragon`; },
    monstrosity: () => { const opts=["Centaur","Drider","Ettercap","Medusa","Minotaur","Sphinx"]; return opts[_rollDie(6)-1]; },
    celestial:   () => { const opts=["Couatl","Deva","Planetar","Unicorn"]; return opts[_rollDie(4)-1]; },
    construct:   () => { const opts=["Clay Golem","Flesh Golem","Iron Golem","Stone Golem"]; return opts[_rollDie(4)-1]; },
    elemental:   () => { const opts=["Azer","Djinni","Efreeti","Gargoyle"]; return opts[_rollDie(4)-1]; },
    fey:         () => { const opts=["Dryad","Hag","Pixie","Satyr"]; return opts[_rollDie(4)-1]; },
    fiend:       () => { const opts=["Balor","Imp","Pit Fiend","Quasit","Rakshasa","Succubus"]; return opts[_rollDie(6)-1]; },
    undead:      () => { const opts=["Banshee","Ghast","Ghost","Lich","Mummy","Vampire"]; return opts[_rollDie(6)-1]; }
  };
  return (map[cat] || map.humanoid)();
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

/**
 * Sets up all merchant section interactivity:
 * collapse toggle, reroll buttons, add/remove for personality and quirk.
 * Call once from initApp().
 */
function initMerchant() {
  // --- Collapse toggle ---
  document.getElementById('btn-toggle-merchant').addEventListener('click', () => {
    const body   = document.getElementById('merchant-body');
    const btn    = document.getElementById('btn-toggle-merchant');
    const hidden = body.classList.toggle('hidden');
    btn.textContent = hidden ? '▼ Expand' : '▲ Collapse';

    const section = document.getElementById('merchant-section');
    if (section._merchantData) section._merchantData.collapsed = hidden;
  });

  // --- Reroll buttons (delegated on merchant-section) ---
  document.getElementById('merchant-section').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-reroll');
    if (!btn) return;

    const field = btn.dataset.field;

    // Multi-row reroll (personality / quirk)
    if (btn.dataset.multiType) {
      const type = btn.dataset.multiType;
      const containerId = type === 'personality' ? 'merchant-personalities' : 'merchant-quirks';
      const existing = _readMultiValues(containerId);
      const row = btn.closest('.merchant-multi-row');
      const input = row.querySelector('input');
      const newVal = type === 'personality'
        ? rollMerchantPersonality(existing.filter(v => v !== input.value))
        : rollMerchantQuirk(existing.filter(v => v !== input.value));
      input.value = newVal;
      return;
    }

    // Single-field rerolls
    const section = document.getElementById('merchant-section');
    const md = section._merchantData || {};

    switch (field) {
      case 'species': {
        _toggleSpeciesPanel();
        break;
      }
      case 'name': {
        const species = document.getElementById('merchant-species').value || md.species || '';
        const bank = MERCHANT_NAMES[_nameKey(species)] || MERCHANT_NAMES.default;
        document.getElementById('merchant-name').value = _pick(bank);
        break;
      }
      case 'background': {
        document.getElementById('merchant-background').value = rollMerchantBackground();
        break;
      }
      case 'appearance': {
        document.getElementById('merchant-appearance').value = _pick(MERCHANT_APPEARANCES);
        break;
      }
      case 'bias-positive': {
        const negVal = document.getElementById('merchant-bias-negative').value;
        const { positive } = rollMerchantBiases(null, negVal);
        document.getElementById('merchant-bias-positive').value = positive;
        break;
      }
      case 'bias-negative': {
        const posVal = document.getElementById('merchant-bias-positive').value;
        const { negative } = rollMerchantBiases(posVal, null);
        document.getElementById('merchant-bias-negative').value = negative;
        break;
      }
    }
  });

  // --- Remove buttons (delegated) ---
  document.getElementById('merchant-section').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-remove-item');
    if (!btn) return;

    const type = btn.dataset.multiType;
    const containerId = type === 'personality' ? 'merchant-personalities' : 'merchant-quirks';
    const row = btn.closest('.merchant-multi-row');
    row.remove();
    _updateMultiControls(containerId, type);
  });

  // --- Add personality ---
  document.getElementById('btn-add-personality').addEventListener('click', () => {
    const containerId = 'merchant-personalities';
    const container = document.getElementById(containerId);
    const existing = _readMultiValues(containerId);
    if (existing.length >= 3) return;
    const newVal = rollMerchantPersonality(existing);
    _appendMultiRow(container, newVal, 'personality');
    _updateMultiControls(containerId, 'personality');
  });

  // --- Add quirk ---
  document.getElementById('btn-add-quirk').addEventListener('click', () => {
    const containerId = 'merchant-quirks';
    const container = document.getElementById(containerId);
    const existing = _readMultiValues(containerId);
    if (existing.length >= 3) return;
    const newVal = rollMerchantQuirk(existing);
    _appendMultiRow(container, newVal, 'quirk');
    _updateMultiControls(containerId, 'quirk');
  });
}