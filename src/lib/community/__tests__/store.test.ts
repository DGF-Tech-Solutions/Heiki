/**
 * Verifica l'archivio in memoria, quello che regge la community finche' non
 * c'e' Postgres. Senza DATABASE_URL `getStore` restituisce proprio quello,
 * quindi il test esercita lo stesso percorso che usa il sito.
 *
 * Interessa il comportamento osservabile: pubblicare fa comparire il post,
 * commentare aggiorna il conteggio, e votare due volte annulla il voto invece
 * di raddoppiarlo.
 */

import { beforeEach, describe, expect, it } from "vitest";
import { GUEST, getStore } from "../store";
import type { Vote } from "../types";

beforeEach(() => {
  // L'archivio vive su globalThis per sopravvivere all'hot reload: qui si
  // azzera fra un test e l'altro per non farli dipendere dall'ordine.
  (globalThis as { __gachazoneCommunity?: unknown }).__gachazoneCommunity = undefined;
});

describe("archivio in memoria", () => {
  it("parte con i contenuti di esempio e si dichiara volatile", async () => {
    const store = await getStore();
    expect(store.volatile).toBe(true);

    const posts = await store.listPosts(null, null, GUEST);
    expect(posts.length).toBeGreaterThan(0);
  });

  it("filtra per gioco", async () => {
    const store = await getStore();
    expect((await store.listPosts("grand-cross", null, GUEST)).length).toBeGreaterThan(0);
    expect(await store.listPosts("gioco-inesistente", null, GUEST)).toEqual([]);
  });

  it("filtra per sezione", async () => {
    const store = await getStore();
    const build = await store.listPosts("grand-cross", "build", GUEST);

    expect(build.length).toBeGreaterThan(0);
    expect(build.every((post) => post.hub === "build")).toBe(true);
  });

  it("pubblicare aggiunge il post in cima con il voto dell'autore", async () => {
    const store = await getStore();
    const before = (await store.listPosts(null, null, GUEST)).length;

    const id = await store.createPost(
      { game: "grand-cross", hub: "build", title: "Prova di pubblicazione", body: "Corpo del messaggio di prova." },
      GUEST,
    );

    const after = await store.listPosts(null, null, GUEST);
    expect(after.length).toBe(before + 1);
    expect(after[0]?.id).toBe(id);
    expect(after[0]?.score).toBe(1);
    expect(after[0]?.myVote).toBe(1);
    expect(after[0]?.author.username).toBe(GUEST.username);
  });

  it("l'estratto viene ricavato dal corpo, senza marcatori", async () => {
    const store = await getStore();
    const id = await store.createPost(
      { game: "grand-cross", hub: "generale", title: "Titolo qualsiasi", body: "# Titolo\n\nTesto **in grassetto**." },
      GUEST,
    );

    const post = await store.getPost(id, GUEST);
    expect(post?.excerpt).toBe("Titolo Testo in grassetto.");
  });

  it("commentare aggiorna il conteggio del post", async () => {
    const store = await getStore();
    const id = await store.createPost(
      { game: "grand-cross", hub: "aiuto", title: "Una domanda qualunque", body: "Contenuto della domanda." },
      GUEST,
    );

    await store.createComment({ postId: id, body: "Prima risposta" }, GUEST);
    await store.createComment({ postId: id, body: "Seconda risposta" }, GUEST);

    const post = await store.getPost(id, GUEST);
    expect(post?.comments).toHaveLength(2);
    expect(post?.commentCount).toBe(2);
  });

  it("una risposta si annida sotto il commento giusto e conta nel totale", async () => {
    const store = await getStore();
    const id = await store.createPost(
      { game: "grand-cross", hub: "aiuto", title: "Un'altra domanda", body: "Contenuto della domanda." },
      GUEST,
    );

    await store.createComment({ postId: id, body: "Radice" }, GUEST);
    const withRoot = await store.getPost(id, GUEST);
    const rootId = withRoot?.comments[0]?.id;
    expect(rootId).toBeDefined();

    await store.createComment({ postId: id, parentId: rootId, body: "Risposta annidata" }, GUEST);

    const post = await store.getPost(id, GUEST);
    expect(post?.comments).toHaveLength(1);
    expect(post?.comments[0]?.replies).toHaveLength(1);
    // Il conteggio include le risposte annidate: e' il numero mostrato nel feed.
    expect(post?.commentCount).toBe(2);
  });

  it("votare due volte lo stesso verso annulla il voto", async () => {
    const store = await getStore();
    const [first] = await store.listPosts(null, null, GUEST);
    expect(first).toBeDefined();
    const baseline = first!.score;

    await store.votePost(first!.id, 1, GUEST);
    let post = await store.getPost(first!.id, GUEST);
    expect(post?.score).toBe(baseline + 1);
    expect(post?.myVote).toBe(1);

    await store.votePost(first!.id, 0, GUEST);
    post = await store.getPost(first!.id, GUEST);
    expect(post?.score).toBe(baseline);
    expect(post?.myVote).toBe(0);
  });

  it("passare da positivo a negativo sposta di due il punteggio", async () => {
    const store = await getStore();
    const [first] = await store.listPosts(null, null, GUEST);
    const baseline = first!.score;

    await store.votePost(first!.id, 1, GUEST);
    await store.votePost(first!.id, -1 as Vote, GUEST);

    const post = await store.getPost(first!.id, GUEST);
    expect(post?.score).toBe(baseline - 1);
    expect(post?.myVote).toBe(-1);
  });

  it("il voto su un commento tocca solo quel commento", async () => {
    const store = await getStore();
    const id = await store.createPost(
      { game: "grand-cross", hub: "generale", title: "Post con commenti", body: "Contenuto qualsiasi del post." },
      GUEST,
    );
    await store.createComment({ postId: id, body: "Commento da votare" }, GUEST);

    const before = await store.getPost(id, GUEST);
    const commentId = before?.comments[0]?.id;
    const postScore = before!.score;

    await store.voteComment(commentId!, 1, GUEST);

    const after = await store.getPost(id, GUEST);
    expect(after?.comments[0]?.score).toBe(1);
    expect(after?.score).toBe(postScore);
  });

  it("un id inesistente non fa esplodere nulla", async () => {
    const store = await getStore();
    expect(await store.getPost("non-esiste", GUEST)).toBeNull();
    await expect(store.votePost("non-esiste", 1, GUEST)).resolves.toBeUndefined();
    await expect(
      store.createComment({ postId: "non-esiste", body: "ciao" }, GUEST),
    ).resolves.toBeUndefined();
  });

  // Dal 10/10 niente sponsor d'esempio, nemmeno qui: uno finto finiva nel feed
  // vero. Lo spazio compare solo con uno sponsor vero (sponsor_placements).
  it("in modalita' dimostrativa non c'e' nessuno sponsor, e il feed ha solo post", async () => {
    const store = await getStore();
    const sponsors = await store.listSponsors();
    const posts = await store.listPosts(null, null, GUEST);

    expect(sponsors).toEqual([]);
    expect(posts.length).toBeGreaterThan(0);
  });
});
