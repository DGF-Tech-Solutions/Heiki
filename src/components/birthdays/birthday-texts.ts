import { testi } from "@/lib/i18n/locale";

/**
 * I testi della pagina Compleanni, in un modulo senza «use client»: li leggono la
 * pagina (server) e il riquadro «Oggi» (browser), ognuno nella sua lingua. Le
 * parole del gioco (Affetto, Cuori, Festa di compleanno, «Buon compleanno, {0}!»)
 * arrivano invece dai dati, coi testi del client.
 */
export const BIRTHDAY_TEXTS = testi({
  it: {
    titoloPagina: (gioco: string) => `Compleanni degli eroi di ${gioco}`,
    descrizione: (gioco: string) =>
      `${gioco}: il compleanno di ogni eroe, chi festeggia oggi e il regalo preferito che alla festa in taverna dà dieci volte i punti Affetto.`,
    titolo: "Compleanni",
    introduzione: (clienti: number, molt: number) =>
      `Ogni eroe ha il suo compleanno nel profilo. I ${clienti} clienti della taverna lo festeggiano: quel giorno il loro regalo preferito vale ×${molt} punti Affetto.`,
    oggi: "Oggi",
    nessunoOggi: "Oggi nessun compleanno",
    nessunoGiorno: (data: string) => `Nessun compleanno il ${data}`,
    tornaOggi: "Torna a oggi",
    apriGiorno: (data: string) => `Apri il ${data}`,
    prossimo: "Il prossimo:",
    prossimi: "Prossimi compleanni",
    tra: (n: number) => (n === 0 ? "oggi" : n === 1 ? "domani" : `tra ${n} giorni`),
    apri: "Apri la scheda",
    versioni: (n: number) => (n === 1 ? "1 versione" : `${n} versioni`),
    cliente: "Festeggia in taverna",
    senzaFesta: "Non è fra i clienti della taverna: il compleanno sta nel suo profilo, senza festa.",
    vivonoInTaverna:
      "In taverna ci vive: nelle tabelle del gioco non ha un regalo preferito. Vale il regalo comune, che la festa non moltiplica.",
    alla: "alla festa",
    ritorno: "In cambio",
    // la festa in taverna
    festaTitolo: "La festa in taverna",
    festaRegalo: (molt: number, base: string, festa: string) =>
      `Nel giorno del compleanno il cliente festeggiato va in taverna e chiede il suo regalo preferito: invece di ${base} punti Affetto ne dà ${festa}, ×${molt}.`,
    festaComune: (nome: string) =>
      `Il regalo comune (${nome}) vale per tutti i clienti in ogni giorno, ma la festa non lo moltiplica: il gioco lo scrive nella finestra del regalo.`,
    festaCuori: (perCuore: string, versione: number, massimo: number) =>
      `I punti Affetto diventano Cuori: un Cuore ogni ${perCuore} punti. Il tetto dipende da quante versioni del personaggio hai: ${versione} Cuore per versione, ${massimo} se la sua Affinità è al livello massimo.`,
    festaRicompense: (diamanti: string, cuori: number) =>
      `I Cuori raccolti con tutti gli eroi danno Diamanti a passi di cinque: ${diamanti} in tutto, fino a ${cuori} Cuori.`,
    festaServer:
      "Chi festeggia lo decide il server del gioco, che manda la lista a ogni ripristino giornaliero: il client non guarda la data. Qui si usa il giorno del tuo dispositivo, quindi a cavallo della mezzanotte il gioco può essere un passo avanti o indietro.",
    comuneTitolo: "Il regalo comune",
    regaliTitolo: "I regali preferiti",
    regaliIntro: "Uno per cliente, sempre lo stesso: conviene metterne da parte cinque prima della festa.",
    colData: "Data",
    colPersonaggio: "Personaggio",
    colRegalo: "Regalo preferito",
    calendarioTitolo: "Calendario",
    calendarioMesi: "Mesi",
    nessunoMese: "Nessun compleanno",
    sconosciutiTitolo: (n: number) => `Senza compleanno nel profilo (${n})`,
    sconosciutiIntro: "Il gioco scrive «Sconosciuto»: sono quasi tutti eroi delle collaborazioni.",
    comeFunziona: "Da dove vengono i dati",
    fonti:
      "Il compleanno del profilo viene dalla tabella degli eroi del client (DB_hero_base), la festa dalla tabella DB_birthday, il regalo da DB_guest_gift, e il moltiplicatore dalla finestra del regalo della taverna, letta nel codice del gioco.",
    hawk:
      "Hawk è l'unico cliente che nessuna tabella lega ai suoi eroi: per la sua festa il gioco mostra l'illustrazione di «Hawk & Elizabeth», una versione di Elizabeth. Qui è legato alle versioni di Hawk per nome e data, che coincidono.",
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} hero birthdays`,
    descrizione: (gioco: string) =>
      `${gioco}: every hero's birthday, who is celebrating today and the favorite gift that gives ten times the Affection points at the tavern celebration.`,
    titolo: "Birthdays",
    introduzione: (clienti: number, molt: number) =>
      `Every hero has a birthday in their profile. The ${clienti} tavern customers celebrate it: on that day their favorite gift is worth ×${molt} Affection points.`,
    oggi: "Today",
    nessunoOggi: "No birthdays today",
    nessunoGiorno: (data: string) => `No birthdays on ${data}`,
    tornaOggi: "Back to today",
    apriGiorno: (data: string) => `Open ${data}`,
    prossimo: "Next up:",
    prossimi: "Upcoming birthdays",
    tra: (n: number) => (n === 0 ? "today" : n === 1 ? "tomorrow" : `in ${n} days`),
    apri: "Open the page",
    versioni: (n: number) => (n === 1 ? "1 version" : `${n} versions`),
    cliente: "Celebrates at the tavern",
    senzaFesta: "Not one of the tavern customers: the birthday is in the profile, with no celebration.",
    vivonoInTaverna:
      "Lives at the tavern: the game tables give no favorite gift. The common gift applies, and the celebration doesn't multiply it.",
    alla: "at the celebration",
    ritorno: "In return",
    festaTitolo: "The tavern celebration",
    festaRegalo: (molt: number, base: string, festa: string) =>
      `On their birthday the customer comes to the tavern and asks for their favorite gift: instead of ${base} Affection points it gives ${festa}, ×${molt}.`,
    festaComune: (nome: string) =>
      `The common gift (${nome}) works for every customer on any day, but the celebration doesn't multiply it: the game says so in the gift window.`,
    festaCuori: (perCuore: string, versione: number, massimo: number) =>
      `Affection points become Hearts: one Heart every ${perCuore} points. The cap depends on how many versions of the character you own: ${versione} Heart per version, ${massimo} if its Affinity is at the max level.`,
    festaRicompense: (diamanti: string, cuori: number) =>
      `Hearts collected across all heroes give Diamonds in steps of five: ${diamanti} in total, up to ${cuori} Hearts.`,
    festaServer:
      "Who celebrates is decided by the game server, which sends the list at every daily reset: the client doesn't look at the date. This page uses your device's day, so around midnight the game may be one step ahead or behind.",
    comuneTitolo: "The common gift",
    regaliTitolo: "Favorite gifts",
    regaliIntro: "One per customer, always the same: it pays to set five aside before the celebration.",
    colData: "Date",
    colPersonaggio: "Character",
    colRegalo: "Favorite gift",
    calendarioTitolo: "Calendar",
    calendarioMesi: "Months",
    nessunoMese: "No birthdays",
    sconosciutiTitolo: (n: number) => `No birthday in the profile (${n})`,
    sconosciutiIntro: "The game says «Unknown»: almost all of them are collaboration heroes.",
    comeFunziona: "Where the data comes from",
    fonti:
      "The profile birthday comes from the client's hero table (DB_hero_base), the celebration from the DB_birthday table, the gift from DB_guest_gift, and the multiplier from the tavern gift window, read in the game code.",
    hawk:
      "Hawk is the only customer no table ties to his heroes: for his celebration the game shows the «Hawk & Elizabeth» illustration, a version of Elizabeth. Here he is tied to Hawk's own versions by name and date, which match.",
  },
});
