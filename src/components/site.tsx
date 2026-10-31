import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { shareText, type Message } from "@/lib/messages";

export function Sprout({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className={className} aria-hidden>
      <path d="M16 28V14" />
      <path d="M16 16c0-5 3.5-8 9-8 0 5-3.5 8-9 8Z" />
      <path d="M16 19c0-4-3-6.5-7.5-6.5 0 4 3 6.5 7.5 6.5Z" />
    </svg>
  );
}

export function Branch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className={className} aria-hidden>
      <path d="M10 50 C60 40 120 30 190 10" />
      {[30, 60, 90, 120, 150].map((x, i) => (
        <g key={x}>
          <path d={`M${x} ${46 - i * 7} q8 -14 20 -12 q-6 12 -20 12Z`} />
          <path d={`M${x + 8} ${45 - i * 7} q4 12 16 14 q-2 -12 -16 -14Z`} />
        </g>
      ))}
    </svg>
  );
}

const nav = [
  { to: "/", label: "Início" },
  { to: "/mensagens", label: "Mensagens anteriores" },
  { to: "/sobre", label: "Sobre" },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6 md:py-8">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Sprout className="h-6 w-6" />
          <span className="font-serif text-xl tracking-[0.3em]">SEMENTE</span>
        </Link>
        <nav className="flex gap-5 text-sm text-muted-foreground md:gap-8">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="transition-colors hover:text-primary" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mx-auto mt-24 w-full max-w-5xl border-t px-6 py-10 text-center text-sm text-muted-foreground">
        <Sprout className="mx-auto mb-3 h-5 w-5 text-sand" />
        <p className="font-serif text-base italic text-primary">Pequenas palavras. Grandes transformações.</p>
        <p className="mt-2">© {new Date().getFullYear()} Semente · Textos bíblicos: Almeida Revista e Atualizada</p>
      </footer>
    </div>
  );
}

export function ShareButton({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const text = shareText(message);
    if (navigator.share) {
      try { await navigator.share({ title: message.title, text, url: location.href }); return; } catch { return; }
    }
    await navigator.clipboard.writeText(`${text}\n${location.href}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }
  return (
    <button onClick={share} className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90">
      {copied ? "Mensagem copiada" : "Compartilhar mensagem"}
    </button>
  );
}

export function MessageBody({ message }: { message: Message }) {
  return (
    <>
      <h1 className="mt-4 text-center text-4xl leading-tight text-primary md:text-6xl">{message.title}</h1>
      <figure className="relative mt-10 rounded-2xl bg-card px-7 py-10 shadow-soft md:px-14 md:py-14">
        <span className="eyebrow absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sand px-4 py-1.5 text-accent-foreground">Texto bíblico</span>
        <blockquote className="text-center font-serif text-2xl italic leading-relaxed md:text-[2rem]">“{message.verse}”</blockquote>
        <figcaption className="mt-8 text-center">
          <span className="font-serif text-lg text-primary">{message.reference}</span>
          <span className="mt-1 block text-xs text-muted-foreground">{message.translation}</span>
        </figcaption>
      </figure>
      <section className="mx-auto mt-16 max-w-xl">
        <p className="eyebrow text-sand">Reflexão autoral</p>
        <h2 className="mt-2 text-3xl text-primary">Uma reflexão para hoje</h2>
        <div className="mt-5 space-y-4 text-[1.05rem] leading-8 text-foreground/85">
          {message.reflection.map((p) => <p key={p}>{p}</p>)}
        </div>
      </section>
      <section className="mx-auto mt-14 max-w-xl rounded-2xl border border-sand/60 bg-secondary px-7 py-8">
        <div className="flex items-center gap-2 text-primary"><Sprout className="h-5 w-5" /><h2 className="text-2xl">Leve com você hoje</h2></div>
        <p className="mt-3 text-lg leading-8">{message.takeaway}</p>
      </section>
    </>
  );
}
