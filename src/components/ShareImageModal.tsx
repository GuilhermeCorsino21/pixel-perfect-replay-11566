import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { Download, Share2, X, Loader2 } from "lucide-react";
import type { DatedMessage } from "@/lib/messages";

interface ShareImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: DatedMessage;
}

export function ShareImageModal({ isOpen, onClose, message }: ShareImageModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      // Gera a imagem em alta resolução (pixelRatio: 2)
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const fileName = `semente-biblica-${message.date || "versiculo"}.png`;
      download(dataUrl, fileName, "image/png");
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col items-center rounded-2xl bg-background p-6 shadow-2xl">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="mb-4 font-serif text-lg font-medium text-foreground">
          Partilhar nas Redes Sociais
        </h3>

        {/* ÁREA DO CARTÃO (Convertida em Imagem) */}
        <div className="overflow-y-auto w-full flex justify-center py-2">
          <div
            ref={cardRef}
            className="flex aspect-[9/16] w-[280px] flex-col justify-between rounded-xl bg-gradient-to-b from-[#1c1917] to-[#292524] p-6 text-stone-100 shadow-xl sm:w-[300px]"
          >
            {/* Cabeçalho do Cartão */}
            <div className="flex items-center justify-between border-b border-stone-700/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="font-serif text-xs font-semibold tracking-widest uppercase text-amber-200/90">
                  Semente Bíblica
                </span>
              </div>
              <span className="text-[10px] text-stone-400">{message.date}</span>
            </div>

            {/* Conteúdo do Versículo */}
            <div className="my-auto py-4 text-center">
              <p className="font-serif text-lg leading-relaxed text-stone-100 sm:text-xl">
                “{message.text || message.verseText}”
              </p>
              <p className="mt-4 font-sans text-xs font-medium uppercase tracking-wider text-amber-400">
                — {message.reference || message.verseRef}
              </p>
            </div>

            {/* Rodapé do Cartão */}
            <div className="border-t border-stone-700/50 pt-3 text-center">
              <p className="text-[10px] tracking-wide text-stone-400">sementebiblica.com.br</p>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-6 flex w-full gap-3">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />A gerar...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Descarregar Imagem
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
