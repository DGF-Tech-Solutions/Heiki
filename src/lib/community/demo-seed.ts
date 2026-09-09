/**
 * Contenuti di esempio della community.
 *
 * Servono a due cose: far vedere com'e' fatta la piattaforma quando e' viva -
 * un feed vuoto non comunica niente - e dare qualcosa su cui iterare mentre il
 * database non c'e'.
 *
 * Sono dichiarati come esempio ovunque compaiano. Non finiranno mai nel
 * database reale: vivono solo nell'archivio in memoria.
 */

import type { Author, CommentNode, PostDetail, SponsorItem } from "./types";

const HOUR = 3_600_000;

function ago(hours: number): string {
  return new Date(Date.now() - hours * HOUR).toISOString();
}

const AUTHORS: Readonly<Record<string, Author>> = {
  mira: { username: "mira", displayName: "Mira", role: "EDITOR", accent: "brand" },
  tino: { username: "tino", displayName: "Tino", role: "CONTRIBUTOR", accent: "ocean" },
  vale: { username: "vale", displayName: "Vale", role: "USER", accent: "forest" },
  ruggi: { username: "ruggi", displayName: "Ruggi", role: "MODERATOR", accent: "gold" },
  nine: { username: "nine", displayName: "Nine", role: "USER", accent: "magenta" },
};

function author(key: keyof typeof AUTHORS): Author {
  return AUTHORS[key] ?? AUTHORS.vale!;
}

function comment(
  id: string,
  key: keyof typeof AUTHORS,
  body: string,
  score: number,
  hours: number,
  replies: CommentNode[] = [],
): CommentNode {
  return {
    id,
    author: author(key),
    body,
    score,
    createdAt: ago(hours),
    myVote: 0,
    replies,
  };
}

export const DEMO_POSTS: readonly PostDetail[] = [
  {
    id: "p1",
    game: "grand-cross",
    hub: "build",
    hubName: "Build e numeri",
    title: "Spezza-guardia prima dell'ultimate: +18% sul danno totale",
    excerpt:
      "Ho provato a invertire l'ordine di apertura e la differenza e' piu' grossa di quanto pensassi. Numeri e seed dentro.",
    body: `Fino a ieri aprivo con l'ultimate perche' e' il colpo piu' grosso e mi sembrava logico spenderlo quando la gauge e' piena.

Sbagliato. Se prima piazzo **Spezza guardia** il debuff sulla difesa resta attivo per tre turni, e l'ultimate ci cade dentro invece che fuori.

Stessa squadra, stesso bersaglio, stesso seed: **186.400** contro **158.100** di mediana. Il p10 sale ancora di piu', quindi non e' fortuna: e' proprio la coda bassa che si alza.

L'unico caso in cui non conviene e' se il bersaglio muore comunque entro due turni, perche' li' il debuff non fa in tempo a ripagarsi.`,
    author: author("mira"),
    score: 47,
    commentCount: 4,
    createdAt: ago(5),
    myVote: 0,
    attachment: {
      kind: "simulation",
      game: "The Seven Deadly Sins: Grand Cross",
      character: "Unita' Forza",
      team: ["Unita' Forza", "Unita' Destrezza", "Unita' Vita"],
      median: 186_400,
      p10: 141_200,
      p90: 232_900,
      timeToKill: 11,
      timeUnit: "turns",
      killRate: 0.87,
      patch: "0.0.0",
      seed: 20260909,
    },
    comments: [
      comment(
        "c1",
        "tino",
        "Confermo su bersaglio con difesa alta. Su quelli fragili invece perdo un turno e mi conviene ancora aprire con l'ultimate.",
        12,
        4,
        [
          comment(
            "c2",
            "mira",
            "Esatto, e' la soglia di cui parlavo alla fine. Sotto i due turni il debuff non si ripaga.",
            6,
            3,
          ),
        ],
      ),
      comment(
        "c3",
        "vale",
        "Ho rifatto la simulazione con lo stesso seed e mi escono gli stessi numeri. Bello poter verificare invece di fidarsi.",
        9,
        3,
      ),
      comment("c4", "nine", "E se al posto della Vita metto una seconda Destrezza?", 2, 1),
    ],
  },
  {
    id: "p2",
    game: "grand-cross",
    hub: "rotazioni",
    hubName: "Rotazioni",
    title: "La fusione delle carte cambia la rotazione piu' di quanto si dica",
    excerpt:
      "Ragionare per sequenza fissa non funziona su un gioco a pescata casuale. Meglio ragionare per priorita'.",
    body: `Vedo tante guide che scrivono la rotazione come una sequenza: prima questo, poi quello, poi quell'altro.

Su Grand Cross non ha senso, perche' le carte le peschi. Quello che serve e' una **lista di priorita'**: se esce questa carta la gioco, altrimenti ripiego su quest'altra.

Il simulatore qui la tratta cosi' e infatti i numeri tornano molto meglio con la mia esperienza reale.`,
    author: author("ruggi"),
    score: 31,
    commentCount: 2,
    createdAt: ago(19),
    myVote: 0,
    attachment: null,
    comments: [
      comment(
        "c5",
        "tino",
        "Questa cosa mi ha fatto buttare via mezza guida che stavo scrivendo. Aveva senso pero'.",
        7,
        17,
      ),
      comment("c6", "mira", "Andrebbe messo in evidenza nelle linee guida per chi scrive.", 5, 12),
    ],
  },
  {
    id: "p3",
    game: "grand-cross",
    hub: "build",
    hubName: "Build e numeri",
    title: "Confronto: tre squadre sullo stesso boss",
    excerpt:
      "Stesso bersaglio, stesse iterazioni, tre composizioni diverse. La differenza sta tutta nella coda bassa.",
    body: `Ho girato 2.000 simulazioni per ognuna delle tre squadre che uso di solito.

La mediana e' quasi identica in due casi su tre. Quello che cambia davvero e' il **p10**: la squadra piu' difensiva fa meno danno di punta ma non ha mai giornate storte, e in un contenuto a tempo e' quello che conta.

Guardare solo la media qui sarebbe fuorviante.`,
    author: author("tino"),
    score: 28,
    commentCount: 1,
    createdAt: ago(30),
    myVote: 0,
    attachment: {
      kind: "simulation",
      game: "The Seven Deadly Sins: Grand Cross",
      character: "Unita' Destrezza",
      team: ["Unita' Destrezza", "Unita' Vita", "Unita' Forza"],
      median: 94_150,
      p10: 81_700,
      p90: 108_400,
      timeToKill: 18,
      timeUnit: "turns",
      killRate: 0.62,
      patch: "0.0.0",
      seed: 771_204,
    },
    comments: [
      comment(
        "c7",
        "vale",
        "Il p10 e' la statistica che guardo per prima ormai. La media non mi dice se il tentativo mi salta.",
        8,
        22,
      ),
    ],
  },
  {
    id: "p4",
    game: "grand-cross",
    hub: "aiuto",
    hubName: "Aiuto",
    title: "Vale la pena portare al massimo un personaggio che uso poco?",
    excerpt: "Ho risorse per uno solo e non so se conviene allargare o approfondire.",
    body: `Sono a meta' strada su due personaggi e non riesco a decidere se finirne uno o tenerli entrambi a meta'.

Qualcuno ha provato a fare il conto con la simulazione invece che a occhio?`,
    author: author("nine"),
    score: 14,
    commentCount: 2,
    createdAt: ago(8),
    myVote: 0,
    attachment: null,
    comments: [
      comment(
        "c8",
        "ruggi",
        "Regola pratica: finisci prima quello che gia' usi. La squadra a meta' rende meno della somma delle parti.",
        11,
        6,
      ),
      comment("c9", "nine", "Ha senso, grazie. Provo a simulare entrambe le versioni.", 3, 5),
    ],
  },
  {
    id: "p5",
    game: "grand-cross",
    hub: "generale",
    hubName: "Generale",
    title: "Proposta: un tag per le build verificate su patch corrente",
    excerpt: "Meta' delle guide che trovo in giro sono ferme a due patch fa e non si capisce.",
    body: `Il problema piu' grosso dei siti di guide non e' scrivere: e' che il contenuto invecchia e nessuno se ne accorge.

Qui c'e' gia' il campo della patch verificata. Proporrei di mostrarlo anche sui post della community, non solo sulle guide.`,
    author: author("vale"),
    score: 22,
    commentCount: 1,
    createdAt: ago(46),
    myVote: 0,
    attachment: null,
    comments: [
      comment("c10", "mira", "D'accordo. Un post con numeri di due patch fa e' disinformazione involontaria.", 9, 40),
    ],
  },
];

export const DEMO_SPONSORS: readonly SponsorItem[] = [
  {
    id: "s1",
    advertiser: "Esempio",
    title: "Questo spazio e' uno slot sponsorizzato",
    body: "Sta fuori dal feed organico e resta etichettato. I post a pagamento dentro la lista non esistono, per scelta.",
    targetUrl: "#",
  },
];
