import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cog,
  FileCheck2,
  Globe2,
  GraduationCap,
  MapPin,
  MonitorCog,
  Scale,
  ShieldCheck,
  Target,
  Wrench,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import SiteChrome from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";

const partnerLogos: Record<string, string> = {
  italray: "/manus-storage/italray-logo_57cfff13.png",
  hermann: "/manus-storage/hermann-logo_7f4be603.png",
};

const fallback = {
  eyebrow: "ABOUT SPM",
  title: "Medical imaging technology, engineered for continuity.",
  intro:
    "With more than seven years of experience, SPM is a premium medical imaging technology partner dedicated to the engineered lifecycle management of critical hospital systems.",
  whoWeAre:
    "SPM is a leading provider of medical imaging solutions in Egypt, specializing in the supply and maintenance of advanced systems. We deliver trusted, end-to-end solutions combining innovative equipment, certified multi-vendor technical service, global spare parts sourcing, and comprehensive maintenance support.",
  mission:
    "Our mission is to empower healthcare facilities with advanced medical imaging systems and expert maintenance services, ensuring continuous performance, operational efficiency, and uncompromised patient care. Through integrity, collaboration, and a passion for excellence, we create lasting value for our customers and support the evolving needs of the healthcare sector.",
  vision:
    "We aspire to lead the medical imaging sector by delivering advanced solutions and setting new standards in reliability, innovation, and service excellence. We aim to be a trusted partner for healthcare providers while expanding our contribution to the future of medical imaging technologies.",
  geography:
    "We support customers across Egypt and selected MENA markets, with service operations spanning 24 of Egypt's 27 governorates—from Alexandria to Aswan.",
  address: "16 Ahmed Hassan El Zyaat Street, 7th District, Nasr City, Cairo, Egypt",
  heroImage: "/manus-storage/spm-service-engineer_96348b80.jpg",
  profileDocument: "",
  careersVisible: "true",
};

type AboutData = typeof fallback & {
  stats?: Array<{ value: string; label: string; description: string }>;
  services?: Array<{ title: string; text: string }>;
  operatingModel?: Array<{ title: string; text: string }>;
  partners?: Array<{ name: string; status: string; text: string; logoUrl?: string }>;
  quality?: Array<{ title: string; text: string; imageUrl?: string }>;
  missionBullets?: string[];
  visionBullets?: string[];
};

const fallbackData: AboutData = {
  ...fallback,
  stats: [
    { value: "450+", label: "Hospitals Reached", description: "Healthcare partners and centers" },
    { value: "66", label: "UPA Projects", description: "Public-sector project experience" },
    { value: "7+", label: "Years of Experience", description: "Medical imaging expertise" },
    { value: "24/27", label: "Governorates Covered", description: "Nationwide Egyptian service reach" },
  ],
  missionBullets: [
    "Keep critical imaging systems clinically ready and operational.",
    "Connect equipment supply with certified service, parts and training.",
    "Build lasting value through integrity, collaboration and measurable follow-through.",
  ],
  visionBullets: [
    "Set a higher standard for reliability across the medical imaging lifecycle.",
    "Be the trusted local partner for healthcare providers and technical teams.",
    "Expand access to safer, smarter and more serviceable imaging technology.",
  ],
  services: [
    { title: "Medical Imaging Equipment", text: "Supply and support for C-Arm, X-Ray, CT, Cathlab and related imaging systems." },
    { title: "Certified Technical Service", text: "Preventive and corrective maintenance, troubleshooting, calibration and digital imaging optimization." },
    { title: "Installation & Commissioning", text: "Pre-installation coordination, system assembly, calibration, performance validation and safety verification." },
    { title: "Training & Warranty Support", text: "Clinical application training, biomedical engineering orientation and structured warranty service." },
  ],
  operatingModel: [
    { title: "Technical expertise", text: "Structured service programs combine diagnostics, preventive maintenance, corrective support and performance tracking." },
    { title: "Safe deployment", text: "Installation and commissioning follow manufacturer standards with configuration, calibration and radiation safety verification." },
    { title: "Clinical readiness", text: "On-site guidance and operational training help healthcare teams use systems safely and efficiently." },
    { title: "Response framework", text: "A documented service model supports remote diagnostics and timely on-site intervention when it is needed." },
  ],
  partners: [
    { name: "Italray", status: "Exclusive Agent in Egypt", text: "Original imaging systems backed by manufacturer standards, technical support and genuine spare parts." },
    { name: "Hermann Medizintechnik", status: "Authorized Agent in Egypt", text: "Specialized medical technology support through an approved partner relationship." },
  ],
  quality: [
    { title: "Industrial Control Authority", text: "Maintenance and service documentation is organized for responsible technical review." },
    { title: "ISO 9001 Certified", text: "A structured operating framework supports consistent service delivery and operational reliability." },
    { title: "License No. 2528/7", text: "Official company and service records remain available for controlled internal review." },
    { title: "Quality-aware communication", text: "Product, CE and regulatory evidence is controlled through internal review before publication." },
  ],
};

function mergeAboutData(data: unknown): AboutData {
  if (!data || typeof data !== "object") return fallbackData;
  const incoming = data as Partial<AboutData>;
  return {
    ...fallbackData,
    ...incoming,
    stats: incoming.stats?.length ? incoming.stats : fallbackData.stats,
    services: incoming.services?.length ? incoming.services : fallbackData.services,
    operatingModel: incoming.operatingModel?.length ? incoming.operatingModel : fallbackData.operatingModel,
    partners: incoming.partners?.length ? incoming.partners : fallbackData.partners,
    quality: incoming.quality?.length ? incoming.quality : fallbackData.quality,
    missionBullets: incoming.missionBullets?.length ? incoming.missionBullets : fallbackData.missionBullets,
    visionBullets: incoming.visionBullets?.length ? incoming.visionBullets : fallbackData.visionBullets,
  };
}

const serviceIcons = [MonitorCog, Wrench, Cog, GraduationCap];
const qualityIcons = [Scale, BadgeCheck, FileCheck2, ClipboardCheck];

export default function AboutPage() {
  const pageQuery = trpc.cms.publishedBySlug.useQuery({ slug: "about" });
  const page = mergeAboutData(pageQuery.data?.data);
  const heroImage = page.heroImage?.includes("spm-hero-medical-engineer") || page.heroImage?.includes("spm-italray-product-hero") ? fallbackData.heroImage : page.heroImage;

  return (
    <SiteChrome>
      <SEOHead
        title="About SPM | Medical Imaging Technology & Lifecycle Support"
        description="Learn how SPM combines medical imaging equipment, certified technical service, genuine parts and lifecycle support across Egypt and selected MENA markets."
        url="/about"
      />
      <main>
        <section className="relative overflow-hidden bg-[#eaf4fa]">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#0f6fae]">{page.eyebrow}</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.05em] text-[#0a4052] sm:text-6xl">{page.title}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#536474]">{page.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="bg-[#c2410c] text-white hover:bg-[#c2410c]" asChild><Link href="/contact">Contact SPM <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button>
                <Button size="lg" variant="outline" className="border-[#0f6fae] text-[#0f6fae] hover:bg-white" asChild><Link href="/request-a-quote">Request a Quote <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[#536474]">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#1e8ac4]" /> Established in 2019</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#1e8ac4]" /> Egypt & selected MENA markets</span>
              </div>
            </div>
            <div className="relative min-h-[390px] overflow-hidden rounded-[30px] bg-[#0a4052] shadow-2xl shadow-[#0a4052]/20 lg:min-h-[520px]">
              <img src={heroImage} alt="SPM field engineer maintaining a medical imaging system" loading="eager" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[58%_center] transition duration-700 hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#061f2b]/45 via-[#061f2b]/10 to-transparent" />
              <div className="absolute right-5 top-5 flex flex-col items-end gap-2 sm:right-7 sm:top-7">
                <div className="rounded-xl border border-white/20 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm">
                  <img src={partnerLogos.italray} alt="Italray official partner logo" loading="lazy" decoding="async" className="h-7 w-auto max-w-[132px] object-contain" />
                </div>
                <div className="rounded-xl border border-white/20 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-sm">
                  <img src={partnerLogos.hermann} alt="Hermann Medizintechnik official partner logo" loading="lazy" decoding="async" className="h-7 w-auto max-w-[132px] object-contain" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <div className="max-w-[78%] rounded-2xl border border-white/20 bg-[#061f2b]/75 p-5 text-white backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8be0d5]">Engineered lifecycle support</p>
                  <p className="mt-2 text-xl font-semibold">Maintenance, technology and trusted partner support in one operating model.</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">SPM keeps Italray and Hermann systems supported through responsive engineering, genuine parts and practical lifecycle guidance.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-b border-[#dce7eb] bg-white py-10">
          <img src="/manus-storage/spm-logo-cropped_7b519adc.webp" alt="" aria-hidden="true" className="pointer-events-none absolute -right-20 top-1/2 w-[420px] -translate-y-1/2 opacity-[0.035]" />
          <div className="relative z-10 mx-auto grid max-w-[1280px] gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {page.stats?.map(stat => <div key={stat.label} className="rounded-2xl border border-[#e5edf1] bg-[#fafcfd]/95 p-5"><p className="text-3xl font-extrabold tracking-tight text-[#0a4052]">{stat.value}</p><p className="mt-1 text-sm font-bold text-[#1e293b]">{stat.label}</p><p className="mt-1 text-xs text-[#64748b]">{stat.description}</p></div>)}
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Who we are</p><h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.04em] text-[#0a4052]">A practical partner for critical hospital systems.</h2></div>
            <div><p className="text-lg leading-8 text-[#536474]">{page.whoWeAre}</p><div className="mt-8 flex items-start gap-4 rounded-2xl border border-[#bcdde2] bg-[#f7fafc] p-5"><Building2 className="mt-1 h-6 w-6 shrink-0 text-[#0f6fae]" /><div><p className="font-bold text-[#0a4052]">Headquarters</p><p className="mt-1 text-sm leading-6 text-[#617180]">{page.address}</p></div></div></div>
          </div>
        </section>

        <section className="bg-[#f7fafc] py-20 lg:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-6 px-5 lg:grid-cols-2 lg:px-8">
            <article className="rounded-3xl bg-[#0a4052] p-8 text-white shadow-xl sm:p-10"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#8be0d5]"><Target className="h-6 w-6" /></div><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-[#8be0d5]">Mission</p><ul className="mt-5 space-y-4">{page.missionBullets?.map(item => <li key={item} className="flex items-start gap-3 text-base leading-7 text-white/90"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#8be0d5]" /><span>{item}</span></li>)}</ul></article>
            <article className="rounded-3xl border border-[#d7e0e7] bg-white p-8 shadow-sm sm:p-10"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4fa] text-[#0f6fae]"><Globe2 className="h-6 w-6" /></div><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Vision</p><ul className="mt-5 space-y-4">{page.visionBullets?.map(item => <li key={item} className="flex items-start gap-3 text-base leading-7 text-[#536474]"><ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[#0f6fae]" /><span>{item}</span></li>)}</ul></article>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">What we do</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-[#0a4052]">One operating model across the equipment lifecycle.</h2></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">{page.services?.map((service, index) => { const Icon = serviceIcons[index % serviceIcons.length]; return <article key={service.title} className="rounded-2xl border border-[#d7e0e7] bg-white p-7 shadow-[0_2px_8px_rgba(11,41,66,.06)] transition hover:-translate-y-1 hover:border-[#bcdde2] hover:shadow-lg"><div className="flex items-center justify-between"><span className="text-sm font-bold text-[#0f6fae]">0{index + 1}</span><Icon className="h-6 w-6 text-[#0f6fae]" /></div><h3 className="mt-7 text-xl font-bold text-[#0a4052]">{service.title}</h3><p className="mt-3 text-sm leading-7 text-[#617180]">{service.text}</p></article>; })}</div>
        </section>

        <section className="border-y border-[#dce7eb] bg-white py-20 lg:py-24">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">How we work</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-[#0a4052]">Structured support, from planning to performance.</h2></div><p className="max-w-md text-sm leading-7 text-[#617180]">Our technical model is designed to reduce uncertainty around installation, use, maintenance and warranty support.</p></div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{page.operatingModel?.map((item, index) => <div key={item.title} className="relative rounded-2xl bg-[#f7fafc] p-6"><span className="text-xs font-bold text-[#0f6fae]">STEP 0{index + 1}</span><h3 className="mt-5 text-lg font-bold text-[#0a4052]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#617180]">{item.text}</p>{index < (page.operatingModel?.length ?? 0) - 1 ? <span aria-hidden="true" className="pointer-events-none absolute -right-5 top-1/2 z-10 hidden items-center lg:flex"><span className="w-8 border-t border-dashed border-[#84bac6]" /><ArrowRight className="h-4 w-4 text-[#0f6fae]" /></span> : null}</div>)}</div>
          </div>
        </section>

        <section className="border-y border-[#dce7eb] bg-[#f7fafc] py-20 lg:py-24">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-[#eaf4fa] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                  <BadgeCheck className="h-3.5 w-3.5 text-[#0f6fae]" /> Strategic Partnerships
                </div>
                <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-.04em] text-[#0a4052] sm:text-5xl">Global technology, local accountability.</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#617180]">SPM combines manufacturer relationships with local engineering responsibility and after-sales support, so every system has a clear path from installation to ongoing performance.</p>
              </div>
              <p className="max-w-xs text-sm font-semibold leading-6 text-[#0f6fae]">Two trusted technology relationships. One accountable SPM support model.</p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {page.partners?.map((partner, index) => {
                const key = partner.name.toLowerCase();
                const logoUrl = partner.logoUrl || (key.includes("italray") ? partnerLogos.italray : key.includes("hermann") ? partnerLogos.hermann : undefined);
                return (
                  <article key={partner.name} className="group relative overflow-hidden rounded-3xl border border-[#dce7eb] bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0a4052] hover:shadow-xl sm:p-9">
                    <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[72px] bg-[#eaf4fa] transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
                    <div className="relative flex items-start justify-between gap-5">
                      <div className="flex h-20 min-w-[150px] items-center rounded-2xl border border-[#e5edf1] bg-[#fafcfd] px-5">
                        {logoUrl ? <img src={logoUrl} alt={`${partner.name} official logo`} loading="lazy" decoding="async" className="max-h-12 max-w-[190px] object-contain" /> : <span className="font-bold text-[#0f6fae]">{partner.name}</span>}
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
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#eaf4fa] py-20 lg:py-24">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#bcdde2] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]"><ShieldCheck className="h-3.5 w-3.5 text-[#0f6fae]" /> Quality commitment</div>
              <h2 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-[#0a4052]">Clear evidence. Responsible communication.</h2>
              <p className="mt-5 leading-8 text-[#617180]">SPM keeps public product and service information reviewable, traceable and ready for the official evidence that belongs with each claim.</p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {page.quality?.map((item, index) => {
                const Icon = qualityIcons[index % qualityIcons.length];
                return (
                  <article key={item.title} className="group rounded-2xl border border-[#dce7eb] bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4fa] text-[#0f6fae] transition-colors group-hover:bg-[#0a4052] group-hover:text-white"><Icon className="h-6 w-6" /></div>
                    <p className="mt-6 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#0f6fae]">0{index + 1} / SPM STANDARD</p>
                    <h3 className="mt-3 text-lg font-bold text-[#0a4052]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#617180]">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24"><div className="grid gap-8 rounded-3xl bg-[#061f2b] p-8 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8be0d5]">Support across Egypt</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Let us understand the system behind the request.</h2><div className="mt-5 flex items-start gap-3 text-sm leading-6 text-white/75"><MapPin className="mt-1 h-5 w-5 shrink-0 text-[#8be0d5]" /><span>{page.address}<br />{page.geography}</span></div></div><div className="flex flex-wrap gap-3 lg:justify-end"><Button size="lg" className="bg-[#c2410c] text-white hover:bg-[#c2410c]" asChild><Link href="/contact">Contact SPM <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button><Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10" asChild><Link href="/request-service">Request Service <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button></div></div></section>
      </main>
    </SiteChrome>
  );
}
