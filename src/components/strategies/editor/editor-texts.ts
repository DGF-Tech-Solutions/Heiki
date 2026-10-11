/**
 * Le parole del modulo di scrittura di una strategia, nelle due lingue.
 *
 * In un file a parte perche' le usano tutti i pezzi del modulo (i passi, la
 * scelta dell'eroe, la barra in fondo) e i nomi dei problemi devono essere gli
 * stessi nella barra, accanto al campo e nel riquadro in alto.
 */

import { STRATEGY_LIMITS } from "@/lib/strategies/types";
import { testi } from "@/lib/i18n/locale";
import type { EditorProblem, HeroReason } from "./editor-state";

const { titleMin, titleMax, notesMax, phaseMax } = STRATEGY_LIMITS;

export const TESTI = testi({
  it: {
    // i passi
    modalita: "Modalità",
    modalitaSpiega: "Dove vale la strategia.",
    bersagli: (n: number) => (n === 1 ? "1 bersaglio" : `${n} bersagli`),
    difficoltaN: (n: number) => (n === 1 ? "1 difficoltà" : `${n} difficoltà`),
    bersaglio: "Bersaglio",
    bersaglioBoss: "Quale boss.",
    bersaglioBestia: "Quale bestia.",
    bersaglioUnico: (nome: string) => `${nome}: c'è un bersaglio solo, è già scelto.`,
    primaModalita: "Scegli prima la modalità.",
    difficolta: "Difficoltà",
    difficoltaSpiega: "Le difficoltà con i colori del gioco. Sotto, chi può entrare in squadra.",
    difficoltaBestie: "I piani normali (si scrive del terzo, il più duro) o il piano trascendente.",
    soloNormali: "Questa bestia non ha il piano trascendente.",
    primaBersaglio: "Scegli prima il bersaglio.",
    fasi: (n: number) => (n === 1 ? "1 fase" : `${n} fasi`),
    limiti: (nome: string) => `Chi può entrare a ${nome}`,
    attributiAmmessi: "Attributi ammessi",
    tuttiAttributi: "Tutti",
    eroiEsclusi: (n: number) => `Eroi esclusi (${n})`,
    nessunEscluso: "Nessuno",
    // la squadra
    squadra: "Squadra",
    squadraSpiega:
      "Quattro eroi e, se vuoi, il loro Eroe associato: otto personaggi diversi, come nel gioco. Clicca un posto per sceglierlo.",
    posto: (n: number) => `Eroe ${n}`,
    associato: "Associato",
    facoltativo: "Facoltativo",
    scegli: "Scegli",
    cambia: "Cambia",
    togliTitolo: (nome: string) => `Togli ${nome}`,
    scegliPosto: (n: number) => `Scegli l'eroe ${n}`,
    scegliAssociato: (nome: string) => `Scegli l'associato di ${nome}`,
    scegliAssociatoVuoto: (n: number) => `Scegli l'associato del posto ${n}`,
    eroiScelti: (n: number) => `${n} di 4 eroi`,
    chiudi: "Chiudi",
    cercaEroe: "Nome o epiteto",
    cercaEroeEtichetta: "Cerca un eroe",
    attributo: "Attributo",
    tutti: "Tutti",
    soloMiei: "Solo i miei",
    soloMieiTitolo: "Solo gli eroi che hai segnato in «I tuoi eroi»",
    possono: (n: number) => `Possono entrare (${n})`,
    nonPossono: (n: number) => `Non possono entrare qui (${n})`,
    motivo: {
      banned: "Escluso da questa battaglia",
      attribute: "Attributo non ammesso",
      group: "Personaggio già in squadra",
    } as Record<HeroReason, string>,
    associatiLiberi:
      "Per gli associati conta solo il personaggio diverso: attributi ed esclusioni valgono per chi combatte.",
    primaDifficoltaEroi: "Scegli la difficoltà per vedere chi può entrare: per ora conta solo il personaggio diverso.",
    mostraAltri: (n: number) => `Mostra altri ${n}`,
    nessunEroe: "Nessun eroe trovato.",
    problemaPosto: {
      banned: "Escluso da questa battaglia: cambialo.",
      attribute: "Attributo non ammesso a questa difficoltà: cambialo.",
      group: "Personaggio già in squadra: cambialo.",
    } as Record<HeroReason, string>,
    problemaAssociato: "Associato: personaggio già in squadra.",
    // il set
    set: "Set artefatto",
    setSpiega: (modalita: string) => `Solo i set che valgono in ${modalita}.`,
    setPrimaModalita: "Scegli prima la modalità: i set che valgono cambiano dall'una all'altra.",
    nessunSet: "Nessun set",
    nessunSetSpiega: "La squadra non dipende da un set.",
    scegliSet: "Scegli il set",
    cambiaSet: "Cambia set",
    cercaSet: "Nome o numero del set",
    cercaSetEtichetta: "Cerca un set",
    carte: (n: number) => (n === 1 ? "1 carta" : `${n} carte`),
    alMassimo: "Al livello massimo",
    setNonVale: (modalita: string) => `Questo set non vale in ${modalita}: scegline un altro o togli il set.`,
    nessunSetTrovato: "Nessun set trovato.",
    setScelto: "Scelto",
    // la guida
    guida: "Guida",
    guidaSpiega:
      "Lascia tutto vuoto e il consiglio di squadra si pubblica subito. Se scrivi qualcosa, anche solo il titolo, diventa una guida e la rivede un moderatore.",
    titolo: "Titolo",
    titoloPlaceholder: "Perché questa squadra, in una riga",
    titoloRegola: `Almeno ${titleMin} caratteri, se scrivi note o fasi.`,
    note: "Note generali",
    notePlaceholder: "Rotazione, carte, equipaggiamento, cosa cambia se manca un eroe.",
    fasiTitolo: "Fase per fase",
    fasiSpiega: "Una casella per fase, nell'ordine della battaglia. Lascia vuote quelle in cui non c'è niente da dire.",
    fasiPrimaDifficolta: "Scegli la difficoltà per scrivere fase per fase.",
    fasiInAttesa: (n: number) =>
      n === 1
        ? "Hai una nota di fase già scritta: ricompare quando scegli la difficoltà."
        : `Hai ${n} note di fase già scritte: ricompaiono quando scegli la difficoltà.`,
    fasiInPiu: (n: number) =>
      n === 1
        ? "Questa nota era per una fase che a questa difficoltà non c'è: così com'è non viene pubblicata."
        : `Queste ${n} note erano per fasi che a questa difficoltà non ci sono: così come sono non vengono pubblicate.`,
    faseN: (n: number) => `Fase ${n}`,
    spostaNelleNote: "Spostale nelle note generali",
    eliminale: "Eliminale",
    contatore: (n: number, max: number) => `${n}/${max}`,
    // i problemi
    problemi: "Prima di inviare",
    problema: {
      mode: () => "Scegli la modalità.",
      target: () => "Scegli il bersaglio.",
      level: () => "Scegli la difficoltà.",
      hero: (n: number) => `Manca l'eroe ${n}.`,
      banned: (n: number) => `L'eroe ${n} è escluso da questa battaglia.`,
      attribute: (n: number) => `L'eroe ${n} ha un attributo non ammesso a questa difficoltà.`,
      duplicate: (n: number, associato: boolean) =>
        associato ? `L'associato del posto ${n} è un personaggio già in squadra.` : `L'eroe ${n} è un personaggio già in squadra.`,
      set: () => "Il set scelto non vale in questa modalità.",
      notesLong: () => `Le note generali sono troppo lunghe: al massimo ${notesMax} caratteri.`,
      phaseLong: (fase: string) => `${fase}: nota troppo lunga, al massimo ${phaseMax} caratteri.`,
      titleOnly: () =>
        "Un titolo senza note né fasi non basta. Per un consiglio di squadra lascia vuoto il titolo: si pubblica subito. Per una guida scrivi anche le note o una fase.",
      titleMissing: () => `Una guida ha bisogno di un titolo: almeno ${titleMin} caratteri.`,
      titleShort: () => `Il titolo è troppo corto: almeno ${titleMin} caratteri.`,
      titleLong: () => `Il titolo è troppo lungo: al massimo ${titleMax} caratteri.`,
    },
    erroreInvio: "L'invio non è riuscito: controlla la connessione e riprova. La bozza è ancora qui.",
    // la barra
    tipoSquadra: "Consiglio di squadra",
    tipoGuida: "Guida",
    squadraSubito: "si pubblica subito",
    guidaRevisione: "la rivede un moderatore prima di pubblicarla",
    guidaResta: "resta pubblicata: il testo non è cambiato",
    pubblicaSquadra: "Pubblica la squadra",
    mandaRevisione: "Manda in revisione",
    salvaSquadra: "Salva la squadra",
    salvaGuida: "Salva la guida",
    invio: "Invio…",
    mancano: (cose: string) => `Mancano: ${cose}`,
    mancaModalita: "la modalità",
    mancaBersaglio: "il bersaglio",
    mancaDifficolta: "la difficoltà",
    mancanoEroi: (n: number) => (n === 1 ? "1 eroe" : `${n} eroi`),
    daSistemare: (n: number) => (n === 1 ? "1 cosa da sistemare" : `${n} cose da sistemare`),
    // la bozza
    bozzaRipresa: "Bozza ripresa da questo browser.",
    bozzaSalvata: "La bozza si salva in questo browser.",
    bozzaAltrove: (cosa: string) => `In questo browser c'è una bozza per ${cosa}.`,
    bozzaSenzaScelta: "una strategia senza modalità",
    riprendila: "Riprendila",
    bozzaSostituita: "Se scrivi qui, la sostituisci.",
    ricomincia: "Ricomincia",
    ricominciaDomanda: "Svuotare tutto? Si cancella anche la bozza salvata.",
    siRicomincia: "Sì, ricomincia",
    annullaModifiche: "Annulla le modifiche",
    annullaModificheDomanda: "Tornare alla versione salvata? Le modifiche di adesso si perdono.",
    siAnnulla: "Sì, torna indietro",
    annulla: "Annulla",
    passo: (n: number) => `Passo ${n}`,
    fatto: "Fatto",
  },
  en: {
    modalita: "Mode",
    modalitaSpiega: "Where the strategy applies.",
    bersagli: (n: number) => (n === 1 ? "1 target" : `${n} targets`),
    difficoltaN: (n: number) => (n === 1 ? "1 difficulty" : `${n} difficulties`),
    bersaglio: "Target",
    bersaglioBoss: "Which boss.",
    bersaglioBestia: "Which beast.",
    bersaglioUnico: (nome: string) => `${nome}: there's only one target, already chosen.`,
    primaModalita: "Choose the mode first.",
    difficolta: "Difficulty",
    difficoltaSpiega: "The difficulties in the game's colours. Below, who can join the team.",
    difficoltaBestie: "The regular floors (you write about the third, the hardest) or the transcendent floor.",
    soloNormali: "This beast has no transcendent floor.",
    primaBersaglio: "Choose the target first.",
    fasi: (n: number) => (n === 1 ? "1 phase" : `${n} phases`),
    limiti: (nome: string) => `Who can join at ${nome}`,
    attributiAmmessi: "Allowed attributes",
    tuttiAttributi: "All",
    eroiEsclusi: (n: number) => `Excluded heroes (${n})`,
    nessunEscluso: "None",
    squadra: "Team",
    squadraSpiega:
      "Four heroes and, if you like, their Associate Hero: eight different characters, as in the game. Click a slot to choose.",
    posto: (n: number) => `Hero ${n}`,
    associato: "Associate",
    facoltativo: "Optional",
    scegli: "Choose",
    cambia: "Change",
    togliTitolo: (nome: string) => `Remove ${nome}`,
    scegliPosto: (n: number) => `Choose hero ${n}`,
    scegliAssociato: (nome: string) => `Choose ${nome}'s associate`,
    scegliAssociatoVuoto: (n: number) => `Choose the associate for slot ${n}`,
    eroiScelti: (n: number) => `${n} of 4 heroes`,
    chiudi: "Close",
    cercaEroe: "Name or epithet",
    cercaEroeEtichetta: "Search for a hero",
    attributo: "Attribute",
    tutti: "All",
    soloMiei: "Only mine",
    soloMieiTitolo: "Only the heroes you marked in «Your heroes»",
    possono: (n: number) => `Can join (${n})`,
    nonPossono: (n: number) => `Can't join here (${n})`,
    motivo: {
      banned: "Excluded from this battle",
      attribute: "Attribute not allowed",
      group: "Character already in the team",
    } as Record<HeroReason, string>,
    associatiLiberi:
      "Associates only need to be a different character: attributes and exclusions apply to those who fight.",
    primaDifficoltaEroi: "Choose the difficulty to see who can join: for now only different characters count.",
    mostraAltri: (n: number) => `Show ${n} more`,
    nessunEroe: "No hero found.",
    problemaPosto: {
      banned: "Excluded from this battle: replace them.",
      attribute: "Attribute not allowed at this difficulty: replace them.",
      group: "Character already in the team: replace them.",
    } as Record<HeroReason, string>,
    problemaAssociato: "Associate: character already in the team.",
    set: "Artifact set",
    setSpiega: (modalita: string) => `Only the sets that work in ${modalita}.`,
    setPrimaModalita: "Choose the mode first: which sets work changes from one to another.",
    nessunSet: "No set",
    nessunSetSpiega: "The team doesn't depend on a set.",
    scegliSet: "Choose the set",
    cambiaSet: "Change set",
    cercaSet: "Set name or number",
    cercaSetEtichetta: "Search for a set",
    carte: (n: number) => (n === 1 ? "1 card" : `${n} cards`),
    alMassimo: "At max level",
    setNonVale: (modalita: string) => `This set doesn't work in ${modalita}: choose another or remove the set.`,
    nessunSetTrovato: "No set found.",
    setScelto: "Chosen",
    guida: "Guide",
    guidaSpiega:
      "Leave everything empty and the team suggestion goes live right away. Write anything, even just the title, and it becomes a guide that a moderator reviews.",
    titolo: "Title",
    titoloPlaceholder: "Why this team, in one line",
    titoloRegola: `At least ${titleMin} characters if you write notes or phases.`,
    note: "General notes",
    notePlaceholder: "Rotation, cards, gear, what changes if a hero is missing.",
    fasiTitolo: "Phase by phase",
    fasiSpiega: "One box per phase, in battle order. Leave empty the ones with nothing to say.",
    fasiPrimaDifficolta: "Choose the difficulty to write phase by phase.",
    fasiInAttesa: (n: number) =>
      n === 1
        ? "You've already written a phase note: it comes back when you choose the difficulty."
        : `You've already written ${n} phase notes: they come back when you choose the difficulty.`,
    fasiInPiu: (n: number) =>
      n === 1
        ? "This note was for a phase this difficulty doesn't have: as it is, it won't be published."
        : `These ${n} notes were for phases this difficulty doesn't have: as they are, they won't be published.`,
    faseN: (n: number) => `Phase ${n}`,
    spostaNelleNote: "Move them to the general notes",
    eliminale: "Delete them",
    contatore: (n: number, max: number) => `${n}/${max}`,
    problemi: "Before sending",
    problema: {
      mode: () => "Choose the mode.",
      target: () => "Choose the target.",
      level: () => "Choose the difficulty.",
      hero: (n: number) => `Hero ${n} is missing.`,
      banned: (n: number) => `Hero ${n} is excluded from this battle.`,
      attribute: (n: number) => `Hero ${n} has an attribute that isn't allowed at this difficulty.`,
      duplicate: (n: number, associato: boolean) =>
        associato ? `The associate in slot ${n} is a character already in the team.` : `Hero ${n} is a character already in the team.`,
      set: () => "The chosen set doesn't work in this mode.",
      notesLong: () => `The general notes are too long: ${notesMax} characters at most.`,
      phaseLong: (fase: string) => `${fase}: note too long, ${phaseMax} characters at most.`,
      titleOnly: () =>
        "A title with no notes or phases isn't enough. For a team suggestion leave the title empty: it goes live right away. For a guide, write the notes or a phase too.",
      titleMissing: () => `A guide needs a title: at least ${titleMin} characters.`,
      titleShort: () => `The title is too short: at least ${titleMin} characters.`,
      titleLong: () => `The title is too long: ${titleMax} characters at most.`,
    },
    erroreInvio: "Sending failed: check your connection and try again. Your draft is still here.",
    tipoSquadra: "Team suggestion",
    tipoGuida: "Guide",
    squadraSubito: "goes live right away",
    guidaRevisione: "a moderator reviews it before it's published",
    guidaResta: "stays published: the text hasn't changed",
    pubblicaSquadra: "Publish the team",
    mandaRevisione: "Send for review",
    salvaSquadra: "Save the team",
    salvaGuida: "Save the guide",
    invio: "Sending…",
    mancano: (cose: string) => `Missing: ${cose}`,
    mancaModalita: "the mode",
    mancaBersaglio: "the target",
    mancaDifficolta: "the difficulty",
    mancanoEroi: (n: number) => (n === 1 ? "1 hero" : `${n} heroes`),
    daSistemare: (n: number) => (n === 1 ? "1 thing to fix" : `${n} things to fix`),
    bozzaRipresa: "Draft restored from this browser.",
    bozzaSalvata: "The draft is saved in this browser.",
    bozzaAltrove: (cosa: string) => `This browser has a draft for ${cosa}.`,
    bozzaSenzaScelta: "a strategy with no mode",
    riprendila: "Restore it",
    bozzaSostituita: "If you write here, it gets replaced.",
    ricomincia: "Start over",
    ricominciaDomanda: "Clear everything? The saved draft is deleted too.",
    siRicomincia: "Yes, start over",
    annullaModifiche: "Discard changes",
    annullaModificheDomanda: "Go back to the saved version? Your current changes are lost.",
    siAnnulla: "Yes, go back",
    annulla: "Cancel",
    passo: (n: number) => `Step ${n}`,
    fatto: "Done",
  },
});

export type Texts = (typeof TESTI)["it"];

/** La frase di un problema, la stessa in alto, nella barra e accanto al campo. */
export function problemText(problem: EditorProblem, t: Texts, phaseLabel: (index: number) => string): string {
  switch (problem.code) {
    case "mode":
      return t.problema.mode();
    case "target":
      return t.problema.target();
    case "level":
      return t.problema.level();
    case "hero":
      return t.problema.hero(problem.slot + 1);
    case "banned":
      return t.problema.banned(problem.slot + 1);
    case "attribute":
      return t.problema.attribute(problem.slot + 1);
    case "duplicate":
      return t.problema.duplicate(problem.slot + 1, problem.associate);
    case "set":
      return t.problema.set();
    case "notes-long":
      return t.problema.notesLong();
    case "phase-long":
      return t.problema.phaseLong(phaseLabel(problem.phase));
    case "title-only":
      return t.problema.titleOnly();
    case "title-missing":
      return t.problema.titleMissing();
    case "title-short":
      return t.problema.titleShort();
    case "title-long":
      return t.problema.titleLong();
  }
}
