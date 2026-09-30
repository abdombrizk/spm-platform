import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/lib/format";
import type { Product } from "@shared/commerce/types";
import SiteChrome from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  ArrowUpRight,
  Plus,
  Loader2,
  Layers,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

export default function StoreCatalog() {
  const { data: products = [], isLoading, error } = trpc.commerce.products.list.useQuery();
  const { addItem, loading: cartLoading } = useCart();

  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedVendor, setSelectedVendor] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [addingId, setAddingId] = useState<string | null>(null);

  // Extract filter dimensions
  const allTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [products]);

  const allVendors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.vendor) set.add(p.vendor);
    });
    return Array.from(set);
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedTag !== "all" && !p.tags.includes(selectedTag)) return false;
      if (selectedVendor !== "all" && p.vendor !== selectedVendor) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inVendor = (p.vendor || "").toLowerCase().includes(q);
        const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inVendor && !inTags) return false;
      }
      return true;
    });
  }, [products, selectedTag, selectedVendor, searchTerm]);

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const firstVariant = product.variants[0];
    if (!firstVariant || !firstVariant.availableForSale) return;

    setAddingId(firstVariant.id);
    try {
      await addItem(firstVariant.id, 1);
    } finally {
      setAddingId(null);
    }
  };

  const quoteHref = (product: Product) =>
    `/request-a-quote?equipment=${encodeURIComponent(product.title)}&brand=${encodeURIComponent(product.vendor || "Italray")}&model=${encodeURIComponent(product.handle)}`;

  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f7fafc]">
        {/* Hero Section */}
        <section className="border-b border-[#dce7eb] bg-white py-14 lg:py-16">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                  <Sparkles className="h-3.5 w-3.5 text-[#0f6fae]" />
                  Official SPM Online Storefront
                </div>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-4xl">
                  Medical Equipment & Precision Store
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#617180] sm:text-base">
                  Explore certified imaging systems, laparoscopic sets, and genuine biomedical hardware. Checkout-ready items can be purchased online; configured clinical systems are presented with a tailored project quotation flow.
                </p>
              </div>

              {/* Guarantees Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748b]">
                <div className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-[#0a4052]" />
                  <span>Authorized Agency Warranty</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2">
                  <Truck className="h-4 w-4 text-[#0a4052]" />
                  <span>Insured Clinical Freight</span>
                </div>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#dce7eb] bg-[#f8fafc] p-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search box */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by model, brand, or tag..."
                  className="w-full rounded-xl border border-[#dce7eb] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1e293b] placeholder-[#94a3b8] focus:border-[#0a4052] focus:outline-none focus:ring-1 focus:ring-[#0a4052]"
                />
              </div>

              {/* Tag pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTag("all")}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    selectedTag === "all"
                      ? "bg-[#0a4052] text-white shadow-xs"
                      : "border border-[#dce7eb] bg-white text-[#64748b] hover:bg-[#eaf4fa] hover:text-[#0a4052]"
                  }`}
                >
                  All ({products.length})
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                      selectedTag === tag
                        ? "bg-[#0a4052] text-white shadow-xs"
                        : "border border-[#dce7eb] bg-white text-[#64748b] hover:bg-[#eaf4fa] hover:text-[#0a4052]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Grid Section */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#0a4052]" />
                <p className="mt-3 text-sm text-[#64748b]">Loading storefront products from Shopify...</p>
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-8 text-center text-sm text-[#b91c1c]">
                <p className="font-bold">Failed to load storefront catalog</p>
                <p className="mt-1">{error.message}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#dce7eb] bg-white p-8 text-center">
                <Layers className="h-10 w-10 text-[#94a3b8]" />
                <h3 className="mt-3 text-base font-bold text-[#1e293b]">No products match your filters</h3>
                <p className="mt-1 text-xs text-[#64748b]">Try resetting your search query or tag selection.</p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl border-[#dce7eb]"
                  onClick={() => {
                    setSelectedTag("all");
                    setSelectedVendor("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex items-center justify-between text-xs text-[#64748b]">
                  <span>Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "product" : "products"}</span>
                  <span>Direct checkout via Shopify Secure Gateway</span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const firstVariant = product.variants[0];
                    const isAvailable = firstVariant?.availableForSale ?? false;
                    const isQuoteOnly = product.tags.includes("Quote Only");
                    const primaryImage = product.images[0]?.url;
                    const isAdding = addingId === firstVariant?.id;

                    return (
                      <Card
                        key={product.id}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-[#dce7eb] bg-white shadow-xs transition duration-300 hover:-translate-y-1 hover:border-[#0a4052] hover:shadow-xl"
                      >
                        {/* Image frame */}
                        <Link
                          href={`/store/products/${product.handle}`}
                          className="relative aspect-4/3 w-full overflow-hidden bg-[#f8fafc]"
                        >
                          {primaryImage ? (
                            <img
                              src={primaryImage}
                              alt={product.images[0]?.altText || product.title}
                              className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-[#94a3b8]">
                              No preview available
                            </div>
                          )}

                          {/* Vendor tag */}
                          {product.vendor && (
                            <span className="absolute left-3 top-3 rounded-md bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-bold text-[#0a4052] shadow-xs">
                              {product.vendor}
                            </span>
                          )}

                          {/* Availability status */}
                          <div className="absolute right-3 top-3">
                            {isQuoteOnly ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7ed] px-2.5 py-0.5 text-[11px] font-semibold text-[#c2410c]">
                                <ArrowUpRight className="h-3 w-3" /> Quote Required
                              </span>
                            ) : isAvailable ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-[11px] font-semibold text-[#047857]">
                                <CheckCircle2 className="h-3 w-3" /> In Stock
                              </span>
                            ) : (
                              <span className="rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-[11px] font-semibold text-[#64748b]">
                                Sold Out
                              </span>
                            )}
                          </div>
                        </Link>

                        {/* Card Body */}
                        <CardContent className="flex flex-1 flex-col justify-between p-5">
                          <div>
                            {/* Product type & tags */}
                            <div className="mb-2 flex flex-wrap items-center gap-1.5">
                              {product.productType && (
                                <Badge
                                  variant="secondary"
                                  className="rounded-md bg-[#eaf4fa] text-[10px] font-bold text-[#0a4052]"
                                >
                                  {product.productType}
                                </Badge>
                              )}
                              {product.tags.slice(0, 2).map((t) => (
                                <span
                                  key={t}
                                  className="rounded-md bg-[#f1f5f9] px-2 py-0.5 text-[10px] text-[#64748b]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>

                            {/* Title */}
                            <Link href={`/store/products/${product.handle}`}>
                              <h3 className="text-base font-bold text-[#1e293b] group-hover:text-[#0f6fae] transition line-clamp-2">
                                {product.title}
                              </h3>
                            </Link>

                            {/* Short description */}
                            <p className="mt-2 text-xs leading-relaxed text-[#64748b] line-clamp-2">
                              {product.description}
                            </p>
                          </div>

                          {/* Pricing and Action */}
                          <div className="mt-6 flex items-center justify-between border-t border-[#f1f5f9] pt-4">
                            <div>
                              <p className="text-[11px] uppercase tracking-wider text-[#94a3b8]">
                                {isQuoteOnly ? "Commercial terms" : "Price"}
                              </p>
                              <p className="text-lg font-extrabold text-[#0a4052]">
                                {isQuoteOnly ? "Request a quote" : formatMoney(product.priceRange.min)}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {isQuoteOnly ? (
                                <Button asChild size="sm" className="h-10 rounded-xl bg-[#d95316] px-4 font-bold text-white shadow-xs hover:bg-[#b8430e] active:scale-95 transition">
                                  <Link href={quoteHref(product)}>
                                    <ArrowUpRight className="mr-1.5 h-4 w-4" />
                                    <span>Request Quote</span>
                                  </Link>
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  size="sm"
                                  disabled={!isAvailable || cartLoading || isAdding}
                                  onClick={(e) => handleAddToCart(product, e)}
                                  className="h-10 rounded-xl bg-[#0a4052] px-4 font-bold text-white shadow-xs hover:bg-[#072c38] active:scale-95 transition"
                                >
                                  {isAdding ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <ShoppingBag className="mr-1.5 h-4 w-4" />
                                      <span>Add to Cart</span>
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
