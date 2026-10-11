/**
 * Moderazione e amministrazione: le regole su chi puo' cosa, e le azioni
 * chiamate con argomenti scelti dal chiamante.
 *
 * Ogni export di un modulo "use server" e' un indirizzo che il browser puo'
 * chiamare con quello che vuole: le prove qui sotto chiamano le azioni come le
 * chiamerebbe chi non passa dall'interfaccia, con un database finto che registra
 * le scritture (e se stanno dentro una transazione).
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

/* ------------------------------------------------------- database finto -- */

const h = vi.hoisted(() => {
  interface Write {
    op: "insert" | "update" | "delete";
    table: unknown;
    values: unknown;
    inTx: boolean;
  }
  const state = {
    session: null as null | { user: { id: string; role: string } },
    /** risposte di db.query.<tabella>.findFirst, per tabella */
    find: {} as Record<string, (args: Record<string, unknown>) => unknown>,
    findMany: {} as Record<string, (args: Record<string, unknown>) => unknown[]>,
    /** cosa restituiscono i `.returning()`, nell'ordine */
    returning: [] as unknown[][],
    writes: [] as Write[],
    reads: 0,
    inTx: false,
  };

  function writer(op: Write["op"], table: unknown) {
    const entry: Write = { op, table, values: undefined, inTx: state.inTx };
    state.writes.push(entry);
    const chain = {
      set(values: unknown) {
        entry.values = values;
        return chain;
      },
      values(values: unknown) {
        entry.values = values;
        return chain;
      },
      where: () => chain,
      onConflictDoUpdate: () => chain,
      returning: async () => state.returning.shift() ?? [],
      then(resolve: (value: unknown) => unknown, reject?: (reason: unknown) => unknown) {
        return Promise.resolve(undefined).then(resolve, reject);
      },
    };
    return chain;
  }

  const query = new Proxy(
    {},
    {
      get: (_target, table: string) => ({
        findFirst: async (args: Record<string, unknown>) => {
          state.reads += 1;
          return state.find[table]?.(args);
        },
        findMany: async (args: Record<string, unknown>) => {
          state.reads += 1;
          return state.findMany[table]?.(args) ?? [];
        },
      }),
    },
  );

  const db = {
    query,
    insert: (table: unknown) => writer("insert", table),
    update: (table: unknown) => writer("update", table),
    delete: (table: unknown) => writer("delete", table),
    execute: async () => [],
    async transaction<T>(work: (tx: unknown) => Promise<T>): Promise<T> {
      state.inTx = true;
      try {
        return await work(db);
      } finally {
        state.inTx = false;
      }
    },
  };

  return { state, db };
});

vi.mock("@/lib/db", () => ({
  db: h.db,
  databaseReachable: async () => true,
  isDatabaseConfigured: () => true,
}));
vi.mock("@/lib/auth", () => ({ auth: async () => h.state.session }));
vi.mock("@/lib/i18n/server", () => ({ getLocale: async () => "it" }));
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("next/server", () => ({ after: () => {} }));
vi.mock("@/lib/discord", () => ({ notifyModerators: async () => {} }));
vi.mock("@/lib/profile/load", () => ({ hasActivePremium: async () => false, rosterOf: () => undefined }));

import { canLiftSuspension, canSuspend } from "@/lib/moderation/suspension";
import { ASSIGNABLE_ROLES, canAssignRole } from "@/lib/admin/roles";
import {
  liftSuspensionAction,
  recentModActions,
  reportAction,
  resolveReportAction,
  setHiddenAction,
  suspendAction,
} from "@/lib/moderation/actions";
import { setRoleAction, toggleSponsorAction } from "@/lib/admin/actions";
import { reviewVerificationAction, saveGameAccountAction } from "@/lib/game-account/actions";
import { saveProfileAction } from "@/lib/profile/actions";
import { GET as screenshot } from "@/app/api/verifiche/[id]/schermata/route";
import { comments, modActions, sponsorPlacements, suspensions, users } from "@/lib/db/schema";

const ME = "11111111-1111-4111-8111-111111111111";
const OTHER = "22222222-2222-4222-8222-222222222222";
const THING = "33333333-3333-4333-8333-333333333333";
const ADMIN_ID = "44444444-4444-4444-8444-444444444444";

/** chi chiede, e se e' sospeso in questo momento */
function as(id: string, role: string, options: { suspended?: boolean } = {}) {
  h.state.session = { user: { id, role } };
  const previous = h.state.find.suspensions;
  h.state.find.suspensions = (args) => {
    // suspensionFor legge solo motivo e scadenza; la revoca chiede anche le persone
    if (!args.with) return options.suspended ? { reason: "prova", until: null } : undefined;
    return previous?.(args);
  };
}

function writesTo(table: unknown) {
  return h.state.writes.filter((write) => write.table === table);
}

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  h.state.session = null;
  h.state.find = {};
  h.state.findMany = {};
  h.state.returning = [];
  h.state.writes = [];
  h.state.reads = 0;
  h.state.inTx = false;
});

/* --------------------------------------------------------- regole pure -- */

describe("canSuspend", () => {
  const mod = { id: ME, role: "MODERATOR" } as const;
  const admin = { id: ADMIN_ID, role: "ADMIN" } as const;

  it("un moderatore sospende un utente, non un amministratore ne' un collega", () => {
    expect(canSuspend(mod, { id: OTHER, role: "USER" })).toEqual({ ok: true });
    expect(canSuspend(mod, { id: OTHER, role: "ADMIN" })).toEqual({ ok: false, reason: "amministratore" });
    expect(canSuspend(mod, { id: OTHER, role: "MODERATOR" })).toEqual({ ok: false, reason: "moderatore" });
  });

  it("fra moderatori decide un amministratore; nessuno sospende se stesso", () => {
    expect(canSuspend(admin, { id: OTHER, role: "MODERATOR" })).toEqual({ ok: true });
    expect(canSuspend(mod, mod)).toEqual({ ok: false, reason: "seStesso" });
  });

  it("chi non modera non sospende", () => {
    expect(canSuspend({ id: ME, role: "EDITOR" }, { id: OTHER, role: "USER" })).toEqual({
      ok: false,
      reason: "nonModeratore",
    });
  });
});

describe("canLiftSuspension", () => {
  const mod = { id: ME, role: "MODERATOR" } as const;
  const admin = { id: ADMIN_ID, role: "ADMIN" } as const;
  const user = { id: OTHER, role: "USER" } as const;

  it("un moderatore revoca la sospensione di un utente data da un moderatore", () => {
    expect(canLiftSuspension({ actor: mod, suspended: user, issuerRole: "MODERATOR" })).toEqual({ ok: true });
  });

  it("serve un amministratore se l'ha data un amministratore o se il sospeso e' dello staff", () => {
    const needsAdmin = { ok: false, reason: "serveAmministratore" };
    expect(canLiftSuspension({ actor: mod, suspended: user, issuerRole: "ADMIN" })).toEqual(needsAdmin);
    expect(
      canLiftSuspension({ actor: mod, suspended: { id: OTHER, role: "MODERATOR" }, issuerRole: "ADMIN" }),
    ).toEqual(needsAdmin);
    expect(
      canLiftSuspension({ actor: mod, suspended: { id: OTHER, role: "ADMIN" }, issuerRole: "MODERATOR" }),
    ).toEqual(needsAdmin);
    expect(canLiftSuspension({ actor: admin, suspended: user, issuerRole: "ADMIN" })).toEqual({ ok: true });
    expect(
      canLiftSuspension({ actor: admin, suspended: { id: OTHER, role: "MODERATOR" }, issuerRole: "ADMIN" }),
    ).toEqual({ ok: true });
  });

  it("nessuno revoca la propria, nemmeno un amministratore", () => {
    expect(canLiftSuspension({ actor: admin, suspended: admin, issuerRole: "ADMIN" })).toEqual({
      ok: false,
      reason: "propria",
    });
    expect(canLiftSuspension({ actor: mod, suspended: mod, issuerRole: "MODERATOR" })).toEqual({
      ok: false,
      reason: "propria",
    });
  });

  it("chi non modera non revoca", () => {
    expect(
      canLiftSuspension({ actor: { id: ME, role: "USER" }, suspended: user, issuerRole: "MODERATOR" }),
    ).toEqual({ ok: false, reason: "nonModeratore" });
  });
});

describe("canAssignRole", () => {
  const admin = { id: ADMIN_ID, role: "ADMIN" } as const;
  const user = { id: OTHER, role: "USER" } as const;

  it("un amministratore da' i ruoli fino a moderatore", () => {
    expect(canAssignRole(admin, user, "MODERATOR")).toEqual({ ok: true });
    expect(canAssignRole(admin, { id: OTHER, role: "MODERATOR" }, "USER")).toEqual({ ok: true });
  });

  it("amministratore non si da' dal sito: solo con npm run promote", () => {
    expect(canAssignRole(admin, user, "ADMIN")).toEqual({ ok: false, reason: "ruoloAmministratore" });
    expect(ASSIGNABLE_ROLES).not.toContain("ADMIN");
    expect(ASSIGNABLE_ROLES).toContain("MODERATOR");
  });

  it("non su se stessi, non su un altro amministratore, non da chi non amministra", () => {
    expect(canAssignRole(admin, admin, "USER")).toEqual({ ok: false, reason: "seStesso" });
    expect(canAssignRole(admin, { id: OTHER, role: "ADMIN" }, "USER")).toEqual({
      ok: false,
      reason: "bersaglioAmministratore",
    });
    expect(canAssignRole({ id: ME, role: "MODERATOR" }, user, "EDITOR")).toEqual({
      ok: false,
      reason: "nonAmministratore",
    });
  });
});

/* ------------------------------------------ azioni con argomenti a caso -- */

describe("setHiddenAction", () => {
  beforeEach(() => as(ME, "MODERATOR"));

  it("respinge un tipo, un id o un valore inventati senza scrivere niente", async () => {
    const invalid = { ok: false, error: "Dati non validi." };
    expect(await setHiddenAction("USER" as never, THING, true)).toEqual(invalid);
    expect(await setHiddenAction("POST", "1 or 1=1", true)).toEqual(invalid);
    expect(await setHiddenAction("POST", "------------------------------------", true)).toEqual(invalid);
    expect(await setHiddenAction("POST", THING, "si" as never)).toEqual(invalid);
    expect(h.state.writes).toEqual([]);
  });

  it("contenuto e registro nella stessa transazione", async () => {
    h.state.returning = [[{ id: THING }]];
    const result = await setHiddenAction("COMMENT", THING, true);
    expect(result.ok).toBe(true);
    const [update] = writesTo(comments);
    const [log] = writesTo(modActions);
    expect(update).toMatchObject({ op: "update", inTx: true, values: { hidden: true } });
    expect(log).toMatchObject({ inTx: true, values: { targetType: "COMMENT", targetId: THING, action: "hide" } });
  });

  it("un contenuto che non c'e' non lascia una riga nel registro", async () => {
    h.state.returning = [[]];
    expect(await setHiddenAction("POST", THING, true)).toEqual({ ok: false, error: "Contenuto inesistente." });
    expect(writesTo(modActions)).toEqual([]);
  });

  it("chi non modera, o e' sospeso, non nasconde", async () => {
    as(ME, "EDITOR");
    expect((await setHiddenAction("POST", THING, true)).ok).toBe(false);
    as(ME, "MODERATOR", { suspended: true });
    expect((await setHiddenAction("POST", THING, true)).ok).toBe(false);
    expect(h.state.writes).toEqual([]);
  });
});

describe("resolveReportAction", () => {
  beforeEach(() => as(ME, "MODERATOR"));

  it("solo RESOLVED o DISMISSED: OPEN non riapre niente", async () => {
    expect(await resolveReportAction(THING, "OPEN" as never)).toEqual({ ok: false, error: "Dati non validi." });
    expect(await resolveReportAction("non-un-id", "RESOLVED")).toEqual({ ok: false, error: "Dati non validi." });
    expect(h.state.writes).toEqual([]);
  });

  it("chiusura e registro insieme; una segnalazione gia' chiusa non si richiude", async () => {
    h.state.returning = [[{ targetType: "POST", targetId: THING }], []];
    expect((await resolveReportAction(THING, "DISMISSED")).ok).toBe(true);
    expect(writesTo(modActions)).toEqual([
      expect.objectContaining({ inTx: true, values: expect.objectContaining({ action: "dismiss" }) }),
    ]);
    expect((await resolveReportAction(THING, "RESOLVED")).ok).toBe(false);
    expect(writesTo(modActions)).toHaveLength(1);
  });
});

describe("sospensioni", () => {
  it("la sospensione e la sua riga nel registro, nella stessa transazione", async () => {
    as(ME, "MODERATOR");
    h.state.find.users = () => ({ id: OTHER, role: "USER" });
    const result = await suspendAction({ ok: false }, form({ userId: OTHER, reason: "insulti ripetuti", days: "7" }));
    expect(result.ok).toBe(true);
    expect(writesTo(suspensions)[0]).toMatchObject({ op: "insert", inTx: true });
    expect(writesTo(modActions)[0]).toMatchObject({
      inTx: true,
      values: { targetType: "USER", targetId: OTHER, action: "suspend", reason: "insulti ripetuti" },
    });
  });

  it("un moderatore non revoca la sospensione data da un amministratore", async () => {
    h.state.find.suspensions = () => ({ id: THING, user: { id: OTHER, role: "USER" }, moderator: { role: "ADMIN" } });
    as(ME, "MODERATOR");
    const result = await liftSuspensionAction(THING);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/amministratore/);
    expect(h.state.writes).toEqual([]);
  });

  it("un amministratore la revoca: resta scritto chi, e c'e' la riga nel registro", async () => {
    h.state.find.suspensions = () => ({ id: THING, user: { id: OTHER, role: "USER" }, moderator: { role: "ADMIN" } });
    as(ADMIN_ID, "ADMIN");
    h.state.returning = [[{ id: THING }]];
    expect((await liftSuspensionAction(THING)).ok).toBe(true);
    expect(writesTo(suspensions)[0]).toMatchObject({ op: "update", inTx: true, values: { liftedBy: ADMIN_ID } });
    expect(writesTo(modActions)[0]).toMatchObject({
      inTx: true,
      values: { targetType: "USER", targetId: OTHER, action: "lift_suspension" },
    });
  });

  it("un id che non e' un UUID si respinge prima del database", async () => {
    as(ME, "MODERATOR");
    const reads = h.state.reads;
    expect(await liftSuspensionAction("x' OR '1'='1")).toEqual({ ok: false, error: "Dati non validi." });
    // l'unica lettura e' quella della sospensione di chi chiede
    expect(h.state.reads - reads).toBe(1);
  });

  it("chi e' sospeso non segnala", async () => {
    as(ME, "USER", { suspended: true });
    const result = await reportAction(
      { ok: false },
      form({ targetType: "POST", targetId: THING, reason: "spam" }),
    );
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/sospeso/);
    expect(h.state.writes).toEqual([]);
  });

  it("il registro restituisce anche il motivo di ogni riga", async () => {
    as(ME, "MODERATOR");
    h.state.findMany.modActions = () => [
      {
        id: THING,
        action: "set_role",
        targetType: "USER",
        reason: "USER->MODERATOR",
        moderator: { username: "franz" },
        createdAt: new Date(0),
      },
    ];
    const [row] = await recentModActions(10_000);
    expect(row).toMatchObject({ action: "set_role", reason: "USER->MODERATOR", moderator: "franz" });
  });
});

describe("amministrazione", () => {
  beforeEach(() => as(ADMIN_ID, "ADMIN"));

  it("il ruolo di amministratore non si assegna dal pannello", async () => {
    h.state.find.users = () => ({ id: OTHER, username: "mario", role: "USER" });
    const result = await setRoleAction({}, form({ userId: OTHER, role: "ADMIN" }));
    expect(result.error).toMatch(/npm run promote/);
    expect(h.state.writes).toEqual([]);
  });

  it("un cambio di ruolo scrive USER, set_role e VECCHIO->NUOVO nel registro", async () => {
    h.state.find.users = () => ({ id: OTHER, username: "mario", role: "USER" });
    const result = await setRoleAction({}, form({ userId: OTHER, role: "MODERATOR" }));
    expect(result.success).toBeDefined();
    expect(writesTo(users)[0]).toMatchObject({ op: "update", inTx: true, values: { role: "MODERATOR" } });
    expect(writesTo(modActions)[0]).toMatchObject({
      inTx: true,
      values: { targetType: "USER", targetId: OTHER, action: "set_role", reason: "USER->MODERATOR" },
    });
  });

  it("sponsor: id e stato validati, e il cambio finisce nel registro", async () => {
    expect(await toggleSponsorAction("../../etc", true)).toEqual({ error: "Dati non validi." });
    expect(await toggleSponsorAction(THING, "true" as never)).toEqual({ error: "Dati non validi." });
    expect(h.state.writes).toEqual([]);

    h.state.returning = [[{ id: THING }]];
    expect((await toggleSponsorAction(THING, false)).success).toBeDefined();
    expect(writesTo(sponsorPlacements)[0]).toMatchObject({ inTx: true, values: { active: false } });
    expect(writesTo(modActions)[0]).toMatchObject({
      inTx: true,
      values: { targetType: "SPONSOR", targetId: THING, action: "sponsor_off" },
    });
  });

  it("un moderatore, o un amministratore sospeso, non entra nelle azioni di amministrazione", async () => {
    as(ME, "MODERATOR");
    expect((await toggleSponsorAction(THING, true)).error).toBeDefined();
    expect((await setRoleAction({}, form({ userId: OTHER, role: "EDITOR" }))).error).toBeDefined();
    as(ADMIN_ID, "ADMIN", { suspended: true });
    expect((await toggleSponsorAction(THING, true)).error).toBeDefined();
    expect(h.state.writes).toEqual([]);
  });
});

/* ----------------------------------------------- verifiche della classe -- */

describe("schermata della verifica", () => {
  const params = (id: string) => ({ params: Promise.resolve({ id }) });
  const request = new Request("http://localhost/api/verifiche/x/schermata");

  beforeEach(() => {
    h.state.find.powerVerifications = () => ({ userId: OTHER });
    h.state.find.verificationScreenshots = () => ({ mime: "image/png", bytes: Buffer.from([1, 2, 3]) });
  });

  it("un id che non e' un UUID e' 404 senza chiedere niente al database", async () => {
    as(ME, "MODERATOR");
    const response = await screenshot(request, params("------------------------------------"));
    expect(response.status).toBe(404);
    expect(h.state.reads).toBe(0);
  });

  it("un moderatore sospeso non la vede, uno attivo si'", async () => {
    as(ME, "MODERATOR", { suspended: true });
    expect((await screenshot(request, params(THING))).status).toBe(404);
    as(ME, "MODERATOR");
    expect((await screenshot(request, params(THING))).status).toBe(200);
  });

  it("chi l'ha caricata la rivede anche da sospeso; un altro utente no", async () => {
    as(OTHER, "USER", { suspended: true });
    expect((await screenshot(request, params(THING))).status).toBe(200);
    as(ME, "USER");
    expect((await screenshot(request, params(THING))).status).toBe(404);
  });

  it("la decisione rifiuta un id malformato", async () => {
    as(ME, "MODERATOR");
    const result = await reviewVerificationAction(
      form({ id: "------------------------------------", decision: "approve", power: "1000" }),
    );
    expect(result).toEqual({ ok: false, error: "Dati non validi." });
  });
});

describe("account di gioco", () => {
  it("chi e' sospeso non salva l'account", async () => {
    as(ME, "USER", { suspended: true });
    const result = await saveGameAccountAction("grand-cross", {});
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/sospeso/);
    expect(h.state.writes).toEqual([]);
  });

  it("uno slug che non e' uno slug e' un gioco sconosciuto, non un errore", async () => {
    as(ME, "USER");
    expect(await saveGameAccountAction({ slug: 1 } as never, {})).toEqual({ ok: false, error: "Gioco sconosciuto." });
  });
});

/* -------------------------------------------------------------- profilo -- */

describe("saveProfileAction", () => {
  const payload = (changes: Partial<Record<string, unknown>> = {}) =>
    ({
      username: "franz",
      displayName: "Franz",
      bio: "",
      country: "",
      favorites: [],
      customization: {},
      badges: [],
      ...changes,
    }) as never;

  function current(role: string, username = "franz", displayName = "Franz") {
    // la prima lettura e' l'utente stesso (col profilo), la seconda cerca l'handle preso
    h.state.find.users = (args) => (args.with ? { username, role, profile: { displayName } } : undefined);
  }

  beforeEach(() => as(ME, "USER"));

  it("un handle riservato non si prende", async () => {
    current("USER");
    expect(await saveProfileAction(payload({ username: "admin" }))).toEqual({
      ok: false,
      error: "Questo handle è riservato al sito: scegline un altro.",
    });
    expect(await saveProfileAction(payload({ username: "eliminato-1a2b3c4d" }))).toMatchObject({ ok: false });
    expect(h.state.writes).toEqual([]);
  });

  it("chi l'aveva gia' non resta chiuso fuori dal profilo", async () => {
    current("ADMIN", "admin");
    expect(await saveProfileAction(payload({ username: "admin" }))).toEqual({ ok: true, username: "admin" });
  });

  it("un nome che imita lo staff o con caratteri invisibili si respinge", async () => {
    current("USER");
    expect((await saveProfileAction(payload({ displayName: "Moderatore Ufficiale" }))).error).toMatch(/staff/);
    expect((await saveProfileAction(payload({ displayName: "Fra‮nz" }))).error).toMatch(/invisibili/);
    expect(h.state.writes).toEqual([]);
  });

  it("lo staff vero puo' dirsi staff", async () => {
    current("MODERATOR");
    expect((await saveProfileAction(payload({ displayName: "Franz moderatore" }))).ok).toBe(true);
  });

  it("chi e' sospeso non cambia il profilo", async () => {
    as(ME, "USER", { suspended: true });
    current("USER");
    const result = await saveProfileAction(payload({ displayName: "Nuovo nome" }));
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/sospeso/);
    expect(h.state.writes).toEqual([]);
  });
});
