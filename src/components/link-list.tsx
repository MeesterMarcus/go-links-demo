"use client";

import type { Link as LinkModel } from "@prisma/client";
import { Check, Copy, ExternalLink, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LinkList({ links }: { links: LinkModel[] }) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const visibleLinks = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return needle ? links.filter((link) => `${link.slug} ${link.description ?? ""} ${link.destination}`.toLowerCase().includes(needle)) : links;
  }, [links, query]);

  async function copyShortcut(slug: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/go/${slug}`);
    setCopied(slug);
    window.setTimeout(() => setCopied(null), 1600);
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div><h2 className="font-semibold text-slate-950">Team shortcuts</h2><p className="mt-1 text-sm text-slate-500">{links.length} links, ready when you are</p></div>
        <div className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input className="h-10 pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search shortcuts…" aria-label="Search shortcuts" /></div>
      </div>
      <div className="divide-y divide-slate-100">
        {visibleLinks.map((link) => (
          <article key={link.id} className="group flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center sm:px-6">
            <div className="min-w-0 flex-1">
              <a className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-violet-700 hover:text-violet-900 hover:underline" href={`/go/${link.slug}`} target="_blank">go/{link.slug}<ExternalLink className="size-3.5" /></a>
              <p className="mt-1 truncate text-sm text-slate-600">{link.description ?? link.destination}</p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <span className="text-xs tabular-nums text-slate-400">{link.visits.toLocaleString()} visits</span>
              <Button variant="outline" size="icon" onClick={() => copyShortcut(link.slug)} aria-label={`Copy go/${link.slug}`}>{copied === link.slug ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}</Button>
            </div>
          </article>
        ))}
        {visibleLinks.length === 0 && <div className="p-12 text-center text-sm text-slate-500">No shortcuts match “{query}”.</div>}
      </div>
    </Card>
  );
}
