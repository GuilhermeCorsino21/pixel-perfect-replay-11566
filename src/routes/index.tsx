import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Branch, Layout, MessageBody, ShareButton } from "@/components/site";
import { formatDate, getTodayMessage, type DatedMessage } from "@/lib/messages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Semente — Palavra do dia" },
      { name: "description", content: "Uma mensagem bíblica por dia, com reflexão acolhedora e aplicação prática para a vida." },
      { property: "og:title", content: "Semente — Palavra do dia" },
      { property: "og:description", content: "Pequenas palavras. Grandes transformações." },
    ],
  }),
  loader: () => getTodayMessage(),
  component: Index,
});

function greeting(h: number) {
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function Index() {
  const initial = Route.useLoaderData();
  const [msg, setMsg] = useState<DatedMessage>(initial);
  const [hello, setHello] = useState("Olá");
  const [today, setToday] = useState("");
  useEffect(() => {
    const now = new Date();
    setHello(greeting(now.getHours()));
    setToday(formatDate(now));
    getTodayMessage(now).then(setMsg);
  }, []);

  return (
    <Layout>
      <article className="mx-auto max-w-3xl px-5 pt-6 sm:px-6 md:pt-12">
        <div className="animate-rise text-center">
          <Branch className="mx-auto h-9 w-36 text-sand" />
          <p className="mt-5 font-serif text-xl italic text-foreground/80 md:text-2xl">{hello}, que bom ter você aqui.</p>
          <p className="mt-1.5 min-h-5 text-xs capitalize tracking-wide text-muted-foreground">{today}</p>
          <div className="mx-auto mt-12 flex max-w-[14rem] items-center gap-3 md:mt-16">
            <span className="h-px flex-1 bg-sand/60" />
            <p className="eyebrow text-primary">Palavra do dia</p>
            <span className="h-px flex-1 bg-sand/60" />
          </div>
        </div>
        <div className="animate-rise [animation-delay:150ms]">
          <MessageBody message={msg} />
          <div className="mt-14 flex flex-col items-center gap-6">
            <ShareButton message={msg} />
            <Link to="/mensagens" className="text-sm text-primary underline-offset-4 hover:underline">Ver mensagens anteriores →</Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}
