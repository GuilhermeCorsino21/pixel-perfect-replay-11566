// Fonte de dados das mensagens. Hoje usa conteúdo local de demonstração;
// a interface assíncrona permite trocar por uma consulta ao banco depois.

export type Message = {
  id: string;
  title: string;
  verse: string; // texto bíblico literal
  reference: string;
  translation: string;
  reflection: string[]; // texto autoral
  takeaway: string;
};

const ARA = "Almeida Revista e Atualizada (ARA)";

const MESSAGES: Message[] = [
  {
    id: "fe-do-tamanho-de-uma-semente",
    title: "Fé do tamanho de uma semente",
    verse:
      "Se tiverdes fé como um grão de mostarda, direis a este monte: Passa daqui para acolá, e ele passará.",
    reference: "Mateus 17:20",
    translation: ARA,
    reflection: [
      "Nem sempre nos sentimos fortes. Há dias em que a fé parece pequena, quase invisível. Jesus escolhe justamente a menor das sementes para falar sobre ela.",
      "A força não está no tamanho do que carregamos, mas em onde ela está plantada. Uma confiança pequena, mas verdadeira, já é suficiente para começar a mover o que parecia imóvel.",
    ],
    takeaway: "Qual é um pequeno passo de confiança que você pode dar hoje, mesmo sem ter todas as respostas?",
  },
  {
    id: "descanso-para-os-cansados",
    title: "Descanso para os cansados",
    verse: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.",
    reference: "Mateus 11:28",
    translation: ARA,
    reflection: [
      "O convite não exige que estejamos prontos, organizados ou bem. Ele é feito exatamente a quem está cansado.",
      "Às vezes, descansar é um ato de fé: reconhecer que não precisamos sustentar tudo sozinhos.",
    ],
    takeaway: "Reserve cinco minutos de silêncio hoje e entregue, em pensamento, aquilo que mais pesa.",
  },
  {
    id: "misericordias-que-se-renovam",
    title: "Misericórdias que se renovam",
    verse:
      "As misericórdias do Senhor são a causa de não sermos consumidos, porque as suas misericórdias não têm fim; renovam-se cada manhã. Grande é a tua fidelidade.",
    reference: "Lamentações 3:22-23",
    translation: ARA,
    reflection: [
      "Estas palavras foram escritas em meio à dor, não depois dela. Ainda assim, o autor encontra algo firme: cada manhã traz uma nova oportunidade.",
      "Ontem não precisa definir hoje. Há graça suficiente para recomeçar.",
    ],
    takeaway: "O que você pode deixar no dia de ontem para viver o de hoje com mais leveza?",
  },
  {
    id: "o-senhor-e-o-meu-pastor",
    title: "Cuidado que não falta",
    verse: "O Senhor é o meu pastor; nada me faltará.",
    reference: "Salmos 23:1",
    translation: ARA,
    reflection: [
      "Um pastor conhece suas ovelhas, guia, protege e caminha junto. O salmista não descreve uma vida sem vales, mas uma vida acompanhada.",
      "Confiar no cuidado de Deus muda o modo como olhamos para o que ainda não temos.",
    ],
    takeaway: "Anote três coisas que, hoje, não faltaram para você.",
  },
  {
    id: "nao-temas",
    title: "Não temas",
    verse:
      "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.",
    reference: "Isaías 41:10",
    translation: ARA,
    reflection: [
      "O medo é humano, e o texto não o ignora. Em vez de pedir coragem, ele oferece presença: “eu sou contigo”.",
      "Coragem, muitas vezes, nasce de saber que não estamos sozinhos.",
    ],
    takeaway: "Diante de uma preocupação de hoje, repita para si: não estou sozinho nisto.",
  },
  {
    id: "aquietai-vos",
    title: "Aquietar o coração",
    verse: "Aquietai-vos e sabei que eu sou Deus.",
    reference: "Salmos 46:10",
    translation: ARA,
    reflection: [
      "Vivemos cercados de ruído e urgência. Este verso nos convida a parar — não por desistência, mas por confiança.",
      "No silêncio, lembramos que nem tudo depende de nós.",
    ],
    takeaway: "Desligue as notificações por alguns minutos e apenas respire.",
  },
  {
    id: "o-amor-e-paciente",
    title: "O amor é paciente",
    verse: "O amor é paciente, é benigno; o amor não arde em ciúmes, não se ufana, não se ensoberbece.",
    reference: "1 Coríntios 13:4",
    translation: ARA,
    reflection: [
      "Antes de ser um sentimento, o amor aqui é descrito como uma forma de agir. Paciência e bondade são escolhas diárias.",
      "Pequenos gestos de gentileza também são grandes demonstrações de amor.",
    ],
    takeaway: "Com quem você pode ser um pouco mais paciente hoje?",
  },
  {
    id: "pacificadores",
    title: "Semear a paz",
    verse: "Bem-aventurados os pacificadores, porque serão chamados filhos de Deus.",
    reference: "Mateus 5:9",
    translation: ARA,
    reflection: [
      "Jesus não fala apenas de quem ama a paz, mas de quem a constrói. Paz é algo que se faz.",
      "Uma palavra mansa, um pedido de desculpas, uma escuta atenta — tudo isso é semear.",
    ],
    takeaway: "Existe alguma conversa que você pode conduzir com mais paz hoje?",
  },
];

const DAY = 86_400_000;
const dayIndex = (d: Date) =>
  Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);

export type DatedMessage = Message & { date: string };

function messageFor(d: Date): DatedMessage {
  const m = MESSAGES[((dayIndex(d) % MESSAGES.length) + MESSAGES.length) % MESSAGES.length];
  return { ...m, date: new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString() };
}

export async function getTodayMessage(now = new Date()): Promise<DatedMessage> {
  return messageFor(now);
}

export async function getPastMessages(now = new Date()): Promise<DatedMessage[]> {
  return Array.from({ length: MESSAGES.length - 1 }, (_, i) =>
    messageFor(new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i + 1))),
  );
}

export async function getMessageById(id: string): Promise<Message | undefined> {
  return MESSAGES.find((m) => m.id === id);
}

export const formatDate = (iso: string | Date) =>
  new Date(iso).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const shareText = (m: Message) =>
  `${m.title}\n\n“${m.verse}”\n— ${m.reference} (${m.translation})\n\nLeve com você hoje: ${m.takeaway}\n\nSemente · Pequenas palavras. Grandes transformações.`;
