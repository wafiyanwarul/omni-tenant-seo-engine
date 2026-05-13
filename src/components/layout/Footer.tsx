// src/components/layout/Footer.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Zap, MapPin, GitBranch, Globe } from "lucide-react";

export const revalidate = 86400;

export default async function Footer() {
  const cities = await prisma.company.findMany({
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });

  return (
    <footer className="bg-dark-900 text-slate-400 mt-auto border-t border-dark-700">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-white font-bold text-lg mb-3 group"
            >
              <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-400 transition-colors">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              Omni<span className="text-brand-400">Tenant</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Direktori perusahaan IT terpercaya di Indonesia. Temukan mitra
              teknologi terbaik untuk bisnis Anda.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://github.com/wafiyanwarul/omni-tenant-seo-engine"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-brand-400 transition-colors"
              >
                <GitBranch className="w-5 h-5" />
              </a>
              <a
                href="/"
                className="text-slate-500 hover:text-brand-400 transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-brand-500" />
              Kota Tersedia
            </h3>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city.city}>
                  <Link
                    href={`/companies/${city.city.toLowerCase()}`}
                    className="text-sm text-slate-500 hover:text-brand-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {city.city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-500 hover:text-brand-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-500 hover:text-brand-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <span>
            &copy; {new Date().getFullYear()} OmniTenant. Direktori IT
            Indonesia.
          </span>
          <span className="flex items-center gap-1">
            Built with <span className="text-brand-500">Next.js 14</span>
            &middot; Deployed on <span className="text-accent-500">Vercel</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
