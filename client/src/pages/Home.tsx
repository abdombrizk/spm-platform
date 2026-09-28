import { ArrowRight, Building2, Mail, ShieldCheck, Wrench } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const fallback: Record<string, string> = {
  "brand.eyebrow": "SYSTEMS FOR PROJECTS & MAINTENANCE",
  "brand.name": "SPM",
  "contact.email": "info@spmhospitals.com",
  "hero.eyebrow": "MEDICAL IMAGING TECHNOLOGY",
  "hero.title": "A stronger digital foundation for SPM.",
  "hero.description": "The new SPM platform is being built around approved content, structured requests and controlled internal operations—so every public promise has a clear owner behind it.",
  "hero.primary.label": "Request a quote",
  "hero.primary.url": "mailto:sales@spmhospitals.com",
  "hero.secondary.label": "WhatsApp us",
  "hero.secondary.url": "https://wa.me/201221888395",
  "panel.eyebrow": "Release 1 foundation",
  "panel.title": "Public website + request management",
  "panel.metric1.value": "4",
  "panel.metric1.label": "structured request journeys",
  "panel.metric2.value": "7",
  "panel.metric2.label": "controlled internal roles",
  "panel.description": "Release 2 extension points for CRM, ERP, WhatsApp Business API and service management are reserved without inventing an external provider.",
  "highlight.1.title": "Medical imaging technology",
  "highlight.1.text": "A controlled digital presence for SPM products, services and partnerships.",
  "highlight.2.title": "Structured service intake",
  "highlight.2.text": "Quote, maintenance, spare-parts and contact journeys prepared for operational follow-up.",
  "highlight.3.title": "Controlled administration",
  "highlight.3.text": "Owner-led access, publication, evidence and audit controls from the first release.",
  "hero.image": "",
};

export default function Home() {
  const contentQuery = trpc.homepage.published.useQuery();
  const content = { ...fallback, ...(contentQuery.data ?? []).reduce<Record<string, string>>((acc, item) => { acc[item.contentKey] = item.isVisible ? item.publishedValue : ""; return acc; }, {}) };
  const highlights = [
    { icon: Building2, title: content["highlight.1.title"], text: content["highlight.1.text"] },
    { icon: Wrench, title: content["highlight.2.title"], text: content["highlight.2.text"] },
    { icon: ShieldCheck, title: content["highlight.3.title"], text: content["highlight.3.text"] },
  ].filter(item => item.title && item.text);

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <header className="border-b bg-white/90 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><div className="flex items-center gap-3">{content["brand.logo"] ? <img src={content["brand.logo"]} alt={content["brand.name"]} className="h-10 w-10 rounded-2xl object-contain" /> : <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300"><Building2 className="h-5 w-5" /></div>}<div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{content["brand.eyebrow"]}</p><p className="font-semibold tracking-tight">{content["brand.name"]}</p></div></div><div className="flex items-center gap-3"><Link href="/catalogue"><Button variant="ghost">Catalogue</Button></Link><Link href="/services"><Button variant="ghost">Services</Button></Link><Link href="/request-service"><Button variant="ghost">Request service</Button></Link><Link href="/request-a-quote"><Button variant="ghost">Request a quote</Button></Link><a className="hidden items-center gap-2 text-sm text-slate-600 sm:flex" href={`mailto:${content["contact.email"]}`}><Mail className="h-4 w-4" />{content["contact.email"]}</a><Link href="/login"><Button variant="outline">Internal access</Button></Link></div></div></header>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-28"><div><p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">{content["hero.eyebrow"]}</p><h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-7xl">{content["hero.title"]}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">{content["hero.description"]}</p><div className="mt-9 flex flex-wrap gap-3"><Button size="lg" asChild><a href={content["hero.primary.url"]}>{content["hero.primary.label"]} <ArrowRight className="ml-2 h-4 w-4" /></a></Button><Button size="lg" variant="outline" asChild><a href={content["hero.secondary.url"]} target="_blank" rel="noreferrer">{content["hero.secondary.label"]}</a></Button></div></div><div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl">{content["hero.image"] ? <img src={content["hero.image"]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" /> : null}<div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" /><div className="relative space-y-8"><div><p className="text-sm text-cyan-200">{content["panel.eyebrow"]}</p><p className="mt-2 text-3xl font-semibold">{content["panel.title"]}</p></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-semibold">{content["panel.metric1.value"]}</p><p className="mt-1 text-sm text-slate-300">{content["panel.metric1.label"]}</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-semibold">{content["panel.metric2.value"]}</p><p className="mt-1 text-sm text-slate-300">{content["panel.metric2.label"]}</p></div></div><p className="text-sm leading-6 text-slate-300">{content["panel.description"]}</p></div></div></section>
      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-20 md:grid-cols-3">{highlights.map(item => <article key={item.title} className="rounded-3xl border bg-white p-6 shadow-sm"><item.icon className="h-6 w-6 text-cyan-700" /><h2 className="mt-5 text-lg font-semibold">{item.title}</h2><p className="mt-2 leading-7 text-slate-600">{item.text}</p></article>)}</section>
    </main>
  );
}
