import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Globe2,
  Layers,
  MapPin,
  ShieldCheck,
  Users,
  Wrench,
  Sparkles,
  PhoneCall,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SiteChrome from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";

const fallback: Record<string, string> = {
  "brand.name": "SPM",
  "brand.eyebrow": "SYSTEMS FOR PROJECTS & MAINTENANCE",
  "hero.eyebrow": "MEDICAL IMAGING TECHNOLOGY & LIFECYCLE MANAGEMENT",
  "hero.title": "Keep critical imaging systems moving.",
  "hero.description": "SPM helps hospitals, clinics, biomedical engineers and healthcare teams source equipment, access certified multi-vendor service, and resolve imaging needs with precision.",
  "hero.primary.label": "Request a Quote",
  "hero.primary.url": "/request-a-quote",
  "hero.secondary.label": "Request Service",
  "hero.secondary.url": "/request-service",
  "hero.image": "/manus-storage/spm-hero-medical-engineer_fd2460bc.jpg",
  "panel.eyebrow": "FIELD READINESS",
  "panel.title": "24–48h Cairo Response",
  "panel.description": "Dedicated biomedical engineers covering 24 of 27 Egyptian governorates with remote diagnostics within 4 hours.",
  "careers.image": "/manus-storage/spm-service-engineer_96348b80.jpg",
  "careers.visible": "true",
};

const solutions = [
  {
    icon: Wrench,
    eyebrow: "Field Engineering",
    title: "10 Core Service Pillars for Mission-Critical Systems",
    text: "From preventive & corrective maintenance to complete system commissioning, calibration, and tube/detector refurbishment.",
    href: "/services",
    image: "/manus-storage/spm-service-engineer_96348b80.jpg",
    cta: "Explore Service Pillars",
    badge: "24/48h Response",
  },
  {
    icon: Boxes,
    eyebrow: "Systems Catalogue",
    title: "Certified Medical Imaging Equipment",
    text: "Explore C-Arm systems, digital radiography, fluoroscopy, and surgical technology with full technical specs and ISO documents.",
    href: "/catalogue",
    image: "/manus-storage/spm-equipment-carm_d9a563ca.jpg",
    cta: "Browse Imaging Systems",
    badge: "Italray Exclusive Agent",
  },
  {
    icon: Layers,
    eyebrow: "Global Sourcing",
    title: "Verified OEM Spare Parts & Fast Dispatch",
    text: "Direct access to tested original components for GE, Siemens, Philips, Ziehm, and leading multi-vendor platforms.",
    href: "/spare-parts",
    image: "/manus-storage/spm-parts-lab_656efe60.jpg",
    cta: "Request a Part Number",
    badge: "Engineering Warranty",
  },
];

function AnimatedCounter({ targetValue, duration = 1200 }: { targetValue: number; duration?: number }) {
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

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function Home() {
  const query = trpc.homepage.published.useQuery();
  const statsQuery = trpc.cms.publishedStats.useQuery();
  const brandsQuery = trpc.parts.brands.useQuery();
  const eventsPageQuery = trpc.cms.publishedBySlug.useQuery({ slug: "events" });

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
  const experience = stats.get("years_experience");
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
      num: parseInt(experience?.value ?? "7", 10) || 7,
      prefix: "+",
      label: experience?.label || "Years of Experience",
      sub: "Medical imaging technology leadership",
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
      accent: "text-[#d95316]",
      bg: "bg-[#fff1e9]",
      border: "hover:border-[#d95316]",
    },
  ];

  const partBrands = brandsQuery.data ?? [];

  const eventsData = eventsPageQuery.data?.data as { items?: Array<{ title: string; date: string; location: string; image?: string; isPast?: boolean }> } | undefined;
  const pastEvents = (eventsData?.items ?? []).filter(ev => {
    if (!ev.date) return false;
    const eventTime = new Date(ev.date).getTime();
    return !isNaN(eventTime) && eventTime <= Date.now();
  });

  const showCareers = content["careers.visible"] !== "false" && content["careers.visible"] !== "";

  return (
    <SiteChrome transparentHeader={false}>
      <main>
        {/* Section 1: Hero Section */}
        <section className="relative isolate min-h-[640px] overflow-hidden border-b border-[#0a4052] bg-[#061f2b] text-white sm:min-h-[720px] lg:min-h-[760px]">
          <img
            src={content["hero.image"] || fallback["hero.image"]}
            alt="SPM biomedical engineer working on hospital medical imaging equipment"
            className="absolute inset-0 h-full w-full object-cover object-center transition duration-1000 hover:scale-[1.01]"
          />
          {/* Multi-stage calibrated gradient overlay */}
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,31,43,.98)_0%,rgba(6,31,43,.88)_40%,rgba(6,31,43,.45)_75%,rgba(6,31,43,.60)_100%)]"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/80 via-transparent to-[#061f2b]/30" aria-hidden="true" />

          <div className="relative mx-auto flex min-h-[640px] max-w-[1280px] items-center px-5 py-24 sm:min-h-[720px] lg:min-h-[760px] lg:px-8">
            <div className="max-w-2xl text-left">
              {/* Category Pill */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#60c1bb]/40 bg-[#061f2b]/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-[#8be0d5] shadow-lg backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#60c1bb] animate-pulse" />
                {content["hero.eyebrow"] || fallback["hero.eyebrow"]}
              </div>

              {/* Dominant Headline */}
              <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-[-.04em] text-white sm:text-5xl lg:text-[64px]">
                {content["hero.title"] || fallback["hero.title"]}
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                {content["hero.description"] || fallback["hero.description"]}
              </p>

              {/* Dual Action CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={content["hero.primary.url"] || fallback["hero.primary.url"]}>
                  <Button
                    size="lg"
                    className="h-13 rounded-xl bg-[#d95316] px-8 text-sm font-bold text-white shadow-xl shadow-[#d95316]/25 transition-all hover:-translate-y-0.5 hover:bg-[#b8430e] hover:shadow-2xl active:scale-97"
                  >
                    {content["hero.primary.label"] || fallback["hero.primary.label"]}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href={content["hero.secondary.url"] || fallback["hero.secondary.url"]}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 rounded-xl border-2 border-white/70 bg-white/10 px-8 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20 active:scale-97"
                  >
                    {content["hero.secondary.label"] || fallback["hero.secondary.label"]}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Value Badges */}
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-white/80">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#60c1bb]" /> Structured request tracking
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#60c1bb]" /> ISO 9001 & CE alignment
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#60c1bb]" /> 24/27 governorates coverage
                </span>
              </div>
            </div>
          </div>

          {/* Lower Right Dynamic Panel */}
          <div className="absolute bottom-8 right-5 hidden max-w-sm rounded-2xl border border-white/20 bg-[#061f2b]/80 p-5 text-white shadow-2xl backdrop-blur-md lg:block lg:right-8">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8be0d5]">
              {content["panel.eyebrow"] || fallback["panel.eyebrow"]}
            </p>
            <p className="mt-2 text-xl font-bold leading-snug">
              {content["panel.title"] || fallback["panel.title"]}
            </p>
            <p className="mt-2 text-xs leading-5 text-white/80">
              {content["panel.description"] || fallback["panel.description"]}
            </p>
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
                        <AnimatedCounter targetValue={stat.num} />
                      </div>
                      <p className="mt-0.5 text-sm font-bold text-[#1e293b]">{stat.label}</p>
                      <p className="text-xs text-[#64748b]">{stat.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Solutions Overview */}
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
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#dce7eb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-2 hover:border-[#0a4052] hover:shadow-2xl"
              >
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
                  <div className="inline-flex items-center text-sm font-bold text-[#d95316] transition-transform group-hover:translate-x-1.5">
                    {item.cta}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Spare Parts Hub */}
        <section className="border-y border-[#dce7eb] bg-white py-20" aria-label="Spare Parts Hub">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                  <Boxes className="h-3.5 w-3.5 text-[#0f6fae]" /> Genuine OEM Components
                </div>
                <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-4xl">
                  We secure verified spare parts for clinical imaging systems
                </h2>
                <p className="mt-3 max-w-2xl text-base text-[#617180]">
                  Immediate dispatch across Egypt and the MENA region. Every replacement component is tested, serial-number verified, and backed by SPM engineering warranty.
                </p>
              </div>
              <Link href="/spare-parts">
                <Button className="h-12 shrink-0 rounded-xl bg-[#0a4052] px-6 text-sm font-bold text-white shadow-md hover:bg-[#063545]">
                  Browse Spare Parts <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Manufacturer Brand Badges */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
              {partBrands.map(brand => (
                <Link
                  key={brand.id}
                  href={`/spare-parts`}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-[#e2e8f0] bg-[#fafcfd] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#0a4052] hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-14 w-full items-center justify-center">
                    <span className="text-lg font-bold tracking-tight text-[#64748b] grayscale filter transition-all duration-300 group-hover:text-[#0a4052] group-hover:grayscale-0 sm:text-xl">
                      {brand.name}
                    </span>
                  </div>
                  <span className="mt-2 text-xs font-semibold text-[#94a3b8] transition-colors group-hover:text-[#0f6fae]">
                    Verified Component
                  </span>
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
                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
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

        {/* Section 6: Careers Section */}
        {showCareers ? (
          <section className="relative overflow-hidden bg-[#061f2b] py-20 text-white lg:py-24" aria-label="Careers Section">
            <div className="absolute inset-0 -z-10 opacity-25">
              <img
                src={content["careers.image"] || fallback["careers.image"]}
                alt="SPM engineering team in field operation"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#061f2b] via-[#061f2b]/95 to-[#061f2b]/80" />

            <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
              <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8be0d5]">
                    <Users className="h-3.5 w-3.5" /> Join Our Technical Team
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Build your career at the forefront of medical imaging technology.
                  </h2>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                    SPM is growing. We seek ambitious biomedical engineers, field imaging technicians, and quality specialists dedicated to clinical uptime and patient safety.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link href="/careers">
                      <Button size="lg" className="h-12 rounded-xl bg-[#d95316] px-7 text-sm font-bold text-white shadow-lg hover:bg-[#b8430e]">
                        Explore Open Roles <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/contact?subject=Careers">
                      <Button size="lg" variant="outline" className="h-12 rounded-xl border-white/40 bg-transparent px-7 text-sm font-bold text-white hover:bg-white/10">
                        Submit Your CV <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8be0d5]">Engineering Excellence at SPM</p>
                  <ul className="mt-5 space-y-4 text-sm text-white/90">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8be0d5]" />
                      <span>Direct training on advanced C-Arm, Digital Radiography and Fluoroscopy.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8be0d5]" />
                      <span>Certified QMS practices aligned with ISO 9001 and ISO 13485 guidelines.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8be0d5]" />
                      <span>High-impact projects across top-tier public, university and private healthcare institutions.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Section 7: Operating Rhythm & Trust */}
        <section className="bg-[#eaf4fa] py-20 lg:py-24">
          <div className="mx-auto grid max-w-[1280px] gap-10 px-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#0a4052]" /> Governed Operations
              </div>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-.03em] text-[#0a4052] sm:text-4xl">
                Make every technical next step clear, traceable & verified.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-[#617180]">
                Every request journey is structured to gather exact equipment context, preserve confidentiality, and route directly to the designated department.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/request-service">
                  <Button className="h-12 rounded-xl bg-[#0a4052] px-6 text-sm font-bold text-white shadow-md hover:bg-[#063545]">
                    Start a Service Request <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/maintenance-contracts">
                  <Button variant="outline" className="h-12 rounded-xl border-[#0a4052] text-[#0a4052] hover:bg-[#0a4052]/5">
                    Annual Contracts
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-[#dce7eb] bg-white p-7 shadow-xs">
                <ShieldCheck className="h-8 w-8 text-[#0a4052]" />
                <h3 className="mt-5 text-lg font-bold text-[#0a4052]">Controlled Content</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#617180]">
                  Equipment specifications, technical files and public claims are verified through our internal QA framework.
                </p>
              </div>
              <div className="rounded-3xl border border-[#0a4052] bg-[#0a4052] p-7 text-white shadow-xl">
                <BadgeCheck className="h-8 w-8 text-[#8be0d5]" />
                <h3 className="mt-5 text-lg font-bold">Dedicated Triage</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Every quote, service or parts request generates a unique reference number with direct engineering assignment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Decisive Global CTA */}
        <section className="mx-auto max-w-[1280px] px-5 py-20 text-center lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
              <PhoneCall className="h-3.5 w-3.5 text-[#d95316]" /> Ready When You Are
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-4xl lg:text-5xl">
              Tell SPM what needs to move forward.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#617180]">
              Choose the journey that matches your technical need. Attach equipment specs, photos or error descriptions along the way.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/request-a-quote">
                <Button size="lg" className="h-13 rounded-xl bg-[#d95316] px-8 text-sm font-bold text-white shadow-lg shadow-[#d95316]/20 hover:bg-[#b8430e]">
                  Request a Quote <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/request-service">
                <Button size="lg" variant="outline" className="h-13 rounded-xl border-2 border-[#0a4052] bg-white px-8 text-sm font-bold text-[#0a4052] hover:bg-[#eaf4fa]">
                  Request Service <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
