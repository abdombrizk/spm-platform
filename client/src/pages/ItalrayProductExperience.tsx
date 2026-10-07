import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  FileDown,
  FileText,
  HelpCircle,
  Info,
  Layers,
  Mail,
  Maximize2,
  Monitor,
  PhoneCall,
  Play,
  RotateCcw,
  ScanLine,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";
import type { Product } from "@shared/commerce/types";
import { getItalrayProductMeta, type ItalrayProductMeta } from "@shared/commerce/italrayMeta";

const italrayLogo = "/manus-storage/italray-logo_57cfff13.png";

type SubnavItem = {
  id: string;
  label: string;
};

const SUBNAV_SECTIONS: SubnavItem[] = [
  { id: "section-description", label: "Description" },
  { id: "section-gallery", label: "Clinical Images" },
  { id: "section-inuse", label: "In Use & Resources" },
  { id: "section-upgrades", label: "Upgrades" },
  { id: "section-specifications", label: "Technical Information" },
  { id: "section-service", label: "SPM Service & Support" },
  { id: "section-contact", label: "Contact Us" },
];

export default function ItalrayProductExperience({ product }: { product: Product }) {
  const meta: ItalrayProductMeta = useMemo(() => {
    return getItalrayProductMeta(product.handle);
  }, [product.handle]);

  const overrideQuery = trpc.products.italrayPresentation.useQuery(
    { handle: product.handle },
    { staleTime: 30 * 1000 }
  );

  const activeMeta: ItalrayProductMeta = useMemo(() => {
    const o = overrideQuery.data;
    if (!o) return meta;
    try {
      return {
        ...meta,
        title: o.title || meta.title,
        badge: o.badge || meta.badge,
        headline: o.headline || meta.headline,
        subheadline: o.subheadline || meta.subheadline,
        leadParagraph: o.leadParagraph || meta.leadParagraph,
        secondaryParagraph: o.secondaryParagraph || meta.secondaryParagraph,
        heroImage: o.heroImage || meta.heroImage,
        descriptionImage: o.descriptionImage || meta.descriptionImage,
        brochureUrl: o.brochureUrl || meta.brochureUrl,
        brochureTitle: o.brochureTitle || meta.brochureTitle,
        highlights: o.highlightsJson ? JSON.parse(o.highlightsJson) : meta.highlights,
        pillars: o.pillarsJson ? JSON.parse(o.pillarsJson) : meta.pillars,
        clinicalGallery: o.clinicalGalleryJson ? JSON.parse(o.clinicalGalleryJson) : meta.clinicalGallery,
        upgrades: o.upgradesJson ? JSON.parse(o.upgradesJson) : meta.upgrades,
        specifications: o.specificationsJson ? JSON.parse(o.specificationsJson) : meta.specifications,
      };
    } catch {
      return meta;
    }
  }, [meta, overrideQuery.data]);

  const heroPosition = overrideQuery.data?.heroObjectPosition || "center center";
  const heroScale = (overrideQuery.data?.heroScalePercent ?? 100) / 100;
  const descriptionPosition = overrideQuery.data?.descriptionObjectPosition || "center center";
  const heroStageBackground = activeMeta.handle === "italray-x-frame-dr-systems" ? "bg-[#eef5f7]" : "bg-white";

  const [activeSection, setActiveSection] = useState("section-description");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<(typeof activeMeta.clinicalGallery)[0] | null>(null);
  const [activeClinicalIndex, setActiveClinicalIndex] = useState(0);
  const [activeUpgradeTab, setActiveUpgradeTab] = useState<"hardware" | "software" | "packages">("hardware");
  const [carmexVariant, setCarmexVariant] = useState<"rotating" | "fixed">("rotating");
  const [expandedSpecCategories, setExpandedSpecCategories] = useState<Record<string, boolean>>({
    [activeMeta.specifications[0]?.category || ""]: true,
    [activeMeta.specifications[1]?.category || ""]: true,
  });

  // Track scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);

      // Check current section
      for (let i = SUBNAV_SECTIONS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(SUBNAV_SECTIONS[i].id);
        if (sec) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 140) {
            setActiveSection(SUBNAV_SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (activeMeta.clinicalGallery.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveClinicalIndex((current) => (current + 1) % activeMeta.clinicalGallery.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [activeMeta.clinicalGallery.length]);

  const quoteHref = `/request-a-quote?equipment=${encodeURIComponent(activeMeta.title)}&brand=Italray&model=${encodeURIComponent(activeMeta.handle)}`;
  const serviceHref = `/request-service?equipment=${encodeURIComponent(activeMeta.title)}&brand=Italray&model=${encodeURIComponent(activeMeta.handle)}`;
  const activeClinicalItem = activeMeta.clinicalGallery[activeClinicalIndex] || activeMeta.clinicalGallery[0];
  const isCarmex = activeMeta.handle === "italray-carmex-fp21-fp30";
  const carmexQuickSpecs = carmexVariant === "rotating"
    ? [
        { label: "Generator", value: "5 kW" },
        { label: "Tube capacity", value: "300 KHU" },
        { label: "Fluoroscopy", value: "Up to 15 fps" },
        { label: "Pixel size", value: "200 µm" },
      ]
    : [
        { label: "Generator", value: "4 kW" },
        { label: "Tube capacity", value: "79.8 KHU" },
        { label: "Detector format", value: "21×21 cm" },
        { label: "Workflow", value: "Fixed anode" },
      ];

  const moveClinicalSlide = (direction: -1 | 1) => {
    setActiveClinicalIndex((current) => {
      const next = current + direction;
      if (next < 0) return activeMeta.clinicalGallery.length - 1;
      if (next >= activeMeta.clinicalGallery.length) return 0;
      return next;
    });
  };

  // Related products query
  const relatedQuery = trpc.commerce.products.list.useQuery({ first: 20 }, { staleTime: 60 * 1000 });
  const relatedItalray = useMemo(() => {
    return (relatedQuery.data || [])
      .filter((p) => p.id !== product.id && (p.vendor?.toLowerCase() === "italray" || p.title.toLowerCase().includes("italray")))
      .slice(0, 4);
  }, [product.id, relatedQuery.data]);

  const toggleCategory = (cat: string) => {
    setExpandedSpecCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const expandAllSpecs = () => {
    const all: Record<string, boolean> = {};
    activeMeta.specifications.forEach((s) => (all[s.category] = true));
    setExpandedSpecCategories(all);
  };

  const collapseAllSpecs = () => {
    setExpandedSpecCategories({});
  };

  return (
    <>
      <SEOHead
        title={`${activeMeta.title} | Italray Medical Imaging`}
        description={activeMeta.leadParagraph}
        image={activeMeta.heroImage}
        url={`/store/products/${activeMeta.handle}`}
      />

      <div className="bg-white text-[#17212b] antialiased selection:bg-[#0a4052] selection:text-white">
        {/* ========================================================= */}
        {/* 1. BREADCRUMBS & TOP CONTEXT */}
        {/* ========================================================= */}
        <div className="border-b border-[#e5e7eb] bg-[#f8fafc]">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3 lg:px-10">
            <nav className="flex items-center gap-2 text-xs font-semibold text-[#64748b]">
              <Link href="/" className="hover:text-[#0a4052]">
                Home
              </Link>
              <span className="text-[#cbd5e1]">&gt;</span>
              <Link href="/catalogue/italray" className="hover:text-[#0a4052]">
                Product Portfolio
              </Link>
              <span className="text-[#cbd5e1]">&gt;</span>
              <span className="truncate font-bold text-[#0a4052]">{activeMeta.title}</span>
            </nav>

            <div className="hidden items-center gap-3 sm:flex">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3 py-1 text-[11px] font-bold text-[#0a4052]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#0f6fae]" />
                SPM Exclusive Authorized Agency
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. PRODUCT HERO STAGE (Ziehm-Style Centered Showcase) */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-white to-white pb-12 pt-8 sm:pb-20 sm:pt-14">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            {/* Centered Brand & Headline */}
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center justify-center gap-3">
                <img
                  src={italrayLogo}
                  alt="Italray"
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-105"
                />
                <span className="h-4 w-px bg-[#cbd5e1]" />
                <span className="text-xs font-bold uppercase tracking-[.22em] text-[#0f6fae]">{activeMeta.badge}</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-[-.04em] text-[#0a4052] sm:text-6xl lg:text-7xl">
                {activeMeta.title}
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-[#475569] sm:text-xl">
                {activeMeta.headline}
              </p>
            </div>

            {/* Prominent Hero Showcase with Ambient Glow & Floating Badges */}
            <div className="relative mx-auto mt-10 max-w-5xl">
              {/* Radial backdrop glow */}
              <div
                className="pointer-events-none absolute inset-0 -top-12 z-0 mx-auto h-[480px] w-[80%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(15,111,174,0.14),transparent_65%)] blur-2xl"
                aria-hidden="true"
              />

              {/* Main Image Stage */}
              <div className={`relative z-10 flex min-h-[380px] items-center justify-center rounded-3xl border p-6 shadow-[0_24px_80px_rgba(10,64,82,0.10)] sm:min-h-[520px] sm:p-12 ${isCarmex ? "border-[#183f4e] bg-[radial-gradient(circle_at_50%_0%,#174e62_0%,#092936_56%,#061b24_100%)]" : `${heroStageBackground} border-[#dbe9ee]`}`}>
                {isCarmex ? <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true"><div className="absolute inset-0 bg-[linear-gradient(rgba(139,224,213,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(139,224,213,.07)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" /><div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#c2410c]/20 blur-3xl" /></div> : null}
                <img
                  src={activeMeta.heroImage}
                  alt={activeMeta.title}
                  loading="eager"
                  decoding="async"
                  style={{
                    objectPosition: heroPosition,
                    transform: heroScale !== 1 ? `scale(${heroScale})` : undefined,
                  }}
                  className={`pdp-product-image relative z-10 max-h-[460px] w-auto max-w-full object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105 ${isCarmex ? "rounded-2xl shadow-[0_28px_55px_rgba(0,0,0,.35)]" : ""}`}
                />
                {isCarmex ? <div className="absolute left-5 top-5 z-20 rounded-full border border-[#8be0d5]/35 bg-[#061b24]/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-[#b9f1e7] backdrop-blur sm:left-8 sm:top-8">RK FP-S / Mobile C-Arm</div> : null}

                {/* Left Floating Feature Badge */}
                <div className="absolute bottom-6 left-6 hidden rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lg backdrop-blur md:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf4fa] text-[#0a4052]">
                      <ScanLine className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Engineered In</p>
                      <p className="text-sm font-extrabold text-[#0a4052]">Florence, Italy</p>
                    </div>
                  </div>
                </div>

                {/* Right Floating Feature Badge */}
                <div className="absolute bottom-6 right-6 hidden rounded-2xl border border-white/80 bg-white/95 p-4 shadow-lg backdrop-blur md:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1ed] text-[#c2410c]">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Supported Across Egypt</p>
                      <p className="text-sm font-extrabold text-[#0a4052]">By SPM Certified Engineers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Centered Highlights Ribbon */}
            <div className="mx-auto mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
              {activeMeta.highlights.map((h, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 rounded-full border border-[#dce7eb] bg-white px-4 py-2 text-xs font-bold text-[#334155] shadow-xs"
                >
                  <Check className="h-3.5 w-3.5 text-[#047857]" />
                  {h}
                </span>
              ))}
            </div>
            {isCarmex ? (
              <section aria-label="CARMEX RK FP-S configuration overview" className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[2rem] border border-[#1d5365] bg-[#061b24] text-white shadow-[0_24px_80px_rgba(6,27,36,.22)]">
                <div className="flex flex-col gap-5 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#8be0d5]">CARMEX command deck</p>
                    <h2 className="mt-1 text-lg font-extrabold sm:text-xl">Choose the published generator configuration</h2>
                  </div>
                  <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-1 text-xs font-bold">
                    <button type="button" onClick={() => setCarmexVariant("rotating")} className={`rounded-lg px-3 py-2 transition ${carmexVariant === "rotating" ? "bg-[#8be0d5] text-[#061b24]" : "text-white/65 hover:text-white"}`}>Rotating Anode</button>
                    <button type="button" onClick={() => setCarmexVariant("fixed")} className={`rounded-lg px-3 py-2 transition ${carmexVariant === "fixed" ? "bg-[#c2410c] text-white" : "text-white/65 hover:text-white"}`}>Fixed Anode</button>
                  </div>
                </div>
                <div className="grid gap-px bg-white/10 sm:grid-cols-4">
                  {carmexQuickSpecs.map((spec) => <div key={spec.label} className="bg-[#061b24] px-5 py-5 sm:px-6"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/45">{spec.label}</p><p className="mt-2 text-xl font-extrabold tracking-tight text-white">{spec.value}</p></div>)}
                </div>
                <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-8"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#8be0d5]" /> Final configuration is confirmed during the hospital quotation process.</span><Link href={quoteHref} className="inline-flex items-center gap-1 font-extrabold text-[#8be0d5] hover:text-white">Configure for your site <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
              </section>
            ) : null}
          </div>

          {/* ========================================================= */}
          {/* QUICK-ACCESS FLOATING WIDGET (Like Ziehm Right-Side Flags) */}
          {/* ========================================================= */}
          <aside
            aria-label="Quick Actions"
            className="fixed bottom-6 right-6 z-40 hidden flex-col gap-2.5 xl:flex"
          >
            <Link
              href={quoteHref}
              className="group flex items-center gap-3 rounded-2xl border border-[#0a4052] bg-[#0a4052] px-4 py-3 text-white shadow-2xl transition-all duration-200 hover:-translate-x-1 hover:bg-[#072c38] active:scale-95"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white">
                <Mail className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Direct Inquiry</p>
                <p className="text-xs font-extrabold text-white">Request Quotation</p>
              </div>
            </Link>

            <a
              href={activeMeta.brochureUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 rounded-2xl border border-[#dce7eb] bg-white px-4 py-3 text-[#0a4052] shadow-xl transition-all duration-200 hover:-translate-x-1 hover:border-[#0a4052] hover:bg-[#f8fafc] active:scale-95"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf4fa] text-[#0a4052]">
                <FileDown className="h-4 w-4" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">Official PDF</p>
                <p className="text-xs font-extrabold text-[#0a4052]">Download Brochure</p>
              </div>
            </a>
          </aside>
        </section>

        {/* ========================================================= */}
        {/* 3. STICKY SUB-NAVIGATION WITH SCROLL INDICATOR */}
        {/* ========================================================= */}
        <div
          id="scrollindicator"
          className="sticky top-0 z-30 border-y border-[#dce7eb] bg-white/95 shadow-xs backdrop-blur-md"
        >
          {/* Scroll progress bar */}
          <div className="h-1 w-full bg-[#f1f5f9]">
            <div
              className="h-full bg-gradient-to-r from-[#0a4052] via-[#0f6fae] to-[#2b8c88] transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-2.5 lg:px-10">
            {/* Scrollable anchor tabs */}
            <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              {SUBNAV_SECTIONS.map((tab) => {
                const isActive = activeSection === tab.id;
                return (
                  <a
                    key={tab.id}
                    href={`#${tab.id}`}
                    onClick={() => setActiveSection(tab.id)}
                    className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? "bg-[#0a4052] text-white shadow-xs"
                        : "text-[#64748b] hover:bg-[#eaf4fa] hover:text-[#0a4052]"
                    }`}
                  >
                    {tab.label}
                  </a>
                );
              })}
            </nav>

            {/* Quick CTA on the sticky bar */}
            <div className="hidden shrink-0 items-center gap-2 md:flex">
              <a
                href={activeMeta.brochureUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#dce7eb] bg-white px-3 py-1.5 text-xs font-bold text-[#0a4052] hover:bg-[#eaf4fa]"
              >
                <Download className="h-3.5 w-3.5" /> Brochure
              </a>
              <Button size="sm" className="h-8 rounded-xl bg-[#c2410c] px-3.5 text-xs font-bold text-white hover:bg-[#9a3412]" asChild><Link href={quoteHref}>
                  Request Quote <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link></Button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. SECTION: DESCRIPTION & TECHNICAL PILLARS */}
        {/* ========================================================= */}
        <section id="section-description" className="scroll-mt-16 border-b border-[#e5e7eb] py-16 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            {/* Editorial Lead Block */}
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-[.22em] text-[#0f6fae]">
                  Clinical Architecture & Overview
                </span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-5xl">
                  {activeMeta.subheadline}
                </h2>
                <p className="mt-6 text-base leading-relaxed text-[#334155] sm:text-lg">
                  {activeMeta.leadParagraph}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[#64748b]">
                  {activeMeta.secondaryParagraph}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button size="lg" className="h-12 rounded-xl bg-[#c2410c] px-6 font-bold text-white shadow-md shadow-[#c2410c]/20 hover:bg-[#9a3412]" asChild><Link href={quoteHref}>
                      Request Hospital Quotation <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link></Button>
                  <Button size="lg" variant="outline" className="h-12 rounded-xl border-[#0a4052] font-bold text-[#0a4052] hover:bg-[#eaf4fa]" asChild><a href={activeMeta.brochureUrl} target="_blank" rel="noreferrer">
                      <Download className="mr-2 h-4 w-4" /> Download PDF Specifications
                    </a></Button>
                </div>
              </div>

              {/* Secondary Detail Image Showcase */}
              <div className="lg:col-span-5">
                <div className="group relative overflow-hidden rounded-3xl border border-[#dce7eb] bg-[#f8fafc] p-6 shadow-md transition-all duration-300 hover:shadow-xl sm:p-10">
                  <div className="aspect-4/3 w-full overflow-hidden">
                    <img
                      src={activeMeta.descriptionImage}
                      alt={`${activeMeta.title} detailed system setup`}
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: descriptionPosition }}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 border-t border-[#e2e8f0] pt-4 text-center">
                    <p className="text-xs font-bold text-[#0a4052]">Italray Modular Engineering</p>
                    <p className="mt-0.5 text-[11px] text-[#64748b]">Calibrated and serviced by SPM biomedical personnel</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Pillars Grid (Ziehm-style feature cards with clean typography) */}
            <div className="mt-20">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[.22em] text-[#0f6fae]">
                  Engineering Innovations
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-[#0a4052] sm:text-4xl">
                  Technological pillars that define this platform
                </h3>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {activeMeta.pillars.map((pillar) => (
                  <div
                    key={pillar.number}
                    className="relative overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0f6fae]/50 hover:shadow-xl sm:p-9"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold tracking-widest text-[#0f6fae]">
                        PILLAR {pillar.number}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#eaf4fa] font-mono text-xs font-extrabold text-[#0a4052]">
                        {pillar.number}
                      </span>
                    </div>

                    <h4 className="mt-4 text-xl font-extrabold tracking-tight text-[#0a4052]">
                      {pillar.title}
                    </h4>

                    <p className="mt-3 text-sm leading-relaxed text-[#64748b]">
                      {pillar.description}
                    </p>

                    <ul className="mt-6 space-y-2.5 border-t border-[#f1f5f9] pt-6">
                      {pillar.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs font-semibold leading-relaxed text-[#334155]">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0f6fae]" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 5. SECTION: CLINICAL IMAGE GALLERY (Ziehm-Style Lightbox) */}
        {/* ========================================================= */}
        <section id="section-gallery" className="scroll-mt-16 border-b border-[#e5e7eb] bg-[#f8fafc] py-16 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.22em] text-[#0f6fae]">
                  Clinical Diagnostics in Focus
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-5xl">
                  The clinical image quality of {activeMeta.title}
                </h2>
                <p className="mt-3 text-sm text-[#64748b]">
                  Inspect live clinical procedures, bone trabecular sharpness, and soft-tissue delineation.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#64748b]">
                <Maximize2 className="h-4 w-4 text-[#0f6fae]" /> Click any case to enlarge
              </span>
            </div>

            {/* Ziehm-style clinical image carousel */}
            <div className="relative mt-12 overflow-hidden rounded-[2rem] bg-[#181a1d] px-5 py-10 shadow-2xl sm:px-10 sm:py-14 lg:px-16">
              <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
                <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#0f6fae]/20 blur-3xl" />
                <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#2b8c88]/10 blur-3xl" />
              </div>

              <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8be0d5]">
                    Clinical Image Gallery
                  </p>
                  <h3 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
                    The best clinical images of the <span className="text-[#5ed8db]">{activeMeta.title}</span>
                  </h3>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-white/55">
                  <Maximize2 className="h-4 w-4" /> Click an image to enlarge
                </span>
              </div>

              <div className="relative z-10 mt-10">
                <div className="flex items-center gap-3 sm:gap-6">
                  <button
                    type="button"
                    aria-label="Previous clinical image"
                    onClick={() => moveClinicalSlide(-1)}
                    className="z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-[#5ed8db] hover:bg-[#5ed8db] hover:text-[#0b252d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ed8db] sm:h-12 sm:w-12"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-stretch justify-center gap-3 sm:gap-5">
                      {activeMeta.clinicalGallery.map((item, idx) => {
                        const distance = Math.abs(idx - activeClinicalIndex);
                        const isActive = idx === activeClinicalIndex;
                        const isVisible = distance <= 1 || activeMeta.clinicalGallery.length <= 3;
                        if (!isVisible) return null;
                        return (
                          <button
                            key={`${item.title}-${idx}`}
                            type="button"
                            aria-label={`View ${item.title}`}
                            aria-current={isActive ? "true" : undefined}
                            onClick={() => {
                              setActiveClinicalIndex(idx);
                              setSelectedGalleryItem(item);
                            }}
                            className={`group relative min-w-0 overflow-hidden rounded-xl border text-left transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ed8db] ${
                              isActive
                                ? "w-[min(68vw,620px)] border-[#5ed8db]/70 bg-black shadow-[0_0_0_1px_rgba(94,216,219,.18),0_18px_55px_rgba(0,0,0,.4)] sm:w-[min(52vw,620px)]"
                                : "hidden w-[min(24vw,250px)] border-white/10 bg-black/60 opacity-45 hover:opacity-80 sm:block"
                            }`}
                          >
                            <div className="relative aspect-[16/8.5] overflow-hidden bg-[#0b0d0f]">
                              {(item as typeof item & { mediaType?: string }).mediaType === "video" ? (
                                <video
                                  src={item.image}
                                  aria-label={item.title}
                                  muted
                                  loop
                                  playsInline
                                  autoPlay={isActive}
                                  controls={isActive}
                                  className={`h-full w-full object-cover transition duration-700 ${isActive ? "scale-100 group-hover:scale-105" : "scale-105 group-hover:scale-100"}`}
                                />
                              ) : (
                                <img
                                  src={item.image}
                                  alt={(item as typeof item & { alt?: string }).alt || item.title}
                                  loading={isActive ? "eager" : "lazy"}
                                  decoding="async"
                                  className={`h-full w-full object-cover transition duration-700 ${
                                    isActive ? "scale-100 group-hover:scale-105" : "scale-105 group-hover:scale-100"
                                  }`}
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
                              {(item as typeof item & { textOverlay?: string }).textOverlay ? (
                                <span className="absolute left-3 top-3 max-w-[75%] rounded-md bg-[#0f6fae]/90 px-2.5 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur">
                                  {(item as typeof item & { textOverlay?: string }).textOverlay}
                                </span>
                              ) : null}
                              <span className="absolute bottom-3 left-3 rounded-md bg-black/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                                {item.category}
                              </span>
                              {isActive && (
                                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-black/65 text-white backdrop-blur">
                                  <Maximize2 className="h-4 w-4" />
                                </span>
                              )}
                            </div>
                            {isActive && (
                              <div className="border-t border-white/10 bg-[#111315] px-4 py-3 sm:px-5">
                                <h4 className="text-sm font-extrabold text-white sm:text-base">{item.title}</h4>
                                <p className="mt-1 line-clamp-1 text-xs text-white/55">{item.description}</p>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Next clinical image"
                    onClick={() => moveClinicalSlide(1)}
                    className="z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-[#5ed8db] hover:bg-[#5ed8db] hover:text-[#0b252d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5ed8db] sm:h-12 sm:w-12"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2">
                  {activeMeta.clinicalGallery.map((item, idx) => (
                    <button
                      key={`dot-${item.title}`}
                      type="button"
                      aria-label={`Go to clinical image ${idx + 1}`}
                      aria-current={idx === activeClinicalIndex ? "true" : undefined}
                      onClick={() => setActiveClinicalIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeClinicalIndex ? "w-8 bg-[#5ed8db]" : "w-1.5 bg-white/30 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSelectedGalleryItem(activeClinicalItem)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white/75 transition hover:border-[#5ed8db] hover:bg-white/10 hover:text-white"
                  >
                    <Eye className="h-4 w-4 text-[#5ed8db]" /> Inspect active clinical case
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Lightbox Modal */}
          {selectedGalleryItem && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md animate-in fade-in duration-200"
              onClick={() => setSelectedGalleryItem(null)}
            >
              <div
                className="relative max-h-[92vh] max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#061f2b] p-6 text-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Close dialog"
                  onClick={() => setSelectedGalleryItem(null)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="aspect-16/10 w-full overflow-hidden rounded-2xl bg-black/60">
                  {(selectedGalleryItem as typeof selectedGalleryItem & { mediaType?: string }).mediaType === "video" ? (
                    <video src={selectedGalleryItem.image} aria-label={selectedGalleryItem.title} controls autoPlay playsInline className="h-full w-full object-contain" />
                  ) : (
                    <img src={selectedGalleryItem.image} alt={(selectedGalleryItem as typeof selectedGalleryItem & { alt?: string }).alt || selectedGalleryItem.title} className="h-full w-full object-contain" />
                  )}
                </div>

                <div className="mt-5">
                  <span className="rounded-md bg-[#0f6fae] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    {selectedGalleryItem.category}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-white">{selectedGalleryItem.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">{selectedGalleryItem.description}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ========================================================= */}
        {/* 6. SECTION: IN USE & RESOURCES (Ziehm-Style Documentation Cards) */}
        {/* ========================================================= */}
        <section id="section-inuse" className="scroll-mt-16 border-b border-[#e5e7eb] py-16 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#0f6fae]">
                Clinical Documentation & Planning
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-5xl">
                Find out more about the versatile possibilities in clinical use
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#64748b]">
                Download official manufacturer brochures, site planning specifications, and procurement dossiers for {activeMeta.title}.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Card 1: Official Product Brochure */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#dce7eb] bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0a4052] hover:shadow-xl sm:p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-[#eaf4fa] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0a4052]">
                      Product Brochure
                    </span>
                    <span className="text-xs text-[#94a3b8]">Reading: {meta.readingMinutes} min</span>
                  </div>

                  <h3 className="mt-6 text-xl font-extrabold text-[#0a4052] group-hover:text-[#0f6fae]">
                    {meta.brochureTitle}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-[#64748b]">
                    Detailed mechanical layouts, electrical input tolerances, detector MTF curves, and room clearance diagrams.
                  </p>
                </div>

                <div className="mt-8 border-t border-[#f1f5f9] pt-5">
                  <a
                    href={activeMeta.brochureUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a4052] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#072c38]"
                  >
                    <Download className="h-4 w-4" /> Open Official PDF
                  </a>
                </div>
              </div>

              {/* Card 2: Pre-Installation & Site Survey Pack */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#dce7eb] bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0a4052] hover:shadow-xl sm:p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-[#fff1ed] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#c2410c]">
                      Architectural Guide
                    </span>
                    <span className="text-xs text-[#94a3b8]">SPM Engineering</span>
                  </div>

                  <h3 className="mt-6 text-xl font-extrabold text-[#0a4052] group-hover:text-[#c2410c]">
                    Pre-Installation & Shielding Checklist
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-[#64748b]">
                    Lead glass calculations, power supply stabilization (3-phase/single-phase), ceiling anchor structural loads, and floor leveling guidelines.
                  </p>
                </div>

                <div className="mt-8 border-t border-[#f1f5f9] pt-5">
                  <Link
                    href={serviceHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0a4052] bg-white px-4 py-3 text-xs font-bold text-[#0a4052] transition hover:bg-[#eaf4fa]"
                  >
                    <Wrench className="h-4 w-4" /> Request Site Survey
                  </Link>
                </div>
              </div>

              {/* Card 3: SPM Agency & Support Dossier */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#dce7eb] bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#047857] hover:shadow-xl sm:p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-[#ecfdf5] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#047857]">
                      Service & SLA
                    </span>
                    <span className="text-xs text-[#94a3b8]">Nationwide Egypt</span>
                  </div>

                  <h3 className="mt-6 text-xl font-extrabold text-[#0a4052] group-hover:text-[#047857]">
                    SPM Maintenance & Genuine Parts Pack
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-[#64748b]">
                    Details on SPM's preventive maintenance protocol, emergency response times within 4 hours, and guaranteed 10-year OEM spare parts reserve in Cairo.
                  </p>
                </div>

                <div className="mt-8 border-t border-[#f1f5f9] pt-5">
                  <Link
                    href="/maintenance-contracts"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce7eb] bg-[#f8fafc] px-4 py-3 text-xs font-bold text-[#334155] transition hover:bg-white hover:text-[#0a4052]"
                  >
                    <ShieldCheck className="h-4 w-4 text-[#047857]" /> Review Service Contracts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 7. SECTION: UPGRADES & PACKAGES (Ziehm-Style Swiper Tabs) */}
        {/* ========================================================= */}
        <section id="section-upgrades" className="scroll-mt-16 border-b border-[#e5e7eb] bg-[#f8fafc] py-16 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#0f6fae]">
                Tailored Configurations
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-5xl">
                Individual upgrades for your hospital requirements
              </h2>
              <p className="mt-3 text-sm text-[#64748b]">
                Select hardware enhancements, advanced software packages, or all-inclusive turnkey hospital suites.
              </p>
            </div>

            {/* Segmented Tab Buttons (Ziehm-style active line) */}
            <div className="mt-10 flex justify-center">
              <div className="inline-flex rounded-2xl border border-[#dce7eb] bg-white p-1.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveUpgradeTab("hardware")}
                  className={`rounded-xl px-5 py-2.5 text-xs font-extrabold transition-all duration-150 ${
                    activeUpgradeTab === "hardware"
                      ? "bg-[#0a4052] text-white shadow-xs"
                      : "text-[#64748b] hover:text-[#0a4052]"
                  }`}
                >
                  Hardware-Upgrades ({meta.upgrades.hardware.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUpgradeTab("software")}
                  className={`rounded-xl px-5 py-2.5 text-xs font-extrabold transition-all duration-150 ${
                    activeUpgradeTab === "software"
                      ? "bg-[#0a4052] text-white shadow-xs"
                      : "text-[#64748b] hover:text-[#0a4052]"
                  }`}
                >
                  Software-Upgrades ({meta.upgrades.software.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUpgradeTab("packages")}
                  className={`rounded-xl px-5 py-2.5 text-xs font-extrabold transition-all duration-150 ${
                    activeUpgradeTab === "packages"
                      ? "bg-[#0a4052] text-white shadow-xs"
                      : "text-[#64748b] hover:text-[#0a4052]"
                  }`}
                >
                  Packages ({meta.upgrades.packages.length})
                </button>
              </div>
            </div>

            {/* Upgrades Cards Grid */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeMeta.upgrades[activeUpgradeTab].map((up, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col justify-between rounded-3xl border border-[#dce7eb] bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0f6fae] hover:shadow-lg sm:p-7"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0f6fae]">
                        {up.tag}
                      </span>
                      {up.badge && (
                        <span className="rounded-full bg-[#eaf4fa] px-2.5 py-0.5 text-[10px] font-bold text-[#0a4052]">
                          {up.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 text-base font-extrabold text-[#0a4052]">
                      {up.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-[#64748b]">
                      {up.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-[#f1f5f9] pt-4">
                    <span className="text-[11px] font-semibold text-[#94a3b8]">Configure with Quote</span>
                    <Link
                      href={quoteHref}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#c2410c] hover:underline"
                    >
                      Inquire <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 8. SECTION: TECHNICAL SPECIFICATIONS (Ziehm-Style Structured Table) */}
        {/* ========================================================= */}
        <section id="section-specifications" className="scroll-mt-16 border-b border-[#e5e7eb] py-16 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.22em] text-[#0f6fae]">
                  Engineering Datasheet
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-5xl">
                  Technical specifications
                </h2>
                <p className="mt-3 text-sm text-[#64748b]">
                  Detailed physical, optical, mechanical, and regulatory data for {activeMeta.title}.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={expandAllSpecs}
                  className="rounded-xl border border-[#dce7eb] bg-white px-3 py-1.5 text-xs font-bold text-[#0a4052] hover:bg-[#eaf4fa]"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={collapseAllSpecs}
                  className="rounded-xl border border-[#dce7eb] bg-white px-3 py-1.5 text-xs font-bold text-[#64748b] hover:bg-[#f1f5f9]"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {/* Accordion / Table Groups */}
            <div className="mt-12 space-y-4">
              {activeMeta.specifications.map((catGroup) => {
                const isExpanded = Boolean(expandedSpecCategories[catGroup.category]);
                return (
                  <div
                    key={catGroup.category}
                    className="overflow-hidden rounded-3xl border border-[#e2e8f0] bg-white shadow-xs transition"
                  >
                    {/* Category Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(catGroup.category)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-5 text-left transition hover:bg-[#f1f5f9]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eaf4fa] text-[#0a4052]">
                          <Info className="h-4 w-4" />
                        </span>
                        <h3 className="text-base font-extrabold text-[#0a4052]">
                          {catGroup.category}
                        </h3>
                        <span className="text-xs text-[#94a3b8]">({catGroup.specs.length} items)</span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-[#64748b] transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-[#0a4052]" : ""
                        }`}
                      />
                    </button>

                    {/* Table Rows (Clean Ziehm grid) */}
                    {isExpanded && (
                      <div className="divide-y divide-[#edf2f5]">
                        {catGroup.specs.map((item, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 gap-2 px-6 py-4 transition hover:bg-[#f8fafc] sm:grid-cols-12 sm:items-center sm:gap-4"
                          >
                            <div className="sm:col-span-5 flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                                {item.label}
                              </span>
                              {item.tooltip && (
                                <span title={item.tooltip} className="cursor-help inline-flex">
                                  <HelpCircle className="h-3.5 w-3.5 text-[#94a3b8]" />
                                </span>
                              )}
                            </div>
                            <div className="sm:col-span-7 text-sm font-semibold text-[#1e293b]">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 9. SECTION: SPM SERVICE & LIFECYCLE COMMITMENT */}
        {/* ========================================================= */}
        <section id="section-service" className="scroll-mt-16 border-b border-[#e5e7eb] bg-[#061f2b] py-16 text-white sm:py-24">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <p className="text-xs font-bold uppercase tracking-[.22em] text-[#8be0d5]">
                  Our Extensive Range of Training Courses & Services
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">
                  Empower yourself and your hospital team to achieve top performance
                </h2>
                <p className="mt-6 text-base leading-relaxed text-white/80">
                  Investing in high-end medical imaging requires absolute operational confidence. SPM is not merely a supplier — we are an authorized engineering house providing turnkey installation, European standard lead shielding validation, continuous preventive maintenance, and 24/7 technical hotline coverage throughout all Egyptian governorates.
                </p>

                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <Wrench className="h-6 w-6 text-[#8be0d5]" />
                    <h3 className="mt-4 text-base font-extrabold">Ensure the Best Performance of Your System</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/70">
                      Scheduled multi-point calibrations, radiation output audits, and sensor alignment by factory-certified specialists.
                    </p>
                    <Link
                      href={serviceHref}
                      className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#8be0d5] hover:underline"
                    >
                      To Customer Service <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                    <Stethoscope className="h-6 w-6 text-[#8be0d5]" />
                    <h3 className="mt-4 text-base font-extrabold">Clinical Application Training</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/70">
                      On-site orientation for surgical and radiographer teams covering APR selection, dose reduction techniques, and PACS workflows.
                    </p>
                    <Link
                      href="/contact"
                      className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#8be0d5] hover:underline"
                    >
                      Book Training Session <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Service KPI & Assurance Card */}
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-[#0a4052] to-[#04212c] p-8 shadow-2xl sm:p-10">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8be0d5]">
                    SPM Commitment in Egypt
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold text-white">
                    Backed by Certified Biomedical Infrastructure
                  </h3>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs text-white/70">Emergency Callout SLA</span>
                      <span className="text-sm font-extrabold text-[#8be0d5]">Within 4 Hours (Cairo)</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs text-white/70">Local OEM Spare Parts Stock</span>
                      <span className="text-sm font-extrabold text-[#8be0d5]">Cairo Bonded Depot</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs text-white/70">Governorates Covered</span>
                      <span className="text-sm font-extrabold text-[#8be0d5]">All 27 Egyptian Governorates</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="text-xs text-white/70">Agency Authentication</span>
                      <span className="text-sm font-extrabold text-[#8be0d5]">Direct Italray Sole Agent</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button className="w-full h-12 rounded-xl bg-[#c2410c] text-sm font-bold text-white shadow-lg hover:bg-[#9a3412]" asChild><Link href="/maintenance-contracts">
                        Explore Annual Maintenance Contracts (AMC)
                      </Link></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 10. SECTION: CONTACT & INQUIRY FORM (Ziehm-Style Inquiry Box) */}
        {/* ========================================================= */}
        <section id="section-contact" className="scroll-mt-16 bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
            <div className="overflow-hidden rounded-3xl border border-[#dce7eb] bg-[#f8fafc] shadow-lg">
              <div className="grid gap-10 p-8 sm:p-14 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <span className="rounded-full bg-[#eaf4fa] px-3.5 py-1 text-xs font-extrabold text-[#0a4052]">
                    Interested in learning more?
                  </span>
                  <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-5xl">
                    We look forward to receiving your inquiry
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#64748b]">
                    Whether you require a formal institutional tender quotation, site shielding evaluation, or clinical demonstration, our biomedical team will respond with complete documentation.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Button size="lg" className="h-12 rounded-xl bg-[#c2410c] px-6 text-sm font-bold text-white shadow-md hover:bg-[#9a3412]" asChild><Link href={quoteHref}>
                        Request Project Quotation <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link></Button>
                    <a
                      href="https://wa.me/201281729000?text=Hello%20SPM,%20I%20would%20like%20to%20inquire%20about%20the%20Italray%20medical%20imaging%20systems."
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#25d366] bg-white px-5 text-sm font-bold text-[#128c7e] transition hover:bg-[#25d366]/10"
                    >
                      <PhoneCall className="h-4 w-4" /> Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl border border-[#dce7eb] bg-white p-6 shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0a4052]">Fast Technical Assistance</p>
                  <p className="mt-1 text-xs text-[#64748b]">Direct contact with SPM central office in Cairo:</p>

                  <div className="mt-5 space-y-3.5 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf4fa] text-[#0a4052]">
                        <Mail className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[#0a4052]">Email Procurement</p>
                        <a href="mailto:info@spm-med.com" className="text-[#0f6fae] hover:underline">
                          info@spm-med.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf4fa] text-[#0a4052]">
                        <PhoneCall className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[#0a4052]">Telephone & Hotline</p>
                        <a href="tel:+201281729000" className="text-[#0f6fae] hover:underline">
                          +20 128 172 9000
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf4fa] text-[#0a4052]">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[#0a4052]">Sole Authorized Agent</p>
                        <p className="text-[#64748b]">SPM Systems for Projects & Maintenance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 11. RELATED ITALRAY PORTFOLIO CAROUSEL */}
        {/* ========================================================= */}
        {relatedItalray.length > 0 && (
          <section className="border-t border-[#e5e7eb] bg-[#f8fafc] py-16">
            <div className="mx-auto max-w-[1400px] px-5 lg:px-10">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.22em] text-[#0f6fae]">
                    Italray Imaging Systems
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold text-[#0a4052] sm:text-3xl">
                    Explore other systems in the portfolio
                  </h2>
                </div>
                <Link
                  href="/catalogue/italray"
                  className="hidden items-center gap-1.5 text-xs font-bold text-[#0a4052] hover:text-[#0f6fae] sm:inline-flex"
                >
                  All Italray Systems <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedItalray.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/store/products/${rel.handle}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#dce7eb] bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#0a4052] hover:shadow-lg"
                  >
                    <div className="aspect-4/3 w-full overflow-hidden rounded-xl bg-[#f8fafc] p-3">
                      {rel.images[0] ? (
                        <img
                          src={rel.images[0].url}
                          alt={rel.title}
                          loading="lazy"
                          className="h-full w-full object-contain transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-[#94a3b8]">
                          Product Visual
                        </div>
                      )}
                    </div>
                    <span className="mt-4 text-[10px] font-bold uppercase tracking-wider text-[#0f6fae]">
                      {rel.productType || "Italray Solution"}
                    </span>
                    <h3 className="mt-1 line-clamp-2 text-sm font-extrabold text-[#0a4052] group-hover:text-[#0f6fae]">
                      {rel.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#c2410c]">
                      View details <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
