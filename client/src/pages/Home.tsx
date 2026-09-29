import { ArrowRight, ArrowUpRight, BadgeCheck, Boxes, Building2, CheckCircle2, ClipboardList, Globe2, HeartHandshake, ShieldCheck, Wrench } from "lucide-react";
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
  "panel.eyebrow": "A CLEAR OPERATIONAL START",
  "panel.title": "From equipment context to the right SPM team.",
  "panel.description": "Send a request, add the evidence you have and let the workflow keep the next step visible.",
};

const solutions = [
  { icon: Wrench, eyebrow: "Service", title: "Practical support for equipment that cannot wait.", text: "From corrective and preventive maintenance to installation, calibration and technical support.", href: "/services", image: "/manus-storage/spm-service-engineer_96348b80.jpg", cta: "Explore services" },
  { icon: Boxes, eyebrow: "Equipment", title: "The right imaging system for the job.", text: "Explore a controlled catalogue of medical imaging equipment, technical specifications and supporting documents.", href: "/catalogue", image: "/manus-storage/spm-equipment-carm_d9a563ca.jpg", cta: "Browse equipment" },
  { icon: ClipboardList, eyebrow: "Spare parts", title: "Parts support that starts with the details.", text: "Share the equipment context, part information and evidence your team has so SPM can review the need accurately.", href: "/spare-parts", image: "/manus-storage/spm-parts-lab_656efe60.jpg", cta: "Request a part" },
];

export default function Home() {
  const query = trpc.homepage.published.useQuery();
  const statsQuery = trpc.cms.publishedStats.useQuery();
  const stats = new Map((statsQuery.data ?? []).map(item => [item.metricKey, item]));
  const content = { ...fallback, ...(query.data ?? []).reduce<Record<string, string>>((acc, item) => { acc[item.contentKey] = item.isVisible ? item.publishedValue : ""; return acc; }, {}) };
  const hospitals = stats.get("hospitals_reached");
  const projects = stats.get("upa_projects");

  return <SiteChrome transparentHeader><main>
    <section className="relative isolate min-h-[760px] overflow-hidden bg-[#061f2b] text-white lg:min-h-[860px]">
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <img src={content["hero.image"] || fallback["hero.image"]} alt="" className="h-full w-full object-cover object-left" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,25,36,.34)_0%,rgba(3,25,36,.58)_38%,rgba(3,25,36,.94)_75%,rgba(3,25,36,.98)_100%)]" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,25,36,.3)_0%,transparent_30%,rgba(3,25,36,.4)_100%)]" aria-hidden="true" />
      <div className="mx-auto flex min-h-[760px] max-w-[1280px] items-center px-5 pb-20 pt-36 sm:px-8 lg:min-h-[860px] lg:justify-end lg:pb-24 lg:pt-40">
        <div className="w-full lg:max-w-[570px]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-white backdrop-blur-sm"><span className="h-2 w-2 rounded-full bg-[#60c1bb]" />{content["hero.eyebrow"] || fallback["hero.eyebrow"]}</div>
          <h1 className="max-w-[600px] text-5xl font-semibold leading-[1.02] tracking-[-.045em] text-white sm:text-6xl lg:text-[72px]">{content["hero.title"] || fallback["hero.title"]}</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/80 sm:text-xl">{content["hero.description"] || fallback["hero.description"]}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <Link href={content["hero.primary.url"] || fallback["hero.primary.url"]}>
              <Button size="lg" className="h-12 rounded-lg bg-[#f36b21] px-7 text-sm font-bold text-white shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-[#ff7a33] hover:shadow-xl active:scale-95">
                {content["hero.primary.label"] || fallback["hero.primary.label"]}
              </Button>
            </Link>
            <Link href={content["hero.secondary.url"] || fallback["hero.secondary.url"]}>
              <Button size="lg" variant="outline" className="h-12 rounded-lg border-2 border-white bg-transparent px-7 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-[#061f2b] active:scale-95">
                {content["hero.secondary.label"] || fallback["hero.secondary.label"]}
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75"><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#8be0d5]" />Structured request journeys</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#8be0d5]" />Controlled content</span></div>
        </div>
      </div>
    </section>

    <section className="border-y border-[#dce7eb] bg-white"><div className="mx-auto grid max-w-[1240px] gap-8 px-5 py-8 sm:grid-cols-3 lg:px-8"><div className="flex items-center gap-4"><div className="rounded-xl bg-[#eaf4fa] p-3 text-[#0f6fae]"><Building2 className="h-6 w-6" /></div><div><p className="text-3xl font-semibold text-[#0a4052]">{hospitals?.value ?? "450"}</p><p className="text-sm text-[#617180]">{hospitals?.label ?? "Hospitals reached"}</p></div></div><div className="flex items-center gap-4"><div className="rounded-xl bg-[#eaf4fa] p-3 text-[#0f6fae]"><Globe2 className="h-6 w-6" /></div><div><p className="text-3xl font-semibold text-[#0a4052]">{projects?.value ?? "66"}</p><p className="text-sm text-[#617180]">{projects?.label ?? "UPA projects"}</p></div></div><div className="flex items-center gap-4"><div className="rounded-xl bg-[#fff1e9] p-3 text-[#d95316]"><HeartHandshake className="h-6 w-6" /></div><div><p className="text-sm font-semibold text-[#0a4052]">Built for review</p><p className="text-sm text-[#617180]">Evidence-aware content workflows</p></div></div></div></section>
    <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-28"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">What SPM brings together</p><h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight tracking-[-.03em] text-[#0a4052] sm:text-5xl">A connected way to handle equipment, service and parts.</h2></div><Link href="/about" className="inline-flex shrink-0 items-center text-sm font-semibold text-[#0f6fae]">Why SPM <ArrowUpRight className="ml-2 h-4 w-4" /></Link></div><div className="mt-12 grid gap-6 lg:grid-cols-3">{solutions.map(item => <article key={item.title} className="group overflow-hidden rounded-2xl border border-[#d7e0e7] bg-white shadow-[0_2px_8px_rgba(11,41,66,.08)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(11,41,66,.12)]"><div className="relative h-56 overflow-hidden"><img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#0a4052]/60 to-transparent" /><div className="absolute bottom-4 left-4 rounded-xl bg-white/95 p-3 text-[#0f6fae]"><item.icon className="h-5 w-5" /></div></div><div className="p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#0f6fae]">{item.eyebrow}</p><h3 className="mt-3 text-2xl font-semibold leading-tight text-[#0a4052]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#617180]">{item.text}</p><Link href={item.href} className="mt-6 inline-flex items-center text-sm font-semibold text-[#d95316]">{item.cta}<ArrowUpRight className="ml-2 h-4 w-4" /></Link></div></article>)}</div></section>
    <section className="bg-[#eaf4fa]"><div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-8 lg:py-24"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">A stronger operating rhythm</p><h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.03em] text-[#0a4052]">Make the technical next step easier to see.</h2><p className="mt-5 max-w-lg leading-8 text-[#617180]">Every public journey is designed to collect useful context, route the request and keep the responsible team in view.</p><Link href="/request-service"><Button className="mt-8 bg-[#0a4052] text-white hover:bg-[#063545]">Start a Service Request <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-white p-6 shadow-sm"><ShieldCheck className="h-7 w-7 text-[#0f6fae]" /><h3 className="mt-5 text-lg font-semibold text-[#0a4052]">Controlled information</h3><p className="mt-2 text-sm leading-7 text-[#617180]">Content, evidence and publication can move through the right internal review.</p></div><div className="rounded-2xl bg-[#0a4052] p-6 text-white shadow-xl"><BadgeCheck className="h-7 w-7 text-[#60c1bb]" /><h3 className="mt-5 text-lg font-semibold">A clear request path</h3><p className="mt-2 text-sm leading-7 text-white/70">A quote, service or part request starts with the information your team needs.</p></div></div></div></section>
    <section className="mx-auto max-w-[1240px] px-5 py-20 text-center lg:px-8 lg:py-24"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Ready when you are</p><h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-.03em] text-[#0a4052] sm:text-5xl">Tell SPM what needs to move forward.</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-[#617180]">Choose the path that matches your need. You can add equipment details, files and context along the way.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/request-a-quote"><Button size="lg" className="bg-[#f36b21] text-white hover:bg-[#d95316]">Request a Quote <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/request-service"><Button size="lg" variant="outline" className="border-[#0f6fae] text-[#0f6fae]">Request Service <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link></div></section>
  </main></SiteChrome>;
}
