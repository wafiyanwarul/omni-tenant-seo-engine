// src/app/companies/[city]/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import LocalBusinessJsonLd from "@/components/seo/JsonLd";

import {
    MapPin,
    ArrowLeft,
    Building2,
    CheckCircle2,
    CalendarDays,
} from "lucide-react";

// ISR: revalidate every 24 hours
export const revalidate = 86400;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const company = await prisma.company.findUnique({
        where: { slug: params.slug },
    });

    if (!company) return {};

    const cityName =
        params.city.charAt(0).toUpperCase() + params.city.slice(1);
    const services: string[] = JSON.parse(company.services);

    return {
        title: `${company.name} — Perusahaan IT di ${cityName} | OmniTenant`,
        description: `${company.description.slice(0, 155)}...`,
        keywords: [
            company.name,
            `perusahaan IT ${cityName}`,
            `software house ${cityName}`,
            ...services,
        ],
        openGraph: {
            title: `${company.name} | OmniTenant`,
            description: company.description.slice(0, 155),
            type: "website",
            locale: "id_ID",
            siteName: "OmniTenant",
        },
        alternates: {
            canonical: `/companies/${params.city}/${params.slug}`,
        },
    };
}

// Pre-build all company detail pages at deploy time
export async function generateStaticParams() {
    const companies = await prisma.company.findMany({
        select: { city: true, slug: true },
    });
    return companies.map((c) => ({ city: c.city, slug: c.slug }));
}

interface Props {
    params: { city: string; slug: string };
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default async function CompanyDetailPage({ params }: Props) {
    const { city, slug } = params;

    const company = await prisma.company.findUnique({
        where: { slug },
    });

    if (!company || company.city !== city.toLowerCase()) notFound();

    const services: string[] = JSON.parse(company.services);
    const cityName = capitalize(city);

    return (
        <>
            <LocalBusinessJsonLd
                name={company.name}
                description={company.description}
                city={city}
                slug={company.slug}
                services={services}
            />
            <div className="min-h-screen bg-slate-50">
                {/* Header */}
                <div className="bg-dark-900 text-white py-12 border-b border-dark-700">
                    <div className="container-main">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                            <Link href="/" className="hover:text-brand-400 transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            <Link
                                href={`/companies/${city}`}
                                className="hover:text-brand-400 transition-colors"
                            >
                                {cityName}
                            </Link>
                            <span>/</span>
                            <span className="text-slate-300 truncate max-w-[200px]">
                                {company.name}
                            </span>
                        </nav>

                        <div className="flex items-start gap-4">
                            {/* Company Logo Placeholder */}
                            <div className="w-16 h-16 bg-brand-500/20 border border-brand-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <Building2 className="w-8 h-8 text-brand-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex items-center gap-1 text-xs bg-brand-500/20 text-brand-400 border border-brand-500/30 px-2.5 py-0.5 rounded-full font-medium">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Verified
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    {company.name}
                                </h1>
                                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                    <MapPin className="w-4 h-4 text-brand-400" />
                                    {cityName}, Jawa Timur, Indonesia
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container-main py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About */}
                            <div className="card p-6">
                                <h2 className="font-bold text-dark-900 text-base mb-3 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-brand-500 rounded-full" />
                                    Tentang Perusahaan
                                </h2>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {company.description}
                                </p>
                            </div>

                            {/* Services */}
                            <div className="card p-6">
                                <h2 className="font-bold text-dark-900 text-base mb-4 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-accent-500 rounded-full" />
                                    Layanan yang Ditawarkan
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {services.map((service) => (
                                        <span
                                            key={service}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-5">
                            {/* Info Card */}
                            <div className="card p-5">
                                <h3 className="font-bold text-dark-900 text-sm mb-4 uppercase tracking-wider">
                                    Informasi Perusahaan
                                </h3>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-slate-400 text-xs">Lokasi</p>
                                            <p className="text-dark-900 font-medium">{cityName}, Jawa Timur</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CalendarDays className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-slate-400 text-xs">Terdaftar Sejak</p>
                                            <p className="text-dark-900 font-medium">
                                                {new Date(company.createdAt).toLocaleDateString("id-ID", {
                                                    year: "numeric",
                                                    month: "long",
                                                })}
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            {/* Back Button */}
                            <Link
                                href={`/companies/${city}`}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-500 transition-colors group"
                            >
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