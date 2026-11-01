import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Link2, Rss, Twitter, Linkedin, Github, Share2 } from "lucide-react";
import { posts } from "@/lib/data";
import { CoverArt } from "@/components/CoverArt";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Verdant` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Unavailable — Verdant" }, { name: "robots", content: "noindex" }],
  }),
  component: Article,
});

const toc = [
  { id: "why", label: "Why we needed a new approach" },
  { id: "sees", label: "What the system actually sees" },
  { id: "built", label: "What we built together", children: ["1. On by default, with opt-outs", "2. Tailored endpoints and safe fallbacks"] },
  { id: "next", label: "What's next" },
];

function Article() {
  const { post } = Route.useLoaderData();
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  return (
    <main className="mx-auto max-w-[1400px] px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_240px]">
        <aside className="relative hidden lg:block">
          <div className="sticky top-28 flex h-[calc(100vh-9rem)] flex-col justify-end pb-6">
            <p className="eyebrow">Discuss online</p>
            <div className="mt-4 grid w-fit grid-cols-4 gap-2">
              {[Twitter, Linkedin, Github, Rss, Share2, Link2].map((I, i) => (
                <button key={i} className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent"><I className="h-3.5 w-3.5" /></button>
              ))}
            </div>
          </div>
        </aside>

        <article className="mx-auto w-full max-w-[720px] border-x border-dashed border-border px-6 py-14 md:px-12">
          <p className="eyebrow">{post.date} · {post.readTime} read</p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-[-0.025em] text-ink md:text-5xl">{post.title}</h1>
          <div className="mt-6 flex items-center gap-2">
            {post.authors.map((a, i) => (
              <span key={a} className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-primary-foreground" style={{ background: `var(--leaf-${[500, 700, 400][i % 3]})` }}>{a.split(" ").map((x) => x[0]).join("")}</span>
            ))}
            <span className="text-sm text-ink">{post.authors.join(", ")}</span>
          </div>
          <CoverArt seed={post.seed} className="mt-10 aspect-[16/9] w-full rounded-sm" />

          <div className="prose-blog mt-10">
            <p>{post.excerpt}</p>
            <p>That's because most systems were built for a single happy path. Teams today work around brittle assumptions — they look at the page, guess which button does what, and try again when it's wrong. This is slow, expensive, and something as innocuous as a theme change can break it.</p>
            <p>Enter a new model: structured tools exposed on each surface, like <code>search_products</code>. Instead of hunting for buttons, the client calls the exact tool it needs. It's still experimental, available behind <code>chrome://flags/#enable-testing</code> and across developer environments like <a href="#">Verdant Studio</a>.</p>
            <blockquote>Can we turn this on for every team at once, without anyone writing a single line of code?</blockquote>
            <h2 id="why">Why we needed a new approach</h2>
            <p>Here's why the team wanted it, how we built opt-outs to give every owner control, and what we learned along the way.</p>
            <pre><code>{`export default {
  async fetch(req, env) {
    const tools = await env.REGISTRY.list();
    return Response.json({ tools });
  },
};`}</code></pre>
            <h2 id="sees">What the system actually sees</h2>
            <ul><li>A list of named tools with typed inputs</li><li>Deterministic responses instead of scraped HTML</li><li>Clear errors when something is unavailable</li></ul>
            <h2 id="built">What we built together</h2>
            <p>We shipped the feature on by default with a single toggle per owner, and tailored endpoints that fall back safely whenever a tool is missing.</p>
            <h2 id="next">What's next</h2>
            <p>We're opening the registry to the community. Draw your architecture in the Architecture studio and attach it to your next post.</p>
          </div>

          <div className="mt-14 border-t border-dashed border-border pt-10">
            <p className="eyebrow">Related tags</p>
            <div className="mt-4 flex flex-wrap gap-2">{[post.tag, "Agents", "Edge", "System Design"].map((t) => <span key={t} className="pill">{t}</span>)}</div>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-28 pl-8 pt-14">
            <p className="eyebrow">On this page</p>
            <ul className="mt-5 space-y-3 border-l border-border pl-4 text-sm text-muted-foreground">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="hover:text-leaf-700">{t.label}</a>
                  {t.children && <ul className="mt-2 space-y-2 pl-2">{t.children.map((c) => <li key={c}>{c}</li>)}</ul>}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section className="border-y border-dashed border-border py-16 text-center md:text-left">
        <div className="mx-auto max-w-[720px]">
          <h2 className="text-2xl font-bold text-ink">Subscribe to receive notifications of new posts</h2>
          <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Your email address" className="h-11 flex-1 rounded-md border border-input bg-paper px-4 outline-none focus:ring-2 focus:ring-ring" />
            <button className="h-11 rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:bg-leaf-800">Subscribe</button>
          </form>
          <p className="mt-3 text-sm text-muted-foreground">We'll never share your email address.</p>
        </div>
      </section>

      <section className="grid md:grid-cols-3">
        {related.map((p, i) => (
          <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className={`group p-10 ${i < 2 ? "md:border-r" : ""} border-dashed border-border`}>
            <p className="eyebrow">{p.date}</p>
            <h3 className="mt-4 text-2xl font-medium leading-snug text-ink group-hover:text-leaf-700">{p.title}</h3>
            <p className="mt-5 text-sm text-ink">{p.authors.join(", ")}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
