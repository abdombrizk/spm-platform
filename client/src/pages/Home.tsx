import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Globe2,
  Layers,
  MapPin,
  ShieldCheck,
  Wrench,
  Sparkles,
  PhoneCall,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SiteChrome from "@/components/SiteChrome";
import SEOHead from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";

const fallback: Record<string, string> = {
  "brand.name": "SPM",
  "brand.eyebrow": "SYSTEMS FOR PROJECTS & MAINTENANCE",
  "hero.eyebrow": "MEDICAL IMAGING AND SURGICAL TECHNOLOGY & LIFECYCLE MANAGEMENT",
  "hero.title": "Keep critical imaging systems moving.",
  "hero.description": "SPM helps hospitals, clinics, biomedical engineers and healthcare teams source equipment, access certified multi-vendor service, and resolve imaging needs with precision.",
  "hero.primary.label": "Request a Quote",
  "hero.primary.url": "/request-a-quote",
  "hero.secondary.label": "Request Service",
  "hero.secondary.url": "/request-service",
  "hero.image": "/manus-storage/spm-hero-exact-half-split_1a839b26.webp",
  "panel.eyebrow": "FIELD READINESS",
  "panel.title": "24–48h Cairo Response",
  "panel.description": "Dedicated biomedical engineers covering 24 of 27 Egyptian governorates with remote diagnostics within 4 hours.",
};

const solutions = [
  {
    icon: Wrench,
    eyebrow: "Field Engineering",
    title: "10 Core Service Pillars for Mission-Critical Systems",
    text: "From preventive & corrective maintenance to complete system commissioning, calibration, and tube/detector refurbishment.",
    href: "/services",
    serviceEquipment: "C-Arm and X-ray systems",
    image: "/manus-storage/spm-carmex-maintenance-card-optimized_fde07293.jpg",
    cta: "Explore Service Pillars",
    badge: "24/48h Response",
  },
  {
    icon: Boxes,
    eyebrow: "Systems Catalogue",
    title: "Medical Imaging Equipment",
    text: "Explore C-Arm systems, digital radiography, fluoroscopy, and surgical technology with full technical specs and ISO documents.",
    href: "/catalogue",
    serviceEquipment: "Italray medical imaging systems",
    image: "/manus-storage/clinodigit-omega-hero_dc3ed0c5.jpg",
    cta: "Browse Imaging Systems",
    badge: "Italray Exclusive Agent",
  },
  {
    icon: Layers,
    eyebrow: "Global Sourcing",
    title: "Verified OEM Spare Parts & Fast Dispatch",
    text: "Direct access to tested original components for GE, Siemens, Philips, Ziehm, Genoray, and leading multi-vendor platforms.",
    href: "/spare-parts",
    serviceEquipment: "OEM imaging systems and spare parts",
    image: "/manus-storage/spm-parts-lab_656efe60.jpg",
    cta: "Request a Part Number",
    badge: "Engineering Warranty",
  },
];

const brandLogoOverrides: Record<string, string> = {
  italray: "/manus-storage/italray-logo_57cfff13.png",
  hermann: "/manus-storage/hermann-logo_7f4be603.png",
  "ge-healthcare": "/manus-storage/ge-healthcare_3e6edf7f.png",
  "siemens-healthineers": "/manus-storage/siemens-healthineers_d3ea3a9a.png",
  "ziehm-imaging": "/manus-storage/ziehm-imaging_a271bcb6.png",
  "philips-healthcare": "/manus-storage/philips-healthcare_8bdab1dd.png",
  genoray: "/manus-storage/genoray_c6662250.png",
};

const hermannGallerySlides = [
  {
    image: "/manus-storage/hermann-gallery-team_a6d54a5b.jpg",
    eyebrow: "Hermann in action",
    title: "Engineering people behind dependable systems",
    description: "A closer look at the specialists, production discipline and technical culture behind Hermann Medizintechnik.",
    alt: "Hermann engineering team in a modern production environment",
  },
  {
    image: "/manus-storage/hermann-gallery-engineering_bb728050.jpg",
    eyebrow: "Technical confidence",
    title: "Built around precision and repeatability",
    description: "Engineering teams work with the equipment directly so every detail is understood before it reaches the operating room.",
    alt: "Hermann engineers reviewing medical technology equipment",
  },
  {
    image: "/manus-storage/hermann-gallery-inspection_974fa9eb.jpg",
    eyebrow: "Quality mindset",
    title: "Inspection that protects clinical performance",
    description: "Careful inspection and controlled manufacturing are part of the quality story SPM brings to every Hermann conversation.",
    alt: "Hermann technician inspecting precision medical equipment",
  },
  {
    image: "/manus-storage/hermann-gallery-endoscopy_d4d02539.jpg",
    eyebrow: "Endoscopy expertise",
    title: "Clear vision for minimally invasive procedures",
    description: "Hermann endoscopy solutions combine visualization, handling and instrument control for confident surgical workflows.",
    alt: "Hermann specialist handling an endoscopic instrument",
  },
  {
    image: "/manus-storage/hermann-gallery-instruments-close_ee51200c.jpg",
    eyebrow: "Instrument detail",
    title: "Designed around the surgeon’s hand",
    description: "Fine instrument geometry, balanced handling and procedure-focused configurations support repeatable surgical technique.",
    alt: "Close-up of Hermann laparoscopic instruments",
  },
  {
    image: "/manus-storage/hermann-gallery-instruments-rack_bab031be.jpg",
    eyebrow: "Ready for the OR",
    title: "A complete surgical instrumentation language",
    description: "From reusable tools to procedure-specific families, Hermann helps teams build a coherent and maintainable setup.",
    alt: "Organized Hermann surgical instruments ready for use",
  },
];

const strategicPartners = [
  {
    name: "Italray",
    status: "Exclusive Agent in Egypt",
    text: "Original imaging systems backed by manufacturer standards, technical support, genuine spare parts and after-sales service.",
    logo: brandLogoOverrides.italray,
  },
  {
    name: "Hermann Medizintechnik",
    status: "Hermann portfolio on SPM",
    text: "SPM presents Hermann Medizintechnik’s surgical, endoscopic and instrument portfolio with quote-first planning, documentation review and lifecycle support.",
    logo: brandLogoOverrides.hermann,
  },
];

const hermannCategoryChips = [
  "Laparoscopy",
  "Endoscopic Units",
  "Electrosurgery",
  "Arthroscopy",
  "Urology & Hysteroscopy",
  "Titanium Implants",
  "Plastic Surgery",
  "General Surgery",
  "Tungsten Carbide Instruments",
];

const hermannFallbackHighlights = [
  {
    slug: "hermann-h4k-icg-uhd-camera",
    name: "H4K-ICG UHD Camera 4K / ICG",
    category: "Endoscopy Camera",
    description: "4K UHD / ICG endoscopic camera platform for precise tissue visualization and advanced fluorescence imaging.",
    mainImage: "/manus-storage/hermann-endoscopy-page-8_1cd4fc90.jpg",
  },
  {
    slug: "hermann-hled-icg-light-source",
    name: "HLED-ICG LED High-Intensity Light Source",
    category: "Endoscopy Light Source",
    description: "High-intensity LED and ICG illumination with daylight-quality output for fluorescence-guided imaging.",
    mainImage: "/manus-storage/hermann-endoscopy-page-14_6e7bc3dc.jpg",
  },
  {
    slug: "hermann-hss4500-universal-fluid-pump",
    name: "HSS4500 Universal Fluid Pump",
    category: "Fluid Management System",
    description: "Universal fluid management for arthroscopy, urology and hysteroscopy with clear display and multiple working modes.",
    mainImage: "/manus-storage/hermann-endoscopy-page-23_506147ba.jpg",
  },
  {
    slug: "hermann-laparoscopy-instrument-families",
    name: "Hermann Laparoscopy Instrument Families",
    category: "Laparoscopy Instruments",
    description: "Configurable laparoscopic instrument families with detachable shafts, graspers, biopsy forceps, trocars and accessories.",
    mainImage: "/manus-storage/hermann-family-page-116_e79c21e8.jpg",
  },
];

function AnimatedCounter({ targetValue, duration = 1200, formatNumber = true }: { targetValue: number; duration?: number; formatNumber?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const stepTime = 16;
    const totalSteps = Math.max(1, Math.floor(duration / stepTime));
    const increment = targetValue / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, targetValue, duration]);

  return <span ref={ref}>{formatNumber ? count.toLocaleString() : count}</span>;
}

export default function Home() {
  const query = trpc.homepage.published.useQuery();
  const statsQuery = trpc.cms.publishedStats.useQuery();
  const productsQuery = trpc.products.published.useQuery();
  const eventsPageQuery = trpc.cms.publishedBySlug.useQuery({ slug: "events" });
  const [hermannSlide, setHermannSlide] = useState(0);
  const [hermannAutoplayPaused, setHermannAutoplayPaused] = useState(false);

  useEffect(() => {
    if (hermannAutoplayPaused || typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setHermannSlide(current => (current + 1) % hermannGallerySlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [hermannAutoplayPaused]);

  const rawStats = statsQuery.data ?? [];
  const stats = new Map(rawStats.map(item => [item.metricKey, item]));
  const content = {
    ...fallback,
    ...(query.data ?? []).reduce<Record<string, string>>((acc, item) => {
      acc[item.contentKey] = item.isVisible ? item.publishedValue : "";
      return acc;
    }, {}),
  };

  const hospitals = stats.get("hospitals_reached");
  const projects = stats.get("upa_projects");
  const spareParts = stats.get("spare_parts_ready");

  const statItems = [
    {
      num: parseInt(hospitals?.value ?? "450", 10) || 450,
      prefix: "+",
      label: hospitals?.label || "Hospitals Reached",
      sub: "Hospitals & healthcare centers across Egypt",
      icon: Building2,
      accent: "text-[#0a4052]",
      bg: "bg-[#eaf4fa]",
      border: "hover:border-[#0a4052]",
    },
    {
      num: parseInt(projects?.value ?? "66", 10) || 66,
      prefix: "+",
      label: projects?.label || "UPA Projects",
      sub: "Government awarded healthcare tenders",
      icon: Globe2,
      accent: "text-[#0f6fae]",
      bg: "bg-[#eaf4fa]",
      border: "hover:border-[#0f6fae]",
    },
    {
      num: 2019,
      prefix: "Since ",
      label: "SPM engineering commitment",
      sub: "Medical Imaging and Surgical Technology leadership",
      icon: Clock,
      accent: "text-[#2b8c88]",
      bg: "bg-[#e8f6f5]",
      border: "hover:border-[#2b8c88]",
    },
    {
      num: parseInt(spareParts?.value ?? "5000", 10) || 5000,
      prefix: "+",
      label: spareParts?.label || "Verified Spare Parts",
      sub: "OEM components ready for immediate dispatch",
      icon: Layers,
      accent: "text-[#c2410c]",
      bg: "bg-[#fff1e9]",
      border: "hover:border-[#c2410c]",
    },
  ];

  const hermannProducts = (productsQuery.data ?? [])
    .map(item => ({ ...item, product: item.data as Record<string, any> }))
    .filter(item => String(item.product.brand ?? "").toLowerCase() === "hermann");
  const hermannHighlights = hermannFallbackHighlights.map(fallbackItem => {
    const liveItem = hermannProducts.find(item => item.slug === fallbackItem.slug);
    return liveItem ? { ...fallbackItem, ...liveItem.product } : fallbackItem;
  });
  const hermannSystemCount = hermannProducts.length || 20;
  const hermannFamilyCount = hermannProducts.filter(item => String(item.product.name ?? "").toLowerCase().includes("families")).length || 7;
  const activeHermannSlide = hermannGallerySlides[hermannSlide] ?? hermannGallerySlides[0];

  const eventsData = eventsPageQuery.data?.data as { items?: Array<{ title: string; date: string; location: string; image?: string; isPast?: boolean }> } | undefined;
  const pastEvents = (eventsData?.items ?? []).filter(ev => {
    if (!ev.date) return false;
    const eventTime = new Date(ev.date).getTime();
    return !isNaN(eventTime) && eventTime <= Date.now();
  });

  const heroImage = content["hero.image"] || fallback["hero.image"];

  return (
    <SiteChrome transparentHeader={false}>
      <SEOHead
        title="Medical Imaging and Surgical Technology, Service and Spare Parts"
        description="SPM supports medical imaging equipment with sourcing, service, maintenance and spare-parts request journeys for healthcare and technical teams across Egypt."
        url="/"
      />
      <main>
        {/* Section 1: Hero Section */}
        <section className="relative isolate min-h-[640px] overflow-hidden border-b border-[#0a4052] bg-[#061f2b] text-white sm:min-h-[720px] lg:min-h-[760px]">
          <img
            src={heroImage}
            alt="Italray C-Arm and surgical imaging equipment in a modern operating room"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center transition duration-1000 hover:scale-[1.01]"
          />
          {/* Multi-stage calibrated gradient overlay */}
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,31,43,.82)_0%,rgba(6,31,43,.66)_35%,rgba(6,31,43,.12)_73%,rgba(6,31,43,.28)_100%)]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/65 via-transparent to-[#061f2b]/20" aria-hidden="true" />

          <div className="relative mx-auto flex min-h-[640px] max-w-[1280px] items-center px-5 py-24 sm:min-h-[720px] lg:min-h-[760px] lg:px-8">
            <div className="max-w-2xl text-left lg:max-w-[560px]">
              {/* Category Pill */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#60c1bb]/40 bg-[#061f2b]/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#8be0d5] shadow-lg backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#60c1bb] animate-pulse" />
                  {content["hero.eyebrow"] || fallback["hero.eyebrow"]}
                </div>
              </div>

              {/* Dominant Headline */}
              <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.03] tracking-[-.045em] text-white sm:text-5xl lg:max-w-[560px] lg:text-[64px]">
                {content["hero.title"] || fallback["hero.title"]}
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                {content["hero.description"] || fallback["hero.description"]}
              </p>

              {/* Dual Action CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                    size="lg"
                    className="h-13 rounded-xl bg-[#c2410c] px-8 text-sm font-bold text-white shadow-xl shadow-[#c2410c]/25 transition-all hover:-translate-y-0.5 hover:bg-[#9a3412] hover:shadow-2xl active:scale-97"
                   asChild><Link href={content["hero.primary.url"] || fallback["hero.primary.url"]}>
                    {content["hero.primary.label"] || fallback["hero.primary.label"]}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link></Button>
                <Button
                    size="lg"
                    variant="outline"
                    className="h-13 rounded-xl border-2 border-white/70 bg-white/10 px-8 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20 active:scale-97"
                   asChild><Link href={content["hero.secondary.url"] || fallback["hero.secondary.url"]}>
                    {content["hero.secondary.label"] || fallback["hero.secondary.label"]}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link></Button>
              </div>

              {/* Value Badges */}
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-white/80">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#60c1bb]" /> Structured request tracking
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#60c1bb]" /> Documented quality alignment
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Trust Statistics Bar */}
        <section className="border-b border-[#dce7eb] bg-white py-12" aria-label="Official Evidence Statistics">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {statItems.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 rounded-2xl border border-[#eef3f5] bg-[#fafcfd] p-5.5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg ${stat.border}`}
                  >
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${stat.bg} ${stat.accent}`}>
                      <IconComponent className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1 text-3xl font-black tracking-tight text-[#0a4052]">
                        <span>{stat.prefix}</span>
                        <AnimatedCounter targetValue={stat.num} formatNumber={stat.prefix !== "Since "} />
                      </div>
                      <p className="mt-0.5 text-sm font-bold text-[#1e293b]">{stat.label}</p>
                      <p className="text-xs text-[#64748b]">{stat.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2" aria-label="Quality and regulatory evidence">
              <div className="flex items-center gap-4 rounded-2xl border border-[#cfe8df] bg-[#f3fbf8] px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#047857] shadow-xs">
                  <BadgeCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#047857]">Quality badge</p>
                  <p className="mt-1 text-sm font-bold text-[#0a4052]">ISO 9001-aligned quality framework</p>
                  <p className="mt-0.5 text-xs text-[#64748b]">Documented review and traceable technical records.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-[#cfe2ef] bg-[#f2f8fc] px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0f6fae] shadow-xs">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#0f6fae]">Radiation compliance</p>
                  <p className="mt-1 text-sm font-bold text-[#0a4052]">Radiation safety & licensing dossier</p>
                  <p className="mt-0.5 text-xs text-[#64748b]">Regulatory documentation coordinated for each project.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Strategic Partnerships */}
        <section className="border-y border-[#dce7eb] bg-[#f7fafc] py-20 lg:py-24" aria-labelledby="strategic-partnerships-title">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                  <BadgeCheck className="h-3.5 w-3.5 text-[#0f6fae]" /> Strategic Partnerships
                </div>
                <h2 id="strategic-partnerships-title" className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-.04em] text-[#0a4052] sm:text-5xl">Global technology, local accountability.</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#617180]">SPM combines manufacturer relationships with local engineering responsibility and after-sales support, so every system has a clear path from installation to ongoing performance.</p>
              </div>
              <p className="max-w-xs text-sm font-semibold leading-6 text-[#0f6fae]">Two trusted technology relationships. One accountable SPM support model.</p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {strategicPartners.map((partner, index) => (
                <article key={partner.name} className="group relative overflow-hidden rounded-3xl border border-[#dce7eb] bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0a4052] hover:shadow-xl sm:p-9">
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[72px] bg-[#eaf4fa] transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
                  <div className="relative flex items-start justify-between gap-5">
                    <div className="flex h-20 min-w-[150px] items-center rounded-2xl border border-[#e5edf1] bg-[#fafcfd] px-5">
                      <img src={partner.logo} alt={`${partner.name} official logo`} loading="lazy" decoding="async" className="max-h-12 max-w-[190px] object-contain" />
                    </div>
                    <span className="mt-1 rounded-full bg-[#eaf4fa] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#0f6fae]">0{index + 1}</span>
                  </div>
                  <p className="relative mt-7 inline-flex rounded-full bg-[#fff1e9] px-3 py-1 text-xs font-bold text-[#c2410c]">{partner.status}</p>
                  <h3 className="relative mt-4 text-2xl font-bold text-[#0a4052]">{partner.name}</h3>
                  <p className="relative mt-3 max-w-xl text-sm leading-7 text-[#617180]">{partner.text}</p>
                  <div className="relative mt-7 flex flex-wrap gap-2 text-xs font-semibold text-[#536474]">
                    <span className="rounded-full border border-[#dce7eb] px-3 py-1.5">Equipment supply</span>
                    <span className="rounded-full border border-[#dce7eb] px-3 py-1.5">Technical support</span>
                    <span className="rounded-full border border-[#dce7eb] px-3 py-1.5">Lifecycle care</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Solutions Overview */}
        <section className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                <Sparkles className="h-3.5 w-3.5 text-[#0f6fae]" /> Lifecycle Engineering
              </div>
              <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-[-.03em] text-[#0a4052] sm:text-4xl lg:text-5xl">
                A connected approach to imaging systems, service & parts.
              </h2>
            </div>
            <Link
              href="/about"
              className="inline-flex shrink-0 items-center rounded-xl border border-[#dce7eb] bg-white px-5 py-2.5 text-sm font-bold text-[#0a4052] shadow-xs transition hover:border-[#0a4052] hover:bg-[#f7fafc]"
            >
              Why SPM Technology <ArrowUpRight className="ml-2 h-4 w-4 text-[#0f6fae]" />
            </Link>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {solutions.map(item => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-3xl border border-[#dce7eb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-2 hover:border-[#0a4052] hover:shadow-2xl"
              >
                <Link href={item.href} className="flex flex-col justify-between">
                  <div>
                  <div className="relative h-60 overflow-hidden bg-[#061f2b]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a4052]/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 rounded-full bg-[#061f2b]/80 px-3 py-1 text-[11px] font-bold text-[#8be0d5] backdrop-blur-sm">
                      {item.badge}
                    </div>
                    <div className="absolute bottom-4 left-4 rounded-2xl bg-white p-3 text-[#0a4052] shadow-md">
                      <item.icon className="h-6 w-6" />
                    </div>
                  </div>
                    <div className="p-7">
                    <p className="text-xs font-bold uppercase tracking-[.18em] text-[#0f6fae]">{item.eyebrow}</p>
                    <h3 className="mt-3 text-2xl font-bold leading-snug text-[#0a4052] transition-colors group-hover:text-[#0f6fae]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#617180]">{item.text}</p>
                    </div>
                  </div>
                  <div className="border-t border-[#f1f5f9] px-7 py-4">
                    <div className="inline-flex items-center text-sm font-bold text-[#c2410c] transition-transform group-hover:translate-x-1.5">
                      {item.cta}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
                <div className="border-t border-[#dce7eb] bg-[#f8fafc] px-7 py-3">
                  <Link
                    href={`/request-service?equipment=${encodeURIComponent(item.serviceEquipment)}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#0a4052] transition-colors hover:text-[#0f6fae] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6fae] focus-visible:ring-offset-2"
                  >
                    <Wrench className="h-3.5 w-3.5 text-[#0f6fae]" />
                    Request service for this equipment
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section 4: Hermann Surgical Technology */}
        <section className="border-y border-[#dce7eb] bg-[#f7fafc] py-20 lg:py-24" aria-label="Hermann surgical technology">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
              <div
                className="group relative min-h-[460px] overflow-hidden rounded-[32px] bg-[#0a4052] shadow-2xl shadow-[#0a4052]/20 sm:min-h-[520px] lg:min-h-[600px]"
                onMouseEnter={() => setHermannAutoplayPaused(true)}
                onMouseLeave={() => setHermannAutoplayPaused(false)}
                onFocus={() => setHermannAutoplayPaused(true)}
                onBlur={() => setHermannAutoplayPaused(false)}
              >
                {hermannGallerySlides.map((slide, index) => (
                  <img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    aria-hidden={index !== hermannSlide}
                    className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out ${index === hermannSlide ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/95 via-[#061f2b]/20 to-[#061f2b]/10" aria-hidden="true" />
                <div className="absolute left-6 right-6 top-6 flex items-center justify-between gap-4">
                  <div className="flex h-14 w-36 items-center justify-center rounded-2xl bg-white px-4 shadow-lg">
                    <img src={brandLogoOverrides.hermann} alt="Hermann Medizintechnik official logo" loading="lazy" decoding="async" className="max-h-9 max-w-full object-contain" />
                  </div>
                  <span className="rounded-full border border-white/30 bg-[#061f2b]/70 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#8be0d5] backdrop-blur-sm">Hermann portfolio</span>
                </div>
                <button
                  type="button"
                  aria-label="Previous Hermann gallery image"
                  onClick={() => setHermannSlide(current => (current - 1 + hermannGallerySlides.length) % hermannGallerySlides.length)}
                  className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#061f2b]/60 text-white opacity-0 shadow-lg backdrop-blur-sm transition hover:bg-[#061f2b]/85 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8be0d5] group-hover:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next Hermann gallery image"
                  onClick={() => setHermannSlide(current => (current + 1) % hermannGallerySlides.length)}
                  className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-[#061f2b]/60 text-white opacity-0 shadow-lg backdrop-blur-sm transition hover:bg-[#061f2b]/85 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8be0d5] group-hover:opacity-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-[#8be0d5]">{activeHermannSlide.eyebrow}</p>
                  <h3 className="mt-2 max-w-lg text-2xl font-bold leading-tight sm:text-3xl">{activeHermannSlide.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">{activeHermannSlide.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="text-[11px] font-bold uppercase tracking-[.16em] text-white/65">Hermann Medizintechnik</span>
                    <div className="flex items-center gap-2" role="tablist" aria-label="Hermann gallery images">
                      {hermannGallerySlides.map((slide, index) => (
                        <button
                          key={slide.image}
                          type="button"
                          role="tab"
                          aria-label={`Show Hermann image ${index + 1}`}
                          aria-selected={index === hermannSlide}
                          onClick={() => setHermannSlide(index)}
                          className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8be0d5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061f2b] ${index === hermannSlide ? "w-8 bg-[#8be0d5]" : "w-2 bg-white/55 hover:bg-white"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                  <BadgeCheck className="h-3.5 w-3.5 text-[#0f6fae]" /> Hermann portfolio
                </div>
                <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-[-.03em] text-[#0a4052] sm:text-4xl lg:text-5xl">
                  Endoscopy, electrosurgery and surgical instrumentation in one trusted portfolio.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#617180]">
                  SPM presents Hermann Medizintechnik’s German surgical and endoscopic portfolio for Egyptian healthcare teams, with equipment selection, quotation review, installation coordination, training and lifecycle support.
                </p>
                <div className="mt-6 flex flex-wrap gap-2" aria-label="Hermann official product categories">
                  {hermannCategoryChips.map(category => <span key={category} className="rounded-full border border-[#cfe4e8] bg-white px-3 py-1.5 text-[11px] font-bold text-[#0a4052]">{category}</span>)}
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#dce7eb] bg-white p-4"><p className="text-2xl font-extrabold text-[#0a4052]">{hermannSystemCount}</p><p className="mt-1 text-xs font-bold text-[#0a4052]">SPM catalogue entries</p></div>
                  <div className="rounded-2xl border border-[#dce7eb] bg-white p-4"><p className="text-2xl font-extrabold text-[#0a4052]">{hermannFamilyCount}</p><p className="mt-1 text-xs font-bold text-[#0a4052]">Curated instrument families</p></div>
                  <a href="/manus-storage/hermann-catalog_444df261.pdf" target="_blank" rel="noreferrer" className="rounded-2xl border border-[#dce7eb] bg-white p-4 transition hover:border-[#0a4052] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6fae] focus-visible:ring-offset-2"><p className="text-2xl font-extrabold text-[#0a4052]">PDF</p><p className="mt-1 text-xs font-bold text-[#617180]">Open official catalog</p></a>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button className="h-12 rounded-xl bg-[#0a4052] px-6 text-sm font-bold text-white shadow-md hover:bg-[#063545]" asChild><Link href="/catalogue?brand=hermann">Explore Hermann Portfolio <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button>
                  <Button variant="outline" className="h-12 rounded-xl border-[#0a4052] px-6 text-sm font-bold text-[#0a4052] hover:bg-white" asChild><Link href="/request-a-quote?brand=hermann">Request Hermann Quote <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {hermannHighlights.map(item => (
                <Link key={item.slug} href={`/catalogue/${item.slug}`} className="group overflow-hidden rounded-2xl border border-[#dce7eb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0a4052] hover:shadow-xl">
                  <div className="relative h-44 overflow-hidden bg-[#eaf4fa]">
                    <img src={item.mainImage} alt={item.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-[#061f2b]/80 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#8be0d5] backdrop-blur-sm">{item.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-extrabold leading-snug text-[#0a4052] group-hover:text-[#0f6fae]">{item.name}</h3>
                    <p className="mt-2 line-clamp-3 text-xs leading-6 text-[#617180]">{item.description}</p>
                    <span className="mt-4 inline-flex items-center text-xs font-bold text-[#c2410c]">View system details <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Past Events & Exhibitions */}
        {pastEvents.length > 0 ? (
          <section className="border-b border-[#dce7eb] bg-[#f8fafc] py-20" aria-label="Events and Exhibitions">
            <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                    <Calendar className="h-3.5 w-3.5 text-[#0f6fae]" /> Market Presence
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-4xl">
                    Past Exhibitions & Medical Technology Events
                  </h2>
                  <p className="mt-2 text-sm text-[#617180]">
                    Official participations and technical sessions completed by the SPM engineering team.
                  </p>
                </div>
                <Link href="/events" className="inline-flex items-center text-sm font-bold text-[#0a4052] hover:underline">
                  All Events <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.slice(0, 3).map((event, idx) => (
                  <article key={idx} className="overflow-hidden rounded-2xl border border-[#dce7eb] bg-white shadow-xs transition hover:shadow-md">
                    {event.image ? (
                      <div className="h-48 overflow-hidden bg-[#e2e8f0]">
                        <img
                          src={event.image}
                          alt={event.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-36 items-center justify-center bg-[#eaf4fa] text-[#0a4052]">
                        <Calendar className="h-10 w-10" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#0f6fae]">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-[#0a4052]">{event.title}</h3>
                      {event.location && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#64748b]">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{event.location}</span>
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Section 7: Decisive Global CTA */}
        <section className="mx-auto max-w-[1280px] px-5 py-20 text-center lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
              <PhoneCall className="h-3.5 w-3.5 text-[#c2410c]" /> Ready When You Are
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-4xl lg:text-5xl">
              Tell SPM what needs to move forward.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#617180]">
              Choose the journey that matches your technical need. Attach equipment specs, photos or error descriptions along the way.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="h-13 rounded-xl bg-[#c2410c] px-8 text-sm font-bold text-white shadow-lg shadow-[#c2410c]/20 hover:bg-[#9a3412]" asChild><Link href="/request-a-quote">
                  Request a Quote <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link></Button>
              <Button size="lg" variant="outline" className="h-13 rounded-xl border-2 border-[#0a4052] bg-white px-8 text-sm font-bold text-[#0a4052] hover:bg-[#eaf4fa]" asChild><Link href="/request-service">
                  Request Service <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link></Button>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
