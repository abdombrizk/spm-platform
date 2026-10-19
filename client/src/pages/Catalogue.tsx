import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  Layers,
  Loader2,
  PackageSearch,
  Search,
  ShieldCheck,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SiteChrome from "@/components/SiteChrome";
import SEOHead from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";
import type { Product as ShopifyProduct } from "@shared/commerce/types";
import { ITALRAY_CATALOG_REGISTRY } from "@shared/commerce/italrayMeta";

const availabilityLabels: Record<string, string> = {
  available: "Available for quotation",
  on_request: "Configured on request",
  coming_soon: "Coming soon",
  discontinued: "Discontinued",
};

const hermannCategoryChips = [
  "Laparoscopy",
  "Endoscopic Units",
  "Electrosurgery",
  "Arthroscopy",
  "Urology / Hysteroscopy",
  "Titanium Implant Systems",
  "Plastic Surgery",
  "General Surgery",
  "Tungsten Carbide Instruments",
];

const italrayCatalogueHeroImage = "/manus-storage/italray-portfolio-hero_858b8677.webp";
const spmMark = "/manus-storage/spm-mark-transparent-clean_35e8eb5b.png";

type ItalraySectionId = "all" | "mobile-c-arm" | "clinodigit" | "mobile-x-ray" | "mammography" | "stationary-dr" | "components";

const italraySections: Array<{ id: ItalraySectionId; label: string; shortLabel: string; description: string }> = [
  { id: "all", label: "All Italray systems", shortLabel: "ALL", description: "Browse the complete Italray imaging portfolio." },
  { id: "mobile-c-arm", label: "Mobile C-Arm systems", shortLabel: "C-ARM", description: "Mobile surgical C-Arms for fluoroscopy and intraoperative imaging." },
  { id: "clinodigit", label: "Clinodigit series", shortLabel: "CLINODIGIT", description: "Clinodigit surgical, radiography and radio-fluoroscopy systems." },
  { id: "mobile-x-ray", label: "Mobile X-Ray units", shortLabel: "MOBILE X-RAY", description: "Mobile digital radiography for bedside and departmental workflows." },
  { id: "mammography", label: "Digital mammography", shortLabel: "MAMMOGRAPHY", description: "Digital mammography and tomosynthesis platforms." },
  { id: "stationary-dr", label: "Stationary DR systems", shortLabel: "STATIONARY DR", description: "Fixed digital radiography rooms and integrated DR workflows." },
  { id: "components", label: "Systems & components", shortLabel: "COMPONENTS", description: "Workstations, bucky stands, tables, tube stands and detectors." },
];

const italraySectionByHandle: Record<string, Exclude<ItalraySectionId, "all">> = {
  "italray-carmex-fp21-fp30": "mobile-c-arm",
  "italray-clinodigit-c-arm": "clinodigit",
  "italray-clinodigit-flo-radio-fluoro": "clinodigit",
  "italray-clinodigit-omega-drf": "clinodigit",
  "italray-corsix-dr-mobile": "mobile-x-ray",
  "italray-xfm-mobile-dr": "mobile-x-ray",
  "italray-mammograph-ffdm-d-tomo": "mammography",
  "italray-x-frame-dr-systems": "stationary-dr",
};

function getItalraySection(item: CatalogueItem): Exclude<ItalraySectionId, "all"> | null {
  if (item.kind !== "shopify" || item.brand.toLowerCase() !== "italray") return null;
  const text = `${item.title} ${item.category} ${item.model}`.toLowerCase();
  return italraySectionByHandle[item.model]
    || (text.includes("mammograph") ? "mammography"
      : text.includes("x-frame") || text.includes("stationary") ? "stationary-dr"
      : text.includes("clinodigit") ? "clinodigit"
      : text.includes("c-arm") ? "mobile-c-arm"
      : text.includes("mobile") || text.includes("corsix") || text.includes("xfm") ? "mobile-x-ray"
      : null);
}

type CmsProduct = {
  id: number;
  slug: string;
  productType: string;
  data: Record<string, any>;
};

type CatalogueItem = {
  id: string;
  kind: "cms" | "shopify";
  href: string;
  title: string;
  brand: string;
  category: string;
  model: string;
  description: string;
  image?: string;
  status: string;
  statusTone: "green" | "amber" | "slate";
  specs: string[];
  badge: string;
  updated: boolean;
  cta: string;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function toCmsItem(item: CmsProduct): CatalogueItem {
  const data = item.data;
  const specs = data.technicalSpecifications || {};
  const status = data.availabilityStatus || "on_request";

  return {
    id: `cms-${item.id}`,
    kind: "cms",
    href: `/catalogue/${item.slug}`,
    title: data.name || item.slug,
    brand: data.brand || data.manufacturer || "SPM Portfolio",
    category: data.category || "Medical Imaging",
    model: data.modelNumber || data.code || "",
    description: data.shortDescription || data.fullDescription || "Technical specifications and clinical details available on request.",
    image: data.mainImage,
    status: availabilityLabels[status] || "Available on request",
    statusTone: status === "available" ? "green" : status === "discontinued" ? "slate" : "amber",
    specs: [specs.generatorPower, specs.detectorType, specs.tubeVoltage].filter(Boolean).slice(0, 3),
    badge: data.requestQuote ? "Project quotation" : "SPM catalogue",
    updated: false,
    cta: "View technical details",
  };
}

function toShopifyItem(product: ShopifyProduct): CatalogueItem {
  const isQuoteOnly = product.tags.includes("Quote Only");
  const brandedMeta = product.vendor === "Italray" ? ITALRAY_CATALOG_REGISTRY[product.handle] : undefined;
  return {
    id: `shopify-${product.id}`,
    kind: "shopify",
    href: `/store/products/${product.handle}`,
    title: brandedMeta?.title || product.title,
    brand: product.vendor || "SPM Storefront",
    category: brandedMeta?.badge.split("•")[0]?.trim() || product.productType || "Medical Equipment",
    model: product.handle,
    description: brandedMeta?.leadParagraph || product.description || "Configured medical imaging equipment supported by SPM engineering and manufacturer documentation.",
    image: brandedMeta?.heroImage || product.images[0]?.url,
    status: isQuoteOnly ? "Request a project quote" : product.variants[0]?.availableForSale ? "Ready for online checkout" : "Contact SPM team",
    statusTone: isQuoteOnly ? "amber" : product.variants[0]?.availableForSale ? "green" : "slate",
    specs: product.tags.filter(tag => tag !== "Quote Only").slice(0, 3),
    badge: brandedMeta?.brochureUrl?.startsWith("/manus-storage/") ? "Updated documentation" : isQuoteOnly ? "Configured system" : "Shopify storefront",
    updated: Boolean(brandedMeta?.brochureUrl?.startsWith("/manus-storage/")),
    cta: isQuoteOnly ? "Request a quote" : "View store details",
  };
}

export default function Catalogue() {
  const query = trpc.products.published.useQuery();
  const storeQuery = trpc.commerce.products.list.useQuery({ first: 50 });
  const [location] = useLocation();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const initialBrandParam = searchParams.get("brand") || "all";
  const initialCategoryParam = searchParams.get("category") || "all";
  const initialItalraySectionParam = searchParams.get("italraySection") || "all";
  const initialSortParam = searchParams.get("sort") || "relevance";
  const initialSearchParam = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategoryParam.toLowerCase());
  const [selectedBrand, setSelectedBrand] = useState(initialBrandParam.toLowerCase());
  const [selectedItalraySection, setSelectedItalraySection] = useState<ItalraySectionId>(initialItalraySectionParam as ItalraySectionId);
  const [searchTerm, setSearchTerm] = useState(initialSearchParam);
  const [selectedSort, setSelectedSort] = useState(initialSortParam);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const category = params.get("category");
    const italraySection = params.get("italraySection") as ItalraySectionId | null;
    const q = params.get("q");
    const sort = params.get("sort");
    setSelectedBrand(brand?.toLowerCase() || "all");
    setSelectedCategory(category?.toLowerCase() || "all");
    setSelectedItalraySection(italraySection && italraySections.some(section => section.id === italraySection) ? italraySection : "all");
    setSearchTerm(q || "");
    setSelectedSort(sort || "relevance");
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBrand !== "all") params.set("brand", selectedBrand);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedBrand === "italray" && selectedItalraySection !== "all") params.set("italraySection", selectedItalraySection);
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (selectedSort !== "relevance") params.set("sort", selectedSort);
    const next = params.toString() ? `/catalogue?${params.toString()}` : "/catalogue";
    if (typeof window !== "undefined" && window.location.pathname + window.location.search !== next) window.history.replaceState({}, "", next);
  }, [selectedBrand, selectedCategory, selectedItalraySection, searchTerm, selectedSort]);

  const cmsItems = useMemo(() => (query.data ?? []).map(item => toCmsItem(item as CmsProduct)), [query.data]);
  const shopifyItems = useMemo(() => (storeQuery.data ?? []).map(toShopifyItem), [storeQuery.data]);
  const allItems = useMemo(() => [...cmsItems, ...shopifyItems], [cmsItems, shopifyItems]);
  const isHermann = selectedBrand === "hermann";
  const isItalray = selectedBrand === "italray";

  const products = useMemo(() => {
    const search = normalize(searchTerm);
    const filtered = allItems.filter(item => {
      if (selectedCategory !== "all" && !normalize(item.category).includes(selectedCategory)) return false;
      if (selectedBrand !== "all" && (selectedBrand === "italray" ? normalize(item.brand) !== "italray" : !normalize(item.brand).includes(selectedBrand))) return false;
      if (isItalray && selectedItalraySection !== "all" && getItalraySection(item) !== selectedItalraySection) return false;
      if (!search) return true;
      return [item.title, item.brand, item.category, item.model, item.description, ...item.specs].some(value => normalize(value).includes(search));
    });
    return [...filtered].sort((a, b) => selectedSort === "title" ? a.title.localeCompare(b.title) : selectedSort === "brand" ? a.brand.localeCompare(b.brand) : a.title.localeCompare(b.title));
  }, [allItems, isItalray, searchTerm, selectedBrand, selectedCategory, selectedItalraySection, selectedSort]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedItalraySection("all");
    setSearchTerm("");
    setSelectedSort("relevance");
    if (typeof window !== "undefined" && window.history.replaceState) {
      window.history.replaceState({}, "", "/catalogue");
    }
  };

  const isLoading = query.isLoading || storeQuery.isLoading;

  return (
    <SiteChrome>
      <SEOHead
        title={isHermann ? "Hermann Medizintechnik Surgical Portfolio | SPM" : "Clinical Equipment & Imaging Catalogue"}
        description={isHermann ? "Explore Hermann Medizintechnik’s documented surgical, endoscopic and instrument portfolio through SPM’s quote-first catalogue and technical review workflow." : "Explore SPM's complete medical equipment portfolio, from mobile C-Arms and digital radiography to fluoroscopy, mammography and precision surgical technology."}
        url="/catalogue"
      />
      <main className="min-h-screen bg-[#f7fafc]">
        {/* Brand hero: the Italray filter uses the same reference composition as the dedicated partner portfolio. */}
        <section className={`relative isolate overflow-hidden bg-[#061f2b] text-white ${isItalray ? "min-h-[700px] lg:min-h-[760px]" : ""}`}>
          <div className={`absolute inset-0 bg-cover ${isItalray ? "bg-center opacity-100" : "bg-center opacity-45"}`} style={{ backgroundImage: `url('${isItalray ? italrayCatalogueHeroImage : isHermann ? "/manus-storage/hermann-gallery-engineering_bb728050.jpg" : "/manus-storage/italray-spm-partnership-hero_fe8e7422.jpg"}')` }} aria-hidden="true" />
          <div className={`absolute inset-0 ${isItalray ? "bg-[linear-gradient(90deg,#061f2b_0%,rgba(6,31,43,.98)_32%,rgba(6,31,43,.82)_46%,rgba(6,31,43,.25)_68%,rgba(6,31,43,.14)_100%)]" : "bg-[linear-gradient(90deg,rgba(6,31,43,.98)_0%,rgba(6,31,43,.88)_38%,rgba(6,31,43,.48)_72%,rgba(6,31,43,.36)_100%)]"}`} aria-hidden="true" />
          <div className={`absolute inset-0 ${isItalray ? "bg-[linear-gradient(180deg,rgba(6,31,43,.25)_0%,transparent_48%,rgba(6,31,43,.82)_100%)]" : "bg-[radial-gradient(circle_at_82%_10%,rgba(96,193,187,.24),transparent_28%),linear-gradient(115deg,rgba(6,31,43,.35)_0%,rgba(10,64,82,.12)_52%,rgba(15,111,174,.18)_100%)]"}`} aria-hidden="true" />
          {isItalray ? <div className="absolute inset-y-0 left-0 hidden w-[44%] [background-image:linear-gradient(rgba(139,224,213,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(139,224,213,.08)_1px,transparent_1px)] [background-size:52px_52px] lg:block" aria-hidden="true" /> : null}
          {!isItalray ? <><div className="absolute -right-24 -top-32 h-80 w-80 rounded-full border border-white/10 sm:h-[30rem] sm:w-[30rem]" aria-hidden="true" /><div className="absolute -right-8 top-10 h-56 w-56 rounded-full border border-white/10 sm:h-80 sm:w-80" aria-hidden="true" /></> : null}

          {isItalray ? (
            <>
            <div className="relative mx-auto flex min-h-[700px] max-w-[1440px] items-center px-5 pb-28 pt-14 sm:px-8 sm:pb-32 lg:min-h-[760px] lg:px-12 lg:pb-32 lg:pt-16">
              <div className="max-w-[650px]">
                <div className="inline-flex items-center gap-3 rounded-full border border-[#8be0d5]/40 bg-[#07252f]/85 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#b9f1e7] shadow-xl backdrop-blur-md sm:px-4 sm:text-xs"><span className="h-2 w-2 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,.7)]" /><img src="/manus-storage/italray-transparent-cropped_1f5d097e.png" alt="Italray official logo" className="h-6 w-[86px] object-contain object-left" /><span className="h-4 w-px bg-white/20" aria-hidden="true" /><span className="tracking-[.12em]">STRATEGIC PARTNERSHIP</span><span className="h-4 w-px bg-white/20" aria-hidden="true" /><span className="inline-flex items-center gap-1.5 text-white"><img src={spmMark} alt="SPM" className="h-4 w-4 object-contain brightness-0 invert" /><span className="font-extrabold tracking-wider">SPM</span></span></div>
                <h1 className="mt-6 max-w-2xl text-[clamp(2.75rem,5vw,4.5rem)] font-black leading-[.98] tracking-[-.05em] text-white">ITALRAY: Visionary Medical Imaging, <span className="text-[#8be0d5]">Engineered for Life.</span></h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">Discover the pinnacle of Italian X-ray innovation—from <strong className="text-white">high-definition mobile C-Arms</strong> to advanced digital radiography—exclusively supported, installed, and maintained across Egypt by SPM’s expert biomedical engineering team.</p>
                <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-semibold text-white/90"><span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#07252f]/70 px-4 py-2 backdrop-blur-md"><span className="text-sm">🇮🇹</span>Italian Design &amp; Innovation Since 1974</span><span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#07252f]/70 px-4 py-2 backdrop-blur-md"><Wrench className="h-3.5 w-3.5 text-[#8be0d5]" />24/7 SPM Engineering Support</span></div>
                <div className="mt-7 flex flex-wrap items-center gap-3.5"><Button size="lg" className="h-12 rounded-xl bg-[#f97316] px-7 text-sm font-bold text-white shadow-xl shadow-[#f97316]/30 hover:bg-[#ea580c]" asChild><a href="#catalogue-grid">Explore Systems <ArrowRight className="ml-2 h-4 w-4" /></a></Button><Button size="lg" variant="outline" className="h-12 rounded-xl border-white/40 bg-[#07252f]/60 px-6 text-sm font-bold text-white shadow-lg backdrop-blur-md hover:bg-white/15" asChild><Link href="/request-a-quote?brand=Italray">Request Tech Specs <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button></div>
              </div>
            </div>
            <div className="absolute bottom-24 right-5 hidden w-[230px] rounded-2xl border border-white/25 bg-[#062a35]/70 p-4 text-white shadow-2xl backdrop-blur-md lg:block xl:right-12">
              <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#8be0d5]">Italray systems</span><span className="h-2 w-2 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,.8)]" /></div>
              <p className="mt-3 text-lg font-extrabold leading-tight">Imaging built around the clinical workflow.</p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/15 pt-3 text-[10px] font-semibold text-white/65"><span>C-Arm</span><span>DR</span><span>DRF</span></div>
            </div>
            </>
          ) : (
            <div className="relative mx-auto flex max-w-[1280px] px-5 py-12 sm:py-16 lg:min-h-[560px] lg:items-center lg:px-8 lg:py-20"><div className="max-w-2xl lg:max-w-[760px]"><div className="mb-6 flex flex-wrap items-center gap-4"><div className="flex h-24 w-[240px] items-center justify-start px-0"><img src="/manus-storage/hermann-mark-cropped_40aa4cf3.png" alt="Hermann official logo" className="h-20 w-[220px] object-contain object-left drop-shadow-[0_4px_14px_rgba(0,0,0,.28)]" /></div><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#b9f1e7]">Official-source portfolio</p><p className="mt-1 text-sm font-semibold text-white/85">Hermann Medizintechnik portfolio</p></div></div><h1 className="max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-[-.045em] text-white sm:text-5xl lg:text-[62px]">German surgical technology, prepared for informed project decisions.</h1><p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">Explore Hermann’s documented surgical, endoscopic and instrument portfolio through SPM’s quote-first catalogue, technical review and lifecycle support.</p><div className="mt-7 flex flex-wrap items-center gap-3"><Button size="lg" className="h-12 rounded-xl bg-[#c2410c] px-6 text-sm font-bold text-white shadow-xl shadow-[#c2410c]/20 hover:bg-[#9a3412]" asChild><a href="#catalogue-grid">Explore Hermann systems <ArrowRight className="ml-2 h-4 w-4" /></a></Button><Button size="lg" variant="outline" className="h-12 rounded-xl border-white/40 bg-white/10 px-6 text-sm font-bold text-white hover:bg-white/20" asChild><Link href="/request-a-quote?brand=hermann">Request a project quote <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button></div><div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold text-white/75">{hermannCategoryChips.map(category => <span key={category} className="rounded-full border border-white/15 bg-white/10 px-3 py-2">{category}</span>)}</div><p className="mt-5 max-w-2xl text-xs leading-5 text-white/60">Public-source profile based on Hermann Medizintechnik’s published website and official documents. Product-level availability and configurations are confirmed during quotation review.</p></div></div>
          )}
          {isItalray ? <div className="absolute bottom-4 left-5 right-5 z-10 mx-auto flex max-w-[1360px] flex-col gap-3 text-xs font-semibold text-white/85 sm:bottom-5 sm:left-8 sm:right-8 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap items-center gap-x-6 gap-y-2 uppercase tracking-[.16em] text-white/70"><span>50+ YEARS OF X-RAY EXCELLENCE</span><span className="hidden h-3.5 w-px bg-white/25 sm:block" aria-hidden="true" /><span>FULL LIFECYCLE SUPPORT</span></div><div className="inline-flex w-fit items-center gap-2.5 rounded-2xl border border-white/25 bg-[#051c24]/80 px-4 py-2.5 text-sm shadow-xl backdrop-blur-md"><span className="text-white/75">AUTHORIZED PARTNER &amp; SERVICE PROVIDER:</span><strong className="text-base font-extrabold text-white">Italray</strong><span className="text-white/35">|</span><span className="text-white/80">Powered by SPM</span></div></div> : null}
        </section>

        {/* Compact search */}
        <section className={`relative z-20 mx-auto max-w-[640px] px-5 lg:px-8 ${isItalray ? "-mt-6" : "-mt-5"}`} aria-label="Catalogue search">
          <div className="rounded-full border border-[#dce7eb] bg-white p-2 shadow-lg shadow-[#0a4052]/10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0f6fae]" aria-hidden="true" />
              <input
                type="text"
                aria-label="Search the equipment catalogue"
                placeholder="Search systems, models or capabilities"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                className="h-10 w-full rounded-full border-0 bg-[#f7fafc] pl-11 pr-5 text-sm text-[#1e293b] placeholder-[#94a3b8] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0a4052]/10"
              />
            </div>
          </div>
        </section>

        {isItalray ? (
          <section className="relative z-10 border-b border-[#d8e2ed] bg-white px-5 pt-8 shadow-[0_8px_24px_rgba(30,55,85,.05)] lg:px-10" aria-label="Italray product sections">
            <div className="mx-auto max-w-[1280px]">
              <div className="flex items-end justify-between gap-5">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#0f6fae]">Italray portfolio</p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748b]">Select a system family to browse the available product cards. New products will be added here as their official files and images are received.</p>
                </div>
                <span className="hidden rounded-full border border-[#dce7eb] bg-[#f7fafc] px-3 py-1.5 text-[11px] font-bold text-[#64748b] sm:inline-flex">{products.length} systems shown</span>
              </div>
              <div className="-mx-5 mt-6 overflow-x-auto px-5 [scrollbar-width:none] lg:-mx-0 lg:px-0" role="tablist" aria-label="Filter Italray products by section">
                <div className="flex min-w-max gap-1 border-b border-[#e2e8f0]">
                  {italraySections.map(section => {
                    const selected = selectedItalraySection === section.id;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls="catalogue-grid"
                        onClick={() => setSelectedItalraySection(section.id)}
                        className={`relative min-h-12 whitespace-nowrap px-4 pb-4 pt-2 text-xs font-extrabold uppercase tracking-[.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6fae] focus-visible:ring-offset-2 ${selected ? "text-[#0a2448]" : "text-[#94a3b8] hover:text-[#365b86]"}`}
                      >
                        {section.shortLabel}
                        <span className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-opacity ${selected ? "bg-[#2f6de1] opacity-100" : "opacity-0"}`} aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex min-h-12 items-center justify-between gap-4 py-3 text-xs text-[#64748b]">
                <p>{italraySections.find(section => section.id === selectedItalraySection)?.description}</p>
                <button type="button" onClick={() => setSelectedItalraySection("all")} className={`shrink-0 font-bold text-[#0f6fae] underline-offset-4 hover:underline ${selectedItalraySection === "all" ? "invisible" : ""}`}>View all</button>
              </div>
            </div>
          </section>
        ) : null}

        {/* Product showcase */}
        <section id="catalogue-grid" className="relative overflow-hidden bg-[#edf2f8] px-5 py-16 lg:px-10 lg:py-24">
          <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#cbd7e6]/45 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-32 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#d9e3ef]/70 blur-3xl" aria-hidden="true" />
          <div className="relative z-10 mx-auto max-w-[1280px]">
            <div className="mx-auto mb-12 max-w-4xl text-center">
              <span className="inline-flex rounded-full border border-[#f0a08d]/40 bg-[#fff3ef] px-4 py-2 text-xs font-extrabold uppercase tracking-[.18em] text-[#c2410c] shadow-sm">Products</span>
              <h2 className="mt-5 text-4xl font-black leading-[1.04] tracking-[-.045em] text-[#0a2448] sm:text-5xl lg:text-6xl">{isItalray ? "Italian imaging systems, built for confident clinical decisions." : isHermann ? "Surgical precision, prepared for the operating room." : "The pinnacle of surgical & diagnostic technology."}</h2>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#4f6075] sm:text-lg">{isItalray ? "Explore Italray C-Arms and radiography systems with SPM engineering support, documentation and lifecycle continuity." : "Equip Egypt’s leading operating rooms with documented German and Italian-engineered systems, supported from selection through lifecycle care."}</p>
            </div>
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(index => (
                <div key={index} className="h-[420px] animate-pulse rounded-3xl border border-[#dce7eb] bg-white" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(item => (
                <Card key={item.id} className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#c8d2df] bg-[#f8fbff] shadow-[0_14px_35px_rgba(30,55,85,.10)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#8fa8c4] hover:shadow-[0_22px_45px_rgba(30,55,85,.16)]">
                  <Link href={item.href} className="block px-6 pt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6fae] focus-visible:ring-inset">
                    <div className="flex items-center justify-between gap-3">
                      <p className={`text-sm font-extrabold uppercase tracking-[.12em] ${item.brand.toLowerCase().includes("hermann") ? "text-[#c2410c]" : "text-[#365b86]"}`}>{item.brand}</p>
                      <Badge className="rounded-full bg-[#edf2f8] text-[10px] font-bold text-[#4f6075] shadow-none">{item.category}</Badge>
                    </div>
                    <h3 className="mt-3 min-h-[3.8rem] text-[1.85rem] font-black uppercase leading-[.98] tracking-[-.035em] text-[#08172d] transition-colors group-hover:text-[#0f6fae]">{item.title}</h3>
                    {item.model ? <p className="mt-2 text-[11px] font-semibold uppercase tracking-[.12em] text-[#8a99ab]">{item.model}</p> : null}
                  </Link>

                  <Link href={item.href} className="relative mx-6 mt-5 block aspect-[1.18] overflow-hidden rounded-2xl bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6fae]">
                    {item.image ? <img src={item.image} alt={item.title} decoding="async" className="h-full w-full object-contain p-4 transition duration-500 ease-out group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-[#94a3b8]"><PackageSearch className="h-14 w-14" /></div>}
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                      {item.kind === "shopify" ? <Badge className="rounded-full bg-white/95 text-[10px] font-bold text-[#c2410c] shadow-sm">Storefront</Badge> : null}
                      {item.updated ? <Badge className="rounded-full bg-[#dff7ef]/95 text-[10px] font-bold text-[#047857] shadow-sm"><CheckCircle2 className="mr-1 h-3 w-3" /> Updated documentation</Badge> : null}
                    </div>
                  </Link>

                  <CardContent className="flex flex-1 flex-col px-6 pb-6 pt-5">
                    <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[#34465d]">{item.description}</p>
                    {item.specs.length > 0 ? <div className="mt-4 flex flex-wrap gap-2">{item.specs.slice(0, 3).map(spec => <span key={spec} className="rounded-full bg-[#edf2f8] px-2.5 py-1.5 text-[10px] font-bold text-[#64748b]">{spec}</span>)}</div> : null}
                    <div className="mt-5 flex items-center justify-between border-t border-[#dce4ee] pt-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${item.statusTone === "green" ? "text-[#047857]" : item.statusTone === "amber" ? "text-[#c2410c]" : "text-[#64748b]"}`}>{item.statusTone === "green" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <BadgeCheck className="h-3.5 w-3.5" />} {item.status}</span>
                      <Button variant="ghost" className="h-auto rounded-none p-0 text-sm font-extrabold text-[#c2410c] hover:bg-transparent hover:text-[#9a3412]" asChild><Link href={item.href}>{item.cta === "Request a quote" ? "Request quote" : "Explore system"} <ArrowUpRight className="ml-1.5 h-4 w-4" /></Link></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#bcdde2] bg-white p-16 text-center">
              <PackageSearch className="mx-auto h-16 w-16 text-[#0f6fae]" />
              <h3 className="mt-4 text-xl font-bold text-[#0a4052]">No systems match these filters</h3>
              <p className="mt-2 text-sm text-[#617180]">Try a different manufacturer, category or search term to browse the complete equipment portfolio.</p>
              <Button onClick={resetFilters} className="mt-6 rounded-xl bg-[#0a4052] text-white hover:bg-[#063545]">Reset all filters</Button>
            </div>
          )}

          <div className="mt-12 grid gap-4 rounded-3xl border border-[#dce7eb] bg-white p-6 sm:grid-cols-3 sm:p-8">
            <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0f6fae]" /><div><p className="text-sm font-bold text-[#0a4052]">Document-led sourcing</p><p className="mt-1 text-xs leading-5 text-[#64748b]">Manufacturer, compliance and technical information are reviewed before quotation.</p></div></div>
            <div className="flex items-start gap-3"><Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#0f6fae]" /><div><p className="text-sm font-bold text-[#0a4052]">Site-ready coordination</p><p className="mt-1 text-xs leading-5 text-[#64748b]">SPM coordinates delivery, installation, commissioning and operator handover.</p></div></div>
            <div className="flex items-start gap-3"><Layers className="mt-0.5 h-5 w-5 shrink-0 text-[#0f6fae]" /><div><p className="text-sm font-bold text-[#0a4052]">Lifecycle support</p><p className="mt-1 text-xs leading-5 text-[#64748b]">Service contracts, genuine parts and biomedical engineering remain connected after delivery.</p></div></div>
          </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
