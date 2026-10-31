import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout, MessageBody, ShareButton } from "@/components/site";
import { getMessageById } from "@/lib/messages";

export const Route = createFileRoute("/mensagens/$id")({
  loader: async ({ params }) => {
    const m = await getMessageById(params.id);
    if (!m) throw notFound();
    return m;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} — Semente` },
          { name: "description", content: `${loaderData.reference}: ${loaderData.verse}` },
          { property: "og:title", content: `${loaderData.title} — Semente` },
          { property: "og:description", content: `${loaderData.reference}: ${loaderData.verse}` },
        ]
      : [{ title: "Mensagem não encontrada — Semente" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <Layout>
      <div className="px-6 py-24 text-center">
        <h1 className="text-3xl text-primary">Mensagem não encontrada</h1>
        <Link to="/mensagens" className="mt-4 inline-block text-primary underline">Voltar ao arquivo</Link>
      </div>
    </Layout>
  ),
  component: MessagePage,
});

function MessagePage() {
  const m = Route.useLoaderData();
  return (
    <Layout>
      <article className="mx-auto max-w-3xl px-6 pt-8">
        <Link to="/mensagens" className="text-sm text-muted-foreground hover:text-primary">← Mensagens anteriores</Link>
        <div className="animate-rise"><MessageBody message={m} /></div>
        <div className="mt-14 flex justify-center"><ShareButton message={m} /></div>
      </article>
    </Layout>
  );
}
