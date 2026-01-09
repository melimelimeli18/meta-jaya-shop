# Online Store CMS

CMS toko online sederhana yang dikembangkan dari project UAS dan dikembangkan ulang dengan pendekatan yang lebih terstruktur. Project ini berfokus pada pemisahan antara **frontstore (customer-facing)** dan **admin CMS**, serta menggunakan arsitektur modern berbasis API.

---

## Deskripsi Singkat

Online Store CMS ini memungkinkan pemilik usaha untuk:

- Mengelola katalog produk melalui admin panel
- Mengatur konten utama landing page (hero & produk unggulan)
- Menampilkan katalog produk ke customer
- Mengarahkan transaksi langsung ke marketplace eksternal (Shopee)

Project ini **tidak menangani pembayaran internal**, melainkan berfungsi sebagai **etalase digital** dan penghubung ke platform penjualan.

**Live Demo (Frontstore):**
[https://meta-jaya-shop.vercel.app/home](https://meta-jaya-shop.vercel.app/home)

---

## Tech Stack

### Frontend

- **Next.js** – React framework untuk routing, SSR/SSG, dan performa
- **Tailwind CSS** – Utility-first CSS framework untuk styling

### Backend

- **Express.js** – REST API untuk mengelola data dan logic CMS

### Infrastructure

- **Supabase**

  - Database (PostgreSQL)
  - Storage (gambar produk & hero)

---

## Fitur Utama

### 1. Frontstore

Website yang dapat diakses oleh customer.

#### 1.1 Beranda

- Hero section

  - Headline
  - Background image (diatur dari admin)

- Unique Selling Proposition (USP)
- Produk unggulan (maksimal 3 produk)
- Use case penggunaan produk
- Review pelanggan
- Call-to-action menuju katalog produk

#### 1.2 Katalog Produk

- Daftar seluruh produk
- Fitur pencarian (search)
- Filter produk

#### 1.3 Detail Produk

- Gambar produk
- Nama produk
- Harga
- Deskripsi
- Tombol **Belanja** (redirect ke link Shopee yang diatur di admin)
- Fitur favorit

#### 1.4 Tentang Toko

- Deskripsi toko
- Visi & misi
- Link toko marketplace
- Lokasi toko (maps)

---

### 2. Admin Panel

Digunakan oleh pemilik toko untuk mengelola konten.

#### 2.1 Manajemen Katalog

- Create produk
- Read produk
- Update produk
- Delete produk

Setiap produk memiliki:

- Nama
- Harga
- Deskripsi
- Gambar
- Link Shopee

#### 2.2 Edit Hero Section

- Mengubah headline hero
- Mengganti background image hero

#### 2.3 Produk Unggulan

- Memilih maksimal **3 produk** dari katalog
- Produk terpilih otomatis ditampilkan di beranda frontstore

---

## Karakteristik Sistem

- Arsitektur **API-driven** (frontend dan backend terpisah)
- Admin CMS terpisah dari tampilan customer
- Tidak bergantung pada sistem checkout internal
- Konten landing page dapat diubah tanpa deploy ulang frontend

---

## Tujuan Project

Project ini dibuat sebagai:

- Media pembelajaran pengembangan aplikasi web fullstack
- Contoh implementasi CMS sederhana untuk toko online
- Dasar website etalase digital untuk usaha kecil

---

## Catatan

Project ini berfokus pada:

- Struktur aplikasi
- Pemisahan concern frontend & backend
- Pengelolaan konten melalui CMS

Bukan ditujukan sebagai marketplace penuh, melainkan **online storefront + CMS**.
