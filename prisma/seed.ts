import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedCompany = {
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  province: string;
  city: string;
  address: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  services: string[];
  foundedYear: number | null;
  employeeCount: string | null;
  pricingModel: string | null;
  isVerified: boolean;
  sourceName: string | null;
  sourceUrl: string | null;
  lastReviewedAt: Date | null;
};

async function main() {
  console.log("Starting database seed...");

  await prisma.company.deleteMany();

  const companies: SeedCompany[] = [
    // ── JAWA TIMUR ──────────────────────────────────────────
    {
      name: "PT Solusi Digital Surabaya",
      slug: "pt-solusi-digital-surabaya",
      province: "Jawa Timur",
      city: "Surabaya",
      address: "Jl. HR Muhammad No. 5, Surabaya 60189",
      description:
        "Perusahaan IT terkemuka di Surabaya yang fokus pada transformasi digital untuk bisnis skala menengah dan enterprise. Berpengalaman lebih dari 10 tahun dalam membangun solusi teknologi yang scalable dan reliable.",
      website: "https://solusidigital.co.id",
      email: "hello@solusidigital.co.id",
      phone: "+62315123456",
      linkedinUrl: "https://linkedin.com/company/solusi-digital-surabaya",
      instagramUrl: "https://instagram.com/solusidigitalsby",
      services: ["Web Development", "Mobile App", "Cloud Infrastructure", "DevOps"],
      foundedYear: 2013,
      employeeCount: "50-100",
      pricingModel: "Project-based",
      isVerified: true,
      sourceName: "Clutch.co",
      sourceUrl: "https://clutch.co/profile/solusi-digital-surabaya",
      lastReviewedAt: new Date("2026-01-15"),
      logoUrl: null,
    },
    {
      name: "CV Teknologi Maju Malang",
      slug: "cv-teknologi-maju-malang",
      province: "Jawa Timur",
      city: "Malang",
      address: "Jl. Soekarno Hatta No. 12, Malang 65141",
      description:
        "Penyedia jasa pengembangan software custom di Malang yang melayani berbagai industri mulai dari pendidikan, kesehatan, hingga retail. Tim berpengalaman dengan lebih dari 50 proyek sukses di seluruh Indonesia.",
      website: "https://teknologimaju.id",
      email: "info@teknologimaju.id",
      phone: "+62341789012",
      linkedinUrl: "https://linkedin.com/company/teknologi-maju-malang",
      instagramUrl: "https://instagram.com/teknologimajumlg",
      services: ["Software Development", "IT Consulting", "Cybersecurity", "QA Testing"],
      foundedYear: 2016,
      employeeCount: "10-50",
      pricingModel: "Retainer",
      isVerified: true,
      sourceName: "GoodFirms",
      sourceUrl: "https://goodfirms.co/company/teknologi-maju",
      lastReviewedAt: new Date("2026-02-10"),
      logoUrl: null,
    },
    {
      name: "PT Inovasi Sistem Jember",
      slug: "pt-inovasi-sistem-jember",
      province: "Jawa Timur",
      city: "Jember",
      address: "Jl. Gajah Mada No. 89, Jember 68121",
      description:
        "Spesialis implementasi sistem ERP dan solusi manajemen bisnis di Jember dan sekitarnya. Membantu UKM dan perusahaan lokal dalam mengotomatisasi proses bisnis dengan teknologi yang tepat guna.",
      website: "https://inovasisistem.com",
      email: "contact@inovasisistem.com",
      phone: "+62331654321",
      linkedinUrl: null,
      instagramUrl: "https://instagram.com/inovasisistemjember",
      services: ["ERP System", "Web Development", "IT Support", "Business Automation"],
      foundedYear: 2018,
      employeeCount: "10-50",
      pricingModel: "Project-based",
      isVerified: false,
      sourceName: "Manual Review",
      sourceUrl: null,
      lastReviewedAt: new Date("2026-03-01"),
      logoUrl: null,
    },
    {
      name: "Studio Kode Kreatif Sidoarjo",
      slug: "studio-kode-kreatif-sidoarjo",
      province: "Jawa Timur",
      city: "Sidoarjo",
      address: "Ruko Taman Pinang Indah Blok C No. 8, Sidoarjo 61214",
      description:
        "Studio teknologi kreatif di Sidoarjo yang menggabungkan desain estetik dengan engineering yang solid. Mengkhususkan diri dalam membangun produk digital yang user-friendly, berdampak, dan berskala.",
      website: "https://studiokode.id",
      email: "halo@studiokode.id",
      phone: "+62318765432",
      linkedinUrl: "https://linkedin.com/company/studio-kode-kreatif",
      instagramUrl: "https://instagram.com/studiokodesda",
      services: ["UI/UX Design", "Frontend Development", "Branding", "Design System"],
      foundedYear: 2020,
      employeeCount: "1-10",
      pricingModel: "Project-based",
      isVerified: true,
      sourceName: "Dribbble",
      sourceUrl: "https://dribbble.com/studiokode",
      lastReviewedAt: new Date("2026-01-28"),
      logoUrl: null,
    },
    {
      name: "PT Data Nusantara Mojokerto",
      slug: "pt-data-nusantara-mojokerto",
      province: "Jawa Timur",
      city: "Mojokerto",
      address: "Jl. Bhayangkara No. 34, Mojokerto 61321",
      description:
        "Pelopor layanan data analytics dan kecerdasan buatan di Mojokerto. Membantu perusahaan mengubah data mentah menjadi insight bisnis yang actionable untuk pengambilan keputusan yang lebih cepat dan akurat.",
      website: "https://datanusantara.id",
      email: "data@datanusantara.id",
      phone: "+62321567890",
      linkedinUrl: "https://linkedin.com/company/data-nusantara",
      instagramUrl: null,
      services: ["Data Analytics", "Machine Learning", "Business Intelligence", "Data Engineering"],
      foundedYear: 2019,
      employeeCount: "10-50",
      pricingModel: "Retainer",
      isVerified: true,
      sourceName: "Clutch.co",
      sourceUrl: "https://clutch.co/profile/data-nusantara",
      lastReviewedAt: new Date("2026-02-20"),
      logoUrl: null,
    },

    // ── DKI JAKARTA ─────────────────────────────────────────
    {
      name: "PT Artha Teknologi Jakarta",
      slug: "pt-artha-teknologi-jakarta",
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      address: "Gedung Setiabudi One Lt. 7, Jl. HR Rasuna Said, Jakarta 12910",
      description:
        "Konsultan teknologi enterprise di Jakarta yang melayani klien Fortune 500 dan BUMN. Spesialis dalam transformasi digital skala besar, cloud migration, dan implementasi sistem keamanan siber tingkat enterprise.",
      website: "https://arthatek.co.id",
      email: "enterprise@arthatek.co.id",
      phone: "+62215678901",
      linkedinUrl: "https://linkedin.com/company/artha-teknologi",
      instagramUrl: "https://instagram.com/arthatekjkt",
      services: ["Enterprise Consulting", "Cloud Migration", "Cybersecurity", "System Integration"],
      foundedYear: 2010,
      employeeCount: "100-500",
      pricingModel: "Retainer",
      isVerified: true,
      sourceName: "Clutch.co",
      sourceUrl: "https://clutch.co/profile/artha-teknologi",
      lastReviewedAt: new Date("2026-03-10"),
      logoUrl: null,
    },
    {
      name: "Kreasi Digital Indonesia",
      slug: "kreasi-digital-indonesia",
      province: "DKI Jakarta",
      city: "Jakarta Pusat",
      address: "Jl. Kebon Sirih No. 63, Jakarta Pusat 10340",
      description:
        "Agency digital full-service di Jakarta Pusat yang mengerjakan proyek dari startup tahap awal hingga korporasi besar. Menggabungkan kreativitas dan teknologi untuk menghasilkan produk digital yang kompetitif di pasar global.",
      website: "https://kreasidi.com",
      email: "project@kreasidi.com",
      phone: "+62213456789",
      linkedinUrl: "https://linkedin.com/company/kreasi-digital-indonesia",
      instagramUrl: "https://instagram.com/kreasidigintal",
      services: ["Product Development", "UI/UX Design", "Digital Marketing Tech", "MVP Development"],
      foundedYear: 2017,
      employeeCount: "50-100",
      pricingModel: "Project-based",
      isVerified: true,
      sourceName: "GoodFirms",
      sourceUrl: "https://goodfirms.co/company/kreasi-digital",
      lastReviewedAt: new Date("2026-01-05"),
      logoUrl: null,
    },

    // ── JAWA BARAT ───────────────────────────────────────────
    {
      name: "PT Bandung Tech Solutions",
      slug: "pt-bandung-tech-solutions",
      province: "Jawa Barat",
      city: "Bandung",
      address: "Jl. Dago No. 88, Bandung 40135",
      description:
        "Software house terkemuka di Bandung dengan fokus pada pengembangan aplikasi mobile dan SaaS. Didukung oleh talenta muda dari ITB dan Unpad, menghasilkan produk teknologi berkualitas tinggi untuk pasar domestik dan internasional.",
      website: "https://bandungtech.id",
      email: "dev@bandungtech.id",
      phone: "+62222345678",
      linkedinUrl: "https://linkedin.com/company/bandung-tech-solutions",
      instagramUrl: "https://instagram.com/bandungtechid",
      services: ["Mobile App Development", "SaaS Development", "Backend Engineering", "API Integration"],
      foundedYear: 2015,
      employeeCount: "50-100",
      pricingModel: "Project-based",
      isVerified: true,
      sourceName: "Clutch.co",
      sourceUrl: "https://clutch.co/profile/bandung-tech",
      lastReviewedAt: new Date("2026-02-14"),
      logoUrl: null,
    },

    // ── BALI ────────────────────────────────────────────────
    {
      name: "Bali Digital Agency",
      slug: "bali-digital-agency",
      province: "Bali",
      city: "Denpasar",
      address: "Jl. Teuku Umar No. 120, Denpasar 80114",
      description:
        "Agency teknologi berbasis di Bali yang melayani klien internasional, khususnya dari Australia, Eropa, dan Amerika. Spesialis dalam web development, e-commerce, dan solusi digital untuk industri pariwisata dan hospitality.",
      website: "https://balidigital.agency",
      email: "hello@balidigital.agency",
      phone: "+62361890123",
      linkedinUrl: "https://linkedin.com/company/bali-digital-agency",
      instagramUrl: "https://instagram.com/balidigitalagency",
      services: ["Web Development", "E-commerce", "Tourism Tech", "International SEO"],
      foundedYear: 2014,
      employeeCount: "10-50",
      pricingModel: "Project-based",
      isVerified: true,
      sourceName: "Clutch.co",
      sourceUrl: "https://clutch.co/profile/bali-digital-agency",
      lastReviewedAt: new Date("2026-03-05"),
      logoUrl: null,
    },

    // ── SULAWESI SELATAN ─────────────────────────────────────
    {
      name: "PT Makassar IT Hub",
      slug: "pt-makassar-it-hub",
      province: "Sulawesi Selatan",
      city: "Makassar",
      address: "Jl. AP Pettarani No. 45, Makassar 90222",
      description:
        "Pionir ekosistem teknologi di Makassar dan Indonesia Timur. Menyediakan layanan pengembangan software, pelatihan IT, dan co-working space untuk startup teknologi. Berkomitmen membangun talenta digital di luar Pulau Jawa.",
      website: "https://makassarithub.com",
      email: "info@makassarithub.com",
      phone: "+62411567234",
      linkedinUrl: "https://linkedin.com/company/makassar-it-hub",
      instagramUrl: "https://instagram.com/makassarithub",
      services: ["Software Development", "IT Training", "Startup Incubation", "Tech Consulting"],
      foundedYear: 2018,
      employeeCount: "10-50",
      pricingModel: "Mixed",
      isVerified: false,
      sourceName: "Manual Review",
      sourceUrl: null,
      lastReviewedAt: new Date("2026-02-28"),
      logoUrl: null,
    },
  ];

  for (const company of companies) {
    const data = {
      ...company,
      services: company.services,
    } as unknown as Prisma.CompanyCreateInput;

    const created = await prisma.company.create({
      data,
    });
    console.log(`✅ Created: ${created.name} (${created.city})`);
  }
  console.log(`\n🎉 Enterprise seed completed! ${companies.length} companies inserted.`);


  console.log("Seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
