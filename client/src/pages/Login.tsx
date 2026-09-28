import { useState } from "react";
import { useLocation } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const utils = trpc.useUtils();
  const login = trpc.auth.login.useMutation({
    onSuccess: async (result) => {
      const user = await utils.auth.me.fetch();
      if (user?.role === "marketing") {
        setLocation("/owner/products");
      } else {
        setLocation("/owner");
      }
    },
    onError: (err) => setError(err.message),
  });

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <section>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">SPM / Internal Access</p>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">A controlled workspace for the people behind SPM.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">Sign in to manage users, roles, permissions, content and operational records. Passwords are controlled by the Owner and never displayed after creation.</p>
        </section>
        <Card className="border-slate-800 bg-white text-slate-950 shadow-2xl">
          <CardHeader>
            <CardTitle>Internal sign in</CardTitle>
            <CardDescription>Use the account created by the Owner.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); setError(""); login.mutate({ email, password }); }}>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div>
              {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
              <Button className="w-full" disabled={login.isPending}>{login.isPending ? "Signing in…" : "Sign in"}</Button>
              <p className="text-center text-xs text-slate-500">Password recovery will use the approved user email workflow.</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
