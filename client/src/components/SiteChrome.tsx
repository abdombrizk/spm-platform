import { useRef, useState } from "react";
import SiteSearchDialog from "@/components/SiteSearchDialog";
import { ChevronDown, ChevronRight, Menu, X, ArrowUpRight, Facebook, Linkedin, Stethoscope, MessageCircle, Wrench, LogIn } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { italrayCategoryLinks } from "@/lib/italrayCategories";

const logo = "/manus-storage/spm-logo-transparent_ed0588dc.png";
const darkNavLogo = "/manus-storage/spm-logo-header-transparent_f3f257c9.png";
const italrayLogo = "/manus-storage/italray-transparent-cropped_1f5d097e.png";
const hermannLogo = "/manus-storage/hermann-logo_7f4be603.png";

const italrayCategoryDescriptions: Record<string, string> = {
  "DRF REMOTE CONTROLLED TABLES": "Dynamic fluoroscopy and controlled table systems",
  "DIGITAL RADIOGRAPHY": "Fixed rooms and workflow-ready DR platforms",
  "DIGITAL PORTABLE": "Bedside digital radiography for mobile teams",
  MAMMOGRAPH: "FFDM and tomosynthesis imaging platforms",
  "C ARM": "Mobile surgical imaging for critical procedures",
  "TRADITIONAL PORTABLE": "Portable radiography for dependable daily use",
  "SOLAR X-RAY": "Field-ready imaging for flexible deployment",
};

export default function SiteChrome({ children, transparentHeader = false }: { children: React.ReactNode; transparentHeader?: boolean }) {
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(false);
  const [activeProductTab, setActiveProductTab] = useState<"italray" | "hermann" | "parts">("italray");
  const [activeCompany, setActiveCompany] = useState(false);
  const [activeServices, setActiveServices] = useState(false);
  const [activeNews, setActiveNews] = useState(false);
  const [location] = useLocation();
  const menuCloseTimer = useRef<number | null>(null);

  const cancelMenuClose = () => {
    if (menuCloseTimer.current !== null) window.clearTimeout(menuCloseTimer.current);
    menuCloseTimer.current = null;
  };

  const scheduleMenuClose = (close: () => void) => {
    cancelMenuClose();
    menuCloseTimer.current = window.setTimeout(close, 180);
  };

  const openCompanyMenu = () => {
    cancelMenuClose();
    setActiveCompany(true);
    setActiveMega(false);
    setActiveServices(false);
    setActiveNews(false);
  };

  const openProductsMenu = () => {
    cancelMenuClose();
    setActiveCompany(false);
    setActiveMega(true);
    setActiveServices(false);
    setActiveNews(false);
  };

  const openServicesMenu = () => {
    cancelMenuClose();
    setActiveCompany(false);
    setActiveMega(false);
    setActiveServices(true);
    setActiveNews(false);
  };

  const openNewsMenu = () => {
    cancelMenuClose();
    setActiveCompany(false);
    setActiveMega(false);
    setActiveServices(false);
    setActiveNews(true);
  };

  const brandsQuery = trpc.menu.productBrands.useQuery();
  const itemsQuery = trpc.menu.productItems.useQuery();
  const storeProductsQuery = trpc.commerce.products.list.useQuery({ first: 12 });
  const servicesQuery = trpc.services.published.useQuery();
  const sparePartsQuery = trpc.parts.listParts.useQuery();

  const brands = brandsQuery.data ?? [];
  const items = itemsQuery.data ?? [];
  const italrayStoreProducts = (storeProductsQuery.data ?? []).filter(product => product.vendor === "Italray").slice(0, 6);

  const hermannBrand = brands.find(b => b.slug === "hermann");
  const hermannItems = items.filter(item => item.brandId === hermannBrand?.id);
  const searchItems = [
    ...italrayStoreProducts.map(product => ({ id: `product-${product.id}`, title: product.title, meta: product.vendor || "Product", href: `/store/products/${product.handle}` })),
    ...(servicesQuery.data ?? []).map(service => ({ id: `service-${service.id}`, title: String((service.data as Record<string, unknown>).name || service.slug), meta: "Service", href: `/services/${service.slug}` })),
    ...(sparePartsQuery.data ?? []).map(part => ({ id: `part-${part.id}`, title: part.name, meta: part.partNumber || "Spare part", href: "/spare-parts" })),
  ];

  // Keep the global navigation on a consistent white surface so the SPM mark and partner logos remain clear on every page.
  const isDarkNav = transparentHeader;
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
            ? "border-b border-white/10 bg-[#061f2b] shadow-sm"
            : "border-b border-[#dce7eb] bg-white/95 shadow-xs backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[80px] max-w-[1280px] items-center justify-between gap-6 px-5 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
            <span>
              <img
                src={isDarkNav ? darkNavLogo : logo}
                alt="SPM Medical Imaging and Surgical Technology"
                className="spm-header-logo h-14 w-auto max-w-[208px] object-contain transition-transform hover:scale-105 sm:h-16"
              />
            </span>
            <span className="sr-only">SPM - Systems for Projects & Maintenance</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 xl:gap-2 lg:flex" aria-label="Main Navigation">
            {/* 1. Company Dropdown */}
            <div
              className="relative"
              onMouseEnter={openCompanyMenu}
              onMouseLeave={() => scheduleMenuClose(() => setActiveCompany(false))}
            >
              <Link
                href="/about"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-4 text-sm font-semibold transition ${
                  location.startsWith("/about") || location.startsWith("/careers") || location.startsWith("/contact")
                    ? navActive
                    : navIdle
                }`}
                onFocus={openCompanyMenu}
                aria-expanded={activeCompany}
                aria-haspopup="menu"
                aria-controls="company-menu"
                onKeyDown={event => { if (event.key === "Escape") { setActiveCompany(false); event.currentTarget.blur(); } }}
              >
                Company
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isDarkNav ? "text-white/80" : "text-[#94a3b8]"} ${activeCompany ? "rotate-180" : ""}`} />
              </Link>
              <div
                id="company-menu"
                role="menu"
                className={`absolute left-0 top-full w-64 rounded-2xl border border-[#dce7eb] bg-white p-2.5 shadow-2xl transition-[opacity,transform,visibility] duration-250 ease-out ${
                  activeCompany ? "pointer-events-auto visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0"
                }`}
              >
                <Link href="/about" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  About SPM
                </Link>
                <Link href="/contact" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Contact & Locations
                </Link>
                <Link href="/careers" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Careers at SPM
                </Link>
              </div>
            </div>

            {/* Products - text-first category flyout */}
            <div
              className="relative"
              onMouseEnter={openProductsMenu}
              onMouseLeave={() => scheduleMenuClose(() => setActiveMega(false))}
            >
              <Link
                href="/catalogue"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-4 text-sm font-semibold transition ${
                  location.startsWith("/catalogue") || location.startsWith("/spare-parts") ? navActive : navIdle
                }`}
                onFocus={openProductsMenu}
                aria-expanded={activeMega}
                aria-haspopup="menu"
                aria-controls="products-menu"
                onKeyDown={event => { if (event.key === "Escape") { setActiveMega(false); event.currentTarget.blur(); } }}
              >
                Products
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isDarkNav ? "text-white/80" : "text-[#94a3b8]"} ${activeMega ? "rotate-180" : ""}`} />
              </Link>

              {/* Partner-led product flyout: transparent marks, clear hierarchy, and fast category scanning. */}
              <div
                id="products-menu"
                role="menu"
                className={`absolute left-1/2 top-full w-[840px] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-[26px] border border-[#dce7eb] bg-[#f5f9fb] p-2 shadow-[0_24px_70px_rgba(6,31,43,.22)] backdrop-blur-xl transition-[opacity,transform,visibility] duration-250 ease-out ${
                  activeMega ? "pointer-events-auto visible translate-y-1 opacity-100" : "pointer-events-none invisible translate-y-3 opacity-0"
                }`}
              >
                <div className="grid grid-cols-[235px_1fr] gap-2">
                  {/* Brand rail */}
                  <div className="space-y-1.5 rounded-[22px] bg-[linear-gradient(145deg,#eef8f8_0%,#e9f1f8_100%)] p-2.5 text-[#0a4052] shadow-inner shadow-white">
                    <div className="px-2.5 pb-1.5 pt-1">
                      <p className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#83e5d4]">SPM portfolio</p>
                      <p className="mt-1 text-xs leading-5 text-[#607d8b]">Choose a technology partner</p>
                    </div>

                    {/* Italray */}
                    <Link
                      href="/catalogue?brand=italray"
                      onMouseEnter={() => setActiveProductTab("italray")}
                      onClick={() => setActiveMega(false)}
                      className={`group relative flex flex-col items-start rounded-2xl p-2.5 transition duration-200 ${
                        activeProductTab === "italray" ? "bg-white text-[#0a4052] shadow-lg shadow-[#0a4052]/10 ring-1 ring-[#c8e3e8]" : "text-[#0a4052]/85 hover:bg-white/75 hover:text-[#0a4052]"
                      }`}
                    >
                      <div className="flex h-10 w-full items-center justify-start">
                        <img src={italrayLogo} alt="Italray logo" className="max-h-10 max-w-24 object-contain drop-shadow-[0_3px_10px_rgba(255,255,255,.16)]" />
                      </div>
                      <div className="mt-2 pr-6">
                        <p className="text-sm font-bold">Italray</p>
                        <p className="mt-0.5 text-[11px] leading-4 text-[#607d8b]">Exclusive Agent in Egypt</p>
                      </div>
                      <ChevronRight className={`absolute right-2.5 top-3 h-4 w-4 transition-transform ${activeProductTab === "italray" ? "translate-x-1" : ""}`} />
                    </Link>

                    {/* Hermann */}
                    <Link
                      href="/catalogue?brand=hermann"
                      onClick={() => setActiveMega(false)}
                      onMouseEnter={() => setActiveProductTab("hermann")}
                      className={`group relative flex cursor-pointer flex-col items-start rounded-2xl p-2.5 transition duration-200 ${
                        activeProductTab === "hermann" ? "bg-white text-[#0a4052] shadow-lg shadow-[#0a4052]/10 ring-1 ring-[#c8e3e8]" : "text-[#0a4052]/85 hover:bg-white/75 hover:text-[#0a4052]"
                      }`}
                    >
                      <div className="flex h-10 w-full items-center justify-start">
                        <img src={hermannLogo} alt="Hermann Medizintechnik logo" className="max-h-10 max-w-24 object-contain drop-shadow-[0_3px_10px_rgba(255,255,255,.16)]" />
                      </div>
                      <div className="mt-2 pr-6">
                        <p className="text-sm font-bold">Hermann</p>
                        <p className="mt-0.5 text-[11px] leading-4 text-[#607d8b]">Hermann portfolio</p>
                      </div>
                      <ChevronRight className={`absolute right-2.5 top-3 h-4 w-4 transition-transform ${activeProductTab === "hermann" ? "translate-x-1" : ""}`} />
                    </Link>

                    {/* 3. Spare Parts Module */}
                    <Link
                      href="/spare-parts"
                      onClick={() => setActiveMega(false)}
                      onMouseEnter={() => setActiveProductTab("parts")}
                      className={`group relative flex cursor-pointer flex-col items-start rounded-2xl p-2.5 transition duration-200 ${
                        activeProductTab === "parts" ? "bg-white text-[#0a4052] shadow-lg shadow-[#0a4052]/10 ring-1 ring-[#c8e3e8]" : "text-[#0a4052]/85 hover:bg-white/75 hover:text-[#0a4052]"
                      }`}
                    >
                      <div className="flex h-10 w-full items-center justify-start">
                        <img src={logo} alt="SPM logo" className="max-h-10 max-w-24 object-contain drop-shadow-[0_3px_10px_rgba(255,255,255,.16)]" />
                      </div>
                      <div className="mt-2 pr-6">
                        <p className="text-sm font-bold">Spare Parts</p>
                        <p className="mt-0.5 text-[11px] leading-4 text-[#607d8b]">Genuine parts & support</p>
                      </div>
                      <ChevronRight className={`absolute right-2.5 top-3 h-4 w-4 transition-transform ${activeProductTab === "parts" ? "translate-x-1" : ""}`} />
                    </Link>
                  </div>

                  {/* Right Column: Dynamic Content Pane */}
                  <div className="flex min-h-[330px] flex-col rounded-[22px] bg-white p-5">
                    {activeProductTab === "italray" ? (
                      <div className="animate-in fade-in slide-in-from-right-2 duration-250">
                        <div className="mb-4 flex items-end justify-between border-b border-[#eef3f5] pb-3">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#0f6fae]">Italray systems</span>
                            <p className="mt-1 text-sm font-bold text-[#0a2448]">Imaging built around the clinical workflow.</p>
                          </div>
                          <Link href="/catalogue?brand=italray" onClick={() => setActiveMega(false)} className="text-xs font-semibold text-[#d95316] hover:underline">
                            View all systems
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          {italrayCategoryLinks.map(({ label, href }, index) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setActiveMega(false)}
                              className="group flex min-h-[74px] items-start gap-3 rounded-2xl border border-[#e2e8f0] bg-[#fafcfd] px-3.5 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-[#0a4052] hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6fae] focus-visible:ring-offset-2"
                            >
                              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e4f2f5] text-[10px] font-extrabold text-[#0f6fae]">{String(index + 1).padStart(2, "0")}</span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[11px] font-extrabold leading-4 tracking-[0.06em] text-[#334155] group-hover:text-[#0f6fae]">{label}</span>
                                <span className="mt-1 block text-[10px] leading-4 text-[#64748b]">{italrayCategoryDescriptions[label]}</span>
                              </span>
                              <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-[#94a3b8] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#d95316]" aria-hidden="true" />
                            </Link>
                          ))}
                        </div>
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
                              <p className="mt-1 text-xs text-[#64748b]">SPM presents Hermann specialty instrumentation through a quote-first catalogue and technical review.</p>
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
                          <span className="text-xs font-bold uppercase tracking-wider text-[#0a4052]">Spare Parts</span>
                          <Link href="/spare-parts" onClick={() => setActiveMega(false)} className="text-xs font-semibold text-[#d95316] hover:underline">
                            Open spare parts
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            ["Genuine spare parts", "/spare-parts"],
                            ["Browse part categories", "/spare-parts"],
                            ["Request a part", "/request-a-quote?source=spare-parts"],
                            ["Service support", "/request-service?source=spare-parts"],
                          ].map(([label, href]) => (
                            <Link key={label} href={href} className="group rounded-xl border border-[#e2e8f0] bg-[#fafcfd] p-3 transition hover:border-[#0a4052] hover:bg-white hover:shadow-xs">
                              <Wrench className="h-4 w-4 text-[#0f6fae] transition group-hover:text-[#d95316]" />
                              <p className="mt-2 text-xs font-bold leading-4 text-[#1e293b] group-hover:text-[#0f6fae]">{label}</p>
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
              onMouseEnter={openServicesMenu}
              onMouseLeave={() => setActiveServices(false)}
            >
              <Link
                href="/services"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-4 text-sm font-semibold transition ${
                  location.startsWith("/services") ? navActive : navIdle
                }`}
                onFocus={openServicesMenu}
                aria-expanded={activeServices}
                aria-haspopup="menu"
                aria-controls="services-menu"
                onKeyDown={event => { if (event.key === "Escape") { setActiveServices(false); event.currentTarget.blur(); } }}
              >
                Services
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isDarkNav ? "text-white/80" : "text-[#94a3b8]"} ${activeServices ? "rotate-180" : ""}`} />
              </Link>
              <div
                id="services-menu"
                role="menu"
                className={`absolute left-0 top-full w-72 rounded-2xl border border-[#dce7eb] bg-white p-2.5 shadow-2xl transition-[opacity,transform,visibility] duration-250 ease-out ${
                  activeServices ? "pointer-events-auto visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0"
                }`}
              >
                <Link href="/services" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  All Services (10 Pillars)
                </Link>
                <Link href="/request-service" onClick={() => setActiveServices(false)} className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Request Service Visit
                </Link>
                <Link href="/maintenance-contracts" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Maintenance Contracts
                </Link>
              </div>
            </div>

            {/* 4. Events & News */}
            <div
              className="relative"
              onMouseEnter={openNewsMenu}
              onMouseLeave={() => setActiveNews(false)}
            >
              <Link
                href="/news"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-4 text-sm font-semibold transition ${
                  location.startsWith("/news") || location.startsWith("/events") || location.startsWith("/faqs")
                    ? navActive
                    : navIdle
                }`}
                onFocus={openNewsMenu}
                aria-expanded={activeNews}
                aria-haspopup="menu"
                aria-controls="news-menu"
                onKeyDown={event => { if (event.key === "Escape") { setActiveNews(false); event.currentTarget.blur(); } }}
              >
                Events & News
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isDarkNav ? "text-white/80" : "text-[#94a3b8]"} ${activeNews ? "rotate-180" : ""}`} />
              </Link>
              <div
                id="news-menu"
                role="menu"
                className={`absolute left-0 top-full w-64 rounded-2xl border border-[#dce7eb] bg-white p-2.5 shadow-2xl transition-[opacity,transform,visibility] duration-250 ease-out ${
                  activeNews ? "pointer-events-auto visible translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-2 opacity-0"
                }`}
              >
                <Link href="/news" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Latest News
                </Link>
                <Link href="/events" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  Upcoming Events
                </Link>
                <Link href="/faqs" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] transition hover:bg-[#eaf4fa] hover:text-[#0a4052]">
                  FAQs & Knowledge
                </Link>
              </div>
            </div>

          </nav>

          {/* Action CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            <SiteSearchDialog items={searchItems} />
            <Link href="/contact" className={`text-sm font-semibold transition-colors ${isDarkNav ? "text-white hover:text-[#8be0d5]" : "text-[#0a4052] hover:text-[#0f6fae]"}`}>Contact</Link>
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
            <div className="mb-4 flex items-center gap-2">
              <SiteSearchDialog items={searchItems} />
            </div>

            <div className="space-y-4 divide-y divide-[#f1f5f9]">
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">Company</p>
                <div className="mt-2 space-y-1">
                  <Link href="/about" onClick={() => setOpen(false)} className="block min-h-11 py-3 text-sm font-medium text-[#334155]">About SPM</Link>
                  <Link href="/contact" onClick={() => setOpen(false)} className="block min-h-11 py-3 text-sm font-medium text-[#334155]">Contact & Locations</Link>
                  <Link href="/careers" onClick={() => setOpen(false)} className="block min-h-11 py-3 text-sm font-medium text-[#334155]">Careers at SPM</Link>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">Products</p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  {italrayCategoryLinks.map(({ label, href }) => (
                    <Link key={href} href={href} onClick={() => setOpen(false)} className="block min-h-11 py-3 text-xs font-bold uppercase tracking-wide text-[#0a4052] hover:text-[#0f6fae]">{label}</Link>
                  ))}
                  <Link href="/catalogue?brand=hermann" onClick={() => setOpen(false)} className="block min-h-11 py-3 text-xs font-bold uppercase tracking-wide text-[#0a4052] hover:text-[#0f6fae]">Hermann</Link>
                  <Link href="/spare-parts" onClick={() => setOpen(false)} className="block min-h-11 py-3 text-xs font-bold uppercase tracking-wide text-[#0a4052] hover:text-[#0f6fae]">Spare Parts</Link>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">Services</p>
                <div className="mt-2 space-y-1">
                  <Link href="/services" onClick={() => setOpen(false)} className="block min-h-11 py-3 text-sm font-medium text-[#334155]">All Services (10 Pillars)</Link>
                  <Link href="/request-service" onClick={() => setOpen(false)} className="block min-h-11 py-3 text-sm font-medium text-[#334155]">Request Service Visit</Link>
                  <Link href="/maintenance-contracts" onClick={() => setOpen(false)} className="block min-h-11 py-3 text-sm font-medium text-[#334155]">Maintenance Contracts</Link>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">Events & News</p>
                <div className="mt-2 space-y-1">
                  <Link href="/news" onClick={() => setOpen(false)} className="block min-h-11 py-3 text-sm font-medium text-[#334155]">Latest News</Link>
                  <Link href="/events" onClick={() => setOpen(false)} className="block min-h-11 py-3 text-sm font-medium text-[#334155]">Upcoming Events</Link>
                  <Link href="/faqs" onClick={() => setOpen(false)} className="block min-h-11 py-3 text-sm font-medium text-[#334155]">FAQs & Support</Link>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/contact" onClick={() => setOpen(false)}>
                <Button className="w-full bg-[#0a4052] text-white hover:bg-[#063545]">Contact SPM</Button>
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
              <div className="inline-flex items-center">
                <img src={logo} alt="SPM" className="h-14 w-auto object-contain brightness-0 invert opacity-95" />
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#94a3b8]">
                Systems for Projects & Maintenance (SPM). Medical Imaging and Surgical Technology, genuine spare parts, and dedicated field engineering support across Egypt and the MENA region.
              </p>
              <div className="mt-4 border-t border-white/10 pt-3 text-xs text-[#64748b]">
                <p>Documented quality and technical review workflow</p>
                <p>Italray Exclusive Agent in Egypt · Hermann portfolio support</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8]">Imaging Portfolio</p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#cbd5e1]">
                <li><Link href="/catalogue?category=c-arm" className="hover:text-white">C-Arm Systems</Link></li>
                <li><Link href="/catalogue?category=mobile-radiography" className="hover:text-white">Mobile Radiography</Link></li>
                <li><Link href="/catalogue?category=fixed-x-ray" className="hover:text-white">Fixed X-Ray & DR</Link></li>
                <li><Link href="/catalogue?brand=italray" className="hover:text-white">Italray Solutions</Link></li>
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
                  <a href="tel:+201221888395" className="text-[#cbd5e1] hover:text-white">+20 12 21888395</a>
                </div>
                <div>
                  <p className="font-semibold text-white">GENERAL CORRESPONDENCE</p>
                  <a href="mailto:info@spmhospitals.com" className="text-[#cbd5e1] hover:text-white">info@spmhospitals.com</a>
                </div>
                <div>
                  <p className="font-semibold text-white">COMMERCIAL DEPARTMENT</p>
                  <a href="mailto:sales@spmhospitals.com" className="text-[#cbd5e1] hover:text-white">sales@spmhospitals.com</a>
                </div>
                <div>
                  <p className="font-semibold text-white">MAINTENANCE & FIELD ENGINEERING</p>
                  <a href="mailto:service@spmhospitals.com" className="text-[#cbd5e1] hover:text-white">service@spmhospitals.com</a>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <Button size="sm" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" asChild><Link href="/request-service">Request Service</Link></Button>
                <Button size="sm" className="bg-[#d95316] text-white hover:bg-[#b8430e]" asChild><Link href="/contact">Contact</Link></Button>
              </div>
              <div className="mt-5 flex items-center gap-2" aria-label="SPM social media">
                <a href="https://www.facebook.com/alanzema.Medical.equipment" target="_blank" rel="noreferrer" aria-label="SPM on Facebook" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[#cbd5e1] transition hover:border-[#5ed8db]/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ed8db]">
                  <Facebook className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href="https://www.linkedin.com/company/spm-solutions-eg/?viewAsMember=true" target="_blank" rel="noreferrer" aria-label="SPM on LinkedIn" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[#cbd5e1] transition hover:border-[#5ed8db]/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ed8db]">
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-[#64748b] sm:flex-row">
            <p>&copy; {new Date().getFullYear()} SPM (Systems for Projects & Maintenance). All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Use</Link>
              <Link
                href="/login"
                aria-label="Open internal staff sign in"
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 font-semibold text-[#cbd5e1] transition hover:border-[#5ed8db]/50 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ed8db]"
              >
                <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                Internal Access
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/201221888395?text=Hello%20SPM%2C%20I%20need%20help%20with%20medical%20imaging%20equipment."
        target="_blank"
        rel="noreferrer"
        aria-label="Contact SPM on WhatsApp"
        className="spm-whatsapp-float group fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,.35)] transition duration-200 hover:-translate-y-1 hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30"
      >
        <MessageCircle className="h-7 w-7" strokeWidth={2.25} />
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-[#061f2b] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition group-hover:block group-hover:opacity-100">
          Chat with SPM on WhatsApp
        </span>
      </a>
    </div>
  );
}
