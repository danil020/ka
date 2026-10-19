# KA — Praktikum Jenkins: Node.js + MySQL + Docker

Starter project untuk latihan integrasi GitHub, Jenkins Pipeline, Docker Compose, dan database MySQL.

## Menjalankan aplikasi
Pastikan Docker Desktop sudah berjalan, lalu dari folder `ka` jalankan:
```bash
docker compose up --build -d
```
Buka http://localhost:3000

- `GET /` — halaman status aplikasi
- `GET /api/students` — membaca data mahasiswa dari MySQL
- `POST /api/students` — menambah mahasiswa dengan JSON `{"name":"Budi","major":"Informatika"}`
- `GET /health` — memeriksa koneksi database

Hentikan container dengan `docker compose down`. Untuk menghapus data database latihan juga, jalankan `docker compose down -v`.

## GitHub
Buat repository baru bernama `ka`, lalu unggah semua isi folder ini. Setelah itu, di Jenkins pilih **New Item** → nama job → **Pipeline** → **OK**. Pada bagian Pipeline pilih **Pipeline script from SCM**, SCM **Git**, masukkan URL repository, branch `*/main`, Script Path `Jenkinsfile`, lalu simpan dan pilih **Build Now**.

Jika repository private, tambahkan kredensial GitHub di Jenkins. Untuk repository public, URL HTTPS biasanya cukup.

## Catatan Windows
Jenkinsfile menggunakan perintah `bat` dan Docker CLI. Docker Desktop harus berjalan. Jika Jenkins gagal mengakses Docker, periksa Console Output; service Jenkins mungkin berjalan dengan akun Windows yang tidak memiliki akses ke Docker Desktop.

## Keamanan
Password di `compose.yaml` hanya untuk latihan lokal. Jangan gunakan untuk layanan publik atau data nyata. Jangan commit token GitHub, private key SSH, atau password pribadi ke repository.
