import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  FileDown,
  FileUp,
  Film,
  Image as ImageIcon,
  ImagePlus,
  Layers,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
  Upload,
  Video,
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

type GalleryMedia = ItalrayProductMeta["clinicalGallery"][number] & {
  mediaType?: "image" | "video";
  textOverlay?: string;
  alt?: string;
};

type UploadTarget = "heroImage" | "descriptionImage" | "brochureUrl" | `gallery:${number}` | "gallery:multiple";

type FormState = {
  title: string;
  badge: string;
  headline: string;
  subheadline: string;
  leadParagraph: string;
  secondaryParagraph: string;
  heroImage: string;
  heroObjectPosition: string;
  heroScalePercent: number;
  descriptionImage: string;
  descriptionObjectPosition: string;
  brochureUrl: string;
  brochureTitle: string;
  commercialModel: "quote_only" | "checkout" | "both";
  highlights: string[];
  clinicalGallery: GalleryMedia[];
  pillarsJson: string;
  upgradesJson: string;
  specificationsJson: string;
};

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function toPrettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}

function createInitialForm(meta: ItalrayProductMeta, override?: any): FormState {
  const gallery = parseJson<GalleryMedia[]>(override?.clinicalGalleryJson || override?.galleryImagesJson, meta.clinicalGallery);
  return {
    title: override?.title || meta.title,
    badge: override?.badge || meta.badge,
    headline: override?.headline || meta.headline,
    subheadline: override?.subheadline || meta.subheadline,
    leadParagraph: override?.leadParagraph || meta.leadParagraph,
    secondaryParagraph: override?.secondaryParagraph || meta.secondaryParagraph,
    heroImage: override?.heroImage || meta.heroImage,
    heroObjectPosition: override?.heroObjectPosition || "center center",
    heroScalePercent: override?.heroScalePercent ?? 100,
    descriptionImage: override?.descriptionImage || meta.descriptionImage,
    descriptionObjectPosition: override?.descriptionObjectPosition || "center center",
    brochureUrl: override?.brochureUrl || meta.brochureUrl,
    brochureTitle: override?.brochureTitle || meta.brochureTitle,
    commercialModel: override?.commercialModel || "quote_only",
    highlights: parseJson<string[]>(override?.highlightsJson, meta.highlights),
    clinicalGallery: gallery,
    pillarsJson: override?.pillarsJson || toPrettyJson(meta.pillars),
    upgradesJson: override?.upgradesJson || toPrettyJson(meta.upgrades),
    specificationsJson: override?.specificationsJson || toPrettyJson(meta.specifications),
  };
}

function FieldUploadButton({ label, onClick, busy }: { label: string; onClick: () => void; busy?: boolean }) {
  return (
    <Button type="button" variant="outline" size="sm" className="shrink-0 gap-1.5 border-[#0f6fae] text-[#0f6fae]" onClick={onClick} disabled={busy} aria-label={`Upload ${label}`}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      <span className="hidden sm:inline">Upload</span>
    </Button>
  );
}

export default function MarketingItalrayWorkspace() {
  const [selectedHandle, setSelectedHandle] = useState("italray-carmex-fp21-fp30");
  const [uploadingField, setUploadingField] = useState<UploadTarget | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const registeredHandles = useMemo(() => Object.keys(ITALRAY_CATALOG_REGISTRY).map(handle => ({
    handle,
    title: ITALRAY_CATALOG_REGISTRY[handle].title,
    badge: ITALRAY_CATALOG_REGISTRY[handle].badge,
  })), []);

  const overridesQuery = trpc.products.listItalrayPresentations.useQuery(undefined, { staleTime: 10_000, retry: 0 });
  const override = useMemo(() => overridesQuery.data?.find(item => item.handle === selectedHandle), [overridesQuery.data, selectedHandle]);
  const staticMeta: ItalrayProductMeta = ITALRAY_CATALOG_REGISTRY[selectedHandle] || ITALRAY_CATALOG_REGISTRY["italray-carmex-fp21-fp30"];

  useEffect(() => {
    setForm(createInitialForm(staticMeta, override));
  }, [staticMeta, override]);

  const saveMutation = trpc.products.saveItalrayPresentation.useMutation({
    onSuccess: async () => {
      await overridesQuery.refetch();
      window.alert("Saved and published to the live Italray template.");
    },
  });
  const uploadMutation = trpc.products.uploadItalrayMedia.useMutation();

  const updateForm = (changes: Partial<FormState>) => setForm(current => current ? { ...current, ...changes } : current);
  const openUpload = (target: UploadTarget) => {
    setUploadingField(target);
    window.setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        fileInputRef.current.click();
      }
    }, 0);
  };

  const uploadOne = async (file: File, target: UploadTarget) => {
    const isBrochure = target === "brochureUrl";
    const isVideo = file.type.startsWith("video/");
    const allowed = isBrochure
      ? ["application/pdf"]
      : ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime", "video/webm"];
    if (!allowed.includes(file.type)) throw new Error(isBrochure ? "Choose a PDF brochure." : "Choose JPG, PNG, WebP, MP4, MOV, or WebM media.");
    const maxBytes = isVideo ? 40 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > maxBytes) throw new Error(`This file is too large. Maximum is ${Math.round(maxBytes / 1024 / 1024)} MB.`);
    const dataUrl = await readFileAsDataUrl(file);
    return uploadMutation.mutateAsync({
      handle: selectedHandle,
      fileName: file.name,
      contentType: file.type as "image/jpeg" | "image/png" | "image/webp" | "application/pdf" | "video/mp4" | "video/quicktime" | "video/webm",
      dataUrl,
    });
  };

  const handleFiles = async (fileList: FileList | null) => {
    const target = uploadingField;
    setUploadingField(null);
    if (!target || !fileList || !form) return;
    const files = Array.from(fileList);
    try {
      if (target === "gallery:multiple") {
        const uploaded: GalleryMedia[] = [];
        for (const file of files) {
          const result = await uploadOne(file, target);
          const mediaType = file.type.startsWith("video/") ? "video" : "image";
          uploaded.push({
            title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
            category: mediaType === "video" ? "Clinical Video" : "Clinical Imaging",
            image: result.url,
            description: "Add the clinical observation shown in this media.",
            mediaType,
            textOverlay: "",
            alt: file.name,
          });
        }
        updateForm({ clinicalGallery: [...form.clinicalGallery, ...uploaded] });
        return;
      }
      const file = files[0];
      if (!file) return;
      const result = await uploadOne(file, target);
      if (target === "heroImage") updateForm({ heroImage: result.url });
      if (target === "descriptionImage") updateForm({ descriptionImage: result.url });
      if (target === "brochureUrl") updateForm({ brochureUrl: result.url });
      if (target.startsWith("gallery:")) {
        const index = Number(target.split(":")[1]);
        updateForm({ clinicalGallery: form.clinicalGallery.map((item, itemIndex) => itemIndex === index ? { ...item, image: result.url, mediaType: file.type.startsWith("video/") ? "video" : "image" } : item) });
      }
    } catch (error) {
      window.alert(`Upload error: ${error instanceof Error ? error.message : "Could not upload the file."}`);
    }
  };

  const validateJson = (label: string, value: string) => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      window.alert(`${label} contains invalid JSON. Please fix it before publishing.`);
      return false;
    }
  };

  const save = () => {
    if (!form) return;
    if (!validateJson("Technology pillars", form.pillarsJson) || !validateJson("Upgrades", form.upgradesJson) || !validateJson("Technical specifications", form.specificationsJson)) return;
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
      pillarsJson: form.pillarsJson,
      upgradesJson: form.upgradesJson,
      specificationsJson: form.specificationsJson,
      clinicalGalleryJson: JSON.stringify(form.clinicalGallery),
      galleryImagesJson: JSON.stringify(form.clinicalGallery),
      imagePositionsJson: JSON.stringify(form.clinicalGallery.map(item => ({ url: item.image, objectPosition: "center center" }))),
      displayOrder: override?.displayOrder ?? 0,
      isVisible: true,
    });
  };

  if (!form) return <div className="rounded-2xl border bg-white p-8 text-sm text-slate-500">Loading Marketing Studio…</div>;

  const updateGallery = (index: number, changes: Partial<GalleryMedia>) => updateForm({ clinicalGallery: form.clinicalGallery.map((item, itemIndex) => itemIndex === index ? { ...item, ...changes } : item) });
  const removeGallery = (index: number) => updateForm({ clinicalGallery: form.clinicalGallery.filter((_, itemIndex) => itemIndex !== index) });
  const resetToTemplate = () => { if (window.confirm("Reset this product's marketing draft to the built-in template?")) setForm(createInitialForm(staticMeta)); };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple={uploadingField === "gallery:multiple"}
        accept={uploadingField === "brochureUrl" ? "application/pdf" : "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"}
        onChange={event => void handleFiles(event.target.files)}
      />

      <Card className="overflow-hidden border-[#bcdde2] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#061f2b] via-[#0a4052] to-[#0f6fae] text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-[#5ed8db] text-[#061f2b]">Marketing Studio</Badge>
                <span className="text-xs font-semibold text-white/70">One fixed Italray template • live publishing</span>
              </div>
              <CardTitle className="mt-3 text-2xl text-white">Full product presentation control</CardTitle>
              <CardDescription className="mt-1 max-w-3xl text-white/75">Manage every visible section, upload media beside each URL, add multiple clinical images or videos, and publish a Ziehm-style experience without changing the template structure.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20" asChild><Link href={`/store/products/${selectedHandle}`} target="_blank"><ExternalLink className="h-4 w-4" /> View live</Link></Button>
              <Button onClick={save} disabled={saveMutation.isPending} className="gap-2 bg-[#d95316] text-white hover:bg-[#b8430e]">{saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Publish changes</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500"><Layers className="h-4 w-4" /> Equipment</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {registeredHandles.map(device => <button key={device.handle} onClick={() => setSelectedHandle(device.handle)} className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition ${selectedHandle === device.handle ? "bg-[#0a4052] text-white shadow" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}>{device.title}</button>)}
            </div>
          </div>
          {overridesQuery.error ? <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">The saved overrides could not be loaded. You can still edit the template, then retry publishing.</div> : null}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <Tabs defaultValue="hero">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-5">
              <TabsTrigger value="hero" className="text-xs">Hero media</TabsTrigger>
              <TabsTrigger value="copy" className="text-xs">Copy & bullets</TabsTrigger>
              <TabsTrigger value="clinical" className="text-xs">X-ray & video</TabsTrigger>
              <TabsTrigger value="sections" className="text-xs">All sections</TabsTrigger>
              <TabsTrigger value="commercial" className="text-xs">Files & sales</TabsTrigger>
            </TabsList>

            <TabsContent value="hero" className="mt-4 space-y-5">
              <Card><CardHeader><CardTitle className="text-base text-[#0a4052]">Hero image and positioning</CardTitle><CardDescription>Keep the template fixed and control the focal point, scale, and media URL from here.</CardDescription></CardHeader><CardContent className="space-y-4">
                <div className="space-y-2"><Label>Hero image URL</Label><div className="flex gap-2"><Input value={form.heroImage} onChange={event => updateForm({ heroImage: event.target.value })} className="font-mono text-xs" /><FieldUploadButton label="hero image" busy={uploadingField === "heroImage"} onClick={() => openUpload("heroImage")} /></div></div>
                <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Image position</Label><Select value={form.heroObjectPosition} onValueChange={heroObjectPosition => updateForm({ heroObjectPosition })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{POSITION_PRESETS.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Scale: {form.heroScalePercent}%</Label><input type="range" min={70} max={160} step={5} value={form.heroScalePercent} onChange={event => updateForm({ heroScalePercent: Number(event.target.value) })} className="mt-3 w-full accent-[#0a4052]" /></div></div>
                <div className="border-t pt-4"><Label>Secondary architecture image</Label><div className="mt-2 flex gap-2"><Input value={form.descriptionImage} onChange={event => updateForm({ descriptionImage: event.target.value })} className="font-mono text-xs" /><FieldUploadButton label="secondary image" busy={uploadingField === "descriptionImage"} onClick={() => openUpload("descriptionImage")} /></div><div className="mt-3 max-w-xs"><Label className="text-xs">Secondary position</Label><Select value={form.descriptionObjectPosition} onValueChange={descriptionObjectPosition => updateForm({ descriptionObjectPosition })}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{POSITION_PRESETS.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select></div></div>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="copy" className="mt-4 space-y-5">
              <Card><CardHeader><CardTitle className="text-base text-[#0a4052]">Headlines, text overlays and highlights</CardTitle><CardDescription>These fields control the hero and editorial text while the public structure stays consistent across all Italray products.</CardDescription></CardHeader><CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Product title</Label><Input value={form.title} onChange={event => updateForm({ title: event.target.value })} /></div><div className="space-y-2"><Label>Badge / product family</Label><Input value={form.badge} onChange={event => updateForm({ badge: event.target.value })} /></div></div>
                <div className="space-y-2"><Label>Hero headline</Label><Input value={form.headline} onChange={event => updateForm({ headline: event.target.value })} /></div>
                <div className="space-y-2"><Label>Section headline</Label><Input value={form.subheadline} onChange={event => updateForm({ subheadline: event.target.value })} /></div>
                <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Lead paragraph</Label><Textarea rows={5} value={form.leadParagraph} onChange={event => updateForm({ leadParagraph: event.target.value })} /></div><div className="space-y-2"><Label>SPM support paragraph</Label><Textarea rows={5} value={form.secondaryParagraph} onChange={event => updateForm({ secondaryParagraph: event.target.value })} /></div></div>
                <div className="space-y-2 border-t pt-4"><Label>Highlights ribbon</Label>{form.highlights.map((highlight, index) => <div key={`${index}-${highlight}`} className="flex gap-2"><Input value={highlight} onChange={event => updateForm({ highlights: form.highlights.map((item, itemIndex) => itemIndex === index ? event.target.value : item) })} /><Button type="button" variant="ghost" size="icon" onClick={() => updateForm({ highlights: form.highlights.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>)}<Button type="button" variant="outline" size="sm" onClick={() => updateForm({ highlights: [...form.highlights, "New product highlight"] })}><Plus className="mr-1 h-4 w-4" /> Add highlight</Button></div>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="clinical" className="mt-4 space-y-5">
              <Card><CardHeader><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle className="text-base text-[#0a4052]">Ziehm-style X-ray and clinical media carousel</CardTitle><CardDescription>Add many images or videos to the same section. The public template automatically shows arrows, dots, lightbox, controls and overlay text.</CardDescription></div><Button type="button" onClick={() => openUpload("gallery:multiple")} disabled={uploadingField === "gallery:multiple"} className="gap-2 bg-[#0f6fae] text-white hover:bg-[#0a5282]"><Upload className="h-4 w-4" /> Add multiple media</Button></div></CardHeader><CardContent className="space-y-4">
                {form.clinicalGallery.length === 0 ? <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">No clinical media yet. Upload multiple X-ray images or videos to build the showcase.</div> : null}
                {form.clinicalGallery.map((item, index) => <div key={`${index}-${item.image}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between gap-3 border-b pb-3"><div className="flex items-center gap-2 text-xs font-bold text-[#0a4052]"><Badge variant="outline">Media {index + 1}</Badge>{item.mediaType === "video" ? <Video className="h-4 w-4 text-[#c2410c]" /> : <ImageIcon className="h-4 w-4 text-[#0f6fae]" />}</div><Button type="button" variant="ghost" size="sm" className="text-xs text-red-600" onClick={() => removeGallery(index)}><Trash2 className="mr-1 h-3.5 w-3.5" /> Remove</Button></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="space-y-1"><Label className="text-xs">Title</Label><Input value={item.title} onChange={event => updateGallery(index, { title: event.target.value })} /></div><div className="space-y-1"><Label className="text-xs">Category</Label><Input value={item.category} onChange={event => updateGallery(index, { category: event.target.value })} /></div></div><div className="mt-3 space-y-1"><Label className="text-xs">Media URL</Label><div className="flex gap-2"><Input value={item.image} onChange={event => updateGallery(index, { image: event.target.value })} className="font-mono text-xs" /><FieldUploadButton label={`media ${index + 1}`} busy={uploadingField === `gallery:${index}`} onClick={() => openUpload(`gallery:${index}`)} /></div></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="space-y-1"><Label className="text-xs">Media type</Label><Select value={item.mediaType || "image"} onValueChange={mediaType => updateGallery(index, { mediaType: mediaType as "image" | "video" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="image">X-ray / image</SelectItem><SelectItem value="video">Clinical video</SelectItem></SelectContent></Select></div><div className="space-y-1"><Label className="text-xs">Text over image (Ziehm style)</Label><Input value={item.textOverlay || ""} onChange={event => updateGallery(index, { textOverlay: event.target.value })} placeholder="e.g. High-contrast spine imaging" /></div></div><div className="mt-3 space-y-1"><Label className="text-xs">Clinical description / alt text</Label><Textarea rows={2} value={item.description} onChange={event => updateGallery(index, { description: event.target.value, alt: event.target.value })} /></div></div>)}
                <Button type="button" variant="outline" className="w-full gap-2 text-[#0a4052]" onClick={() => updateForm({ clinicalGallery: [...form.clinicalGallery, { title: "New X-ray case", category: "Clinical Imaging", image: "", description: "Describe the finding or procedure.", mediaType: "image", textOverlay: "", alt: "Clinical X-ray image" }] })}><Plus className="h-4 w-4" /> Add empty media slot</Button>
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="sections" className="mt-4 space-y-5">
              <Card><CardHeader><CardTitle className="text-base text-[#0a4052]">Control every template section</CardTitle><CardDescription>Advanced editors preserve the fixed public design while giving Marketing control over the pillars, upgrades and technical specification data. Keep each field valid JSON before publishing.</CardDescription></CardHeader><CardContent className="space-y-5">
                {[{ key: "pillarsJson", label: "Technology pillars JSON", icon: <Sparkles className="h-4 w-4" /> }, { key: "upgradesJson", label: "Upgrades and packages JSON", icon: <Layers className="h-4 w-4" /> }, { key: "specificationsJson", label: "Technical specifications JSON", icon: <CheckCircle2 className="h-4 w-4" /> }].map(section => <div key={section.key} className="space-y-2"><div className="flex items-center justify-between gap-2"><Label className="flex items-center gap-2">{section.icon}{section.label}</Label><Button type="button" variant="ghost" size="sm" className="text-xs" onClick={() => { const value = form[section.key as "pillarsJson" | "upgradesJson" | "specificationsJson"]; try { updateForm({ [section.key]: toPrettyJson(JSON.parse(value)) } as Partial<FormState>); } catch { window.alert("Fix the JSON syntax before formatting."); } }}><RotateCcw className="mr-1 h-3.5 w-3.5" /> Format</Button></div><Textarea rows={section.key === "specificationsJson" ? 14 : 12} value={form[section.key as "pillarsJson" | "upgradesJson" | "specificationsJson"]} onChange={event => updateForm({ [section.key]: event.target.value } as Partial<FormState>)} className="font-mono text-xs leading-5" /></div>)}
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="commercial" className="mt-4 space-y-5">
              <Card><CardHeader><CardTitle className="text-base text-[#0a4052]">Commercial controls and official files</CardTitle><CardDescription>Medical systems stay quote-first by default. Upload the official PDF beside its URL and control the CTA behavior.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="space-y-2"><Label>Commercial model</Label><Select value={form.commercialModel} onValueChange={commercialModel => updateForm({ commercialModel: commercialModel as FormState["commercialModel"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="quote_only">Request a quote only</SelectItem><SelectItem value="checkout">Shopify checkout</SelectItem><SelectItem value="both">Quote and checkout</SelectItem></SelectContent></Select></div><div className="space-y-2"><Label>Official brochure URL</Label><div className="flex gap-2"><Input value={form.brochureUrl} onChange={event => updateForm({ brochureUrl: event.target.value })} className="font-mono text-xs" /><Button type="button" variant="outline" size="sm" className="shrink-0 gap-1.5 border-[#0f6fae] text-[#0f6fae]" onClick={() => openUpload("brochureUrl")} disabled={uploadingField === "brochureUrl"}>{uploadingField === "brochureUrl" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}<span className="hidden sm:inline">Upload PDF</span></Button></div></div><div className="space-y-2"><Label>Brochure button title</Label><Input value={form.brochureTitle} onChange={event => updateForm({ brochureTitle: event.target.value })} /></div></CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <Card className="overflow-hidden border-[#0a4052]/20 shadow-md"><CardHeader className="bg-[#0a4052] text-white"><div className="flex items-center justify-between"><div><CardTitle className="text-sm text-white">Live template preview</CardTitle><CardDescription className="text-xs text-white/70">Fixed public structure • editable content</CardDescription></div><Badge className="bg-emerald-500 text-[10px] text-white">Ready</Badge></div></CardHeader><CardContent className="space-y-4 p-4"><div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-gradient-to-b from-slate-50 to-white p-5">{form.heroImage ? <img src={form.heroImage} alt={form.title} className="h-full w-full object-contain drop-shadow-xl" style={{ objectPosition: form.heroObjectPosition, transform: `scale(${form.heroScalePercent / 100})` }} /> : <div className="flex h-full items-center justify-center text-xs text-slate-400">Upload a hero image</div>}<div className="absolute inset-x-4 bottom-4 rounded-xl bg-[#061f2b]/85 px-3 py-2 text-white backdrop-blur"><p className="text-[10px] font-bold uppercase tracking-wider text-[#5ed8db]">{form.badge}</p><p className="mt-1 text-sm font-black">{form.title}</p></div></div><div className="grid grid-cols-2 gap-2 text-xs"><div className="rounded-xl bg-slate-50 p-3"><span className="text-slate-500">Clinical media</span><strong className="mt-1 block text-lg text-[#0a4052]">{form.clinicalGallery.length}</strong></div><div className="rounded-xl bg-slate-50 p-3"><span className="text-slate-500">Videos</span><strong className="mt-1 block text-lg text-[#0a4052]">{form.clinicalGallery.filter(item => item.mediaType === "video").length}</strong></div></div><div className="rounded-xl border bg-slate-50 p-3 text-xs"><p className="font-bold text-[#0a4052]">Publishing checklist</p><ul className="mt-2 space-y-1.5 text-slate-600"><li>✓ Hero and description media</li><li>✓ X-ray carousel with overlay text</li><li>✓ Video media supported</li><li>✓ Pillars, upgrades and specs editable</li></ul></div><div className="grid gap-2 sm:grid-cols-2"><Button onClick={save} disabled={saveMutation.isPending} className="gap-2 bg-[#0a4052] text-white hover:bg-[#072c38]"><Save className="h-4 w-4" /> Save & publish</Button><Button type="button" variant="outline" onClick={resetToTemplate} className="gap-2"><RotateCcw className="h-4 w-4" /> Reset draft</Button></div></CardContent></Card>
          <Card className="border-[#bcdde2] bg-[#f7fbfc]"><CardContent className="flex gap-3 p-4 text-xs text-[#0a4052]"><Film className="mt-0.5 h-5 w-5 shrink-0 text-[#0f6fae]" /><p><strong>Media rule:</strong> upload X-ray stills as images and clinical demonstrations as MP4/MOV/WebM. The public template will render the correct player automatically.</p></CardContent></Card>
        </div>
      </div>
    </div>
  );
}
