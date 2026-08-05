"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createLinkSchema, type CreateLinkInput } from "@/lib/validation/link";

export function CreateLinkForm() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<CreateLinkInput>({ resolver: zodResolver(createLinkSchema), defaultValues: { slug: "", destination: "", description: "" } });

  async function onSubmit(values: CreateLinkInput) {
    const response = await fetch("/api/links", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 409) setError("slug", { message: result.error });
      else toast.error(result.error ?? "Could not create the shortcut");
      return;
    }
    toast.success(`go/${result.data.slug} is ready`);
    reset();
    setExpanded(false);
    router.refresh();
  }

  if (!expanded) return <Button onClick={() => setExpanded(true)}><Plus className="size-4" /> New shortcut</Button>;

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div><h2 className="text-lg font-semibold text-slate-950">Create a shortcut</h2><p className="mt-1 text-sm text-slate-500">Give your team a memorable path to the places they use most.</p></div>
        <Button type="button" variant="ghost" size="sm" onClick={() => setExpanded(false)}>Cancel</Button>
      </div>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Shortcut" error={errors.slug?.message} htmlFor="slug">
          <div className="flex"><span className="flex h-11 items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-500">go/</span><Input id="slug" className="rounded-l-none font-mono" placeholder="team-handbook" autoComplete="off" {...register("slug")} /></div>
        </Field>
        <Field label="Destination URL" error={errors.destination?.message} htmlFor="destination"><Input id="destination" placeholder="https://…" inputMode="url" {...register("destination")} /></Field>
        <Field label="Description (optional)" error={errors.description?.message} htmlFor="description" className="md:col-span-2"><Input id="description" placeholder="What will teammates find here?" {...register("description")} /></Field>
        <div className="flex justify-end md:col-span-2"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}Create shortcut</Button></div>
      </form>
    </Card>
  );
}

function Field({ label, error, htmlFor, className, children }: { label: string; error?: string; htmlFor: string; className?: string; children: ReactNode }) {
  return <div className={className}><Label htmlFor={htmlFor}>{label}</Label><div className="mt-1.5">{children}</div>{error && <p className="mt-1.5 text-sm text-red-600" role="alert">{error}</p>}</div>;
}
