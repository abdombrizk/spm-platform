import { useState } from "react";
import { ArrowUpRight, Boxes, CheckCircle2, ChevronRight, FileText, Layers, Mail, Search, ShieldCheck, Wrench } from "lucide-react";
import { Link } from "wouter";
import SiteChrome from "@/components/SiteChrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

const brandLogoOverrides: Record<string, string> = {
  "ge-healthcare": "/manus-storage/ge-healthcare_3e6edf7f.png",
  "siemens-healthineers": "/manus-storage/siemens-healthineers_d3ea3a9a.png",
  "ziehm-imaging": "/manus-storage/ziehm-imaging_a271bcb6.png",
  "philips-healthcare": "/manus-storage/philips-healthcare_8bdab1dd.png",
  genoray: "/manus-storage/genoray_c6662250.png",
};

const fallbackManufacturerBrands = [
  { id: 1001, slug: "ge-healthcare", name: "GE Healthcare", logoUrl: brandLogoOverrides["ge-healthcare"], isVisible: true },
  { id: 1002, slug: "siemens-healthineers", name: "Siemens Healthineers", logoUrl: brandLogoOverrides["siemens-healthineers"], isVisible: true },
  { id: 1003, slug: "ziehm-imaging", name: "Ziehm Imaging", logoUrl: brandLogoOverrides["ziehm-imaging"], isVisible: true },
  { id: 1004, slug: "philips-healthcare", name: "Philips Healthcare", logoUrl: brandLogoOverrides["philips-healthcare"], isVisible: true },
  { id: 1005, slug: "genoray", name: "Genoray", logoUrl: brandLogoOverrides.genoray, isVisible: true },
];

export default function SparePartsPage() {
  const brandsQuery = trpc.parts.brands.useQuery();
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>("ge-healthcare");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const brands = brandsQuery.data ?? [];
  const currentBrand = brands.find(b => b.slug === selectedBrandSlug) || brands[0];
  const marqueeBrands = Array.from(new Map(
    [...brands, ...fallbackManufacturerBrands].map(brand => [brand.slug, brand]),
  ).values()).filter(brand => brand.isVisible !== false);

  const brandId = currentBrand?.id;
  const partsQuery = trpc.parts.listParts.useQuery({ brandId }, { enabled: Boolean(brandId) });
  const parts = partsQuery.data ?? [];

  const filteredParts = parts.filter(part => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      part.name.toLowerCase().includes(q) ||
      (part.partNumber && part.partNumber.toLowerCase().includes(q)) ||
      (part.equipmentCategory && part.equipmentCategory.toLowerCase().includes(q))
    );
  });

  return (
    <SiteChrome>
      <main>
        {/* Hero Section */}
        <section className="border-b border-[#dce7eb] bg-gradient-to-b from-[#eaf4fa] to-white py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0f6fae]">
                <Boxes className="h-3.5 w-3.5" /> Authentic Parts & Engineering Sourcing
              </div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#0a4052] sm:text-5xl">
                Medical Imaging Spare Parts & Replacement Modules
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-[#475569]">
                SPM sources, tests, and delivers genuine replacement parts for leading global medical imaging manufacturers. Every part request is reviewed by biomedical engineering specialists with serial verification and warranty protection.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="h-12 bg-[#f36b21] px-6 text-sm font-bold text-white shadow-md hover:bg-[#d95316]" asChild><Link href="/request-a-quote?type=spare_part">
                    Request a Spare Part Quote <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link></Button>
                <Button variant="outline" className="h-12 border-[#0a4052] px-6 text-sm font-bold text-[#0a4052] hover:bg-[#f0f7fb]" asChild><Link href="/request-service">
                    Emergency Maintenance Call <Wrench className="ml-2 h-4 w-4" />
                  </Link></Button>
              </div>
            </div>
          </div>
        </section>

        {/* Manufacturer spotlight moved from Home */}
        <section className="border-b border-[#dce7eb] bg-white py-12" aria-label="Verified spare part manufacturers">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]"><ShieldCheck className="h-3.5 w-3.5 text-[#0f6fae]" /> Verified manufacturer network</div>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0a4052] sm:text-3xl">Genuine parts across leading imaging platforms.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#617180]">Choose a manufacturer to filter the live parts catalog, or ask SPM to source an unlisted component with the equipment context and serial evidence.</p>
              </div>
              <Link href="/request-a-quote?type=spare_part" className="inline-flex shrink-0 items-center text-sm font-bold text-[#c2410c] hover:underline">Request custom sourcing <ArrowUpRight className="ml-1.5 h-4 w-4" /></Link>
            </div>
            <div className="brand-marquee mt-8 overflow-hidden rounded-3xl border border-[#dce7eb] bg-[#fafcfd] py-5">
              <div className="brand-marquee-track flex w-max items-center gap-4 px-4">
                {[...marqueeBrands, ...marqueeBrands].map((brand, index) => {
                  const logo = brand.logoUrl || brandLogoOverrides[brand.slug];
                  return <Link key={`${brand.id}-${index}`} href={brand.slug === "genoray" ? "/spare-parts" : `/spare-parts?brand=${encodeURIComponent(brand.slug)}`} aria-hidden={index >= marqueeBrands.length ? true : undefined} tabIndex={index >= marqueeBrands.length ? -1 : undefined} className="group flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl border border-[#e2e8f0] bg-white px-5 text-center shadow-xs transition hover:border-[#0a4052] hover:shadow-md">
                    {logo ? <img src={logo} alt={`${brand.name} logo`} loading="lazy" decoding="async" className="max-h-12 max-w-full object-contain transition duration-300 group-hover:scale-105" /> : <span className="text-lg font-bold tracking-tight text-[#64748b] transition-colors group-hover:text-[#0a4052]">{brand.name}</span>}
                  </Link>;
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Brand Tabs & Catalog */}
        <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#0a4052]">Browse by Manufacturer</h2>
              <p className="text-sm text-[#64748b]">Select a manufacturer to view available replacement modules and technical parts.</p>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <Input
                type="search"
                placeholder="Search part name, part # or modality..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-11 rounded-xl border-[#dce7eb] pl-10 text-sm focus-visible:ring-[#0f6fae]"
              />
            </div>
          </div>

          {/* Brand Tabs */}
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {brands.map(brand => {
              const active = brand.slug === (currentBrand?.slug ?? "");
              return (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrandSlug(brand.slug)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold transition-all ${
                    active
                      ? "border-[#0f6fae] bg-[#0f6fae] text-white shadow-md"
                      : "border-[#dce7eb] bg-white text-[#334155] hover:border-[#bcdde2] hover:bg-[#f8fafc]"
                  }`}
                >
                  <span>{brand.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Brand Intro Banner */}
          {currentBrand ? (
            <div className="mt-6 rounded-2xl border border-[#dce7eb] bg-[#f8fafc] p-6 lg:p-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-extrabold text-[#0a4052]">{currentBrand.name} Parts Division</h3>
                    {currentBrand.authorizedAgentLabel ? (
                      <Badge className="bg-[#0a4052] text-xs font-semibold text-white">
                        {currentBrand.authorizedAgentLabel}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#475569]">
                    {currentBrand.introduction || "Authentic parts supplied with traceable manufacturing source and tested prior to deployment."}
                  </p>
                </div>
                <Button className="shrink-0 bg-[#0a4052] text-xs font-bold text-white hover:bg-[#07303e]" asChild><Link href={`/request-a-quote?custom_notes=${encodeURIComponent(`Parts inquiry for ${currentBrand.name}`)}`}>
                    Inquire About Unlisted {currentBrand.name} Part
                  </Link></Button>
              </div>
            </div>
          ) : null}

          {/* Parts Grid */}
          <div className="mt-8">
            {partsQuery.isLoading ? (
              <div className="py-20 text-center text-sm font-semibold text-[#64748b]">Loading parts catalog...</div>
            ) : filteredParts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#dce7eb] p-12 text-center">
                <Boxes className="mx-auto h-12 w-12 text-[#94a3b8]" />
                <h4 className="mt-4 text-base font-bold text-[#0a4052]">No parts matching your search</h4>
                <p className="mt-2 text-sm text-[#64748b]">We source unlisted and hard-to-find components directly from approved suppliers.</p>
                <Button className="bg-[#f36b21] text-xs font-bold text-white hover:bg-[#d95316]" asChild><Link href="/request-a-quote?type=spare_part" className="mt-5 inline-block">
                    Submit Custom Part Sourcing Request
                  </Link></Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredParts.map(part => (
                  <Card key={part.id} className="overflow-hidden rounded-2xl border-[#dce7eb] transition hover:shadow-lg">
                    <div className="relative flex h-48 items-center justify-center bg-[#f1f5f9]">
                      {part.imageUrl ? (
                        <img src={part.imageUrl} alt={part.name} className="h-full w-full object-cover" />
                      ) : (
                        <Boxes className="h-16 w-16 text-[#94a3b8]" />
                      )}
                      <div className="absolute right-3 top-3">
                        <Badge
                          variant={part.availabilityStatus === "available" ? "default" : "secondary"}
                          className={part.availabilityStatus === "available" ? "bg-emerald-600 text-white" : ""}
                        >
                          {part.availabilityStatus === "available" ? "In Stock / Verified" : "Sourced On Request"}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#0f6fae]">
                        {part.equipmentCategory || "Imaging Component"}
                      </div>
                      <h4 className="mt-1 text-base font-bold leading-snug text-[#0a4052]">{part.name}</h4>
                      {part.partNumber ? (
                        <p className="mt-1 text-xs font-mono text-[#64748b]">PN: <span className="font-bold text-[#1e293b]">{part.partNumber}</span></p>
                      ) : null}
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[#64748b]">
                        {part.description || "Tested and verified authentic medical imaging replacement part with standard warranty support."}
                      </p>

                      <div className="mt-5 border-t border-[#f1f5f9] pt-4">
                        <Button className="w-full bg-[#f36b21] text-xs font-bold text-white hover:bg-[#d95316]" asChild><Link
                          href={`/request-a-quote?custom_notes=${encodeURIComponent(
                            `Spare Part Request: ${part.name} (Part Number: ${part.partNumber || "N/A"}) for ${currentBrand?.name || "Equipment"}`
                          )}`}
                          className="w-full"
                        >
                            Request Quote for this Part <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                          </Link></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Value Prop Banner */}
        <section className="bg-[#0a4052] py-16 text-white">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex gap-4">
                <ShieldCheck className="h-8 w-8 shrink-0 text-[#60c1bb]" />
                <div>
                  <h4 className="text-base font-bold">100% Traceable Components</h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Sourced from verified manufacturers and certified secondary supply partners with full serial compliance.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Wrench className="h-8 w-8 shrink-0 text-[#60c1bb]" />
                <div>
                  <h4 className="text-base font-bold">Installation & Calibration Available</h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Our field engineering team can install, calibrate, and safety-test parts directly at your hospital or clinic.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="h-8 w-8 shrink-0 text-[#60c1bb]" />
                <div>
                  <h4 className="text-base font-bold">Emergency Express Delivery</h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Fast-track delivery across Cairo, Giza, Alexandria, and all governorates in Egypt with regional MENA shipping.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
