import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Globe2,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Target,
  Wrench,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SiteChrome from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";

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
  heroImage: "/manus-storage/spm-hero-medical-engineer_fd2460bc.jpg",
  profileDocument: "",
  careersVisible: "true",
};

type AboutData = typeof fallback & {
  stats?: Array<{ value: string; label: string; description: string }>;
  services?: Array<{ title: string; text: string }>;
  operatingModel?: Array<{ title: string; text: string }>;
  partners?: Array<{ name: string; status: string; text: string; logoUrl?: string }>;
  quality?: Array<{ title: string; text: string }>;
};

const fallbackData: AboutData = {
  ...fallback,
  stats: [
    { value: "450+", label: "Hospitals Reached", description: "Healthcare partners and centers" },
    { value: "66", label: "UPA Projects", description: "Public-sector project experience" },
    { value: "7+", label: "Years of Experience", description: "Medical imaging expertise" },
    { value: "24/27", label: "Governorates Covered", description: "Nationwide Egyptian service reach" },
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
    { title: "Industrial Control Authority", text: "Certified maintenance center under the Industrial Control Authority of the Ministry of Trade and Industry." },
    { title: "ISO 9001 Certified", text: "A structured quality framework supporting consistent service delivery and operational reliability." },
    { title: "License No. 2528/7", text: "Accredited service-center license reference recorded in the official company profile." },
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
  };
}

export default function AboutPage() {
  const pageQuery = trpc.cms.publishedBySlug.useQuery({ slug: "about" });
  const page = mergeAboutData(pageQuery.data?.data);

  return (
    <SiteChrome>
      <main>
        <section className="relative overflow-hidden bg-[#eaf4fa]">
          <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.22em] text-[#0f6fae]">{page.eyebrow}</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.05em] text-[#0a4052] sm:text-6xl">
                {page.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#536474]">{page.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact">
                  <Button size="lg" className="bg-[#f36b21] text-white hover:bg-[#d95316]">
                    Contact SPM <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/request-a-quote">
                  <Button size="lg" variant="outline" className="border-[#0f6fae] text-[#0f6fae] hover:bg-white">
                    Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-[#536474]">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#1e8ac4]" /> Established in 2019</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#1e8ac4]" /> Egypt & selected MENA markets</span>
              </div>
            </div>
            <div className="relative min-h-[390px] overflow-hidden rounded-[30px] bg-[#0a4052] shadow-2xl shadow-[#0a4052]/20 lg:min-h-[520px]">
              <img src={page.heroImage} alt="SPM medical imaging engineer supporting a hospital system" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/90 via-[#0a4052]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="rounded-2xl border border-white/20 bg-[#061f2b]/75 p-5 text-white backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8be0d5]">Engineered lifecycle support</p>
                  <p className="mt-2 text-xl font-semibold">From equipment supply to long-term system performance.</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">SPM connects technology, service, parts and operational readiness around the realities of healthcare facilities.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#dce7eb] bg-white py-10">
          <div className="mx-auto grid max-w-[1280px] gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {page.stats?.map(stat => (
              <div key={stat.label} className="rounded-2xl border border-[#e5edf1] bg-[#fafcfd] p-5">
                <p className="text-3xl font-extrabold tracking-tight text-[#0a4052]">{stat.value}</p>
                <p className="mt-1 text-sm font-bold text-[#1e293b]">{stat.label}</p>
                <p className="mt-1 text-xs text-[#64748b]">{stat.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Who we are</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.04em] text-[#0a4052]">A practical partner for critical hospital systems.</h2>
            </div>
            <div>
              <p className="text-lg leading-8 text-[#536474]">{page.whoWeAre}</p>
              <div className="mt-8 flex items-start gap-4 rounded-2xl border border-[#bcdde2] bg-[#f7fafc] p-5">
                <Building2 className="mt-1 h-6 w-6 shrink-0 text-[#0f6fae]" />
                <div>
                  <p className="font-bold text-[#0a4052]">Headquarters</p>
                  <p className="mt-1 text-sm leading-6 text-[#617180]">{page.address}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7fafc] py-20 lg:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-6 px-5 lg:grid-cols-2 lg:px-8">
            <article className="rounded-3xl bg-[#0a4052] p-8 text-white shadow-xl sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#8be0d5]"><Target className="h-6 w-6" /></div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-[#8be0d5]">Mission</p>
              <p className="mt-4 text-lg leading-8 text-white/85">{page.mission}</p>
            </article>
            <article className="rounded-3xl border border-[#d7e0e7] bg-white p-8 shadow-sm sm:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4fa] text-[#0f6fae]"><Globe2 className="h-6 w-6" /></div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Vision</p>
              <p className="mt-4 text-lg leading-8 text-[#536474]">{page.vision}</p>
            </article>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">What we do</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-[#0a4052]">One operating model across the equipment lifecycle.</h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {page.services?.map((service, index) => (
              <article key={service.title} className="rounded-2xl border border-[#d7e0e7] bg-white p-7 shadow-[0_2px_8px_rgba(11,41,66,.06)] transition hover:-translate-y-1 hover:border-[#bcdde2] hover:shadow-lg">
                <div className="flex items-center justify-between"><span className="text-sm font-bold text-[#0f6fae]">0{index + 1}</span><Wrench className="h-5 w-5 text-[#0f6fae]" /></div>
                <h3 className="mt-7 text-xl font-bold text-[#0a4052]">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#617180]">{service.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#dce7eb] bg-white py-20 lg:py-24">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">How we work</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-[#0a4052]">Structured support, from planning to performance.</h2></div>
              <p className="max-w-md text-sm leading-7 text-[#617180]">Our technical model is designed to reduce uncertainty around installation, use, maintenance and warranty support.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {page.operatingModel?.map((item, index) => (
                <div key={item.title} className="rounded-2xl bg-[#f7fafc] p-6"><span className="text-xs font-bold text-[#0f6fae]">STEP 0{index + 1}</span><h3 className="mt-5 text-lg font-bold text-[#0a4052]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#617180]">{item.text}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Strategic partnerships</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-[#0a4052]">Global technology, local accountability.</h2><p className="mt-5 leading-8 text-[#617180]">SPM combines manufacturer relationships with local engineering responsibility and after-sales support.</p></div>
            <div className="grid gap-5 sm:grid-cols-2">
              {page.partners?.map(partner => (
                <article key={partner.name} className="rounded-2xl border border-[#d7e0e7] bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><HeartHandshake className="h-6 w-6 text-[#0f6fae]" /><h3 className="text-xl font-bold text-[#0a4052]">{partner.name}</h3></div><p className="mt-4 inline-flex rounded-full bg-[#eaf4fa] px-3 py-1 text-xs font-bold text-[#0f6fae]">{partner.status}</p><p className="mt-4 text-sm leading-7 text-[#617180]">{partner.text}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#eaf4fa] py-20 lg:py-24">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
            <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Quality & regulatory commitment</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-[#0a4052]">Evidence-led communication for healthcare technology.</h2><p className="mt-5 leading-8 text-[#617180]">SPM operates with a quality-aware service model. Official certificates, agency documents and product evidence remain controlled by the responsible SPM reviewers before publication.</p></div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {page.quality?.map(item => <article key={item.title} className="rounded-2xl bg-white p-6 shadow-sm"><ShieldCheck className="h-6 w-6 text-[#0f6fae]" /><h3 className="mt-5 text-lg font-bold text-[#0a4052]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#617180]">{item.text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-8 rounded-3xl bg-[#061f2b] p-8 text-white sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8be0d5]">Support across Egypt</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Let us understand the system behind the request.</h2><div className="mt-5 flex items-start gap-3 text-sm leading-6 text-white/75"><MapPin className="mt-1 h-5 w-5 shrink-0 text-[#8be0d5]" /><span>{page.address}<br />{page.geography}</span></div></div>
            <div className="flex flex-wrap gap-3 lg:justify-end"><Link href="/contact"><Button size="lg" className="bg-[#f36b21] text-white hover:bg-[#d95316]">Contact SPM <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/request-service"><Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">Request Service <ArrowRight className="ml-2 h-4 w-4" /></Button></Link></div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
