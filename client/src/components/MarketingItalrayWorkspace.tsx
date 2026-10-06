import { useState, useMemo, useRef } from "react";
import { Link } from "wouter";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Eye,
  FileDown,
  FileUp,
  Image as ImageIcon,
  ImagePlus,
  Layers,
  LayoutTemplate,
  Loader2,
  Maximize2,
  Move,
  MoveVertical,
  Plus,
  RotateCcw,
  Save,
  Search,
  Send,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ITALRAY_CATALOG_REGISTRY, type ItalrayProductMeta } from "@shared/commerce/italrayMeta";

const POSITION_PRESETS = [
  { label: "Top Left", value: "top left" },
  { label: "Top Center", value: "top center" },
  { label: "Top Right", value: "top right" },
  { label: "Center Left", value: "center left" },
  { label: "Center Center", value: "center center" },
  { label: "Center Right", value: "center right" },
  { label: "Bottom Left", value: "bottom left" },
  { label: "Bottom Center", value: "bottom center" },
  { label: "Bottom Right", value: "bottom right" },
];

export default function MarketingItalrayWorkspace() {
  const [selectedHandle, setSelectedHandle] = useState<string>("italray-carmex-fp21-fp30");
  const [previewTab, setPreviewTab] = useState<"edit" | "preview">("edit");
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load registered products
  const registeredHandles = useMemo(() => {
    return Object.keys(ITALRAY_CATALOG_REGISTRY).map((handle) => ({
      handle,
      title: ITALRAY_CATALOG_REGISTRY[handle].title,
      badge: ITALRAY_CATALOG_REGISTRY[handle].badge,
    }));
  }, []);

  // TRPC queries
  const overridesQuery = trpc.products.listItalrayPresentations.useQuery(undefined, {
    staleTime: 10 * 1000,
  });
  const saveMutation = trpc.products.saveItalrayPresentation.useMutation({
    onSuccess: () => {
      overridesQuery.refetch();
      alert("Changes published directly to the live Italray product experience!");
    },
  });
  const uploadMutation = trpc.products.uploadItalrayMedia.useMutation();

  // Find active override or static meta
  const currentStaticMeta: ItalrayProductMeta =
    ITALRAY_CATALOG_REGISTRY[selectedHandle] || ITALRAY_CATALOG_REGISTRY["italray-carmex-fp21-fp30"];

  const currentOverride = useMemo(() => {
    return overridesQuery.data?.find((o) => o.handle === selectedHandle);
  }, [overridesQuery.data, selectedHandle]);

  // Working state for the form
  const [form, setForm] = useState({
    title: "",
    badge: "",
    headline: "",
    subheadline: "",
    leadParagraph: "",
    secondaryParagraph: "",
    heroImage: "",
    heroObjectPosition: "center center",
    heroScalePercent: 100,
    descriptionImage: "",
    descriptionObjectPosition: "center center",
    brochureUrl: "",
    brochureTitle: "",
    commercialModel: "quote_only" as "quote_only" | "checkout" | "both",
    highlights: [] as string[],
    clinicalGallery: [] as Array<{ title: string; category: string; image: string; description: string }>,
  });

  // Sync working state when selectedHandle or override changes
  useMemo(() => {
    const o = currentOverride;
    const s = currentStaticMeta;
    let hl: string[] = s.highlights;
    let cg = s.clinicalGallery;
    if (o?.highlightsJson) {
      try {
        hl = JSON.parse(o.highlightsJson);
      } catch {}
    }
    if (o?.clinicalGalleryJson) {
      try {
        cg = JSON.parse(o.clinicalGalleryJson);
      } catch {}
    }

    setForm({
      title: o?.title || s.title,
      badge: o?.badge || s.badge,
      headline: o?.headline || s.headline,
      subheadline: o?.subheadline || s.subheadline,
      leadParagraph: o?.leadParagraph || s.leadParagraph,
      secondaryParagraph: o?.secondaryParagraph || s.secondaryParagraph,
      heroImage: o?.heroImage || s.heroImage,
      heroObjectPosition: o?.heroObjectPosition || "center center",
      heroScalePercent: o?.heroScalePercent ?? 100,
      descriptionImage: o?.descriptionImage || s.descriptionImage,
      descriptionObjectPosition: o?.descriptionObjectPosition || "center center",
      brochureUrl: o?.brochureUrl || s.brochureUrl,
      brochureTitle: o?.brochureTitle || s.brochureTitle,
      commercialModel: (o?.commercialModel as any) || "quote_only",
      highlights: hl,
      clinicalGallery: cg,
    });
  }, [currentOverride, currentStaticMeta]);

  const handleFileUpload = async (file: File) => {
    if (!uploadingField) return;
    const maxBytes = 15 * 1024 * 1024;
    const allowedTypes = uploadingField === "brochureUrl"
      ? ["application/pdf"]
      : ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert(`Unsupported file type. Please choose ${uploadingField === "brochureUrl" ? "a PDF" : "a JPG, PNG, or WebP image"}.`);
      setUploadingField(null);
      return;
    }
    if (file.size > maxBytes) {
      alert("The selected file is too large. Please choose a file smaller than 15 MB.");
      setUploadingField(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const res = await uploadMutation.mutateAsync({
          handle: selectedHandle,
          fileName: file.name,
          contentType: file.type as any,
          dataUrl,
        });
        if (uploadingField === "heroImage") {
          setForm((prev) => ({ ...prev, heroImage: res.url }));
        } else if (uploadingField === "descriptionImage") {
          setForm((prev) => ({ ...prev, descriptionImage: res.url }));
        } else if (uploadingField === "brochureUrl") {
          setForm((prev) => ({ ...prev, brochureUrl: res.url }));
        }
      } catch (err: any) {
        alert("Upload error: " + (err.message || "Failed to upload"));
      } finally {
        setUploadingField(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveMutation.mutate({
      handle: selectedHandle,
      title: form.title,
      badge: form.badge,
      headline: form.headline,
      subheadline: form.subheadline,
      leadParagraph: form.leadParagraph,
      secondaryParagraph: form.secondaryParagraph,
      heroImage: form.heroImage,
      heroObjectPosition: form.heroObjectPosition,
      heroScalePercent: form.heroScalePercent,
      descriptionImage: form.descriptionImage,
      descriptionObjectPosition: form.descriptionObjectPosition,
      brochureUrl: form.brochureUrl,
      brochureTitle: form.brochureTitle,
      commercialModel: form.commercialModel,
      highlightsJson: JSON.stringify(form.highlights),
      clinicalGalleryJson: JSON.stringify(form.clinicalGallery),
      displayOrder: currentOverride?.displayOrder ?? 0,
      isVisible: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-[#dce7eb] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#eaf4fa] px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0a4052]">
                Marketing Hub
              </span>
              <span className="text-xs font-semibold text-slate-500">• Direct Publishing (Option B)</span>
            </div>
            <h2 className="mt-2 text-2xl font-black text-[#0a4052]">
              Italray Visual & Marketing Experience Controller
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Full control over hero positioning, scale, images, commercial CTA, clinical carousel, and marketing copy for all Italray medical systems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/store/products/${selectedHandle}`} target="_blank">
              <Button variant="outline" size="sm" className="gap-2 border-[#0a4052] text-[#0a4052]">
                <ExternalLink className="h-4 w-4" /> View Live Page
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="gap-2 bg-[#0a4052] font-bold text-white hover:bg-[#072c38]"
            >
              {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Publish Directly
            </Button>
          </div>
        </div>

        {/* Device Selector Pill Bar */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto border-t pt-4">
          <span className="text-xs font-bold uppercase text-slate-400">Select Equipment:</span>
          {registeredHandles.map((dev) => (
            <button
              key={dev.handle}
              onClick={() => setSelectedHandle(dev.handle)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                selectedHandle === dev.handle
                  ? "bg-[#0a4052] text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {dev.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <Tabs defaultValue="hero">
            <TabsList className="grid h-auto w-full grid-cols-4 gap-1">
              <TabsTrigger value="hero" className="text-xs">
                Hero & Positioning
              </TabsTrigger>
              <TabsTrigger value="editorial" className="text-xs">
                Headlines & Copy
              </TabsTrigger>
              <TabsTrigger value="carousel" className="text-xs">
                Clinical Carousel
              </TabsTrigger>
              <TabsTrigger value="transaction" className="text-xs">
                Commercial & Specs
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Hero Image, Positioning & Scale */}
            <TabsContent value="hero" className="mt-4 space-y-5">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base text-[#0a4052]">Hero Image & Positioning Controls</CardTitle>
                  <CardDescription>
                    Adjust image focus, focal alignment (left/center/right, top/center/bottom), and scale percentage.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Hero Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={form.heroImage}
                        onChange={(e) => setForm((prev) => ({ ...prev, heroImage: e.target.value }))}
                        placeholder="https://..."
                        className="text-xs font-mono"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadingField("heroImage");
                          fileInputRef.current?.click();
                        }}
                      >
                        <ImagePlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Object Position Alignment</Label>
                      <Select
                        value={form.heroObjectPosition}
                        onValueChange={(val) => setForm((prev) => ({ ...prev, heroObjectPosition: val }))}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITION_PRESETS.map((p) => (
                            <SelectItem key={p.value} value={p.value} className="text-xs">
                              {p.label} ({p.value})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Image Scale: {form.heroScalePercent}%</Label>
                      <input
                        type="range"
                        min={70}
                        max={160}
                        step={5}
                        value={form.heroScalePercent}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, heroScalePercent: parseInt(e.target.value, 10) }))
                        }
                        className="w-full accent-[#0a4052]"
                      />
                    </div>
                  </div>

                  {/* Secondary Description Image */}
                  <div className="border-t pt-4 space-y-3">
                    <Label className="text-xs font-bold">Secondary Architecture Detail Image</Label>
                    <div className="flex gap-2">
                      <Input
                        value={form.descriptionImage}
                        onChange={(e) => setForm((prev) => ({ ...prev, descriptionImage: e.target.value }))}
                        placeholder="https://..."
                        className="text-xs font-mono"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadingField("descriptionImage");
                          fileInputRef.current?.click();
                        }}
                      >
                        <ImagePlus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Secondary Position</Label>
                      <Select
                        value={form.descriptionObjectPosition}
                        onValueChange={(val) => setForm((prev) => ({ ...prev, descriptionObjectPosition: val }))}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITION_PRESETS.map((p) => (
                            <SelectItem key={p.value} value={p.value} className="text-xs">
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: Headlines, Badge, Paragraphs & Highlights */}
            <TabsContent value="editorial" className="mt-4 space-y-5">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base text-[#0a4052]">Titles, Copy & Bullet Highlights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Product Display Title</Label>
                      <Input
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold">Category Badge</Label>
                      <Input
                        value={form.badge}
                        onChange={(e) => setForm((prev) => ({ ...prev, badge: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Hero Headline</Label>
                    <Input
                      value={form.headline}
                      onChange={(e) => setForm((prev) => ({ ...prev, headline: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Secondary Subheadline</Label>
                    <Input
                      value={form.subheadline}
                      onChange={(e) => setForm((prev) => ({ ...prev, subheadline: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Lead Paragraph (Hero Description)</Label>
                    <Textarea
                      rows={3}
                      value={form.leadParagraph}
                      onChange={(e) => setForm((prev) => ({ ...prev, leadParagraph: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Secondary Paragraph (SPM Agency & Warranty)</Label>
                    <Textarea
                      rows={3}
                      value={form.secondaryParagraph}
                      onChange={(e) => setForm((prev) => ({ ...prev, secondaryParagraph: e.target.value }))}
                    />
                  </div>

                  {/* Highlights List */}
                  <div className="space-y-2 border-t pt-4">
                    <Label className="text-xs font-bold">Key Specification Bullets (Highlights Ribbon)</Label>
                    {form.highlights.map((h, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={h}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm((prev) => ({
                              ...prev,
                              highlights: prev.highlights.map((item, i) => (i === idx ? val : item)),
                            }));
                          }}
                          className="text-xs"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              highlights: prev.highlights.filter((_, i) => i !== idx),
                            }));
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          highlights: [...prev.highlights, "New Specification Highlight"],
                        }))
                      }
                      className="text-xs"
                    >
                      <Plus className="mr-1 h-3.5 w-3.5" /> Add Highlight Bullet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 3: Clinical Gallery Carousel Management */}
            <TabsContent value="carousel" className="mt-4 space-y-5">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base text-[#0a4052]">
                    Ziehm-Style Clinical Imaging Carousel Items
                  </CardTitle>
                  <CardDescription>
                    Add clinical fluoroscopy scans, spine/ortho cases, titles, and clinical descriptions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {form.clinicalGallery.map((item, idx) => (
                    <div key={idx} className="rounded-xl border bg-slate-50 p-4 space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-xs font-bold text-[#0a4052]">Clinical Case #{idx + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-red-600 hover:text-red-700"
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              clinicalGallery: prev.clinicalGallery.filter((_, i) => i !== idx),
                            }));
                          }}
                        >
                          <Trash2 className="mr-1 h-3 w-3" /> Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[11px]">Procedure Title</Label>
                          <Input
                            value={item.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setForm((prev) => ({
                                ...prev,
                                clinicalGallery: prev.clinicalGallery.map((c, i) =>
                                  i === idx ? { ...c, title: val } : c
                                ),
                              }));
                            }}
                            className="text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px]">Specialty Category</Label>
                          <Input
                            value={item.category}
                            onChange={(e) => {
                              const val = e.target.value;
                              setForm((prev) => ({
                                ...prev,
                                clinicalGallery: prev.clinicalGallery.map((c, i) =>
                                  i === idx ? { ...c, category: val } : c
                                ),
                              }));
                            }}
                            className="text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px]">Clinical Scan Image URL</Label>
                        <Input
                          value={item.image}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm((prev) => ({
                              ...prev,
                              clinicalGallery: prev.clinicalGallery.map((c, i) =>
                                i === idx ? { ...c, image: val } : c
                              ),
                            }));
                          }}
                          className="text-xs font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px]">Clinical Observation / Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setForm((prev) => ({
                              ...prev,
                              clinicalGallery: prev.clinicalGallery.map((c, i) =>
                                i === idx ? { ...c, description: val } : c
                              ),
                            }));
                          }}
                          className="text-xs"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        clinicalGallery: [
                          ...prev.clinicalGallery,
                          {
                            title: "Diagnostic Contrast Fluoroscopy",
                            category: "Interventional Surgery",
                            image: "https://cdn.shopify.com/s/files/1/1002/9672/0673/files/ZQUPAJOOFlsXsxEP.jpg?v=1790775799",
                            description: "High soft-tissue dynamic clarity with pulsed fluoroscopy.",
                          },
                        ],
                      }))
                    }
                    className="w-full text-xs font-bold text-[#0a4052]"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add New Clinical Case
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 4: Transaction Model & Brochure */}
            <TabsContent value="transaction" className="mt-4 space-y-5">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base text-[#0a4052]">Commercial & PDF Asset Binding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Transaction Interaction Model</Label>
                    <Select
                      value={form.commercialModel}
                      onValueChange={(val: any) => setForm((prev) => ({ ...prev, commercialModel: val }))}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quote_only">Request a Quote Only (Standard Medical - Option A)</SelectItem>
                        <SelectItem value="checkout">Shopify Online Checkout</SelectItem>
                        <SelectItem value="both">Both Quote & Checkout Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Official PDF Brochure URL</Label>
                    <div className="flex gap-2">
                      <Input
                        value={form.brochureUrl}
                        onChange={(e) => setForm((prev) => ({ ...prev, brochureUrl: e.target.value }))}
                        className="text-xs font-mono"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadingField("brochureUrl");
                          fileInputRef.current?.click();
                        }}
                      >
                        <FileUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Brochure Button Title</Label>
                    <Input
                      value={form.brochureTitle}
                      onChange={(e) => setForm((prev) => ({ ...prev, brochureTitle: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Hidden File Input for Direct Uploads */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={uploadingField === "brochureUrl" ? "application/pdf" : "image/jpeg,image/png,image/webp"}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </div>

        {/* Right Column: Live Interactive Visual Inspector (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="sticky top-6 space-y-4">
            <Card className="border-[#0a4052]/20 shadow-md">
              <CardHeader className="bg-[#0a4052] pb-4 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-white">Live Hero Stage Preview</CardTitle>
                    <CardDescription className="text-xs text-white/70">
                      Real-time visualization of image positioning & scale
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-500 text-[10px] font-bold">Direct Rendering</Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {/* Visual Image Viewport */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6 shadow-inner">
                  {form.heroImage ? (
                    <img
                      src={form.heroImage}
                      alt="Preview"
                      style={{
                        objectPosition: form.heroObjectPosition,
                        transform: `scale(${form.heroScalePercent / 100})`,
                      }}
                      className="h-full w-full object-contain transition-all duration-200 drop-shadow-md"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No Image Specified</span>
                  )}

                  {/* Alignment Crosshair Guide */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center border border-dashed border-slate-300/60 opacity-40">
                    <div className="h-full w-px bg-slate-300" />
                    <div className="absolute h-px w-full bg-slate-300" />
                  </div>
                </div>

                {/* Quick Diagnostics */}
                <div className="rounded-xl border bg-slate-50 p-3 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Position:</span>
                    <span className="font-bold text-[#0a4052]">{form.heroObjectPosition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scale:</span>
                    <span className="font-bold text-[#0a4052]">{form.heroScalePercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transaction:</span>
                    <span className="font-bold text-[#0a4052]">{form.commercialModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Clinical Cases:</span>
                    <span className="font-bold text-[#0a4052]">{form.clinicalGallery.length} scans</span>
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="w-full bg-[#0a4052] font-bold text-white hover:bg-[#072c38]"
                >
                  <Save className="mr-2 h-4 w-4" /> Save & Publish Live
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
