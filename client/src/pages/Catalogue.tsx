import { Filter, PackageSearch, ArrowUpRight, Search, Sparkles, Building2, Layers, CheckCircle2, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SiteChrome from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";

const labels: Record<string, string> = {
  medical_device: "Medical Device",
  spare_part: "Spare Part",
  accessory: "Accessory",
  available: "In Stock / Available",
  on_request: "On Request",
  coming_soon: "Coming Soon",
  discontinued: "Discontinued",
};

export default function Catalogue() {
  const query = trpc.products.published.useQuery();
  const [location] = useLocation();

  // Parse URL search parameters if any
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const initialBrandParam = searchParams.get("brand") || "all";

  const [type, setType] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrandParam);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const b = params.get("brand");
    if (b) setSelectedBrand(b.toLowerCase());
  }, [location]);

  const allProducts = query.data ?? [];

  // Extract available brands dynamically from published data
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    allProducts.forEach(item => {
      const data = item.data as Record<string, any>;
      if (data.brand && typeof data.brand === "string") {
        brandsSet.add(data.brand.trim());
      }
    });
    return Array.from(brandsSet);
  }, [allProducts]);

  const products = useMemo(() => {
    return allProducts.filter(item => {
      const data = item.data as Record<string, any>;

      // Type filter
      if (type !== "all" && item.productType !== type) return false;

      // Brand filter
      if (selectedBrand !== "all") {
        const itemBrand = (data.brand || "").toLowerCase();
        if (!itemBrand.includes(selectedBrand.toLowerCase())) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const nameMatch = (data.name || "").toLowerCase().includes(query);
        const modelMatch = (data.modelNumber || "").toLowerCase().includes(query);
        const descMatch = (data.shortDescription || data.fullDescription || "").toLowerCase().includes(query);
        const brandMatch = (data.brand || "").toLowerCase().includes(query);
        if (!nameMatch && !modelMatch && !descMatch && !brandMatch) return false;
      }

      return true;
    });
  }, [allProducts, type, selectedBrand, searchTerm]);

  const resetFilters = () => {
    setType("all");
    setSelectedBrand("all");
    setSearchTerm("");
    if (typeof window !== "undefined" && window.history.pushState) {
      window.history.pushState({}, "", "/catalogue");
    }
  };

  const hasActiveFilters = type !== "all" || selectedBrand !== "all" || searchTerm !== "";

  return (
    <SiteChrome>
      <main className="min-h-screen bg-[#f7fafc]">
        {/* Header Hero Banner */}
        <section className="border-b border-[#dce7eb] bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                  <Sparkles className="h-3.5 w-3.5 text-[#0f6fae]" /> Controlled Systems Portfolio
                </div>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#0a4052] sm:text-5xl">
                  Medical Imaging Systems & Technology
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#617180] sm:text-lg">
                  Explore certified C-Arm, mobile radiography, digital X-Ray and surgical instruments. Every system is supported by SPM field engineering and manufacturer warranty.
                </p>
              </div>

              {/* Fast Quote CTA Box */}
              <div className="rounded-2xl border border-[#dce7eb] bg-[#f8fafc] p-5 lg:max-w-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-[#0a4052]">Direct RFQ Journey</p>
                <p className="mt-1 text-xs text-[#64748b]">Need a formal quote or custom configuration for your hospital?</p>
                <Link href="/request-a-quote">
                  <Button className="mt-3 w-full bg-[#d95316] text-xs font-bold text-white shadow-sm hover:bg-[#b8430e]">
                    Request a Quote Directly &rarr;
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="mt-12 rounded-2xl border border-[#dce7eb] bg-[#fafcfd] p-4 shadow-xs sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    type="text"
                    placeholder="Search by system name, model..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="h-11 w-full rounded-xl border border-[#dce7eb] bg-white pl-10 pr-4 text-sm text-[#1e293b] placeholder-[#94a3b8] focus:border-[#0a4052] focus:outline-hidden"
                  />
                </div>

                {/* Brand Filter */}
                <div>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-[#dce7eb] bg-white text-sm">
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Manufacturers & Brands</SelectItem>
                      <SelectItem value="italray">Italray (Exclusive Agent)</SelectItem>
                      <SelectItem value="hermann">Hermann (Authorized Partner)</SelectItem>
                      {availableBrands
                        .filter(b => b.toLowerCase() !== "italray" && b.toLowerCase() !== "hermann")
                        .map(b => (
                          <SelectItem key={b} value={b.toLowerCase()}>
                            {b}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Type Filter */}
                <div>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-[#dce7eb] bg-white text-sm">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Product Categories</SelectItem>
                      <SelectItem value="medical_device">Medical Devices & Systems</SelectItem>
                      <SelectItem value="spare_part">Spare Parts</SelectItem>
                      <SelectItem value="accessory">Accessories & Transducers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-center gap-2">
                  {hasActiveFilters ? (
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="h-11 w-full rounded-xl border-[#dce7eb] text-xs font-bold text-[#64748b] hover:bg-[#eaf4fa] hover:text-[#0a4052]"
                    >
                      <X className="mr-1.5 h-3.5 w-3.5" /> Clear Filters
                    </Button>
                  ) : (
                    <div className="flex h-11 w-full items-center justify-center rounded-xl bg-white px-4 text-xs font-semibold text-[#64748b]">
                      Showing {products.length} systems
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid Section */}
        <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(item => {
              const data = item.data as Record<string, any>;
              const availabilityStatus = data.availabilityStatus || "available";

              return (
                <Card
                  key={item.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#dce7eb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-2 hover:border-[#0a4052] hover:shadow-xl"
                >
                  <div>
                    {/* Image Container with Badges */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#061f2b]">
                      {data.mainImage ? (
                        <img
                          src={data.mainImage}
                          alt={data.name || item.slug}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#94a3b8]">
                          <PackageSearch className="h-14 w-14" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/70 via-transparent to-transparent" />

                      {/* Top Floating Badges */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <Badge className="rounded-full bg-[#0a4052] text-xs font-bold text-white shadow-sm">
                          {labels[item.productType] || "System"}
                        </Badge>
                        {data.brand ? (
                          <Badge variant="outline" className="rounded-full border-white/40 bg-white/20 text-xs font-bold text-white backdrop-blur-sm">
                            {data.brand}
                          </Badge>
                        ) : null}
                      </div>

                      {/* Bottom Floating Status */}
                      <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#0a4052] shadow-sm backdrop-blur-sm">
                          {labels[availabilityStatus] || "Available"}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-6">
                      <div className="mb-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0f6fae]">
                          {[data.brand, data.modelNumber].filter(Boolean).join(" · ") || "Medical Imaging"}
                        </p>
                        <h2 className="mt-1 text-xl font-extrabold text-[#0a4052] transition-colors group-hover:text-[#0f6fae]">
                          {data.name}
                        </h2>
                      </div>

                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#617180]">
                        {data.shortDescription || data.fullDescription || "Technical specifications and clinical details available upon request."}
                      </p>

                      {/* Micro Specs List */}
                      {data.generatorPower || data.detectorType || data.tubeVoltage ? (
                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[#f1f5f9] pt-3 text-xs text-[#64748b]">
                          {data.generatorPower ? <span>Power: <strong className="text-[#1e293b]">{data.generatorPower}</strong></span> : null}
                          {data.detectorType ? <span>Detector: <strong className="text-[#1e293b]">{data.detectorType}</strong></span> : null}
                          {data.tubeVoltage ? <span>Max kV: <strong className="text-[#1e293b]">{data.tubeVoltage}</strong></span> : null}
                        </div>
                      ) : null}
                    </CardContent>
                  </div>

                  {/* Actions Bar */}
                  <div className="border-t border-[#f1f5f9] p-6 pt-0">
                    <Link href={`/catalogue/${item.slug}`}>
                      <Button className="w-full rounded-xl bg-[#0a4052] text-sm font-bold text-white shadow-xs hover:bg-[#063545]">
                        View Technical Details <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {!query.isLoading && products.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-[#bcdde2] bg-white p-16 text-center">
              <PackageSearch className="mx-auto h-16 w-16 text-[#0f6fae]" />
              <h3 className="mt-4 text-xl font-bold text-[#0a4052]">No products found matching your criteria</h3>
              <p className="mt-2 text-sm text-[#617180]">
                Try adjusting your search terms or clearing active filters to browse all equipment.
              </p>
              <Button onClick={resetFilters} className="mt-6 bg-[#0a4052] text-white hover:bg-[#063545]">
                Reset All Filters
              </Button>
            </div>
          ) : null}
        </section>
      </main>
    </SiteChrome>
  );
}
