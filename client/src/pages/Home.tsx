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
  Pause,
  Play,
  ShieldCheck,
  Wrench,
  Sparkles,
  PhoneCall,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    title: "Mission-Critical Field Engineering",
    text: "From preventive & corrective maintenance to complete system commissioning, calibration, and tube/detector refurbishment.",
    href: "/services",
    serviceEquipment: "C-Arm and X-ray systems",
    image: "/manus-storage/spm-carmex-maintenance-card-optimized_fde07293.jpg",
    imageAlt: "Biomedical engineer inspecting a C-Arm X-ray system in a clinical room",
    cta: "Explore Service Pillars",
    badge: "24/48h Response",
  },
  {
    icon: Boxes,
    eyebrow: "Systems Catalogue",
    title: "Medical Imaging Systems",
    text: "Explore C-Arm systems, digital radiography, fluoroscopy, and surgical technology with full technical specs and ISO documents.",
    href: "/catalogue",
    serviceEquipment: "Italray medical imaging systems",
    image: "/manus-storage/clinodigit-omega-hero_dc3ed0c5.jpg",
    imageAlt: "Italray mobile imaging system prepared for a surgical workflow",
    cta: "Browse Imaging Systems",
    badge: "Italray Exclusive Agent",
  },
  {
    icon: Layers,
    eyebrow: "Global Sourcing",
    title: "OEM Spare Parts & Fast Dispatch",
    text: "Direct access to tested original components for GE, Siemens, Philips, Ziehm, Genoray, and leading multi-vendor platforms.",
    href: "/spare-parts",
    serviceEquipment: "OEM imaging systems and spare parts",
    image: "/manus-storage/spm-parts-lab_656efe60.jpg",
    imageAlt: "Organized medical imaging spare parts and technical components",
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
    href: "/catalogue?brand=italray",
  },
  {
    name: "Hermann Medizintechnik",
    status: "Hermann portfolio on SPM",
    text: "SPM presents Hermann Medizintechnik’s surgical, endoscopic and instrument portfolio with quote-first planning, documentation review and lifecycle support.",
    logo: brandLogoOverrides.hermann,
    href: "/catalogue?brand=hermann",
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

const qualityDetails = {
  quality: {
    eyebrow: "Quality workflow",
    title: "Documented quality workflow",
    summary: "A clear review path for technical records, equipment data and project handover.",
    details: [
      "Technical information is reviewed before it becomes part of a quote or project conversation.",
      "Equipment, service and spare-parts requests are organized around traceable next steps.",
      "Ask the SPM team for the project-specific documentation package before making a procurement decision.",
    ],
  },
  radiation: {
    eyebrow: "Radiation documentation",
    title: "Project-specific radiation documentation",
    summary: "Safety and regulatory records are coordinated according to the equipment and project scope.",
    details: [
      "Radiation-related documentation is reviewed as part of the project requirements rather than presented as a generic badge.",
      "The required records can vary by system, installation context and applicable authority.",
      "Contact SPM to confirm the documentation required for your facility and equipment scope.",
    ],
  },
} as const;

type QualityDetailKey = keyof typeof qualityDetails;

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
  const [activeQualityDetail, setActiveQualityDetail] = useState<QualityDetailKey | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroAutoplayPaused, setHeroAutoplayPaused] = useState(false);
  const [heroHoverPaused, setHeroHoverPaused] = useState(false);
  const [heroTouchStartX, setHeroTouchStartX] = useState<number | null>(null);
  const [activeHeroHotspot, setActiveHeroHotspot] = useState<string | null>(null);

  const moveHermannSlide = (direction: 1 | -1) => {
    setHermannAutoplayPaused(true);
    setHermannSlide(current => (current + direction + hermannGallerySlides.length) % hermannGallerySlides.length);
  };

  const selectHermannSlide = (index: number) => {
    setHermannAutoplayPaused(true);
    setHermannSlide(index);
  };

  const handleHermannTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setHermannAutoplayPaused(true);
    setTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const handleHermannTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
    if (Math.abs(deltaX) >= 48) moveHermannSlide(deltaX < 0 ? 1 : -1);
    setTouchStartX(null);
  };

  const moveHeroSlide = (direction: 1 | -1) => {
    setHeroAutoplayPaused(true);
    setHeroSlide(current => (current + direction + 4) % 4);
    setActiveHeroHotspot(null);
  };

  const handleHeroTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setHeroAutoplayPaused(true);
    setHeroTouchStartX(event.touches[0]?.clientX ?? null);
  };

  const handleHeroTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (heroTouchStartX === null) return;
    const deltaX = (event.changedTouches[0]?.clientX ?? heroTouchStartX) - heroTouchStartX;
    if (Math.abs(deltaX) >= 48) moveHeroSlide(deltaX < 0 ? 1 : -1);
    setHeroTouchStartX(null);
  };

  useEffect(() => {
    if (hermannAutoplayPaused || typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setHermannSlide(current => (current + 1) % hermannGallerySlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [hermannAutoplayPaused]);

  useEffect(() => {
    if (heroAutoplayPaused || heroHoverPaused || typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setHeroSlide(current => (current + 1) % 4), 6000);
    return () => window.clearInterval(timer);
  }, [heroAutoplayPaused, heroHoverPaused]);

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
  }).slice(0, 3);
  const hermannSystemCount = hermannProducts.length || 20;
  const hermannFamilyCount = hermannProducts.filter(item => String(item.product.name ?? "").toLowerCase().includes("families")).length || 7;
  const activeHermannSlide = hermannGallerySlides[hermannSlide] ?? hermannGallerySlides[0];
  const visibleHermannCategories = hermannCategoryChips.slice(0, 6);
  const activeQuality = activeQualityDetail ? qualityDetails[activeQualityDetail] : null;

  const eventsData = eventsPageQuery.data?.data as { items?: Array<{ title: string; date: string; location: string; image?: string; isPast?: boolean }> } | undefined;
  const pastEvents = (eventsData?.items ?? []).filter(ev => {
    if (!ev.date) return false;
    const eventTime = new Date(ev.date).getTime();
    return !isNaN(eventTime) && eventTime <= Date.now();
  });

  const heroImage = content["hero.image"] || fallback["hero.image"];
  const heroSlides = [
    {
      image: content["hero.slide.1.image"] || heroImage,
      alt: content["hero.slide.1.alt"] || "Italray C-Arm and surgical imaging equipment in a modern operating room",
      eyebrow: content["hero.slide.1.eyebrow"] || "Imaging systems",
      title: content["hero.slide.1.title"] || "Precision imaging for decisive care.",
      description: content["hero.slide.1.description"] || "Italray C-Arms and surgical imaging systems supported by SPM engineering, documentation and lifecycle care.",
    },
    {
      image: content["hero.slide.2.image"] || solutions[0].image,
      alt: content["hero.slide.2.alt"] || solutions[0].imageAlt,
      eyebrow: content["hero.slide.2.eyebrow"] || "Field engineering",
      title: content["hero.slide.2.title"] || "Support that keeps critical systems moving.",
      description: content["hero.slide.2.description"] || "From commissioning and calibration to preventive maintenance, our field team stays close to the equipment.",
    },
    {
      image: content["hero.slide.3.image"] || solutions[1].image,
      alt: content["hero.slide.3.alt"] || solutions[1].imageAlt,
      eyebrow: content["hero.slide.3.eyebrow"] || "Surgical technology",
      title: content["hero.slide.3.title"] || "A clearer path from equipment to outcome.",
      description: content["hero.slide.3.description"] || "Explore imaging platforms, technical specifications and quote-first planning for modern surgical workflows.",
    },
    {
      image: content["hero.slide.4.image"] || hermannGallerySlides[3].image,
      alt: content["hero.slide.4.alt"] || hermannGallerySlides[3].alt,
      eyebrow: content["hero.slide.4.eyebrow"] || "Hermann portfolio",
      title: content["hero.slide.4.title"] || "Surgical technology, thoughtfully connected.",
      description: content["hero.slide.4.description"] || "Hermann endoscopy and instrument systems presented with documentation review, training and lifecycle support.",
    },
  ];
  const activeHeroSlide = heroSlides[heroSlide] ?? heroSlides[0];
  const heroIsPaused = heroAutoplayPaused || heroHoverPaused;
  const heroHotspots = [
    { id: "detector", label: "Flat-panel detector", detail: "Precise image capture for demanding surgical workflows.", position: "left-[72%] top-[52%]" },
    { id: "monitor", label: "Live imaging display", detail: "Bring the clinical view closer to the operating team.", position: "left-[58%] top-[24%]" },
    { id: "c-arm", label: "Mobile C-Arm platform", detail: "Flexible positioning for image-guided procedures.", position: "left-[86%] top-[42%]" },
  ];

  return (
    <SiteChrome transparentHeader={false}>
      <SEOHead
        title="Medical Imaging and Surgical Technology, Service and Spare Parts"
        description="SPM supports medical imaging equipment with sourcing, service, maintenance and spare-parts request journeys for healthcare and technical teams across Egypt."
        url="/"
      />
      <main>
        {/* Hero: rotating imaging, field engineering and surgical technology showcase */}
        <section className="relative isolate min-h-[720px] overflow-hidden border-b border-[#0a4052] bg-[#061f2b] text-white sm:min-h-[760px] lg:min-h-[790px]">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="SPM technology and service showcase"
            tabIndex={0}
            className="absolute inset-0 overflow-hidden outline-none lg:left-[42%]"
            onMouseEnter={() => setHeroHoverPaused(true)}
            onMouseLeave={() => setHeroHoverPaused(false)}
            onFocus={() => setHeroHoverPaused(true)}
            onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHeroHoverPaused(false); }}
            onKeyDown={event => { if (event.key === "ArrowLeft") moveHeroSlide(-1); if (event.key === "ArrowRight") moveHeroSlide(1); }}
            onTouchStart={handleHeroTouchStart}
            onTouchEnd={handleHeroTouchEnd}
          >
            {heroSlides.map((slide, index) => (
              <img
                key={slide.image}
                src={slide.image}
                alt={slide.alt}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                aria-hidden={index !== heroSlide}
                className={`absolute inset-0 h-full w-full object-cover object-center transition-[opacity,transform] duration-700 ease-out ${index === heroSlide ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-[#061f2b]/10 via-[#061f2b]/10 to-[#061f2b]/35" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/75 via-transparent to-[#061f2b]/10" aria-hidden="true" />
            {heroSlide === 0 ? (
              <div className="absolute inset-0" aria-label="C-Arm feature points">
                {heroHotspots.map(hotspot => (
                  <div key={hotspot.id} className={`group absolute ${hotspot.position}`}>
                    <button
                      type="button"
                      aria-label={`${hotspot.label}: ${hotspot.detail}`}
                      aria-expanded={activeHeroHotspot === hotspot.id}
                      onClick={() => setActiveHeroHotspot(current => current === hotspot.id ? null : hotspot.id)}
                      className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#0f6fae]/85 text-xs font-black text-white shadow-[0_0_0_6px_rgba(15,111,174,.22)] backdrop-blur-sm transition duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8be0d5]"
                    >
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#8be0d5]" />
                    </button>
                    <span className={`pointer-events-none absolute bottom-12 left-1/2 w-52 -translate-x-1/2 rounded-xl border border-white/20 bg-[#061f2b]/90 p-3 text-left text-xs text-white shadow-2xl backdrop-blur-md transition duration-200 ${activeHeroHotspot === hotspot.id ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"}`}>
                      <strong className="block text-sm text-[#8be0d5]">{hotspot.label}</strong>
                      <span className="mt-1 block leading-4 text-white/75">{hotspot.detail}</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="absolute bottom-8 left-6 right-6 flex items-end justify-between gap-4 sm:bottom-10 sm:left-10 sm:right-10">
              <div className="max-w-xs rounded-2xl border border-white/20 bg-[#061f2b]/55 p-3 backdrop-blur-md">
                <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#8be0d5]">{activeHeroSlide.eyebrow}</p>
                <p className="mt-1 text-sm font-bold leading-5 text-white">{activeHeroSlide.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label={heroIsPaused ? "Play Hero slideshow" : "Pause Hero slideshow"} aria-pressed={heroIsPaused} onClick={() => { setHeroAutoplayPaused(current => !current); setHeroHoverPaused(false); }} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-[#061f2b]/65 text-white shadow-lg backdrop-blur-md transition hover:bg-[#061f2b]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8be0d5]">
                  {heroIsPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
                <button type="button" aria-label="Previous Hero image" onClick={() => moveHeroSlide(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-[#061f2b]/65 text-white shadow-lg backdrop-blur-md transition hover:bg-[#061f2b]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8be0d5]"><ChevronLeft className="h-5 w-5" /></button>
                <button type="button" aria-label="Next Hero image" onClick={() => moveHeroSlide(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-[#061f2b]/65 text-white shadow-lg backdrop-blur-md transition hover:bg-[#061f2b]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8be0d5]"><ChevronRight className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#061f2b]/35 via-[#061f2b]/50 to-[#061f2b]/90 lg:hidden" aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 hidden w-[66%] bg-gradient-to-r from-[#061f2b] via-[#061f2b]/95 to-transparent lg:block" aria-hidden="true" />

          <div className="relative z-10 mx-auto grid min-h-[720px] max-w-[1280px] items-center px-5 py-24 sm:min-h-[760px] lg:min-h-[790px] lg:grid-cols-[.86fr_1.14fr] lg:px-8">
            <div className="max-w-xl text-left">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#60c1bb]/40 bg-[#061f2b]/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-[#8be0d5] shadow-lg backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#60c1bb] animate-pulse" />
                  {activeHeroSlide.eyebrow} & lifecycle management
                </div>
              </div>
              <div aria-live="polite">
                <h1 className="max-w-xl text-4xl font-extrabold leading-[1.03] tracking-[-.045em] text-white sm:text-5xl lg:text-[62px]">{activeHeroSlide.title}</h1>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">{activeHeroSlide.description}</p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button size="lg" className="h-13 rounded-xl bg-[#c2410c] px-8 text-sm font-bold text-white shadow-xl shadow-[#c2410c]/25 transition-all hover:-translate-y-0.5 hover:bg-[#9a3412] hover:shadow-2xl active:scale-97" asChild>
                  <Link href={content["hero.primary.url"] || fallback["hero.primary.url"]}>{content["hero.primary.label"] || fallback["hero.primary.label"]}<ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="h-13 rounded-xl border-2 border-white/70 bg-white/10 px-8 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20 active:scale-97" asChild>
                  <Link href={content["hero.secondary.url"] || fallback["hero.secondary.url"]}>{content["hero.secondary.label"] || fallback["hero.secondary.label"]}<ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
              <div className="mt-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                <label htmlFor="hero-quick-path" className="text-xs font-bold uppercase tracking-[.14em] text-white/70">Find your path</label>
                <select id="hero-quick-path" defaultValue="" aria-label="Choose a product or support path" onChange={event => { if (event.target.value) window.location.assign(event.target.value); }} className="min-h-11 w-full max-w-xs rounded-xl border border-white/40 bg-[#061f2b]/75 px-3.5 text-sm font-semibold text-white shadow-lg outline-none backdrop-blur-sm transition hover:border-[#8be0d5] focus-visible:ring-2 focus-visible:ring-[#8be0d5] sm:w-auto">
                  <option value="" disabled>Choose a destination…</option>
                  <option value="/catalogue?category=c-arm">C-Arm systems</option>
                  <option value="/catalogue?brand=hermann">Hermann surgical portfolio</option>
                  <option value="/spare-parts">OEM spare parts</option>
                  <option value="/request-service">Field service support</option>
                </select>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-white/80">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#60c1bb]" /> Structured request tracking</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#60c1bb]" /> Documented quality alignment</span>
              </div>
              <div className="mt-7 flex items-center gap-2" role="tablist" aria-label="Hero showcase images">
                {heroSlides.map((slide, index) => <button key={slide.image} type="button" role="tab" aria-label={`Show Hero image ${index + 1}`} aria-selected={index === heroSlide} onClick={() => { setHeroAutoplayPaused(true); setHeroSlide(index); }} className="inline-flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8be0d5]"><span aria-hidden="true" className={`h-2 rounded-full transition-all duration-300 ${index === heroSlide ? "w-7 bg-[#8be0d5]" : "w-2 bg-white/55 hover:bg-white"}`} /></button>)}
                <span className="ml-2 text-[10px] font-bold uppercase tracking-[.16em] text-white/55">{heroSlide + 1} / {heroSlides.length}</span>
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
                        {statsQuery.isLoading || statsQuery.isError ? (
                          <span aria-label={statsQuery.isError ? "Statistics unavailable" : "Loading statistics"}>—</span>
                        ) : (
                          <>
                            <span>{stat.prefix}</span>
                            <AnimatedCounter targetValue={stat.num} formatNumber={stat.prefix !== "Since "} />
                          </>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm font-bold text-[#1e293b]">{stat.label}</p>
                      <p className="text-xs text-[#64748b]">{stat.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2" aria-label="Quality and regulatory evidence">
              <button type="button" onClick={() => setActiveQualityDetail("quality")} aria-haspopup="dialog" aria-label="View documented quality workflow details" className="flex w-full items-center gap-4 rounded-2xl border border-[#cfe8df] bg-[#f3fbf8] px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#047857] shadow-xs">
                  <BadgeCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#047857]">Quality badge</p>
                  <p className="mt-1 text-sm font-bold text-[#0a4052]">Documented quality workflow</p>
                  <p className="mt-0.5 text-xs text-[#64748b]">Documented review and traceable technical records.</p>
                </div>
              </button>
              <button type="button" onClick={() => setActiveQualityDetail("radiation")} aria-haspopup="dialog" aria-label="View project-specific radiation documentation details" className="flex w-full items-center gap-4 rounded-2xl border border-[#cfe2ef] bg-[#f2f8fc] px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6fae] focus-visible:ring-offset-2">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0f6fae] shadow-xs">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#0f6fae]">Radiation compliance</p>
                  <p className="mt-1 text-sm font-bold text-[#0a4052]">Project-specific radiation documentation</p>
                  <p className="mt-0.5 text-xs text-[#64748b]">Safety and regulatory records coordinated where required.</p>
                </div>
              </button>
            </div>
            {statsQuery.isError ? <p role="status" className="mt-3 text-xs font-semibold text-[#9a3412]">Live statistics are temporarily unavailable; the rest of the Home experience remains available.</p> : null}
          </div>
        </section>

        <Dialog open={Boolean(activeQuality)} onOpenChange={open => { if (!open) setActiveQualityDetail(null); }}>
          <DialogContent className="max-w-xl border-[#cfe2ef] bg-white p-7 text-[#0a4052] sm:p-8">
            {activeQuality ? (
              <>
                <DialogHeader className="text-left">
                  <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#0f6fae]">{activeQuality.eyebrow}</p>
                  <DialogTitle className="text-2xl font-extrabold leading-tight text-[#0a4052]">{activeQuality.title}</DialogTitle>
                  <DialogDescription className="pt-1 text-sm leading-6 text-[#617180]">{activeQuality.summary}</DialogDescription>
                </DialogHeader>
                <ul className="mt-2 space-y-3 text-sm leading-6 text-[#334155]">
                  {activeQuality.details.map(detail => <li key={detail} className="flex gap-3"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#047857]" aria-hidden="true" /><span>{detail}</span></li>)}
                </ul>
                <Link href="/contact" onClick={() => setActiveQualityDetail(null)} className="mt-2 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0a4052] px-5 text-sm font-bold text-white hover:bg-[#063545] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6fae] focus-visible:ring-offset-2">Confirm project requirements <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
              </>
            ) : null}
          </DialogContent>
        </Dialog>

        {/* Strategic partnerships */}
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
              {strategicPartners.map((partner) => (
                <Link key={partner.name} href={partner.href} aria-label={`Explore ${partner.name} portfolio`} className="group block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6fae] focus-visible:ring-offset-2">
                <article className="relative overflow-hidden rounded-3xl border border-[#dce7eb] bg-white p-7 shadow-xs transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#0a4052] group-hover:shadow-xl sm:p-9">
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[72px] bg-[#eaf4fa] transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
                  <div className="relative flex items-start justify-between gap-5">
                    <div className="flex h-24 min-w-[190px] items-center rounded-2xl border border-transparent bg-transparent px-0 transition-transform duration-300 group-hover:scale-[1.03]">
                      <img src={partner.logo} alt={`${partner.name} official logo`} loading="lazy" decoding="async" className="max-h-16 max-w-[240px] scale-125 object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-150" />
                    </div>
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
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Lifecycle solutions overview */}
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
                      alt={item.imageAlt}
                      loading="lazy"
                      decoding="async"
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
                    className="inline-flex min-h-11 items-center gap-2 py-2 text-xs font-bold text-[#0a4052] transition-colors hover:text-[#0f6fae] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6fae] focus-visible:ring-offset-2"
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

        {/* Hermann portfolio showcase */}
        <section className="border-y border-[#dce7eb] bg-[#f7fafc] py-20 lg:py-24" aria-label="Hermann surgical technology">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
              <div
                role="region"
                aria-roledescription="carousel"
                aria-label="Hermann portfolio image gallery"
                tabIndex={0}
                className="group relative min-h-[460px] overflow-hidden rounded-[32px] bg-[#0a4052] shadow-2xl shadow-[#0a4052]/20 sm:min-h-[520px] lg:min-h-[600px]"
                onMouseEnter={() => setHermannAutoplayPaused(true)}
                onMouseLeave={() => setHermannAutoplayPaused(false)}
                onFocus={() => setHermannAutoplayPaused(true)}
                onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHermannAutoplayPaused(false); }}
                onKeyDown={event => { if (event.key === "ArrowLeft") moveHermannSlide(-1); if (event.key === "ArrowRight") moveHermannSlide(1); }}
                onTouchStart={handleHermannTouchStart}
                onTouchEnd={handleHermannTouchEnd}
              >
                {hermannGallerySlides.map((slide, index) => (
                  <img
                    key={slide.image}
                    src={slide.image}
                    alt={slide.alt}
                    loading="lazy"
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
                  onClick={() => moveHermannSlide(-1)}
                  className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-[#061f2b]/70 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#061f2b]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8be0d5] sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next Hermann gallery image"
                  onClick={() => moveHermannSlide(1)}
                  className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-[#061f2b]/70 text-white shadow-lg backdrop-blur-sm transition hover:bg-[#061f2b]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8be0d5] sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-6 left-6 right-6 text-white" aria-live="polite">
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
                          onClick={() => selectHermannSlide(index)}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8be0d5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#061f2b]"
                        >
                          <span aria-hidden="true" className={`h-2.5 rounded-full transition-all duration-300 ${index === hermannSlide ? "w-8 bg-[#8be0d5]" : "w-2.5 bg-white/55 hover:bg-white"}`} />
                        </button>
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
                  Endoscopy, electrosurgery & surgical instruments.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#617180]">
                  SPM presents Hermann Medizintechnik’s German surgical and endoscopic portfolio for Egyptian healthcare teams, with equipment selection, quotation review, installation coordination, training and lifecycle support.
                </p>
                <div className="mt-6 flex flex-wrap gap-2" aria-label="Hermann official product categories">
                  {visibleHermannCategories.map(category => <span key={category} className="rounded-full border border-[#cfe4e8] bg-white px-3 py-1.5 text-[11px] font-bold text-[#0a4052]">{category}</span>)}
                  <span className="rounded-full border border-dashed border-[#9fcbd1] bg-white px-3 py-1.5 text-[11px] font-bold text-[#0a4052]">+3 more categories</span>
                </div>
                {productsQuery.isLoading || productsQuery.isError ? <p role="status" className="mt-3 text-xs font-semibold text-[#64748b]">{productsQuery.isError ? "Showing the curated Hermann preview while live catalogue entries reconnect." : "Loading live Hermann catalogue entries…"}</p> : null}
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

        {/* Past events and exhibitions */}
        {eventsPageQuery.isLoading ? null : pastEvents.length > 0 ? (
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
        ) : (
          <section className="border-b border-[#dce7eb] bg-[#f8fafc] py-14" aria-label="Events and Exhibitions">
            <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center lg:px-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                  <Calendar className="h-3.5 w-3.5 text-[#0f6fae]" /> Market Presence
                </div>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0a4052] sm:text-3xl">Events & technical sessions</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#617180]">
                  {eventsPageQuery.isError ? "Our events feed is temporarily unavailable." : "Explore SPM participation, technical sessions and upcoming market activity."}
                </p>
              </div>
              <Link href="/events" className="inline-flex min-h-11 items-center rounded-xl border border-[#0a4052] px-4 py-2 text-sm font-bold text-[#0a4052] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6fae] focus-visible:ring-offset-2">
                Explore all events <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Final conversion CTA */}
        <section className="mx-auto max-w-[1280px] px-5 py-20 text-center lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
              <PhoneCall className="h-3.5 w-3.5 text-[#c2410c]" /> Ready When You Are
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-4xl lg:text-5xl">
              Tell SPM what needs to move forward.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#617180]">
              For a new system, specification or budget, request a quote. For an existing device, fault or site visit, request service. Attach equipment specs, photos or error descriptions along the way.
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
