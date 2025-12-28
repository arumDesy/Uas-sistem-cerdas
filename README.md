# 💄 AI Makeup Product Recommender

> Sistem Rekomendasi Produk Makeup Cerdas dengan Algoritma Greedy & Knapsack

<div align="center">

![Version](https://img.shields.io/badge/version-2.0-pink)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)

</div>

---

## 📖 Deskripsi

**AI Makeup Product Recommender** adalah aplikasi web yang membantu pengguna menemukan kombinasi produk makeup terbaik sesuai dengan budget dan style mereka. Aplikasi ini menggunakan algoritma cerdas (Greedy & Knapsack) untuk memberikan rekomendasi yang optimal.

### 🎯 Fitur Utama

- ✨ **28 Produk Makeup Profesional** dengan berbagai kategori
- 🤖 **3 Strategi Rekomendasi**: Termurah, Estetika, Seimbang
- 🎨 **3 Style Makeup**: Natural, Glam, Bridal
- 📊 **Optimasi Estetika** menggunakan algoritma Knapsack
- 💾 **Export Results** ke PDF, CSV, atau JSON
- 📱 **Responsive Design** - Desktop, Tablet, Mobile
- 🎨 **Modern UI/UX** dengan Inter & Outfit fonts

---

## 🚀 Cara Menggunakan

### 1. Buka Aplikasi
```
File → Open → html/index.html
```
atau jalankan dengan live server

### 2. Masukkan Budget
- Ketik budget Anda dalam Rupiah (contoh: 500000)
- Budget minimum: Rp 65.000

### 3. Pilih Style
- **Natural**: Makeup sehari-hari yang fresh dan natural
- **Glam**: Makeup bold untuk acara special
- **Bridal**: Makeup pernikahan yang elegan

### 4. Pilih Prioritas
- **Termurah**: Maksimalkan jumlah produk dengan budget terendah
- **Estetika**: Prioritas produk dengan skor estetika tertinggi
- **Seimbang**: Kombinasi harga dan estetika (atur bobot manual)

### 5. Dapatkan Rekomendasi
- **Cari Rekomendasi**: Menggunakan algoritma greedy
- **Optimalkan Estetika**: Menggunakan algoritma knapsack untuk hasil optimal

---

## 📦 Struktur Produk

### Foundation & Base (4 produk)
- Cushion Glow Foundation - Rp 180.000
- HD Liquid Foundation - Rp 225.000
- Dewy Skin Tint - Rp 165.000
- Matte Forever Foundation - Rp 195.000

### Concealer & Corrector (3 produk)
- Full Coverage Concealer - Rp 135.000
- Brightening Under-Eye Pen - Rp 110.000
- Color Corrector Palette - Rp 145.000

### Lips (5 produk)
- Velvet Matte Lipstick - Rp 95.000
- Bridal Lip Tint Set - Rp 140.000
- Satin Nude Lipstick - Rp 105.000
- Plumping Lip Gloss - Rp 88.000
- Long-Wear Lip Stain - Rp 125.000

### Blush & Contour (4 produk)
- Soft Blush Cream - Rp 75.000
- Powder Blush Duo - Rp 98.000
- Contour & Highlight Kit - Rp 185.000
- Bronzer Palette - Rp 155.000

### Eyes (6 produk)
- Intense Eye Palette - Rp 210.000
- Everyday Mascara - Rp 85.000
- Smokey Liner - Rp 70.000
- Waterproof Eyeliner Set - Rp 115.000
- Natural Nude Eyeshadow - Rp 175.000
- Glitter Eye Topper - Rp 92.000

### Brows & Highlighter (4 produk)
- Brow Define Pencil - Rp 65.000
- Brow Pomade & Brush - Rp 128.000
- Highlighter Dew - Rp 120.000
- Strobing Powder Duo - Rp 142.000

### Setting & Primers (2 produk)
- Setting Spray Longwear - Rp 90.000
- Pore-Blur Primer - Rp 158.000

---

## 🧠 Algoritma

### 1. Greedy Algorithm
**Strategi Termurah**
```javascript
- Sort produk by harga (ascending)
- Pilih produk termurah yang fit budget
- Complexity: O(n log n)
```

**Strategi Estetika**
```javascript
- Sort produk by aesthetic score (descending)
- Pilih produk dengan estetika tertinggi yang fit budget
- Complexity: O(n log n)
```

**Strategi Seimbang**
```javascript
- Normalize harga ke skala 0-100
- Combined Score = (w × aesthetic) + ((1-w) × priceScore)
- Sort by combined score (descending)
- Complexity: O(n log n)
```

### 2. Knapsack Algorithm (Dynamic Programming)
**Optimasi Estetika**
```javascript
- 0/1 Knapsack problem
- Maximize: Total aesthetic score
- Constraint: Total price ≤ budget
- Complexity: O(n × capacity)
- Space: O(capacity)
```

**Optimasi dengan Scaling**
```javascript
const SCALE = 1000
capacity = budget / SCALE  // Reduce DP array size
weight[i] = price[i] / SCALE
value[i] = aesthetic[i]
```

---

## 🎨 Teknologi

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling dengan CSS Variables
- **JavaScript (ES6+)** - Vanilla JS, no frameworks
- **jsPDF** - PDF generation library

### Styling
- **Bootstrap 5.3.2** - Grid system & utilities
- **Bootstrap Icons** - Icon set
- **Custom CSS** - Premium design system

### Fonts
- **Inter** (300-700) - Body text
- **Outfit** (400-800) - Headings

### Design Principles
- Mobile-first responsive design
- Accessibility (WCAG 2.1)
- Modern color palette
- Smooth animations & transitions
- Premium UI/UX

---

## 📊 Data Structure

```javascript
{
  id: Number,              // Unique identifier
  name: String,            // Product name
  price: Number,           // Price in IDR
  styles: Array<String>,   // ["Natural", "Glam", "Bridal"]
  aesthetic: Number,       // Aesthetic score (0-100)
  popularity: Number       // Popularity score (0-100)
}
```

---

## 🌈 Color Palette

```css
Primary Pink:   #FF6B9D → #FF8FAB
Accent Purple:  #7C3AED → #A78BFA
Background:     #FAFBFC → #FFFFFF
Text Dark:      #1F2937
Text Gray:      #6B7280
Text Light:     #9CA3AF
Border:         #E5E7EB
```

---

## 📱 Responsive Breakpoints

| Device  | Width     | Layout      |
|---------|-----------|-------------|
| Mobile  | < 576px   | Single col  |
| Tablet  | 576-768px | Single col  |
| Desktop | > 768px   | Two cols    |

---

## 💾 Export Format

### PDF
**Format**: Professional document dengan design yang rapi
- Header dengan branding AI Makeup Recommender
- Timestamp download
- Info budget & strategi dalam box
- Tabel produk dengan kolom: #, Nama, Style, Aesthetic, Harga
- Alternate row colors untuk readability
- Summary box dengan total & sisa budget
- Footer dengan page numbers
- Multi-page support untuk banyak produk
- Color-coded elements (Pink primary, Purple accent)

### CSV
```csv
id,name,price,styles,aesthetic,popularity
1,Cushion Glow Foundation,180000,"Natural;Bridal",78,85
...
total,490000
budget,500000
remaining,10000
```

### JSON
```json
{
  "chosen": [...],
  "total": 490000,
  "budget": 500000,
  "remaining": 10000,
  "priority": "cheapest",
  "weight": 60
}
```

---

## 🔧 Customization

### Menambah Produk Baru
Edit file `js/app.js`, tambahkan di array `PRODUCTS`:
```javascript
{
  id: 29,
  name: "New Product",
  price: 150000,
  styles: ["Natural", "Glam"],
  aesthetic: 80,
  popularity: 75
}
```

### Mengubah Color Scheme
Edit file `css/styles.css`, ubah CSS variables di `:root`:
```css
:root {
  --primary: #YOUR_COLOR;
  --accent: #YOUR_ACCENT;
}
```

---

## 📈 Future Enhancements

- [ ] Backend integration dengan database
- [ ] User accounts & saved preferences
- [ ] Product reviews & ratings
- [ ] Real product images dari API
- [ ] Shopping cart & checkout
- [ ] AI-powered skin tone matching
- [ ] Virtual try-on dengan AR
- [ ] Multi-language support

---

## 👥 Credits

**Proyek**: Sistem Cerdas — Tugas Akhir  
**Developer**: [Your Name]  
**University**: [Your University]  
**Year**: 2025

---

## 📄 License

MIT License - Feel free to use this project for learning purposes.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

Jika ada pertanyaan atau masalah:
- 📧 Email: [your-email@example.com]
- 💬 Issues: [GitHub Issues](https://github.com/yourusername/repo/issues)

---

<div align="center">

**Made with 💖 and ☕**

⭐ Star this repo if you find it helpful!

</div>
