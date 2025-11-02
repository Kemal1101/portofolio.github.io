# Portofolio JavaScript Sederhana

Website portofolio statis yang modern, responsif, dan tanpa dependensi eksternal. Dibuat dengan HTML + CSS + JavaScript murni.

## Fitur

- Tema gelap/terang (tersimpan di localStorage)
- Navigasi mobile (hamburger) + smooth scroll
- Animasi muncul saat scroll (IntersectionObserver)
- Section: Hero, Tentang, Skill, Proyek, Kontak
- Proyek dirender dinamis dari `assets/js/data.js` + filter berdasarkan tag
- Tombol salin email dan tautan mailto

## Struktur Proyek

.
├── index.html
├── assets
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   ├── data.js
│   │   └── main.js
│   └── docs
│       └── CV.txt (ganti dengan CV.pdf)
└── README.md

## Cara Menjalankan

Karena ini situs statis, kamu bisa langsung buka `index.html` di browser.

Jika ingin mode server lokal (disarankan untuk validasi path):

- Opsi 1: Ekstensi VS Code "Live Server" (paling mudah)
- Opsi 2: PowerShell dengan Python (jika Python terpasang)

powershell
# dari folder proyek
python -m http.server 5500

Lalu buka http://localhost:5500 di browser.

## Kustomisasi Cepat

- Ubah nama, jabatan, dan sosial:
  - `index.html`: bagian Hero dan tautan sosial
- Ganti/ubah CV:
  - Simpan `assets/docs/CV.pdf` dan ubah tautan tombol bila perlu di `index.html`
- Ubah proyek:
  - Edit `assets/js/data.js` (judul, deskripsi, tags, link repo/live)
- Ubah warna/tema dan gaya:
  - `assets/css/styles.css` (token warna di `:root` dan `html[data-theme='light']`)

## Tambahan

- Filter proyek: klik chip/tag di bagian atas grid untuk memfilter
- Aksesibilitas: gunakan teks alternatif/aria bila menambah gambar/ikon
- Deployment: unggah seluruh folder ke Netlify, Vercel, GitHub Pages, atau hosting statis lainnya

---
Dibuat dengan ❤ menggunakan HTML/CSS/JS.