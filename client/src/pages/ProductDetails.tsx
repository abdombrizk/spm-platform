import { useState } from "react";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Download, FileText, Lock, Mail, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { Link, useRoute } from "wouter";
import SiteChrome from "@/components/SiteChrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

const labels: Record<string, string> = {
  medical_device: "Medical Device",
  spare_part: "Spare Part",
  accessory: "Accessory",
  available: "Available & Ready to Deploy",
  on_request: "Available on Request",
  coming_soon: "Coming Soon",
  discontinued: "Discontinued",
  available_ce: "CE Certified",
  under_review: "Under Review",
};

const specLabels: Record<string, string> = {
  generatorPower: "Generator Power",
  tubeVoltage: "Tube Voltage (kV)",
  tubeCurrent: "Tube Current (mA)",
  detectorType: "Flat Panel Detector / Receptor Type",
  imageReceptor: "Image Receptor Resolution & Dimensions",
  fluoroscopyModes: "Pulsed / Continuous Fluoroscopy Modes",
  dimensions: "Physical Footprint & Gantry Travel",
  weight: "Total System Weight",
  powerRequirements: "Electrical / Power Requirements",
  warranty: "Standard Warranty & Maintenance Inclusions",
};

export default function ProductDetails() {
  const [, params] = useRoute("/catalogue/:slug");
  const query = trpc.products.publishedBySlug.useQuery(
    { slug: params?.slug ?? "" },
    { enabled: Boolean(params?.slug) }
  );

  const requestDocMutation = trpc.documents.request.useMutation();

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<{ type: any; name: string; url?: string } | null>(null);
  const [docForm, setDocForm] = useState({ name: "", email: "", organization: "", message: "" });
  const [docSuccess, setDocSuccess] = useState<string | null>(null);
  const [docError, setDocError] = useState<string | null>(null);

  if (query.isLoading) {
    return (
      <SiteChrome>
        <div className="flex min-h-[60vh] items-center justify-center text-sm font-semibold text-[#64748b]">
          Loading medical equipment details...
        </div>
      </SiteChrome>
    );
  }

  const item = query.data;
  if (!item) {
    return (
      <SiteChrome>
        <div className="mx-auto max-w-xl px-5 py-24 text-center">
          <Card className="rounded-3xl border-[#dce7eb] p-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#0a4052]">Equipment not found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#64748b]">The requested model or equipment record does not exist or has been updated.</p>
              <Link href="/catalogue" className="mt-6 inline-block">
                <Button className="bg-[#0f6fae] text-white">Return to Equipment Catalogue</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </SiteChrome>
    );
  }

  const data = item.data as Record<string, any>;
  const tech = (data.technicalSpecifications ?? {}) as Record<string, string>;

  function openDocRequest(type: any, name: string, url?: string) {
    setSelectedDoc({ type, name, url });
    setDocError(null);
    setDocSuccess(null);
    setDocModalOpen(true);
  }

  async function handleDocSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDoc) return;
    setDocError(null);
    try {
      const res = await requestDocMutation.mutateAsync({
        productId: item ? item.id : undefined,
        documentType: selectedDoc.type,
        documentName: selectedDoc.name,
        documentUrl: selectedDoc.url,
        requesterName: docForm.name,
        requesterEmail: docForm.email,
        requesterOrganization: docForm.organization,
        message: docForm.message,
      });
      setDocSuccess(res.publicNumber);
    } catch (err: any) {
      setDocError(err.message || "Unable to submit document request.");
    }
  }

  return (
    <SiteChrome>
      <main className="bg-[#f8fafc] text-[#1e293b]">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-[#e2e8f0] bg-white">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3.5 lg:px-8">
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748b] transition hover:text-[#0f6fae]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Equipment Catalogue
            </Link>
            <span className="text-xs font-semibold text-[#94a3b8]">
              {data.brand || data.manufacturer || "SPM Partner"} / {data.name}
            </span>
          </div>
        </div>

        {/* Product Overview Section */}
        <section className="mx-auto max-w-[1280px] px-5 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
            {/* Left: Product Image Box */}
            <div className="overflow-hidden rounded-3xl border border-[#dce7eb] bg-white p-6 shadow-sm">
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-[#f1f5f9]">
                {data.mainImage ? (
                  <img
                    src={data.mainImage}
                    alt={data.name}
                    className="h-full w-full object-contain transition duration-500 hover:scale-105"
                  />
                ) : (
                  <ShieldCheck className="h-28 w-28 text-[#cbd5e1]" />
                )}
                {data.featured ? (
                  <div className="absolute left-4 top-4">
                    <Badge className="bg-[#f36b21] text-xs font-bold text-white shadow-sm">
                      <Sparkles className="mr-1 h-3 w-3" /> Featured System
                    </Badge>
                  </div>
                ) : null}
              </div>

              {/* Badges / Modality metadata below image */}
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#f1f5f9] pt-4">
                <Badge variant="outline" className="border-[#0a4052] font-semibold text-[#0a4052]">
                  {labels[item.productType] || item.productType}
                </Badge>
                {data.availabilityStatus ? (
                  <Badge className="bg-emerald-600 text-xs text-white">
                    {labels[data.availabilityStatus] ?? data.availabilityStatus}
                  </Badge>
                ) : null}
                {data.ceStatus ? (
                  <Badge variant="secondary" className="bg-[#e0f2fe] text-[#0369a1]">
                    CE Status: {labels[data.ceStatus] ?? data.ceStatus}
                  </Badge>
                ) : null}
              </div>
            </div>

            {/* Right: Commercial & Technical Overview */}
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#0f6fae]">
                {[data.brand, data.manufacturer, data.modelNumber].filter(Boolean).join(" · ") || "SPM Imaging Technology"}
              </div>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0a4052] sm:text-4xl lg:text-5xl">
                {data.name}
              </h1>

              <p className="mt-5 text-base leading-relaxed text-[#475569] sm:text-lg">
                {data.fullDescription || data.shortDescription || "Advanced medical imaging system engineered for dependable clinical uptime, low dose management, and seamless hospital network integration."}
              </p>

              {/* Requirement 3: Request Quote CTA passed with product slug and equipment details */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/request-a-quote?product=${encodeURIComponent(item.slug)}`}
                  className="w-full sm:w-auto"
                >
                  <Button className="h-12 w-full bg-[#f36b21] px-8 text-sm font-bold text-white shadow-md transition hover:bg-[#d95316] hover:shadow-lg active:scale-95 sm:w-auto">
                    <Mail className="mr-2 h-4 w-4" /> Request a Formal Quotation
                  </Button>
                </Link>

                <Link
                  href={`/request-service?equipment=${encodeURIComponent(data.name)}&manufacturer=${encodeURIComponent(data.manufacturer || data.brand || "")}&model=${encodeURIComponent(data.modelNumber || "")}`}
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" className="h-12 w-full border-[#0a4052] px-6 text-sm font-bold text-[#0a4052] hover:bg-[#f0f7fb] sm:w-auto">
                    <Wrench className="mr-2 h-4 w-4" /> Schedule Service / Installation
                  </Button>
                </Link>
              </div>

              {/* Key metadata grid */}
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {data.code ? (
                  <div className="rounded-2xl border border-[#dce7eb] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">Product Code</p>
                    <p className="mt-1 font-mono text-sm font-bold text-[#0a4052]">{data.code}</p>
                  </div>
                ) : null}
                {data.supplier || data.manufacturer ? (
                  <div className="rounded-2xl border border-[#dce7eb] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">Manufacturing Origin</p>
                    <p className="mt-1 text-sm font-bold text-[#0a4052]">{data.supplier || data.manufacturer}</p>
                  </div>
                ) : null}
              </div>

              {/* Quality & Assurance Note */}
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#bcdde2] bg-[#f0f7fb] p-4 text-xs leading-relaxed text-[#0a4052]">
                <ShieldCheck className="h-5 w-5 shrink-0 text-[#0f6fae]" />
                <p>
                  <strong>ISO 13485 & Regulatory Notice:</strong> Commercial delivery includes full compliance documentation, warranty certificates, and authorized technical commissioning by certified biomedical engineers.
                </p>
              </div>
            </div>
          </div>

          {/* Requirement 4: Technical Specifications Table (Clean & Organized Layout) */}
          <div className="mt-16 grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
            {/* Left: Complete Specifications Table */}
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-[#e2e8f0] pb-4">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-[#0a4052]">Technical Specifications</h3>
                  <p className="text-xs text-[#64748b]">Engineering parameters and verified clinical specifications.</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#dce7eb] bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {Object.entries(specLabels).map(([key, label], idx) => {
                      const val = tech[key];
                      return (
                        <tr key={key} className={idx % 2 === 0 ? "bg-white" : "bg-[#fafcfd]"}>
                          <th className="w-1/3 px-5 py-3.5 text-xs font-bold text-[#475569]">{label}</th>
                          <td className="px-5 py-3.5 text-xs font-medium text-[#1e293b]">
                            {val ? (
                              <span>{val}</span>
                            ) : (
                              <span className="italic text-[#94a3b8]">Verified during technical quotation review</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Features and Applications bullet points */}
              {data.features?.length || data.applications?.length ? (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {data.features?.length ? (
                    <Card className="rounded-2xl border-[#dce7eb]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold text-[#0a4052]">Clinical Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-xs leading-relaxed text-[#475569]">
                          {data.features.map((feat: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#0f6fae]" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ) : null}

                  {data.applications?.length ? (
                    <Card className="rounded-2xl border-[#dce7eb]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-bold text-[#0a4052]">Clinical Applications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-xs leading-relaxed text-[#475569]">
                          {data.applications.map((app: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#f36b21]" />
                              <span>{app}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Right: Controlled Documents & Request Workflow */}
            <div className="space-y-6">
              <Card className="rounded-3xl border-[#dce7eb] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#0a4052]">Controlled Technical Files</CardTitle>
                  <p className="text-xs text-[#64748b]">
                    Under ISO 13485 regulations, proprietary brochures, datasheets, and regulatory files are released upon authenticated request.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Brochure */}
                  <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#fafcfd] p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-[#e0f2fe] p-2 text-[#0369a1]">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1e293b]">Product Brochure</p>
                        <p className="text-[10px] text-[#64748b]">Marketing specifications & clinical views</p>
                      </div>
                    </div>
                    {data.brochureUrl ? (
                      <a href={data.brochureUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold text-[#0f6fae]">
                          <Download className="mr-1 h-3.5 w-3.5" /> Download
                        </Button>
                      </a>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 bg-[#0a4052] text-xs font-bold text-white hover:bg-[#07303e]"
                        onClick={() => openDocRequest("brochure", `${data.name} Brochure`)}
                      >
                        Request Access
                      </Button>
                    )}
                  </div>

                  {/* Technical Datasheet */}
                  <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#fafcfd] p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-[#e0f2fe] p-2 text-[#0369a1]">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1e293b]">Engineering Datasheet</p>
                        <p className="text-[10px] text-[#64748b]">Generator, voltage and shielding specs</p>
                      </div>
                    </div>
                    {data.datasheetUrl ? (
                      <a href={data.datasheetUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold text-[#0f6fae]">
                          <Download className="mr-1 h-3.5 w-3.5" /> Download
                        </Button>
                      </a>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 bg-[#0a4052] text-xs font-bold text-white hover:bg-[#07303e]"
                        onClick={() => openDocRequest("datasheet", `${data.name} Technical Datasheet`)}
                      >
                        Request Access
                      </Button>
                    )}
                  </div>

                  {/* Regulatory & CE Compliance File */}
                  <div className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#fafcfd] p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-[#fef3c7] p-2 text-[#b45309]">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1e293b]">Regulatory & CE Declarations</p>
                        <p className="text-[10px] text-[#64748b]">MDR 2017/745 & ISO compliance dossiers</p>
                      </div>
                    </div>
                    {data.regulatoryDocumentsPublic && data.regulatoryDocumentUrl ? (
                      <a href={data.regulatoryDocumentUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold text-[#0f6fae]">
                          <Download className="mr-1 h-3.5 w-3.5" /> Download
                        </Button>
                      </a>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 bg-[#0a4052] text-xs font-bold text-white hover:bg-[#07303e]"
                        onClick={() => openDocRequest("regulatory_document", `${data.name} CE / Regulatory Dossier`)}
                      >
                        <Lock className="mr-1 h-3 w-3" /> Request File
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Direct Assistance CTA */}
              <div className="rounded-3xl border border-[#bcdde2] bg-gradient-to-br from-[#eaf4fa] to-white p-6 shadow-sm">
                <h4 className="text-base font-bold text-[#0a4052]">Need Engineering Guidance?</h4>
                <p className="mt-2 text-xs leading-relaxed text-[#475569]">
                  Talk directly with an SPM clinical imaging specialist to calculate room sizing, radiation shielding, power transformers, and delivery timelines.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href="tel:+201221888395"
                    className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#0a4052] shadow-sm hover:bg-[#f1f5f9]"
                  >
                    Direct Support: +20 12 21888395
                  </a>
                  <a
                    href="mailto:sales@spmhospitals.com"
                    className="inline-flex items-center justify-center rounded-xl border border-[#dce7eb] bg-white px-4 py-2.5 text-xs font-bold text-[#0f6fae] hover:bg-[#f1f5f9]"
                  >
                    Email: sales@spmhospitals.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal: Request a Controlled Document */}
        <Dialog open={docModalOpen} onOpenChange={setDocModalOpen}>
          <DialogContent className="max-w-md rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#0a4052]">Request Technical Document</DialogTitle>
              <DialogDescription className="text-xs text-[#64748b]">
                {selectedDoc?.name}. Under QA compliance, please provide your professional email to receive this file.
              </DialogDescription>
            </DialogHeader>

            {docSuccess ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <h4 className="mt-4 text-base font-bold text-[#0a4052]">Request Submitted Successfully</h4>
                <p className="mt-2 font-mono text-xs font-bold text-[#0f6fae]">Tracking ID: {docSuccess}</p>
                <p className="mt-3 text-xs leading-relaxed text-[#64748b]">
                  The SPM regulatory and sales teams will review your request and dispatch the verified document to {docForm.email}.
                </p>
                <Button className="mt-6 w-full bg-[#0a4052]" onClick={() => setDocModalOpen(false)}>
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleDocSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#334155]">Full Name *</Label>
                  <Input
                    required
                    placeholder="Dr. / Eng. Your Name"
                    value={docForm.name}
                    onChange={e => setDocForm(prev => ({ ...prev, name: e.target.value }))}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#334155]">Institutional Email *</Label>
                  <Input
                    required
                    type="email"
                    placeholder="name@hospital.com"
                    value={docForm.email}
                    onChange={e => setDocForm(prev => ({ ...prev, email: e.target.value }))}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#334155]">Hospital / Healthcare Facility</Label>
                  <Input
                    placeholder="e.g. Cairo University Hospitals"
                    value={docForm.organization}
                    onChange={e => setDocForm(prev => ({ ...prev, organization: e.target.value }))}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#334155]">Purpose of Request (Optional)</Label>
                  <Textarea
                    placeholder="Tender evaluation, maintenance planning, room preparation..."
                    rows={2}
                    value={docForm.message}
                    onChange={e => setDocForm(prev => ({ ...prev, message: e.target.value }))}
                    className="text-xs"
                  />
                </div>

                {docError ? <p className="text-xs font-bold text-red-600">{docError}</p> : null}

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs"
                    onClick={() => setDocModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={requestDocMutation.isPending}
                    className="bg-[#f36b21] text-xs font-bold text-white hover:bg-[#d95316]"
                  >
                    {requestDocMutation.isPending ? "Submitting..." : "Send Request"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </SiteChrome>
  );
}
