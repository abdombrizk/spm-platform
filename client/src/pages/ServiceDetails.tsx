import { ArrowLeft, Clock3, Mail, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { Link, useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SiteChrome from "@/components/SiteChrome";
import SEOHead from "@/components/SEOHead";
import { trpc } from "@/lib/trpc";

const labels: Record<string, string> = { installation: "Installation", commissioning: "Commissioning", preventive_maintenance: "Preventive maintenance", corrective_maintenance: "Corrective maintenance", emergency_maintenance: "Emergency maintenance", calibration: "Calibration", technical_support: "Technical support", training: "Training", spare_parts_supply: "Spare parts supply", maintenance_contract: "Maintenance contract" };

export default function ServiceDetails() {
  const [, params] = useRoute("/services/:slug");
  const query = trpc.services.publishedBySlug.useQuery({ slug: params?.slug ?? "" }, { enabled: Boolean(params?.slug) });

  if (query.isLoading) {
    return <SiteChrome><main className="mx-auto max-w-7xl space-y-8 px-5 py-16 lg:px-8"><Skeleton className="h-5 w-40" /><Skeleton className="h-14 w-2/3" /><div className="grid gap-8 lg:grid-cols-2"><Skeleton className="aspect-square rounded-3xl" /><Skeleton className="h-96 rounded-3xl" /></div></main></SiteChrome>;
  }
  if (query.error || !query.data) {
    return <SiteChrome><main className="flex min-h-[60vh] items-center justify-center px-5 py-16"><Card className="w-full max-w-lg"><CardHeader><CardTitle>Service not found</CardTitle></CardHeader><CardContent><p className="text-sm text-[#617180]">We could not load this service. Browse the service catalogue or contact the SPM team.</p><Link href="/services"><Button className="mt-6">Back to services</Button></Link></CardContent></Card></main></SiteChrome>;
  }

  const item = query.data;
  const data = item.data as Record<string, any>;
  return (
    <SiteChrome>
      <SEOHead title={`${data.name} Service`} description={data.shortDescription || data.fullDescription || "SPM medical imaging service and engineering support."} url={`/services/${item.slug}`} type="article" />
      <main className="min-h-screen bg-[#f7fafc] text-[#17212b]">
        <div className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-[#617180]"><Link href="/services" className="hover:text-[#0f6fae]">Services</Link><span aria-hidden="true">/</span><span className="font-semibold text-[#0a4052]">{data.name}</span></nav>
        </div>
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">{data.mainImage ? <img src={data.mainImage} alt={data.name} loading="eager" decoding="async" className="aspect-square w-full object-cover" /> : <div className="flex aspect-square items-center justify-center text-[#b0c0c7]"><Wrench className="h-24 w-24" aria-hidden="true" /></div>}</div>
            <div><Badge variant="outline">{labels[item.serviceType] || "SPM service"}</Badge><h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#0a4052] sm:text-5xl">{data.name}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[#617180]">{data.fullDescription || data.shortDescription}</p><div className="mt-8 flex flex-wrap gap-3">{data.requestService ? <Button size="lg" asChild><Link href={`/request-service?service=${encodeURIComponent(item.slug)}`}><Wrench className="mr-2 h-4 w-4" aria-hidden="true" />Request Service</Link></Button> : null}{data.requestQuote ? <Button size="lg" variant="outline" asChild><Link href={`/request-a-quote?service=${encodeURIComponent(item.slug)}`}><Mail className="mr-2 h-4 w-4" aria-hidden="true" />Request a Quote</Link></Button> : null}</div><div className="mt-10 grid gap-3 sm:grid-cols-2">{data.responseTime ? <div className="rounded-2xl border border-[#dce7eb] bg-white p-4"><Clock3 className="h-5 w-5 text-[#0f6fae]" aria-hidden="true" /><p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#617180]">Response time</p><p className="mt-1 font-medium">{data.responseTime}</p></div> : null}{data.countries?.length ? <div className="rounded-2xl border border-[#dce7eb] bg-white p-4"><MapPin className="h-5 w-5 text-[#0f6fae]" aria-hidden="true" /><p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#617180]">Service regions</p><p className="mt-1 font-medium">{data.countries.join(", ")}</p></div> : null}</div></div>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><Card><CardHeader><CardTitle>Service scope</CardTitle></CardHeader><CardContent className="space-y-6"><p className="leading-8 text-[#617180]">{data.serviceScope || "The service scope will be confirmed by the SPM service team."}</p>{data.includedActivities?.length ? <div><p className="font-semibold">Included activities</p><ul className="mt-2 list-disc space-y-2 pl-5 text-[#617180]">{data.includedActivities.map((value: string) => <li key={value}>{value}</li>)}</ul></div> : null}{data.excludedActivities?.length ? <div><p className="font-semibold">Excluded activities</p><ul className="mt-2 list-disc space-y-2 pl-5 text-[#617180]">{data.excludedActivities.map((value: string) => <li key={value}>{value}</li>)}</ul></div> : null}</CardContent></Card><div className="space-y-6"><Card><CardHeader><CardTitle>Coverage</CardTitle></CardHeader><CardContent className="space-y-4"><div><p className="text-sm font-semibold text-[#617180]">Supported brands</p><p className="mt-1 text-[#617180]">{data.supportedBrands?.length ? data.supportedBrands.join(", ") : "To be confirmed with the service team."}</p></div><div><p className="text-sm font-semibold text-[#617180]">Covered equipment</p><p className="mt-1 whitespace-pre-line text-[#617180]">{data.coveredEquipmentManual || "Linked products and equipment details are confirmed during request intake."}</p></div></CardContent></Card><Card><CardHeader><CardTitle>Quality and documents</CardTitle></CardHeader><CardContent className="space-y-3"><p className="flex items-center gap-2 text-sm text-[#617180]"><ShieldCheck className="h-4 w-4 text-[#0f6fae]" aria-hidden="true" />Service information is controlled by SPM review workflow.</p>{data.brochureUrl ? <a className="text-[#0f6fae] underline" href={data.brochureUrl} target="_blank" rel="noreferrer">Download service brochure</a> : <p className="text-sm text-[#617180]">Documents are available on request.</p>}</CardContent></Card></div></div>
        </section>
      </main>
    </SiteChrome>
  );
}
