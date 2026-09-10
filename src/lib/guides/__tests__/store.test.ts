import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Archivio delle guide in memoria.
 *
 * E' il percorso che gira quando si avvia il sito senza database, cioe' quello
 * che vede chi prova il progetto per la prima volta. Se si rompe, la prima
 * impressione e' una pagina vuota.
 *
 * `@/lib/db` viene sostituito perche' importarlo aprirebbe una connessione:
 * qui interessa solo che `databaseReachable` dica no, e che tutto il resto
 * funzioni comunque.
 */
vi.mock("@/lib/db", () => ({
  databaseReachable: async () => false,
  db: {},
}));

const { getGuideStore } = await import("../store");

const WRITER = { id: "u1", username: "prova", displayName: "Prova", accent: "brand" };

const BODY = [
  "## Prima sezione",
  "",
  "Un corpo abbastanza lungo da superare la soglia minima prevista dal modulo di scrittura, cosi' il test esercita il percorso vero invece di quello degli errori di validazione.",
  "",
  "- un punto",
].join("\n");

describe("archivio guide in memoria", () => {
  beforeEach(() => {
    // Lo stato vive su globalThis per sopravvivere ai ricaricamenti in
    // sviluppo: qui va azzerato fra i test, altrimenti si portano dietro le
    // guide create da quello precedente.
    globalThis.__gachazoneGuides = undefined;
  });

  it("senza database usa l'archivio volatile, e lo dichiara", async () => {
    const store = await getGuideStore();
    expect(store.volatile).toBe(true);
  });

  it("parte con le guide di esempio pubblicate", async () => {
    const store = await getGuideStore();
    const list = await store.list("grand-cross");

    expect(list.length).toBeGreaterThan(0);
    expect(list.every((guide) => guide.status === "PUBLISHED")).toBe(true);
  });

  /**
   * Una delle due guide di esempio dichiara una patch vecchia di proposito: e'
   * il caso in cui il sito deve dire "da rivedere". Un esempio in cui tutto e'
   * in ordine non mostrerebbe come si comporta quando qualcosa scade.
   */
  it("fra gli esempi ce n'è una ferma a una patch precedente", async () => {
    const store = await getGuideStore();
    const list = await store.list("grand-cross");

    const patches = new Set(list.map((guide) => guide.verifiedPatch));
    expect(patches.size).toBeGreaterThan(1);
  });

  it("le guide di un altro gioco non compaiono", async () => {
    const store = await getGuideStore();
    expect(await store.list("genshin-impact")).toEqual([]);
  });

  it("una guida nuova nasce come bozza e resta fuori dall'elenco pubblico", async () => {
    const store = await getGuideStore();
    const slug = await store.create(
      { game: "grand-cross", title: "Titolo della prova", body: BODY, characterId: null },
      WRITER,
    );

    const created = await store.get("grand-cross", slug);
    expect(created?.status).toBe("DRAFT");
    expect(created?.verifiedPatch).toBeNull();

    expect((await store.list("grand-cross")).some((guide) => guide.slug === slug)).toBe(false);
    expect(
      (await store.list("grand-cross", { includeUnpublished: true })).some(
        (guide) => guide.slug === slug,
      ),
    ).toBe(true);
  });

  it("ricava l'estratto dal primo paragrafo, non dal titolo della sezione", async () => {
    const store = await getGuideStore();
    const slug = await store.create(
      { game: "grand-cross", title: "Titolo della prova", body: BODY, characterId: null },
      WRITER,
    );

    const created = await store.get("grand-cross", slug);
    expect(created?.excerpt.startsWith("Un corpo abbastanza lungo")).toBe(true);
  });

  it("due guide con lo stesso titolo non condividono l'indirizzo", async () => {
    const store = await getGuideStore();

    const first = await store.create(
      { game: "grand-cross", title: "Titolo ripetuto", body: BODY, characterId: null },
      WRITER,
    );
    const second = await store.create(
      { game: "grand-cross", title: "Titolo ripetuto", body: BODY, characterId: null },
      WRITER,
    );

    expect(second).not.toBe(first);
    expect(await store.get("grand-cross", first)).not.toBeNull();
    expect(await store.get("grand-cross", second)).not.toBeNull();
  });

  it("pubblicare assegna la data una volta sola", async () => {
    const store = await getGuideStore();
    const slug = await store.create(
      { game: "grand-cross", title: "Titolo della prova", body: BODY, characterId: null },
      WRITER,
    );
    const created = await store.get("grand-cross", slug);
    expect(created).not.toBeNull();

    await store.setStatus(created!.id, "PUBLISHED");
    const published = await store.get("grand-cross", slug);
    expect(published?.publishedAt).not.toBeNull();

    // Archiviare e ripubblicare non e' un contenuto nuovo: la data non cambia.
    await store.setStatus(created!.id, "ARCHIVED");
    await store.setStatus(created!.id, "PUBLISHED");
    expect((await store.get("grand-cross", slug))?.publishedAt).toBe(published?.publishedAt);
  });

  it("modificare aggiunge una voce di cronologia e riallinea l'estratto", async () => {
    const store = await getGuideStore();
    const slug = await store.create(
      { game: "grand-cross", title: "Titolo della prova", body: BODY, characterId: null },
      WRITER,
    );
    const created = await store.get("grand-cross", slug);

    await store.update(
      created!.id,
      { body: `## Nuova sezione\n\nTesto completamente diverso da quello iniziale, lungo quanto serve per restare una guida.` },
      WRITER,
      "nota di prova",
    );

    const edited = await store.get("grand-cross", slug);
    expect(edited?.revisions).toHaveLength(1);
    expect(edited?.revisions[0]?.note).toBe("nota di prova");
    expect(edited?.excerpt.startsWith("Testo completamente diverso")).toBe(true);
  });

  it("dichiarare la patch la registra in cronologia; svuotarla la rimuove", async () => {
    const store = await getGuideStore();
    const slug = await store.create(
      { game: "grand-cross", title: "Titolo della prova", body: BODY, characterId: null },
      WRITER,
    );
    const created = await store.get("grand-cross", slug);

    await store.setVerifiedPatch(created!.id, "1.2", WRITER);
    const verified = await store.get("grand-cross", slug);
    expect(verified?.verifiedPatch).toBe("1.2");
    expect(verified?.revisions[0]?.patch).toBe("1.2");

    await store.setVerifiedPatch(created!.id, null, WRITER);
    expect((await store.get("grand-cross", slug))?.verifiedPatch).toBeNull();
  });

  it("un indirizzo inesistente non trova niente", async () => {
    const store = await getGuideStore();
    expect(await store.get("grand-cross", "non-esiste")).toBeNull();
  });
});
