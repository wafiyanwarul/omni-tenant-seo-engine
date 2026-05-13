// src/components/seo/JsonLd.tsx
// Renders JSON-LD structured data as a <script> tag in the page <head>

interface LocalBusinessJsonLdProps {
    name: string;
    description: string;
    city: string;
    province: string;
    slug: string;
    services: string[];
}

export default function LocalBusinessJsonLd({
    name,
    description,
    city,
    province,
    slug,
    services,
}: LocalBusinessJsonLdProps) {
    const cityCapitalized = city
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: name,
        description: description,
        url: `https://omni-tenant.vercel.app/companies/${city}/${slug}`,
        address: {
            "@type": "PostalAddress",
            addressLocality: cityCapitalized,
            addressRegion: province,
            addressCountry: "ID",
        },
        areaServed: {
            "@type": "City",
            name: cityCapitalized,
        },
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "IT Services",
            itemListElement: services.map((service) => ({
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: service,
                },
            })),
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
