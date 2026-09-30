import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Menu, X, ArrowUpRight, LockKeyhole, Activity, Boxes, Layers, Stethoscope, Sparkles, Search, PhoneCall, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";

const logo = "/manus-storage/spm-logo-cropped_7b519adc.webp";

export default function SiteChrome({ children, transparentHeader = false }: { children: React.ReactNode; transparentHeader?: boolean }) {
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(false);
  const [activeProductTab, setActiveProductTab] = useState<"italray" | "hermann" | "parts">("italray");
  const [activeCompany, setActiveCompany] = useState(false);
  const [activeServices, setActiveServices] = useState(false);
  const [activeNews, setActiveNews] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { itemCount, openCart } = useCart();

  const brandsQuery = trpc.menu.productBrands.useQuery();
  const itemsQuery = trpc.menu.productItems.useQuery();
  const partsQuery = trpc.parts.brands.useQuery();
  const storeProductsQuery = trpc.commerce.products.list.useQuery({ first: 12 });

  const brands = brandsQuery.data ?? [];
  const items = itemsQuery.data ?? [];
  const partBrands = partsQuery.data ?? [];
  const italrayStoreProducts = (storeProductsQuery.data ?? []).filter(product => product.vendor === "Italray").slice(0, 6);

  const hermannBrand = brands.find(b => b.slug === "hermann");
  const hermannItems = items.filter(item => item.brandId === hermannBrand?.id);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDarkNav = transparentHeader && !isScrolled;
  const navIdle = isDarkNav ? "text-white/90 hover:text-white" : "text-[#334155] hover:text-[#0f6fae]";
  const navActive = isDarkNav ? "text-white font-bold" : "text-[#0f6fae] font-bold";

  return (
    <div className="min-h-screen bg-[#f7fafc] text-[#17212b]">
      {/* Accessible Skip Link for Keyboard Navigation */}
      <a href="#main-content" className="sr-only sr-only-focusable">
        Skip to main content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isDarkNav
            ? "border-b border-white/10 bg-[#061f2b]/40 backdrop-blur-md"
            : "border-b border-[#dce7eb] bg-white/95 shadow-xs backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[80px] max-w-[1280px] items-center justify-between gap-6 px-5 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
            <img src={logo} alt="SPM Medical Imaging Technology" className="h-12 w-auto max-w-[178px] object-contain transition-transform hover:scale-105 sm:h-14" />
            <span className="sr-only">SPM - Systems for Projects & Maintenance</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 xl:gap-2 lg:flex" aria-label="Main Navigation">
            {/* 1. Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveCompany(true)}
              onMouseLeave={() => setActiveCompany(false)}
            >
              <Link
                href="/about"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-4 text-sm font-semibold transition ${
                  location.startsWith("/about") || location.startsWith("/careers") || location.startsWith("/contact")
                    ? navActive
                    : navIdle
                }`}
                onFocus={() => setActiveCompany(true)}
                aria-expanded={activeCompany}
              >
                Company
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isDarkNav ? "text-white/80" : "text-[#94a3b8]"} ${activeCompany ? "rotate-180" : ""}`} />
              </Link>
              <div
                className={`absolute left-0 top-full w-64 rounded-2xl border border-[#dce7eb] bg-white p-2.5 shadow-2xl transition-[opacity,transform,visibility] duration-250 ease-out ${
                  activeCompany ? "pointer-events-auto visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0"
                }`}
              >
                <Link href="/about" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  About SPM <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/contact" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Contact & Locations <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/careers" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Careers at SPM <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
              </div>
            </div>

            {/* 2. Products - 3-Branch Flyout Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMega(true)}
              onMouseLeave={() => setActiveMega(false)}
            >
              <Link
                href="/catalogue"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-4 text-sm font-semibold transition ${
                  location.startsWith("/catalogue") || location.startsWith("/spare-parts") ? navActive : navIdle
                }`}
                onFocus={() => setActiveMega(true)}
                aria-expanded={activeMega}
              >
                Products
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isDarkNav ? "text-white/80" : "text-[#94a3b8]"} ${activeMega ? "rotate-180" : ""}`} />
              </Link>

              {/* 3-Tab Hover Cascading Dropdown */}
              <div
                className={`absolute left-0 top-full w-[760px] rounded-3xl border border-[#dce7eb] bg-white p-5 shadow-2xl backdrop-blur-xl transition-[opacity,transform,visibility] duration-250 ease-out ${
                  activeMega ? "pointer-events-auto visible translate-y-1 opacity-100" : "pointer-events-none invisible translate-y-3 opacity-0"
                }`}
              >
                <div className="grid grid-cols-[250px_1fr] gap-6">
                  {/* Left Column: 3 branches */}
                  <div className="space-y-2 border-r border-[#eef3f5] pr-4">
                    <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">Product Categories</p>

                    {/* 1. Italray */}
                    <Link
                      href="/catalogue"
                      onMouseEnter={() => setActiveProductTab("italray")}
                      onClick={() => setActiveMega(false)}
                      className={`group flex items-center justify-between rounded-xl p-3 transition ${
                        activeProductTab === "italray" ? "bg-[#0a4052] text-white shadow-md shadow-[#0a4052]/20" : "text-[#334155] hover:bg-[#eaf4fa] hover:text-[#0a4052]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Activity className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-bold">1. Italray</p>
                          <p className={`text-[10px] ${activeProductTab === "italray" ? "text-white/80" : "text-[#64748b]"}`}>Exclusive Agent in Egypt</p>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${activeProductTab === "italray" ? "translate-x-1" : ""}`} />
                    </Link>

                    {/* 2. Hermann */}
                    <div
                      onMouseEnter={() => setActiveProductTab("hermann")}
                      className={`group flex cursor-pointer items-center justify-between rounded-xl p-3 transition ${
                        activeProductTab === "hermann" ? "bg-[#0a4052] text-white shadow-md shadow-[#0a4052]/20" : "text-[#334155] hover:bg-[#eaf4fa] hover:text-[#0a4052]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Stethoscope className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-bold">2. Hermann</p>
                          <p className={`text-[10px] ${activeProductTab === "hermann" ? "text-white/80" : "text-[#64748b]"}`}>Authorized Partner</p>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${activeProductTab === "hermann" ? "translate-x-1" : ""}`} />
                    </div>

                    {/* 3. Spare Parts Module */}
                    <div
                      onMouseEnter={() => setActiveProductTab("parts")}
                      className={`group flex cursor-pointer items-center justify-between rounded-xl p-3 transition ${
                        activeProductTab === "parts" ? "bg-[#0a4052] text-white shadow-md shadow-[#0a4052]/20" : "text-[#334155] hover:bg-[#eaf4fa] hover:text-[#0a4052]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-bold">3. Spare Parts</p>
                          <p className={`text-[10px] ${activeProductTab === "parts" ? "text-white/80" : "text-[#64748b]"}`}>Multi-Vendor OEM</p>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-transform ${activeProductTab === "parts" ? "translate-x-1" : ""}`} />
                    </div>
                  </div>

                  {/* Right Column: Dynamic Content Pane */}
                  <div className="flex flex-col justify-between py-1">
                    {activeProductTab === "italray" ? (
                      <div className="animate-in fade-in slide-in-from-right-2 duration-250">
                        <div className="mb-3 flex items-center justify-between border-b border-[#eef3f5] pb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#0a4052]">Italray Imaging Systems</span>
                          <Link href="/catalogue" onClick={() => setActiveMega(false)} className="text-xs font-semibold text-[#d95316] hover:underline">
                            Open public catalogue <ArrowUpRight className="ml-1 inline h-3 w-3" />
                          </Link>
                        </div>
                        {italrayStoreProducts.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {italrayStoreProducts.map(product => (
                              <Link
                                key={product.id}
                                href={`/store/products/${product.handle}`}
                                onClick={() => setActiveMega(false)}
                                className="group flex min-w-0 items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#fafcfd] p-2.5 transition hover:-translate-y-0.5 hover:border-[#0a4052] hover:bg-white hover:shadow-sm"
                              >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#eaf4fa] text-[#0a4052]">
                                  {product.images[0]?.url ? (
                                    <img src={product.images[0].url} alt="" className="h-full w-full object-contain p-1" />
                                  ) : (
                                    <Boxes className="h-5 w-5" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="line-clamp-2 text-[11px] font-bold leading-4 text-[#1e293b] group-hover:text-[#0f6fae]">{product.title}</p>
                                  <p className="mt-0.5 truncate text-[10px] text-[#94a3b8]">{product.productType || "Medical imaging system"}</p>
                                </div>
                                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#94a3b8] opacity-0 transition group-hover:opacity-100" />
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <Link href="/catalogue" onClick={() => setActiveMega(false)} className="group block rounded-2xl border border-[#bcdde2] bg-[#f7fafc] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#0a4052] hover:bg-white hover:shadow-lg">
                            <div className="flex items-start gap-3">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf4fa] text-[#0a4052]">
                                <Boxes className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[#0a4052] group-hover:text-[#0f6fae]">Explore the complete Italray catalogue</p>
                                <p className="mt-1 text-xs leading-5 text-[#64748b]">Browse certified C-Arm, Digital Radiography and fluoroscopy systems supported with exclusive Egyptian agency warranty.</p>
                              </div>
                            </div>
                            <span className="mt-4 inline-flex items-center text-xs font-bold text-[#d95316]">Browse Italray systems <ArrowUpRight className="ml-1 h-3 w-3" /></span>
                          </Link>
                        )}
                      </div>
                    ) : activeProductTab === "hermann" ? (
                      <div>
                        <div className="mb-3 flex items-center justify-between border-b border-[#eef3f5] pb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#0a4052]">Hermann Medizintechnik</span>
                          <Link href="/catalogue" className="text-xs font-semibold text-[#d95316] hover:underline">
                            View All Hermann <ArrowUpRight className="ml-1 inline h-3 w-3" />
                          </Link>
                        </div>
                        <div className="space-y-1.5">
                          {hermannItems.length > 0 ? (
                            hermannItems.map(item => (
                              <Link
                                key={item.id}
                                href={item.href}
                                className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-[#f8fafc]"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eaf4fa] text-[#0a4052]">
                                  <Stethoscope className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-bold text-[#1e293b] group-hover:text-[#0f6fae]">{item.label}</p>
                                </div>
                                <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8] opacity-0 transition group-hover:opacity-100" />
                              </Link>
                            ))
                          ) : (
                            <div className="rounded-xl border border-[#e2e8f0] bg-[#fafcfd] p-4 text-center">
                              <p className="text-xs font-semibold text-[#0a4052]">Surgical & Precision Technology</p>
                              <p className="mt-1 text-[11px] text-[#64748b]">Authorized agent distribution in Egypt for Hermann specialty instrumentation.</p>
                              <Link href="/request-a-quote?brand=hermann" className="mt-3 inline-flex text-xs font-bold text-[#0a4052] hover:underline">
                                Request Hermann Quote <ArrowUpRight className="ml-1 h-3 w-3" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-3 flex items-center justify-between border-b border-[#eef3f5] pb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#0a4052]">Spare Parts Hub</span>
                          <Link href="/spare-parts" className="text-xs font-semibold text-[#d95316] hover:underline">
                            Browse All Parts <ArrowUpRight className="ml-1 inline h-3 w-3" />
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {partBrands.slice(0, 6).map(pb => (
                            <Link
                              key={pb.id}
                              href="/spare-parts"
                              className="group flex items-center gap-2.5 rounded-xl border border-[#e2e8f0] bg-[#fafcfd] p-2.5 transition hover:border-[#0a4052] hover:bg-white hover:shadow-xs"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eaf4fa] text-[#0a4052]">
                                <Layers className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-bold text-[#1e293b] group-hover:text-[#0f6fae]">{pb.name}</p>
                                <p className="text-[10px] text-[#94a3b8]">Verified Component</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>

            {/* 3. Services */}
            <div
              className="relative"
              onMouseEnter={() => setActiveServices(true)}
              onMouseLeave={() => setActiveServices(false)}
            >
              <Link
                href="/services"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-4 text-sm font-semibold transition ${
                  location.startsWith("/services") ? navActive : navIdle
                }`}
                onFocus={() => setActiveServices(true)}
                aria-expanded={activeServices}
              >
                Services
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isDarkNav ? "text-white/80" : "text-[#94a3b8]"} ${activeServices ? "rotate-180" : ""}`} />
              </Link>
              <div
                className={`absolute left-0 top-full w-72 rounded-2xl border border-[#dce7eb] bg-white p-2.5 shadow-2xl transition-[opacity,transform,visibility] duration-250 ease-out ${
                  activeServices ? "pointer-events-auto visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0"
                }`}
              >
                <Link href="/services" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  All Services (10 Pillars) <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/request-service" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Request Service Visit <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/maintenance-contracts" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Maintenance Contracts <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
              </div>
            </div>

            {/* 4. Events & News */}
            <div
              className="relative"
              onMouseEnter={() => setActiveNews(true)}
              onMouseLeave={() => setActiveNews(false)}
            >
              <Link
                href="/news"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-4 text-sm font-semibold transition ${
                  location.startsWith("/news") || location.startsWith("/events") || location.startsWith("/faqs")
                    ? navActive
                    : navIdle
                }`}
                onFocus={() => setActiveNews(true)}
                aria-expanded={activeNews}
              >
                Events & News
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isDarkNav ? "text-white/80" : "text-[#94a3b8]"} ${activeNews ? "rotate-180" : ""}`} />
              </Link>
              <div
                className={`absolute left-0 top-full w-64 rounded-2xl border border-[#dce7eb] bg-white p-2.5 shadow-2xl transition-[opacity,transform,visibility] duration-250 ease-out ${
                  activeNews ? "pointer-events-auto visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0"
                }`}
              >
                <Link href="/news" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Latest News <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/events" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Upcoming Events <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/faqs" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  FAQs & Knowledge <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
              </div>
            </div>

            {/* 5. Online Storefront */}
            <Link
              href="/store"
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-4 text-sm font-semibold transition ${
                location.startsWith("/store") || location.startsWith("/cart")
                  ? navActive
                  : navIdle
              }`}
            >
              <ShoppingBag className="h-4 w-4 text-[#d95316]" />
              Store
              <span className="rounded-full bg-[#d95316]/10 px-1.5 py-0.5 text-[10px] font-bold text-[#d95316]">Shopify</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Cart Trigger */}
            <button
              type="button"
              onClick={openCart}
              className={`relative inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                isDarkNav
                  ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
                  : "border-[#dce7eb] bg-white text-[#0a4052] hover:border-[#0a4052] hover:bg-[#eaf4fa]"
              }`}
              title="Open cart drawer"
            >
              <ShoppingBag className="h-4 w-4 text-[#0a4052]" />
              <span>Cart</span>
              {itemCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d95316] text-[10px] font-extrabold text-white">
                  {itemCount}
                </span>
              )}
            </button>
            <Link
              href="/login"
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                isDarkNav
                  ? "border-white/30 bg-white/10 text-white hover:border-white hover:bg-white/20"
                  : "border-[#dce7eb] bg-white text-[#334155] hover:border-[#0a4052] hover:text-[#0a4052]"
              }`}
            >
              <LockKeyhole className="h-3.5 w-3.5 text-[#0f6fae]" />
              Staff Sign in
            </Link>
            <Link href="/contact">
              <Button className="h-11 rounded-xl bg-[#d95316] px-6 text-sm font-bold text-white shadow-md shadow-[#d95316]/20 transition-all hover:bg-[#b8430e] hover:shadow-lg active:scale-95">
                Contact <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`rounded-xl border p-2.5 lg:hidden ${
              isDarkNav ? "border-white/40 text-white" : "border-[#dce7eb] text-[#334155]"
            }`}
            onClick={() => setOpen(value => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {open ? (
          <div className="max-h-[80vh] overflow-y-auto border-t border-[#dce7eb] bg-white px-5 py-6 lg:hidden">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mb-4 flex items-center justify-between rounded-xl border border-[#dce7eb] bg-[#f8fafc] p-3 text-sm font-bold text-[#0a4052]"
            >
              <span className="inline-flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-[#0f6fae]" /> Internal Staff Sign in
              </span>
              <ArrowUpRight className="h-4 w-4 text-[#94a3b8]" />
            </Link>

            {/* Mobile Store & Cart quick bar */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              <Link
                href="/store"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0a4052] p-2.5 text-xs font-bold text-white shadow-xs"
              >
                <ShoppingBag className="h-4 w-4" />
                Store Catalog
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openCart();
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#0a4052] bg-white p-2.5 text-xs font-bold text-[#0a4052]"
              >
                <ShoppingBag className="h-4 w-4 text-[#0a4052]" />
                Cart ({itemCount})
              </button>
            </div>

            <div className="space-y-4 divide-y divide-[#f1f5f9]">
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">1. Company</p>
                <div className="mt-2 space-y-1">
                  <Link href="/about" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium text-[#334155]">About SPM</Link>
                  <Link href="/contact" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium text-[#334155]">Contact & Locations</Link>
                  <Link href="/careers" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium text-[#334155]">Careers at SPM</Link>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">2. Products</p>
                <div className="mt-2 space-y-1">
                  <Link href="/catalogue" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-bold text-[#0a4052]">1. Italray Imaging Systems</Link>
                  <Link href="/catalogue" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-bold text-[#0a4052]">2. Hermann Medizintechnik</Link>
                  <Link href="/spare-parts" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-bold text-[#0a4052]">3. Spare Parts Module</Link>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">3. Services</p>
                <div className="mt-2 space-y-1">
                  <Link href="/services" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium text-[#334155]">All Services (10 Pillars)</Link>
                  <Link href="/request-service" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium text-[#334155]">Request Service Visit</Link>
                  <Link href="/maintenance-contracts" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium text-[#334155]">Maintenance Contracts</Link>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">4. Events & News</p>
                <div className="mt-2 space-y-1">
                  <Link href="/news" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium text-[#334155]">Latest News</Link>
                  <Link href="/events" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium text-[#334155]">Upcoming Events</Link>
                  <Link href="/faqs" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium text-[#334155]">FAQs & Support</Link>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/contact" onClick={() => setOpen(false)}>
                <Button className="w-full bg-[#d95316] text-white hover:bg-[#b8430e]">Contact</Button>
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      {/* Main Content Landmark */}
      <div id="main-content" className="pt-[80px]">
        {children}
      </div>

      <footer className="border-t border-[#08303e] bg-[#061f2b] text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="inline-block rounded-xl bg-white p-2.5">
                <img src={logo} alt="SPM" className="h-10 w-auto object-contain" />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#94a3b8]">
                Systems for Projects & Maintenance (SPM). Medical imaging technology, genuine spare parts, and dedicated field engineering support across Egypt and the MENA region.
              </p>
              <div className="mt-4 border-t border-white/10 pt-3 text-[11px] text-[#64748b]">
                <p>Quality Framework: ISO 13485 & CE Directives</p>
                <p>Exclusive Agent in Egypt for Italray & Authorized Hermann Distribution</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8]">Imaging Portfolio</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#cbd5e1]">
                <li><Link href="/catalogue" className="hover:text-white">C-Arm Systems</Link></li>
                <li><Link href="/catalogue" className="hover:text-white">Mobile Radiography</Link></li>
                <li><Link href="/catalogue" className="hover:text-white">Fixed X-Ray & DR</Link></li>
                <li><Link href="/catalogue" className="hover:text-white">Italray Solutions</Link></li>
                <li><Link href="/spare-parts" className="hover:text-white">Spare Parts Hub</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8]">Support & Capabilities</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#cbd5e1]">
                <li><Link href="/services" className="hover:text-white">10 Core Service Capabilities</Link></li>
                <li><Link href="/maintenance-contracts" className="hover:text-white">Maintenance Contracts</Link></li>
                <li><Link href="/faqs" className="hover:text-white">Frequently Asked Questions</Link></li>
                <li><Link href="/news" className="hover:text-white">News & Publications</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8]">Contact & Dispatch</p>
              <div className="mt-4 space-y-3 text-xs text-[#cbd5e1]">
                <div>
                  <p className="font-semibold text-white">CENTRAL PHONE / WHATSAPP</p>
                  <p className="text-[#94a3b8]">+20 12 21888395</p>
                </div>
                <div>
                  <p className="font-semibold text-white">GENERAL CORRESPONDENCE</p>
                  <p className="text-[#94a3b8]">info@spmhospitals.com</p>
                </div>
                <div>
                  <p className="font-semibold text-white">COMMERCIAL DEPARTMENT</p>
                  <p className="text-[#94a3b8]">sales@spmhospitals.com</p>
                </div>
                <div>
                  <p className="font-semibold text-white">MAINTENANCE & FIELD ENGINEERING</p>
                  <p className="text-[#94a3b8]">service@spmhospitals.com</p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <Link href="/request-service"><Button size="sm" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10">Request Service</Button></Link>
                <Link href="/contact"><Button size="sm" className="bg-[#d95316] text-white hover:bg-[#b8430e]">Contact</Button></Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#64748b] sm:flex-row">
            <p>&copy; {new Date().getFullYear()} SPM (Systems for Projects & Maintenance). All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Use</Link>
              <Link href="/login" className="hover:text-white">Internal Staff Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
