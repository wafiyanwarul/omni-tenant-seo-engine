// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/companies", label: "Directory" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-dark-900/95 border-b border-dark-700 sticky top-0 z-50 backdrop-blur">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-white text-lg group"
          >
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-400 transition-colors">
              <Zap className="w-4 h-4 text-white" />
            </div>
            Omni<span className="text-brand-400">Tenant</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-brand-400 font-medium transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/companies"
              className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-400 transition-colors"
            >
              Cari Perusahaan IT
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-dark-800 hover:text-white transition-colors"
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-dark-700 bg-dark-900">
          <div className="container-main py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-brand-400 font-medium py-2 text-sm"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/companies"
              className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center mt-2 hover:bg-brand-400 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Cari Perusahaan IT
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
