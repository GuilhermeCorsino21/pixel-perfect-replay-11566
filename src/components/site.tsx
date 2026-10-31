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

function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" className={className} aria-hidden>
      <path d="M20 110 C40 80 70 50 110 20" />
      <path d="M110 20 C80 22 50 40 40 80 C70 74 95 55 110 20Z" />
      <path d="M50 70 L90 35 M60 66 l-4 -14 M72 56 l-3 -14 M84 45 l-2 -12" />
    </svg>
  );
}

const nav = [
  { to: "/", label: "Início" },
  { to: "/mensagens", label: "Mensagens anteriores", short: "Arquivo" },
  { to: "/sobre", label: "Sobre" },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2 text-primary">
      <Sprout className="h-6 w-6" />
      <span className="font-serif text-lg tracking-[0.3em] sm:text-xl">SEMENTE</span>
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto grid w-full max-w-5xl grid-cols-[auto_minmax(0,1fr)] items-center gap-4 px-5 py-5 sm:px-6 md:py-8">
        <Logo />
        <nav className="flex justify-end gap-4 text-sm text-muted-foreground sm:gap-8">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="py-2 transition-colors hover:text-primary" activeProps={{ className: "text-primary" }}>
              {"short" in n ? (<><span className="sm:hidden">{n.short}</span><span className="hidden sm:inline">{n.label}</span></>) : n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-24 border-t md:mt-32">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-14 text-center">
          <Logo />
          <p className="font-serif text-lg italic text-primary">Pequenas palavras. Grandes transformações.</p>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {nav.map((n) => <Link key={n.to} to={n.to} className="py-1 hover:text-primary">{n.label}</Link>)}
          </nav>
          <Sprout className="h-4 w-4 text-sand" />
          <p className="text-sm text-muted-foreground">Que essa palavra floresça em seu dia.</p>
        </div>
      </footer>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
      <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
    </svg>
  );
}

// Estrutura pronta para, no futuro, gerar cartões visuais (versículo + referência + logotipo).
export function ShareButton({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  async function share() {
    const text = shareText(message);
    if (navigator.share) {
      try { await navigator.share({ title: message.title, text, url: location.href }); } catch { /* cancelado */ }
      return;
    }
    await navigator.clipboard.writeText(`${text}\n${location.href}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }
  return (
    <button onClick={share} className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-primary/25 px-6 text-sm text-primary transition hover:border-primary hover:bg-primary hover:text-primary-foreground">
      <ShareIcon />
      <span aria-live="polite">{copied ? "Texto copiado" : "Compartilhar mensagem"}</span>
    </button>
  );
}

export function MessageBody({ message }: { message: Message }) {
  return (
    <>
      <h1 className="mt-5 text-balance text-center text-[2.6rem] leading-[1.08] text-primary sm:text-5xl md:text-[4.25rem]">{message.title}</h1>

      <figure className="mt-12 rounded-2xl bg-card px-6 pb-9 pt-11 shadow-soft sm:px-12 sm:pb-12 sm:pt-14 md:mt-16 md:px-20">
        <p className="eyebrow text-center text-sand">Texto bíblico</p>
        <blockquote className="mt-6 text-balance text-center font-serif text-[1.55rem] italic leading-[1.5] text-foreground sm:text-[1.9rem] md:text-[2.15rem]">
          “{message.verse}”
        </blockquote>
        <figcaption className="mt-9 flex flex-col items-center gap-1 border-t pt-6">
          <cite className="font-serif text-xl not-italic text-primary">{message.reference}</cite>
          <span className="text-xs tracking-wide text-muted-foreground">{message.translation}</span>
        </figcaption>
      </figure>

      <section className="mx-auto mt-20 max-w-[34rem] md:mt-24">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <p className="eyebrow text-muted-foreground">Reflexão autoral</p>
          <span className="h-px flex-1 bg-border" />
        </div>
        <h2 className="mt-6 text-center text-3xl text-primary md:text-[2.1rem]">Uma reflexão para hoje</h2>
        <div className="reading mt-8 space-y-6 font-serif text-[1.22rem] leading-[1.75] text-foreground/90 md:text-[1.3rem]">
          {message.reflection.map((p) => <p key={p}>{p}</p>)}
        </div>
      </section>

      <section className="relative mx-auto mt-20 max-w-[36rem] overflow-hidden rounded-2xl bg-keep px-7 py-10 text-center sm:px-12 sm:py-12 md:mt-24">
        <Leaf className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 text-primary/15" />
        <Sprout className="mx-auto h-6 w-6 text-primary" />
        <h2 className="eyebrow mt-4 text-primary">Leve com você hoje</h2>
        <p className="mt-5 text-balance font-serif text-2xl italic leading-snug text-primary md:text-[1.75rem]">{message.takeaway}</p>
      </section>
    </>
  );
}
