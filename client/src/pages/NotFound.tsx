import { AlertCircle, ArrowRight, Home, Search } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead from "@/components/SEOHead";
import SiteChrome from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <SEOHead title="Page Not Found" description="The SPM page you requested could not be found." url="/404" />
      <main className="flex min-h-[65vh] w-full items-center justify-center bg-gradient-to-br from-[#f7fafc] to-[#eaf4fa] px-5 py-16">
        <Card className="w-full max-w-lg border-[#dce7eb] bg-white shadow-lg">
          <CardContent className="p-8 text-center sm:p-12">
            <div className="mb-6 flex justify-center"><div className="relative rounded-full bg-[#fff1ed] p-4"><AlertCircle className="relative h-12 w-12 text-[#c2410c]" aria-hidden="true" /></div></div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0f6fae]">SPM navigation</p>
            <h1 className="mt-3 text-5xl font-extrabold text-[#0a4052]">404</h1>
            <h2 className="mt-2 text-xl font-bold text-[#17212b]">Page not found</h2>
            <p className="mt-4 leading-7 text-[#617180]">This page may have moved or the address may be incomplete. Try the main navigation or browse the equipment catalogue.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/"><Button className="w-full bg-[#0a4052] text-white hover:bg-[#063545] sm:w-auto"><Home className="mr-2 h-4 w-4" aria-hidden="true" />Go home</Button></Link><Link href="/catalogue"><Button variant="outline" className="w-full border-[#0a4052] text-[#0a4052] sm:w-auto"><Search className="mr-2 h-4 w-4" aria-hidden="true" />Browse catalogue</Button></Link></div>
          </CardContent>
        </Card>
      </main>
    </SiteChrome>
  );
}
