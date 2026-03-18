// js/shopDetails.js
// Generation logic, render, readback, and init for the Shop Details section.

// ---------------------------------------------------------------------------
// Private helper
// ---------------------------------------------------------------------------

function _pickShopDetail(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// Generate
// ---------------------------------------------------------------------------

/**
 * Generates a full shop details object with one random value per field.
 * @returns {{ location, appearance, quirk, security, collapsed: false }}
 */
function generateShopDetails() {
  return {
    location:   _pickShopDetail(SHOP_LOCATIONS),
    appearance: _pickShopDetail(SHOP_APPEARANCES),
    quirk:      _pickShopDetail(SHOP_QUIRKS),
    security:   _pickShopDetail(SHOP_SECURITY),
    collapsed:  false,
  };
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

/**
 * Populates all four shop detail UI fields from a shopDetails object.
 * Restores collapsed state and toggle button label.
 * @param {object} data — shopDetails object
 */
function renderShopDetails(data) {
  document.getElementById('shop-detail-location').value   = data.location   || '';
  document.getElementById('shop-detail-appearance').value = data.appearance || '';
  document.getElementById('shop-detail-quirk').value      = data.quirk      || '';
  document.getElementById('shop-detail-security').value   = data.security   || '';

  const body = document.getElementById('shop-details-body');
  const btn  = document.getElementById('btn-toggle-shop-details');
  const shouldCollapse = data.collapsed === true;
  body.classList.toggle('hidden', shouldCollapse);
  btn.textContent = shouldCollapse ? '▼ Expand' : '▲ Collapse';
}

// ---------------------------------------------------------------------------
// Read UI → object
// ---------------------------------------------------------------------------

/**
 * Reads current shop detail UI state back into a shopDetails object.
 * @returns {object} shopDetails
 */
function readShopDetailsFromUI() {
  return {
    location:   document.getElementById('shop-detail-location').value.trim(),
    appearance: document.getElementById('shop-detail-appearance').value.trim(),
    quirk:      document.getElementById('shop-detail-quirk').value.trim(),
    security:   document.getElementById('shop-detail-security').value.trim(),
    collapsed:  document.getElementById('shop-details-body').classList.contains('hidden'),
  };
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

/**
 * Wires the collapse toggle and all four reroll buttons.
 */
function initShopDetails() {
  // Collapse toggle
  document.getElementById('btn-toggle-shop-details').addEventListener('click', () => {
    const body = document.getElementById('shop-details-body');
    const btn  = document.getElementById('btn-toggle-shop-details');
    const hidden = body.classList.toggle('hidden');
    btn.textContent = hidden ? '▼ Expand' : '▲ Collapse';
  });

  // Reroll buttons (delegated on section)
  document.getElementById('shop-details-section').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-reroll');
    if (!btn) return;

    switch (btn.dataset.field) {
      case 'location':
        document.getElementById('shop-detail-location').value = _pickShopDetail(SHOP_LOCATIONS);
        break;
      case 'appearance':
        document.getElementById('shop-detail-appearance').value = _pickShopDetail(SHOP_APPEARANCES);
        break;
      case 'quirk':
        document.getElementById('shop-detail-quirk').value = _pickShopDetail(SHOP_QUIRKS);
        break;
      case 'security':
        document.getElementById('shop-detail-security').value = _pickShopDetail(SHOP_SECURITY);
        break;
    }
  });
}