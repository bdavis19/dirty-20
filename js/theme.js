// themes.js

const THEMES = [
  { id: 'generic',          label: 'Generic D&D' },
  { id: 'ravenloft',        label: 'Ravenloft' },
  { id: 'forgotten-realms', label: 'Forgotten Realms' },
  { id: 'greyhawk',         label: 'Greyhawk' },
  { id: 'deadwell',         label: 'Deadwell' },
];

const THEME_BODY_PREFIX = 'theme-';
const DEFAULT_THEME     = 'generic';

function applyTheme(themeId) {
  const valid = THEMES.find(t => t.id === themeId);
  const id    = valid ? themeId : DEFAULT_THEME;

  // Remove any existing theme classes
  THEMES.forEach(t => document.body.classList.remove(THEME_BODY_PREFIX + t.id));

  // Apply the new one
  document.body.classList.add(THEME_BODY_PREFIX + id);

  // Keep the dropdown in sync
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
  // Build dropdown options
  const select = document.getElementById('theme-select');
  if (!select) return;

  THEMES.forEach(t => {
    const option    = document.createElement('option');
    option.value    = t.id;
    option.textContent = t.label;
    select.appendChild(option);
  });

  // Apply saved preference
  loadThemePreference();

  // Save on change
  select.addEventListener('change', (e) => {
    applyTheme(e.target.value);
    saveThemePreference(e.target.value);
  });
}