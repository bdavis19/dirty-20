// print.js

function openPrintView(shopData) {
  const win = window.open('', '_blank');
  if (!win) {
    alert('Pop-up blocked. Please allow pop-ups for this page to use Print.');
    return;
  }

  const markup = shopData.settings.markupPercent || 0;
  const markupLine = markup !== 0
    ? `<p class="markup-note">Markup: ${markup > 0 ? '+' : ''}${markup}%</p>`
    : '';

  const rows = shopData.items.map(item => `
    <tr>
      <td>${item.name || ''}</td>
      <td>${item.rarity || ''}</td>
      <td>${item.type || ''}</td>
      <td>${item.adjustedPrice1 || ''}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${shopData.name}</title>
  <style>
    body { font-family: serif; padding: 2rem; color: #000; }
    h1 { text-align: center; margin-bottom: 0.25rem; }
    .markup-note { text-align: center; font-style: italic; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { border: 1px solid #999; padding: 0.4rem 0.6rem; text-align: left; }
    th { background: #eee; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>${shopData.name}</h1>
  ${markupLine}
  <table>
    <thead>
      <tr>
        <th>Name</th><th>Rarity</th><th>Type</th><th>Price</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

  win.document.write(html);
  win.document.close();
  win.print();
}

// print.js (continued)

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-print').addEventListener('click', () => {
    const tbody = document.getElementById('items-tbody');
    if (!tbody || tbody.rows.length === 0) {
      alert('No items to print. Generate a shop first.');
      return;
    }
    const shopData = buildShopData();
    openPrintView(shopData);
  });
});