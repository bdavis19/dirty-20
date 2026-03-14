// fileSystem.js — Chunk 1: Folder selection & IndexedDB handle persistence

let _dataFolderHandle = null;

const DB_NAME = 'shopGeneratorDB';
const DB_STORE = 'handles';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function storeHandle(handle) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(handle, 'dataFolder');
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function loadHandle() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).get('dataFolder');
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function getDataFolder() {
  if (_dataFolderHandle) return _dataFolderHandle;

  const stored = await loadHandle();
  if (stored) {
    const permission = await stored.requestPermission({ mode: 'readwrite' });
    if (permission === 'granted') {
      _dataFolderHandle = stored;
      return _dataFolderHandle;
    }
  }

  return null; // No folder yet — UI should call pickDataFolder()
}

async function pickDataFolder() {
  const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
  await storeHandle(handle);
  _dataFolderHandle = handle;
  return handle;
}

// fileSystem.js — Chunk 2: readSettings / writeSettings

async function readSettings() {
  const folder = await getDataFolder();
  if (!folder) {
    return { dataFolderPath: null, defaultFilters: {}, markupPresets: [], customPresets: [] };
  }

  try {
    const fileHandle = await folder.getFileHandle('settings.json');
    const file = await fileHandle.getFile();
    const text = await file.text();
    return JSON.parse(text);
  } catch {
    // File doesn't exist yet — return defaults
    return { dataFolderPath: null, defaultFilters: {}, markupPresets: [], customPresets: [] };
  }
}

async function writeSettings(settings) {
  const folder = await getDataFolder();
  if (!folder) throw new Error('No data folder selected.');

  const fileHandle = await folder.getFileHandle('settings.json', { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(settings, null, 2));
  await writable.close();
}

// fileSystem.js — Chunk 3: saveShop / loadShop

async function getShopsFolder() {
  const folder = await getDataFolder();
  if (!folder) throw new Error('No data folder selected.');
  return folder.getDirectoryHandle('shops', { create: true });
}

async function saveShop(shopData) {
  const shopsFolder = await getShopsFolder();
  const fileName = `${shopData.name.replace(/[^a-z0-9\-_ ]/gi, '_')}.json`;

  shopData.lastModified = new Date().toISOString();
  if (!shopData.created) shopData.created = shopData.lastModified;

  const fileHandle = await shopsFolder.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(shopData, null, 2));
  await writable.close();

  return fileName;
}

async function loadShop(fileName) {
  const shopsFolder = await getShopsFolder();
  const fileHandle = await shopsFolder.getFileHandle(fileName);
  const file = await fileHandle.getFile();
  const text = await file.text();
  return JSON.parse(text);
}

async function listShops() {
  const shopsFolder = await getShopsFolder();
  const shops = [];

  for await (const [name, handle] of shopsFolder.entries()) {
    if (name.endsWith('.json')) {
      const file = await handle.getFile();
      const text = await file.text();
      const data = JSON.parse(text);
      shops.push({ fileName: name, name: data.name, lastModified: data.lastModified });
    }
  }

  return shops.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
}

async function deleteShop(fileName) {
  const shopsFolder = await getShopsFolder();
  await shopsFolder.removeEntry(fileName);
}

async function renameShop(oldFileName, newName) {
  const shopsFolder = await getShopsFolder();
  const oldHandle = await shopsFolder.getFileHandle(oldFileName);
  const file = await oldHandle.getFile();
  const text = await file.text();
  const data = JSON.parse(text);

  data.name = newName;
  await deleteShop(oldFileName);
  return saveShop(data);
}

// fileSystem.js — Chunk 4: Shop browser UI wiring

async function openShopBrowser() {
  const modal = document.getElementById('shop-browser-modal');
  const listEl = document.getElementById('shop-list');

  modal.classList.remove('hidden');
  listEl.innerHTML = '<p style="color: var(--color-text-muted)">Loading...</p>';

  let shops;
  try {
    shops = await listShops();
  } catch {
    listEl.innerHTML = '<p>Could not load shops. Make sure a data folder is selected.</p>';
    return;
  }

  listEl.innerHTML = '';

  if (shops.length === 0) {
    listEl.innerHTML = '<p id="shop-list-empty">No saved shops found.</p>';
    return;
  }

  shops.forEach(shop => {
    const row = document.createElement('div');
    row.className = 'shop-row';

    const nameEl = document.createElement('span');
    nameEl.className = 'shop-row-name';
    nameEl.textContent = shop.name;

    const dateEl = document.createElement('span');
    dateEl.className = 'shop-row-date';
    dateEl.textContent = new Date(shop.lastModified).toLocaleDateString();

    const btnOpen = document.createElement('button');
    btnOpen.textContent = 'Open';
    btnOpen.addEventListener('click', async () => {
      const data = await loadShop(shop.fileName);
      applyLoadedShop(data);
      modal.classList.add('hidden');
    });

    const btnRename = document.createElement('button');
    btnRename.textContent = 'Rename';
    btnRename.addEventListener('click', async () => {
      const newName = prompt('New shop name:', shop.name);
      if (!newName || !newName.trim()) return;
      await renameShop(shop.fileName, newName.trim());
      openShopBrowser();
    });

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.addEventListener('click', async () => {
      if (!confirm(`Delete "${shop.name}"? This cannot be undone.`)) return;
      await deleteShop(shop.fileName);
      openShopBrowser();
    });

    row.append(nameEl, dateEl, btnOpen, btnRename, btnDelete);
    listEl.appendChild(row);
  });
}

function initFileSystem() {
  document.getElementById('btn-save-shop').addEventListener('click', async () => {
    const name = document.getElementById('shop-name').value.trim();
    if (!name) {
      alert('Please enter a shop name before saving.');
      return;
    }

    let folder = await getDataFolder();
    if (!folder) folder = await pickDataFolder();

    await saveShop(buildShopData());
    alert(`"${name}" saved.`);
    setUnsavedChanges(false);
  });

  document.getElementById('btn-load-shop').addEventListener('click', async () => {
    let folder = await getDataFolder();
    if (!folder) folder = await pickDataFolder();
    openShopBrowser();
  });

  document.getElementById('btn-close-shop-browser').addEventListener('click', () => {
    document.getElementById('shop-browser-modal').classList.add('hidden');
  });
}

document.addEventListener('DOMContentLoaded', initFileSystem);