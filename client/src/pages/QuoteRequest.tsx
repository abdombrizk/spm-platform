import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, FileUp, Plus, Send, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

type Item = { itemType: "product" | "service" | "custom"; productId?: number; serviceId?: number; itemName: string; quantity: number; notes: string };
type FileType = "application/pdf" | "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "image/jpeg" | "image/png" | "image/webp" | "video/mp4" | "video/quicktime";
const requesterTypes = [["doctor", "Doctor"], ["biomedical_engineer", "Biomedical engineer"], ["technician", "Technician"], ["procurement_officer", "Procurement officer"], ["hospital", "Hospital"], ["clinic", "Clinic"], ["medical_center", "Medical center"], ["distributor", "Distributor"], ["private_company", "Private company"], ["government_entity", "Government entity"], ["individual", "Individual"], ["other", "Other"]] as const;
const countries = ["Egypt", "Saudi Arabia", "United Arab Emirates", "Kuwait", "Qatar", "Bahrain", "Oman", "Jordan", "Lebanon", "Iraq", "Libya", "Sudan", "Other"];
function readFile(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file); }); }
export default function QuoteRequest() {
  const [, setLocation] = useLocation(); const products = trpc.products.published.useQuery(); const services = trpc.services.published.useQuery(); const create = trpc.quotes.create.useMutation(); const upload = trpc.quotes.uploadAttachment.useMutation();
  const [items, setItems] = useState<Item[]>([{ itemType: "custom", itemName: "", quantity: 1, notes: "" }]); const [files, setFiles] = useState<File[]>([]); const [message, setMessage] = useState(""); const [success, setSuccess] = useState(""); const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ organizationName: "", requesterType: "", contactPerson: "", jobTitle: "", email: "", phone: "", whatsapp: "", preferredContactMethod: "any", country: "Egypt", city: "", address: "", requiredDeliveryDate: "", installationRequired: "not_sure", trainingRequired: "not_sure", maintenanceContractRequired: "not_sure", message: "" });
  useEffect(() => { const params = new URLSearchParams(window.location.search); const productSlug = params.get("product"); const serviceSlug = params.get("service"); if (productSlug && products.data) { const product = products.data.find(item => item.slug === productSlug); if (product) setItems([{ itemType: "product", productId: product.id, itemName: (product.data as Record<string, string>).name || product.slug, quantity: 1, notes: "" }]); } else if (serviceSlug && services.data) { const service = services.data.find(item => item.slug === serviceSlug); if (service) setItems([{ itemType: "service", serviceId: service.id, itemName: (service.data as Record<string, string>).name || service.slug, quantity: 1, notes: "" }]); } }, [products.data, services.data]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const customNotes = params.get("custom_notes");
    const equipmentName = params.get("equipment");
    const brandName = params.get("brand");
    const modelName = params.get("model");
    if (customNotes) {
      setItems([{ itemType: "custom", itemName: customNotes, quantity: 1, notes: "Automated reference passed from spare parts & equipment portfolio" }]);
      setForm(prev => ({ ...prev, message: `Inquiry details: ${customNotes}` }));
    } else if (equipmentName) {
      const fullDescriptor = [equipmentName, brandName ? `Brand: ${brandName}` : null, modelName ? `Model: ${modelName}` : null].filter(Boolean).join(" · ");
      setItems(prev => prev.length ? prev.map((item, idx) => idx === 0 ? { ...item, itemName: equipmentName, notes: `Brand / Model: ${[brandName, modelName].filter(Boolean).join(" / ") || "Standard configuration"}` } : item) : [{ itemType: "custom", itemName: equipmentName, quantity: 1, notes: `Equipment: ${fullDescriptor}` }]);
      setForm(prev => ({ ...prev, message: prev.message || `Quotation requested for ${fullDescriptor}.` }));
    }
  }, []);
  const totalSize = useMemo(() => files.reduce((sum, file) => sum + file.size, 0), [files]);
  function setField(key: string, value: string) { setForm(current => ({ ...current, [key]: value })); }
  function setItem(index: number, patch: Partial<Item>) { setItems(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item)); }
  function chooseCatalogItem(index: number, value: string) { if (value.startsWith("p:")) { const id = Number(value.slice(2)); const product = products.data?.find(item => item.id === id); setItem(index, { itemType: "product", productId: id, serviceId: undefined, itemName: product ? ((product.data as Record<string, string>).name || product.slug) : "" }); } else if (value.startsWith("s:")) { const id = Number(value.slice(2)); const service = services.data?.find(item => item.id === id); setItem(index, { itemType: "service", serviceId: id, productId: undefined, itemName: service ? ((service.data as Record<string, string>).name || service.slug) : "" }); } else setItem(index, { itemType: "custom", productId: undefined, serviceId: undefined, itemName: "" }); }
  function addFileList(list: FileList | null) { if (!list) return; const next = [...files, ...Array.from(list)]; if (next.length > 5) { setMessage("A maximum of 5 files is allowed."); return; } if (next.some(file => file.size > 10 * 1024 * 1024)) { setMessage("Each file must be 10 MB or smaller."); return; } if (next.reduce((sum, file) => sum + file.size, 0) > 30 * 1024 * 1024) { setMessage("The total attachment size must be 30 MB or smaller."); return; } setFiles(next); }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setSuccess("");
    if (items.some(item => !item.itemName.trim())) {
      setMessage("Complete every request item or remove empty items.");
      return;
    }
    if (totalSize > 30 * 1024 * 1024) {
      setMessage("The total attachment size must be 30 MB or smaller.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await create.mutateAsync({
        ...form,
        requesterType: form.requesterType ? form.requesterType as any : undefined,
        preferredContactMethod: form.preferredContactMethod as any,
        installationRequired: form.installationRequired as any,
        trainingRequired: form.trainingRequired as any,
        maintenanceContractRequired: form.maintenanceContractRequired as any,
        items,
        source: "website",
        honeypot: "",
      });
      for (const file of files) {
        await upload.mutateAsync({
          quoteRequestId: result.id,
          accessToken: (result as any).publicAccessToken || "",
          fileName: file.name,
          contentType: file.type as FileType,
          sizeBytes: file.size,
          dataUrl: await readFile(file),
        });
      }
      setSuccess(result.publicNumber);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit the request.");
    } finally {
      setSubmitting(false);
    }
  }
  if (success) return <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] p-6"><Card className="w-full max-w-xl"><CardHeader><CardTitle>Request received</CardTitle><CardDescription>Your request has been recorded for the SPM team.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="rounded-2xl bg-slate-950 p-6 text-center text-white"><p className="text-sm text-cyan-200">Request number</p><p className="mt-2 text-3xl font-semibold tracking-wider">{success}</p></div><p className="text-sm leading-7 text-slate-600">Keep this request number for future communication. The submitted email is associated with the request.</p><div className="flex gap-2"><Link href="/"><Button>Back to website</Button></Link><Link href="/catalogue"><Button variant="outline">Browse catalogue</Button></Link></div></CardContent></Card></main>;
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <SEOHead
        title="Request a Commercial Quotation"
        description="Request a formal commercial proposal for medical imaging systems, spare parts, surgical instruments, and maintenance agreements from SPM."
        url="/request-a-quote"
      />
      <header className="border-b bg-white"><div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5"><Link href="/" className="flex items-center gap-2 text-sm text-slate-600"><ArrowLeft className="h-4 w-4" />Back to website</Link><p className="font-semibold tracking-tight">SPM <span className="ml-2 text-xs font-normal uppercase tracking-[0.2em] text-slate-500">Request a quote</span></p></div></header><section className="mx-auto max-w-5xl px-6 py-12"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">Sales intake</p><h1 className="mt-3 text-5xl font-semibold tracking-tight">Tell us what you need</h1><p className="mt-4 text-lg leading-8 text-slate-600">Add products, services, or a custom request. You do not need an account to submit; your email is linked to the request.</p></div><form className="mt-10 space-y-6" onSubmit={submit}><Card><CardHeader><CardTitle>Request items</CardTitle><CardDescription>Select multiple products and services or describe an item that is not in the catalogue.</CardDescription></CardHeader><CardContent className="space-y-4">{items.map((item, index) => <div className="rounded-2xl border p-4" key={`item-${index}`}><div className="grid gap-3 md:grid-cols-[1fr_120px_1fr_auto]"><Select value={item.itemType === "product" ? `p:${item.productId}` : item.itemType === "service" ? `s:${item.serviceId}` : "custom"} onValueChange={value => chooseCatalogItem(index, value)}><SelectTrigger><SelectValue placeholder="Choose product, service or custom" /></SelectTrigger><SelectContent><SelectItem value="custom">Other / Custom request</SelectItem>{products.data?.map(product => <SelectItem key={`p-${product.id}`} value={`p:${product.id}`}>Product: {(product.data as Record<string, string>).name || product.slug}</SelectItem>)}{services.data?.map(service => <SelectItem key={`s-${service.id}`} value={`s:${service.id}`}>Service: {(service.data as Record<string, string>).name || service.slug}</SelectItem>)}</SelectContent></Select><Input type="number" min={1} max={999999} value={item.quantity} onChange={event => setItem(index, { quantity: Number(event.target.value) })} aria-label="Quantity" /><Input value={item.itemType === "custom" ? item.itemName : item.itemName} readOnly={item.itemType !== "custom"} onChange={event => setItem(index, { itemName: event.target.value })} placeholder="Custom item name" />{items.length > 1 ? <Button type="button" variant="ghost" size="icon" aria-label="Remove item" onClick={() => setItems(current => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4 text-red-600" /></Button> : null}</div><Textarea className="mt-3" rows={2} value={item.notes} onChange={event => setItem(index, { notes: event.target.value })} placeholder="Item-specific notes (optional)" /></div>)}<Button type="button" variant="outline" onClick={() => setItems(current => [...current, { itemType: "custom", itemName: "", quantity: 1, notes: "" }])}><Plus className="mr-2 h-4 w-4" />Add another item</Button></CardContent></Card><Card><CardHeader><CardTitle>Your details</CardTitle><CardDescription>We accept requests from individuals, doctors, technicians, engineers, facilities, companies and procurement teams.</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Contact person *</Label><Input required value={form.contactPerson} onChange={event => setField("contactPerson", event.target.value)} /></div><div className="space-y-2"><Label>Organization / facility (optional)</Label><Input value={form.organizationName} onChange={event => setField("organizationName", event.target.value)} /></div><div className="space-y-2"><Label>Requester type (optional)</Label><Select value={form.requesterType} onValueChange={value => setField("requesterType", value)}><SelectTrigger><SelectValue placeholder="Choose one" /></SelectTrigger><SelectContent>{requesterTypes.map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Job title (optional)</Label><Input value={form.jobTitle} onChange={event => setField("jobTitle", event.target.value)} /></div><div className="space-y-2"><Label>Email *</Label><Input required type="email" value={form.email} onChange={event => setField("email", event.target.value)} /></div><div className="space-y-2"><Label>Phone *</Label><Input required type="tel" value={form.phone} onChange={event => setField("phone", event.target.value)} /></div><div className="space-y-2"><Label>WhatsApp (optional)</Label><Input value={form.whatsapp} onChange={event => setField("whatsapp", event.target.value)} /></div><div className="space-y-2"><Label>Preferred contact method</Label><Select value={form.preferredContactMethod} onValueChange={value => setField("preferredContactMethod", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="email">Email</SelectItem><SelectItem value="phone">Phone</SelectItem><SelectItem value="whatsapp">WhatsApp</SelectItem><SelectItem value="any">Any method</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Country *</Label><Select value={form.country} onValueChange={value => setField("country", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{countries.map(country => <SelectItem key={country} value={country}>{country}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>City (optional)</Label><Input value={form.city} onChange={event => setField("city", event.target.value)} /></div><div className="space-y-2 md:col-span-2"><Label>Address (optional)</Label><Textarea rows={3} value={form.address} onChange={event => setField("address", event.target.value)} /></div></CardContent></Card><Card><CardHeader><CardTitle>Requirements and attachments</CardTitle></CardHeader><CardContent className="space-y-5"><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Required delivery date (optional)</Label><Input type="date" min={new Date().toISOString().slice(0, 10)} value={form.requiredDeliveryDate} onChange={event => setField("requiredDeliveryDate", event.target.value)} /></div>{(["installationRequired", "trainingRequired", "maintenanceContractRequired"] as const).map(key => <div className="space-y-2" key={key}><Label>{key === "installationRequired" ? "Installation required" : key === "trainingRequired" ? "Training required" : "Maintenance contract required"}</Label><Select value={form[key]} onValueChange={value => setField(key, value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem><SelectItem value="not_sure">Not sure</SelectItem></SelectContent></Select></div>)}</div><div className="space-y-2"><Label>Additional message</Label><Textarea rows={5} value={form.message} onChange={event => setField("message", event.target.value)} placeholder="Describe your requirement or any technical context." /></div><div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Do not include patient names, patient records, medical reports, or sensitive clinical information in this form.</div><div className="space-y-3"><Label>Attachments (optional, up to 5 files / 10 MB each / 30 MB total)</Label><Input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.mp4,.mov" onChange={event => addFileList(event.target.files)} />{files.length ? <div className="space-y-2 text-sm text-slate-600">{files.map((file, index) => <div className="flex items-center gap-2" key={`${file.name}-${index}`}><FileUp className="h-4 w-4" />{file.name}<button type="button" className="ml-auto text-red-600" onClick={() => setFiles(current => current.filter((_, fileIndex) => fileIndex !== index))}>Remove</button></div>)}</div> : null}</div></CardContent></Card>{message ? <Alert variant="destructive"><AlertDescription>{message}</AlertDescription></Alert> : null}<div className="flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-slate-500">Fields marked * are required. No account or password is required.</p><Button size="lg" type="submit" disabled={submitting}><Send className="mr-2 h-4 w-4" />{submitting ? "Submitting…" : "Submit request"}</Button></div></form></section></main>
  );
}
import SEOHead from "@/components/SEOHead";
