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
  };
}
