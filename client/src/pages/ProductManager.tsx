import { useEffect, useMemo, useRef, useState } from "react";
import { Archive, CheckCircle2, Eye, EyeOff, FileUp, Filter, ImagePlus, PackagePlus, Pencil, Plus, RotateCcw, Save, Search, Send, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

type ProductType = "medical_device" | "spare_part" | "accessory";
type Availability = "available" | "on_request" | "discontinued" | "coming_soon";
type ProductDraft = {
  name: string; code: string; modelNumber: string; category: string; brand: string; manufacturer: string; supplier: string; countryOfOrigin: string;
  shortDescription: string; fullDescription: string; features: string[]; applications: string[];
  technicalSpecifications: Record<string, string>; mainImage: string; additionalImages: string[]; brochureUrl: string; datasheetUrl: string; userManualUrl: string; videoUrl: string;
  availabilityStatus: Availability; requestQuote: boolean; ceStatus: "available" | "not_available" | "not_applicable" | "under_review"; qualityReviewStatus: "not_reviewed" | "under_review" | "approved" | "rejected"; regulatoryDocumentsPublic: boolean; regulatoryDocumentUrl: string; seoTitle: string; seoDescription: string; featured: boolean;
};

type ProductRow = { id: number; slug: string; productType: ProductType; draftData: string; publishedData: string; draftVisible: boolean; publishedVisible: boolean; workflowStatus: "draft" | "published" | "archived"; displayOrder: number; createdAt: Date; updatedAt: Date; };

const emptyDraft: ProductDraft = { name: "", code: "", modelNumber: "", category: "C-Arm", brand: "SPM", manufacturer: "", supplier: "", countryOfOrigin: "", shortDescription: "", fullDescription: "", features: [""], applications: [""], technicalSpecifications: { generatorPower: "", tubeVoltage: "", tubeCurrent: "", detectorType: "", imageReceptor: "", fluoroscopyModes: "", dimensions: "", weight: "", powerRequirements: "", warranty: "" }, mainImage: "", additionalImages: [], brochureUrl: "", datasheetUrl: "", userManualUrl: "", videoUrl: "", availabilityStatus: "available", requestQuote: true, ceStatus: "under_review", qualityReviewStatus: "not_reviewed", regulatoryDocumentsPublic: false, regulatoryDocumentUrl: "", seoTitle: "", seoDescription: "", featured: false };
const specs: Array<[string, string]> = [["generatorPower", "Generator power"], ["tubeVoltage", "Tube voltage"], ["tubeCurrent", "Tube current"], ["detectorType", "Detector type"], ["imageReceptor", "Image receptor"], ["fluoroscopyModes", "Fluoroscopy modes"], ["dimensions", "Dimensions"], ["weight", "Weight"], ["powerRequirements", "Power requirements"], ["warranty", "Warranty"]];
const labels: Record<string, string> = { medical_device: "Medical device", spare_part: "Spare part", accessory: "Accessory", draft: "Draft", published: "Published", archived: "Archived" };
const categories = ["All categories", "C-Arm", "Mobile X-Ray", "Fixed Radiography", "Digital Radiography (DR)", "Fluoroscopy", "Mammography", "Dental X-Ray", "Spare Part", "Other"] as const;

function parseDraft(value: string): ProductDraft { try { return { ...emptyDraft, ...JSON.parse(value), technicalSpecifications: { ...emptyDraft.technicalSpecifications, ...(JSON.parse(value).technicalSpecifications ?? {}) } }; } catch { return { ...emptyDraft }; } }
function linesToArray(value: string[]) { return value.filter(item => item.trim()).map(item => item.trim()); }

export default function ProductManager() {
  const [, setLocation] = useLocation();
  const auth = trpc.auth.me.useQuery();
  const permissionsQuery = trpc.products.permissions.useQuery(undefined, { enabled: Boolean(auth.data) });
  const products = trpc.products.list.useQuery(undefined, { enabled: Boolean(auth.data) });
  const utils = trpc.useUtils();
  const [editingId, setEditingId] = useState<number | undefined>();
  const [slug, setSlug] = useState("");
  const [productType, setProductType] = useState<ProductType>("medical_device");
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [draftVisible, setDraftVisible] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [message, setMessage] = useState("");
  const [mediaField, setMediaField] = useState<"mainImage" | "brochureUrl">("mainImage");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const create = trpc.products.create.useMutation({ onSuccess: () => { setMessage("Equipment draft created successfully."); resetForm(); utils.products.list.invalidate(); }, onError: error => setMessage(error.message) });
  const update = trpc.products.update.useMutation({ onSuccess: () => { setMessage("Equipment details saved."); utils.products.list.invalidate(); }, onError: error => setMessage(error.message) });
  const publish = trpc.products.publish.useMutation({ onSuccess: () => { setMessage("Equipment published to public catalogue."); utils.products.list.invalidate(); utils.products.published.invalidate(); }, onError: error => setMessage(error.message) });
  const archive = trpc.products.archive.useMutation({ onSuccess: () => { setMessage("Equipment moved to archive."); utils.products.list.invalidate(); utils.products.published.invalidate(); }, onError: error => setMessage(error.message) });
  const restore = trpc.products.restore.useMutation({ onSuccess: () => { setMessage("Equipment restored as draft."); utils.products.list.invalidate(); }, onError: error => setMessage(error.message) });
  const remove = trpc.products.delete.useMutation({ onSuccess: () => { setMessage("Equipment deleted permanently."); utils.products.list.invalidate(); }, onError: error => setMessage(error.message) });
  const toggleVisibility = trpc.products.toggleVisibility.useMutation({ onSuccess: () => { setMessage("Display status updated."); utils.products.list.invalidate(); utils.products.published.invalidate(); }, onError: error => setMessage(error.message) });
  const upload = trpc.products.uploadMedia.useMutation({ onSuccess: result => { setDraft(current => ({ ...current, [mediaField]: result.url })); setMessage("Media uploaded into the current draft. Save the product to keep it."); }, onError: error => setMessage(error.message) });

  useEffect(() => { if (!auth.isLoading && !auth.data) setLocation("/login"); }, [auth.isLoading, auth.data, setLocation]);
  const role = auth.data?.role;
  const isOwner = role === "owner";
  const permissions = new Set(permissionsQuery.data ?? []);
  const canUse = isOwner || permissions.has("products.view");
  const canCreate = isOwner || permissions.has("products.create");
  const canEdit = isOwner || permissions.has("products.edit");
  const canMedia = isOwner || permissions.has("products.media");
  const canQuality = isOwner || permissions.has("products.quality");
  const canPublish = isOwner || permissions.has("products.publish");
  const canArchive = isOwner || permissions.has("products.archive");
  const canDelete = isOwner || permissions.has("products.delete");

  const rows = useMemo(() => {
    return (products.data ?? []).map(row => ({ ...row, parsed: parseDraft(row.draftData) }));
  }, [products.data]);

  const filteredRows = useMemo(() => {
    return rows.filter(item => {
      const matchCat = categoryFilter === "All categories" || (item.parsed.category || "Other").toLowerCase().includes(categoryFilter.toLowerCase()) || (categoryFilter === "C-Arm" && (item.parsed.name.toLowerCase().includes("c-arm") || item.slug.includes("c-arm")));
      const matchAvail = availabilityFilter === "all" || item.parsed.availabilityStatus === availabilityFilter;
      const matchSearch = `${item.parsed.name} ${item.parsed.modelNumber} ${item.parsed.brand} ${item.parsed.category} ${item.slug}`.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchAvail && matchSearch;
    });
  }, [rows, categoryFilter, availabilityFilter, search]);

  function resetForm() {
    setEditingId(undefined);
    setSlug("");
    setProductType("medical_device");
    setDraft({ ...emptyDraft, technicalSpecifications: { ...emptyDraft.technicalSpecifications }, features: [""], applications: [""] });
    setDraftVisible(true);
    setDisplayOrder(0);
  }

  function editProduct(row: ProductRow) {
    setEditingId(row.id);
    setSlug(row.slug);
    setProductType(row.productType);
    setDraft(parseDraft(row.draftData));
    setDraftVisible(row.draftVisible);
    setDisplayOrder(row.displayOrder);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function quickAddDevice(name: string, category: string, availability: Availability) {
    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setEditingId(undefined);
    setSlug(generatedSlug);
    setProductType("medical_device");
    setDraft({
      ...emptyDraft,
      name,
      category,
      brand: "SPM / Partner",
      availabilityStatus: availability,
      shortDescription: `Professional ${category} medical imaging system by SPM.`,
      features: ["High definition real-time imaging", "Low radiation dose modes", "Compact ergonomic design"],
      applications: ["Orthopedics", "General Surgery", "Vascular Procedures", "Pain Management"],
      technicalSpecifications: { generatorPower: "5 kW - 15 kW high frequency", tubeVoltage: "40 - 120 kV", tubeCurrent: "up to 100 mA", detectorType: "Flat Panel Detector (FPD) or I.I.", dimensions: "Compact mobile footprint", warranty: "Comprehensive warranty available" }
    });
    setDraftVisible(true);
    setDisplayOrder((products.data?.length ?? 0) + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveProduct() {
    const data = { ...draft, features: linesToArray(draft.features), applications: linesToArray(draft.applications) };
    if (editingId) update.mutate({ id: editingId, slug, productType, data, draftVisible, displayOrder });
    else create.mutate({ slug, productType, data, draftVisible, displayOrder });
  }

  function updateField<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  function updateLine(key: "features" | "applications", index: number, value: string) {
    setDraft(current => ({ ...current, [key]: current[key].map((line, lineIndex) => lineIndex === index ? value : line) }));
  }

  function uploadFile(file: File | undefined) {
    if (!file || !editingId) { setMessage("Save the equipment draft once before uploading media."); return; }
    const allowed = mediaField === "mainImage" ? ["image/jpeg", "image/png", "image/webp"] : ["application/pdf"];
    if (!allowed.includes(file.type)) { setMessage(mediaField === "mainImage" ? "Use JPG, PNG or WebP for the main image." : "Use a PDF brochure."); return; }
    const reader = new FileReader();
    reader.onload = () => upload.mutate({ id: editingId, field: mediaField, fileName: file.name, contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "application/pdf", dataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  }

  if (auth.isLoading || (auth.data && (products.isLoading || permissionsQuery.isLoading))) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Loading equipment workspace…</div>;
  if (!auth.data) return null;
  if (!canUse) return <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6"><Card><CardHeader><CardTitle>Products permission required</CardTitle><CardDescription>The Owner must grant access to this account.</CardDescription></CardHeader></Card></div>;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0a4052] text-cyan-300">
              <PackagePlus className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">SPM equipment management</p>
              <h1 className="text-xl font-semibold tracking-tight">C-Arm & X-Ray Equipment Catalogue</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/catalogue"><Button variant="outline">View public catalogue</Button></Link>
            <Link href="/owner"><Button variant="ghost">Back to dashboard</Button></Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-6 px-6 py-8">
        {message ? <Alert><AlertDescription>{message}</AlertDescription></Alert> : null}

        <Card className="border-cyan-100 shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>Equipment inventory and public display table</CardTitle>
                <CardDescription>View all C-Arm and X-Ray systems, verify availability (Available / Out of stock / On request), and toggle public display instantly.</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => quickAddDevice("Mobile C-Arm Fluoroscopy System", "C-Arm", "available")}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> Template: C-Arm
                </Button>
                <Button size="sm" variant="outline" onClick={() => quickAddDevice("Mobile Digital Radiography X-Ray", "Mobile X-Ray", "available")}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> Template: Mobile X-Ray
                </Button>
                <Button size="sm" variant="outline" onClick={() => quickAddDevice("Fixed Floor-Mounted Radiography Room", "Fixed Radiography", "on_request")}>
                  <Plus className="mr-1 h-3.5 w-3.5" /> Template: Fixed X-Ray
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Search C-Arm, X-Ray, model, brand…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="available">Available in stock</SelectItem>
                    <SelectItem value="on_request">On request / Order</SelectItem>
                    <SelectItem value="coming_soon">Coming soon</SelectItem>
                    <SelectItem value="discontinued">Out of stock / Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border bg-white">
              <table className="w-full text-left text-sm text-[#17212b]">
                <thead className="border-b bg-[#f8fafc] text-xs font-semibold uppercase tracking-wider text-[#617180]">
                  <tr>
                    <th className="px-4 py-3.5">Device name & code</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Brand / Mfr</th>
                    <th className="px-4 py-3.5">Availability in stock</th>
                    <th className="px-4 py-3.5">Catalogue status</th>
                    <th className="px-4 py-3.5">Public display</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredRows.map(item => {
                    const avail = item.parsed.availabilityStatus;
                    const isVisible = item.workflowStatus === "published" && item.publishedVisible;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-3.5 font-medium">
                          <div className="flex items-center gap-3">
                            {item.parsed.mainImage ? <img src={item.parsed.mainImage} alt="" className="h-10 w-12 rounded-md object-cover border" /> : <div className="flex h-10 w-12 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">X-Ray</div>}
                            <div>
                              <p className="font-semibold text-[#0a4052]">{item.parsed.name || item.slug}</p>
                              <p className="text-xs text-slate-500 font-mono">{item.parsed.code || item.slug} {item.parsed.modelNumber ? `· Model: ${item.parsed.modelNumber}` : ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-600">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{item.parsed.category || "General"}</span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-600">
                          {item.parsed.brand || item.parsed.manufacturer || "SPM"}
                        </td>
                        <td className="px-4 py-3.5">
                          {avail === "available" ? <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"><CheckCircle2 className="mr-1 h-3 w-3" /> Available</Badge>
                            : avail === "on_request" ? <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">On request</Badge>
                            : avail === "coming_soon" ? <Badge variant="outline" className="border-cyan-300 bg-cyan-50 text-cyan-800">Coming soon</Badge>
                            : <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">Out of stock</Badge>}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge variant={item.workflowStatus === "published" ? "secondary" : "outline"} className={item.workflowStatus === "published" ? "bg-[#eaf4fa] text-[#0f6fae]" : ""}>
                            {labels[item.workflowStatus]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">
                          <Button size="sm" variant="ghost" className="h-8 text-xs gap-1" disabled={!canEdit || toggleVisibility.isPending} onClick={() => toggleVisibility.mutate({ id: item.id, publishedVisible: !item.publishedVisible })}>
                            {isVisible ? <><Eye className="h-3.5 w-3.5 text-emerald-600" /> Showing</> : <><EyeOff className="h-3.5 w-3.5 text-slate-400" /> Hidden</>}
                          </Button>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs" disabled={!canEdit} onClick={() => editProduct(item)}>
                              <Pencil className="mr-1 h-3 w-3" /> Edit
                            </Button>
                            {item.workflowStatus === "draft" ? (
                              <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs text-[#0f6fae] hover:bg-[#eaf4fa]" disabled={!canPublish} onClick={() => publish.mutate({ id: item.id })}>
                                <Send className="mr-1 h-3 w-3" /> Publish
                              </Button>
                            ) : item.workflowStatus === "published" ? (
                              <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs" disabled={!canArchive} onClick={() => archive.mutate({ id: item.id })}>
                                <Archive className="mr-1 h-3 w-3" /> Archive
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs" disabled={!canEdit} onClick={() => restore.mutate({ id: item.id })}>
                                <RotateCcw className="mr-1 h-3 w-3" /> Restore
                              </Button>
                            )}
                            {canDelete ? (
                              <Button size="sm" variant="ghost" className="h-8 px-2 text-red-600 hover:text-red-700" onClick={() => window.confirm("Permanently delete this equipment?") && remove.mutate({ id: item.id })}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-sm text-slate-500">
                        No equipment records match your search or filter. Use the buttons above to add the first C-Arm or X-Ray device.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>{editingId ? `Edit device: ${draft.name || slug}` : "Add new C-Arm or X-Ray device to display"}</CardTitle>
                <CardDescription>Enter technical specifications, availability status, brochure and image. Published devices appear immediately in the public catalogue.</CardDescription>
              </div>
              {editingId ? <Button variant="outline" onClick={resetForm}><Plus className="mr-2 h-4 w-4" />New equipment draft</Button> : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Device Name *</Label>
                <Input value={draft.name} onChange={e => { updateField("name", e.target.value); if (!editingId && !slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")); }} placeholder="e.g. Italray Clinodigit Mobile C-Arm" required />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={draft.category || "C-Arm"} onValueChange={v => updateField("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="C-Arm">C-Arm (Surgical / Vascular)</SelectItem>
                    <SelectItem value="Mobile X-Ray">Mobile X-Ray</SelectItem>
                    <SelectItem value="Fixed Radiography">Fixed Radiography</SelectItem>
                    <SelectItem value="Digital Radiography (DR)">Digital Radiography (DR)</SelectItem>
                    <SelectItem value="Fluoroscopy">Fluoroscopy</SelectItem>
                    <SelectItem value="Mammography">Mammography</SelectItem>
                    <SelectItem value="Dental X-Ray">Dental X-Ray</SelectItem>
                    <SelectItem value="Spare Part">Spare Part / Tube / Generator</SelectItem>
                    <SelectItem value="Other">Other Medical Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Availability Status *</Label>
                <Select value={draft.availabilityStatus} onValueChange={v => updateField("availabilityStatus", v as Availability)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available in Stock</SelectItem>
                    <SelectItem value="on_request">On Request / Custom Order</SelectItem>
                    <SelectItem value="coming_soon">Coming Soon</SelectItem>
                    <SelectItem value="discontinued">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>URL slug *</Label>
                <Input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="clinodigit-omega-c-arm" />
              </div>
              <div className="space-y-2">
                <Label>Brand / Manufacturer</Label>
                <Input value={draft.brand} onChange={e => updateField("brand", e.target.value)} placeholder="e.g. Italray / SPM" />
              </div>
              <div className="space-y-2">
                <Label>Model Number</Label>
                <Input value={draft.modelNumber} onChange={e => updateField("modelNumber", e.target.value)} placeholder="e.g. Omega C / Compact" />
              </div>
              <div className="space-y-2">
                <Label>Product SKU / Code</Label>
                <Input value={draft.code} onChange={e => updateField("code", e.target.value)} placeholder="e.g. SPM-CARM-001" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 rounded-xl border bg-slate-50 p-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={draftVisible} onChange={e => setDraftVisible(e.target.checked)} className="h-4 w-4 accent-cyan-600" />
                <span className="font-medium text-[#0a4052]">Display in public catalogue when published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={draft.requestQuote} onChange={e => updateField("requestQuote", e.target.checked)} className="h-4 w-4 accent-cyan-600" />
                <span className="text-slate-700">Enable "Request a Quote" button</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={draft.featured} onChange={e => updateField("featured", e.target.checked)} className="h-4 w-4 accent-cyan-600" />
                <span className="text-slate-700">Feature on homepage</span>
              </label>
            </div>

            <Tabs defaultValue="basic">
              <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4">
                <TabsTrigger value="basic">Commercial details</TabsTrigger>
                <TabsTrigger value="description">Descriptions & features</TabsTrigger>
                <TabsTrigger value="technical">Technical specifications</TabsTrigger>
                <TabsTrigger value="media">Images, brochures & CE</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Manufacturer (optional)</Label>
                    <Input value={draft.manufacturer} onChange={e => updateField("manufacturer", e.target.value)} placeholder="e.g. Italray Italy" />
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier / Agent</Label>
                    <Input value={draft.supplier} onChange={e => updateField("supplier", e.target.value)} placeholder="e.g. SPM Systems for Projects & Maintenance" />
                  </div>
                  <div className="space-y-2">
                    <Label>Country of Origin</Label>
                    <Input value={draft.countryOfOrigin} onChange={e => updateField("countryOfOrigin", e.target.value)} placeholder="e.g. Italy / Germany / Egypt" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="description" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Short description (shown on cards and list)</Label>
                  <Textarea rows={3} value={draft.shortDescription} onChange={e => updateField("shortDescription", e.target.value)} placeholder="High performance mobile C-Arm fluoroscopy system designed for operating theatres and surgical procedures." />
                </div>
                <div className="space-y-2">
                  <Label>Full description (detailed device specifications)</Label>
                  <Textarea rows={6} value={draft.fullDescription} onChange={e => updateField("fullDescription", e.target.value)} placeholder="Comprehensive clinical description, workflow benefits, ergonomic movement, generator power and detector advantages..." />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {(["features", "applications"] as const).map(key => (
                    <div key={key} className="space-y-2">
                      <Label>{key === "features" ? "Key features (bullet points)" : "Clinical applications"}</Label>
                      {draft[key].map((line, index) => (
                        <div className="flex gap-2" key={`${key}-${index}`}>
                          <Input value={line} onChange={e => updateLine(key, index, e.target.value)} placeholder="One point per line" />
                          {index === draft[key].length - 1 ? (
                            <Button type="button" variant="outline" size="icon" onClick={() => setDraft(current => ({ ...current, [key]: [...current[key], ""] }))}>+</Button>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4 pt-4">
                <Alert>
                  <AlertDescription>Fixed technical specifications table. These specs are presented in a clean collapsible table on the public equipment detail page.</AlertDescription>
                </Alert>
                <div className="grid gap-4 md:grid-cols-2">
                  {specs.map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label>{label}</Label>
                      <Input value={draft.technicalSpecifications[key] ?? ""} onChange={e => setDraft(current => ({ ...current, technicalSpecifications: { ...current.technicalSpecifications, [key]: e.target.value } }))} placeholder={`e.g. for ${label}`} />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-5 pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Main Image URL</Label>
                    <Input value={draft.mainImage} onChange={e => updateField("mainImage", e.target.value)} placeholder="Storage URL or paste link" />
                    <Button type="button" variant="outline" className="mt-2" disabled={!canMedia} onClick={() => { setMediaField("mainImage"); fileInput.current?.click(); }}>
                      <ImagePlus className="mr-2 h-4 w-4" /> Upload main equipment image
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Brochure PDF URL</Label>
                    <Input value={draft.brochureUrl} onChange={e => updateField("brochureUrl", e.target.value)} placeholder="PDF link for public download" />
                    <Button type="button" variant="outline" className="mt-2" disabled={!canMedia} onClick={() => { setMediaField("brochureUrl"); fileInput.current?.click(); }}>
                      <FileUp className="mr-2 h-4 w-4" /> Upload PDF brochure
                    </Button>
                  </div>
                </div>
                <input ref={fileInput} type="file" className="hidden" accept={mediaField === "mainImage" ? "image/jpeg,image/png,image/webp" : "application/pdf"} onChange={e => uploadFile(e.target.files?.[0])} />
                {draft.mainImage ? <img src={draft.mainImage} alt="Equipment preview" className="h-44 w-full max-w-md rounded-2xl object-cover border" /> : null}

                <div className="grid gap-4 rounded-xl border bg-slate-50 p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>CE Certification Status</Label>
                    <Select disabled={!canQuality} value={draft.ceStatus} onValueChange={v => updateField("ceStatus", v as ProductDraft["ceStatus"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">CE Certified / Available</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="not_available">Not Available</SelectItem>
                        <SelectItem value="not_applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quality / ISO 13485 Status</Label>
                    <Select disabled={!canQuality} value={draft.qualityReviewStatus} onValueChange={v => updateField("qualityReviewStatus", v as ProductDraft["qualityReviewStatus"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved & Verified</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                        <SelectItem value="not_reviewed">Not Reviewed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" disabled={!canQuality} checked={draft.regulatoryDocumentsPublic} onChange={e => updateField("regulatoryDocumentsPublic", e.target.checked)} className="h-4 w-4 accent-cyan-600" />
                      <span>Display quality & CE certificate download to public visitors</span>
                    </label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap items-center gap-3 border-t pt-5">
              <Button onClick={saveProduct} disabled={create.isPending || update.isPending || !slug || !draft.name || (editingId ? !canEdit : !canCreate)} className="bg-[#0a4052] text-white hover:bg-[#063545]">
                <Save className="mr-2 h-4 w-4" />
                {create.isPending || update.isPending ? "Saving…" : editingId ? "Save equipment changes" : "Create equipment draft"}
              </Button>
              {editingId ? (
                <>
                  <Button variant="outline" className="border-[#0f6fae] text-[#0f6fae] hover:bg-[#eaf4fa]" disabled={!canPublish || publish.isPending} onClick={() => publish.mutate({ id: editingId })}>
                    <Send className="mr-2 h-4 w-4" /> Publish to catalogue
                  </Button>
                  <Button variant="outline" disabled={!canArchive || archive.isPending} onClick={() => archive.mutate({ id: editingId })}>
                    <Archive className="mr-2 h-4 w-4" /> Move to archive
                  </Button>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
