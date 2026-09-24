import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Save, UploadCloud, Eye, EyeOff, Send } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
  { title: "Hero section", keys: ["hero.eyebrow", "hero.title", "hero.description", "hero.primary.label", "hero.primary.url", "hero.secondary.label", "hero.secondary.url", "hero.image"] },
  { title: "Information panel", keys: ["panel.eyebrow", "panel.title", "panel.metric1.value", "panel.metric1.label", "panel.metric2.value", "panel.metric2.label", "panel.description"] },
  { title: "Feature cards", keys: ["highlight.1.title", "highlight.1.text", "highlight.2.title", "highlight.2.text", "highlight.3.title", "highlight.3.text"] },
];

export default function HomepageEditor() {
  const draft = trpc.homepage.draft.useQuery();
  const utils = trpc.useUtils();
  const [values, setValues] = useState<Record<string, string>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const [imageKey, setImageKey] = useState("hero.image");
  const saveDraft = trpc.homepage.saveDraft.useMutation({ onSuccess: () => { setMessage("Draft saved. The public website still shows the last published version."); utils.homepage.draft.invalidate(); }, onError: err => setMessage(err.message) });
  const publish = trpc.homepage.publish.useMutation({ onSuccess: () => { setMessage("Homepage published successfully."); utils.homepage.draft.invalidate(); utils.homepage.published.invalidate(); }, onError: err => setMessage(err.message) });
  const uploadImage = trpc.homepage.uploadImage.useMutation({ onSuccess: result => { setValues(current => ({ ...current, "hero.image": result.url })); setMessage("Image uploaded into the draft. Save the draft, then publish when ready."); utils.homepage.draft.invalidate(); }, onError: err => setMessage(err.message) });

  useEffect(() => {
    if (!draft.data) return;
    const nextValues: Record<string, string> = {};
    const nextVisibility: Record<string, boolean> = {};
    for (const item of draft.data) { nextValues[item.contentKey] = item.draftValue; nextVisibility[item.contentKey] = item.isVisible; }
    setValues(nextValues);
    setVisibility(nextVisibility);
  }, [draft.data]);

  const byKey = useMemo(() => new Map((draft.data ?? []).map(item => [item.contentKey, item])), [draft.data]);
  const updateValue = (key: string, value: string) => setValues(current => ({ ...current, [key]: value }));
  const save = () => saveDraft.mutate({ items: (draft.data ?? []).map(item => ({ contentKey: item.contentKey, draftValue: values[item.contentKey] ?? item.draftValue, isVisible: visibility[item.contentKey] ?? item.isVisible })) });
  const handleImage = (key: string, file: File | undefined) => {
    if (!file) return;
    if (!(["image/jpeg", "image/png", "image/webp"] as string[]).includes(file.type)) { setMessage("Use JPG, PNG or WebP images only."); return; }
    const reader = new FileReader();
    reader.onload = () => uploadImage.mutate({ contentKey: key, fileName: file.name, contentType: file.type as "image/jpeg" | "image/png" | "image/webp", dataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return <Card className="border-cyan-100 shadow-sm"><CardHeader><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><CardTitle className="flex items-center gap-2"><ImagePlus className="h-5 w-5 text-cyan-600" />Homepage content manager</CardTitle><CardDescription>Edit every visible text, URL, metric and image from one controlled draft. Saving does not publish automatically.</CardDescription></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={save} disabled={saveDraft.isPending}><Save className="mr-2 h-4 w-4" />{saveDraft.isPending ? "Saving…" : "Save draft"}</Button><Button onClick={() => publish.mutate()} disabled={publish.isPending}><Send className="mr-2 h-4 w-4" />{publish.isPending ? "Publishing…" : "Publish"}</Button></div></div></CardHeader><CardContent className="space-y-7"><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={event => handleImage(imageKey, event.target.files?.[0])} />{message ? <Alert><AlertDescription>{message}</AlertDescription></Alert> : null}{draft.isLoading ? <p className="text-sm text-slate-500">Loading homepage content…</p> : null}{groups.map(group => <section key={group.title} className="space-y-4"><div><h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{group.title}</h3><p className="mt-1 text-sm text-slate-500">Each field has an independent draft value and visibility switch.</p></div><div className="grid gap-4 md:grid-cols-2">{group.keys.map(key => { const item = byKey.get(key) as ContentItem | undefined; if (!item) return null; const value = values[key] ?? item.draftValue; const multiline = item.contentType === "text" && (key.includes("description") || key.includes("text") || key === "hero.title"); const imageField = item.contentType === "image"; return <div key={key} className={multiline || imageField ? "space-y-2 md:col-span-2" : "space-y-2"}><div className="flex items-center justify-between gap-2"><Label htmlFor={`homepage-${key}`}>{item.label}</Label><Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setVisibility(current => ({ ...current, [key]: !(current[key] ?? item.isVisible) }))}>{(visibility[key] ?? item.isVisible) ? <><Eye className="mr-1 h-3 w-3" />Visible</> : <><EyeOff className="mr-1 h-3 w-3" />Hidden</>}</Button></div>{item.description ? <p className="text-xs text-slate-500">{item.description}</p> : null}{imageField ? <div className="space-y-3"><div className="flex gap-2"><Input id={`homepage-${key}`} value={value} onChange={event => updateValue(key, event.target.value)} placeholder="Upload an image or paste a storage URL" /><Button type="button" variant="outline" onClick={() => { setImageKey(key); fileInput.current?.click(); }} disabled={uploadImage.isPending}><UploadCloud className="mr-2 h-4 w-4" />{uploadImage.isPending ? "Uploading…" : "Upload"}</Button></div>{value ? <img src={value} alt={`${item.label} draft preview`} className="h-32 w-full rounded-xl object-cover" /> : null}</div> : multiline ? <Textarea id={`homepage-${key}`} value={value} onChange={event => updateValue(key, event.target.value)} rows={key === "hero.title" ? 2 : 4} /> : <Input id={`homepage-${key}`} type={item.contentType === "number" ? "number" : item.contentType === "url" ? "url" : "text"} value={value} onChange={event => updateValue(key, event.target.value)} />}</div>})}</div>{group.title !== "Feature cards" ? <Separator /> : null}</section>)}<div className="flex flex-wrap items-center gap-2"><Badge variant="outline">Draft workflow</Badge><span className="text-sm text-slate-500">Save → review → publish. Only users with the required permission can complete each step.</span></div></CardContent></Card>;
}
