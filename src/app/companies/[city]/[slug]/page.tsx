// src/app/companies/[city]/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import LocalBusinessJsonLd from "@/components/seo/JsonLd";
import type { Prisma } from "@/generated/prisma/client";
import {
    MapPin, ArrowLeft, Building2, CheckCircle2,
    CalendarDays, Users, BadgeDollarSign,
    Globe, Mail, Phone, Share2, ExternalLink,
} from "lucide-react";

export const revalidate = 86400;

interface Props {
    params: { city: string; slug: string };
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
    const companies = await prisma.company.findMany({
        select: { city: true, slug: true },
    });
    return companies.map((c) => ({
        city: cityToSlug(c.city),
        slug: c.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const company = await prisma.company.findUnique({ where: { slug: params.slug } });
    if (!company) return {};
    const cityName = slugToCity(params.city);
    const services = getServices(company.services);
    return {
        title: `${company.name} — Perusahaan IT di ${cityName} | OmniTenant`,
        description: `${company.description.slice(0, 155)}...`,
        keywords: [company.name, `perusahaan IT ${cityName}`, `software house ${cityName}`, ...services],
        openGraph: {
            title: `${company.name} | OmniTenant`,
            description: company.description.slice(0, 155),
            type: "website",
            locale: "id_ID",
            siteName: "OmniTenant",
        },
        alternates: { canonical: `/companies/${params.city}/${params.slug}` },
    };
}

export default async function CompanyDetailPage({ params }: Props) {
    const { slug } = params;
    const cityName = slugToCity(params.city);

    const company = await prisma.company.findUnique({ where: { slug } });

    if (!company || cityToSlug(company.city) !== params.city) notFound();

    const services = getServices(company.services);

    return (
        <>
            <LocalBusinessJsonLd
                name={company.name}
                description={company.description}
                city={params.city}
                province={company.province}
                slug={company.slug}
                services={services}
            />
            <div className="min-h-screen bg-slate-50">
                <div className="bg-dark-900 text-white py-12 border-b border-dark-700">
                    <div className="container-main">
                        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                            <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
                            <span>/</span>
                            <Link href={`/companies/${cityToSlug(company.city)}`} className="hover:text-brand-400 transition-colors">
                                {cityName}
                            </Link>
                            <span>/</span>
                            <span className="text-slate-300 truncate max-w-[200px]">{company.name}</span>
                        </nav>

                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-brand-500/20 border border-brand-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-8 h-8 text-brand-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    {company.isVerified && (
                                        <span className="inline-flex items-center gap-1 text-xs bg-brand-500/20 text-brand-400 border border-brand-500/30 px-2.5 py-0.5 rounded-full font-medium">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Verified
                                        </span>
                                    )}
                                    {company.pricingModel && (
                                        <span className="inline-flex items-center gap-1 text-xs bg-accent-500/20 text-accent-400 border border-accent-500/30 px-2.5 py-0.5 rounded-full font-medium">
                                            <BadgeDollarSign className="w-3 h-3" />
                                            {company.pricingModel}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{company.name}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-brand-400" />
                                        {cityName}, {company.province}
                                    </span>
                                    {company.foundedYear && (
                                        <span className="flex items-center gap-1.5">
                                            <CalendarDays className="w-4 h-4 text-brand-400" />
                                            Est. {company.foundedYear}
                                        </span>
                                    )}
                                    {company.employeeCount && (
                                        <span className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4 text-brand-400" />
                                            {company.employeeCount} karyawan
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-main py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="card p-6">
                                <h2 className="font-bold text-dark-900 text-base mb-3 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-brand-500 rounded-full" />
                                    Tentang Perusahaan
                                </h2>
                                <p className="text-slate-600 leading-relaxed text-sm">{company.description}</p>
                                {company.address && (
                                    <p className="text-slate-400 text-xs mt-4 flex items-start gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-brand-400" />
                                        {company.address}
                                    </p>
                                )}
                            </div>

                            <div className="card p-6">
                                <h2 className="font-bold text-dark-900 text-base mb-4 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-accent-500 rounded-full" />
                                    Layanan yang Ditawarkan
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {services.map((service) => (
                                        <span key={service} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="card p-5">
                                <h3 className="font-bold text-dark-900 text-sm mb-4 uppercase tracking-wider">
                                    Kontak &amp; Informasi
                                </h3>
                                <ul className="space-y-3">
                                    {company.website && (
                                        <li>
                                            <a href={company.website} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-brand-600 transition-colors group">
                                                <Globe className="w-4 h-4 text-brand-400 flex-shrink-0" />
                                                <span className="truncate">{company.website.replace("https://", "")}</span>
                                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                                            </a>
                                        </li>
                                    )}
                                    {company.email && (
                                        <li>
                                            <a href={`mailto:${company.email}`}
                                                className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-brand-600 transition-colors">
                                                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                                                <span className="truncate">{company.email}</span>
                                            </a>
                                        </li>
                                    )}
                                    {company.phone && (
                                        <li>
                                            <a href={`tel:${company.phone}`}
                                                className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-brand-600 transition-colors">
                                                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                                                {company.phone}
                                            </a>
                                        </li>
                                    )}
                                </ul>

                                {(company.linkedinUrl || company.instagramUrl) && (
                                    <div className="border-t border-slate-100 mt-4 pt-4 flex gap-3">
                                        {company.linkedinUrl && (
                                            <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors">
                                                <Share2 className="w-4 h-4" />
                                                LinkedIn
                                            </a>
                                        )}
                                        {company.instagramUrl && (
                                            <a href={company.instagramUrl} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors">
                                                <Share2 className="w-4 h-4" />
                                                Instagram
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>

                            {company.sourceName && (
                                <div className="card p-4 bg-slate-50">
                                    <p className="text-xs text-slate-400">
                                        Data diverifikasi dari{" "}
                                        {company.sourceUrl ? (
                                            <a href={company.sourceUrl} target="_blank" rel="noopener noreferrer"
                                                className="text-brand-500 hover:underline">
                                                {company.sourceName}
                                            </a>
                                        ) : (
                                            <span className="text-slate-500">{company.sourceName}</span>
                                        )}
                                        {company.lastReviewedAt && (
                                            <span>
                                                {" "}&middot; Terakhir ditinjau{" "}
                                                {new Date(company.lastReviewedAt).toLocaleDateString("id-ID", {
                                                    year: "numeric", month: "long",
                                                })}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}

                            <Link href={`/companies/${cityToSlug(company.city)}`}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-500 transition-colors group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                Lihat semua perusahaan di {cityName}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}