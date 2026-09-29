import { useState } from "react";
import { ChevronDown, Menu, X, ArrowUpRight, LockKeyhole, Activity, Boxes, Layers, Stethoscope, Wrench, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const logo = "/manus-storage/spm-logo-cropped_7b519adc.webp";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  Boxes,
  Layers,
  Stethoscope,
  Wrench,
  ArrowUpRight,
  Sparkles,
};

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(false);
  const [location] = useLocation();

  const brandsQuery = trpc.menu.productBrands.useQuery();
  const itemsQuery = trpc.menu.productItems.useQuery();

  const brands = brandsQuery.data ?? [];
  const items = itemsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-[#f7fafc] text-[#17212b]">
      {/* Requirement 1: Top contact bar removed. Header is minimal and clean. */}
      <header className="sticky top-0 z-50 border-b border-[#dce7eb]/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[82px] max-w-[1280px] items-center justify-between gap-6 px-5 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
            <img src={logo} alt="SPM Medical Imaging Technology" className="h-12 w-auto object-contain" />
            <span className="sr-only">SPM</span>
          </Link>

          {/* Requirement 1 & 2: Navigation order (1. Company, 2. Products with Hover Mega Menu, 3. Services, 4. Events & News) */}
          <nav className="hidden items-center gap-2 lg:flex" aria-label="Main Navigation">
            {/* 1. Company */}
            <div className="group relative">
              <Link
                href="/about"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-5 text-sm font-semibold transition ${
                  location.startsWith("/about") || location.startsWith("/careers") || location.startsWith("/contact")
                    ? "text-[#0f6fae]"
                    : "text-[#334155] hover:text-[#0f6fae]"
                }`}
              >
                Company
                <ChevronDown className="h-3.5 w-3.5 text-[#94a3b8] transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              <div className="pointer-events-none absolute left-0 top-full w-64 translate-y-2 rounded-2xl border border-[#dce7eb] bg-white p-2.5 opacity-0 shadow-2xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <Link href="/about" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f0f7fb] hover:text-[#0f6fae]">
                  About SPM <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/contact" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f0f7fb] hover:text-[#0f6fae]">
                  Contact & Locations <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/careers" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f0f7fb] hover:text-[#0f6fae]">
                  Careers at SPM <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
              </div>
            </div>

            {/* 2. Products - Dynamic Mega Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveMega(true)}
              onMouseLeave={() => setActiveMega(false)}
            >
              <Link
                href="/catalogue"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-5 text-sm font-semibold transition ${
                  location.startsWith("/catalogue") ? "text-[#0f6fae]" : "text-[#334155] hover:text-[#0f6fae]"
                }`}
                aria-expanded={activeMega}
              >
                Products
                <ChevronDown className={`h-3.5 w-3.5 text-[#94a3b8] transition-transform duration-200 ${activeMega ? "rotate-180" : ""}`} />
              </Link>

              {/* Mega Menu Dropdown */}
              <div
                className={`absolute left-1/2 top-full w-[880px] -translate-x-1/2 rounded-3xl border border-[#dce7eb] bg-white/98 p-6 shadow-2xl backdrop-blur-xl transition-all duration-200 ${
                  activeMega ? "pointer-events-auto visible translate-y-1 opacity-100" : "pointer-events-none invisible translate-y-3 opacity-0"
                }`}
              >
                <div className="mb-4 flex items-center justify-between border-b border-[#eef3f5] pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f6fae]">Medical Imaging Systems</p>
                    <p className="text-sm font-medium text-[#64748b]">Explore global medical technology distributed and serviced by SPM.</p>
                  </div>
                  <Link href="/catalogue" className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#d95316] hover:underline">
                    View Entire Portfolio <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {brands.map(brand => {
                    const brandItems = items.filter(item => item.brandId === brand.id);
                    return (
                      <div key={brand.id} className="rounded-2xl border border-[#eef3f5] bg-[#fafcfd] p-4 transition hover:border-[#bcdde2] hover:bg-white">
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-[#0a4052]">{brand.name}</h3>
                              {brand.authorizedAgentLabel ? (
                                <span className="rounded-full bg-[#e6f4f8] px-2 py-0.5 text-[10px] font-bold text-[#085a73]">Agent</span>
                              ) : null}
                            </div>
                            <p className="text-xs text-[#64748b]">{brand.authorizedAgentLabel || brand.description}</p>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          {brandItems.map(item => {
                            const IconComponent = item.iconName && iconMap[item.iconName] ? iconMap[item.iconName] : ArrowUpRight;
                            const isViewAll = item.itemType === "view_all";

                            if (isViewAll) {
                              return (
                                <Link
                                  key={item.id}
                                  href={item.href}
                                  className="mt-2.5 flex items-center justify-between rounded-xl border border-dashed border-[#bcdde2] bg-[#f0f7fb] px-3 py-2 text-xs font-bold text-[#0f6fae] transition hover:bg-[#0f6fae] hover:text-white"
                                >
                                  <span>{item.label}</span>
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                              );
                            }

                            return (
                              <Link
                                key={item.id}
                                href={item.href}
                                className="group/item flex items-center gap-3 rounded-xl p-2 transition hover:bg-white hover:shadow-sm"
                              >
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.label}
                                    className="h-10 w-10 shrink-0 rounded-lg border border-[#e2e8f0] object-cover transition group-hover/item:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eaf4fa] text-[#0f6fae]">
                                    <IconComponent className="h-4 w-4" />
                                  </div>
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-semibold text-[#1e293b] group-hover/item:text-[#0f6fae]">{item.label}</p>
                                </div>
                                <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8] opacity-0 transition group-hover/item:opacity-100" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Services */}
            <div className="group relative">
              <Link
                href="/services"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-5 text-sm font-semibold transition ${
                  location.startsWith("/services") ? "text-[#0f6fae]" : "text-[#334155] hover:text-[#0f6fae]"
                }`}
              >
                Services
                <ChevronDown className="h-3.5 w-3.5 text-[#94a3b8] transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              <div className="pointer-events-none absolute left-0 top-full w-72 translate-y-2 rounded-2xl border border-[#dce7eb] bg-white p-2.5 opacity-0 shadow-2xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <Link href="/services" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f0f7fb] hover:text-[#0f6fae]">
                  All Services <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/request-service" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f0f7fb] hover:text-[#0f6fae]">
                  Request Service Visit <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/maintenance-contracts" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f0f7fb] hover:text-[#0f6fae]">
                  Maintenance Contracts <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/spare-parts" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f0f7fb] hover:text-[#0f6fae]">
                  Spare Parts Module <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
              </div>
            </div>

            {/* 4. Events & News */}
            <div className="group relative">
              <Link
                href="/news"
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-5 text-sm font-semibold transition ${
                  location.startsWith("/news") || location.startsWith("/events") || location.startsWith("/downloads") || location.startsWith("/faqs")
                    ? "text-[#0f6fae]"
                    : "text-[#334155] hover:text-[#0f6fae]"
                }`}
              >
                Events & News
                <ChevronDown className="h-3.5 w-3.5 text-[#94a3b8] transition-transform duration-200 group-hover:rotate-180" />
              </Link>
              <div className="pointer-events-none absolute left-0 top-full w-64 translate-y-2 rounded-2xl border border-[#dce7eb] bg-white p-2.5 opacity-0 shadow-2xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <Link href="/news" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f0f7fb] hover:text-[#0f6fae]">
                  Latest News <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/events" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f0f7fb] hover:text-[#0f6fae]">
                  Upcoming Events <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/downloads" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f0f7fb] hover:text-[#0f6fae]">
                  Download Center <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
                <Link href="/faqs" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#334155] hover:bg-[#f0f7fb] hover:text-[#0f6fae]">
                  FAQs & Support <ArrowUpRight className="h-3.5 w-3.5 text-[#94a3b8]" />
                </Link>
              </div>
            </div>
          </nav>

          {/* Action CTAs */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-[#dce7eb] bg-white px-3.5 py-2.5 text-xs font-bold text-[#334155] transition hover:border-[#0f6fae] hover:text-[#0f6fae]"
            >
              <LockKeyhole className="h-3.5 w-3.5 text-[#0f6fae]" />
              Sign in
            </Link>
            <Link href="/request-a-quote">
              <Button className="h-11 rounded-xl bg-[#f36b21] px-5 text-sm font-bold text-white shadow-md transition-all hover:bg-[#d95316] hover:shadow-lg active:scale-95">
                Request a Quote <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="rounded-xl border border-[#dce7eb] p-2.5 text-[#334155] lg:hidden"
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
                <LockKeyhole className="h-4 w-4 text-[#0f6fae]" /> Internal Sign in
              </span>
              <ArrowUpRight className="h-4 w-4 text-[#94a3b8]" />
            </Link>

            <div className="space-y-4 divide-y divide-[#f1f5f9]">
              {/* 1. Company */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">1. Company</p>
                <div className="mt-2 space-y-1 pl-2">
                  <Link href="/about" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-[#334155]">About SPM</Link>
                  <Link href="/contact" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-[#334155]">Contact Us</Link>
                  <Link href="/careers" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-[#334155]">Careers</Link>
                </div>
              </div>

              {/* 2. Products */}
              <div className="pt-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">2. Products & Brands</p>
                <div className="mt-2 space-y-2 pl-2">
                  <Link href="/catalogue" onClick={() => setOpen(false)} className="block py-1 text-sm font-bold text-[#0f6fae]">Browse Full Catalogue</Link>
                  {brands.map(brand => (
                    <div key={brand.id} className="rounded-lg bg-[#f8fafc] p-2.5">
                      <p className="text-xs font-bold text-[#0a4052]">{brand.name}</p>
                      <Link href={`/catalogue?brand=${brand.slug}`} onClick={() => setOpen(false)} className="mt-1 block text-xs text-[#0f6fae]">
                        View all {brand.name} →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Services */}
              <div className="pt-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">3. Services & Maintenance</p>
                <div className="mt-2 space-y-1 pl-2">
                  <Link href="/services" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-[#334155]">Services Overview</Link>
                  <Link href="/request-service" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-[#334155]">Request Service</Link>
                  <Link href="/spare-parts" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-[#334155]">Spare Parts</Link>
                  <Link href="/maintenance-contracts" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-[#334155]">Maintenance Contracts</Link>
                </div>
              </div>

              {/* 4. Events & News */}
              <div className="pt-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">4. Events & News</p>
                <div className="mt-2 space-y-1 pl-2">
                  <Link href="/news" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-[#334155]">Newsroom</Link>
                  <Link href="/events" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-[#334155]">Events</Link>
                  <Link href="/downloads" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-[#334155]">Downloads</Link>
                  <Link href="/faqs" onClick={() => setOpen(false)} className="block py-1 text-sm font-medium text-[#334155]">FAQs</Link>
                </div>
              </div>
            </div>

            <Link href="/request-a-quote" onClick={() => setOpen(false)} className="mt-6 block">
              <Button className="w-full bg-[#f36b21] py-6 text-sm font-bold text-white hover:bg-[#d95316]">
                Request a Quote
              </Button>
            </Link>
          </div>
        ) : null}
      </header>

      {children}

      {/* Global Footer containing full contact information per Requirement 1 */}
      <footer className="bg-[#0a4052] text-white">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 lg:grid-cols-[1.3fr_0.9fr_0.9fr_1.1fr] lg:px-8">
          <div>
            <div className="mb-5 inline-flex rounded-xl bg-white p-2.5">
              <img src={logo} alt="SPM" className="h-12 w-auto object-contain" />
            </div>
            <p className="max-w-sm text-sm leading-7 text-white/70">
              Systems for Projects & Maintenance (SPM). Medical imaging technology, genuine spare parts, and dedicated field engineering support across Egypt and the MENA region.
            </p>
            <div className="mt-6 space-y-2 text-xs text-white/60">
              <p>Certified Quality Processes: ISO 13485 & CE Directives</p>
              <p>Exclusive and Authorized Partner in Egypt for Select Global Manufacturers</p>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#60c1bb]">Imaging Portfolio</p>
            <div className="grid gap-3 text-sm text-white/75">
              <Link href="/catalogue?category=c-arm" className="hover:text-white">C-Arm Systems</Link>
              <Link href="/catalogue?category=mobile-xray" className="hover:text-white">Mobile Radiography</Link>
              <Link href="/catalogue?category=fixed-xray" className="hover:text-white">Fixed X-Ray & DR</Link>
              <Link href="/catalogue?brand=italray" className="hover:text-white">Italray Solutions</Link>
              <Link href="/spare-parts" className="hover:text-white">Spare Parts Module</Link>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#60c1bb]">Support & Insight</p>
            <div className="grid gap-3 text-sm text-white/75">
              <Link href="/services" className="hover:text-white">Service Capabilities</Link>
              <Link href="/maintenance-contracts" className="hover:text-white">Maintenance Contracts</Link>
              <Link href="/downloads" className="hover:text-white">Document Request Center</Link>
              <Link href="/faqs" className="hover:text-white">Frequently Asked Questions</Link>
              <Link href="/news" className="hover:text-white">News & Publications</Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#60c1bb]">Contact & Support</p>
            <div className="space-y-3 text-sm text-white/80">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Central Phone / WhatsApp</p>
                <a href="tel:+201221888395" className="font-semibold text-white hover:text-[#60c1bb]">+20 12 21888395</a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">General Correspondence</p>
                <a href="mailto:info@spmhospitals.com" className="font-semibold text-white hover:text-[#60c1bb]">info@spmhospitals.com</a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Commercial Department</p>
                <a href="mailto:sales@spmhospitals.com" className="text-white hover:text-[#60c1bb]">sales@spmhospitals.com</a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/50">Maintenance & Field Engineering</p>
                <a href="mailto:service@spmhospitals.com" className="text-white hover:text-[#60c1bb]">service@spmhospitals.com</a>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/request-service" className="inline-flex rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-[#8be0d5] hover:bg-white/20">
                Request Service
              </Link>
              <Link href="/request-a-quote" className="inline-flex rounded-lg bg-[#f36b21] px-3 py-2 text-xs font-bold text-white hover:bg-[#d95316]">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-5 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <span>© {new Date().getFullYear()} SPM (Systems for Projects & Maintenance). All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Use</Link>
              <Link href="/login" className="hover:text-white">Internal Sign in</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
