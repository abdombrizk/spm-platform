import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, EyeOff, ImagePlus, Save, Send, UploadCloud } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";

type ContentItem = {
  id: number;
  contentKey: string;
  contentType: "text" | "image" | "url" | "number";
  label: string;
  description: string | null;
  draftValue: string;
  publishedValue: string;
  isVisible: boolean;
  sortOrder: number;
  updatedAt: Date;
  publishedAt: Date | null;
};

const groups = [
  { title: "Brand and contact", keys: ["brand.eyebrow", "brand.name", "brand.logo", "contact.email"] },
  { title: "Hero section", keys: ["hero.eyebrow", "hero.title", "hero.description", "hero.primary.label", "hero.primary.url", "hero.secondary.label", "hero.secondary.url"] },
  { title: "Information panel", keys: ["panel.eyebrow", "panel.title", "panel.metric1.value", "panel.metric1.label", "panel.metric2.value", "panel.metric2.label", "panel.description"] },
  { title: "Feature cards", keys: ["highlight.1.title", "highlight.1.text", "highlight.2.title", "highlight.2.text", "highlight.3.title", "highlight.3.text"] },
  { title: "Section visibility", keys: ["careers.visible"] },
];

const heroSlides = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export default function HomepageEditor() {
  const draft = trpc.homepage.draft.useQuery();
  const utils = trpc.useUtils();
  const [values, setValues] = useState<Record<string, string>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [imageKey, setImageKey] = useState("hero.slide.1.image");

  const saveDraft = trpc.homepage.saveDraft.useMutation({
    onSuccess: () => {
      setMessage("Draft saved. The public website still shows the last published version until you publish.");
      utils.homepage.draft.invalidate();
    },
    onError: error => setMessage(error.message),
  });
  const publish = trpc.homepage.publish.useMutation({
    onSuccess: () => {
      setMessage("Homepage published successfully.");
      utils.homepage.draft.invalidate();
      utils.homepage.published.invalidate();
    },
    onError: error => setMessage(error.message),
  });
  const uploadImage = trpc.homepage.uploadImage.useMutation({
    onSuccess: result => {
      setValues(current => ({ ...current, [imageKey]: result.url }));
      setMessage("Image uploaded into the draft. Save the draft, then publish when ready.");
      utils.homepage.draft.invalidate();
    },
    onError: error => setMessage(error.message),
  });

  useEffect(() => {
    if (!draft.data) return;
    const nextValues: Record<string, string> = {};
    const nextVisibility: Record<string, boolean> = {};
    for (const item of draft.data) {
      nextValues[item.contentKey] = item.draftValue;
      nextVisibility[item.contentKey] = item.isVisible;
    }
    setValues(nextValues);
    setVisibility(nextVisibility);
  }, [draft.data]);

  const byKey = useMemo(() => new Map((draft.data ?? []).map(item => [item.contentKey, item as ContentItem])), [draft.data]);
  const updateValue = (key: string, value: string) => setValues(current => ({ ...current, [key]: value }));
  const save = () => saveDraft.mutate({
    items: (draft.data ?? []).map(item => ({
      contentKey: item.contentKey,
      draftValue: values[item.contentKey] ?? item.draftValue,
      isVisible: visibility[item.contentKey] ?? item.isVisible,
    })),
  });
  const handleImage = (key: string, file: File | undefined) => {
    if (!file) return;
    if (!("image/jpeg,image/png,image/webp".split(",") as string[]).includes(file.type)) {
      setMessage("Use JPG, PNG or WebP images only.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => uploadImage.mutate({
      contentKey: key,
      fileName: file.name,
      contentType: file.type as "image/jpeg" | "image/png" | "image/webp",
      dataUrl: String(reader.result),
    });
    reader.readAsDataURL(file);
  };

  const fieldValue = (key: string, fallback = "") => values[key] ?? byKey.get(key)?.draftValue ?? fallback;
  const renderTextField = (key: string, rows?: number) => {
    const item = byKey.get(key);
    if (!item) return null;
    const value = fieldValue(key);
    return (
      <div key={key} className="space-y-2">
        <Label htmlFor={`homepage-${key}`}>{item.label}</Label>
        {item.description ? <p className="text-xs leading-5 text-slate-500">{item.description}</p> : null}
        {rows ? <Textarea id={`homepage-${key}`} value={value} rows={rows} onChange={event => updateValue(key, event.target.value)} /> : <Input id={`homepage-${key}`} value={value} onChange={event => updateValue(key, event.target.value)} />}
      </div>
    );
  };

  return (
    <Card className="border-cyan-100 shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><ImagePlus className="h-5 w-5 text-cyan-600" />Homepage content manager</CardTitle>
            <CardDescription>Edit the public homepage from one controlled draft. Build the Hero visually, upload a new image beside each slide, then save and publish when ready.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={save} disabled={saveDraft.isPending || draft.isLoading}><Save className="mr-2 h-4 w-4" />{saveDraft.isPending ? "Saving…" : "Save draft"}</Button>
            <Button onClick={() => publish.mutate()} disabled={publish.isPending || draft.isLoading}><Send className="mr-2 h-4 w-4" />{publish.isPending ? "Publishing…" : "Publish"}</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={event => handleImage(imageKey, event.target.files?.[0])} />
        {message ? <Alert><AlertDescription>{message}</AlertDescription></Alert> : null}
        {draft.isLoading ? <p className="text-sm text-slate-500">Loading homepage content…</p> : null}

        <section className="overflow-hidden rounded-3xl border border-[#0a4052]/15 bg-[#061f2b] text-white shadow-xl">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2"><Badge className="bg-[#8be0d5] text-[#061f2b] hover:bg-[#8be0d5]">Hero Studio</Badge><span className="text-xs font-bold uppercase tracking-[.16em] text-white/50">9 visual slides · 3 Hermann · 3 Italray · 3 SPM partnerships</span></div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Build the first impression visually.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Each card controls one Hero moment: image, eyebrow, headline, supporting copy and accessible alt text. Uploading updates the draft only; the public website changes after Save draft → Publish.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-5 text-white/65">Recommended image: landscape 16:9<br />Maximum upload: 8 MB</div>
          </div>
          <div className="grid gap-px bg-white/10 lg:grid-cols-2">
            {heroSlides.map(index => {
              const prefix = `hero.slide.${index}`;
              const imageKeyForSlide = `${prefix}.image`;
              const imageItem = byKey.get(imageKeyForSlide);
              if (!imageItem) return null;
              const image = fieldValue(imageKeyForSlide);
              const alt = fieldValue(`${prefix}.alt`, `Hero slide ${index} image`);
              return (
                <article key={index} className="bg-[#082b39] p-4 sm:p-5">
                  <div className="relative aspect-[16/8] overflow-hidden rounded-2xl border border-white/15 bg-[#0a4052]">
                    {image ? <img src={image} alt={alt} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-white/55">Add an image to this slide</div>}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#061f2b]/85 via-transparent to-transparent" aria-hidden="true" />
                    <div className="absolute left-3 top-3 flex items-center gap-2"><Badge className="bg-white/90 text-[#061f2b] hover:bg-white/90">Slide 0{index}</Badge><Badge variant="outline" className="border-white/30 bg-[#061f2b]/40 text-white">{index === 1 ? "Primary" : "Rotation"}</Badge></div>
                    <Button type="button" variant="outline" size="sm" className="absolute bottom-3 right-3 border-white/40 bg-[#061f2b]/75 text-white hover:bg-[#061f2b]" onClick={() => { setImageKey(imageKeyForSlide); fileInput.current?.click(); }} disabled={uploadImage.isPending}><UploadCloud className="mr-2 h-4 w-4" />{uploadImage.isPending && imageKey === imageKeyForSlide ? "Uploading…" : "Replace image"}</Button>
                  </div>
                  <div className="mt-4 grid gap-4">
                    {renderTextField(`${prefix}.eyebrow`)}
                    {renderTextField(`${prefix}.title`, 2)}
                    {renderTextField(`${prefix}.description`, 3)}
                    {renderTextField(`${prefix}.alt`)}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {groups.map(group => (
          <section key={group.title} className="space-y-4">
            <div><h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{group.title}</h3><p className="mt-1 text-sm text-slate-500">Each field has an independent draft value and visibility switch.</p></div>
            <div className="grid gap-4 md:grid-cols-2">
              {group.keys.map(key => {
                const item = byKey.get(key);
                if (!item) return null;
                const value = fieldValue(key);
                const multiline = item.contentType === "text" && (key.includes("description") || key.includes("text") || key === "hero.title");
                const imageField = item.contentType === "image";
                return (
                  <div key={key} className={multiline || imageField ? "space-y-2 md:col-span-2" : "space-y-2"}>
                    <div className="flex items-center justify-between gap-2"><Label htmlFor={`homepage-${key}`}>{item.label}</Label><Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setVisibility(current => ({ ...current, [key]: !(current[key] ?? item.isVisible) }))}>{(visibility[key] ?? item.isVisible) ? <><Eye className="mr-1 h-3 w-3" />Visible</> : <><EyeOff className="mr-1 h-3 w-3" />Hidden</>}</Button></div>
                    {item.description ? <p className="text-xs text-slate-500">{item.description}</p> : null}
                    {imageField ? <div className="space-y-3"><div className="flex gap-2"><Input id={`homepage-${key}`} value={value} onChange={event => updateValue(key, event.target.value)} placeholder="Upload an image or paste a storage URL" /><Button type="button" variant="outline" onClick={() => { setImageKey(key); fileInput.current?.click(); }} disabled={uploadImage.isPending}><UploadCloud className="mr-2 h-4 w-4" />{uploadImage.isPending && imageKey === key ? "Uploading…" : "Upload"}</Button></div>{value ? <img src={value} alt={`${item.label} draft preview`} className="h-32 w-full rounded-xl object-contain bg-slate-50" /> : null}</div> : multiline ? <Textarea id={`homepage-${key}`} value={value} onChange={event => updateValue(key, event.target.value)} rows={key === "hero.title" ? 2 : 4} /> : <Input id={`homepage-${key}`} type={item.contentType === "number" ? "number" : item.contentType === "url" ? "url" : "text"} value={value} onChange={event => updateValue(key, event.target.value)} />}
                  </div>
                );
              })}
            </div>
            <Separator />
          </section>
        ))}
        <div className="flex flex-wrap items-center gap-2"><Badge variant="outline">Draft workflow</Badge><span className="text-sm text-slate-500">Save → review → publish. Only users with the required permission can complete each step.</span></div>
      </CardContent>
    </Card>
  );
}
