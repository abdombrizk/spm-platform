import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseMedical,
  CalendarClock,
  ChevronDown,
  CircleCheck,
  Clock3,
  Globe2,
  Headphones,
  MapPin,
  Search,
  ShieldCheck,
  Siren,
  Wrench,
} from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SiteChrome from "@/components/SiteChrome";
import SEOHead from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";

const labels: Record<string, string> = {
  installation: "Installation",
  commissioning: "Commissioning",
  preventive_maintenance: "Preventive maintenance",
  corrective_maintenance: "Corrective maintenance",
  emergency_maintenance: "Emergency maintenance",
  calibration: "Calibration",
  technical_support: "Technical support",
  training: "Training",
  spare_parts_supply: "Spare parts supply",
  maintenance_contract: "Maintenance contract",
};

const equipment = ["C-Arm", "Mobile X-Ray", "Fixed X-Ray", "CT", "Cathlab", "Ultrasound", "Mammography", "Dental Imaging", "Other Medical Imaging Systems"];
const brands = ["Italray", "Hermann Medizintechnik", "GE Healthcare", "Siemens Healthineers", "Philips Healthcare", "Ziehm Imaging", "Other medical imaging brands"];
const heroImage = "/manus-storage/spm-hero-medical-engineer_fd2460bc.jpg";
const fallbackImages = [heroImage, heroImage, heroImage];

function parseServiceData(value: string) {
  try {
    return JSON.parse(value) as Record<string, any>;
  } catch {
    return {};
  }
}

export default function Services() {
  const query = trpc.services.published.useQuery();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const services = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return (query.data ?? []).filter(item => {
      const data = item.data as Record<string, any>;
      const matchesType = type === "all" || item.serviceType === type;
      const matchesSearch = !normalized || [data.name, data.shortDescription, data.fullDescription, item.serviceType].some(value => String(value ?? "").toLowerCase().includes(normalized));
      return matchesType && matchesSearch;
    });
  }, [query.data, search, type]);

  return (
    <SiteChrome>
      <SEOHead
        title="Medical Imaging Services & Engineering Support"
        description="SPM provides certified medical imaging equipment service across Egypt: preventive maintenance, emergency repairs, calibration, commissioning, and SLA contracts."
        url="/services"
      />
      <main className="bg-[#f7fafc] text-[#17212b]">
        <section className="relative overflow-hidden bg-[#061f2b] text-white">
          <div className="absolute inset-0"><img loading="eager" decoding="async" src={heroImage} alt="SPM medical imaging service engineer" className="h-full w-full object-cover opacity-35" /><div className="absolute inset-0 bg-gradient-to-r from-[#061f2b]/95 via-[#061f2b]/85 to-[#0a4052]/55" /></div>
          <div className="relative mx-auto grid min-h-[560px] max-w-[1280px] items-center gap-12 px-5 py-24 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
            <div>
              <Badge className="border border-[#8be0d5]/40 bg-[#8be0d5]/10 text-[#8be0d5] hover:bg-[#8be0d5]/10">SPM SERVICE & MAINTENANCE</Badge>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-.05em] sm:text-6xl">Medical imaging support built around continuity.</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75">From planned maintenance to urgent technical intervention, SPM helps hospitals, clinics, engineers and healthcare teams keep critical imaging systems ready.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/request-service"><Button size="lg" className="bg-[#c2410c] text-white hover:bg-[#c2410c]">Request Service <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/request-a-quote"><Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">Request a Quote <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link></div>
              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/75"><span className="inline-flex items-center gap-2"><CircleCheck className="h-4 w-4 text-[#8be0d5]" /> 4-hour remote diagnostics</span><span className="inline-flex items-center gap-2"><CircleCheck className="h-4 w-4 text-[#8be0d5]" /> 24–48h Cairo intervention</span></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md"><Clock3 className="h-7 w-7 text-[#8be0d5]" /><p className="mt-6 text-2xl font-bold">4 working hours</p><p className="mt-2 text-sm leading-6 text-white/70">Remote diagnostic response target for service requests.</p></div><div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md"><MapPin className="h-7 w-7 text-[#8be0d5]" /><p className="mt-6 text-2xl font-bold">24 of 27 governorates</p><p className="mt-2 text-sm leading-6 text-white/70">Technical coverage across Egypt with selected MENA market support.</p></div></div>
          </div>
        </section>

        <section className="border-b border-[#dce7eb] bg-white py-8"><div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-8 gap-y-4 px-5 text-sm font-semibold text-[#536474] lg:px-8"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#0f6fae]" /> Certified technical service</span><span className="inline-flex items-center gap-2"><BriefcaseMedical className="h-5 w-5 text-[#0f6fae]" /> Multi-vendor equipment support</span><span className="inline-flex items-center gap-2"><Globe2 className="h-5 w-5 text-[#0f6fae]" /> Egypt & selected MENA markets</span><span className="inline-flex items-center gap-2"><Headphones className="h-5 w-5 text-[#0f6fae]" /> Remote and on-site coordination</span></div></section>

        <section className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Our services</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-[#0a4052] sm:text-5xl">One service team across the imaging lifecycle.</h2><p className="mt-5 text-lg leading-8 text-[#617180]">Choose the support path that matches the equipment, operating need and urgency. Every service request is reviewed with the customer context before the next action is agreed.</p></div><div className="mt-10 flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-[#94a3b8]" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search services" className="h-11 border-[#d7e0e7] bg-white pl-10" /></div><div className="flex flex-wrap gap-2">{["all", ...Object.keys(labels)].map(value => <Button key={value} type="button" size="sm" variant={type === value ? "default" : "outline"} onClick={() => setType(value)} className={type === value ? "bg-[#0a4052] text-white hover:bg-[#063545]" : "border-[#d7e0e7] text-[#536474]"}>{value === "all" ? "All services" : labels[value]}</Button>)}</div></div><div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{services.map((item, index) => { const data = item.data as Record<string, any>; const image = data.mainImage || fallbackImages[index % fallbackImages.length]; return <article key={item.id} className="group overflow-hidden rounded-3xl border border-[#d7e0e7] bg-white shadow-[0_2px_10px_rgba(11,41,66,.05)] transition hover:-translate-y-1 hover:shadow-xl"><div className="relative aspect-[4/3] overflow-hidden bg-[#dcecf1]"><img loading="lazy" decoding="async" src={image} alt={data.name || item.slug} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/65 to-transparent" /><Badge className="absolute left-4 top-4 border-white/30 bg-white/90 text-[#0a4052] hover:bg-white">{labels[item.serviceType] || item.serviceType}</Badge><div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-semibold text-white"><span>{data.availability === "available" ? "Available" : "On request"}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> Technical review</span></div></div><div className="space-y-4 p-6"><h3 className="text-xl font-bold text-[#0a4052]">{data.name || item.slug}</h3><p className="min-h-[78px] text-sm leading-7 text-[#617180]">{data.shortDescription || data.fullDescription}</p><div className="flex flex-wrap gap-2">{["Request Service", "Request a Quote"].map(action => <span key={action} className="rounded-full bg-[#f2f8fb] px-3 py-1 text-xs font-semibold text-[#0f6fae]">{action}</span>)}</div><Link href={`/services/${item.slug}`}><Button className="w-full border-[#bcdde2] text-[#0f6fae] hover:bg-[#eaf4fa]" variant="outline">View service details <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link></div></article>; })}</div>{!query.isLoading && services.length === 0 ? <div className="mt-10 rounded-3xl border border-dashed border-[#bcdde2] bg-white p-14 text-center text-[#617180]">No published service matches this search. Contact SPM for a custom technical request.</div> : null}</section>

        <section className="bg-[#eaf4fa] py-20 lg:py-24"><div className="mx-auto max-w-[1280px] px-5 lg:px-8"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Supported equipment</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-[#0a4052]">Support for the equipment your team relies on.</h2><p className="mt-5 text-lg leading-8 text-[#617180]">SPM can review service, maintenance and technical-support requests across the following medical imaging equipment categories. The final scope is confirmed after the request is reviewed.</p></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{equipment.map(item => <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#cfe3e9] bg-white p-5"><CircleCheck className="h-5 w-5 shrink-0 text-[#1e8ac4]" /><span className="font-semibold text-[#0a4052]">{item}</span></div>)}</div></div></section>

        <section className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Multi-vendor support</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-[#0a4052]">Global brands, one accountable service conversation.</h2><p className="mt-5 leading-8 text-[#617180]">Tell us the equipment brand, model and service need. We will review the technical context and coordinate the appropriate support path.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{brands.map(brand => <div key={brand} className="rounded-2xl border border-[#d7e0e7] bg-white p-5 text-sm font-bold text-[#0a4052] shadow-sm"><BadgeCheck className="mb-4 h-5 w-5 text-[#0f6fae]" />{brand}</div>)}</div></div></section>

        <section className="border-y border-[#dce7eb] bg-white py-20 lg:py-24"><div className="mx-auto max-w-[1280px] px-5 lg:px-8"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">How service requests move</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-[#0a4052]">A clear path from technical need to next action.</h2></div><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">{["Submit request", "Technical triage", "Remote diagnosis", "On-site intervention", "Testing & closure"].map((step, index) => <div key={step} className="relative rounded-2xl bg-[#f7fafc] p-6"><span className="text-xs font-bold text-[#0f6fae]">STEP 0{index + 1}</span><h3 className="mt-5 text-lg font-bold text-[#0a4052]">{step}</h3><p className="mt-3 text-sm leading-6 text-[#617180]">{index === 0 ? "Share equipment, contact and problem details with the service team." : index === 1 ? "The request is reviewed against equipment, urgency and location." : index === 2 ? "Where suitable, the team starts with remote technical guidance." : index === 3 ? "A site visit or repair action is coordinated when required." : "The service outcome and next recommendation are documented."}</p><ChevronDown className="absolute -bottom-4 left-1/2 hidden h-7 w-7 -translate-x-1/2 rounded-full bg-[#0a4052] p-1.5 text-white lg:block lg:rotate-[-90deg]" /></div>)}</div></div></section>

        <section className="bg-[#061f2b] py-20 text-white lg:py-24"><div className="mx-auto grid max-w-[1280px] gap-12 px-5 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8be0d5]">Maintenance contracts</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">Ongoing support, shaped around your equipment.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">SPM offers annual maintenance contracts, equipment-specific support, visit-based arrangements and customized hospital programs. Contract scope is discussed and quoted according to the equipment, site and operational requirements.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/request-a-quote"><Button size="lg" className="bg-[#c2410c] text-white hover:bg-[#c2410c]">Discuss a contract <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/contact"><Button size="lg" variant="outline" className="border-white/35 bg-transparent text-white hover:bg-white/10">Talk to SPM <ArrowRight className="ml-2 h-4 w-4" /></Button></Link></div></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-3xl border border-white/15 bg-white/10 p-6"><CalendarClock className="h-7 w-7 text-[#8be0d5]" /><h3 className="mt-6 text-xl font-bold">Annual maintenance</h3><p className="mt-3 text-sm leading-7 text-white/70">Planned support designed around the equipment and operating context.</p></div><div className="rounded-3xl border border-white/15 bg-white/10 p-6"><Wrench className="h-7 w-7 text-[#8be0d5]" /><h3 className="mt-6 text-xl font-bold">Equipment-based support</h3><p className="mt-3 text-sm leading-7 text-white/70">A focused scope for selected systems, visits or technical needs.</p></div><div className="rounded-3xl border border-white/15 bg-white/10 p-6 sm:col-span-2"><Siren className="h-7 w-7 text-[#f3a779]" /><h3 className="mt-6 text-xl font-bold">Emergency support</h3><p className="mt-3 text-sm leading-7 text-white/70">Urgent requests are reviewed and routed according to equipment condition, location and operational impact.</p></div></div></div></section>

        <section className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24"><div className="grid gap-8 rounded-3xl border border-[#bcdde2] bg-[#eaf4fa] p-8 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Ready when you are</p><h2 className="mt-4 text-3xl font-bold text-[#0a4052] sm:text-4xl">Share the equipment details. We will help define the next step.</h2><p className="mt-4 max-w-2xl leading-7 text-[#617180]">You can attach photos, videos, error screens and equipment documents to a service request for faster technical review.</p></div><div className="flex flex-wrap gap-3 lg:justify-end"><Link href="/request-service"><Button size="lg" className="bg-[#c2410c] text-white hover:bg-[#c2410c]">Request Service <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/request-a-quote"><Button size="lg" variant="outline" className="border-[#0f6fae] text-[#0f6fae] hover:bg-white">Request a Quote <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link></div></div></section>
      </main>
    </SiteChrome>
  );
}
