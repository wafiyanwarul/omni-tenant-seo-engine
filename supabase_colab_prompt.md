# Google Colab prompt + script for Gemini + Supabase

## Goal
Buat prompt yang kamu pakai dengan Gemini di Google Colab agar otomatis mengubah data perusahaan asli menjadi baris `Company` dan memasukkannya ke database Supabase.

## Gemini prompt (gunakan di Colab)

```txt
Kamu adalah asisten Python yang membuat script otomatis untuk ingest data perusahaan ke Supabase Postgres.

Input:
- File data asli perusahaan (Excel/CSV) dengan kolom seperti `name`, `slug`, `description`, `province`, `city`, `website`, `email`, `phone`, `services`, `foundedYear`, `employeeCount`, `pricingModel`, `sourceName`, `sourceUrl`, `lastReviewedAt`, dan lain-lain.
- Koneksi database Supabase Postgres saya ada di `.env` sebagai `DATABASE_URL`.

Tugas:
1. Tulis script Python yang bisa dijalankan di Google Colab.
2. Script harus install dependensi yang dibutuhkan, memuat `.env`, membaca file data, membersihkan kolom, dan mengubah setiap baris menjadi record yang cocok dengan model Prisma `Company`.
3. Script harus membuka koneksi ke Supabase Postgres menggunakan `DATABASE_URL` dan menambahkan atau memperbarui baris data ke tabel `Company`.
4. Script harus menampilkan ringkasan jumlah baris yang berhasil diproses dan jumlah row yang di-skip.
5. Gunakan `services` sebagai JSON valid dan kirim ke kolom JSON.
6. Jangan tulis kunci API atau URL nyata; gunakan placeholder jika perlu.
7. Hasil output harus berupa satu file Python atau satu cell Colab lengkap yang siap dijalankan.

Catatan tambahan:
- `DATABASE_URL` hanya boleh dimuat dari `.env` yang kamu upload di runtime, dan tidak boleh disimpan di GitHub.
- Pastikan penanganan error pada koneksi dan saat insert data.
- Jika tabel bernama lain di Supabase, beri catatan bahwa nama tabel bisa disesuaikan.

Berikan saya kode Colab yang lengkap dan jelas.
```

## Contoh script Google Colab

```python
# 1) Install libraries once
!pip install python-dotenv pandas openpyxl psycopg[binary]

import os
from dotenv import load_dotenv
import pandas as pd
import psycopg
from psycopg.rows import dict_row

# 2) Load environment variables from .env
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL tidak ditemukan di environment. Upload .env dan pastikan .env berisi DATABASE_URL=postgres://...")

# 3) Pilih file sumber data
# Jika kamu upload file Excel/CSV ke Colab, ganti path di bawah ini.
source_path = "/content/company_data.xlsx"  # atau "/content/company_data.csv"

if source_path.endswith(".xlsx"):
    df = pd.read_excel(source_path, dtype=str)
elif source_path.endswith(".csv"):
    df = pd.read_csv(source_path, dtype=str)
else:
    raise ValueError("Gunakan file .xlsx atau .csv")

# 4) Normalisasi kolom dan data
expected_columns = [
    "name", "slug", "description", "logoUrl", "province", "city", "address",
    "website", "email", "phone", "linkedinUrl", "instagramUrl",
    "services", "foundedYear", "employeeCount", "pricingModel",
    "isVerified", "sourceName", "sourceUrl", "lastReviewedAt"
]

# Pastikan kolom yang ada dapat dipetakan ke schema Company
# Jika nama kolom berbeda, atur mapping di sini.
column_map = {
    "nama": "name",
    "nama_perusahaan": "name",
    "kota": "city",
    "provinsi": "province",
    "website_url": "website",
    "linkedin": "linkedinUrl",
    "instagram": "instagramUrl",
    "deskripsi": "description",
    "layanan": "services",
    "tahun_berdiri": "foundedYear",
    "jumlah_karyawan": "employeeCount",
    "model_biaya": "pricingModel",
    "sumber": "sourceName",
    "url_sumber": "sourceUrl",
    "terakhir_ditinjau": "lastReviewedAt",
}

df = df.rename(columns={k: v for k, v in column_map.items() if k in df.columns})

# Isi kolom kosong demi keamanan
for col in expected_columns:
    if col not in df.columns:
        df[col] = None

# Convert tipe dasar
if "isVerified" in df.columns:
    df["isVerified"] = df["isVerified"].astype(str).str.lower().isin(["true", "1", "yes", "ya"])
else:
    df["isVerified"] = False

if "foundedYear" in df.columns:
    df["foundedYear"] = pd.to_numeric(df["foundedYear"], errors="coerce").fillna(None).astype(object)

if "services" in df.columns:
    df["services"] = df["services"].fillna("[]").apply(lambda x: x if isinstance(x, str) else str(x))

# 5) Persiapkan koneksi ke database
conn = psycopg.connect(DATABASE_URL)
conn.autocommit = False

insert_sql = '''
INSERT INTO public."Company" (
    name, slug, description, "logoUrl", province, city, address,
    website, email, phone, "linkedinUrl", "instagramUrl",
    services, "foundedYear", "employeeCount", "pricingModel",
    "isVerified", "sourceName", "sourceUrl", "lastReviewedAt"
) VALUES (
    %(name)s, %(slug)s, %(description)s, %(logoUrl)s, %(province)s, %(city)s, %(address)s,
    %(website)s, %(email)s, %(phone)s, %(linkedinUrl)s, %(instagramUrl)s,
    %(services)s::jsonb, %(foundedYear)s, %(employeeCount)s, %(pricingModel)s,
    %(isVerified)s, %(sourceName)s, %(sourceUrl)s, %(lastReviewedAt)s
)
ON CONFLICT (slug) DO UPDATE SET
    description = EXCLUDED.description,
    "logoUrl" = EXCLUDED."logoUrl",
    province = EXCLUDED.province,
    city = EXCLUDED.city,
    address = EXCLUDED.address,
    website = EXCLUDED.website,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    "linkedinUrl" = EXCLUDED."linkedinUrl",
    "instagramUrl" = EXCLUDED."instagramUrl",
    services = EXCLUDED.services,
    "foundedYear" = EXCLUDED."foundedYear",
    "employeeCount" = EXCLUDED."employeeCount",
    "pricingModel" = EXCLUDED."pricingModel",
    "isVerified" = EXCLUDED."isVerified",
    "sourceName" = EXCLUDED."sourceName",
    "sourceUrl" = EXCLUDED."sourceUrl",
    "lastReviewedAt" = EXCLUDED."lastReviewedAt",
    "updatedAt" = now();
'''

success_count = 0
skipped_count = 0
errors = []

with conn.cursor(row_factory=dict_row) as cur:
    for index, row in df.iterrows():
        record = {col: row.get(col) for col in expected_columns}
        if not record["name"] or not record["slug"]:
            skipped_count += 1
            continue

        if isinstance(record["services"], str):
            try:
                record["services"] = record["services"] if record["services"].strip() else "[]"
            except Exception:
                record["services"] = "[]"

        try:
            cur.execute(insert_sql, record)
            success_count += 1
        except Exception as e:
            errors.append((index, str(e), record["slug"]))
            conn.rollback()

    conn.commit()

print(f"Inserted/updated: {success_count}")
print(f"Skipped: {skipped_count}")
print(f"Errors: {len(errors)}")
for error in errors[:10]:
    print(error)
```

## Cara pakai

1. Upload file dataset kamu ke Google Colab (`company_data.xlsx` atau `company_data.csv`).
2. Upload juga file `.env` jika kamu ingin memuat `DATABASE_URL` lokal.
3. Jalankan cell Colab di atas.
4. Pastikan tabel Supabase kamu sudah cocok dengan model `Company` dari Prisma.

## Catatan penting

- `.env` tidak boleh dipush ke GitHub.
- Jika `Company` tabel di Supabase pakai nama berbeda, ganti `public."Company"` di query dengan nama tabel yang benar.
- Jangan bagikan `DATABASE_URL` atau kunci lain publik.
