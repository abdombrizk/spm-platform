import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Activity, ShieldCheck, Users, UserPlus, KeyRound, Power, LogOut, Search, LockKeyhole, PackagePlus, Wrench, ClipboardList, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import HomepageEditor from "./HomepageEditor";
import ContentWorkspace from "./ContentWorkspace";

const roles = ["owner", "manager", "marketing", "sales", "service", "qa", "ra", "user"] as const;
type Role = typeof roles[number];
const roleLabels: Record<Role, string> = { owner: "Owner", manager: "Manager", marketing: "Marketing", sales: "Sales", service: "Service", qa: "QA", ra: "RA", user: "User" };
const homepagePermissions = [
  { key: "homepage.edit", label: "Edit homepage draft", description: "Change texts, URLs, numbers and visibility." },
  { key: "homepage.media", label: "Upload homepage images", description: "Upload JPG, PNG or WebP media." },
  { key: "homepage.publish", label: "Publish homepage", description: "Move the approved draft to the public website." },
] as const;
const productPermissions = [
  { key: "products.view", label: "View products", description: "Open catalogue records and drafts." },
  { key: "products.create", label: "Create products", description: "Create new product drafts." },
  { key: "products.edit", label: "Edit products", description: "Change product data and restore archives." },
  { key: "products.media", label: "Upload product media", description: "Upload images and PDF brochures." },
  { key: "products.quality", label: "Manage CE and quality fields", description: "Edit regulatory status, quality review and document visibility." },
  { key: "products.publish", label: "Publish products", description: "Make product drafts public." },
  { key: "products.archive", label: "Archive products", description: "Remove products from public catalogue safely." },
  { key: "products.delete", label: "Delete products", description: "Permanently delete product records." },
] as const;
const servicePermissions = [
  { key: "services.view", label: "View services", description: "Open service records and drafts." },
  { key: "services.create", label: "Create services", description: "Create new service drafts." },
  { key: "services.edit", label: "Edit services", description: "Change service data and submit review." },
  { key: "services.media", label: "Upload service media", description: "Upload service images and brochures." },
  { key: "services.quality", label: "Manage service quality", description: "Edit quality fields and approve services." },
  { key: "services.publish", label: "Publish services", description: "Make approved services public." },
  { key: "services.archive", label: "Archive services", description: "Remove services from the public website safely." },
  { key: "services.delete", label: "Delete services", description: "Permanently delete service records." },
] as const;
const quotePermissions = [
  { key: "quotes.view", label: "View quote requests", description: "Open customer requests and commercial details." },
  { key: "quotes.create", label: "Create quote requests", description: "Create a request manually for a customer." },
  { key: "quotes.edit", label: "Edit quote requests", description: "Add internal comments and update request details." },
  { key: "quotes.assign", label: "Assign requests", description: "Assign Sales and Service owners and priority." },
  { key: "quotes.status", label: "Change request status", description: "Move requests through the commercial workflow." },
  { key: "quotes.attachments", label: "Manage attachments", description: "View and manage request files." },
  { key: "quotes.export", label: "Export requests", description: "Export request data for approved reporting." },
  { key: "quotes.close", label: "Close requests", description: "Close completed or cancelled requests." },
  { key: "quotes.delete", label: "Delete requests", description: "Permanently delete request records." },
] as const;
const serviceRequestPermissions = [
  { key: "service_requests.view", label: "View service requests", description: "Open service requests, equipment and problem details." },
  { key: "service_requests.create", label: "Create service requests", description: "Create a request manually for a customer." },
  { key: "service_requests.edit", label: "Edit service requests", description: "Update request details and link a quote." },
  { key: "service_requests.assign", label: "Assign service requests", description: "Assign Service and Sales owners." },
  { key: "service_requests.priority", label: "Change priority", description: "Set Low, Normal, High or Urgent priority." },
  { key: "service_requests.status", label: "Change status", description: "Move requests through diagnosis, visit and resolution." },
  { key: "service_requests.attachments", label: "Manage attachments", description: "View and manage equipment evidence and files." },
  { key: "service_requests.comments", label: "Add internal comments", description: "Document triage, service notes and decisions." },
  { key: "service_requests.schedule", label: "Schedule site visits", description: "Manage visit scheduling information." },
  { key: "service_requests.close", label: "Close requests", description: "Close resolved or cancelled service requests." },
  { key: "service_requests.delete", label: "Delete requests", description: "Permanently delete service request records." },
] as const;
const contentPermissions = [
  { key: "content.view", label: "View content workspace", description: "Open page drafts, media and controlled numbers." },
  { key: "content.edit", label: "Edit page drafts", description: "Change page text and structured content." },
  { key: "content.media", label: "Upload and manage media", description: "Upload images, PDFs, certificates and letters." },
  { key: "content.review", label: "Review content", description: "Approve or return page and evidence drafts." },
  { key: "content.publish", label: "Publish content", description: "Move approved pages and media to the public website." },
  { key: "content.stats", label: "Manage public numbers", description: "Edit and publish approved figures such as hospitals and projects." },
  { key: "content.delete", label: "Archive content", description: "Archive controlled content after an Owner decision." },
] as const;

function PermissionEditor({ users }: { users: Array<{ id: number; name: string | null; email: string | null; role: string }> }) {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const permissionsQuery = trpc.owner.getPermissions.useQuery({ userId: selectedUserId ?? 0 }, { enabled: Boolean(selectedUserId) });
  const replacePermissions = trpc.owner.updateHomepagePermissions.useMutation({ onSuccess: () => permissionsQuery.refetch() });
  const current = new Set((permissionsQuery.data ?? []).filter(item => item.granted).map(item => item.permission));
  const selected = users.find(user => user.id === selectedUserId);
  const save = (permission: string, granted: boolean) => {
    const next = new Set(current);
    if (granted) next.add(permission); else next.delete(permission);
    replacePermissions.mutate({ userId: selectedUserId!, permissions: homepagePermissions.map(item => ({ permission: item.key, granted: next.has(item.key) })) });
  };
  return <Card><CardHeader><CardTitle>Page permissions</CardTitle><CardDescription>Assign individual homepage controls. Owner always retains every permission.</CardDescription></CardHeader><CardContent className="space-y-4"><Select value={selectedUserId ? String(selectedUserId) : ""} onValueChange={value => setSelectedUserId(Number(value))}><SelectTrigger><SelectValue placeholder="Choose a user" /></SelectTrigger><SelectContent>{users.filter(user => user.role !== "owner").map(user => <SelectItem key={user.id} value={String(user.id)}>{user.name || user.email || `User ${user.id}`} — {roleLabels[user.role as Role] ?? user.role}</SelectItem>)}</SelectContent></Select>{selected ? <div className="space-y-3 rounded-2xl border p-4"><div><p className="font-semibold">{selected.name || "Unnamed user"}</p><p className="text-sm text-slate-500">{selected.email}</p></div>{homepagePermissions.map(item => <label key={item.key} className="flex cursor-pointer items-start gap-3 rounded-xl border p-3"><input type="checkbox" className="mt-1 h-4 w-4 accent-cyan-600" checked={current.has(item.key)} disabled={permissionsQuery.isLoading || replacePermissions.isPending} onChange={event => save(item.key, event.target.checked)} /><span><span className="block text-sm font-medium">{item.label}</span><span className="block text-xs text-slate-500">{item.description}</span></span></label>)}</div> : <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">Select a non-Owner account to manage homepage permissions.</p>}</CardContent></Card>;
}

function ProductPermissionEditor({ users }: { users: Array<{ id: number; name: string | null; email: string | null; role: string }> }) {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const permissionsQuery = trpc.owner.getPermissions.useQuery({ userId: selectedUserId ?? 0 }, { enabled: Boolean(selectedUserId) });
  const updatePermissions = trpc.owner.updateProductPermissions.useMutation({ onSuccess: () => permissionsQuery.refetch() });
  const current = new Set((permissionsQuery.data ?? []).filter(item => item.granted).map(item => item.permission));
  const selected = users.find(user => user.id === selectedUserId);
  const save = (permission: string, granted: boolean) => {
    const next = new Set(current);
    if (granted) next.add(permission); else next.delete(permission);
    updatePermissions.mutate({ userId: selectedUserId!, permissions: productPermissions.map(item => ({ permission: item.key, granted: next.has(item.key) })) });
  };
  return <Card><CardHeader><CardTitle>Product permissions</CardTitle><CardDescription>Owner controls each product action independently. Archive is preferred over permanent deletion.</CardDescription></CardHeader><CardContent className="space-y-4"><Select value={selectedUserId ? String(selectedUserId) : ""} onValueChange={value => setSelectedUserId(Number(value))}><SelectTrigger><SelectValue placeholder="Choose a user" /></SelectTrigger><SelectContent>{users.filter(user => user.role !== "owner").map(user => <SelectItem key={user.id} value={String(user.id)}>{user.name || user.email || `User ${user.id}`} — {roleLabels[user.role as Role] ?? user.role}</SelectItem>)}</SelectContent></Select>{selected ? <div className="space-y-3 rounded-2xl border p-4"><div><p className="font-semibold">{selected.name || "Unnamed user"}</p><p className="text-sm text-slate-500">{selected.email}</p></div>{productPermissions.map(item => <label key={item.key} className="flex cursor-pointer items-start gap-3 rounded-xl border p-3"><input type="checkbox" className="mt-1 h-4 w-4 accent-cyan-600" checked={current.has(item.key)} disabled={permissionsQuery.isLoading || updatePermissions.isPending} onChange={event => save(item.key, event.target.checked)} /><span><span className="block text-sm font-medium">{item.label}</span><span className="block text-xs text-slate-500">{item.description}</span></span></label>)}</div> : <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">Select a non-Owner account to manage product permissions.</p>}</CardContent></Card>;
}

function ServicePermissionEditor({ users }: { users: Array<{ id: number; name: string | null; email: string | null; role: string }> }) {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const permissionsQuery = trpc.owner.getPermissions.useQuery({ userId: selectedUserId ?? 0 }, { enabled: Boolean(selectedUserId) });
  const updatePermissions = trpc.owner.updateServicePermissions.useMutation({ onSuccess: () => permissionsQuery.refetch() });
  const current = new Set((permissionsQuery.data ?? []).filter(item => item.granted).map(item => item.permission));
  const selected = users.find(user => user.id === selectedUserId);
  const save = (permission: string, granted: boolean) => {
    const next = new Set(current);
    if (granted) next.add(permission); else next.delete(permission);
    updatePermissions.mutate({ userId: selectedUserId!, permissions: servicePermissions.map(item => ({ permission: item.key, granted: next.has(item.key) })) });
  };
  return <Card><CardHeader><CardTitle>Service permissions</CardTitle><CardDescription>Control service content, quality approval, publication and safe removal independently.</CardDescription></CardHeader><CardContent className="space-y-4"><Select value={selectedUserId ? String(selectedUserId) : ""} onValueChange={value => setSelectedUserId(Number(value))}><SelectTrigger><SelectValue placeholder="Choose a user" /></SelectTrigger><SelectContent>{users.filter(user => user.role !== "owner").map(user => <SelectItem key={user.id} value={String(user.id)}>{user.name || user.email || `User ${user.id}`} — {roleLabels[user.role as Role] ?? user.role}</SelectItem>)}</SelectContent></Select>{selected ? <div className="space-y-3 rounded-2xl border p-4"><div><p className="font-semibold">{selected.name || "Unnamed user"}</p><p className="text-sm text-slate-500">{selected.email}</p></div>{servicePermissions.map(item => <label key={item.key} className="flex cursor-pointer items-start gap-3 rounded-xl border p-3"><input type="checkbox" className="mt-1 h-4 w-4 accent-cyan-600" checked={current.has(item.key)} disabled={permissionsQuery.isLoading || updatePermissions.isPending} onChange={event => save(item.key, event.target.checked)} /><span><span className="block text-sm font-medium">{item.label}</span><span className="block text-xs text-slate-500">{item.description}</span></span></label>)}</div> : <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">Select a non-Owner account to manage service permissions.</p>}</CardContent></Card>;
}

function QuotePermissionEditor({ users }: { users: Array<{ id: number; name: string | null; email: string | null; role: string }> }) {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const permissionsQuery = trpc.owner.getPermissions.useQuery({ userId: selectedUserId ?? 0 }, { enabled: Boolean(selectedUserId) });
  const updatePermissions = trpc.owner.updateQuotePermissions.useMutation({ onSuccess: () => permissionsQuery.refetch() });
  const current = new Set((permissionsQuery.data ?? []).filter(item => item.granted).map(item => item.permission));
  const selected = users.find(user => user.id === selectedUserId);
  const save = (permission: string, granted: boolean) => { const next = new Set(current); if (granted) next.add(permission); else next.delete(permission); updatePermissions.mutate({ userId: selectedUserId!, permissions: quotePermissions.map(item => ({ permission: item.key, granted: next.has(item.key) })) }); };
  return <Card><CardHeader><CardTitle>Quote request permissions</CardTitle><CardDescription>Owner controls who can see, assign, update, close and delete commercial requests.</CardDescription></CardHeader><CardContent className="space-y-4"><Select value={selectedUserId ? String(selectedUserId) : ""} onValueChange={value => setSelectedUserId(Number(value))}><SelectTrigger><SelectValue placeholder="Choose a user" /></SelectTrigger><SelectContent>{users.filter(user => user.role !== "owner").map(user => <SelectItem key={user.id} value={String(user.id)}>{user.name || user.email || `User ${user.id}`} — {roleLabels[user.role as Role] ?? user.role}</SelectItem>)}</SelectContent></Select>{selected ? <div className="space-y-3 rounded-2xl border p-4"><div><p className="font-semibold">{selected.name || "Unnamed user"}</p><p className="text-sm text-slate-500">{selected.email}</p></div>{quotePermissions.map(item => <label key={item.key} className="flex cursor-pointer items-start gap-3 rounded-xl border p-3"><input type="checkbox" className="mt-1 h-4 w-4 accent-cyan-600" checked={current.has(item.key)} disabled={permissionsQuery.isLoading || updatePermissions.isPending} onChange={event => save(item.key, event.target.checked)} /><span><span className="block text-sm font-medium">{item.label}</span><span className="block text-xs text-slate-500">{item.description}</span></span></label>)}</div> : <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">Select a non-Owner account to manage quote request permissions.</p>}</CardContent></Card>;
}

function ServiceRequestPermissionEditor({ users }: { users: Array<{ id: number; name: string | null; email: string | null; role: string }> }) {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const permissionsQuery = trpc.owner.getPermissions.useQuery({ userId: selectedUserId ?? 0 }, { enabled: Boolean(selectedUserId) });
  const updatePermissions = trpc.owner.updateServiceRequestPermissions.useMutation({ onSuccess: () => permissionsQuery.refetch() });
  const current = new Set((permissionsQuery.data ?? []).filter(item => item.granted).map(item => item.permission));
  const selected = users.find(user => user.id === selectedUserId);
  const save = (permission: string, granted: boolean) => { const next = new Set(current); if (granted) next.add(permission); else next.delete(permission); updatePermissions.mutate({ userId: selectedUserId!, permissions: serviceRequestPermissions.map(item => ({ permission: item.key, granted: next.has(item.key) })) }); };
  return <Card><CardHeader><CardTitle>Service request permissions</CardTitle><CardDescription>Owner controls who can view equipment evidence, assign technicians, manage status and close requests.</CardDescription></CardHeader><CardContent className="space-y-4"><Select value={selectedUserId ? String(selectedUserId) : ""} onValueChange={value => setSelectedUserId(Number(value))}><SelectTrigger><SelectValue placeholder="Choose a user" /></SelectTrigger><SelectContent>{users.filter(user => user.role !== "owner").map(user => <SelectItem key={user.id} value={String(user.id)}>{user.name || user.email || `User ${user.id}`} — {roleLabels[user.role as Role] ?? user.role}</SelectItem>)}</SelectContent></Select>{selected ? <div className="space-y-3 rounded-2xl border p-4"><div><p className="font-semibold">{selected.name || "Unnamed user"}</p><p className="text-sm text-slate-500">{selected.email}</p></div>{serviceRequestPermissions.map(item => <label key={item.key} className="flex cursor-pointer items-start gap-3 rounded-xl border p-3"><input type="checkbox" className="mt-1 h-4 w-4 accent-cyan-600" checked={current.has(item.key)} disabled={permissionsQuery.isLoading || updatePermissions.isPending} onChange={event => save(item.key, event.target.checked)} /><span><span className="block text-sm font-medium">{item.label}</span><span className="block text-xs text-slate-500">{item.description}</span></span></label>)}</div> : <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">Select a non-Owner account to manage service request permissions.</p>}</CardContent></Card>;
}

function generatePassword() {
  return `SPM-${crypto.randomUUID().replaceAll("-", "").slice(0, 10)}!Aa9`;
}

function FirstLoginPasswordChange({ onComplete }: { onComplete: () => void }) {
  const changePassword = trpc.auth.changePassword.useMutation({ onSuccess: onComplete });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  return <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6"><Card className="w-full max-w-md"><CardHeader><CardTitle>Change your temporary password</CardTitle><CardDescription>This is required before using the SPM workspace.</CardDescription></CardHeader><CardContent><form className="space-y-4" onSubmit={event => { event.preventDefault(); setError(""); changePassword.mutate({ currentPassword, newPassword }, { onError: err => setError(err.message) }); }}><div className="space-y-2"><Label htmlFor="current-password">Temporary password</Label><Input id="current-password" type="password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required /></div><div className="space-y-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" value={newPassword} onChange={event => setNewPassword(event.target.value)} placeholder="12+ chars, upper/lower/number/symbol" required /></div>{error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}<Button className="w-full" disabled={changePassword.isPending}>{changePassword.isPending ? "Saving…" : "Save new password"}</Button></form></CardContent></Card></div>;
}

function ContentPermissionEditor({ users }: { users: Array<{ id: number; name: string | null; email: string | null; role: string }> }) {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const permissionsQuery = trpc.owner.getPermissions.useQuery({ userId: selectedUserId ?? 0 }, { enabled: Boolean(selectedUserId) });
  const updatePermissions = trpc.owner.updateContentPermissions.useMutation({ onSuccess: () => permissionsQuery.refetch() });
  const current = new Set((permissionsQuery.data ?? []).filter(item => item.granted).map(item => item.permission));
  const selected = users.find(user => user.id === selectedUserId);
  const save = (permission: string, granted: boolean) => { const next = new Set(current); if (granted) next.add(permission); else next.delete(permission); updatePermissions.mutate({ userId: selectedUserId!, permissions: contentPermissions.map(item => ({ permission: item.key, granted: next.has(item.key) })) }); };
  return <Card><CardHeader><CardTitle>Content workspace permissions</CardTitle><CardDescription>Owner decides who can edit, review, upload and publish public content.</CardDescription></CardHeader><CardContent className="space-y-4"><Select value={selectedUserId ? String(selectedUserId) : ""} onValueChange={value => setSelectedUserId(Number(value))}><SelectTrigger><SelectValue placeholder="Choose a user" /></SelectTrigger><SelectContent>{users.filter(user => user.role !== "owner").map(user => <SelectItem key={user.id} value={String(user.id)}>{user.name || user.email || `User ${user.id}`} — {roleLabels[user.role as Role] ?? user.role}</SelectItem>)}</SelectContent></Select>{selected ? <div className="space-y-3 rounded-2xl border p-4"><div><p className="font-semibold">{selected.name || "Unnamed user"}</p><p className="text-sm text-slate-500">{selected.email}</p></div>{contentPermissions.map(item => <label key={item.key} className="flex cursor-pointer items-start gap-3 rounded-xl border p-3"><input type="checkbox" className="mt-1 h-4 w-4 accent-cyan-600" checked={current.has(item.key)} disabled={permissionsQuery.isLoading || updatePermissions.isPending} onChange={event => save(item.key, event.target.checked)} /><span><span className="block text-sm font-medium">{item.label}</span><span className="block text-xs text-slate-500">{item.description}</span></span></label>)}</div> : <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">Select a non-Owner account to manage content permissions.</p>}</CardContent></Card>;
}

function AuditLogPanel() {
  const logs = trpc.owner.listAuditLogs.useQuery({ limit: 120 });
  return <Card>
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-cyan-600" />User activity and audit trail</CardTitle><CardDescription>Owner-only history of sign-ins, content changes, permission updates, requests and catalogue actions.</CardDescription></div>
        <Button variant="outline" size="sm" onClick={() => logs.refetch()} disabled={logs.isFetching}><RefreshCw className={`mr-2 h-4 w-4 ${logs.isFetching ? "animate-spin" : ""}`} />Refresh</Button>
      </div>
    </CardHeader>
    <CardContent>
      {logs.isLoading ? <p className="py-8 text-center text-sm text-slate-500">Loading audit trail…</p> : logs.error ? <Alert variant="destructive"><AlertDescription>Unable to load the audit trail.</AlertDescription></Alert> : <div className="max-h-[520px] overflow-auto rounded-xl border"><div className="divide-y">{(logs.data ?? []).map(log => <div key={log.id} className="grid gap-2 px-4 py-3 text-sm md:grid-cols-[180px_1fr_150px] md:items-center"><div><p className="font-medium text-slate-800">{log.actorName || log.actorEmail || `User ${log.actorUserId ?? "system"}`}</p><p className="text-xs text-slate-500">{log.actorEmail || ""}</p></div><div><p className="font-medium text-[#0a4052]">{log.action.replaceAll("_", " ")}</p><p className="text-xs text-slate-500">{log.entityType}{log.entityId ? ` · ${log.entityId}` : ""}{log.metadata ? ` · ${log.metadata.slice(0, 160)}` : ""}</p></div><p className="text-xs text-slate-500 md:text-right">{new Date(log.createdAt).toLocaleString()}</p></div>)}{(logs.data ?? []).length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No activity has been recorded yet.</p> : null}</div></div>}
    </CardContent>
  </Card>;
}

export default function OwnerDashboard() {
  const [, setLocation] = useLocation();
  const auth = trpc.auth.me.useQuery();
  const homepageDraftAccess = trpc.homepage.draft.useQuery(undefined, { enabled: Boolean(auth.data) });
  const cmsAccess = trpc.cms.permissions.useQuery(undefined, { enabled: Boolean(auth.data) });
  const users = trpc.owner.listUsers.useQuery(undefined, { enabled: auth.data?.role === "owner" });
  const utils = trpc.useUtils();
  const logout = trpc.auth.logout.useMutation({ onSuccess: () => setLocation("/login") });
  const createUser = trpc.owner.createUser.useMutation({ onSuccess: () => { utils.owner.listUsers.invalidate(); setMessage("User created. Give the temporary password directly to the user."); setForm({ name: "", email: "", role: "marketing", password: "" }); }, onError: err => setMessage(err.message) });
  const updateUser = trpc.owner.updateUser.useMutation({ onSuccess: () => utils.owner.listUsers.invalidate(), onError: err => setMessage(err.message) });
  const resetPassword = trpc.owner.resetPassword.useMutation({ onSuccess: () => { utils.owner.listUsers.invalidate(); setMessage("Password reset. Give the temporary password directly to the user."); }, onError: err => setMessage(err.message) });
  const [form, setForm] = useState({ name: "", email: "", role: "marketing" as Role, password: "" });
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => { if (!auth.isLoading && !auth.data) setLocation("/login"); }, [auth.isLoading, auth.data, setLocation]);

  const filteredUsers = useMemo(() => (users.data ?? []).filter(user => `${user.name ?? ""} ${user.email ?? ""} ${user.role}`.toLowerCase().includes(search.toLowerCase())), [users.data, search]);
  const role = auth.data?.role;
  const isOwner = role === "owner";
  const isManager = role === "manager";
  const canAccessHomepage = isOwner || homepageDraftAccess.isSuccess;
  const canAccessContent = isOwner || Boolean(cmsAccess.data?.includes("content.view"));
  if (auth.isLoading || (auth.data && isOwner && users.isLoading) || (auth.data && homepageDraftAccess.isLoading) || (auth.data && cmsAccess.isLoading)) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Loading SPM workspace…</div>;
  if (!auth.data) return null;
  if (auth.data.mustChangePassword) return <FirstLoginPasswordChange onComplete={() => auth.refetch()} />;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">SPM control center</p><h1 className="text-xl font-semibold tracking-tight">{isOwner ? "Owner Dashboard" : `${roleLabels[role as Role] ?? "Internal"} Workspace`}</h1></div></div>
          <div className="flex items-center gap-3"><Badge variant="outline" className="border-cyan-200 bg-cyan-50 text-cyan-800"><LockKeyhole className="mr-1 h-3 w-3" /> {roleLabels[role as Role] ?? role}</Badge><Button variant="ghost" onClick={() => logout.mutate()}><LogOut className="mr-2 h-4 w-4" />Sign out</Button></div>
        </div>
      </header>
      <main className="mx-auto max-w-[1500px] space-y-6 px-6 py-8">
        {isOwner ? <section className="grid gap-4 md:grid-cols-3"><Card><CardContent className="flex items-center gap-4 p-5"><Users className="h-8 w-8 text-cyan-600" /><div><p className="text-sm text-slate-500">Accounts</p><p className="text-3xl font-semibold">{users.data?.length ?? 0}</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-4 p-5"><ShieldCheck className="h-8 w-8 text-emerald-600" /><div><p className="text-sm text-slate-500">Active accounts</p><p className="text-3xl font-semibold">{users.data?.filter(user => user.isActive).length ?? 0}</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-4 p-5"><Power className="h-8 w-8 text-amber-600" /><div><p className="text-sm text-slate-500">Inactive accounts</p><p className="text-3xl font-semibold">{users.data?.filter(user => !user.isActive).length ?? 0}</p></div></CardContent></Card></section> : null}
        {isOwner ? <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <Card className="h-fit"><CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-cyan-600" />Create account</CardTitle><CardDescription>The Owner sets the initial password. The user must change it after first sign in.</CardDescription></CardHeader><CardContent><form className="space-y-4" onSubmit={event => { event.preventDefault(); setMessage(""); createUser.mutate({ ...form }); }}><div className="space-y-2"><Label htmlFor="user-name">Full name</Label><Input id="user-name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required /></div><div className="space-y-2"><Label htmlFor="user-email">Email</Label><Input id="user-email" type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} required /></div><div className="space-y-2"><Label>Role</Label><Select value={form.role} onValueChange={value => setForm({ ...form, role: value as Role })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{roles.map(role => <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="user-password">Initial password</Label><div className="flex gap-2"><Input id="user-password" type="password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} placeholder="12+ chars, upper/lower/number/symbol" required /><Button type="button" variant="outline" size="icon" aria-label="Generate password" onClick={() => setForm({ ...form, password: generatePassword() })}><KeyRound className="h-4 w-4" /></Button></div></div><Button className="w-full" disabled={createUser.isPending}>{createUser.isPending ? "Creating…" : "Create account"}</Button></form></CardContent></Card>
          <Card><CardHeader><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>People and permissions</CardTitle><CardDescription>Only the Owner can create, deactivate, reset and assign roles.</CardDescription></div><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input className="pl-9" placeholder="Search users" value={search} onChange={event => setSearch(event.target.value)} /></div></div></CardHeader><CardContent className="space-y-3">{message ? <Alert><AlertDescription>{message}</AlertDescription></Alert> : null}{filteredUsers.map(user => <div key={user.id} className="rounded-2xl border bg-white p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{user.name || "Unnamed user"}</p><Badge variant={user.isActive ? "secondary" : "outline"}>{user.isActive ? "Active" : "Inactive"}</Badge><Badge variant="outline">{roleLabels[user.role as Role] ?? user.role}</Badge>{user.mustChangePassword ? <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Password change required</Badge> : null}</div><p className="mt-1 truncate text-sm text-slate-500">{user.email}</p></div><div className="flex flex-wrap gap-2"><Select value={user.role} onValueChange={value => updateUser.mutate({ id: user.id, role: value as Role })}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent>{roles.map(role => <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>)}</SelectContent></Select><Button variant="outline" onClick={() => { const password = window.prompt("Enter the new temporary password. It will not be shown again:"); if (password) resetPassword.mutate({ id: user.id, password }); }}><KeyRound className="mr-2 h-4 w-4" />Reset password</Button>{user.role !== "owner" ? <Button variant={user.isActive ? "outline" : "default"} onClick={() => updateUser.mutate({ id: user.id, isActive: !user.isActive })}><Power className="mr-2 h-4 w-4" />{user.isActive ? "Deactivate" : "Activate"}</Button> : null}</div></div><Separator className="my-4" /><p className="text-xs text-slate-500">Last sign in: {user.lastSignedIn ? new Date(user.lastSignedIn).toLocaleString() : "Never"}</p></div>)}{filteredUsers.length === 0 ? <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">No users match this search.</div> : null}</CardContent></Card>
        </div> : null}
        <div className="flex flex-wrap justify-end gap-2"><Link href="/owner/products"><Button><PackagePlus className="mr-2 h-4 w-4" />Manage Products</Button></Link><Link href="/owner/services"><Button variant="outline"><Wrench className="mr-2 h-4 w-4" />Manage Services</Button></Link><Link href="/owner/quotes"><Button variant="outline"><ClipboardList className="mr-2 h-4 w-4" />Manage Quotes</Button></Link><Link href="/owner/service-requests"><Button variant="outline"><Wrench className="mr-2 h-4 w-4" />Manage Service Requests</Button></Link></div>
        {canAccessHomepage ? <HomepageEditor /> : <Card><CardHeader><CardTitle>Homepage access</CardTitle><CardDescription>Homepage draft editing is restricted to the Owner and users granted the homepage.edit permission.</CardDescription></CardHeader></Card>}
        {canAccessContent ? <ContentWorkspace /> : null}
        {isOwner ? <PermissionEditor users={(users.data ?? []).map(user => ({ id: user.id, name: user.name, email: user.email, role: user.role }))} /> : null}
        {isOwner ? <ProductPermissionEditor users={(users.data ?? []).map(user => ({ id: user.id, name: user.name, email: user.email, role: user.role }))} /> : null}
        {isOwner ? <ServicePermissionEditor users={(users.data ?? []).map(user => ({ id: user.id, name: user.name, email: user.email, role: user.role }))} /> : null}
        {isOwner ? <QuotePermissionEditor users={(users.data ?? []).map(user => ({ id: user.id, name: user.name, email: user.email, role: user.role }))} /> : null}
        {isOwner ? <ServiceRequestPermissionEditor users={(users.data ?? []).map(user => ({ id: user.id, name: user.name, email: user.email, role: user.role }))} /> : null}
        {isOwner ? <ContentPermissionEditor users={(users.data ?? []).map(user => ({ id: user.id, name: user.name, email: user.email, role: user.role }))} /> : null}
        {isOwner ? <AuditLogPanel /> : null}
        <div className="flex justify-end"><Link href="/"><Button variant="ghost">Back to public website</Button></Link></div>
      </main>
    </div>
  );
}
