import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  CircleHelp,
  Download,
  Globe2,
  HeartPulse,
  Layers,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SiteChrome from "@/components/SiteChrome";
import SEOHead from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";
import type { Product } from "@shared/commerce/types";

const fallbackHeroImage = "/manus-storage/spm-equipment-carm_d9a563ca.jpg";

type Family = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  icon: typeof Activity;
  matcher: (product: Product) => boolean;
};

const families: Family[] = [
  {
    id: "mobile-c-arms",
    eyebrow: "Intraoperative imaging",
    title: "Mobile C-Arms",
    description: "Compact and configurable fluoroscopy solutions for orthopedics, vascular procedures, surgery, pain management and emergency care.",
    accent: "from-[#0a4052] to-[#0f6fae]",
    icon: Activity,
    matcher: product => /c-arm|carmex|clinodigit c-arm/i.test(`${product.title} ${product.productType}`),
  },
  {
    id: "digital-radiography",
    eyebrow: "High-productivity imaging",
    title: "Digital Radiography",
    description: "Mobile and room-based DR systems with wireless detectors, intuitive acquisition and DICOM connectivity for modern radiology departments.",
    accent: "from-[#145b68] to-[#2b8c88]",
    icon: Boxes,
    matcher: product => /digital radiography|mobile dr|x-frame|xfm|corsix/i.test(`${product.title} ${product.productType}`),
  },
  {
    id: "radio-fluoroscopy",
    eyebrow: "Dynamic imaging",
    title: "Radio-Fluoroscopy",
    description: "Remote-controlled tables and multifunctional DRF platforms for high-quality radiography and fluoroscopy in one efficient workflow.",
    accent: "from-[#315c73] to-[#0f6fae]",
    icon: Stethoscope,
    matcher: product => /radio-fluoro|drf|fluoroscopy|clinodigit omega|clinodigit flo/i.test(`${product.title} ${product.productType}`),
  },
  {
    id: "mammography",
    eyebrow: "Breast imaging",
    title: "Mammography & Tomosynthesis",
    description: "Digital mammography configurations focused on excellent image quality, low dose, flexible positioning and breast screening productivity.",
    accent: "from-[#744b78] to-[#b06b86]",
    icon: HeartPulse,
    matcher: product => /mammograph|mammography|tomosynthesis/i.test(`${product.title} ${product.productType}`),
  },
];

function quoteHref(product: Product) {
  return `/request-a-quote?equipment=${encodeURIComponent(product.title)}&brand=${encodeURIComponent(product.vendor || "Italray")}&model=${encodeURIComponent(product.handle)}`;
}

function ProductCard({ product }: { product: Product }) {
  const image = product.images[0]?.url;
  const isQuoteOnly = product.tags.includes("Quote Only");

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border-[#dce7eb] bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0a4052] hover:shadow-2xl">
      <Link href={`/store/products/${product.handle}`} className="relative block aspect-[16/10] overflow-hidden bg-[#eef7fa]">
        {image ? (
          <img
            loading="lazy"
            decoding="async"
            src={image}
            alt={product.title}
            className="h-full w-full object-contain p-4 transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#94a3b8]"><Boxes className="h-14 w-14" /></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/60 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0a4052] shadow-sm">Italray</div>
        <div className={`absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-sm backdrop-blur-sm ${isQuoteOnly ? "bg-[#fff7ed]/95 text-[#c2410c]" : "bg-[#ecfdf5]/95 text-[#047857]"}`}>
          {isQuoteOnly ? <Mail className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          {isQuoteOnly ? "Project quotation" : "Storefront available"}
        </div>
      </Link>
      <CardContent className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#0f6fae]">{product.productType || "Medical imaging system"}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-extrabold leading-snug text-[#0a4052] transition-colors group-hover:text-[#0f6fae]">{product.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#617180]">{product.description}</p>
        <div className="mt-auto flex gap-2 pt-6">
          <Link href={`/store/products/${product.handle}`} className="min-w-0 flex-1">
            <Button className="w-full rounded-xl bg-[#0a4052] text-xs font-bold text-white hover:bg-[#063545]">View product <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></Button>
          </Link>
          {isQuoteOnly ? <Link href={quoteHref(product)}><Button variant="outline" className="h-10 rounded-xl border-[#c2410c] px-3 text-[#c2410c] hover:bg-[#fff7ed]" aria-label={`Request a quote for ${product.title}`}><Mail className="h-4 w-4" /></Button></Link> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ItalrayPortfolio() {
  const { data: products = [], isLoading, error } = trpc.commerce.products.list.useQuery({ first: 50 });
  const italrayProducts = products.filter(product => (product.vendor || "").toLowerCase() === "italray");
  const heroImage = italrayProducts.find(product => product.images[0]?.url)?.images[0]?.url || fallbackHeroImage;

  return (
    <SiteChrome>
      <SEOHead
        title="Italray Medical Imaging Portfolio"
        description="Official Italray product portfolio in Egypt: mobile C-Arms, digital radiography, dynamic radio-fluoroscopy, and digital mammography systems supported by SPM."
        url="/catalogue/italray"
      />
      <main className="bg-[#f7fafc] text-[#1e293b]">
        <div className="border-b border-[#dce7eb] bg-white">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-3 lg:px-8">
            <Link href="/catalogue" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748b] transition hover:text-[#0a4052]"><ArrowLeft className="h-3.5 w-3.5" /> All equipment</Link>
            <span className="text-xs font-semibold text-[#94a3b8]">SPM / Italray / Product Portfolio</span>
          </div>
        </div>

        {/* Brand hero */}
        <section className="relative isolate overflow-hidden bg-[#061f2b] text-white">
          <img loading="eager" decoding="async" src={heroImage} alt="Italray medical imaging system" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-[linear-gradient(100deg,#061f2b_0%,rgba(6,31,43,.96)_37%,rgba(10,64,82,.78)_70%,rgba(15,111,174,.34)_100%)]" aria-hidden="true" />
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full border border-[#8be0d5]/20 sm:h-[34rem] sm:w-[34rem]" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1280px] gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1fr_.75fr] lg:items-center lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8be0d5]/35 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[.18em] text-[#b9f1e7] backdrop-blur-sm"><Sparkles className="h-3.5 w-3.5 text-[#8be0d5]" /> Italray X-Ray Solutions</div>
              <h1 className="mt-6 text-5xl font-extrabold leading-[.98] tracking-[-.05em] text-white sm:text-6xl lg:text-[82px]">Imaging that moves with your clinical ambition.</h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">A complete portfolio of mobile C-Arms, digital radiography, radio-fluoroscopy and mammography systems—presented, configured and supported by SPM in Egypt.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#italray-families"><Button size="lg" className="h-12 rounded-xl bg-[#c2410c] px-6 text-sm font-bold text-white shadow-xl shadow-[#c2410c]/25 hover:bg-[#9a3412]">Explore product families <ArrowRight className="ml-2 h-4 w-4" /></Button></a>
                <Link href="/request-a-quote?brand=Italray"><Button size="lg" variant="outline" className="h-12 rounded-xl border-white/40 bg-white/10 px-6 text-sm font-bold text-white hover:bg-white/20">Talk to an Italray specialist <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"><BadgeCheck className="h-6 w-6 text-[#8be0d5]" /><p className="mt-8 text-3xl font-extrabold">1974</p><p className="mt-1 text-xs leading-5 text-white/65">Italray heritage in X-ray technology</p></div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:translate-y-8"><Globe2 className="h-6 w-6 text-[#8be0d5]" /><p className="mt-8 text-3xl font-extrabold">70+</p><p className="mt-1 text-xs leading-5 text-white/65">Countries reached by the manufacturer</p></div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"><ShieldCheck className="h-6 w-6 text-[#8be0d5]" /><p className="mt-8 text-3xl font-extrabold">Docs</p><p className="mt-1 text-xs leading-5 text-white/65">Project documentation available on request</p></div>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:translate-y-8"><Wrench className="h-6 w-6 text-[#8be0d5]" /><p className="mt-8 text-3xl font-extrabold">SPM</p><p className="mt-1 text-xs leading-5 text-white/65">Local service, parts and lifecycle support</p></div>
            </div>
          </div>
        </section>

        {/* Brand navigation */}
        <section className="border-b border-[#dce7eb] bg-white">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-5 py-5 lg:px-8">
            <p className="text-sm font-bold text-[#0a4052]">Italray portfolio</p>
            <nav className="flex flex-wrap gap-2 text-xs font-bold text-[#64748b]" aria-label="Italray portfolio sections">
              <a href="#italray-families" className="rounded-full bg-[#eaf4fa] px-3.5 py-2 text-[#0a4052] hover:bg-[#d7edf5]">Product families</a>
              <a href="#italray-workflows" className="rounded-full px-3.5 py-2 hover:bg-[#f1f5f9] hover:text-[#0a4052]">Clinical workflows</a>
              <a href="#italray-support" className="rounded-full px-3.5 py-2 hover:bg-[#f1f5f9] hover:text-[#0a4052]">Support & resources</a>
              <Link href="/contact" className="rounded-full px-3.5 py-2 hover:bg-[#f1f5f9] hover:text-[#0a4052]">Contact SPM</Link>
            </nav>
          </div>
        </section>

        {/* Product families */}
        <section id="italray-families" className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Dedicated to clinical innovation</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-.04em] text-[#0a4052] sm:text-5xl">Choose the imaging family that fits the way your team works.</h2>
            <p className="mt-5 text-base leading-8 text-[#617180]">From a compact mobile unit to a complete DRF room, start with the clinical workflow and then select the system configuration, detector package and service scope with SPM.</p>
          </div>

          {isLoading ? (
            <div className="mt-12 flex items-center justify-center rounded-3xl border border-[#dce7eb] bg-white p-16 text-sm text-[#64748b]"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading Italray systems…</div>
          ) : error ? (
            <div className="mt-12 rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">Unable to load the live Italray product portfolio right now. You can still request a configured quote from SPM.</div>
          ) : (
            <div className="mt-12 space-y-16">
              {families.map((family, index) => {
                const familyProducts = italrayProducts.filter(family.matcher);
                const Icon = family.icon;
                return (
                  <div key={family.id} id={family.id} className="scroll-mt-28">
                    <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
                      <div className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${family.accent} p-7 text-white shadow-lg sm:p-9`}>
                        <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full border border-white/15" aria-hidden="true" />
                        <div className="relative">
                          <Icon className="h-9 w-9 text-[#b9f1e7]" />
                          <p className="mt-14 text-xs font-bold uppercase tracking-[.2em] text-white/65">0{index + 1} / {family.eyebrow}</p>
                          <h3 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{family.title}</h3>
                          <p className="mt-4 text-sm leading-7 text-white/80">{family.description}</p>
                          <Link href="/request-a-quote?brand=Italray" className="mt-7 inline-flex items-center text-sm font-bold text-white hover:text-[#b9f1e7]">Configure this family <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                        </div>
                      </div>
                      <div>
                        {familyProducts.length > 0 ? (
                          <div className="grid gap-5 sm:grid-cols-2">{familyProducts.map(product => <ProductCard key={product.id} product={product} />)}</div>
                        ) : (
                          <div className="flex min-h-56 items-center justify-center rounded-3xl border border-dashed border-[#bcdde2] bg-white p-8 text-center text-sm text-[#64748b]">More {family.title.toLowerCase()} configurations can be sourced through an SPM project quotation.</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Clinical workflow section */}
        <section id="italray-workflows" className="border-y border-[#dce7eb] bg-white py-20 lg:py-24">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Beyond the device</p><h2 className="mt-4 text-4xl font-extrabold tracking-[-.04em] text-[#0a4052]">A portfolio arranged around real clinical workflows.</h2></div>
              <Link href="/request-service" className="inline-flex items-center text-sm font-bold text-[#c2410c]">Discuss your department <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                { icon: Stethoscope, title: "Surgery & intervention", text: "Positioning, pulsed fluoroscopy, low-dose imaging and image review for demanding intraoperative procedures." },
                { icon: Activity, title: "Radiology productivity", text: "Wireless detectors, automated positioning, DICOM workflows and flexible mobile or fixed-room configurations." },
                { icon: HeartPulse, title: "Screening & diagnosis", text: "Digital mammography and tomosynthesis solutions designed around image quality, dose control and patient comfort." },
              ].map(item => <div key={item.title} className="rounded-3xl border border-[#dce7eb] bg-[#fafcfd] p-7 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"><item.icon className="h-7 w-7 text-[#0f6fae]" /><h3 className="mt-6 text-xl font-extrabold text-[#0a4052]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#617180]">{item.text}</p></div>)}
            </div>
          </div>
        </section>

        {/* Support / resource links */}
        <section id="italray-support" className="mx-auto max-w-[1280px] px-5 py-20 lg:px-8 lg:py-24">
          <div className="rounded-[2rem] bg-[#0a4052] p-7 text-white sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8be0d5]">SPM lifecycle support</p><h2 className="mt-4 text-4xl font-extrabold tracking-[-.04em] sm:text-5xl">The portfolio does not stop at delivery.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-white/75">SPM connects the Italray system selection with site planning, installation, commissioning, operator training, service contracts, genuine parts and technical documentation.</p><Link href="/request-a-quote?brand=Italray" className="mt-8 inline-flex"><Button className="h-12 rounded-xl bg-[#c2410c] px-6 text-sm font-bold text-white hover:bg-[#9a3412]">Start an Italray project <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Download, label: "Brochures & documents", href: "/downloads", text: "Request official documents and configuration packs." },
                  { icon: Wrench, label: "Service & commissioning", href: "/request-service", text: "Plan installation, calibration and after-sales support." },
                  { icon: Layers, label: "Genuine spare parts", href: "/spare-parts", text: "Identify and source verified OEM components." },
                  { icon: CircleHelp, label: "Talk to an expert", href: "/contact", text: "Connect with the SPM commercial and engineering team." },
                ].map(resource => <Link key={resource.label} href={resource.href} className="group rounded-2xl border border-white/10 bg-white/10 p-5 transition hover:bg-white/15"><resource.icon className="h-5 w-5 text-[#b9f1e7]" /><p className="mt-5 text-sm font-bold text-white group-hover:text-[#b9f1e7]">{resource.label}</p><p className="mt-2 text-xs leading-5 text-white/60">{resource.text}</p><ArrowRight className="mt-4 h-4 w-4 text-[#c2410c] transition group-hover:translate-x-1" /></Link>)}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[#dce7eb] bg-white py-10">
          <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center lg:px-8">
            <div><p className="text-sm font-bold text-[#0a4052]">Need a different configuration?</p><p className="mt-1 text-xs text-[#64748b]">Tell us the room, workflow and clinical application. We will guide the next step.</p></div>
            <div className="flex flex-wrap gap-2"><Link href="/request-a-quote?brand=Italray"><Button className="rounded-xl bg-[#0a4052] text-white hover:bg-[#063545]">Request a quote</Button></Link><Link href="/contact"><Button variant="outline" className="rounded-xl border-[#0a4052] text-[#0a4052]">Contact SPM</Button></Link></div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
