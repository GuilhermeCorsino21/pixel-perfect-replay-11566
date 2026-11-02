import { useState, useEffect } from "react";
import { Volume2, Pause, Play } from "lucide-react";
import { Message } from "@/lib/messages";

interface AudioPlayerProps {
  message: Message;
}

export function AudioPlayer({ message }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      setIsSupported(false);
    }

    // Cancela qualquer fala anterior ao desmontar o componente
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (!isSupported) return;

    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    // Prepara o texto completo para ser lido em sequência
    const textToRead = `
      ${message.title}. 
      Texto bíblico: ${message.verse}. 
      Referência: ${message.reference}. 
      Reflexão: ${message.reflection.join(" ")} 
      Leve com você hoje: ${message.takeaway}
    `;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "pt-BR";
    utterance.rate = 0.95; // Velocidade suave e agradável de leitura

    // Tenta encontrar uma voz fluida em Português
    const voices = synth.getVoices();
    const ptVoice = voices.find((v) => v.lang.includes("pt-BR") || v.lang.includes("pt"));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    synth.cancel(); // Garante que não haja áudios sobrepostos
    synth.speak(utterance);
    setIsPlaying(true);
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={handleTogglePlay}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background hover:bg-accent text-sm font-medium transition-colors cursor-pointer"
      title={isPlaying ? "Pausar leitura" : "Ouvir a mensagem"}
    >
      {isPlaying ? (
        <>
          <Pause className="w-4 h-4 text-primary animate-pulse" />
          <span>Pausar áudio</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <span>Ouvir mensagem</span>
        </>
      )}
    </button>
  );
}
