// app.js

// app.js — Built-in presets

const ALL_MAGIC_TYPES = ['armor','potion','ring','rod','scroll','staff','wand','weapon','wondrous'];
const ALL_MUNDANE_CATEGORIES = ['adventuring gear','arcane gear','divine gear','containers','artisan supplies','trade tools','gemstones','clothes','gaming','packs','kits','musical instruments','alchemical supplies','armor','weapons','ammunition','furnishings'];
const ALL_OVERALL_CATEGORIES = ['nonmagical','consumable','combat','noncombat','summoning','gamechanging'];

const BUILT_IN_PRESETS = {
  'Village': {
    quantities: { mundane: '2d6', common: '1d2-1', uncommon: '0', rare: '0', veryRare: '0', legendary: '0' },
    includePotionsOfHealing: true,
    filters: { magicTypes: ['potion'], mundaneCategories: ALL_MUNDANE_CATEGORIES, overallCategories: ALL_OVERALL_CATEGORIES, minPrice: null, maxPrice: null }
  },
  'Small Town': {
    quantities: { mundane: '3d6', common: '1d4', uncommon: '1d4-1', rare: '1d12-11', veryRare: '0', legendary: '0' },
    includePotionsOfHealing: true,
    filters: { magicTypes: ALL_MAGIC_TYPES, mundaneCategories: ALL_MUNDANE_CATEGORIES, overallCategories: ALL_OVERALL_CATEGORIES, minPrice: null, maxPrice: null }
  },
  'Large Town': {
    quantities: { mundane: '3d6', common: '1d8', uncommon: '1d6', rare: '1d2-1', veryRare: '1d4-3', legendary: '1d100-99' },
    includePotionsOfHealing: true,
    filters: { magicTypes: ALL_MAGIC_TYPES, mundaneCategories: ALL_MUNDANE_CATEGORIES, overallCategories: ALL_OVERALL_CATEGORIES, minPrice: null, maxPrice: null }
  },
  'Small City': {
    quantities: { mundane: '4d6', common: '1d10', uncommon: '2d4', rare: '1d4', veryRare: '1d3-2', legendary: '1d50-49' },
    includePotionsOfHealing: true,
    filters: { magicTypes: ALL_MAGIC_TYPES, mundaneCategories: ALL_MUNDANE_CATEGORIES, overallCategories: ALL_OVERALL_CATEGORIES, minPrice: null, maxPrice: null }
  },
  'Large City': {
    quantities: { mundane: '4d6', common: '3d4', uncommon: '1d8+4', rare: '1d8+2', veryRare: '1d3', legendary: '1d20-19' },
    includePotionsOfHealing: true,
    filters: { magicTypes: ALL_MAGIC_TYPES, mundaneCategories: ALL_MUNDANE_CATEGORIES, overallCategories: ALL_OVERALL_CATEGORIES, minPrice: null, maxPrice: null }
  },
  'General Store': {
    quantities: { mundane: '4d6', common: '1d8-7', uncommon: '0', rare: '0', veryRare: '0', legendary: '0' },
    includePotionsOfHealing: true,
    filters: { magicTypes: [], mundaneCategories: ALL_MUNDANE_CATEGORIES, overallCategories: ['nonmagical','consumable'], minPrice: null, maxPrice: null }
  }
};

function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const target = document.getElementById('view-' + viewId);
  if (target) { target.classList.remove('hidden'); window.scrollTo(0, 0); }
}

function resetGeneratorForm() {
  ['qty-mundane','qty-common','qty-uncommon','qty-rare','qty-very-rare','qty-legendary']
    .forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('include-potions').checked = false;
  document.getElementById('markup-percent').value = 0;
  document.getElementById('builtin-preset-select').value = '';
  document.getElementById('custom-preset-select').value = '';
  document.getElementById('markup-preset-select').value = '';
  ['magic-types','mundane-categories','overall-categories'].forEach(group => {
    document.querySelectorAll(`#${group} input[type="checkbox"]`).forEach(cb => cb.checked = true);
  });
  document.getElementById('min-price').value = '';
  document.getElementById('max-price').value = '';
}

function applyPreset(presetName) {
  const preset = BUILT_IN_PRESETS[presetName];
  if (!preset) return;

  const q = preset.quantities;
  document.getElementById('qty-mundane').value   = q.mundane;
  document.getElementById('qty-common').value    = q.common;
  document.getElementById('qty-uncommon').value  = q.uncommon;
  document.getElementById('qty-rare').value      = q.rare;
  document.getElementById('qty-very-rare').value = q.veryRare;
  document.getElementById('qty-legendary').value = q.legendary;

  document.getElementById('include-potions').checked = preset.includePotionsOfHealing;

  const f = preset.filters;
  document.querySelectorAll('#magic-types input').forEach(el => {
    el.checked = f.magicTypes.includes(el.value);
  });
  document.querySelectorAll('#mundane-categories input').forEach(el => {
    el.checked = f.mundaneCategories.includes(el.value);
  });
  document.querySelectorAll('#overall-categories input').forEach(el => {
    el.checked = f.overallCategories.includes(el.value);
  });

  document.getElementById('min-price').value = f.minPrice ?? '';
  document.getElementById('max-price').value = f.maxPrice ?? '';
}

async function loadMarkupPresets() {
  const settings = await readSettings();
  const presets = settings.markupPresets || [];
  const select = document.getElementById('markup-preset-select');

  // Clear all options except the first placeholder
  while (select.options.length > 1) {
    select.remove(1);
  }

  presets.forEach(preset => {
    const option = document.createElement('option');
    option.value = preset.percent;
    option.textContent = `${preset.name} (${preset.percent > 0 ? '+' : ''}${preset.percent}%)`;
    select.appendChild(option);
  });
}

async function saveMarkupPreset(name, percent) {
  const settings = await readSettings();

  const existing = settings.markupPresets.findIndex(p => p.name === name);

  if (existing !== -1) {
    settings.markupPresets[existing].percent = percent;
  } else {
    settings.markupPresets.push({ name, percent });
  }

  await writeSettings(settings);
  await loadMarkupPresets();
}

async function deleteMarkupPreset(name) {
  const settings = await readSettings();

  settings.markupPresets = settings.markupPresets.filter(p => p.name !== name);

  await writeSettings(settings);
  await loadMarkupPresets();
}

function initMarkupPresets() {
  loadMarkupPresets();

  document.getElementById('markup-preset-select').addEventListener('change', (e) => {
    if (e.target.value !== '') {
      document.getElementById('markup-percent').value = e.target.value;
    }
  });

  document.getElementById('btn-save-markup-preset').addEventListener('click', () => {
    const name = prompt('Enter a name for this preset:');
    if (!name || !name.trim()) return;

    const percent = parseFloat(document.getElementById('markup-percent').value) || 0;
    saveMarkupPreset(name.trim(), percent);
  });
}

// app.js — item data loader
let allItems = [];

async function loadItemData() {
  const itemsRef = window.collection(window.db, 'items');
  const snap = await window.getDocs(itemsRef);
  const chunks = snap.docs.map(d => d.data().items || []);
  allItems = chunks.flat();
}

function initApp() {
  initTheme();
  initFilterDefaults();
  initMarkupPresets();
  initCustomPresets();
  loadItemData();
  initNameGenerator();

  document.getElementById('builtin-preset-select').addEventListener('change', (e) => {
    if (e.target.value !== '') {
      applyPreset(e.target.value);
    }
  });

  document.getElementById('btn-apply-markup').addEventListener('click', () => {
    applyMarkupToRenderedItems();
  });

  document.getElementById('btn-new-shop').addEventListener('click', () => {
    resetGeneratorForm();
    showView('generator');
  });
}

window.addEventListener('userSignedIn', () => {
  initApp();
  initFileSystem();
});

// app.js — buildShopData()
// Reads current UI state and returns a shop object matching the saved shop schema.

function buildShopData() {
  const name = document.getElementById('shop-name').value.trim() || 'Unnamed Shop';

  const quantities = {
    mundane:   document.getElementById('qty-mundane').value.trim(),
    common:    document.getElementById('qty-common').value.trim(),
    uncommon:  document.getElementById('qty-uncommon').value.trim(),
    rare:      document.getElementById('qty-rare').value.trim(),
    veryRare:  document.getElementById('qty-very-rare').value.trim(),
    legendary: document.getElementById('qty-legendary').value.trim(),
  };

  const filters = {
    magicTypes: [...document.querySelectorAll('#magic-types input:checked')].map(el => el.value),
    mundaneCategories: [...document.querySelectorAll('#mundane-categories input:checked')].map(el => el.value),
    overallCategories: [...document.querySelectorAll('#overall-categories input:checked')].map(el => el.value),
    minPrice: parseFloat(document.getElementById('min-price').value) || null,
    maxPrice: parseFloat(document.getElementById('max-price').value) || null,
  };

  const items = [...document.querySelectorAll('#items-tbody tr')].map(row => {
    const cells = row.querySelectorAll('td');
    return {
      name:           cells[0]?.textContent,
      rarity:         cells[1]?.textContent,
      type:           cells[2]?.textContent,
      qty:            cells[3]?.textContent,
      basePrice:      cells[4]?.dataset.basePrice,
      adjustedPrice1: cells[4]?.textContent,
    };
  });

  return {
    name,
    settings: {
      quantities,
      includePotionsOfHealing: document.getElementById('include-potions').checked,
      markupPercent: parseFloat(document.getElementById('markup-applied').value) || 0,
      filters,
    },
    items,
  };
}

// app.js — applyLoadedShop()
// Takes a loaded shop object and restores UI state from it.

function applyLoadedShop(data) {
  document.getElementById('shop-name').value = data.name || '';

  const q = data.settings.quantities || {};
  document.getElementById('qty-mundane').value   = q.mundane   || '';
  document.getElementById('qty-common').value    = q.common    || '';
  document.getElementById('qty-uncommon').value  = q.uncommon  || '';
  document.getElementById('qty-rare').value      = q.rare      || '';
  document.getElementById('qty-very-rare').value = q.veryRare  || '';
  document.getElementById('qty-legendary').value = q.legendary || '';

  document.getElementById('include-potions').checked    = data.settings.includePotionsOfHealing || false;
  document.getElementById('markup-percent').value       = data.settings.markupPercent ?? 0;
  document.getElementById('markup-applied').value       = data.settings.markupPercent ?? 0;  

  const f = data.settings.filters || {};

  document.querySelectorAll('#magic-types input').forEach(el => {
    el.checked = (f.magicTypes || []).includes(el.value);
  });
  document.querySelectorAll('#mundane-categories input').forEach(el => {
    el.checked = (f.mundaneCategories || []).includes(el.value);
  });
  document.querySelectorAll('#overall-categories input').forEach(el => {
    el.checked = (f.overallCategories || []).includes(el.value);
  });

  document.getElementById('min-price').value = f.minPrice ?? '';
  document.getElementById('max-price').value = f.maxPrice ?? '';

  // Restore items table
  const tbody = document.getElementById('items-tbody');
  const table = document.getElementById('items-table');
  const empty = document.getElementById('empty-state');

  tbody.innerHTML = '';

  if (data.items && data.items.length > 0) {
    data.items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.name || ''}</td>
        <td>${item.rarity || ''}</td>
        <td>${item.type || ''}</td>
        <td>${item.qty || ''}</td>
        <td data-base-price="${item.basePrice || ''}">${item.adjustedPrice1 || ''}</td>
      `;
      tbody.appendChild(tr);
    });
    table.classList.remove('hidden');
    empty.classList.add('hidden');
  } else {
    table.classList.add('hidden');
    empty.classList.remove('hidden');
  }

  updatePriceHeader();
  setUnsavedChanges(false);
  showView('results');   // ← navigates to results view after restoring
}

// app.js — Generate button

function renderItems(items) {
  const tbody = document.getElementById('items-tbody');
  const table = document.getElementById('items-table');
  const empty = document.getElementById('empty-state');

  tbody.innerHTML = '';

  if (items.length === 0) {
    table.classList.add('hidden');
    empty.classList.remove('hidden');
    return;
  }

  items.forEach(item => {
    const tr = document.createElement('tr');
    const qtyDisplay = (item.quantity != null) ? item.quantity : '';
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.rarity}</td>
      <td>${item.type}</td>
      <td>${qtyDisplay}</td>
      <td data-base-price="${item.priceless ? '' : item.basePrice ?? ''}">${item.priceless ? 'Priceless' : item.adjustedPrice1 != null ? formatPrice(item.adjustedPrice1) + (item.adjustedPrice1 !== item.basePrice ? ` (${formatPrice(item.basePrice)})` : '') : '—'}</td>
    `;
    tbody.appendChild(tr);
  });

  table.classList.remove('hidden');
  empty.classList.add('hidden');
  updatePriceHeader();
}

document.getElementById('btn-generate').addEventListener('click', () => {
  document.getElementById('shop-name').value = '';          // ← new line
  document.getElementById('markup-applied').value = document.getElementById('markup-percent').value || 0;
  const shopData = buildShopData();
  const items = generateShop(allItems, shopData.settings);
  renderItems(items);
  setUnsavedChanges(true);
  showView('results');
});

// app.js — Random name generator UI

function buildNameDropdown(names) {
  const dropdown = document.getElementById('random-name-dropdown');
  dropdown.innerHTML = '';

  names.forEach(name => {
    const item = document.createElement('div');
    item.className = 'name-option';
    const span = document.createElement('span');
    span.textContent = name;
    span.addEventListener('click', () => {
        document.getElementById('shop-name').value = name;
        dropdown.classList.add('hidden');
    });
    item.appendChild(span);
    dropdown.appendChild(item);
  });

  const getMore = document.createElement('div');
  getMore.className = 'name-option name-option-more';
  const getMoreSpan = document.createElement('span');
  getMoreSpan.textContent = 'Get More';
  getMoreSpan.addEventListener('click', (e) => {
    e.stopPropagation();
    buildNameDropdown(generateShopNames());
  });
  getMore.appendChild(getMoreSpan);
  dropdown.appendChild(getMore);

  dropdown.classList.remove('hidden');
}

function initNameGenerator() {
  document.getElementById('btn-random-name').addEventListener('click', (e) => {
    e.stopPropagation();
    buildNameDropdown(generateShopNames());
  });

  document.addEventListener('click', () => {
    document.getElementById('random-name-dropdown').classList.add('hidden');
  });
}

// app.js — custom presets

async function loadCustomPresets() {
  const settings = await readSettings();
  const presets = settings.customPresets || [];
  const select = document.getElementById('custom-preset-select');

  while (select.options.length > 1) {
    select.remove(1);
  }

  presets.forEach(preset => {
    const option = document.createElement('option');
    option.value = preset.name;
    option.textContent = preset.name;
    select.appendChild(option);
  });
}

async function saveCustomPreset(name) {
  const settings = await readSettings();
  if (!settings.customPresets) settings.customPresets = [];

  const markupSelect = document.getElementById('markup-preset-select');
  const selectedMarkupOption = markupSelect.options[markupSelect.selectedIndex];

    const preset = {
    name,
    markupPresetName: markupSelect.value !== '' ? selectedMarkupOption.textContent.split(' (')[0] : null,
    quantities: {
        mundane:   document.getElementById('qty-mundane').value.trim(),
        common:    document.getElementById('qty-common').value.trim(),
        uncommon:  document.getElementById('qty-uncommon').value.trim(),
        rare:      document.getElementById('qty-rare').value.trim(),
        veryRare:  document.getElementById('qty-very-rare').value.trim(),
        legendary: document.getElementById('qty-legendary').value.trim(),
    },
    includePotionsOfHealing: document.getElementById('include-potions').checked,
    filters: {
        magicTypes:        [...document.querySelectorAll('#magic-types input:checked')].map(el => el.value),
        mundaneCategories: [...document.querySelectorAll('#mundane-categories input:checked')].map(el => el.value),
        overallCategories: [...document.querySelectorAll('#overall-categories input:checked')].map(el => el.value),
        minPrice: parseFloat(document.getElementById('min-price').value) || null,
        maxPrice: parseFloat(document.getElementById('max-price').value) || null,
    }
    };

  const existing = settings.customPresets.findIndex(p => p.name === name);
  if (existing !== -1) {
    settings.customPresets[existing] = preset;
  } else {
    settings.customPresets.push(preset);
  }

  await writeSettings(settings);
  await loadCustomPresets();
}

async function deleteCustomPreset(name) {
  const settings = await readSettings();
  settings.customPresets = (settings.customPresets || []).filter(p => p.name !== name);
  await writeSettings(settings);
  await loadCustomPresets();
}

function applyCustomPreset(name) {
  readSettings().then(settings => {
    const preset = (settings.customPresets || []).find(p => p.name === name);
    if (!preset) return;

    const q = preset.quantities;
    document.getElementById('qty-mundane').value   = q.mundane;
    document.getElementById('qty-common').value    = q.common;
    document.getElementById('qty-uncommon').value  = q.uncommon;
    document.getElementById('qty-rare').value      = q.rare;
    document.getElementById('qty-very-rare').value = q.veryRare;
    document.getElementById('qty-legendary').value = q.legendary;

    document.getElementById('include-potions').checked = preset.includePotionsOfHealing || false;

    const f = preset.filters;
    document.querySelectorAll('#magic-types input').forEach(el => {
      el.checked = (f.magicTypes || []).includes(el.value);
    });
    document.querySelectorAll('#mundane-categories input').forEach(el => {
      el.checked = (f.mundaneCategories || []).includes(el.value);
    });
    document.querySelectorAll('#overall-categories input').forEach(el => {
      el.checked = (f.overallCategories || []).includes(el.value);
    });

    document.getElementById('min-price').value = f.minPrice ?? '';
    document.getElementById('max-price').value = f.maxPrice ?? '';

    if (preset.markupPresetName) {
    const markupSelect = document.getElementById('markup-preset-select');
    const matchingOption = [...markupSelect.options].find(o => o.textContent.startsWith(preset.markupPresetName));
        if (matchingOption) {
            markupSelect.value = matchingOption.value;
            document.getElementById('markup-percent').value = matchingOption.value;
        }
    } else {
      document.getElementById('markup-preset-select').value = '';
    }
  });
}

function initCustomPresets() {
  loadCustomPresets();

  document.getElementById('custom-preset-select').addEventListener('change', (e) => {
    if (e.target.value !== '') {
      applyCustomPreset(e.target.value);
    }
  });

  document.getElementById('btn-save-custom-preset').addEventListener('click', () => {
    const name = prompt('Enter a name for this preset:');
    if (!name || !name.trim()) return;
    saveCustomPreset(name.trim());
  });

  document.getElementById('btn-delete-custom-preset').addEventListener('click', () => {
    const select = document.getElementById('custom-preset-select');
    const name = select.value;
    if (!name) return;
    if (confirm(`Delete preset "${name}"?`)) {
      deleteCustomPreset(name);
    }
  });
}

document.getElementById('btn-delete-markup-preset').addEventListener('click', () => {
  const select = document.getElementById('markup-preset-select');
  const name = select.options[select.selectedIndex]?.textContent.split(' (')[0];
  if (!select.value) return;
  if (confirm(`Delete markup preset "${name}"?`)) {
    deleteMarkupPreset(name);
    select.value = '';
  }
});

// app.js — Select All / Select None buttons

document.querySelectorAll('.btn-select-all').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.group;
    document.querySelectorAll(`#${group} input[type="checkbox"]`).forEach(cb => {
      cb.checked = true;
    });
  });
});

document.querySelectorAll('.btn-select-none').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.group;
    document.querySelectorAll(`#${group} input[type="checkbox"]`).forEach(cb => {
      cb.checked = false;
    });
  });
});

// Default: all filter checkboxes checked on load
function initFilterDefaults() {
  ['magic-types', 'mundane-categories', 'overall-categories'].forEach(group => {
    document.querySelectorAll(`#${group} input[type="checkbox"]`).forEach(cb => {
      cb.checked = true;
    });
  });
}

function applyMarkupToRenderedItems() {
  const percent = parseFloat(document.getElementById('markup-applied').value) || 0;
  const multiplier = 1 + percent / 100;

  document.querySelectorAll('#items-tbody tr').forEach(row => {
    const cells = row.querySelectorAll('td');
    const basePrice = parseFloat(cells[4].dataset.basePrice);
    if (isNaN(basePrice)) return;
    const adjusted = Math.round(basePrice * multiplier * 100) / 100;
    cells[4].textContent = formatPrice(adjusted) + (adjusted !== basePrice ? ` (${formatPrice(basePrice)})` : '');
  });

  updatePriceHeader();
  setUnsavedChanges(true);
}

function setUnsavedChanges(state) {
  const warning = document.getElementById('unsaved-warning');
  if (state) {
    warning.classList.remove('hidden');
  } else {
    warning.classList.add('hidden');
  }
}

function updatePriceHeader() {
  const percent = parseFloat(document.getElementById('markup-applied').value) || 0;
  const header = document.getElementById('price-col-header');
  header.textContent = percent !== 0 ? 'Price Markup (Base Price)' : 'Price';
}

function formatPrice(gp) {
  const totalCp = Math.round(gp * 100);

  const gpAmount = Math.floor(totalCp / 100);
  const remainder = totalCp % 100;
  const epAmount = Math.floor(remainder / 50);
  const spAmount = Math.floor((remainder % 50) / 10);
  const cpAmount = remainder % 10;

  const parts = [];
  if (gpAmount) parts.push(`${gpAmount} gp`);
  if (epAmount) parts.push(`${epAmount} ep`);
  if (spAmount) parts.push(`${spAmount} sp`);
  if (cpAmount) parts.push(`${cpAmount} cp`);

  return parts.length ? parts.join(' ') : '0 cp';
}