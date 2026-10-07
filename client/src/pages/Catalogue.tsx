import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Filter,
  Layers,
  Loader2,
  PackageSearch,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Truck,
  X,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    image: product.images[0]?.url,
    status: isQuoteOnly ? "Request a project quote" : product.variants[0]?.availableForSale ? "Ready for online checkout" : "Contact SPM team",
    statusTone: isQuoteOnly ? "amber" : product.variants[0]?.availableForSale ? "green" : "slate",
    specs: product.tags.filter(tag => tag !== "Quote Only").slice(0, 3),
    badge: isQuoteOnly ? "Configured system" : "Shopify storefront",
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
  const initialSortParam = searchParams.get("sort") || "relevance";
  const initialSearchParam = searchParams.get("q") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategoryParam.toLowerCase());
  const [selectedBrand, setSelectedBrand] = useState(initialBrandParam.toLowerCase());
  const [searchTerm, setSearchTerm] = useState(initialSearchParam);
  const [selectedSort, setSelectedSort] = useState(initialSortParam);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const category = params.get("category");
    const q = params.get("q");
    const sort = params.get("sort");
    setSelectedBrand(brand?.toLowerCase() || "all");
    setSelectedCategory(category?.toLowerCase() || "all");
    setSearchTerm(q || "");
    setSelectedSort(sort || "relevance");
  }, [location]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBrand !== "all") params.set("brand", selectedBrand);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (searchTerm.trim()) params.set("q", searchTerm.trim());
    if (selectedSort !== "relevance") params.set("sort", selectedSort);
    const next = params.toString() ? `/catalogue?${params.toString()}` : "/catalogue";
    if (typeof window !== "undefined" && window.location.pathname + window.location.search !== next) window.history.replaceState({}, "", next);
  }, [selectedBrand, selectedCategory, searchTerm, selectedSort]);

  const cmsItems = useMemo(() => (query.data ?? []).map(item => toCmsItem(item as CmsProduct)), [query.data]);
  const shopifyItems = useMemo(() => (storeQuery.data ?? []).map(toShopifyItem), [storeQuery.data]);
  const allItems = useMemo(() => [...cmsItems, ...shopifyItems], [cmsItems, shopifyItems]);

  const availableBrands = useMemo(() => {
    const brands = new Map<string, string>();
    allItems.forEach(item => {
      if (item.brand) brands.set(normalize(item.brand), item.brand);
    });
    return Array.from(brands.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [allItems]);

  const availableCategories = useMemo(() => {
    const categories = new Map<string, string>();
    allItems.forEach(item => {
      if (item.category) categories.set(normalize(item.category), item.category);
    });
    return Array.from(categories.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [allItems]);

  const products = useMemo(() => {
    const search = normalize(searchTerm);
    const filtered = allItems.filter(item => {
      if (selectedCategory !== "all" && !normalize(item.category).includes(selectedCategory)) return false;
      if (selectedBrand !== "all" && !normalize(item.brand).includes(selectedBrand)) return false;
      if (!search) return true;
      return [item.title, item.brand, item.category, item.model, item.description, ...item.specs].some(value => normalize(value).includes(search));
    });
    return [...filtered].sort((a, b) => selectedSort === "title" ? a.title.localeCompare(b.title) : selectedSort === "brand" ? a.brand.localeCompare(b.brand) : a.title.localeCompare(b.title));
  }, [allItems, searchTerm, selectedBrand, selectedCategory, selectedSort]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSearchTerm("");
    setSelectedSort("relevance");
    if (typeof window !== "undefined" && window.history.replaceState) {
      window.history.replaceState({}, "", "/catalogue");
    }
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedBrand !== "all" || searchTerm.trim() !== "";
  const isLoading = query.isLoading || storeQuery.isLoading;

  return (
    <SiteChrome>
      <SEOHead
        title="Clinical Equipment & Imaging Catalogue"
        description="Explore SPM's complete medical equipment portfolio, from mobile C-Arms and digital radiography to fluoroscopy, mammography and precision surgical technology."
        url="/catalogue"
      />
      <main className="min-h-screen bg-[#f7fafc]">
        {/* Visual catalogue hero */}
        <section className="relative isolate overflow-hidden bg-[#061f2b] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_10%,rgba(96,193,187,.28),transparent_28%),linear-gradient(115deg,#061f2b_0%,#0a4052_52%,#0f6fae_100%)]" aria-hidden="true" />
          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full border border-white/10 sm:h-[30rem] sm:w-[30rem]" aria-hidden="true" />
          <div className="absolute -right-8 top-10 h-56 w-56 rounded-full border border-white/10 sm:h-80 sm:w-80" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-[1280px] gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8be0d5]/35 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-[#b9f1e7] backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-[#8be0d5]" />
                SPM Systems Catalogue
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-[-.045em] text-white sm:text-5xl lg:text-[68px]">
                The right imaging system for the next clinical decision.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
                Explore SPM’s complete equipment portfolio, from mobile C-Arms and digital radiography to fluoroscopy, mammography and precision surgical technology.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" className="h-12 rounded-xl bg-[#c2410c] px-6 text-sm font-bold text-white shadow-xl shadow-[#c2410c]/20 hover:bg-[#9a3412]" asChild><a href="#catalogue-grid">
                    Browse all systems <ArrowRight className="ml-2 h-4 w-4" />
                  </a></Button>
                <Button size="lg" variant="outline" className="h-12 rounded-xl border-white/40 bg-white/10 px-6 text-sm font-bold text-white hover:bg-white/20" asChild><Link href="/request-a-quote">
                    Build a project quote <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link></Button>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                  <Building2 className="h-5 w-5 text-[#8be0d5]" />
                  <p className="mt-2 text-xl font-extrabold">{allItems.length || "—"}</p>
                  <p className="text-[11px] text-white/60">Published systems</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                  <Activity className="h-5 w-5 text-[#8be0d5]" />
                  <p className="mt-2 text-xl font-extrabold">{availableBrands.length || "—"}</p>
                  <p className="text-[11px] text-white/60">Manufacturers</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                  <ShieldCheck className="h-5 w-5 text-[#8be0d5]" />
                  <p className="mt-2 text-xl font-extrabold">Docs</p>
                  <p className="text-xs text-white/70">Document-led sourcing</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                  <Truck className="h-5 w-5 text-[#8be0d5]" />
                  <p className="mt-2 text-xl font-extrabold">MENA</p>
                  <p className="text-[11px] text-white/60">Delivery coordination</p>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
              <div className="absolute -inset-5 rounded-[2rem] border border-[#8be0d5]/20 bg-[#8be0d5]/10 blur-2xl" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-sm">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-[#dcecf0]">
                  <img
                    src="/manus-storage/spm-equipment-carm_d9a563ca.jpg"
                    alt="SPM medical imaging equipment portfolio"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/75 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#b9f1e7]">Clinical equipment portfolio</p>
                      <p className="mt-1 text-xl font-bold text-white">Systems, service and lifecycle support.</p>
                    </div>
                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white sm:flex">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and filters */}
        <section className="relative z-10 mx-auto -mt-6 max-w-[1280px] px-5 lg:px-8">
          <div className="rounded-3xl border border-[#dce7eb] bg-white p-4 shadow-xl shadow-[#0a4052]/10 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  aria-label="Search the equipment catalogue"
                  placeholder="Search by system name, model, manufacturer or capability..."
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  className="h-12 w-full rounded-xl border border-[#dce7eb] bg-[#fafcfd] pl-10 pr-4 text-sm text-[#1e293b] placeholder-[#94a3b8] focus:border-[#0a4052] focus:outline-hidden focus:ring-2 focus:ring-[#0a4052]/10"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:w-[440px]">
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="h-12 rounded-xl border-[#dce7eb] bg-[#fafcfd] text-sm">
                    <SelectValue placeholder="All manufacturers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All manufacturers</SelectItem>
                    {availableBrands.map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 rounded-xl border-[#dce7eb] bg-[#fafcfd] text-sm">
                    <SelectValue placeholder="All clinical categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All clinical categories</SelectItem>
                    {availableCategories.map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="h-12 rounded-xl border-[#dce7eb] bg-[#fafcfd] text-sm" aria-label="Sort catalogue">
                    <SelectValue placeholder="Sort systems" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort: Relevance</SelectItem>
                    <SelectItem value="title">Sort: Name</SelectItem>
                    <SelectItem value="brand">Sort: Manufacturer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {hasActiveFilters || selectedSort !== "relevance" ? (
                <Button variant="outline" onClick={resetFilters} className="h-12 rounded-xl border-[#dce7eb] px-4 text-xs font-bold text-[#64748b] hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  <X className="mr-1.5 h-4 w-4" /> Clear
                </Button>
              ) : (
                <div className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#eaf4fa] px-4 text-xs font-bold text-[#0a4052]">
                  <Filter className="h-4 w-4" /> {products.length} systems shown
                </div>
              )}
            </div>

            {availableCategories.length > 0 ? (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                <button type="button" onClick={() => setSelectedCategory("all")} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${selectedCategory === "all" ? "bg-[#0a4052] text-white" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#eaf4fa] hover:text-[#0a4052]"}`}>
                  All systems
                </button>
                {availableCategories.map(([value, label]) => (
                  <button type="button" key={value} onClick={() => setSelectedCategory(value)} className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition ${selectedCategory === value ? "bg-[#0a4052] text-white" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#eaf4fa] hover:text-[#0a4052]"}`}>
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        {/* Unified device grid */}
        <section id="catalogue-grid" className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-20">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                <Layers className="h-3.5 w-3.5 text-[#0f6fae]" />
                Equipment finder
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-[-.03em] text-[#0a4052] sm:text-4xl">Explore every published system</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#617180]">Compare the equipment portfolio at a glance, then open technical details or start a project quotation with the SPM team.</p>
            </div>
            <p className="text-sm font-semibold text-[#64748b]">Showing <span className="text-[#0a4052]">{products.length}</span> of {allItems.length} systems</p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(index => (
                <div key={index} className="h-[420px] animate-pulse rounded-3xl border border-[#dce7eb] bg-white" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(item => (
                <Card key={item.id} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#dce7eb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0a4052] hover:shadow-2xl">
                  <Link href={item.href} className="relative block aspect-[16/10] overflow-hidden bg-[#eef7fa]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain p-4 transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#94a3b8]"><PackageSearch className="h-14 w-14" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/65 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <Badge className="rounded-full bg-[#0a4052] text-[10px] font-bold text-white shadow-sm">{item.category}</Badge>
                      {item.kind === "shopify" ? <Badge className="rounded-full bg-white/90 text-[10px] font-bold text-[#c2410c] shadow-sm">Storefront</Badge> : null}
                    </div>
                    <span className={`absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-sm backdrop-blur-sm ${item.statusTone === "green" ? "bg-[#ecfdf5]/95 text-[#047857]" : item.statusTone === "amber" ? "bg-[#fff7ed]/95 text-[#c2410c]" : "bg-white/90 text-[#64748b]"}`}>
                      {item.statusTone === "green" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <BadgeCheck className="h-3.5 w-3.5" />}
                      {item.status}
                    </span>
                  </Link>

                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#0f6fae]">{item.brand}</p>
                        <h3 className="mt-2 line-clamp-2 text-xl font-extrabold leading-snug text-[#0a4052] transition-colors group-hover:text-[#0f6fae]">{item.title}</h3>
                      </div>
                      <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf4fa] text-[#0a4052] sm:flex">
                        {item.category.toLowerCase().includes("surgical") || item.category.toLowerCase().includes("c-arm") ? <Stethoscope className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                      </div>
                    </div>
                    {item.model ? <p className="mt-2 text-xs font-semibold text-[#94a3b8]">Model / reference: {item.model}</p> : null}
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#617180]">{item.description}</p>
                    {item.specs.length > 0 ? (
                      <div className="mt-5 flex flex-wrap gap-2 border-t border-[#f1f5f9] pt-4">
                        {item.specs.map(spec => <span key={spec} className="rounded-lg bg-[#f8fafc] px-2.5 py-1.5 text-[11px] font-semibold text-[#64748b]">{spec}</span>)}
                      </div>
                    ) : null}
                    <div className="mt-auto pt-6">
                      <Button className={`w-full rounded-xl text-sm font-bold text-white shadow-xs ${item.statusTone === "amber" ? "bg-[#c2410c] hover:bg-[#9a3412]" : "bg-[#0a4052] hover:bg-[#063545]"}`} asChild><Link href={item.href}>
                          {item.cta} <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link></Button>
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
        </section>
      </main>
    </SiteChrome>
  );
}
