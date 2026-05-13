// src/app/companies/[city]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import {
  MapPin, ArrowLeft, Building2, ChevronRight,
  CheckCircle2, Users, BadgeDollarSign,
} from "lucide-react";

export const revalidate = 86400;

interface Props {
  params: { city: string };
}

// "Jakarta Selatan" → "jakarta-selatan"
function cityToSlug(city: string): string {
  return city.toLowerCase().replace(/\s+/g, "-");
}

// "jakarta-selatan" → "Jakarta Selatan"
function slugToCity(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getServices(value: Prisma.JsonValue): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch { return []; }
  }
  return [];
}

export async function generateStaticParams() {
  const cities = await prisma.company.findMany({
    select: { city: true },
    distinct: ["city"],
  });
  return cities.map((c) => ({ city: cityToSlug(c.city) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cityName = slugToCity(params.city);
  const count = await prisma.company.count({
    where: { city: { equals: cityName, mode: "insensitive" } },
  });
  return {
    title: `${count} Perusahaan IT di ${cityName} | OmniTenant`,
    description: `Temukan ${count} perusahaan IT terbaik di ${cityName}. Daftar lengkap software house, vendor teknologi, dan konsultan IT di ${cityName}.`,
    openGraph: {
      title: `Perusahaan IT di ${cityName} — OmniTenant`,
      description: `Direktori ${count} perusahaan IT di ${cityName}.`,
      type: "website",
      locale: "id_ID",
    },
    alternates: { canonical: `/companies/${params.city}` },
  };
}

export default async function CityPage({ params }: Props) {
  const cityName = slugToCity(params.city);

  const companies = await prisma.company.findMany({
    where: { city: { equals: cityName, mode: "insensitive" } },
    orderBy: [{ isVerified: "desc" }, { name: "asc" }],
  });

  if (companies.length === 0) notFound();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-dark-900 text-white py-12 border-b border-dark-700">
        <div className="container-main">
          <Link href="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-brand-400 text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-500/20 border border-brand-500/30 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider">Direktori IT</p>
              <h1 className="text-2xl font-bold text-white">
                Perusahaan IT di {cityName}
              </h1>
            </div>
          </div>
          <p className="text-slate-400 text-sm">
            Ditemukan{" "}
            <span className="text-brand-400 font-semibold">{companies.length} perusahaan</span>{" "}
            IT di {cityName}
          </p>
        </div>
      </div>

      <div className="container-main py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {companies.map((company) => {
            const services = getServices(company.services);
            return (
              <Link
                key={company.id}
                href={`/companies/${cityToSlug(company.city)}/${company.slug}`}
                className="group card p-6 hover:border-brand-400 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-dark-800 border border-dark-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      {company.isVerified && (
                        <span className="inline-flex items-center gap-1 text-xs text-brand-600 font-medium mb-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      <h2 className="font-bold text-dark-900 text-sm group-hover:text-brand-600 transition-colors leading-tight">
                        {company.name}
                      </h2>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>

                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
                  {company.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-slate-400">
                  {company.employeeCount && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {company.employeeCount} karyawan
                    </span>
                  )}
                  {company.pricingModel && (
                    <span className="flex items-center gap-1">
                      <BadgeDollarSign className="w-3 h-3" />
                      {company.pricingModel}
                    </span>
                  )}
                  {company.foundedYear && (
                    <span>Est. {company.foundedYear}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {services.slice(0, 3).map((service) => (
                    <span key={service} className="badge">{service}</span>
                  ))}
                  {services.length > 3 && (
                    <span className="badge bg-slate-100 text-slate-500 border-slate-200">
                      +{services.length - 3} lainnya
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}