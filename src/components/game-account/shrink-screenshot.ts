/**
 * La schermata, ridisegnata nel browser prima di partire: WebP, lato lungo al
 * massimo 2560 px. Un PNG del telefono pesa 3-8 MB e il server ne accetta 3; a
 * 2560 px il numero della classe si legge ancora bene. Ridisegnarla toglie anche i
 * dati che il file si porta dietro (dispositivo, a volte la posizione), che al
 * moderatore non servono.
 */

const MAX_SIDE = 2560;
const QUALITY = 0.92;

export async function shrinkScreenshot(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("canvas");
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
    // un browser senza WebP restituisce un PNG: va bene lo stesso, se non e' troppo grande
    if (!blob) throw new Error("toBlob");
    return blob;
  } finally {
    bitmap.close();
  }
}
