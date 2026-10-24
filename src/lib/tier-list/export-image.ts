import { SITE_NAME } from "@/lib/site";
import type { TierHeroItem, TierRow } from "./types";

/*
 * Larghezza fissa: fino al 24/10 cresceva con la riga piu' lunga, e una riga
 * con un centinaio di eroi dava una tela larga piu' di 17.000 pixel, oltre il
 * limite dei canvas su iPhone (l'immagine non si creava e nessuno lo diceva).
 * Ora gli eroi vanno a capo dentro la loro riga e cresce solo l'altezza.
 */
const WIDTH = 1080;
const CARD_SIZE = 80;
const GAP = 6;
const TIER_LABEL_WIDTH = 120;
const ROW_MIN_HEIGHT = 88;
const ROW_GAP = 8;
const CARD_INSET = 8;
const PADDING = 24;
const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 36;

/*
 * Safari su iPhone non crea tele oltre circa 16,7 milioni di pixel (4096 x 4096):
 * oltre, getContext o toBlob restituiscono null. La nitidezza doppia si riduce
 * quanto serve per restare sotto, invece di non dare nessuna immagine.
 */
const MAX_PIXELS = 16_000_000;
const MAX_SIDE = 16_000;

const CARDS_PER_ROW = Math.max(
  1,
  Math.floor((WIDTH - PADDING * 2 - TIER_LABEL_WIDTH - CARD_INSET * 2 + GAP) / (CARD_SIZE + GAP)),
);

/** Il testo accorciato con «…» finche' entra in `maxWidth`, col font gia' impostato. */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  // per punti di codice: tagliare per unita' UTF-16 spezzerebbe le emoji
  const chars = Array.from(text);
  while (chars.length > 0 && ctx.measureText(`${chars.join("")}…`).width > maxWidth) {
    chars.pop();
  }
  return `${chars.join("")}…`;
}

/**
 * Esporta la tier list come immagine PNG tramite HTML5 Canvas.
 *
 * Se l'immagine non si puo' creare (tela troppo grande per il dispositivo,
 * memoria, miniature di un altro dominio) la promessa fallisce: il Maker lo
 * dice a chi l'ha chiesta, invece di non scaricare niente in silenzio.
 */
export async function exportTierListToImage({
  title,
  subtitle,
  tiers,
  heroesMap,
  filename = "tierlist.png",
}: {
  title: string;
  subtitle?: string;
  tiers: readonly TierRow[];
  heroesMap: ReadonlyMap<string, TierHeroItem>;
  filename?: string;
}): Promise<void> {
  const rowHeights = tiers.map((tier) => {
    const lines = Math.ceil(tier.heroIds.length / CARDS_PER_ROW);
    return Math.max(ROW_MIN_HEIGHT, lines * (CARD_SIZE + GAP) + 12);
  });

  const totalHeight =
    PADDING +
    HEADER_HEIGHT +
    rowHeights.reduce((acc, h) => acc + h + ROW_GAP, 0) +
    FOOTER_HEIGHT +
    PADDING;

  // 2x per nitidezza Retina, meno se la tela supererebbe i limiti del dispositivo
  const scale = Math.min(
    2,
    Math.sqrt(MAX_PIXELS / (WIDTH * totalHeight)),
    MAX_SIDE / totalHeight,
  );

  const canvas = document.createElement("canvas");
  canvas.width = Math.floor(WIDTH * scale);
  canvas.height = Math.floor(totalHeight * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Impossibile inizializzare il contesto Canvas 2D");

  ctx.scale(scale, scale);

  // 1. Sfondo generale
  ctx.fillStyle = "#0b0a0a";
  ctx.fillRect(0, 0, WIDTH, totalHeight);

  // 2. Testata: titolo e sottotitolo accorciati se non entrano nella larghezza
  const textWidth = WIDTH - PADDING * 2;
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px system-ui, sans-serif";
  ctx.fillText(fitText(ctx, title, textWidth), PADDING, PADDING + 30);

  if (subtitle) {
    ctx.fillStyle = "#a59e95";
    ctx.font = "14px system-ui, sans-serif";
    ctx.fillText(fitText(ctx, subtitle, textWidth), PADDING, PADDING + 52);
  }

  // Pre-caricamento di tutte le immagini degli eroi usati
  const uniqueHeroIds = Array.from(new Set(tiers.flatMap((t) => t.heroIds)));
  const loadedImages = new Map<string, HTMLImageElement>();

  await Promise.all(
    uniqueHeroIds.map(async (heroId) => {
      const hero = heroesMap.get(heroId);
      if (!hero) return;
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = hero.cardSrc;
        });
        loadedImages.set(heroId, img);
      } catch {
        // Se una miniatura fallisce il caricamento, procediamo senza bloccare
      }
    }),
  );

  // 3. Disegna le righe dei Tier
  let currentY = PADDING + HEADER_HEIGHT;

  for (let tIndex = 0; tIndex < tiers.length; tIndex++) {
    const tier = tiers[tIndex]!;
    const rowHeight = rowHeights[tIndex]!;

    // Etichetta del Tier (rettangolo colorato)
    ctx.fillStyle = tier.color;
    ctx.fillRect(PADDING, currentY, TIER_LABEL_WIDTH, rowHeight);

    // Testo del Tier: si rimpicciolisce fino a 12px per entrare nel riquadro,
    // poi si accorcia
    const labelWidth = TIER_LABEL_WIDTH - 12;
    let fontSize = 22;
    ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
    while (fontSize > 12 && ctx.measureText(tier.label).width > labelWidth) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
    }
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Aggiungi ombra al testo per leggibilità
    ctx.shadowColor = "rgba(0,0,0,0.6)";
    ctx.shadowBlur = 4;
    ctx.fillText(
      fitText(ctx, tier.label, labelWidth),
      PADDING + TIER_LABEL_WIDTH / 2,
      currentY + rowHeight / 2,
    );
    ctx.shadowBlur = 0;

    // Sfondo dell'area carte del Tier
    ctx.fillStyle = "#151313";
    ctx.fillRect(
      PADDING + TIER_LABEL_WIDTH,
      currentY,
      WIDTH - PADDING * 2 - TIER_LABEL_WIDTH,
      rowHeight,
    );

    // Bordo separatore
    ctx.strokeStyle = "#332e2d";
    ctx.lineWidth = 1;
    ctx.strokeRect(PADDING, currentY, WIDTH - PADDING * 2, rowHeight);

    // Disegna le card degli eroi nel tier, a capo dopo CARDS_PER_ROW
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    tier.heroIds.forEach((heroId, index) => {
      const col = index % CARDS_PER_ROW;
      const row = Math.floor(index / CARDS_PER_ROW);

      const cardX = PADDING + TIER_LABEL_WIDTH + CARD_INSET + col * (CARD_SIZE + GAP);
      const cardY = currentY + 6 + row * (CARD_SIZE + GAP);

      const img = loadedImages.get(heroId);
      if (img) {
        ctx.drawImage(img, cardX, cardY, CARD_SIZE, CARD_SIZE);
      } else {
        // Fallback rettangolo con nome
        ctx.fillStyle = "#221f1f";
        ctx.fillRect(cardX, cardY, CARD_SIZE, CARD_SIZE);
        const hero = heroesMap.get(heroId);
        if (hero) {
          ctx.fillStyle = "#ffffff";
          ctx.font = "10px system-ui, sans-serif";
          ctx.fillText(fitText(ctx, hero.name, CARD_SIZE - 8), cardX + 4, cardY + CARD_SIZE / 2);
        }
      }

      // Cornice sottile per ogni card
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.strokeRect(cardX, cardY, CARD_SIZE, CARD_SIZE);
    });

    currentY += rowHeight + ROW_GAP;
  }

  // 4. Footer con la firma del sito
  ctx.fillStyle = "#e61421";
  ctx.font = "bold 14px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(SITE_NAME, WIDTH - PADDING, totalHeight - PADDING);

  // 5. Download dell'immagine. toBlob da' null quando il browser non riesce a
  // codificare la tela (troppo grande, memoria): e' un errore, non un «fatto»
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Il browser non ha potuto creare l'immagine PNG"));
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      resolve();
    }, "image/png");
  });
}
