import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Shuffle, Boxes, FolderOpen, BookOpen, PenLine } from "lucide-react";
import { posts, type Post } from "@/lib/data";
import { CoverArt } from "@/components/CoverArt";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verdant Blog — Engineering stories, drawn and written" },
      { name: "description", content: "Read engineering blogs, system design deep dives and diagrams from the Verdant community." },
      { property: "og:title", content: "Verdant Blog — Engineering stories" },
      { property: "og:description", content: "Engineering blogs, system design deep dives and diagrams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const layouts = ["gallery", "dashed", "magazine", "bento"] as const;
type Layout = (typeof layouts)[number];

function Authors({ names }: { names: string[] }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {names.map((n, i) => (
          <span key={n} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-paper text-[11px] font-semibold text-primary-foreground" style={{ background: `var(--leaf-${[500, 700, 400, 800][i % 4]})` }}>
            {n.split(" ").map((x) => x[0]).join("")}
          </span>
        ))}
      </div>
      <span className="text-sm text-ink">{names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0]}</span>
    </div>
  );
}

function Meta({ p }: { p: Post }) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="rounded-full bg-muted px-2 leading-5">···</span>
      <span>{p.tag}</span>
      <span>{p.date}</span>
    </div>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  const p = posts[i]!;
  return (
    <section className="mx-auto max-w-[1400px] px-6 pt-16">
      <h1 className="max-w-[1300px] text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[1.08] tracking-[-0.03em] text-ink">
        <span className="font-sans font-bold">Engineers on Verdant</span>{" "}
        <span className="mx-1 inline-flex h-[0.9em] w-[0.9em] translate-y-[0.1em] items-center justify-center rounded-xl bg-ink align-baseline text-primary-foreground"><Boxes className="h-[0.55em] w-[0.55em]" /></span>{" "}
        <span className="font-serif">write, draw and bind what they learn about building systems — then share it openly with everyone.</span>
      </h1>
      <div className="mt-20 grid gap-6 lg:grid-cols-[1fr_1.75fr]">
        <div key={i} className="flex flex-col justify-end border-t border-border pt-10 animate-rise">
          <Meta p={p} />
          <Link to="/blog/$slug" params={{ slug: p.slug }} className="mt-4 max-w-sm text-2xl font-bold leading-tight text-ink hover:text-leaf-700">{p.title}</Link>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">{p.excerpt}</p>
          <Link to="/blog/$slug" params={{ slug: p.slug }} className="pill mt-7 w-fit">Read more <ArrowRight className="h-3.5 w-3.5" /></Link>
          <div className="mt-12 flex items-center gap-6 font-mono text-xs text-muted-foreground">
            <button className="pill !p-1.5" onClick={() => setI((i + 2) % 3)} aria-label="Previous"><ArrowLeft className="h-4 w-4" /></button>
            0{i + 1} / 03
            <button className="pill !p-1.5" onClick={() => setI((i + 1) % 3)} aria-label="Next"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
        <Link to="/blog/$slug" params={{ slug: p.slug }} className="block overflow-hidden rounded-sm shadow-lift">
          <CoverArt seed={p.seed} className="aspect-[16/10] h-full w-full transition duration-700 hover:scale-[1.02]" />
        </Link>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-6">
      {posts.map((p, i) => (
        <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
          <div className="mb-3"><Meta p={p} /></div>
          <div className="overflow-hidden rounded-sm"><CoverArt seed={p.seed} className="aspect-[8/7] w-full transition duration-500 group-hover:scale-105" /></div>
          <h3 className="mt-4 text-[17px] font-bold leading-snug text-ink group-hover:text-leaf-700">{p.title}</h3>
        </Link>
      ))}
    </div>
  );
}

function Dashed() {
  return (
    <div className="grid border-t border-dashed border-border md:grid-cols-2">
      {posts.map((p, i) => (
        <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className={`group border-b border-dashed border-border p-8 md:p-12 animate-rise ${i % 2 === 0 ? "md:border-r" : ""}`} style={{ animationDelay: `${i * 50}ms` }}>
          <p className="eyebrow">{p.date}</p>
          <h3 className="mt-4 text-2xl font-medium leading-snug tracking-tight text-ink group-hover:text-leaf-700">{p.title}</h3>
          <p className="mt-4 leading-relaxed text-muted-foreground">{p.excerpt}</p>
          <div className="mt-6"><Authors names={p.authors} /></div>
        </Link>
      ))}
    </div>
  );
}

function Magazine() {
  const lead = posts[0]!;
  const rest = posts.slice(1);
  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <Link to="/blog/$slug" params={{ slug: lead.slug }} className="group animate-rise">
        <div className="overflow-hidden rounded-lg"><CoverArt seed={lead.seed + 4} className="aspect-[4/3] w-full transition duration-700 group-hover:scale-[1.03]" /></div>
        <p className="eyebrow mt-6">{lead.tag} · {lead.readTime}</p>
        <h3 className="mt-3 font-serif text-4xl leading-tight text-ink">{lead.title}</h3>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{lead.excerpt}</p>
      </Link>
      <div className="divide-y divide-dashed divide-border">
        {rest.map((p, i) => (
          <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group flex gap-5 py-5 first:pt-0 animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
            <CoverArt seed={p.seed} className="h-20 w-28 shrink-0 rounded" />
            <div>
              <p className="eyebrow">{p.date}</p>
              <h4 className="mt-1.5 font-semibold leading-snug text-ink group-hover:text-leaf-700">{p.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Bento() {
  const spans = ["md:col-span-2 md:row-span-2", "", "", "md:col-span-2", "", "md:row-span-2", "", "md:col-span-2", ""];
  return (
    <div className="grid auto-rows-[220px] gap-4 md:grid-cols-4">
      {posts.map((p, i) => (
        <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className={`group relative overflow-hidden rounded-2xl border border-border bg-paper shadow-soft animate-rise ${spans[i]}`} style={{ animationDelay: `${i * 50}ms` }}>
          <CoverArt seed={p.seed} className="absolute inset-0 h-full w-full opacity-90 transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-x-3 bottom-3 rounded-xl bg-paper/90 p-4 backdrop-blur">
            <p className="eyebrow !text-[0.65rem]">{p.tag} · {p.date}</p>
            <h3 className={`mt-1 font-bold leading-snug text-ink ${i === 0 ? "text-2xl" : "text-[15px]"}`}>{p.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

const features = [
  { to: "/write", icon: PenLine, title: "Blogs", text: "Medium-style markdown editor with diagrams & attachments." },
  { to: "/architecture", icon: Boxes, title: "Architecture", text: "Excalidraw, draw.io, BPMN, Isoflow — all in one studio." },
  { to: "/files", icon: FolderOpen, title: "Files", text: "An open repository of PDFs, templates and diagrams." },
  { to: "/blogbooks", icon: BookOpen, title: "Blogbooks", text: "Bind posts into guides readers can follow chapter by chapter." },
] as const;

function Index() {
  const [layout, setLayout] = useState<Layout>("gallery");
  useEffect(() => setLayout(layouts[Math.floor(Math.random() * layouts.length)]!), []);
  const view = { gallery: <Gallery />, dashed: <Dashed />, magazine: <Magazine />, bento: <Bento /> }[layout];

  return (
    <main>
      <Hero />
      <section className="mx-auto mt-24 grid max-w-[1400px] gap-4 px-6 md:grid-cols-4">
        {features.map((f) => (
          <Link key={f.to} to={f.to} className="group rounded-2xl border border-border bg-paper/80 p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
            <f.icon className="h-6 w-6 text-leaf-600" />
            <h3 className="mt-5 text-lg font-bold text-ink">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
          </Link>
        ))}
      </section>
      <section className="mx-auto mt-24 max-w-[1400px] px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Latest posts</p>
            <h2 className="mt-2 font-serif text-4xl text-ink">Fresh from the community</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {layouts.map((l) => (
              <button key={l} onClick={() => setLayout(l)} className={`pill capitalize ${layout === l ? "!bg-ink !text-primary-foreground" : ""}`}>{l}</button>
            ))}
            <button className="pill" onClick={() => setLayout(layouts[(layouts.indexOf(layout) + 1 + Math.floor(Math.random() * 3)) % 4]!)}><Shuffle className="h-3.5 w-3.5" /> Shuffle</button>
          </div>
        </div>
        <div key={layout}>{view}</div>
      </section>
    </main>
  );
}
