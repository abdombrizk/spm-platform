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
  FileText,
  Layers,
  Maximize2,
  Monitor,
  Play,
  ScanLine,
  Settings2,
  ShieldCheck,
  Stethoscope,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";
import type { Product } from "@shared/commerce/types";

const italrayLogo = "/manus-storage/italray-logo_57cfff13.png";
const carmexBrochure = "/manus-storage/CARMEXFP_ENG_TR_9872ec0c.pdf";

type Hotspot = { id: string; label: string; detail: string; top: string; left: string };
type TechCard = { icon: typeof ScanLine; eyebrow: string; title: string; text: string };
type SpecGroup = { id: string; title: string; rows: Array<[string, string]> };
type QuickSpec = { icon: typeof ScanLine; metric: string; label: string };
type GalleryImage = { url: string; altText: string | null };

const carmexHighlights = [
  "Dynamic flat panel detector: 21×21 cm or 30×30 cm.",
  "3.5 kW, 5 kW or 15 kW high-frequency generator options.",
  "15-inch medical-grade touch screen, rotatable ±180°.",
  "Continuous and pulsed fluoroscopy with digital radiography workflow.",
];

const genericHighlights = [
  "Configure the system around the clinical workflow and room requirements.",
  "Official technical documentation available through the SPM team.",
  "Installation, commissioning, training and service planning available.",
  "Quote-led procurement with a clear technical review before supply.",
];

const carmexHotspots: Hotspot[] = [
  { id: "tube", label: "X-ray tube", detail: "CARMEX FP is built for fluoroscopy and radiography workflows with stationary or rotating anode options.", top: "35%", left: "71%" },
  { id: "detector", label: "Dynamic flat panel", detail: "Select a 21×21 cm or 30×30 cm dynamic flat panel detector configuration.", top: "72%", left: "75%" },
  { id: "display", label: "Medical display", detail: "The system includes a 15-inch medical-grade touch screen and supports separate monitors or a 27/32-inch display option.", top: "47%", left: "21%" },
  { id: "mobile", label: "Mobile workflow", detail: "Compact, lightweight and balanced for positioning in orthopedics, surgery, interventional procedures and emergency care.", top: "65%", left: "50%" },
];

const genericHotspots: Hotspot[] = [
  { id: "system", label: "Imaging system", detail: "Explore the product images and request the official configuration pack from SPM.", top: "42%", left: "56%" },
  { id: "workflow", label: "Clinical workflow", detail: "Tell SPM about your department, room and intended application so the right configuration can be proposed.", top: "66%", left: "34%" },
  { id: "support", label: "Lifecycle support", detail: "Installation, commissioning, training, spare parts and maintenance can be scoped with the quotation.", top: "58%", left: "78%" },
];

function quoteHref(product: Product) {
  return `/request-a-quote?equipment=${encodeURIComponent(product.title)}&brand=${encodeURIComponent(product.vendor || "Italray")}&model=${encodeURIComponent(product.handle)}`;
}

function serviceHref(product: Product) {
  return `/request-service?equipment=${encodeURIComponent(product.title)}&brand=${encodeURIComponent(product.vendor || "Italray")}&model=${encodeURIComponent(product.handle)}`;
}

function getProductData(product: Product) {
  const isCarmex = /carmex/i.test(`${product.title} ${product.handle}`);
  const hotspots = isCarmex ? carmexHotspots : genericHotspots;
  const highlights = isCarmex ? carmexHighlights : genericHighlights;
  const quickSpecs: QuickSpec[] = isCarmex
    ? [
        { icon: Settings2, metric: "3.5 / 5 / 15 kW", label: "Generator options" },
        { icon: ScanLine, metric: "21×21 / 30×30 cm", label: "Dynamic flat panel" },
        { icon: Monitor, metric: "15-inch", label: "Medical touch screen" },
        { icon: Activity, metric: "40 / 100 mA", label: "Fluoro / radiography" },
      ]
    : [
        { icon: Settings2, metric: "Configurable", label: "Project package" },
        { icon: ScanLine, metric: "Italray", label: "Manufacturer" },
        { icon: Monitor, metric: "Digital", label: "Imaging workflow" },
        { icon: Wrench, metric: "SPM", label: "Lifecycle support" },
      ];
  const technicalCards: TechCard[] = isCarmex
    ? [
        { icon: ScanLine, eyebrow: "Imaging modes", title: "Fluoroscopy + radiography", text: "Designed for continuous and pulsed fluoroscopy as well as digital radiography in one mobile workflow." },
        { icon: Layers, eyebrow: "Detector platform", title: "Dynamic flat panel", text: "Choose the 21×21 cm or 30×30 cm detector size that fits the procedure and field of view." },
        { icon: Monitor, eyebrow: "Control & display", title: "Operator-first control", text: "A rotatable 15-inch medical-grade touch screen with configurable medical monitor options." },
        { icon: Settings2, eyebrow: "Procedure tools", title: "Optional image processing", text: "Advanced tools include ABC, edge enhancement, noise reduction and vascular procedure packages." },
      ]
    : [
        { icon: ScanLine, eyebrow: "Imaging workflow", title: "Built around the application", text: "Review the product images, intended use and available configurations with the SPM technical team." },
        { icon: Layers, eyebrow: "Configuration", title: "Select the right package", text: "Detector, generator, workstation and room requirements can be aligned to the project brief." },
        { icon: Monitor, eyebrow: "Documentation", title: "Technical clarity", text: "Official brochures, datasheets and preparation documents are available through the approved request flow." },
        { icon: Settings2, eyebrow: "Lifecycle", title: "Support beyond delivery", text: "SPM can coordinate installation, commissioning, training, genuine parts and maintenance planning." },
      ];
  const specGroups: SpecGroup[] = isCarmex
    ? [
        { id: "generator", title: "Generator & tube", rows: [["Generator options", "3.5 kW / 5 kW / 15 kW"], ["Fluoroscopy current", "40 mA maximum"], ["Radiography current", "100 mA maximum"], ["Anode", "Stationary or rotating anode"]] },
        { id: "detector", title: "Detector & display", rows: [["Detector", "Dynamic flat panel"], ["Detector sizes", "21×21 cm or 30×30 cm"], ["Touch screen", "15-inch medical-grade touch screen"], ["Touch screen movement", "Rotatable ±180°"], ["Monitor options", "Two 19-inch medical monitors or one 27/32-inch display"]] },
        { id: "mechanics", title: "Mechanical & workflow", rows: [["Primary use", "Fluoroscopy and radiography"], ["Configuration", "Compact, lightweight and balanced mobile C-arm"], ["Applications", "Orthopedics, surgery, interventional procedures and emergency care"], ["Availability", "Confirmed by project quotation and selected configuration"]] },
        { id: "processing", title: "Workstation & processing", rows: [["Image processing", "ABC, edge enhancement and noise reduction"], ["Optional package", "Advanced vascular and interventional tools"], ["Documentation", "Official technical brochure available"], ["Planning", "Installation and project requirements reviewed by SPM"]] },
      ]
    : [
        { id: "configuration", title: "Configuration", rows: [["Product family", product.productType || "Italray medical imaging system"], ["Manufacturer", product.vendor || "Italray"], ["Commercial model", "Quote-led project configuration"], ["Availability", "Confirmed with the SPM technical and commercial team"]] },
        { id: "workflow", title: "Clinical workflow", rows: [["Primary application", "To be confirmed for the project"], ["Room requirements", "Reviewed during technical qualification"], ["Training", "Available as part of the project scope"], ["Service", "Commissioning and maintenance planning available"]] },
      ];
  return { isCarmex, hotspots, highlights, quickSpecs, technicalCards, specGroups };
}

function ProductImage({ image, product, className = "" }: { image?: GalleryImage; product: Product; className?: string }) {
  return image ? <img src={image.url} alt={image.altText || product.title} loading="lazy" decoding="async" className={`h-full w-full object-contain ${className}`} /> : <div className="flex h-full items-center justify-center text-sm text-[#617180]">Product image available on request</div>;
}

function HotspotFigure({ product, hotspots }: { product: Product; hotspots: Hotspot[] }) {
  const [activeId, setActiveId] = useState(hotspots[0]?.id || "");
  const active = hotspots.find(item => item.id === activeId) || hotspots[0];
  const image = product.images[0];
  return <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-[#f4f8fa] shadow-sm"><div className="relative aspect-[16/10] min-h-[300px] overflow-hidden sm:min-h-[430px]"><ProductImage image={image} product={product} className="p-7 sm:p-12" /><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(15,111,174,.12),transparent_50%)]" aria-hidden="true" />{hotspots.map(hotspot => <button key={hotspot.id} type="button" aria-label={`Explore ${hotspot.label}`} onClick={() => setActiveId(hotspot.id)} className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white shadow-lg transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0f6fae]/30 ${activeId === hotspot.id ? "scale-110 bg-[#c2410c]" : "bg-[#0f6fae]/90 hover:scale-110 hover:bg-[#c2410c]"}`} style={{ top: hotspot.top, left: hotspot.left }}><span className="h-2.5 w-2.5 rounded-full bg-white" /></button>)}<div className="absolute left-5 top-5 border border-white/70 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#0a4052]">Interactive product view</div></div><div className="grid gap-4 border-t border-[#e5e7eb] bg-white p-5 sm:grid-cols-[.75fr_1.25fr] sm:p-6"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#0f6fae]">Explore the system</p><div className="mt-3 flex flex-wrap gap-2">{hotspots.map(hotspot => <button key={hotspot.id} type="button" onClick={() => setActiveId(hotspot.id)} className={`px-3 py-2 text-xs font-bold transition ${activeId === hotspot.id ? "bg-[#0a4052] text-white" : "bg-[#eaf4fa] text-[#0a4052] hover:bg-[#d7edf5]"}`}>{hotspot.label}</button>)}</div></div>{active ? <div className="bg-[#f7fafc] p-4"><div className="flex items-start gap-3"><Maximize2 className="mt-0.5 h-4 w-4 shrink-0 text-[#c2410c]" aria-hidden="true" /><div><h3 className="text-sm font-extrabold text-[#0a4052]">{active.label}</h3><p className="mt-1 text-sm leading-6 text-[#617180]">{active.detail}</p></div></div></div> : null}</div></div>;
}

function StickyProductNav({ product }: { product: Product }) {
  const [active, setActive] = useState("overview");
  const links = ["overview", "technology", "specs", "gallery", "resources", "service"];
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && setActive(entry.target.id)), { rootMargin: "-22% 0px -68% 0px" });
    links.forEach(id => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, []);
  return <nav aria-label={`${product.title} sections`} className="sticky top-[72px] z-20 border-y border-[#e5e7eb] bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-[1280px] gap-1 overflow-x-auto px-5 py-2 lg:px-8">{links.map(id => <a key={id} href={`#${id}`} onClick={() => setActive(id)} className={`shrink-0 px-3 py-2 text-[11px] font-bold uppercase tracking-[.12em] transition ${active === id ? "bg-[#0a4052] text-white" : "text-[#64748b] hover:bg-[#eaf4fa] hover:text-[#0a4052]"}`}>{id}</a>)}</div></nav>;
}

function TechSpecs({ groups }: { groups: SpecGroup[] }) {
  const [activeId, setActiveId] = useState(groups[0]?.id || "");
  const active = groups.find(group => group.id === activeId) || groups[0];
  return <><div className="hidden gap-7 lg:grid lg:grid-cols-[.7fr_1.3fr] lg:items-start"><div className="flex flex-col gap-2">{groups.map(group => <button key={group.id} type="button" onClick={() => setActiveId(group.id)} className={`flex items-center justify-between px-5 py-4 text-left text-sm font-bold transition ${activeId === group.id ? "bg-white text-[#0a4052] shadow-sm" : "text-white/65 hover:bg-white/10 hover:text-white"}`}><span>{group.title}</span><ChevronRight className={`h-4 w-4 ${activeId === group.id ? "text-[#c2410c]" : "text-white/40"}`} /></button>)}</div>{active ? <SpecTable group={active} /> : null}</div><div className="space-y-2 lg:hidden">{groups.map(group => <div key={group.id} className="border border-white/10 bg-white"><button type="button" onClick={() => setActiveId(activeId === group.id ? "" : group.id)} className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-bold text-[#0a4052]"><span>{group.title}</span><ChevronDown className={`h-4 w-4 transition ${activeId === group.id ? "rotate-180" : ""}`} /></button>{activeId === group.id ? <SpecRows group={group} /> : null}</div>)}</div></>;
}

function SpecTable({ group }: { group: SpecGroup }) { return <div className="overflow-hidden border border-white/10 bg-white text-[#17212b] shadow-xl"><div className="border-b border-[#e5e7eb] px-6 py-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#0f6fae]">Technical specifications</p><h3 className="mt-2 text-2xl font-extrabold text-[#0a4052]">{group.title}</h3></div><SpecRows group={group} /></div>; }
function SpecRows({ group }: { group: SpecGroup }) { return <div className="divide-y divide-[#edf2f5]">{group.rows.map(([label, value]) => <div key={label} className="grid gap-2 px-6 py-4 sm:grid-cols-[.7fr_1.3fr]"><span className="text-xs font-bold uppercase tracking-wide text-[#64748b]">{label}</span><span className="text-sm font-semibold text-[#334155]">{value}</span></div>)}</div>; }

function LightboxGallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const images = product.images;
  if (!images.length) return null;
  return <section id="gallery" className="border-b border-[#e5e7eb] bg-white py-16 sm:py-20"><div className="mx-auto max-w-[1280px] px-5 lg:px-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Clinical image gallery</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.03em] text-[#0a4052] sm:text-4xl">See the system in focus.</h2></div><p className="text-sm text-[#64748b]">Select an image to expand.</p></div><div className="mt-10 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:grid-cols-4">{images.slice(0, 6).map((image, index) => <button key={image.url} type="button" onClick={() => setSelected(image)} className={`group relative overflow-hidden border border-[#e5e7eb] bg-[#f4f8fa] text-left ${index === 0 ? "col-span-2 row-span-2" : index === 1 ? "row-span-2" : ""}`}><ProductImage image={image} product={product} className="p-4 transition duration-500 group-hover:scale-105" /><span className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0a4052]">Click to expand</span></button>)}</div></div>{selected ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/95 p-5" role="dialog" aria-modal="true" aria-label="Expanded product image" onClick={() => setSelected(null)}><button type="button" aria-label="Close image" onClick={() => setSelected(null)} className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-white/20 bg-white/10 text-white hover:bg-white/20"><X className="h-5 w-5" /></button><img src={selected.url} alt={selected.altText || product.title} className="max-h-[88vh] max-w-[92vw] object-contain" onClick={event => event.stopPropagation()} /></div> : null}</section>;
}

export default function ItalrayProductExperience({ product }: { product: Product }) {
  const { isCarmex, hotspots, highlights, quickSpecs, technicalCards, specGroups } = useMemo(() => getProductData(product), [product]);
  const relatedQuery = trpc.commerce.products.list.useQuery({ first: 50 }, { staleTime: 60 * 1000 });
  const relatedProducts = useMemo(() => (relatedQuery.data || []).filter(item => item.id !== product.id && item.vendor?.toLowerCase() === "italray").slice(0, 4), [product.id, relatedQuery.data]);
  const quoteUrl = quoteHref(product);
  const serviceUrl = serviceHref(product);
  const productImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];
  const seoDescription = isCarmex ? "Italray CARMEX FP21 and FP30 mobile C-Arm for fluoroscopy and radiography, configured and supported by SPM in Egypt." : `${product.title} by Italray, configured and supported by SPM in Egypt.`;

  return <>
    <SEOHead title={`${product.title} | Italray`} description={seoDescription} image={productImage?.url} url={`/store/products/${product.handle}`} />
    <main className="bg-white text-[#17212b]">
      <div className="border-b border-[#e5e7eb] bg-white"><div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-5 py-3 lg:px-8"><Link href="/catalogue/italray" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748b] hover:text-[#0a4052]"><ArrowLeft className="h-3.5 w-3.5" /> Italray portfolio</Link><span className="hidden truncate text-xs font-semibold text-[#94a3b8] sm:block">SPM / Italray / {product.title}</span></div></div>

      <StickyProductNav product={product} />
      <section id="overview" className="scroll-mt-32 border-b border-[#e5e7eb] bg-white"><div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20"><div><div className="flex flex-wrap items-center gap-3"><img src={italrayLogo} alt="Italray" loading="lazy" decoding="async" className="h-9 w-auto object-contain" /><span className="border border-[#bcdde2] bg-[#eaf4fa] px-3 py-1.5 text-xs font-bold text-[#0a4052]">Authorized Italray solution</span></div><p className="mt-7 text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">{isCarmex ? "Mobile C-Arm for fluoroscopy and radiography" : product.productType || "Medical imaging system"}</p><h1 className="mt-3 max-w-2xl text-4xl font-extrabold leading-[1.02] tracking-[-.04em] text-[#0a4052] sm:text-6xl">{product.title}</h1><p className="mt-5 max-w-xl text-base leading-8 text-[#617180]">{isCarmex ? "The essential solution for C-arm imaging, combining mobile positioning with high-quality fluoroscopy and radiography for demanding clinical workflows." : product.description || "A configured Italray imaging system supported by SPM from project definition through service."}</p><ul className="mt-7 grid gap-3">{highlights.map(item => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[#334155]"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center bg-[#fff1ed] text-[#c2410c]"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span><span>{item}</span></li>)}</ul><div className="mt-8 flex flex-wrap gap-3"><Link href={quoteUrl}><Button size="lg" className="h-12 rounded-md bg-[#c2410c] px-6 font-bold text-white shadow-lg shadow-[#c2410c]/20 hover:bg-[#9a3412]">Request a project quote <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link>{isCarmex ? <a href={carmexBrochure} target="_blank" rel="noreferrer"><Button size="lg" variant="outline" className="h-12 rounded-md border-[#0a4052] bg-white px-5 font-bold text-[#0a4052] hover:bg-[#eaf4fa]"><Download className="mr-2 h-4 w-4" />Download brochure</Button></a> : <Link href="/contact"><Button size="lg" variant="outline" className="h-12 rounded-md border-[#0a4052] bg-white px-5 font-bold text-[#0a4052] hover:bg-[#eaf4fa]">Talk to an expert <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link>}</div><p className="mt-4 text-xs leading-5 text-[#64748b]">Final availability, configuration, delivery and warranty terms are confirmed in the formal SPM quotation.</p></div><div><HotspotFigure product={product} hotspots={hotspots} /></div></div></section>

      <section aria-label="Quick specifications" className="border-b border-[#e5e7eb] bg-[#f7fafc]"><div className="mx-auto grid max-w-[1280px] sm:grid-cols-2 lg:grid-cols-4 lg:px-8">{quickSpecs.map(spec => <div key={spec.label} className="flex items-center gap-4 border-b border-[#e5e7eb] px-5 py-5 last:border-0 sm:border-r lg:border-b-0 lg:px-6"><spec.icon className="h-6 w-6 shrink-0 text-[#0f6fae]" aria-hidden="true" /><div><p className="text-sm font-extrabold text-[#0a4052]">{spec.metric}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[.14em] text-[#64748b]">{spec.label}</p></div></div>)}</div></section>

      <section className="border-b border-[#e5e7eb] bg-white py-16 sm:py-20"><div className="mx-auto max-w-3xl px-5 text-center lg:px-8"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Product introduction</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.03em] text-[#0a4052] sm:text-4xl">Imaging precision that fits the way your team works.</h2><p className="mt-6 text-base leading-8 text-[#617180]">{isCarmex ? "CARMEX FP21 and FP30 bring mobile fluoroscopy and radiography into a compact, balanced platform for teams that need dependable image guidance without losing flexibility in the room. SPM supports the journey from configuration and site planning to commissioning and technical service." : "SPM presents this Italray system as part of a complete engineering ecosystem: the right configuration, clear project documentation, professional installation and lifecycle support for the teams who depend on imaging every day."}</p></div></section>

      <section id="technology" className="scroll-mt-32 bg-[#061f2b] py-16 text-white sm:py-20"><div className="mx-auto max-w-[1280px] px-5 lg:px-8"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8be0d5]">Core technology</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.03em] sm:text-4xl">A closer look at the engineering decisions behind the system.</h2></div><div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#8be0d5]">01 / Imaging platform</p><h3 className="mt-3 text-2xl font-extrabold">Designed for movement, control and image clarity.</h3><p className="mt-4 text-sm leading-7 text-white/70">{isCarmex ? "The CARMEX platform combines a mobile C-arm geometry with a dynamic flat panel detector and selectable generator configurations for a range of clinical procedures." : "The product configuration is reviewed with your department so imaging, room, display and support requirements are aligned before the formal quotation."}</p><ul className="mt-6 grid gap-3 text-sm text-white/80">{technicalCards.slice(0, 3).map(card => <li key={card.title} className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8be0d5]" />{card.title}</li>)}</ul></div><div className="min-h-[300px] border border-white/10 bg-white/[.06] p-6"><ProductImage image={productImage} product={product} className="p-4" /></div></div><div className="mt-12 grid gap-12 lg:grid-cols-2 lg:items-center"><div className="order-2 min-h-[300px] border border-white/10 bg-white/[.06] p-6 lg:order-1"><ProductImage image={secondaryImage} product={product} className="p-4" /></div><div className="order-1 lg:order-2"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#8be0d5]">02 / Workflow intelligence</p><h3 className="mt-3 text-2xl font-extrabold">From the first brief to long-term support.</h3><p className="mt-4 text-sm leading-7 text-white/70">SPM connects the product choice to the operational reality of your department, including installation, training, genuine parts, maintenance planning and technical documentation.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{technicalCards.slice(2).map(card => <div key={card.title} className="border border-white/10 p-4"><card.icon className="h-5 w-5 text-[#8be0d5]" /><p className="mt-3 text-sm font-bold">{card.title}</p><p className="mt-2 text-xs leading-5 text-white/60">{card.text}</p></div>)}</div></div></div></div></section>

      <section id="applications" className="scroll-mt-32 border-b border-[#e5e7eb] bg-white py-16 sm:py-20"><div className="mx-auto max-w-[1280px] px-5 lg:px-8"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Clinical applications</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.03em] text-[#0a4052] sm:text-4xl">A system selected around the procedure.</h2></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{(isCarmex ? [[Stethoscope, "Orthopedics & traumatology", "Positioning and imaging support for orthopedic and trauma procedures."], [Activity, "Surgery", "A mobile imaging workflow for operating room procedures."], [ScanLine, "Interventional procedures", "Fluoroscopy and radiography support with optional advanced tools."], [ShieldCheck, "Emergency care", "A compact mobile configuration for fast, precise workflow support."]] : [[Stethoscope, "Clinical application", "Confirm the intended procedure and workflow with the SPM team."], [Activity, "Department fit", "Align the configuration with the room, staff and throughput needs."], [ScanLine, "Technical planning", "Review detector, workstation, installation and documentation requirements."], [ShieldCheck, "Lifecycle support", "Plan commissioning, training, service and genuine parts from the start."]]).map(([Icon, title, text]) => <article key={String(title)} className="border border-[#e5e7eb] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div className="flex h-12 w-12 items-center justify-center bg-[#eaf4fa] text-[#0f6fae]"><Icon className="h-6 w-6" aria-hidden="true" /></div><h3 className="mt-6 text-lg font-extrabold text-[#0a4052]">{String(title)}</h3><p className="mt-3 text-sm leading-6 text-[#617180]">{String(text)}</p></article>)}</div></div></section>

      <section id="workflow" className="scroll-mt-32 border-b border-[#e5e7eb] bg-[#f7fafc] py-16 sm:py-20"><div className="mx-auto max-w-[1280px] px-5 lg:px-8"><div className="text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">How the project moves</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.03em] text-[#0a4052] sm:text-4xl">PLAN → POSITION → IMAGE → ANALYZE</h2></div><div className="relative mt-12 grid gap-5 md:grid-cols-4 md:gap-0">{[[FileText, "01", "Plan", "Define the application, room and configuration."], [Maximize2, "02", "Position", "Align the system with the clinical workflow."], [ScanLine, "03", "Image", "Support acquisition, review and operator confidence."], [Activity, "04", "Analyze", "Maintain performance with training and service planning."]].map(([Icon, number, title, text], index) => <div key={String(number)} className="relative md:px-5"><div className="border border-[#e5e7eb] bg-white p-6"><div className="flex items-center justify-between"><Icon className="h-6 w-6 text-[#0f6fae]" /><span className="text-xs font-bold text-[#c2410c]">{String(number)}</span></div><h3 className="mt-8 text-lg font-extrabold text-[#0a4052]">{String(title)}</h3><p className="mt-3 text-sm leading-6 text-[#617180]">{String(text)}</p></div>{index < 3 ? <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 bg-[#f7fafc] p-1 text-[#c2410c] md:block" aria-hidden="true" /> : null}</div>)}</div></div></section>

      <LightboxGallery product={product} />

      <section id="specs" className="scroll-mt-32 bg-[#061f2b] py-16 sm:py-20"><div className="mx-auto max-w-[1280px] px-5 lg:px-8"><div className="mb-10 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8be0d5]">Structured technical specs</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.03em] text-white sm:text-4xl">The detail your project team needs.</h2><p className="mt-4 text-base leading-7 text-white/70">Desktop tabs become touch-friendly accordions on mobile.</p></div><TechSpecs groups={specGroups} /></div></section>

      {isCarmex ? <section id="resources" className="scroll-mt-32 border-b border-[#e5e7eb] bg-white py-16 sm:py-20"><div className="mx-auto max-w-[1280px] px-5 lg:px-8"><div className="grid gap-8 border border-[#e5e7eb] bg-[#f7fafc] p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:p-14"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Downloads & resources</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.03em] text-[#0a4052] sm:text-4xl">Prepare the project before the system arrives.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-[#617180]">SPM helps your team move from product selection to a clear project brief, including technical documentation and installation planning.</p><div className="mt-7 flex flex-wrap gap-3"><Link href={quoteUrl}><Button className="h-11 rounded-md bg-[#c2410c] font-bold text-white hover:bg-[#9a3412]">Build the project brief <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link><Link href={serviceUrl}><Button variant="outline" className="h-11 rounded-md border-[#0a4052] font-bold text-[#0a4052] hover:bg-white"><Wrench className="mr-2 h-4 w-4" />Request technical service</Button></Link></div></div><div className="grid gap-3 sm:grid-cols-2"><a href={carmexBrochure} target="_blank" rel="noreferrer" className="group border border-[#e5e7eb] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"><FileText className="h-6 w-6 text-[#0f6fae]" /><h3 className="mt-5 text-sm font-extrabold text-[#0a4052]">CARMEX FP21 & FP30 brochure</h3><p className="mt-2 text-xs leading-5 text-[#617180]">Official product information and configuration highlights.</p><span className="mt-4 inline-flex items-center text-xs font-bold text-[#c2410c]">Download PDF<Download className="ml-1.5 h-3.5 w-3.5" /></span></a><Link href="/contact" className="group border border-[#e5e7eb] bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"><Maximize2 className="h-6 w-6 text-[#0f6fae]" /><h3 className="mt-5 text-sm font-extrabold text-[#0a4052]">Pre-installation planning</h3><p className="mt-2 text-xs leading-5 text-[#617180]">Request a project conversation about site, room and delivery requirements.</p><span className="mt-4 inline-flex items-center text-xs font-bold text-[#c2410c]">Talk to SPM<ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></span></Link></div></div></div></section> : null}

      <section id="service" className="scroll-mt-32 bg-[#0a4052] py-16 text-white sm:py-20"><div className="mx-auto grid max-w-[1280px] gap-10 px-5 lg:grid-cols-[1fr_.8fr] lg:items-center lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#8be0d5]">SPM service integration</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.03em] sm:text-4xl">The product is only as valuable as the support behind it.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-white/75">Connect the selected Italray system to SPM's engineering ecosystem: installation, commissioning, operator training, preventive maintenance, corrective service and genuine spare parts.</p><div className="mt-7 flex flex-wrap gap-3"><Link href={serviceUrl}><Button className="h-11 rounded-md bg-[#c2410c] font-bold text-white hover:bg-[#9a3412]">Request technical service <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/maintenance-contracts"><Button variant="outline" className="h-11 rounded-md border-white/40 bg-white/10 font-bold text-white hover:bg-white/20">Explore service contracts</Button></Link></div></div><div className="grid gap-3 sm:grid-cols-2"><div className="border border-white/10 bg-white/10 p-5"><Wrench className="h-6 w-6 text-[#8be0d5]" /><p className="mt-5 text-sm font-bold">Field engineering</p><p className="mt-2 text-xs leading-5 text-white/60">On-site support and commissioning planning.</p></div><div className="border border-white/10 bg-white/10 p-5"><ShieldCheck className="h-6 w-6 text-[#8be0d5]" /><p className="mt-5 text-sm font-bold">Lifecycle continuity</p><p className="mt-2 text-xs leading-5 text-white/60">Maintenance, training and genuine parts coordination.</p></div></div></div></section>

      {relatedProducts.length ? <section className="border-b border-[#e5e7eb] bg-white py-16 sm:py-20"><div className="mx-auto max-w-[1280px] px-5 lg:px-8"><div className="flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#0f6fae]">Related Italray systems</p><h2 className="mt-4 text-3xl font-extrabold tracking-[-.03em] text-[#0a4052] sm:text-4xl">Continue exploring the portfolio.</h2></div><Link href="/catalogue/italray" className="hidden items-center text-sm font-bold text-[#c2410c] sm:inline-flex">View all systems <ArrowRight className="ml-2 h-4 w-4" /></Link></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{relatedProducts.map(related => <Link key={related.id} href={`/store/products/${related.handle}`} className="group border border-[#e5e7eb] bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg"><div className="aspect-[4/3] bg-[#f4f8fa]"><ProductImage image={related.images[0]} product={related} /></div><p className="mt-5 text-[10px] font-bold uppercase tracking-[.15em] text-[#0f6fae]">{related.productType || "Italray system"}</p><h3 className="mt-2 line-clamp-2 text-sm font-extrabold leading-5 text-[#0a4052] group-hover:text-[#0f6fae]">{related.title}</h3><span className="mt-4 inline-flex items-center text-xs font-bold text-[#c2410c]">View product <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></span></Link>)}</div></div></section> : null}

      <section className="border-t border-[#e5e7eb] bg-[#eaf4fa] py-10"><div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-5 px-5 sm:flex-row sm:items-center lg:px-8"><div><p className="text-sm font-extrabold text-[#0a4052]">Ready to discuss this Italray system?</p><p className="mt-1 text-xs text-[#617180]">Share your department, intended procedure and room requirements.</p></div><Link href={quoteUrl}><Button className="h-11 rounded-md bg-[#c2410c] font-bold text-white hover:bg-[#9a3412]">Request a project quote <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link></div></section>
    </main>
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e5e7eb] bg-white/95 p-3 shadow-2xl backdrop-blur sm:hidden"><Link href={quoteUrl}><Button className="h-11 w-full rounded-md bg-[#c2410c] font-bold text-white hover:bg-[#9a3412]">Request a project quote <ArrowUpRight className="ml-2 h-4 w-4" /></Button></Link></div>
  </>;
}
