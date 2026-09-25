import { describe, expect, it } from "vitest";
import { roleLabel, ROLE_LABELS } from "../auth/permissions";
import { feedSortLabel, relativeTime } from "../community/ranking";
import { gameGroups, GAME_GROUPS } from "../games/catalog";
import { affinityLabel } from "../games/grand-cross/roster";
import { statusLabel, STATUS_LABELS } from "../guides/types";
import { reportReasonLabel } from "../moderation/reasons";
import { retryMessage } from "../rate-limit";

/**
 * Le etichette condivise da piu' pagine esistono nelle due lingue, e l'italiano
 * resta quello di prima per chi non passa ancora la lingua.
 */
describe("etichette condivise nelle due lingue", () => {
  it("ruoli, stati delle guide, motivi di segnalazione, ordinamenti", () => {
    expect(roleLabel("MODERATOR", "en")).toBe("Moderator");
    expect(roleLabel("MODERATOR", "it")).toBe(ROLE_LABELS.MODERATOR);
    expect(statusLabel("IN_REVIEW", "en")).toBe("In review");
    expect(statusLabel("IN_REVIEW", "it")).toBe(STATUS_LABELS.IN_REVIEW);
    expect(reportReasonLabel("spam", "en")).toBe("Spam or advertising");
    expect(reportReasonLabel("spam")).toBe("Spam o pubblicità");
    expect(reportReasonLabel("sconosciuto", "en")).toBe("sconosciuto");
    expect(feedSortLabel("top", "en")).toBe("Top voted");
  });

  it("i tempi relativi e i messaggi di attesa in inglese", () => {
    const now = new Date("2026-09-16T12:00:00Z");
    const at = (minutes: number) => relativeTime(new Date(now.getTime() - minutes * 60_000).toISOString(), now, "en");
    expect(at(0)).toBe("now");
    expect(at(60 * 24 * 2)).toBe("2 d");
    expect(at(60 * 24 * 60)).toBe("2 mo");
    expect(retryMessage({ allowed: false, remaining: 0, retryAfter: 30 }, "en")).toContain("30 seconds");
    expect(retryMessage({ allowed: false, remaining: 0, retryAfter: 60 }, "en")).toContain("1 minute.");
  });

  it("le sezioni dei giochi e gli attributi", () => {
    const en = gameGroups("grand-cross", "en");
    expect(en.map((group) => group.label)).toContain("Tools");
    expect(en.flatMap((group) => group.items).map((item) => item.label)).toContain("Heroes");
    expect(gameGroups("grand-cross").map((group) => group.label)).toEqual(
      GAME_GROUPS.map((group) => group.label).filter((label) => gameGroups("grand-cross").some((g) => g.label === label)),
    );
    expect(affinityLabel("Velocita", "en")).toBe("Speed");
    expect(affinityLabel("Velocita", "it")).toBe("Velocità");
  });
});
