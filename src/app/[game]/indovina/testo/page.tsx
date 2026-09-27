import type { Metadata } from "next";
import { PuzzlePage, puzzleMetadata } from "@/components/hero-guess/puzzle-page";

/** «Indovina l'eroe», modalita' Testo: la pagina e' comune alle modalita' senza caselle (puzzle-page.tsx). */

interface Props {
  params: Promise<{ game: string }>;
}

export function generateMetadata(props: Props): Promise<Metadata> {
  return puzzleMetadata(props, "testo");
}

export default function GuessPageTesto(props: Props) {
  return <PuzzlePage {...props} kind="testo" />;
}
