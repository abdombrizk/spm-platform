import { useState } from "react";
import { Building2, Clock, Mail, MapPin, Phone, ShieldCheck, ArrowUpRight, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import SiteChrome from "@/components/SiteChrome";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const update = (key: keyof typeof form, value: string) => setForm(current => ({ ...current, [key]: value }));
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = `SPM enquiry from ${form.name}`;
    const body = [`Name: ${form.name}`, `Email: ${form.email}`, `Company: ${form.company || "Not provided"}`, `Phone: ${form.phone || "Not provided"}`, "", form.message].join("\n");
    window.location.href = `mailto:info@spmhospitals.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };
  return (
    <SiteChrome>
      <SEOHead
        title="Contact Technical & Commercial Teams"
        description="Get in touch with SPM Systems for Projects & Maintenance for medical imaging equipment quotes, maintenance visits, spare-parts, and official agency support."
        url="/contact"
      />
      <main className="bg-[#f8fafc] text-[#1e293b]">
        {/* Header */}
        <section className="border-b border-[#dce7eb] bg-gradient-to-b from-[#eaf4fa] to-white py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f6fae]">Official Communication Channels</span>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#0a4052] sm:text-5xl">
                Contact Systems for Projects & Maintenance (SPM)
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-[#475569]">
                Reach our technical and commercial departments directly. SPM maintains dedicated teams for clinical equipment sourcing, genuine spare-parts procurement, and field engineering response.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Matrix */}
        <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Sales & Commercial */}
            <Card className="rounded-3xl border-[#dce7eb] shadow-sm transition hover:shadow-md">
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4fa] text-[#0f6fae]">
                  <Mail className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-[#0a4052]">Commercial & Quotations</CardTitle>
                <p className="text-xs text-[#64748b]">For hospitals, clinics, biomedical tenders, and equipment acquisitions.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase text-[#94a3b8]">Direct Email</p>
                  <a href="mailto:sales@spmhospitals.com" className="font-semibold text-[#0f6fae] hover:underline">
                    sales@spmhospitals.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-[#94a3b8]">Commercial Phone</p>
                  <a href="tel:+201221888395" className="font-semibold text-[#1e293b]">
                    +20 12 21888395
                  </a>
                </div>
                <Button className="w-full bg-[#f36b21] font-bold text-white hover:bg-[#d95316]" asChild><Link href="/request-a-quote" className="block pt-2">
                    Request a Quote <ArrowUpRight className="ml-1.5 h-4 w-4" />
                  </Link></Button>
              </CardContent>
            </Card>

            {/* Field Service & Engineering */}
            <Card className="rounded-3xl border-[#dce7eb] shadow-sm transition hover:shadow-md">
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4fa] text-[#0a4052]">
                  <Clock className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-[#0a4052]">Service & Technical Support</CardTitle>
                <p className="text-xs text-[#64748b]">Emergency breakdown triage, preventive maintenance visits, and calibration.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase text-[#94a3b8]">Service Desk</p>
                  <a href="mailto:service@spmhospitals.com" className="font-semibold text-[#0f6fae] hover:underline">
                    service@spmhospitals.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-[#94a3b8]">Engineering WhatsApp</p>
                  <a href="https://wa.me/201221888395" target="_blank" rel="noreferrer" className="font-semibold text-emerald-700 hover:underline">
                    +20 12 21888395 (WhatsApp Support)
                  </a>
                </div>
                <Button variant="outline" className="w-full border-[#0a4052] font-bold text-[#0a4052] hover:bg-[#f0f7fb]" asChild><Link href="/request-service" className="block pt-2">
                    Log Breakdown Visit <ArrowUpRight className="ml-1.5 h-4 w-4" />
                  </Link></Button>
              </CardContent>
            </Card>

            {/* General Office & Management */}
            <Card className="rounded-3xl border-[#dce7eb] shadow-sm transition hover:shadow-md">
              <CardHeader>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf4fa] text-[#0f6fae]">
                  <Building2 className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-[#0a4052]">Headquarters & General Inquiries</CardTitle>
                <p className="text-xs text-[#64748b]">Partner distribution agreements, regulatory dossiers, and administration.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase text-[#94a3b8]">General Inquiries</p>
                  <a href="mailto:info@spmhospitals.com" className="font-semibold text-[#0f6fae] hover:underline">
                    info@spmhospitals.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-[#94a3b8]">Executive Copy</p>
                  <span className="font-mono text-xs text-[#64748b]">
                    systems.spm@gmail.com
                  </span>
                </div>
                <div className="rounded-2xl border border-[#dce7eb] bg-[#fafcfd] p-3 text-xs leading-relaxed text-[#64748b]">
                  <p className="font-semibold text-[#0a4052]">Cairo Main Operations Base</p>
                  <p>Al-Nozha Al-Jadida / Heliopolis District, Cairo, Egypt</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <section aria-labelledby="contact-form-title" className="mt-12 rounded-3xl border border-[#dce7eb] bg-white p-6 shadow-sm lg:p-8">
            <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f6fae]">General enquiry</p><h2 id="contact-form-title" className="mt-2 text-2xl font-extrabold text-[#0a4052]">Tell us how we can help</h2><p className="mt-2 text-sm leading-6 text-[#617180]">Your email application will open with a ready-to-send message addressed to the SPM team.</p></div>
            <form className="mt-6 grid gap-5 md:grid-cols-2" onSubmit={submit}>
              <div className="space-y-2"><Label htmlFor="contact-name">Name <span aria-hidden="true">*</span></Label><Input id="contact-name" autoComplete="name" required value={form.name} onChange={event => update("name", event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="contact-email">Email <span aria-hidden="true">*</span></Label><Input id="contact-email" type="email" autoComplete="email" required value={form.email} onChange={event => update("email", event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="contact-company">Company or facility</Label><Input id="contact-company" autoComplete="organization" value={form.company} onChange={event => update("company", event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="contact-phone">Phone</Label><Input id="contact-phone" type="tel" autoComplete="tel" value={form.phone} onChange={event => update("phone", event.target.value)} /></div>
              <div className="space-y-2 md:col-span-2"><Label htmlFor="contact-message">Message <span aria-hidden="true">*</span></Label><Textarea id="contact-message" required rows={5} value={form.message} onChange={event => update("message", event.target.value)} placeholder="Tell us about your equipment, service need or partnership enquiry." /></div>
              <div className="flex flex-wrap items-center gap-4 md:col-span-2"><Button type="submit" className="bg-[#c2410c] text-white hover:bg-[#9a3412]">Prepare email <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button>{submitted ? <p role="status" aria-live="polite" className="text-sm font-semibold text-emerald-700">Your email draft is ready to send.</p> : null}</div>
            </form>
          </section>

          {/* Map & Quality Commitment */}
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-3xl border border-[#dce7eb] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#0a4052]">Regional Service Coverage</h3>
              <p className="mt-1 text-sm text-[#64748b]">
                SPM operates technical response units covering Cairo, Giza, Alexandria, Delta governorates, Upper Egypt, and international deployments across the Middle East.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[#0a4052]">
                {["Cairo & Greater Cairo", "Alexandria & Coastal", "Mansoura & Delta", "Assiut & Upper Egypt", "Red Sea & Sinai", "Regional MENA Hub"].map(zone => (
                  <span key={zone} className="rounded-full bg-[#eaf4fa] px-3.5 py-1.5 border border-[#bcdde2]">
                    {zone}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#bcdde2] bg-[#f0f7fb] p-6 lg:p-8">
              <ShieldCheck className="h-8 w-8 text-[#0f6fae]" />
              <h3 className="mt-4 text-lg font-bold text-[#0a4052]">Quality & documentation workflow</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#475569]">
                All technical inquiries, spare-part dispatches, and commissioning operations are performed according to documented biomedical safety SOPs. Equipment records and serial numbers are archived for clinical traceability.
              </p>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
