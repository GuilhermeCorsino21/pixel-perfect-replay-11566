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
      <article className="mx-auto max-w-3xl px-6 pt-8 md:pt-14">
        <div className="animate-rise text-center">
          <Branch className="mx-auto h-10 w-40 text-sand" />
          <p className="mt-4 font-serif text-2xl italic text-primary">{hello}, que bom ter você aqui.</p>
          <p className="mt-1 min-h-5 text-sm capitalize text-muted-foreground">{today}</p>
          <p className="eyebrow mt-12 text-sand">Palavra do dia</p>
        </div>
        <div className="animate-rise [animation-delay:150ms]">
          <MessageBody message={msg} />
          <div className="mt-14 flex flex-col items-center gap-5">
            <ShareButton message={msg} />
            <Link to="/mensagens" className="text-sm text-primary underline-offset-4 hover:underline">Ver mensagens anteriores →</Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}
