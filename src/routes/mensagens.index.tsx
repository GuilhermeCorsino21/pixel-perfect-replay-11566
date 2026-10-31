import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/site";
import { getPastMessages, type DatedMessage } from "@/lib/messages";

export const Route = createFileRoute("/mensagens/")({
  head: () => ({
    meta: [
      { title: "Mensagens anteriores — Semente" },
      { name: "description", content: "Arquivo das mensagens bíblicas diárias do Semente, organizadas por data." },
      { property: "og:title", content: "Mensagens anteriores — Semente" },
      { property: "og:description", content: "Revisite as palavras e reflexões dos últimos dias." },
    ],
  }),
  loader: () => getPastMessages(),
  component: Archive,
});

function Archive() {
  const [items, setItems] = useState<DatedMessage[]>(Route.useLoaderData());
  useEffect(() => { getPastMessages(new Date()).then(setItems); }, []);
  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-6 pt-10">
        <p className="eyebrow text-sand">Arquivo</p>
        <h1 className="mt-2 text-4xl text-primary md:text-5xl">Mensagens anteriores</h1>
        <p className="mt-3 max-w-lg text-muted-foreground">Cada dia, uma semente. Volte a qualquer palavra que tenha tocado você.</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <Link key={m.date} to="/mensagens/$id" params={{ id: m.id }} className="group flex flex-col rounded-2xl bg-card p-7 shadow-soft transition hover:-translate-y-1">
              <time className="text-xs capitalize text-muted-foreground">
                {new Date(m.date).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "long" })}
              </time>
              <h2 className="mt-4 text-2xl leading-snug text-primary">{m.title}</h2>
              <p className="mt-auto pt-6 font-serif text-base italic text-foreground/70">{m.reference}</p>
              <span className="mt-3 text-sm text-primary opacity-0 transition group-hover:opacity-100">Ler mensagem →</span>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
