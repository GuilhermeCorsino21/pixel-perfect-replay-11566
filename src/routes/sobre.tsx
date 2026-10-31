import { createFileRoute } from "@tanstack/react-router";
import { Branch, Layout } from "@/components/site";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Semente" },
      { name: "description", content: "O Semente oferece um momento diário de leitura, reflexão e conexão com valores bíblicos." },
      { property: "og:title", content: "Sobre o Semente" },
      { property: "og:description", content: "Um momento diário de leitura, reflexão e conexão com valores bíblicos." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Layout>
      <article className="mx-auto max-w-2xl px-6 pt-10">
        <p className="eyebrow text-sand">Sobre</p>
        <h1 className="mt-2 text-4xl leading-tight text-primary md:text-5xl">Um pequeno momento para cultivar o que importa.</h1>
        <div className="mt-8 space-y-5 text-[1.05rem] leading-8 text-foreground/85">
          <p>O Semente nasceu de uma ideia simples: uma palavra bíblica por dia, lida com calma, pode transformar a forma como vivemos as próximas horas.</p>
          <p>Cada mensagem traz um texto bíblico, identificado com referência e tradução, seguido de uma reflexão autoral — separada claramente das Escrituras — e de uma atitude prática para levar consigo.</p>
          <p>É um espaço para todos que buscam fé, esperança, tranquilidade e reflexão, independentemente de denominação. Sem pressa, sem ruído.</p>
        </div>
        <Branch className="mt-14 h-12 w-48 text-sand" />
      </article>
    </Layout>
  );
}
