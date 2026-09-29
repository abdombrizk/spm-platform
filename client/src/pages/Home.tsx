import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, BadgeCheck, Boxes, Building2, CheckCircle2, ClipboardList, Globe2, HeartHandshake, ShieldCheck, Wrench, Clock, Layers } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SiteChrome from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";

const fallback: Record<string, string> = {
  "brand.name": "SPM",
  "brand.eyebrow": "SYSTEMS FOR PROJECTS & MAINTENANCE",
  "hero.eyebrow": "MEDICAL IMAGING TECHNOLOGY",
  "hero.title": "Keep critical imaging systems moving.",
  "hero.description": "SPM helps hospitals, clinics, engineers and healthcare teams source equipment, access service support and move from a technical need to a clear next step.",
  "hero.primary.label": "Request a Quote",
  "hero.primary.url": "/request-a-quote",
  "hero.secondary.label": "Request Service",
  "hero.secondary.url": "/request-service",
  "hero.image": "/manus-storage/spm-hero-medical-engineer_fd2460bc.jpg",
};

const solutions = [
  { icon: Wrench, eyebrow: "Service", title: "Practical support for equipment that cannot wait.", text: "From corrective and preventive maintenance to installation, calibration and technical support.", href: "/services", image: "/manus-storage/spm-service-engineer_96348b80.jpg", cta: "Explore services" },
  { icon: Boxes, eyebrow: "Equipment", title: "The right imaging system for the job.", text: "Explore a controlled catalogue of medical imaging equipment, technical specifications and supporting documents.", href: "/catalogue", image: "/manus-storage/spm-equipment-carm_d9a563ca.jpg", cta: "Browse equipment" },
  { icon: ClipboardList, eyebrow: "Spare parts", title: "Parts support that starts with the details.", text: "Share the equipment context, part information and evidence your team has so SPM can review the need accurately.", href: "/spare-parts", image: "/manus-storage/spm-parts-lab_656efe60.jpg", cta: "Request a part" },
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
      sub: "Healthcare partners & centers",
      icon: Building2,
      accent: "text-[#0f6fae]",
      bg: "bg-[#eaf4fa]",
    },
    {
      num: parseInt(projects?.value ?? "66", 10) || 66,
      prefix: "+",
      label: projects?.label || "UPA Projects",
      sub: "Awarded government tenders",
      icon: Globe2,
      accent: "text-[#0a4052]",
      bg: "bg-[#eaf4fa]",
    },
    {
      num: parseInt(experience?.value ?? "15", 10) || 15,
      prefix: "+",
      label: experience?.label || "Years of Experience",
      sub: "Radiology engineering expertise",
      icon: Clock,
      accent: "text-[#085a73]",
      bg: "bg-[#eaf4fa]",
    },
    {
      num: parseInt(spareParts?.value ?? "5000", 10) || 5000,
      prefix: "+",
      label: spareParts?.label || "Spare Parts in Stock",
      sub: "Original components ready",
      icon: Layers,
      accent: "text-[#d95316]",
      bg: "bg-[#fff1e9]",
    },
  ];

  return (
    <SiteChrome transparentHeader={false}>
      <main>
        {/* Section 1: Hero Section (SPM Brand Identity Style, Left-Aligned Content, Negative Space, Premium Layout) */}
        <section className="relative overflow-hidden bg-[#f7fafc] border-b border-[#dce7eb]/80">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-14 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-24">
            {/* Left Content Column */}
            <div className="relative z-10 text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-[#0f6fae] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#60c1bb]" />
                {content["hero.eyebrow"] || fallback["hero.eyebrow"]}
              </div>
              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-.04em] text-[#0a4052] sm:text-5xl lg:text-[64px]">
                {content["hero.title"] || fallback["hero.title"]}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#536474] sm:text-lg">
                {content["hero.description"] || fallback["hero.description"]}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link href={content["hero.primary.url"] || fallback["hero.primary.url"]}>
                  <Button size="lg" className="h-12 rounded-lg bg-[#f36b21] px-7 text-sm font-bold text-white shadow-lg shadow-[#f36b21]/20 transition-all hover:-translate-y-0.5 hover:bg-[#d95316] hover:shadow-xl active:scale-95">
                    {content["hero.primary.label"] || fallback["hero.primary.label"]}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href={content["hero.secondary.url"] || fallback["hero.secondary.url"]}>
                  <Button size="lg" variant="outline" className="h-12 rounded-lg border-2 border-[#0f6fae] bg-transparent px-7 text-sm font-bold text-[#0f6fae] transition-all hover:-translate-y-0.5 hover:bg-[#eaf4fa] active:scale-95">
                    {content["hero.secondary.label"] || fallback["hero.secondary.label"]}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[#617180]">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1e8ac4]" /> Structured request journeys
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1e8ac4]" /> Controlled & verified content
                </span>
              </div>
            </div>

            {/* Right Visual Frame */}
            <div className="relative min-h-[440px] overflow-hidden rounded-[32px] bg-[#0a4052] shadow-2xl shadow-[#0a4052]/20 lg:min-h-[560px]">
              <img
                src={content["hero.image"] || fallback["hero.image"]}
                alt="SPM biomedical engineer working on medical imaging equipment"
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a4052]/85 via-[#0a4052]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="max-w-md rounded-2xl border border-white/25 bg-[#0a4052]/80 p-5 text-white backdrop-blur-md shadow-lg">
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8be0d5]">
                    {content["panel.eyebrow"] || fallback["panel.eyebrow"]}
                  </p>
                  <p className="mt-2 text-xl font-semibold leading-snug">
                    {content["panel.title"] || fallback["panel.title"]}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/80">
                    {content["panel.description"] || fallback["panel.description"]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: The Trust Bar (Social Proof - Animated Counters from CMS) */}
        <section className="border-b border-[#dce7eb] bg-white py-10" aria-label="Social Proof Trust Bar">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {statItems.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 rounded-2xl border border-[#eef3f5] bg-[#fafcfd] p-5 transition-all duration-300 hover:border-[#bcdde2] hover:bg-white hover:shadow-md"
                  >
                    <div className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl ${stat.bg} ${stat.accent}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1 text-3xl font-extrabold tracking-tight text-[#0a4052]">
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
        <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-28">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">What SPM brings together</p>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-.03em] text-[#0a4052] sm:text-5xl">
                A connected way to handle equipment, service and parts.
              </h2>
            </div>
            <Link href="/about" className="inline-flex shrink-0 items-center text-sm font-semibold text-[#0f6fae]">
              Why SPM <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {solutions.map(item => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-2xl border border-[#d7e0e7] bg-white shadow-[0_2px_8px_rgba(11,41,66,.08)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(11,41,66,.12)]"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a4052]/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 p-3 text-[#0f6fae]">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-[#0f6fae]">{item.eyebrow}</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#0a4052]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#617180]">{item.text}</p>
                  <Link href={item.href} className="mt-6 inline-flex items-center text-sm font-semibold text-[#d95316]">
                    {item.cta}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Section 4: Operational Rhythm */}
        <section className="bg-[#eaf4fa]">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">A stronger operating rhythm</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.03em] text-[#0a4052]">
                Make the technical next step easier to see.
              </h2>
              <p className="mt-5 max-w-lg leading-8 text-[#617180]">
                Every public journey is designed to collect useful context, route the request and keep the responsible team in view.
              </p>
              <Link href="/request-service">
                <Button className="mt-8 bg-[#0a4052] text-white hover:bg-[#063545]">
                  Start a Service Request <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <ShieldCheck className="h-7 w-7 text-[#0f6fae]" />
                <h3 className="mt-5 text-lg font-semibold text-[#0a4052]">Controlled information</h3>
                <p className="mt-2 text-sm leading-7 text-[#617180]">Content, evidence and publication can move through the right internal review.</p>
              </div>
              <div className="rounded-2xl bg-[#0a4052] p-6 text-white shadow-xl">
                <BadgeCheck className="h-7 w-7 text-[#60c1bb]" />
                <h3 className="mt-5 text-lg font-semibold">A clear request path</h3>
                <p className="mt-2 text-sm leading-7 text-white/70">A quote, service or part request starts with the information your team needs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Global CTA */}
        <section className="mx-auto max-w-[1240px] px-5 py-20 text-center lg:px-8 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Ready when you are</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-.03em] text-[#0a4052] sm:text-5xl">
            Tell SPM what needs to move forward.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#617180]">
            Choose the path that matches your need. You can add equipment details, files and context along the way.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/request-a-quote">
              <Button size="lg" className="bg-[#f36b21] text-white hover:bg-[#d95316]">
                Request a Quote <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/request-service">
              <Button size="lg" variant="outline" className="border-[#0f6fae] text-[#0f6fae]">
                Request Service <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
