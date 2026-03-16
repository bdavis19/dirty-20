// fileSystem.js — Firebase Firestore backend

async function readSettings() {
  const uid = window.currentUser?.uid;
  if (!uid) return { markupPresets: [], customPresets: [] };

  const docRef = doc(window.db, 'users', uid, 'settings', 'main');
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : { markupPresets: [], customPresets: [] };
}

async function writeSettings(settings) {
  const uid = window.currentUser?.uid;
  if (!uid) throw new Error('Not signed in.');

  const docRef = doc(window.db, 'users', uid, 'settings', 'main');
  await setDoc(docRef, settings);
}

async function saveShop(shopData) {
  const uid = window.currentUser?.uid;
  if (!uid) throw new Error('Not signed in.');

  shopData.lastModified = new Date().toISOString();
  if (!shopData.created) shopData.created = shopData.lastModified;

  const shopsRef = collection(window.db, 'users', uid, 'shops');
  const docRef = doc(shopsRef, shopData.name.replace(/[^a-z0-9\-_ ]/gi, '_'));
  await setDoc(docRef, shopData);
  return docRef.id;
}

async function loadShop(docId) {
  const uid = window.currentUser?.uid;
  if (!uid) throw new Error('Not signed in.');

  const docRef = doc(window.db, 'users', uid, 'shops', docId);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}

async function listShops() {
  const uid = window.currentUser?.uid;
  if (!uid) throw new Error('Not signed in.');

  const shopsRef = collection(window.db, 'users', uid, 'shops');
  const snap = await getDocs(shopsRef);
  const shops = snap.docs.map(d => ({ docId: d.id, ...d.data() }));
  return shops.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
}

async function deleteShop(docId) {
  const uid = window.currentUser?.uid;
  if (!uid) throw new Error('Not signed in.');

  const docRef = doc(window.db, 'users', uid, 'shops', docId);
  await deleteDoc(docRef);
}

async function renameShop(docId, newName) {
  const uid = window.currentUser?.uid;
  if (!uid) throw new Error('Not signed in.');

  const oldRef = doc(window.db, 'users', uid, 'shops', docId);
  const snap = await getDoc(oldRef);
  if (!snap.exists()) throw new Error('Shop not found.');

  const data = snap.data();
  data.name = newName;
  await deleteDoc(oldRef);
  return saveShop(data);
}

function initFileSystem() {
  document.getElementById('btn-save-shop').addEventListener('click', async () => {
    const name = document.getElementById('shop-name').value.trim();
    if (!name) {
      alert('Please enter a shop name before saving.');
      return;
    }
    await saveShop(buildShopData());
    alert(`"${name}" saved.`);
    setUnsavedChanges(false);
  });

  document.getElementById('btn-load-shop').addEventListener('click', () => {
    openShopBrowser();
  });

  document.getElementById('shop-browser-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('shop-browser-modal')) {
      document.getElementById('shop-browser-modal').classList.add('hidden');
    }
  });

  document.getElementById('btn-load-shop-generator').addEventListener('click', () => {
    openShopBrowser();
  });
}

async function openShopBrowser() {
  const modal = document.getElementById('shop-browser-modal');
  const listEl = document.getElementById('shop-list');

  modal.classList.remove('hidden');
  listEl.innerHTML = '<p style="color: var(--color-text-muted)">Loading...</p>';

  let shops;
  try {
    shops = await listShops();
  } catch {
    listEl.innerHTML = '<p>Could not load shops. Make sure you are signed in.</p>';
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
      const data = await loadShop(shop.docId);
      applyLoadedShop(data);
      modal.classList.add('hidden');
    });

    const btnRename = document.createElement('button');
    btnRename.textContent = 'Rename';
    btnRename.addEventListener('click', async () => {
      const newName = prompt('New shop name:', shop.name);
      if (!newName || !newName.trim()) return;
      await renameShop(shop.docId, newName.trim());
      openShopBrowser();
    });

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Delete';
    btnDelete.addEventListener('click', async () => {
      if (!confirm(`Delete "${shop.name}"? This cannot be undone.`)) return;
      await deleteShop(shop.docId);
      openShopBrowser();
    });

    row.append(nameEl, dateEl, btnOpen, btnRename, btnDelete);
    listEl.appendChild(row);
  });
}