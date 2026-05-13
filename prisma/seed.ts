import "dotenv/config";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data first
  await prisma.company.deleteMany();

  const companies = [
    {
      name: "PT Solusi Digital Surabaya",
      slug: "pt-solusi-digital-surabaya",
      city: "surabaya",
      services: JSON.stringify(["Web Development", "Mobile App", "Cloud Infrastructure"]),
      description:
        "Perusahaan IT terkemuka di Surabaya yang fokus pada transformasi digital untuk bisnis skala menengah dan enterprise. Berpengalaman lebih dari 10 tahun dalam membangun solusi teknologi yang scalable.",
      logo_url: null,
    },
    {
      name: "CV Teknologi Maju Malang",
      slug: "cv-teknologi-maju-malang",
      city: "malang",
      services: JSON.stringify(["Software Development", "IT Consulting", "Cybersecurity"]),
      description:
        "Penyedia jasa pengembangan software custom di Malang yang melayani berbagai industri mulai dari pendidikan, kesehatan, hingga retail. Tim berpengalaman dengan lebih dari 50 proyek sukses.",
      logo_url: null,
    },
    {
      name: "PT Inovasi Sistem Jember",
      slug: "pt-inovasi-sistem-jember",
      city: "jember",
      services: JSON.stringify(["ERP System", "Web Development", "IT Support"]),
      description:
        "Spesialis implementasi sistem ERP dan solusi manajemen bisnis di Jember dan sekitarnya. Membantu UKM dan perusahaan lokal dalam mengotomatisasi proses bisnis mereka.",
      logo_url: null,
    },
    {
      name: "Studio Kode Kreatif Sidoarjo",
      slug: "studio-kode-kreatif-sidoarjo",
      city: "sidoarjo",
      services: JSON.stringify(["UI/UX Design", "Frontend Development", "Branding"]),
      description:
        "Studio teknologi kreatif di Sidoarjo yang menggabungkan desain estetik dengan engineering yang solid. Mengkhususkan diri dalam membangun produk digital yang user-friendly dan berdampak.",
      logo_url: null,
    },
    {
      name: "PT Data Nusantara Mojokerto",
      slug: "pt-data-nusantara-mojokerto",
      city: "mojokerto",
      services: JSON.stringify(["Data Analytics", "Machine Learning", "Business Intelligence"]),
      description:
        "Pelopor layanan data analytics dan kecerdasan buatan di Mojokerto. Membantu perusahaan mengubah data mentah menjadi insight bisnis yang actionable untuk pengambilan keputusan yang lebih baik.",
      logo_url: null,
    },
  ];

  for (const company of companies) {
    const created = await prisma.company.create({ data: company });
    console.log(`✅ Created: ${created.name} (${created.city})`);
  }

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
