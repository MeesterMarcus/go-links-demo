import { AlertCircle, ArrowUpRight, Zap } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { CreateLinkForm } from "@/components/create-link-form";
import { LinkList } from "@/components/link-list";
import { listLinks } from "@/lib/links";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ missing?: string }> }) {
  const [links, params] = await Promise.all([listLinks(), searchParams]);
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {params.missing && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert"><AlertCircle className="mt-0.5 size-4 shrink-0" /><p><span className="font-semibold">go/{params.missing}</span> doesn’t exist yet. Create it below so your team can find it next time.</p></div>
        )}
        <section className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700"><Zap className="size-3.5 fill-current" /> Move faster together</div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">One short path to<br className="hidden sm:block" /> anywhere your team works.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">Turn long, forgettable URLs into shortcuts everyone can remember. Type <span className="font-mono text-violet-700">go/</span>, stay in flow.</p>
          </div>
          <CreateLinkForm />
        </section>
        <div className="space-y-6">
          <LinkList links={links} />
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400"><ArrowUpRight className="size-3.5" /> Tip: bookmark this page for quick access from any device.</div>
        </div>
      </main>
    </div>
  );
}
