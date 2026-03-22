// js/admin.js — Admin panel: item import tool

const ADMIN_EMAIL = 'bazutti@gmail.com';

function isAdmin() {
  return window.currentUser?.email === ADMIN_EMAIL;
}

function initAdmin() {
  if (!isAdmin()) return;

  // Show the nav link
  // Show the nav link and wire navigation
  const navLink = document.getElementById('nav-link-admin');
  navLink.classList.remove('hidden');
  navLink.addEventListener('click', () => showView('admin'));

  // Wire file input → preview
  document.getElementById('admin-file-input').addEventListener('change', handleAdminFileSelect);

  // Wire import button
  document.getElementById('btn-admin-import').addEventListener('click', handleAdminImport);

  initHerbUpload();
}

// --- File selection & preview ---

let _adminParsedItems = null;

function handleAdminFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (!Array.isArray(parsed)) throw new Error('JSON must be an array of item objects.');

      _adminParsedItems = parsed;
      renderAdminPreview(parsed);
      document.getElementById('btn-admin-import').disabled = false;
      adminLog('File loaded. Review the preview, then click Import.', 'info');
    } catch (err) {
      _adminParsedItems = null;
      document.getElementById('btn-admin-import').disabled = true;
      document.getElementById('admin-preview').innerHTML = '';
      adminLog(`Parse error: ${err.message}`, 'error');
    }
  };
  reader.readAsText(file);
}

function renderAdminPreview(items) {
  const grouped = groupBySource(items);
  const preview = document.getElementById('admin-preview');

  const rows = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([source, arr]) => `<tr><td>${source}</td><td>${arr.length}</td></tr>`)
    .join('');

  preview.innerHTML = `
    <p><strong>${items.length}</strong> items across <strong>${Object.keys(grouped).length}</strong> source(s):</p>
    <table class="admin-preview-table">
      <thead><tr><th>Source</th><th>Items</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// --- Import logic ---

async function handleAdminImport() {
  if (!_adminParsedItems) return;

  const btn = document.getElementById('btn-admin-import');
  btn.disabled = true;
  document.getElementById('admin-log').innerHTML = '';
  adminLog('Starting import…', 'info');

  const grouped = groupBySource(_adminParsedItems);

  for (const [source, newItems] of Object.entries(grouped)) {
    try {
      await importSourceBook(source, newItems);
    } catch (err) {
      adminLog(`ERROR [${source}]: ${err.message}`, 'error');
    }
  }

  adminLog('Import complete.', 'success');
  btn.disabled = false;

  // Reload allItems so the generator picks up new items immediately
  await loadItemData();
}

async function importSourceBook(source, newItems) {
  const docId = source.replace(/[^a-z0-9]/gi, '_');
  const docRef = window.doc(window.db, 'items', docId);
  const snap = await window.getDoc(docRef);

  if (!snap.exists()) {
    // Brand new sourcebook — write it directly
    await window.setDoc(docRef, { source, items: newItems });
    adminLog(`[${source}] Created new document with ${newItems.length} items.`, 'success');
    return;
  }

  // Merge: append items whose name doesn't already exist
  const existing = snap.data().items || [];
  const existingNames = new Set(existing.map(i => i.name));
  const toAdd = newItems.filter(i => !existingNames.has(i.name));
  const skipped = newItems.length - toAdd.length;

  if (toAdd.length === 0) {
    adminLog(`[${source}] No new items found (${skipped} already exist). Skipped.`, 'info');
    return;
  }

  await window.setDoc(docRef, { source, items: [...existing, ...toAdd] });
  adminLog(`[${source}] Added ${toAdd.length} items. Skipped ${skipped} duplicates.`, 'success');
}

// --- Helpers ---

function groupBySource(items) {
  return items.reduce((acc, item) => {
    const src = item.source || 'Unknown';
    if (!acc[src]) acc[src] = [];
    acc[src].push(item);
    return acc;
  }, {});
}

function adminLog(msg, type = 'info') {
  const log = document.getElementById('admin-log');
  const line = document.createElement('p');
  line.className = `admin-log-${type}`;
  line.textContent = msg;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
}

// --- Herb Upload ---

function initHerbUpload() {
  document.getElementById('herb-region-select').addEventListener('change', updateHerbUploadBtn);
  document.getElementById('admin-herb-file-input').addEventListener('change', updateHerbUploadBtn);
  document.getElementById('btn-admin-herb-upload').addEventListener('click', handleHerbUpload);
}

function updateHerbUploadBtn() {
  const region = document.getElementById('herb-region-select').value;
  const file = document.getElementById('admin-herb-file-input').files[0];
  document.getElementById('btn-admin-herb-upload').disabled = !(region && file);
}

async function handleHerbUpload() {
  const region = document.getElementById('herb-region-select').value;
  const file = document.getElementById('admin-herb-file-input').files[0];
  if (!region || !file) return;

  const btn = document.getElementById('btn-admin-herb-upload');
  btn.disabled = true;
  adminLog(`Uploading herbs for region: ${region}…`, 'info');

  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      const data = JSON.parse(evt.target.result);
      if (!data.common || !data.rare) throw new Error('JSON must have "common" and "rare" arrays.');

      const docRef = window.doc(window.db, 'herbs', region);
      await window.setDoc(docRef, data);
      adminLog(`✓ herbs/${region} uploaded (${data.common.length} common, ${data.rare.length} rare).`, 'success');
    } catch (err) {
      adminLog(`ERROR: ${err.message}`, 'error');
    }
    btn.disabled = false;
  };
  reader.readAsText(file);
}