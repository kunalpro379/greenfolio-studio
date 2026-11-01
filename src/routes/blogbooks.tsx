import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookPlus, Check, GripVertical, Plus } from "lucide-react";
import { books, posts } from "@/lib/data";
import { CoverArt } from "@/components/CoverArt";

export const Route = createFileRoute("/blogbooks")({
  head: () => ({
    meta: [
      { title: "Blogbooks & Guides — Verdant" },
      { name: "description", content: "Bind blog posts into guided books readers can follow chapter by chapter." },
      { property: "og:title", content: "Blogbooks & Guides — Verdant" },
      { property: "og:description", content: "Turn blog posts into chapter-by-chapter guides." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Blogbooks,
});

function Blogbooks() {
  const [picked, setPicked] = useState<string[]>([posts[0]!.slug, posts[4]!.slug]);
  const [title, setTitle] = useState("My System Design Guide");
  const toggle = (s: string) => setPicked(picked.includes(s) ? picked.filter((x) => x !== s) : [...picked, s]);

  return (
    <main className="mx-auto max-w-[1400px] px-6 pt-12">
      <p className="eyebrow">Blogbooks</p>
      <h1 className="mt-3 max-w-4xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.1] tracking-tight text-ink"><span className="font-bold">Bind your posts</span> <span className="font-serif">into guides people actually finish.</span></h1>

      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {books.map((b, i) => (
          <article key={b.slug} className="group animate-rise" style={{ animationDelay: `${i * 70}ms` }}>
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[260px] overflow-hidden rounded-r-xl rounded-l-sm shadow-lift transition duration-500 group-hover:-translate-y-2 group-hover:rotate-[-1deg]">
              <CoverArt seed={b.seed} className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-y-0 left-0 w-3 bg-ink/25" />
              <div className="absolute inset-x-4 bottom-4 rounded-lg bg-paper/92 p-4 backdrop-blur">
                <h3 className="font-serif text-xl leading-tight text-ink">{b.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{b.author}</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">{b.subtitle}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-leaf-500" style={{ width: `${b.progress}%` }} /></div>
            <p className="mt-2 font-mono text-xs text-muted-foreground">{b.chapters.length} chapters · {b.progress}% read</p>
          </article>
        ))}
      </div>

      <section className="mt-24 grid gap-8 rounded-3xl border border-border bg-paper/85 p-8 shadow-soft lg:grid-cols-[1fr_380px] md:p-12">
        <div>
          <div className="flex items-center gap-3"><BookPlus className="h-6 w-6 text-leaf-600" /><h2 className="text-2xl font-bold text-ink">Create a blogbook</h2></div>
          <p className="mt-2 text-muted-foreground">Pick posts to become chapters. Order them, add a title, and publish your guide.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {posts.map((p) => {
              const on = picked.includes(p.slug);
              return (
                <button key={p.slug} onClick={() => toggle(p.slug)} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${on ? "border-leaf-500 bg-accent" : "border-border hover:bg-muted"}`}>
                  <CoverArt seed={p.seed} className="h-12 w-16 shrink-0 rounded" />
                  <span className="flex-1 text-sm font-medium leading-snug text-ink">{p.title}</span>
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 text-muted-foreground" />}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl bg-ink p-6 text-primary-foreground">
          <p className="eyebrow !text-leaf-300">Table of contents</p>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-3 w-full bg-transparent font-serif text-3xl leading-tight outline-none" />
          <ol className="mt-6 space-y-2">
            {picked.map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-lg bg-primary-foreground/5 px-3 py-2.5 text-sm">
                <GripVertical className="h-4 w-4 text-leaf-300" />
                <span className="font-mono text-xs text-leaf-300">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 truncate">{posts.find((p) => p.slug === s)?.title}</span>
              </li>
            ))}
            {picked.length === 0 && <li className="text-sm text-leaf-200">Select posts to add chapters.</li>}
          </ol>
          <button className="mt-6 w-full rounded-full bg-leaf-300 py-2.5 font-semibold text-ink hover:bg-leaf-200">Publish blogbook</button>
        </div>
      </section>
    </main>
  );
}
