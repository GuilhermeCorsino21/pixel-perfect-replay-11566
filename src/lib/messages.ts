// Fonte de dados externa carregada via JSON de forma dinâmica.
// Nada fica hardcoded na lógica do código.

export type Message = {
  id: string;
  title: string;
  verse: string;
  reference: string;
  translation: string;
  reflection: string[];
  takeaway: string;
};

export type DatedMessage = Message & { date: string };

// Função responsável por buscar os dados do arquivo JSON externo
async function fetchMessagesData(): Promise<{
  translation: string;
  messages: Omit<Message, "translation">[];
}> {
  try {
    const response = await fetch("/messages.json");
    if (!response.ok) throw new Error("Erro ao carregar mensagens");
    return await response.json();
  } catch (error) {
    console.error("Erro no carregamento do arquivo JSON de mensagens:", error);
    // Fallback de segurança caso ocorra alguma falha na requisição
    return {
      translation: "Almeida Revista e Atualizada (ARA)",
      messages: [],
    };
  }
}

const DAY = 86_400_000;
const dayIndex = (d: Date) =>
  Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);

async function messageFor(d: Date): Promise<DatedMessage> {
  const data = await fetchMessagesData();
  const list = data.messages;

  // Trata o cenário de fallback se a lista no JSON estiver vazia
  if (!list || list.length === 0) {
    return {
      id: "fallback",
      title: "Semente do Dia",
      verse: "O Senhor é o meu pastor; nada me faltará.",
      reference: "Salmos 23:1",
      translation: data.translation || "Almeida Revista e Atualizada (ARA)",
      reflection: ["Há sempre uma nova graça para cada amanhecer."],
      takeaway: "Confie no dia de hoje.",
      date: new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString(),
    };
  }

  // Calcula a rotação diária ciclicamente com base no total de mensagens disponíveis no JSON
  const index = ((dayIndex(d) % list.length) + list.length) % list.length;
  const m = list[index]!;

  return {
    ...m,
    translation: data.translation,
    date: new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString(),
  };
}

export async function getTodayMessage(now = new Date()): Promise<DatedMessage> {
  return messageFor(now);
}

// Histórico de mensagens anteriores limitado estritamente aos últimos 7 dias
export async function getPastMessages(now = new Date()): Promise<DatedMessage[]> {
  const promises = Array.from({ length: 7 }, (_, i) => {
    const pastDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i + 1));
    return messageFor(pastDate);
  });

  return Promise.all(promises);
}

export async function getMessageById(id: string): Promise<Message | undefined> {
  const data = await fetchMessagesData();
  const found = data.messages?.find((m) => m.id === id);
  if (!found) return undefined;
  return { ...found, translation: data.translation };
}

export const formatDate = (iso: string | Date) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const shareText = (m: Message) =>
  `${m.title}\n\n“${m.verse}”\n— ${m.reference} (${m.translation})\n\nLeve com você hoje: ${m.takeaway}\n\nSemente Bíblica · Pequenas palavras. Grandes transformações. (https://sementebiblica.com.br)`;
