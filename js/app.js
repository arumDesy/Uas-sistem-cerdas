// Dataset produk lengkap dengan 28+ item makeup profesional
const PRODUCTS = [
  // Foundation & Base
  { id: 1, name: "Cushion Glow Foundation", price: 180000, styles: ["Natural", "Bridal"], aesthetic: 78, popularity: 85 },
  { id: 2, name: "HD Liquid Foundation", price: 225000, styles: ["Glam", "Bridal"], aesthetic: 88, popularity: 90 },
  { id: 3, name: "Dewy Skin Tint", price: 165000, styles: ["Natural"], aesthetic: 72, popularity: 68 },
  { id: 4, name: "Matte Forever Foundation", price: 195000, styles: ["Glam"], aesthetic: 85, popularity: 82 },

  // Concealer & Corrector
  { id: 5, name: "Full Coverage Concealer", price: 135000, styles: ["Glam", "Bridal", "Natural"], aesthetic: 80, popularity: 87 },
  { id: 6, name: "Brightening Under-Eye Pen", price: 110000, styles: ["Natural", "Bridal"], aesthetic: 75, popularity: 70 },
  { id: 7, name: "Color Corrector Palette", price: 145000, styles: ["Glam", "Bridal"], aesthetic: 82, popularity: 65 },

  // Lips
  { id: 8, name: "Velvet Matte Lipstick", price: 95000, styles: ["Glam", "Bridal"], aesthetic: 82, popularity: 88 },
  { id: 9, name: "Bridal Lip Tint Set", price: 140000, styles: ["Bridal"], aesthetic: 88, popularity: 78 },
  { id: 10, name: "Satin Nude Lipstick", price: 105000, styles: ["Natural"], aesthetic: 76, popularity: 80 },
  { id: 11, name: "Plumping Lip Gloss", price: 88000, styles: ["Natural", "Glam"], aesthetic: 70, popularity: 75 },
  { id: 12, name: "Long-Wear Lip Stain", price: 125000, styles: ["Glam", "Bridal"], aesthetic: 84, popularity: 79 },

  // Blush & Contour
  { id: 13, name: "Soft Blush Cream", price: 75000, styles: ["Natural", "Bridal"], aesthetic: 70, popularity: 65 },
  { id: 14, name: "Powder Blush Duo", price: 98000, styles: ["Natural", "Glam"], aesthetic: 74, popularity: 72 },
  { id: 15, name: "Contour & Highlight Kit", price: 185000, styles: ["Glam", "Bridal"], aesthetic: 89, popularity: 84 },
  { id: 16, name: "Bronzer Palette", price: 155000, styles: ["Natural", "Glam"], aesthetic: 77, popularity: 73 },

  // Eyes
  { id: 17, name: "Intense Eye Palette", price: 210000, styles: ["Glam", "Bridal"], aesthetic: 90, popularity: 92 },
  { id: 18, name: "Everyday Mascara", price: 85000, styles: ["Natural", "Glam"], aesthetic: 68, popularity: 80 },
  { id: 19, name: "Smokey Liner", price: 70000, styles: ["Glam"], aesthetic: 72, popularity: 69 },
  { id: 20, name: "Waterproof Eyeliner Set", price: 115000, styles: ["Glam", "Bridal"], aesthetic: 79, popularity: 77 },
  { id: 21, name: "Natural Nude Eyeshadow", price: 175000, styles: ["Natural", "Bridal"], aesthetic: 81, popularity: 75 },
  { id: 22, name: "Glitter Eye Topper", price: 92000, styles: ["Glam", "Bridal"], aesthetic: 86, popularity: 68 },

  // Brows & Highlighter
  { id: 23, name: "Brow Define Pencil", price: 65000, styles: ["Natural", "Glam"], aesthetic: 60, popularity: 60 },
  { id: 24, name: "Brow Pomade & Brush", price: 128000, styles: ["Glam", "Bridal"], aesthetic: 77, popularity: 71 },
  { id: 25, name: "Highlighter Dew", price: 120000, styles: ["Glam", "Bridal", "Natural"], aesthetic: 85, popularity: 75 },
  { id: 26, name: "Strobing Powder Duo", price: 142000, styles: ["Glam", "Bridal"], aesthetic: 87, popularity: 76 },

  // Setting & Primers
  { id: 27, name: "Setting Spray Longwear", price: 90000, styles: ["Glam", "Bridal", "Natural"], aesthetic: 60, popularity: 70 },
  { id: 28, name: "Pore-Blur Primer", price: 158000, styles: ["Glam", "Natural"], aesthetic: 73, popularity: 74 }
];

// Helpers
const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

function parseBudget(text) {
  // remove non-digit characters and parse to integer
  const digits = (text || '').replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : NaN;
}

// Recommendation strategies
function recommend(style, budget, priority = 'cheapest', aestheticWeight = 60) {
  const pool = PRODUCTS.filter(p => p.styles.includes(style));
  if (pool.length === 0) return { chosen: [], total: 0 };

  const prices = pool.map(p => p.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  let sorted = [];
  const w = Math.min(Math.max(aestheticWeight, 0), 100) / 100; // 0..1

  if (priority === 'cheapest') {
    sorted = pool.slice().sort((a, b) => a.price - b.price);
  } else if (priority === 'aesthetic') {
    // prefer higher aesthetic, tie-breaker lower price
    sorted = pool.slice().sort((a, b) => (b.aesthetic - a.aesthetic) || (a.price - b.price));
  } else { // balanced
    // normalize price to 0..100 where higher means better (cheaper)
    const denom = (maxPrice - minPrice) || 1;
    sorted = pool.slice().map(p => {
      const priceScore = ((maxPrice - p.price) / denom) * 100; // 0..100
      const combined = w * p.aesthetic + (1 - w) * priceScore;
      return { ...p, _score: combined };
    }).sort((a, b) => b._score - a._score || (a.price - b.price));
  }

  const chosen = [];
  let total = 0;
  for (const p of sorted) {
    if (total + p.price <= budget) {
      chosen.push(p);
      total += p.price;
    }
  }
  return { chosen, total };
}

// Optimization: 0/1 Knapsack to maximize total aesthetic under budget (scaled to reduce DP size)
function optimizeAesthetic(style, budget) {
  const pool = PRODUCTS.filter(p => p.styles.includes(style));
  if (pool.length === 0) return { chosen: [], total: 0 };

  const SCALE = 1000; // reduce capacity by factor to keep DP array small
  const cap = Math.max(0, Math.floor(budget / SCALE));
  const n = pool.length;
  const dp = new Array(cap + 1).fill(0);
  const last = new Array(cap + 1).fill(-1);
  const prev = new Array(cap + 1).fill(-1);

  for (let i = 0; i < n; i++) {
    const w = Math.max(1, Math.ceil(pool[i].price / SCALE));
    const v = pool[i].aesthetic;
    for (let j = cap; j >= w; j--) {
      if (dp[j - w] + v > dp[j]) {
        dp[j] = dp[j - w] + v;
        last[j] = i;
        prev[j] = j - w;
      }
    }
  }

  // find best capacity index
  let best = 0;
  for (let j = 1; j <= cap; j++) if (dp[j] > dp[best]) best = j;

  // reconstruct chosen items
  const chosenIdx = [];
  let cur = best;
  const used = new Set();
  while (cur > 0 && last[cur] !== -1) {
    const idx = last[cur];
    if (used.has(idx)) break;
    chosenIdx.push(idx);
    used.add(idx);
    cur = prev[cur];
    if (typeof cur === 'undefined' || cur === -1) break;
  }

  const chosen = chosenIdx.reverse().map(i => pool[i]);
  let total = chosen.reduce((s, p) => s + p.price, 0);

  // If rounding caused slight overflow, remove last items until within budget
  while (total > budget && chosen.length > 0) {
    chosen.pop();
    total = chosen.reduce((s, p) => s + p.price, 0);
  }

  return { chosen, total };
}

// UI bindings
const budgetInput = document.getElementById('budget');
const styleSelect = document.getElementById('style');
const prioritySelect = document.getElementById('priority');
const aestheticSlider = document.getElementById('aestheticWeight');
const searchBtn = document.getElementById('searchBtn');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');
const output = document.getElementById('output');

function renderResult(result, budget, priority, weight) {
  output.innerHTML = '';
  const { chosen, total } = result;
  const summaryTotalEl = document.getElementById('summary-total');
  const summaryRemainingEl = document.getElementById('summary-remaining');

  if (chosen.length === 0) {
    const div = document.createElement('div');
    div.className = 'empty text-center p-3';
    div.textContent = `Tidak ada kombinasi produk untuk style "${styleSelect.value}" dalam budget ${fmt(budget)}.`;
    output.appendChild(div);
    if (summaryTotalEl) summaryTotalEl.textContent = '-';
    if (summaryRemainingEl) summaryRemainingEl.textContent = '-';
    downloadBtn.disabled = true;
    return;
  }

  const header = document.createElement('div');
  header.className = 'd-flex align-items-center mb-2';
  header.innerHTML = `<div class="me-auto small text-muted">Strategy: ${priority === 'cheapest' ? 'Termurah' : priority === 'aesthetic' ? 'Estetika' : (priority === 'optimized' ? 'Optimasi Estetika' : 'Seimbang')}</div>`;
  output.appendChild(header);

  const ul = document.createElement('ul');
  ul.className = 'product-list list-unstyled';
  chosen.forEach(p => {
    const li = document.createElement('li');
    li.className = 'item mb-2 d-flex';

    // image element: try SVG, then JPG, then external placeholder
    const img = document.createElement('img');
    img.width = 80; img.height = 80; img.alt = p.name; img.className = '';
    const svgPath = `../assets/${p.id}.svg`;
    const jpgPath = `../assets/${p.id}.jpg`;
    img.src = svgPath;
    img.onerror = function () {
      try {
        if (this.src && this.src.endsWith('.svg')) {
          this.src = jpgPath;
          return;
        }
        if (this.src && this.src.endsWith('.jpg')) {
          this.src = 'https://via.placeholder.com/80x80.png?text=No+Image';
          return;
        }
        // fallback
        this.src = 'https://via.placeholder.com/80x80.png?text=No+Image';
      } catch (e) {
        this.src = 'https://via.placeholder.com/80x80.png?text=No+Image';
      }
    };

    const info = document.createElement('div');
    info.className = 'info';
    info.style.marginRight = '12px';

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = p.name;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `${p.styles.join(', ')} • Aesthetic: ${p.aesthetic}`;

    info.appendChild(title);
    info.appendChild(meta);

    const priceDiv = document.createElement('div');
    priceDiv.className = 'text-end price';
    priceDiv.style.minWidth = '90px';
    priceDiv.textContent = fmt(p.price);

    li.appendChild(img);
    li.appendChild(info);
    li.appendChild(priceDiv);

    ul.appendChild(li);
  });
  output.appendChild(ul);

  const remaining = budget - total;
  if (summaryTotalEl) summaryTotalEl.textContent = fmt(total);
  if (summaryRemainingEl) summaryRemainingEl.textContent = fmt(remaining);

  downloadBtn.disabled = false;
  downloadBtn._last = { chosen, total, budget, remaining, priority, weight };
}

searchBtn.addEventListener('click', () => {
  const raw = budgetInput.value.trim();
  const budget = parseBudget(raw);
  if (!Number.isFinite(budget) || budget <= 0) {
    alert('Masukkan budget yang valid (angka dalam Rupiah).');
    budgetInput.focus();
    return;
  }
  const style = styleSelect.value;
  const priority = prioritySelect.value;
  const weight = parseInt(aestheticSlider.value, 10);
  const result = recommend(style, budget, priority, weight);
  renderResult(result, budget, priority, weight);
});

resetBtn.addEventListener('click', () => {
  budgetInput.value = '';
  styleSelect.value = 'Natural';
  prioritySelect.value = 'cheapest';
  aestheticSlider.value = 60;
  output.innerHTML = '<div class="empty">Masukkan budget dan pilih style lalu klik "Cari Rekomendasi".</div>';
  downloadBtn.disabled = true;
  downloadBtn._last = null;
});

// Download as CSV or JSON
function toCSV(obj) {
  const rows = [];
  rows.push(['id', 'name', 'price', 'styles', 'aesthetic', 'popularity']);
  obj.chosen.forEach(p => rows.push([p.id, p.name, p.price, '"' + p.styles.join(';') + '"', p.aesthetic, p.popularity]));
  rows.push([]);
  rows.push(['total', obj.total]);
  rows.push(['budget', obj.budget]);
  rows.push(['remaining', obj.remaining]);
  return rows.map(r => r.join(',')).join('\n');
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a);
  a.click(); a.remove(); URL.revokeObjectURL(url);
}

// Modal and toast helpers
const downloadModalEl = document.getElementById('downloadModal');
let downloadModal = null;
if (downloadModalEl && typeof bootstrap !== 'undefined') {
  downloadModal = new bootstrap.Modal(downloadModalEl);
}

function showToast(message) {
  const c = document.getElementById('toastContainer');
  if (!c) return;
  const id = 't' + Date.now();
  const el = document.createElement('div');
  el.className = 'toast align-items-center text-white bg-dark border-0';
  el.role = 'status'; el.ariaLive = 'polite'; el.ariaAtomic = 'true';
  el.id = id;
  el.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
  c.appendChild(el);
  const t = new bootstrap.Toast(el, { delay: 2200 });
  t.show();
}

// Download modal buttons
const btnDownloadCSV = document.getElementById('btnDownloadCSV');
const btnDownloadJSON = document.getElementById('btnDownloadJSON');
const btnDownloadPDF = document.getElementById('btnDownloadPDF');

// Generate PDF function
function toPDF(obj) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Colors
  const primaryColor = [255, 107, 157]; // Pink
  const accentColor = [124, 58, 237]; // Purple
  const textDark = [31, 41, 55];
  const textGray = [107, 114, 128];

  // Header with gradient effect
  doc.setFillColor(255, 245, 248);
  doc.rect(0, 0, 210, 45, 'F');

  // Title
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.setFont(undefined, 'bold');
  doc.text('AI Makeup Product Recommender', 105, 20, { align: 'center' });

  // Subtitle
  doc.setFontSize(11);
  doc.setTextColor(...textGray);
  doc.setFont(undefined, 'normal');
  doc.text('Hasil Rekomendasi Produk Makeup', 105, 28, { align: 'center' });

  // Date
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.setFontSize(9);
  doc.text(dateStr, 105, 35, { align: 'center' });

  let yPos = 50;

  // Budget Info Box
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(15, yPos, 180, 25, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setTextColor(...textDark);
  doc.setFont(undefined, 'bold');
  doc.text('Informasi Budget', 20, yPos + 7);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...textGray);

  // Strategy name
  let strategyName = 'Termurah';
  if (obj.priority === 'aesthetic') strategyName = 'Estetika';
  else if (obj.priority === 'balanced') strategyName = 'Seimbang';
  else if (obj.priority === 'optimized') strategyName = 'Optimasi Estetika';

  doc.text(`Strategi: ${strategyName}`, 20, yPos + 13);
  doc.text(`Budget: ${fmt(obj.budget)}`, 20, yPos + 19);

  doc.text(`Total Biaya: ${fmt(obj.total)}`, 110, yPos + 13);
  doc.text(`Sisa Budget: ${fmt(obj.remaining)}`, 110, yPos + 19);

  yPos += 33;

  // Products Table Header
  doc.setFontSize(12);
  doc.setTextColor(...textDark);
  doc.setFont(undefined, 'bold');
  doc.text('Daftar Produk Rekomendasi', 15, yPos);

  yPos += 8;

  // Table Header
  doc.setFillColor(...primaryColor);
  doc.rect(15, yPos, 180, 8, 'F');

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text('#', 18, yPos + 5.5);
  doc.text('Nama Produk', 28, yPos + 5.5);
  doc.text('Style', 115, yPos + 5.5);
  doc.text('Aesthetic', 145, yPos + 5.5);
  doc.text('Harga', 172, yPos + 5.5);

  yPos += 8;

  // Table Rows
  doc.setFont(undefined, 'normal');
  doc.setTextColor(...textDark);

  obj.chosen.forEach((p, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(249, 250, 251);
    }
    doc.rect(15, yPos, 180, 8, 'F');

    doc.setFontSize(9);
    doc.text(String(index + 1), 18, yPos + 5.5);

    // Product name (truncate if too long)
    let productName = p.name;
    if (productName.length > 35) {
      productName = productName.substring(0, 32) + '...';
    }
    doc.text(productName, 28, yPos + 5.5);

    // Styles
    const styleText = p.styles.join(', ');
    doc.setFontSize(8);
    doc.setTextColor(...textGray);
    doc.text(styleText, 115, yPos + 5.5);

    // Aesthetic score
    doc.setFontSize(9);
    doc.setTextColor(...accentColor);
    doc.text(String(p.aesthetic), 148, yPos + 5.5);

    // Price
    doc.setTextColor(...primaryColor);
    doc.setFont(undefined, 'bold');
    const priceText = fmt(p.price).replace('Rp', '').trim();
    doc.text(priceText, 192, yPos + 5.5, { align: 'right' });

    doc.setFont(undefined, 'normal');
    doc.setTextColor(...textDark);

    yPos += 8;
  });

  // Summary Box
  yPos += 5;

  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(255, 245, 248);
  doc.roundedRect(15, yPos, 180, 20, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setTextColor(...textDark);
  doc.setFont(undefined, 'bold');
  doc.text('Ringkasan', 20, yPos + 7);

  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text(`Jumlah Produk: ${obj.chosen.length} item`, 20, yPos + 14);

  doc.setFont(undefined, 'bold');
  doc.setTextColor(...primaryColor);
  doc.text(`Total: ${fmt(obj.total)}`, 110, yPos + 14);

  doc.setTextColor(...accentColor);
  doc.text(`Sisa: ${fmt(obj.remaining)}`, 155, yPos + 14);

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...textGray);
    doc.setFont(undefined, 'italic');
    doc.text(
      `Halaman ${i} dari ${pageCount} | AI Makeup Product Recommender | Sistem Cerdas`,
      105,
      290,
      { align: 'center' }
    );
  }

  return doc;
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    if (downloadModal) downloadModal.show();
  });
}

if (btnDownloadCSV) {
  btnDownloadCSV.addEventListener('click', () => {
    const last = downloadBtn._last; if (!last) return;
    const csv = toCSV(last);
    downloadFile('rekomendasi_makeup.csv', csv, 'text/csv;charset=utf-8');
    if (downloadModal) downloadModal.hide();
    showToast('File CSV berhasil diunduh');
  });
}
if (btnDownloadJSON) {
  btnDownloadJSON.addEventListener('click', () => {
    const last = downloadBtn._last; if (!last) return;
    const json = JSON.stringify(last, null, 2);
    downloadFile('rekomendasi_makeup.json', json, 'application/json');
    if (downloadModal) downloadModal.hide();
    showToast('File JSON berhasil diunduh');
  });
}

if (btnDownloadPDF) {
  btnDownloadPDF.addEventListener('click', () => {
    const last = downloadBtn._last; if (!last) return;
    try {
      const pdf = toPDF(last);
      pdf.save('rekomendasi_makeup.pdf');
      if (downloadModal) downloadModal.hide();
      showToast('File PDF berhasil diunduh');
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    }
  });
}

// Allow Enter to search
budgetInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchBtn.click(); });

// Bind new buttons
const optimizeBtn = document.getElementById('optimizeBtn');
const clearSelectionBtn = document.getElementById('clearSelectionBtn');

if (optimizeBtn) {
  optimizeBtn.addEventListener('click', () => {
    const raw = budgetInput.value.trim();
    const budget = parseBudget(raw);
    if (!Number.isFinite(budget) || budget <= 0) {
      alert('Masukkan budget yang valid (angka dalam Rupiah).');
      budgetInput.focus();
      return;
    }
    const style = styleSelect.value;
    const result = optimizeAesthetic(style, budget);
    renderResult(result, budget, 'optimized', parseInt(aestheticSlider.value, 10));
  });
}

if (clearSelectionBtn) {
  clearSelectionBtn.addEventListener('click', () => {
    budgetInput.value = '';
    styleSelect.value = 'Natural';
    prioritySelect.value = 'cheapest';
    aestheticSlider.value = 60;
    output.innerHTML = '<div class="empty">Masukkan budget dan pilih style lalu klik "Cari Rekomendasi".</div>';
    downloadBtn.disabled = true;
    downloadBtn._last = null;
  });
}

// Init
output.innerHTML = '<div class="empty">Masukkan budget dan pilih style lalu klik "Cari Rekomendasi".</div>';
downloadBtn.disabled = true;
