import type { Bilingual } from "@/lib/i18n/locale";
import type { HeroEntry } from "./types";
import { COLLAB_FACTION } from "./randomizer";

/**
 * Il tuo account di gioco (27/09): chi sei nel gioco (nickname, Codice amico,
 * server) accanto a quello che il sito sa gia' tenere nel browser, la classe di
 * combattimento dell'account e le costellazioni (`account-setup.ts`).
 *
 * Tutto si salva nel browser, per chi non e' entrato, e nel database per chi e'
 * entrato (scelta dell'utente: «browser e database»): la copia piu' recente vince.
 * Qui solo regole pure, senza React e senza database: le usano la pagina, la
 * sincronizzazione, le azioni del server e i test.
 */

/**
 * I server. Il client non li nomina (nessun testo «server» o «world»): sono i due
 * calendari del sito, il globale e quello di Giappone e Corea, con Giappone e
 * Corea separati perche' sono due giochi con account diversi.
 */
export const SERVERS = ["global", "jp", "kr"] as const;
export type GameServer = (typeof SERVERS)[number];

export const SERVER_NAMES: Readonly<Record<GameServer, Bilingual>> = {
  global: { it: "Globale", en: "Global" },
  jp: { it: "Giappone", en: "Japan" },
  kr: { it: "Corea", en: "Korea" },
};

export interface GameAccountProfile {
  readonly nickname: string;
  /** il Codice amico del gioco («UI_menu_user_information_05»): con quello ti si cerca */
  readonly friendCode: string;
  readonly server: GameServer;
}

export const EMPTY_PROFILE: GameAccountProfile = { nickname: "", friendCode: "", server: "global" };

export const NICKNAME_MAX = 30;
export const FRIEND_CODE_MAX = 20;
/** Sopra non ci arriva nessun account: 375 eroi al massimo fanno circa 26 milioni. */
export const POWER_MAX = 100_000_000;

export function isServer(value: unknown): value is GameServer {
  return typeof value === "string" && (SERVERS as readonly string[]).includes(value);
}

/** Il Codice amico si copia dal gioco: si tengono solo lettere e cifre, senza spazi. */
export function cleanFriendCode(value: string): string {
  return value.replace(/[^0-9A-Za-z]/g, "").slice(0, FRIEND_CODE_MAX);
}

/**
 * Un profilo da qualunque fonte (browser, modulo, database), controllato: un
 * campo sbagliato torna vuoto invece di rompere la pagina.
 */
export function cleanProfile(input: unknown): GameAccountProfile {
  if (!input || typeof input !== "object") return EMPTY_PROFILE;
  const data = input as Record<string, unknown>;
  const text = (value: unknown) => (typeof value === "string" ? value : "");
  return {
    // i nickname del gioco possono avere spazi e simboli: si tolgono solo i caratteri di controllo
    nickname: text(data.nickname)
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .trim()
      .slice(0, NICKNAME_MAX),
    friendCode: cleanFriendCode(text(data.friendCode)),
    server: isServer(data.server) ? data.server : "global",
  };
}

export function parseProfile(raw: string | null): GameAccountProfile {
  if (!raw) return EMPTY_PROFILE;
  try {
    return cleanProfile(JSON.parse(raw));
  } catch {
    return EMPTY_PROFILE;
  }
}

export function isEmptyProfile(profile: GameAccountProfile): boolean {
  return profile.nickname === "" && profile.friendCode === "";
}

export function profileStorageKey(gameSlug: string): string {
  return `heiki:${gameSlug}:account`;
}

/**
 * Quando e' cambiato qualcosa nel browser (profilo, classe, costellazioni), in
 * millisecondi: si confronta con l'ultimo salvataggio del database.
 */
export function stampStorageKey(gameSlug: string): string {
  return `heiki:${gameSlug}:account-stamp`;
}

export function parseStamp(raw: string | null): number {
  const value = Number(raw);
  return raw !== null && Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * Quale copia vince fra browser e database. La piu' recente; a pari data il
 * database, che e' quella che gli altri dispositivi vedono. Se il browser non ha
 * niente di suo non manda niente: un browser vuoto non deve cancellare l'account.
 */
export function syncDirection(
  local: { readonly stamp: number; readonly hasData: boolean },
  server: { readonly updatedAt: number } | null,
): "to-browser" | "to-server" | "none" {
  if (server && server.updatedAt >= local.stamp) return "to-browser";
  if (local.hasData && (!server || local.stamp > server.updatedAt)) return "to-server";
  return "none";
}

/* ------------------------------------------------------------ verifica -- */

/**
 * Quante volte al giorno si puo' dire «non ce l'ho» all'eroe del giorno: abbastanza
 * per chi non ha un eroe, poco per chi cerca quello che ha gia' nei preferiti.
 */
export const MAX_REROLLS = 2;

/**
 * Fra una verifica approvata e la richiesta della successiva passa una
 * settimana (scelta dell'utente, 11/10): la classe verificata e' una foto del
 * momento, e aggiornarla ogni giorno chiederebbe ai moderatori una schermata al
 * giorno per account. Conta solo l'approvazione: chi e' stato respinto (una
 * schermata sbagliata) puo' riprovare subito.
 */
export const VERIFICATION_COOLDOWN_DAYS = 7;

/** Da quando si puo' chiedere una nuova verifica; null se si puo' gia'. */
export function nextVerificationAt(lastApprovedAt: Date | null, now: Date): Date | null {
  if (!lastApprovedAt) return null;
  const next = new Date(lastApprovedAt.getTime() + VERIFICATION_COOLDOWN_DAYS * 86_400_000);
  return next > now ? next : null;
}

/**
 * Da dove si pesca l'eroe del giorno: gli eroi che escono SR, senza le
 * collaborazioni (scelta dell'utente, 27/09). Sono della pescata di sempre, e
 * chiunque abbia un account avanti li ha: 30 eroi.
 */
export function challengePool(
  heroes: readonly Pick<HeroEntry, "id" | "obtainedAs">[],
  factionsOf: (heroId: string) => readonly number[] | undefined,
): string[] {
  return heroes
    .filter((hero) => hero.obtainedAs === "SR" && !(factionsOf(hero.id) ?? []).includes(COLLAB_FACTION))
    .map((hero) => hero.id)
    .sort();
}

/** Il giorno UTC (AAAA-MM-GG): uguale per il server e per chi carica, ovunque sia. */
export function utcDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Un eroe a caso del bacino, diverso da quelli gia' scartati. `random(n)` da' un
 * intero fra 0 e n-1 (sul server `crypto.randomInt`, nei test una sequenza).
 */
export function pickChallenge(
  pool: readonly string[],
  exclude: readonly string[],
  random: (n: number) => number,
): string | null {
  const left = pool.filter((id) => !exclude.includes(id));
  if (left.length === 0) return null;
  return left[random(left.length)] ?? null;
}

/** Le immagini che si accettano per la schermata, riconosciute dai primi byte. */
export type ScreenshotMime = "image/png" | "image/jpeg" | "image/webp";

export const SCREENSHOT_MAX_BYTES = 3 * 1024 * 1024;

export function sniffImage(bytes: Uint8Array): ScreenshotMime | null {
  const starts = (...values: number[]) => values.every((value, i) => bytes[i] === value);
  if (starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (starts(0xff, 0xd8, 0xff)) return "image/jpeg";
  // RIFF....WEBP
  if (starts(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return "image/webp";
  }
  return null;
}
