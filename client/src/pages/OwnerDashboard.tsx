import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ShieldCheck, Users, UserPlus, KeyRound, Power, LogOut, Search, LockKeyhole } from "lucide-react";
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

const roles = ["owner", "manager", "marketing", "sales", "service", "qa", "ra", "user"] as const;
type Role = typeof roles[number];
const roleLabels: Record<Role, string> = { owner: "Owner", manager: "Manager", marketing: "Marketing", sales: "Sales", service: "Service", qa: "QA", ra: "RA", user: "User" };
const homepagePermissions = [
  { key: "homepage.edit", label: "Edit homepage draft", description: "Change texts, URLs, numbers and visibility." },
  { key: "homepage.media", label: "Upload homepage images", description: "Upload JPG, PNG or WebP media." },
  { key: "homepage.publish", label: "Publish homepage", description: "Move the approved draft to the public website." },
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

export default function OwnerDashboard() {
  const [, setLocation] = useLocation();
  const auth = trpc.auth.me.useQuery();
  const homepageDraftAccess = trpc.homepage.draft.useQuery(undefined, { enabled: Boolean(auth.data) });
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
  const isOwner = auth.data?.role === "owner";
  const canAccessHomepage = isOwner || homepageDraftAccess.isSuccess;
  if (auth.isLoading || (auth.data && isOwner && users.isLoading) || (auth.data && homepageDraftAccess.isLoading)) return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Loading SPM workspace…</div>;
  if (!auth.data) return null;
  if (!canAccessHomepage) return <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6"><Card><CardHeader><CardTitle>Homepage permission required</CardTitle><CardDescription>The Owner has not granted this account access to the homepage workspace.</CardDescription></CardHeader></Card></div>;
  if (auth.data.mustChangePassword) return <FirstLoginPasswordChange onComplete={() => auth.refetch()} />;

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">SPM control center</p><h1 className="text-xl font-semibold tracking-tight">Owner Dashboard</h1></div></div>
          <div className="flex items-center gap-3"><Badge variant="outline" className="border-cyan-200 bg-cyan-50 text-cyan-800"><LockKeyhole className="mr-1 h-3 w-3" /> Owner only</Badge><Button variant="ghost" onClick={() => logout.mutate()}><LogOut className="mr-2 h-4 w-4" />Sign out</Button></div>
        </div>
      </header>
      <main className="mx-auto max-w-[1500px] space-y-6 px-6 py-8">
        {isOwner ? <section className="grid gap-4 md:grid-cols-3"><Card><CardContent className="flex items-center gap-4 p-5"><Users className="h-8 w-8 text-cyan-600" /><div><p className="text-sm text-slate-500">Accounts</p><p className="text-3xl font-semibold">{users.data?.length ?? 0}</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-4 p-5"><ShieldCheck className="h-8 w-8 text-emerald-600" /><div><p className="text-sm text-slate-500">Active accounts</p><p className="text-3xl font-semibold">{users.data?.filter(user => user.isActive).length ?? 0}</p></div></CardContent></Card><Card><CardContent className="flex items-center gap-4 p-5"><Power className="h-8 w-8 text-amber-600" /><div><p className="text-sm text-slate-500">Inactive accounts</p><p className="text-3xl font-semibold">{users.data?.filter(user => !user.isActive).length ?? 0}</p></div></CardContent></Card></section> : null}
        {isOwner ? <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          <Card className="h-fit"><CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-cyan-600" />Create account</CardTitle><CardDescription>The Owner sets the initial password. The user must change it after first sign in.</CardDescription></CardHeader><CardContent><form className="space-y-4" onSubmit={event => { event.preventDefault(); setMessage(""); createUser.mutate({ ...form }); }}><div className="space-y-2"><Label htmlFor="user-name">Full name</Label><Input id="user-name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required /></div><div className="space-y-2"><Label htmlFor="user-email">Email</Label><Input id="user-email" type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} required /></div><div className="space-y-2"><Label>Role</Label><Select value={form.role} onValueChange={value => setForm({ ...form, role: value as Role })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{roles.map(role => <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="user-password">Initial password</Label><div className="flex gap-2"><Input id="user-password" type="password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} placeholder="12+ chars, upper/lower/number/symbol" required /><Button type="button" variant="outline" size="icon" aria-label="Generate password" onClick={() => setForm({ ...form, password: generatePassword() })}><KeyRound className="h-4 w-4" /></Button></div></div><Button className="w-full" disabled={createUser.isPending}>{createUser.isPending ? "Creating…" : "Create account"}</Button></form></CardContent></Card>
          <Card><CardHeader><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>People and permissions</CardTitle><CardDescription>Only the Owner can create, deactivate, reset and assign roles.</CardDescription></div><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input className="pl-9" placeholder="Search users" value={search} onChange={event => setSearch(event.target.value)} /></div></div></CardHeader><CardContent className="space-y-3">{message ? <Alert><AlertDescription>{message}</AlertDescription></Alert> : null}{filteredUsers.map(user => <div key={user.id} className="rounded-2xl border bg-white p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{user.name || "Unnamed user"}</p><Badge variant={user.isActive ? "secondary" : "outline"}>{user.isActive ? "Active" : "Inactive"}</Badge><Badge variant="outline">{roleLabels[user.role as Role] ?? user.role}</Badge>{user.mustChangePassword ? <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Password change required</Badge> : null}</div><p className="mt-1 truncate text-sm text-slate-500">{user.email}</p></div><div className="flex flex-wrap gap-2"><Select value={user.role} onValueChange={value => updateUser.mutate({ id: user.id, role: value as Role })}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent>{roles.map(role => <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>)}</SelectContent></Select><Button variant="outline" onClick={() => { const password = window.prompt("Enter the new temporary password. It will not be shown again:"); if (password) resetPassword.mutate({ id: user.id, password }); }}><KeyRound className="mr-2 h-4 w-4" />Reset password</Button>{user.role !== "owner" ? <Button variant={user.isActive ? "outline" : "default"} onClick={() => updateUser.mutate({ id: user.id, isActive: !user.isActive })}><Power className="mr-2 h-4 w-4" />{user.isActive ? "Deactivate" : "Activate"}</Button> : null}</div></div><Separator className="my-4" /><p className="text-xs text-slate-500">Last sign in: {user.lastSignedIn ? new Date(user.lastSignedIn).toLocaleString() : "Never"}</p></div>)}{filteredUsers.length === 0 ? <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-slate-500">No users match this search.</div> : null}</CardContent></Card>
        </div> : null}
        <HomepageEditor />
        {isOwner ? <PermissionEditor users={(users.data ?? []).map(user => ({ id: user.id, name: user.name, email: user.email, role: user.role }))} /> : null}
        <div className="flex justify-end"><Link href="/"><Button variant="ghost">Back to public website</Button></Link></div>
      </main>
    </div>
  );
}
