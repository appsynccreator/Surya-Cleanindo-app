<div align="center">

<img src="icon-512.png" alt="Surya Cleanindo Logo" width="120">

# Surya Cleanindo Management System

**SCMS** — Sistem manajemen operasional terpadu untuk bisnis Laundry, Cleaning, dan Pest Control

[![Platform](https://img.shields.io/badge/Platform-Google%20Apps%20Script-4285F4?style=flat-square&logo=google)](https://script.google.com)
[![Database](https://img.shields.io/badge/Database-Google%20Sheets-34A853?style=flat-square&logo=google-sheets)](https://sheets.google.com)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](#)
[![Version](https://img.shields.io/badge/Version-3.0-green?style=flat-square)](#)

</div>

---

## 📋 Tentang Aplikasi

SCMS adalah aplikasi web berbasis **Google Apps Script** yang dirancang khusus untuk mengelola operasional harian Surya Cleanindo. Berjalan sepenuhnya di ekosistem Google (Sheets + GAS) tanpa biaya hosting tambahan, dapat diakses dari browser desktop maupun mobile.

---

## ✨ Fitur Utama

### 📊 Dashboard
- Ringkasan total transaksi, jadwal hari ini, dan status pembayaran
- Jadwal kunjungan real-time
- Analisis singkat otomatis

### 📅 Jadwal Kunjungan
- Penjadwalan kunjungan untuk layanan Cleaning & Pest Control
- Alur kerja Staff: **Open → On Progress → Completed**
- Checklist parameter lapangan per kategori layanan
- Upload foto dokumentasi kunjungan
- Filter berdasarkan bulan, tahun, dan status
- Auto-generate jadwal berikutnya untuk periode Mingguan/Bulanan
- Tampilan alamat lengkap pelanggan

### 🧾 Invoice / Transaksi
- Invoice untuk Laundry, Cleaning, dan Pest Control
- Tarik data otomatis dari jadwal yang sudah Completed
- Auto-isi nama pelanggan saat pilih ID jadwal
- Filter bulan & tahun
- Ubah status pembayaran (Belum Bayar / Lunas)
- Kirim struk invoice via email ke pelanggan
- Cetak struk termal

### 👥 Pelanggan
- Database pelanggan lengkap (nama, alamat, telepon, email, koordinat)
- Pencarian dan pengelolaan data

### 🏷️ Pricelist
- Pricelist terpisah untuk Laundry, Cleaning, dan Pest Control
- Kelola harga paket dengan mudah

### ⚙️ Parameter Checklist
- Konfigurasi item checklist per kategori layanan
- Parameter berbeda untuk Cleaning dan Pest Control

### 💸 Pengeluaran
- Catat pengeluaran per jenis layanan
- Filter bulan, tahun, dan jenis
- Total pengeluaran otomatis

### 📊 Laporan
- Laporan bulanan per jenis layanan
- Pendapatan, pengeluaran, dan untung/rugi
- Hanya dapat diakses oleh Owner

### 👤 Manajemen User
- Tiga role: **Owner**, **Admin**, **Staff**
- Kelola akun pengguna (tambah, edit, nonaktifkan)
- Hanya dapat diakses oleh Owner

---

## 🔐 Sistem Role & Hak Akses

| Fitur | Owner | Admin | Staff |
|-------|:-----:|:-----:|:-----:|
| Dashboard | ✅ | ✅ | ✅ |
| Jadwal (View) | ✅ | ✅ | ✅ |
| Jadwal (Isi Checklist) | ❌ | ❌ | ✅ |
| Invoice / Transaksi | ✅ | ✅ | ❌ |
| Pelanggan | ✅ | ✅ | ❌ |
| Pricelist | ✅ | ✅ | ❌ |
| Parameter Checklist | ✅ | ✅ | ❌ |
| Pengeluaran | ✅ | ✅ | ❌ |
| Laporan | ✅ | ❌ | ❌ |
| Manajemen User | ✅ | ❌ | ❌ |

---

## 📁 Struktur File

```
📦 SCMS
├── Code.js              # Backend Google Apps Script
├── index.html           # Frontend (HTML + CSS + JS all-in-one)
├── appsscript.json      # Konfigurasi GAS & OAuth scopes
├── icon-192.png         # App icon 192×192 (PWA)
├── icon-512.png         # App icon 512×512 (PWA)
├── favicon.ico          # Favicon browser
├── favicon-32x32.png    # Favicon PNG
├── manifest.json        # Web App Manifest (PWA)
└── README.md            # Dokumentasi ini
```

---

## 🗄️ Struktur Database (Google Sheets)

Aplikasi menggunakan **14 sheet** dalam satu Google Spreadsheet:

| Sheet | Kolom Utama | Keterangan |
|-------|-------------|------------|
| `Pengguna` | ID, Username, Password_Hash, Nama_Lengkap, Role, Aktif | Data akun pengguna |
| `Pelanggan` | ID, Nama, Alamat_Lengkap, Latitude, Longitude, Telepon, Email | Data pelanggan |
| `Jadwal_Kunjungan` | ID, Tanggal_Schedule, Tanggal_Realisasi, Pelanggan_ID, Jenis_Layanan, Kategori_Layanan, Periode, Status, Checklist_Data, Foto_Dokumentasi | Jadwal & realisasi kunjungan |
| `Transaksi` | ID, Tanggal_Masuk, Pelanggan_ID, Jenis, Total, Status_Bayar | Data invoice |
| `Transaksi_Detail` | ID, Transaksi_ID, Nama_Item, Harga, Jumlah, Subtotal | Detail item invoice |
| `Pricelist_Laundry` | ID, Nama_Item, Harga_Satuan, Satuan | Harga layanan laundry |
| `Pricelist_Cleaning` | ID, Nama_Paket, Harga | Harga layanan cleaning |
| `Pricelist_Pest` | ID, Nama_Paket, Harga | Harga layanan pest control |
| `Parameter_Cleaning` | ID, Kategori, Item | Checklist parameter cleaning |
| `Parameter_Pest` | ID, Kategori, Item | Checklist parameter pest control |
| `Pengeluaran` | ID, Tanggal, Jenis, Keterangan, Jumlah, Dibuat_Oleh | Catatan pengeluaran |
| `Session_Log` | Timestamp, User_ID, Username, Aksi, Token | Log aktivitas login/logout |

---

## 🚀 Cara Instalasi

### Prasyarat
- Akun Google
- Google Spreadsheet baru (kosong)
- Akses ke [Google Apps Script](https://script.google.com)

### Langkah 1 — Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com) → buat spreadsheet baru
2. Salin **ID spreadsheet** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### Langkah 2 — Setup Google Apps Script

1. Buka [script.google.com](https://script.google.com) → klik **New Project**
2. Ganti nama project menjadi `SCMS - Surya Cleanindo`

### Langkah 3 — Upload File

**Code.js:**
- Klik file `Code.gs` di GAS Editor
- Hapus semua isi → paste isi file `Code.js`
- Ganti nilai `SPREADSHEET_ID` di baris 8 dengan ID spreadsheet Anda

**index.html:**
- Klik **+** → pilih **HTML** → beri nama `index`
- Hapus semua isi → paste isi file `index.html`

**appsscript.json:**
- Klik **Project Settings (⚙️)** → centang *"Show 'appsscript.json' manifest file in editor"*
- Klik file `appsscript.json` → paste isi file `appsscript.json`

### Langkah 4 — Inisialisasi Database

1. Di GAS Editor, pilih function **`inisialisasiSpreadsheet`** dari dropdown
2. Klik **Run**
3. Ikuti dialog **otorisasi** → klik **Review permissions** → pilih akun → **Allow**
4. Cek Google Spreadsheet — semua sheet sudah terbuat otomatis

### Langkah 5 — Deploy

1. Klik **Deploy → New deployment**
2. Pilih type: **Web app**
3. Isi konfigurasi:
   - **Execute as:** Me (your account)
   - **Who has access:** Anyone (atau sesuai kebutuhan)
4. Klik **Deploy**
5. Salin **URL deployment** yang diberikan

### Langkah 6 — Akses Aplikasi

Buka URL deployment di browser. Login menggunakan akun default:

| Role | Username | Password |
|------|----------|----------|
| Owner | `owner` | `admin123` |
| Admin | `admin` | `admin123` |
| Staff | `staff1` | `staff123` |

> ⚠️ **Segera ganti password default** setelah login pertama kali melalui menu Manajemen User.

---

## 🔄 Cara Update / Deploy Ulang

Setiap kali ada perubahan kode:

1. Update file di GAS Editor → **Save (Ctrl+S)**
2. Klik **Deploy → Manage deployments**
3. Klik ikon **Edit (✏️)** pada deployment aktif
4. Ubah **version → "New version"**
5. Klik **Deploy**
6. Gunakan URL yang sama (tidak berubah)

---

## 📱 Tampilan Mobile

Aplikasi mendukung tampilan mobile dengan:
- **Bottom navigation bar** menggantikan sidebar
- Menu **"Lainnya"** dengan drawer slide-up untuk menu tambahan
- Filter grid 2 kolom yang rapi di layar kecil
- Tombol kamera langsung untuk upload foto dokumentasi

---

## 🛠️ Teknologi

| Komponen | Teknologi |
|----------|-----------|
| Backend | Google Apps Script (GAS) V8 |
| Database | Google Sheets |
| Frontend | HTML5 + CSS3 + Vanilla JavaScript |
| Autentikasi | Session token via GAS CacheService |
| Font | Plus Jakarta Sans, JetBrains Mono |
| Icons | Font Awesome 6.5 |
| Hosting | Google Apps Script Web App |

---

## 🔒 Keamanan

- Password di-hash dengan **SHA-256 + SALT** sebelum disimpan
- Session token berbasis UUID dengan TTL 30 menit
- Role-based access control (RBAC) di setiap endpoint backend
- Session di-refresh otomatis saat ada aktivitas

---

## 📞 Kontak

**Surya Cleanindo**  
🧹 The Clean & Shining Service  
Laundry • Cleaning • Pest Control

---

<div align="center">
<sub>© 2025 Surya Cleanindo. All rights reserved.</sub>
</div>
