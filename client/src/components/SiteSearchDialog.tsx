import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type SearchItem = { id: string; title: string; meta: string; href: string };

export default function SiteSearchDialog({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const results = useMemo(() => items.slice(0, 80), [items]);
  const go = (href: string) => {
    setOpen(false);
    setLocation(href);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Search products, services and spare parts"
        title="Search products, services and spare parts"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce7eb] bg-white text-[#0a4052] transition hover:border-[#0a4052] hover:bg-[#eaf4fa] focus-visible:ring-2 focus-visible:ring-[#0f6fae]"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search SPM" description="Search products, services and spare parts.">
        <CommandInput placeholder="Search products, services and spare parts…" />
        <CommandList>
          <CommandEmpty>No matching SPM content found.</CommandEmpty>
          <CommandGroup heading="SPM content">
            {results.map(item => (
              <CommandItem key={item.id} value={`${item.title} ${item.meta}`} onSelect={() => go(item.href)} className="min-h-11">
                <Search className="h-4 w-4" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                <span className="max-w-[40%] truncate text-xs text-[#64748b]">{item.meta}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
