// themes.js

const THEMES = [
  { id: 'generic',          label: 'Generic D&D',      group: 'Worlds' },
  { id: 'ravenloft',        label: 'Ravenloft',         group: 'Worlds' },
  { id: 'forgotten-realms', label: 'Forgotten Realms',  group: 'Worlds' },
  { id: 'greyhawk',         label: 'Greyhawk',          group: 'Worlds' },
  { id: 'deadwell',         label: 'Deadwell',          group: 'Worlds' },
  { id: 'artificer',        label: 'Artificer',         group: 'Classes' },
  { id: 'barbarian',        label: 'Barbarian',         group: 'Classes' },
  { id: 'bard',             label: 'Bard',              group: 'Classes' },
  { id: 'cleric',           label: 'Cleric',            group: 'Classes' },
  { id: 'druid',            label: 'Druid',             group: 'Classes' },
  { id: 'fighter',          label: 'Fighter',           group: 'Classes' },
  { id: 'monk',             label: 'Monk',              group: 'Classes' },
  { id: 'paladin',          label: 'Paladin',           group: 'Classes' },
  { id: 'ranger',           label: 'Ranger',            group: 'Classes' },
  { id: 'rogue',            label: 'Rogue',             group: 'Classes' },
  { id: 'sorcerer',         label: 'Sorcerer',          group: 'Classes' },
  { id: 'warlock',          label: 'Warlock',           group: 'Classes' },
  { id: 'wizard',           label: 'Wizard',            group: 'Classes' },
];

const THEME_BODY_PREFIX  = 'theme-';
const DEFAULT_THEME      = 'generic';
const THEME_STORAGE_KEY  = 'd20-theme';

function applyTheme(themeId) {
  const valid = THEMES.find(t => t.id === themeId);
  const id    = valid ? themeId : DEFAULT_THEME;

  THEMES.forEach(t => document.body.classList.remove(THEME_BODY_PREFIX + t.id));
  document.body.classList.add(THEME_BODY_PREFIX + id);

  try { localStorage.setItem('d20-theme', id); } catch {}

  const select = document.getElementById('theme-select');
  if (select) select.value = id;
}

async function loadThemePreference() {
  try {
    const settings = await readSettings();
    applyTheme(settings.theme || DEFAULT_THEME);
  } catch {
    applyTheme(DEFAULT_THEME);
  }
}

async function saveThemePreference(themeId) {
  try {
    const settings = await readSettings();
    settings.theme  = themeId;
    await writeSettings(settings);
  } catch (err) {
    console.error('Could not save theme preference:', err);
  }
}

function initTheme() {
  const select = document.getElementById('theme-select');
  if (!select) return;

  // Apply cached theme immediately to prevent flash on load
  try {
    const cached = localStorage.getItem(THEME_STORAGE_KEY);
    if (cached) applyTheme(cached);
  } catch {}

  const groups = {};
  THEMES.forEach(t => {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push(t);
  });

  Object.entries(groups).forEach(([groupLabel, themes]) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = groupLabel;
    themes.forEach(t => {
      const option       = document.createElement('option');
      option.value       = t.id;
      option.textContent = t.label;
      optgroup.appendChild(option);
    });
    select.appendChild(optgroup);
  });

  loadThemePreference();

  select.addEventListener('change', (e) => {
    applyTheme(e.target.value);
    saveThemePreference(e.target.value);
  });
}