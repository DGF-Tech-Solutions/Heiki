import type { GuideDetail } from "./types";

/**
 * Guide di esempio per la modalita' senza database.
 *
 * Servono a due cose: far vedere come si legge una guida con la dichiarazione
 * di patch, e mostrare il caso scomodo - una guida ferma a una patch vecchia,
 * che il sito segnala invece di nascondere. Un esempio in cui tutto e' verde non
 * direbbe nulla su come il sito si comporta quando qualcosa scade.
 *
 * I numeri sono segnaposto, come tutto il dataset di Grand Cross.
 */
const AUTHOR = {
  username: "franz",
  displayName: "Franz",
  accent: "brand",
};

export const DEMO_GUIDES: readonly GuideDetail[] = [
  {
    id: "demo-guida-1",
    game: "grand-cross",
    slug: "come-si-legge-una-simulazione",
    title: "Come si legge una simulazione",
    excerpt:
      "Il simulatore non restituisce un numero ma una distribuzione. Capire la differenza cambia le decisioni che prendi sulla squadra.",
    status: "PUBLISHED",
    verifiedPatch: "0.1-placeholder",
    characterId: null,
    author: AUTHOR,
    publishedAt: "2026-08-28T10:00:00.000Z",
    updatedAt: "2026-08-28T10:00:00.000Z",
    revisions: [],
    body: `Il simulatore non ti dà un numero: ti dà una **distribuzione**. È la differenza più
importante di tutto il sito, e vale la pena spendere due minuti a capirla.

## Perché non un numero solo

In Grand Cross il danno di un turno dipende dalle carte che peschi. Due tentativi
identici, con la stessa squadra e le stesse statistiche, finiscono con numeri
diversi. Un sito che ti mostra "482.000 danni" ha scelto uno di quei tentativi e
ti ha nascosto tutti gli altri.

Quello che leggi qui invece è:

- la **mediana**, cioè il tentativo che sta esattamente in mezzo;
- il **10° e il 90° percentile**, cioè quanto va male quando va male e quanto
  bene quando gira;
- il **tasso di uccisione**, la percentuale di tentativi in cui il bersaglio è
  caduto entro i turni disponibili.

## Quale numero guardare

Dipende da cosa stai decidendo.

1. Stai scegliendo fra due squadre per una prova che puoi ripetere? Guarda la
   mediana: nel lungo periodo è quello che ottieni.
2. Stai preparando un tentativo unico, senza ripetizioni? Guarda il 10°
   percentile. È lo scenario che devi comunque riuscire a superare.
3. Ti serve sapere se un muro cade? Guarda il tasso di uccisione, non il danno.
   Una squadra che fa più danno medio ma uccide nel 60% dei tentativi è peggiore
   di una che ne fa meno e uccide sempre.

> Se due squadre hanno mediane a meno del 5% di distanza, la differenza non è
> reale: è rumore della simulazione. Aumenta le iterazioni e guarda di nuovo.

## Il seme

Ogni simulazione porta con sé un **seme**. Con lo stesso seme, le stesse
statistiche e lo stesso dataset ottieni gli stessi numeri, sempre. È il motivo
per cui un allegato pubblicato nella community può essere ricontrollato dal sito:
non ci si fida di uno screenshot, si rieseguono i conti.

## Cosa non fa

Non simula un piano d'attacco completo, non conosce le meccaniche speciali di
ogni contenuto e non sa cosa farà il tuo avversario. Confronta squadre sullo
stesso bersaglio, che è la domanda a cui una risposta numerica ha senso.`,
  },
  {
    id: "demo-guida-2",
    game: "grand-cross",
    slug: "rotazione-base-attacco-fisico",
    title: "Rotazione base per una squadra fisica",
    excerpt:
      "Tre turni, l'ordine delle carte e quando conviene fondere invece di attaccare. Guida ferma a una patch precedente.",
    status: "PUBLISHED",
    // Di proposito diversa dalla patch corrente: e' il caso in cui il sito deve
    // dire "da rivedere" invece di far finta di niente.
    verifiedPatch: "0.0-vecchia",
    characterId: null,
    author: AUTHOR,
    publishedAt: "2026-06-14T09:30:00.000Z",
    updatedAt: "2026-06-14T09:30:00.000Z",
    revisions: [],
    body: `Questa rotazione vale per una squadra a danno fisico contro un bersaglio singolo
senza fasi di invulnerabilità.

## Turno 1

Fondi tutto quello che puoi fondere. Il primo turno serve a costruire, non a
colpire: il danno che rinunci a fare adesso torna moltiplicato al terzo turno,
quando le carte sono di rango superiore.

## Turno 2

Applica le riduzioni di difesa, poi attacca con quello che resta. Se hai pescato
due carte di rango 2 dello stesso attacco, fonderle qui è quasi sempre meglio che
usarle separate.

## Turno 3

Scarica tutto. Se il misuratore è pieno, l'attacco definitivo va per ultimo:
i moltiplicatori applicati dai compagni valgono anche su quello, e invertire
l'ordine butta via la parte più grossa del danno.

## Quando questa rotazione non vale

- Contro bersagli che cambiano attributo a metà scontro.
- Quando il contenuto ha un limite di turni più basso di tre.
- Se la squadra ha un curatore: il turno speso a curare cambia tutto l'ordine.`,
  },
];
