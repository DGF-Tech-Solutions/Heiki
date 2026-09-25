/**
 * Tipi della community.
 *
 * La scelta di prodotto che sta sotto: un post non e' solo testo, puo' portare
 * con se' il RISULTATO DI UNA SIMULAZIONE. E' quello che distingue questo posto
 * da un forum qualsiasi - qui si discute di numeri che chiunque puo' verificare,
 * non di opinioni. L'allegato e' riproducibile: porta seed e versione del
 * dataset, quindi chiunque puo' rifare il calcolo e ottenere gli stessi numeri.
 */

import type { Role } from "@/lib/auth/permissions";
import type { Bilingual, Locale } from "@/lib/i18n/locale";

export interface Author {
  username: string;
  displayName: string;
  role: Role;
  /** accento del profilo: la firma visiva dell'autore anche fuori dal profilo */
  accent: string;
}

/** Risultato di una simulazione allegato a un post. */
export interface SimulationAttachment {
  kind: "simulation";
  game: string;
  character: string;
  team: readonly string[];
  median: number;
  p10: number;
  p90: number;
  timeToKill: number | null;
  timeUnit: "seconds" | "turns";
  killRate: number;
  patch: string;
  seed: number;
  /**
   * Iterazioni con cui e' stato prodotto il risultato. Serve alla riverifica:
   * il motore e' deterministico dato il seed, ma solo a parita' di iterazioni.
   * Senza questo campo il confronto potrebbe fallire per un motivo che non ha
   * niente a che vedere con l'onesta' di chi ha pubblicato.
   */
  iterations: number;
  /** id dei personaggi, per poter rieseguire il calcolo senza indovinare i nomi */
  characterIds?: readonly string[];
}

export type Vote = -1 | 0 | 1;

export interface FeedPost {
  id: string;
  /** slug del gioco: il feed e' partizionato come il resto del sito */
  game: string;
  hub: string;
  hubName: string;
  title: string;
  excerpt: string;
  author: Author;
  score: number;
  commentCount: number;
  createdAt: string;
  attachment: SimulationAttachment | null;
  myVote: Vote;
}

export interface CommentNode {
  id: string;
  author: Author;
  body: string;
  score: number;
  createdAt: string;
  myVote: Vote;
  replies: readonly CommentNode[];
}

export interface PostDetail extends FeedPost {
  body: string;
  comments: readonly CommentNode[];
  /**
   * Un post nascosto da un moderatore non sparisce dal database: resta
   * raggiungibile solo a chi modera, che deve poterlo rileggere per decidere se
   * la decisione era giusta. Per tutti gli altri la pagina risponde 404.
   */
  hidden?: boolean;
}

/**
 * Lo sponsor e' un'entita' separata dai post, non un flag.
 * Il feed organico resta ordinabile solo per criteri organici, e la
 * separazione e' imposta dai tipi prima ancora che dallo schema.
 */
export interface SponsorItem {
  id: string;
  advertiser: string;
  title: string;
  body: string | null;
  targetUrl: string;
}

export interface Hub {
  slug: string;
  name: string;
  description: string;
}

export const HUBS: readonly Hub[] = [
  { slug: "build", name: "Build e numeri", description: "Risultati, confronti, ottimizzazioni" },
  { slug: "rotazioni", name: "Rotazioni", description: "Sequenze, timing, uptime dei buff" },
  { slug: "aiuto", name: "Aiuto", description: "Domande su squadre e progressione" },
  { slug: "generale", name: "Generale", description: "Tutto il resto" },
];

export function hubName(slug: string): string {
  return HUBS.find((hub) => hub.slug === slug)?.name ?? "Generale";
}

/**
 * I nomi delle sezioni nelle due lingue. `hubName` resta in italiano perche'
 * e' il nome scritto sul database quando la sezione nasce; a video si usa
 * questo, per slug.
 */
const HUB_LABELS: Readonly<Record<string, Bilingual>> = {
  build: { it: "Build e numeri", en: "Builds and numbers" },
  rotazioni: { it: "Rotazioni", en: "Rotations" },
  aiuto: { it: "Aiuto", en: "Help" },
  generale: { it: "Generale", en: "General" },
};

/**
 * Il nome di una sezione nella lingua del sito. Una sezione sconosciuta tiene
 * il nome che arriva dai dati, se c'e'.
 */
export function hubLabel(slug: string, locale: Locale, fallback?: string): string {
  return HUB_LABELS[slug]?.[locale] ?? fallback ?? HUB_LABELS.generale![locale];
}

export interface CreatePostInput {
  game: string;
  hub: string;
  title: string;
  body: string;
  attachment?: SimulationAttachment | null;
}

export interface CreateCommentInput {
  postId: string;
  parentId?: string | null;
  body: string;
}

/**
 * Forma da salvare in colonna jsonb. Esplicita invece di un cast, come per i
 * cosmetici: aggiungere un campo all'allegato obbliga a decidere se persisterlo.
 */
export function toAttachmentRecord(
  value: SimulationAttachment | null,
): Record<string, unknown> | null {
  if (value === null) return null;
  return {
    kind: value.kind,
    game: value.game,
    character: value.character,
    team: [...value.team],
    median: value.median,
    p10: value.p10,
    p90: value.p90,
    timeToKill: value.timeToKill,
    timeUnit: value.timeUnit,
    killRate: value.killRate,
    patch: value.patch,
    seed: value.seed,
    iterations: value.iterations,
    characterIds: value.characterIds ? [...value.characterIds] : undefined,
  };
}

/**
 * Ricostruisce un allegato letto da colonna jsonb.
 *
 * Il database restituisce `unknown`, non un tipo: dichiararlo con un cast e'
 * una bugia al compilatore che prima o poi si paga a runtime. E si e' pagata -
 * le righe scritte prima che esistesse il campo `iterations` facevano cadere la
 * pagina del feed.
 *
 * Ogni campo viene controllato; quelli mancanti prendono un valore neutro.
 * `iterations: 0` significa "non dichiarate", e la riverifica lo tratta come
 * non verificabile invece di accusare qualcuno.
 */
export function normalizeAttachment(value: unknown): SimulationAttachment | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;
  if (raw["kind"] !== "simulation") return null;

  const text = (key: string): string => (typeof raw[key] === "string" ? (raw[key] as string) : "");
  const num = (key: string): number => (typeof raw[key] === "number" ? (raw[key] as number) : 0);

  const team = Array.isArray(raw["team"])
    ? (raw["team"] as unknown[]).filter((item): item is string => typeof item === "string")
    : [];

  const characterIds = Array.isArray(raw["characterIds"])
    ? (raw["characterIds"] as unknown[]).filter((item): item is string => typeof item === "string")
    : undefined;

  return {
    kind: "simulation",
    game: text("game"),
    character: text("character"),
    team,
    median: num("median"),
    p10: num("p10"),
    p90: num("p90"),
    timeToKill: typeof raw["timeToKill"] === "number" ? (raw["timeToKill"] as number) : null,
    timeUnit: raw["timeUnit"] === "seconds" ? "seconds" : "turns",
    killRate: num("killRate"),
    patch: text("patch"),
    seed: num("seed"),
    iterations: num("iterations"),
    ...(characterIds && characterIds.length > 0 ? { characterIds } : {}),
  };
}
