import { useEffect, useMemo, useRef, useState } from "react";
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  FileText,
  FileUp,
  Filter,
  FolderTree,
  ImagePlus,
  Layers,
  PackagePlus,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";
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
import MarketingItalrayWorkspace from "@/components/MarketingItalrayWorkspace";

type ProductType = "medical_device" | "spare_part" | "accessory";
type Availability = "available" | "on_request" | "discontinued" | "coming_soon";
type ProductDraft = {
  name: string;
  code: string;
  modelNumber: string;
  category: string;
  brand: string;
  manufacturer: string;
  supplier: string;
  countryOfOrigin: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  applications: string[];
  technicalSpecifications: Record<string, string>;
  mainImage: string;
  additionalImages: string[];
  brochureUrl: string;
  datasheetUrl: string;
  userManualUrl: string;
  videoUrl: string;
  availabilityStatus: Availability;
  requestQuote: boolean;
  commerceMode: "quote_only" | "checkout" | "both";
  shopifyProductId: string;
  shopifyHandle: string;
  ceStatus: "available" | "not_available" | "not_applicable" | "under_review";
  qualityReviewStatus: "not_reviewed" | "under_review" | "approved" | "rejected";
  regulatoryDocumentsPublic: boolean;
  regulatoryDocumentUrl: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
};

type ProductRow = {
  id: number;
  slug: string;
  productType: ProductType;
  draftData: string;
  publishedData: string;
  draftVisible: boolean;
  publishedVisible: boolean;
  workflowStatus: "draft" | "pending_review" | "approved" | "published" | "archived";
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

const emptyDraft: ProductDraft = {
  name: "",
  code: "",
  modelNumber: "",
  category: "C-Arm",
  brand: "SPM",
  manufacturer: "",
  supplier: "",
  countryOfOrigin: "",
  shortDescription: "",
  fullDescription: "",
  features: [""],
  applications: [""],
  technicalSpecifications: {
    generatorPower: "",
    tubeVoltage: "",
    tubeCurrent: "",
    detectorType: "",
    imageReceptor: "",
    fluoroscopyModes: "",
    dimensions: "",
    weight: "",
    powerRequirements: "",
    warranty: "",
  },
  mainImage: "",
  additionalImages: [],
  brochureUrl: "",
  datasheetUrl: "",
  userManualUrl: "",
  videoUrl: "",
  availabilityStatus: "available",
  requestQuote: true,
  commerceMode: "quote_only",
  shopifyProductId: "",
  shopifyHandle: "",
  ceStatus: "under_review",
  qualityReviewStatus: "not_reviewed",
  regulatoryDocumentsPublic: false,
  regulatoryDocumentUrl: "",
  seoTitle: "",
  seoDescription: "",
  featured: false,
};

const specs: Array<[string, string]> = [
  ["generatorPower", "Generator power"],
  ["tubeVoltage", "Tube voltage"],
  ["tubeCurrent", "Tube current"],
  ["detectorType", "Detector type"],
  ["imageReceptor", "Image receptor"],
  ["fluoroscopyModes", "Fluoroscopy modes"],
  ["dimensions", "Dimensions"],
  ["weight", "Weight"],
  ["powerRequirements", "Power requirements"],
  ["warranty", "Warranty"],
];

const labels: Record<string, string> = {
  medical_device: "Medical device",
  spare_part: "Spare part",
  accessory: "Accessory",
  draft: "Draft",
  pending_review: "Pending review",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
};

const categories = [
  "All categories",
  "C-Arm",
  "Mobile X-Ray",
  "Fixed Radiography",
  "Digital Radiography (DR)",
  "Fluoroscopy",
  "Mammography",
  "Dental X-Ray",
  "Spare Part",
  "Other",
] as const;

function parseDraft(value: string): ProductDraft {
  try {
    return {
      ...emptyDraft,
      ...JSON.parse(value),
      technicalSpecifications: {
        ...emptyDraft.technicalSpecifications,
        ...(JSON.parse(value).technicalSpecifications ?? {}),
      },
    };
  } catch {
    return { ...emptyDraft };
  }
}

function linesToArray(value: string[]) {
  return value.filter(item => item.trim()).map(item => item.trim());
}

export default function ProductManager() {
  const [, setLocation] = useLocation();
  const auth = trpc.auth.me.useQuery(undefined, { retry: false, refetchOnWindowFocus: false });
  const permissionsQuery = trpc.products.permissions.useQuery(undefined, { enabled: Boolean(auth.data) });
  const products = trpc.products.list.useQuery(undefined, { enabled: Boolean(auth.data) });
  const utils = trpc.useUtils();

  const [activeMainTab, setActiveMainTab] = useState<"italray_marketing" | "equipment" | "menu" | "parts" | "documents">("equipment");
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

  // Dynamic Menu state
  const menuBrandsQuery = trpc.menu.manageBrands.useQuery(undefined, { enabled: Boolean(auth.data) });
  const menuItemsQuery = trpc.menu.manageItems.useQuery(undefined, { enabled: Boolean(auth.data) });
  useEffect(() => {
    if (!auth.isLoading && !auth.data) window.location.href = "/login";
  }, [auth.isLoading, auth.data]);
  const saveBrandMutation = trpc.menu.saveBrand.useMutation({
    onSuccess: () => {
      setMessage("Brand record saved successfully.");
      utils.menu.manageBrands.invalidate();
      utils.menu.productBrands.invalidate();
    },
    onError: err => setMessage(err.message),
  });
  const saveItemMutation = trpc.menu.saveItem.useMutation({
    onSuccess: () => {
      setMessage("Mega-menu link saved successfully.");
      utils.menu.manageItems.invalidate();
      utils.menu.productItems.invalidate();
    },
    onError: err => setMessage(err.message),
  });
  const deleteItemMutation = trpc.menu.deleteItem.useMutation({
    onSuccess: () => {
      setMessage("Mega-menu link removed.");
      utils.menu.manageItems.invalidate();
      utils.menu.productItems.invalidate();
    },
    onError: err => setMessage(err.message),
  });

  // Spare Parts state
  const spareBrandsQuery = trpc.parts.manageBrands.useQuery(undefined, { enabled: Boolean(auth.data) });
  const [spareBrandFilter, setSpareBrandFilter] = useState<number | undefined>();
  const sparePartsQuery = trpc.parts.manageParts.useQuery({ brandId: spareBrandFilter }, { enabled: Boolean(auth.data) });
  const saveSpareBrandMutation = trpc.parts.saveBrand.useMutation({
    onSuccess: () => {
      setMessage("Spare parts brand saved.");
      utils.parts.manageBrands.invalidate();
      utils.parts.brands.invalidate();
    },
    onError: err => setMessage(err.message),
  });
  const saveSparePartMutation = trpc.parts.savePart.useMutation({
    onSuccess: () => {
      setMessage("Spare part saved successfully.");
      utils.parts.manageParts.invalidate();
      utils.parts.listParts.invalidate();
    },
    onError: err => setMessage(err.message),
  });

  // Document requests state
  const docRequestsQuery = trpc.documents.list.useQuery(undefined, { enabled: Boolean(auth.data) });
  const updateDocMutation = trpc.documents.updateStatus.useMutation({
    onSuccess: () => {
      setMessage("Document request status updated.");
      utils.documents.list.invalidate();
    },
    onError: err => setMessage(err.message),
  });

  const create = trpc.products.create.useMutation({
    onSuccess: () => {
      setMessage("Equipment draft created successfully.");
      resetForm();
      utils.products.list.invalidate();
    },
    onError: error => setMessage(error.message),
  });
  const update = trpc.products.update.useMutation({
    onSuccess: () => {
      setMessage("Equipment details saved.");
      utils.products.list.invalidate();
    },
    onError: error => setMessage(error.message),
  });
  const submitReview = trpc.products.submitReview.useMutation({
    onSuccess: () => { setMessage("Equipment submitted for quality review."); utils.products.list.invalidate(); },
    onError: error => setMessage(error.message),
  });
  const approveProduct = trpc.products.approve.useMutation({
    onSuccess: () => { setMessage("Equipment approved for publication."); utils.products.list.invalidate(); },
    onError: error => setMessage(error.message),
  });
  const publish = trpc.products.publish.useMutation({
    onSuccess: () => {
      setMessage("Equipment published to public catalogue.");
      utils.products.list.invalidate();
      utils.products.published.invalidate();
    },
    onError: error => setMessage(error.message),
  });
  const archive = trpc.products.archive.useMutation({
    onSuccess: () => {
      setMessage("Equipment moved to archive.");
      utils.products.list.invalidate();
      utils.products.published.invalidate();
    },
    onError: error => setMessage(error.message),
  });
  const restore = trpc.products.restore.useMutation({
    onSuccess: () => {
      setMessage("Equipment restored as draft.");
      utils.products.list.invalidate();
    },
    onError: error => setMessage(error.message),
  });
  const remove = trpc.products.delete.useMutation({
    onSuccess: () => {
      setMessage("Equipment deleted permanently.");
      utils.products.list.invalidate();
    },
    onError: error => setMessage(error.message),
  });
  const toggleVisibility = trpc.products.toggleVisibility.useMutation({
    onSuccess: () => {
      setMessage("Display status updated.");
      utils.products.list.invalidate();
      utils.products.published.invalidate();
    },
    onError: error => setMessage(error.message),
  });
  const upload = trpc.products.uploadMedia.useMutation({
    onSuccess: result => {
      setDraft(current => ({ ...current, [mediaField]: result.url }));
      setMessage("Media uploaded into the current draft. Save the product to keep it.");
    },
    onError: error => setMessage(error.message),
  });

  const user = auth.data;
  const isOwner = user?.role === "owner";
  const permissions = new Set(permissionsQuery.data ?? []);
  const canView = isOwner || permissions.has("products.view");
  const canCreate = isOwner || permissions.has("products.create");
  const canEdit = isOwner || permissions.has("products.edit");
  const canPublish = isOwner || permissions.has("products.publish");
  const canArchive = isOwner || permissions.has("products.archive");
  const canDelete = isOwner || permissions.has("products.delete");
  const canMedia = isOwner || permissions.has("products.media");
  const canQuality = isOwner || permissions.has("products.quality");

  const rows = useMemo(() => {
    return (products.data ?? []).map(row => ({
      ...row,
      parsed: parseDraft(row.draftData),
    }));
  }, [products.data]);

  const filteredRows = useMemo(() => {
    return rows.filter(item => {
      const matchCat = categoryFilter === "All categories" || item.parsed.category === categoryFilter;
      const matchAvail = availabilityFilter === "all" || item.parsed.availabilityStatus === availabilityFilter;
      const matchSearch =
        !search.trim() ||
        item.parsed.name.toLowerCase().includes(search.toLowerCase()) ||
        item.parsed.code.toLowerCase().includes(search.toLowerCase()) ||
        item.parsed.brand.toLowerCase().includes(search.toLowerCase()) ||
        item.parsed.category.toLowerCase().includes(search.toLowerCase()) ||
        item.slug.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchAvail && matchSearch;
    });
  }, [rows, categoryFilter, availabilityFilter, search]);

  function resetForm() {
    setEditingId(undefined);
    setSlug("");
    setProductType("medical_device");
    setDraft({
      ...emptyDraft,
      technicalSpecifications: { ...emptyDraft.technicalSpecifications },
      features: [""],
      applications: [""],
    });
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
      technicalSpecifications: {
        generatorPower: "5 kW - 15 kW high frequency",
        tubeVoltage: "40 - 120 kV",
        tubeCurrent: "up to 100 mA",
        detectorType: "Flat Panel Detector (FPD) or I.I.",
        dimensions: "Compact mobile footprint",
        warranty: "Comprehensive warranty available",
      },
    });
    setDraftVisible(true);
    setDisplayOrder((products.data?.length ?? 0) + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveProduct() {
    const data = {
      ...draft,
      features: linesToArray(draft.features),
      applications: linesToArray(draft.applications),
    };
    if (editingId) update.mutate({ id: editingId, slug, productType, data, draftVisible, displayOrder });
    else create.mutate({ slug, productType, data, draftVisible, displayOrder });
  }

  function updateField<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  function updateLine(key: "features" | "applications", index: number, value: string) {
    setDraft(current => ({
      ...current,
      [key]: current[key].map((line, lineIndex) => (lineIndex === index ? value : line)),
    }));
  }

  function uploadFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      if (editingId) {
        upload.mutate({
          id: editingId,
          field: mediaField,
          fileName: file.name,
          contentType: file.type as any,
          dataUrl,
        });
      } else {
        setDraft(current => ({ ...current, [mediaField]: dataUrl }));
        setMessage("File staged locally. Save the product to persist it to cloud storage.");
      }
    };
    reader.readAsDataURL(file);
  }

  if (auth.isLoading) return <div className="p-8 text-center text-sm">Checking access…</div>;
  if (!user) return <div className="p-8 text-center text-sm">Sign in required.</div>;
  if (!isOwner && !canView) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="mt-4 text-xl font-bold">Catalogue management permission required</h2>
        <p className="mt-2 text-sm text-slate-500">The Owner has not granted this account access to manage equipment or parts.</p>
        <Button variant="outline" asChild><Link href="/owner" className="mt-6 inline-block">Back to dashboard</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7fafc] text-[#17212b]">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/owner" className="inline-flex items-center text-sm text-slate-500 hover:text-[#0f6fae]">
              <ArrowLeft className="mr-1 h-4 w-4" /> Dashboard
            </Link>
            <span className="text-slate-300">/</span>
            <h1 className="text-lg font-bold text-[#0a4052]">Products, Parts & Navigation Workspace</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="text-xs" asChild><Link href="/catalogue">
                View Public Catalogue <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link></Button>
            <Button size="sm" variant="outline" className="text-xs" asChild><Link href="/spare-parts">
                View Spare Parts Page <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {message ? (
          <Alert className="border-[#bcdde2] bg-[#eaf4fa] text-[#0a4052]">
            <AlertDescription className="font-semibold">{message}</AlertDescription>
          </Alert>
        ) : null}

        {/* Workspace Top Tabs */}
        <div className="flex flex-wrap gap-2 rounded-2xl border border-[#dce7eb] bg-white p-2 shadow-sm">
          <button
            onClick={() => setActiveMainTab("italray_marketing")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeMainTab === "italray_marketing" ? "bg-[#0a4052] text-white shadow" : "text-[#475569] hover:bg-[#f1f5f9]"
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-400" /> Italray Marketing Studio
          </button>
          <button
            onClick={() => setActiveMainTab("equipment")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeMainTab === "equipment" ? "bg-[#0a4052] text-white shadow" : "text-[#475569] hover:bg-[#f1f5f9]"
            }`}
          >
            <Layers className="h-4 w-4" /> Medical Imaging Equipment ({rows.length})
          </button>
          <button
            onClick={() => setActiveMainTab("menu")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeMainTab === "menu" ? "bg-[#0a4052] text-white shadow" : "text-[#475569] hover:bg-[#f1f5f9]"
            }`}
          >
            <FolderTree className="h-4 w-4" /> Mega-Menu Navigation Links
          </button>
          <button
            onClick={() => setActiveMainTab("parts")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeMainTab === "parts" ? "bg-[#0a4052] text-white shadow" : "text-[#475569] hover:bg-[#f1f5f9]"
            }`}
          >
            <Boxes className="h-4 w-4" /> Spare Parts & Manufacturers
          </button>
          <button
            onClick={() => setActiveMainTab("documents")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
              activeMainTab === "documents" ? "bg-[#0a4052] text-white shadow" : "text-[#475569] hover:bg-[#f1f5f9]"
            }`}
          >
            <FileText className="h-4 w-4" /> Document Inquiries ({docRequestsQuery.data?.length ?? 0})
          </button>
        </div>

        {/* TAB 1: Equipment Management */}
        {activeMainTab === "italray_marketing" ? (
          <MarketingItalrayWorkspace />
        ) : null}

        {activeMainTab === "equipment" ? (
          <>
            <Card className="border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-xl text-[#0a4052]">Medical Imaging Equipment Portfolio</CardTitle>
                    <CardDescription>
                      Review, manage, filter, and publish C-Arm, Mobile X-Ray, and Fixed DR systems. Marketing users can add or modify records; all actions are tracked in the Owner audit log.
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => quickAddDevice("Italray Clinodigit Mobile C-Arm", "C-Arm", "available")}
                      disabled={!canCreate}
                      className="bg-[#0f6fae] text-xs font-semibold hover:bg-[#0a5282]"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" /> Add C-Arm Device
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => quickAddDevice("Italray Compact Digital Mobile X-Ray", "Mobile X-Ray", "available")}
                      disabled={!canCreate}
                      className="bg-[#0a4052] text-xs font-semibold hover:bg-[#07303e]"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" /> Add Mobile X-Ray
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search C-Arm, X-Ray, model, brand…"
                      className="pl-9 text-xs"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-500" />
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-44 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                      <SelectTrigger className="w-40 text-xs"><SelectValue /></SelectTrigger>
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
                        <th className="px-4 py-3.5">Stock Status</th>
                        <th className="px-4 py-3.5">Catalogue</th>
                        <th className="px-4 py-3.5">Visibility</th>
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
                                {item.parsed.mainImage ? (
                                  <img src={item.parsed.mainImage} alt="" className="h-10 w-12 rounded-md border object-cover" />
                                ) : (
                                  <div className="flex h-10 w-12 items-center justify-center rounded-md bg-slate-100 text-xs text-slate-400">
                                    X-Ray
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-[#0a4052]">{item.parsed.name || item.slug}</p>
                                  <p className="font-mono text-xs text-slate-500">
                                    {item.parsed.code || item.slug} {item.parsed.modelNumber ? `· Model: ${item.parsed.modelNumber}` : ""}
                                  </p>
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
                              {avail === "available" ? (
                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                  <CheckCircle2 className="mr-1 h-3 w-3" /> Available
                                </Badge>
                              ) : avail === "on_request" ? (
                                <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-800">
                                  On request
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-cyan-300 bg-cyan-50 text-cyan-800">
                                  Coming soon
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              <Badge
                                variant={item.workflowStatus === "published" ? "secondary" : "outline"}
                                className={item.workflowStatus === "published" ? "bg-[#eaf4fa] text-[#0f6fae]" : ""}
                              >
                                {labels[item.workflowStatus]}
                              </Badge>
                            </td>
                            <td className="px-4 py-3.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 gap-1 text-xs"
                                disabled={!canEdit || toggleVisibility.isPending}
                                onClick={() => toggleVisibility.mutate({ id: item.id, publishedVisible: !item.publishedVisible })}
                              >
                                {isVisible ? (
                                  <>
                                    <Eye className="h-3.5 w-3.5 text-emerald-600" /> Showing
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="h-3.5 w-3.5 text-slate-400" /> Hidden
                                  </>
                                )}
                              </Button>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs" disabled={!canEdit} onClick={() => editProduct(item)}>
                                  <Pencil className="mr-1 h-3 w-3" /> Edit
                                </Button>
                                {item.workflowStatus === "draft" ? (
                                  <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs text-[#0f6fae] hover:bg-[#eaf4fa]" disabled={!canEdit || submitReview.isPending} onClick={() => submitReview.mutate({ id: item.id })}>
                                    <Send className="mr-1 h-3 w-3" /> Submit review
                                  </Button>
                                ) : item.workflowStatus === "pending_review" ? (
                                  <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs text-emerald-700" disabled={!canQuality || approveProduct.isPending} onClick={() => approveProduct.mutate({ id: item.id })}>
                                    <ShieldCheck className="mr-1 h-3 w-3" /> Approve
                                  </Button>
                                ) : item.workflowStatus === "approved" ? (
                                  <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs text-[#0f6fae] hover:bg-[#eaf4fa]" disabled={!canPublish || publish.isPending} onClick={() => publish.mutate({ id: item.id })}>
                                    <Send className="mr-1 h-3 w-3" /> Publish
                                  </Button>
                                ) : item.workflowStatus === "published" ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-2.5 text-xs"
                                    disabled={!canArchive}
                                    onClick={() => archive.mutate({ id: item.id })}
                                  >
                                    <Archive className="mr-1 h-3 w-3" /> Archive
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="outline" className="h-8 px-2.5 text-xs" disabled={!canEdit} onClick={() => restore.mutate({ id: item.id })}>
                                    <RotateCcw className="mr-1 h-3 w-3" /> Restore
                                  </Button>
                                )}
                                {canDelete ? (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-2 text-red-600 hover:text-red-700"
                                    onClick={() => window.confirm("Permanently delete this equipment?") && remove.mutate({ id: item.id })}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Editor Form */}
            <Card className="border-slate-200">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>{editingId ? `Edit device: ${draft.name || slug}` : "Add or modify equipment details"}</CardTitle>
                    <CardDescription>
                      Full technical specifications, generator voltage, availability, and brochure uploads.
                    </CardDescription>
                  </div>
                  {editingId ? (
                    <Button variant="outline" onClick={resetForm}>
                      <Plus className="mr-2 h-4 w-4" /> New equipment draft
                    </Button>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Device Name *</Label>
                    <Input
                      value={draft.name}
                      onChange={e => {
                        updateField("name", e.target.value);
                        if (!editingId && !slug) {
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                        }
                      }}
                      placeholder="e.g. Italray Clinodigit Mobile C-Arm"
                      required
                    />
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

                <div className="rounded-2xl border border-[#bcdde2] bg-[#eff9fb] p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#0f6fae]">Commerce source</p>
                      <p className="mt-1 text-sm font-semibold text-[#0a4052]">The Internal Catalog controls the public product page. Shopify is optional for price, inventory and checkout.</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">For large medical systems, keep <strong>Request a Quote</strong> as the default. Use Shopify only for products with a fixed price and stock.</p>
                    </div>
                    <a href="https://admin.shopify.com/store/spmplatform-nlyjrwcw-apollo-timber-tn2hbuky" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#0f6fae] bg-white px-3 py-2 text-xs font-bold text-[#0f6fae] hover:bg-[#eaf4fa]">
                      Open Shopify Admin <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
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
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={draftVisible} onChange={e => setDraftVisible(e.target.checked)} className="h-4 w-4 accent-cyan-600" />
                    <span className="font-medium text-[#0a4052]">Display in public catalogue when published</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={draft.requestQuote} onChange={e => updateField("requestQuote", e.target.checked)} className="h-4 w-4 accent-cyan-600" />
                    <span className="text-slate-700">Enable "Request a Quote" button</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
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
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Commercial model</Label>
                          <Select value={draft.commerceMode} onValueChange={value => updateField("commerceMode", value as ProductDraft["commerceMode"])}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quote_only">Request a Quote only</SelectItem>
                              <SelectItem value="checkout">Shopify checkout</SelectItem>
                              <SelectItem value="both">Quote + Shopify checkout</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Shopify Product ID <span className="font-normal text-slate-400">(optional)</span></Label>
                          <Input value={draft.shopifyProductId} onChange={e => updateField("shopifyProductId", e.target.value)} placeholder="gid://shopify/Product/..." />
                        </div>
                        <div className="space-y-2">
                          <Label>Shopify handle <span className="font-normal text-slate-400">(optional)</span></Label>
                          <Input value={draft.shopifyHandle} onChange={e => updateField("shopifyHandle", e.target.value)} placeholder="product-handle" />
                        </div>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-500">Do not duplicate a product in Shopify from this form. Create or edit the Shopify record in Shopify Admin, then paste its ID or handle here to connect the two sources.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="description" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Short description (shown on cards and list)</Label>
                      <Textarea rows={3} value={draft.shortDescription} onChange={e => updateField("shortDescription", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Full description (detailed device specifications)</Label>
                      <Textarea rows={5} value={draft.fullDescription} onChange={e => updateField("fullDescription", e.target.value)} />
                    </div>
                  </TabsContent>

                  <TabsContent value="technical" className="space-y-4 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {specs.map(([key, label]) => (
                        <div key={key} className="space-y-2">
                          <Label>{label}</Label>
                          <Input
                            value={draft.technicalSpecifications[key] ?? ""}
                            onChange={e =>
                              setDraft(current => ({
                                ...current,
                                technicalSpecifications: { ...current.technicalSpecifications, [key]: e.target.value },
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-5 pt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Main Image URL</Label>
                        <Input value={draft.mainImage} onChange={e => updateField("mainImage", e.target.value)} />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2 text-xs"
                          disabled={!canMedia}
                          onClick={() => {
                            setMediaField("mainImage");
                            fileInput.current?.click();
                          }}
                        >
                          <ImagePlus className="mr-2 h-4 w-4" /> Upload main equipment image
                        </Button>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Additional gallery image URLs</Label>
                        <p className="text-xs leading-5 text-slate-500">Add clean product views, room shots, or technical close-ups. The first image is used as the PDP hero.</p>
                        <div className="space-y-2">
                          {draft.additionalImages.map((url, index) => (
                            <div key={`${url}-${index}`} className="flex gap-2">
                              <Input value={url} onChange={e => updateField("additionalImages", draft.additionalImages.map((item, itemIndex) => itemIndex === index ? e.target.value : item))} placeholder="https://…" />
                              <Button type="button" variant="ghost" size="icon" aria-label={`Remove gallery image ${index + 1}`} onClick={() => updateField("additionalImages", draft.additionalImages.filter((_, itemIndex) => itemIndex !== index))}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                            </div>
                          ))}
                          <Button type="button" variant="outline" className="text-xs" onClick={() => updateField("additionalImages", [...draft.additionalImages, ""])}><Plus className="mr-2 h-4 w-4" />Add gallery image</Button>
                        </div>
                        {draft.mainImage || draft.additionalImages.some(Boolean) ? <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">{[draft.mainImage, ...draft.additionalImages].filter(Boolean).map((url, index) => <div key={`${url}-preview-${index}`} className="overflow-hidden border border-slate-200 bg-slate-50"><img src={url} alt={`Gallery preview ${index + 1}`} loading="lazy" className="aspect-[4/3] h-full w-full object-contain p-2" /></div>)}</div> : null}
                      </div>
                      <div className="space-y-2">
                        <Label>Brochure PDF URL</Label>
                        <Input value={draft.brochureUrl} onChange={e => updateField("brochureUrl", e.target.value)} />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2 text-xs"
                          disabled={!canMedia}
                          onClick={() => {
                            setMediaField("brochureUrl");
                            fileInput.current?.click();
                          }}
                        >
                          <FileUp className="mr-2 h-4 w-4" /> Upload PDF brochure
                        </Button>
                      </div>
                    </div>
                    <input
                      ref={fileInput}
                      type="file"
                      className="hidden"
                      accept={mediaField === "mainImage" ? "image/jpeg,image/png,image/webp" : "application/pdf"}
                      onChange={e => uploadFile(e.target.files?.[0])}
                    />
                  </TabsContent>
                </Tabs>

                <div className="flex flex-wrap items-center gap-3 border-t pt-5">
                  <Button
                    onClick={saveProduct}
                    disabled={create.isPending || update.isPending || !slug || !draft.name || (editingId ? !canEdit : !canCreate)}
                    className="bg-[#0a4052] text-white hover:bg-[#063545]"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {create.isPending || update.isPending ? "Saving…" : editingId ? "Save equipment changes" : "Create equipment draft"}
                  </Button>
                  {editingId ? (
                    <>
                      <Button
                        variant="outline"
                        className="border-[#0f6fae] text-[#0f6fae] hover:bg-[#eaf4fa]"
                        disabled={!canPublish || publish.isPending}
                        onClick={() => publish.mutate({ id: editingId })}
                      >
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
          </>
        ) : null}

        {/* TAB 2: Mega Menu Navigation Management */}
        {activeMainTab === "menu" ? (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl text-[#0a4052]">Products Mega-Menu Architecture</CardTitle>
              <CardDescription>
                Control the brand categories and links displayed under the "Products" dropdown menu in the header.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {menuBrandsQuery.data?.map(brand => {
                  const brandItems = menuItemsQuery.data?.filter(item => item.brandId === brand.id) ?? [];
                  return (
                    <div key={brand.id} className="rounded-2xl border border-[#dce7eb] bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between border-b pb-3">
                        <div>
                          <h4 className="text-base font-bold text-[#0a4052]">{brand.name}</h4>
                          <p className="text-xs text-slate-500">{brand.authorizedAgentLabel || "Medical Imaging Partner"}</p>
                        </div>
                        <Badge variant="outline" className="text-xs font-mono">{brand.slug}</Badge>
                      </div>

                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation Links</p>
                        {brandItems.map(item => (
                          <div key={item.id} className="flex items-center justify-between rounded-xl border bg-slate-50 p-2 text-xs">
                            <div className="flex items-center gap-2">
                              {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-6 w-6 rounded object-cover" /> : null}
                              <span className="font-semibold text-slate-800">{item.label}</span>
                              <span className="font-mono text-[10px] text-slate-400">({item.href})</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={() => deleteItemMutation.mutate({ id: item.id })}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs font-semibold text-[#0f6fae]"
                          onClick={() => {
                            const label = prompt("Menu item label:");
                            const href = prompt("Target URL / href (e.g. /catalogue?category=c-arm):");
                            if (label && href) {
                              saveItemMutation.mutate({
                                brandId: brand.id,
                                label,
                                href,
                                itemType: "category",
                                displayOrder: brandItems.length + 1,
                              });
                            }
                          }}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Add Link under {brand.name}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* TAB 3: Spare Parts & Manufacturers Management */}
        {activeMainTab === "parts" ? (
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-[#0a4052]">Spare Parts & Component Sourcing</CardTitle>
                  <CardDescription>
                    Add and manage genuine replacement parts for GE, Siemens, Ziehm, and Philips equipment.
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="bg-[#0a4052] text-xs font-bold text-white hover:bg-[#07303e]"
                  onClick={() => {
                    const name = prompt("Part Name:");
                    const partNumber = prompt("Part Number (e.g. GE-HV-9900):");
                    const brandSlug = prompt("Brand slug (ge-healthcare / siemens-healthineers / ziehm-imaging / philips-healthcare):") || "ge-healthcare";
                    const brand = spareBrandsQuery.data?.find(b => b.slug === brandSlug);
                    if (name && brand) {
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                      saveSparePartMutation.mutate({
                        brandId: brand.id,
                        slug,
                        name,
                        partNumber: partNumber || undefined,
                        equipmentCategory: "Medical Imaging",
                        availabilityStatus: "available",
                      });
                    }
                  }}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add New Spare Part
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-left text-xs">
                  <thead className="border-b bg-slate-50 font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Part Name</th>
                      <th className="p-3">Part #</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Availability</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sparePartsQuery.data?.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-[#0a4052]">{p.name}</td>
                        <td className="p-3 font-mono">{p.partNumber || "—"}</td>
                        <td className="p-3">{p.equipmentCategory || "Imaging Component"}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-[10px]">{p.availabilityStatus}</Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Button size="sm" variant="ghost" className="h-6 text-xs text-red-600">Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* TAB 4: Document Requests Management */}
        {activeMainTab === "documents" ? (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl text-[#0a4052]">Controlled Technical File Requests</CardTitle>
              <CardDescription>
                Customer and hospital requests for brochures, datasheets, CE dossiers, and technical manuals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-left text-xs">
                  <thead className="border-b bg-slate-50 font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Tracking ID</th>
                      <th className="p-3">Requested File</th>
                      <th className="p-3">Requester & Facility</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {docRequestsQuery.data?.map(req => (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-[#0f6fae]">{req.publicNumber}</td>
                        <td className="p-3">
                          <p className="font-semibold text-[#0a4052]">{req.documentName}</p>
                          <span className="text-[10px] text-slate-400">Type: {req.documentType}</span>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-slate-800">{req.requesterName}</p>
                          <p className="text-[10px] text-slate-500">{req.requesterEmail} {req.requesterOrganization ? `· ${req.requesterOrganization}` : ""}</p>
                        </td>
                        <td className="p-3">
                          <Badge
                            className={
                              req.status === "approved" || req.status === "sent"
                                ? "bg-emerald-600 text-white"
                                : req.status === "rejected"
                                ? "bg-red-600 text-white"
                                : "bg-amber-100 text-amber-900"
                            }
                          >
                            {req.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {req.status === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                className="h-7 bg-emerald-600 px-2 text-[10px] text-white hover:bg-emerald-700"
                                onClick={() => updateDocMutation.mutate({ id: req.id, status: "approved" })}
                              >
                                Approve & Dispatch
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[10px] text-red-600 hover:bg-red-50"
                                onClick={() => updateDocMutation.mutate({ id: req.id, status: "rejected" })}
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <div className="inline-flex flex-col items-end gap-1">
                              <span className="text-[11px] font-semibold text-emerald-700">Approved & Ready</span>
                              {(req as any).downloadTokenHash ? (
                                <span className="font-mono text-[9px] text-slate-500">
                                  Expires: {(req as any).downloadExpiresAt ? new Date((req as any).downloadExpiresAt).toLocaleDateString() : "7 days"}
                                </span>
                              ) : null}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {docRequestsQuery.data?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-sm text-slate-500">
                          No document requests received yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
