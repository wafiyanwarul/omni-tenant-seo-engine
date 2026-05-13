// src/app/companies/[city]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MapPin, ArrowLeft, Building2, ChevronRight } from "lucide-react";

// ISR: revalidate every 24 hours
export const revalidate = 86400;

// Pre-build all city pages at deploy time
export async function generateStaticParams() {
    const cities = await prisma.company.findMany({
        select: { city: true },
        distinct: ["city"],
    });
    return cities.map((c) => ({ city: c.city }));
}

interface Props {
    params: { city: string };
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default async function CityPage({ params }: Props) {
    const { city } = params;

    const companies = await prisma.company.findMany({
        where: { city: city.toLowerCase() },
        orderBy: { name: "asc" },
    });

    if (companies.length === 0) notFound();

    const cityName = capitalize(city);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-dark-900 text-white py-12 border-b border-dark-700">
                <div className="container-main">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-brand-400 text-sm mb-6 transition-colors"
                    >
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

            {/* Company List */}
            <div className="container-main py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {companies.map((company) => {
                        const services: string[] = JSON.parse(company.services);
                        return (
                            <Link
                                key={company.id}
                                href={`/companies/${city}/${company.slug}`}
                                className="group card p-6 hover:border-brand-400 hover:-translate-y-0.5"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-11 h-11 bg-dark-800 border border-dark-700 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-5 h-5 text-brand-400" />
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-400 group-hover:translate-x-0.5 transition-all" />
                                </div>

                                <h2 className="font-bold text-dark-900 text-base mb-2 group-hover:text-brand-600 transition-colors">
                                    {company.name}
                                </h2>
                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
                                    {company.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {services.slice(0, 3).map((service) => (
                                        <span key={service} className="badge">
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}