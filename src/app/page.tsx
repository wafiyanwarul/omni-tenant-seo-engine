// src/app/page.tsx
import Link from "next/link";
import { Search, MapPin, ArrowRight, Building2, Code2, Shield } from "lucide-react";

const featuredCities = [
  { name: "Surabaya", count: 1, href: "/companies/surabaya" },
  { name: "Malang", count: 1, href: "/companies/malang" },
  { name: "Jember", count: 1, href: "/companies/jember" },
  { name: "Sidoarjo", count: 1, href: "/companies/sidoarjo" },
  { name: "Mojokerto", count: 1, href: "/companies/mojokerto" },
];

const features = [
  {
    icon: Building2,
    title: "Verified IT Companies",
    desc: "Data perusahaan IT yang terverifikasi dari seluruh Indonesia.",
  },
  {
    icon: Code2,
    title: "Filter by Services",
    desc: "Temukan vendor berdasarkan layanan spesifik yang kamu butuhkan.",
  },
  {
    icon: Shield,
    title: "Trusted Directory",
    desc: "Direktori terpercaya untuk keputusan bisnis yang lebih baik.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-dark-900 text-white py-24 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #14b8a6 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="container-main text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-dark-800 border border-dark-700 text-brand-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-pulse" />
            Direktori IT Indonesia
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight tracking-tight">
            Temukan Perusahaan IT<br />
            <span className="text-brand-400">Terbaik di Indonesia</span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Direktori lengkap vendor teknologi, software house, dan konsultan IT
            dari berbagai kota di Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/companies" className="btn-primary text-base px-6 py-3">
              <Search className="w-4 h-4" />
              Jelajahi Direktori
            </Link>
            <Link href="#cities" className="inline-flex items-center gap-2 border border-dark-600 text-slate-300 px-6 py-3 rounded-lg font-semibold hover:border-brand-500 hover:text-brand-400 transition-all duration-200 text-base">
              Lihat Kota
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-dark-800 border-b border-dark-700 py-8">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section id="cities" className="py-20 bg-slate-50">
        <div className="container-main">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-dark-900 flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-brand-500" />
              Jelajahi Berdasarkan Kota
            </h2>
            <p className="text-slate-500 text-sm">Pilih kota untuk melihat daftar perusahaan IT di daerah tersebut.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {featuredCities.map((city) => (
              <Link
                key={city.href}
                href={city.href}
                className="group card p-5 text-center hover:border-brand-400 hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 bg-brand-50 border border-brand-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-500 group-hover:border-brand-500 transition-all duration-200">
                  <MapPin className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors" />
                </div>
                <p className="font-semibold text-dark-900 group-hover:text-brand-600 text-sm transition-colors">
                  {city.name}
                </p>
                <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                  {city.count} perusahaan
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}