import { Command, LifeBuoy } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="Go Links home">
          <span className="grid size-9 place-items-center rounded-xl bg-violet-600 text-white shadow-sm"><Command className="size-5" /></span>
          <span className="font-semibold tracking-tight text-slate-950">Go Links</span>
          <span className="hidden rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700 sm:inline">Internal</span>
        </a>
        <a href="mailto:it@example.com" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"><LifeBuoy className="size-4" /> Help</a>
      </div>
    </header>
  );
}
