import Link from "next/link";
import type { ReactNode } from "react";
import {
  parseMarkdown,
  plainText,
  slugify,
  tableOfContents,
  type Block,
  type Heading,
  type Inline,
} from "@/lib/markdown";
import { cx, display } from "./ui";

/**
 * Resa del markdown.
 *
 * Nessun dangerouslySetInnerHTML: gli elementi arrivano da questo file e da
 * nessun altro posto, quindi non esiste testo dell'autore che possa diventare
 * markup. Vedi src/lib/markdown.ts per il perche' della scelta.
 *
 * I titoli portano l'ancora calcolata dal testo, cosi' l'indice a lato e il
 * collegamento condiviso puntano allo stesso posto.
 */
export function Markdown({ source, className }: { source: string; className?: string }) {
  const blocks = parseMarkdown(source);
  const anchors = new Map<number, string>();

  const toc = tableOfContents(blocks);
  let headingIndex = 0;
  blocks.forEach((block, index) => {
    if (block.kind === "heading") {
      const entry = toc[headingIndex++];
      if (entry) anchors.set(index, entry.id);
    }
  });

  return (
    <div className={cx("text-[15px] leading-[1.7] text-ink", className)}>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} anchor={anchors.get(index)} />
      ))}
    </div>
  );
}

function BlockView({ block, anchor }: { block: Block; anchor?: string }) {
  switch (block.kind) {
    case "heading":
      return block.level === 2 ? (
        <h2
          id={anchor}
          className={cx(display, "mt-9 mb-3 scroll-mt-24 text-[22px] first:mt-0")}
        >
          <InlineView parts={block.text} />
        </h2>
      ) : (
        <h3
          id={anchor}
          className="mt-6 mb-2 scroll-mt-24 font-display text-[17px] font-semibold first:mt-0"
        >
          <InlineView parts={block.text} />
        </h3>
      );

    case "paragraph":
      return (
        <p className="m-0 mb-3.5">
          <InlineView parts={block.text} />
        </p>
      );

    case "list":
      return block.ordered ? (
        <ol className="m-0 mb-4 grid list-decimal gap-1.5 pl-5">
          {block.items.map((item, index) => (
            <li key={index}>
              <InlineView parts={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="m-0 mb-4 grid list-disc gap-1.5 pl-5 marker:text-brand">
          {block.items.map((item, index) => (
            <li key={index}>
              <InlineView parts={item} />
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className="m-0 mb-4 border-l-[3px] border-brand bg-brand-soft px-4 py-3 text-sm text-ink-2">
          <InlineView parts={block.text} />
        </blockquote>
      );

    case "code":
      return (
        <pre className="m-0 mb-4 overflow-x-auto rounded-card border border-rule bg-paper-2 p-3.5 font-mono text-xs leading-relaxed">
          <code>{block.value}</code>
        </pre>
      );

    case "rule":
      return <hr className="my-7 border-0 border-t border-rule" />;
  }
}

function InlineView({ parts }: { parts: readonly Inline[] }): ReactNode {
  return parts.map((part, index) => {
    switch (part.kind) {
      case "strong":
        return (
          <strong key={index} className="font-semibold">
            {part.value}
          </strong>
        );
      case "em":
        return <em key={index}>{part.value}</em>;
      case "code":
        return (
          <code
            key={index}
            className="rounded-[2px] bg-paper-2 px-1.5 py-px font-mono text-[13px] text-brand-deep"
          >
            {part.value}
          </code>
        );
      case "link":
        // I collegamenti interni passano da Link, gli esterni no: su un
        // indirizzo esterno la navigazione lato client non serve, e rel
        // impedisce alla pagina di destinazione di manipolare questa.
        return part.href.startsWith("/") ? (
          <Link key={index} href={part.href} className="text-brand hover:underline">
            {part.value}
          </Link>
        ) : (
          <a
            key={index}
            href={part.href}
            rel="nofollow noopener noreferrer"
            target="_blank"
            className="text-brand hover:underline"
          >
            {part.value}
          </a>
        );
      case "text":
        return part.value;
    }
  });
}

/**
 * Indice laterale.
 *
 * Su una guida lunga e' l'unico modo per capire cosa c'e' dentro senza
 * scorrerla tutta. I titoli di terzo livello rientrano, cosi' la gerarchia si
 * legge anche senza numerazione.
 */
export function TableOfContents({
  headings,
  className,
}: {
  headings: readonly Heading[];
  className?: string;
}) {
  if (headings.length < 2) return null;

  return (
    <nav aria-label="Indice della guida" className={cx("text-sm", className)}>
      <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
        In questa guida
      </p>
      <ol className="m-0 grid list-none gap-1.5 p-0">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? "pl-3.5" : undefined}>
            <a href={`#${heading.id}`} className="text-ink-2 hover:text-brand">
              {heading.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Riesporta per le pagine, che non devono conoscere il parser. */
export function headingsOf(source: string): Heading[] {
  return tableOfContents(parseMarkdown(source));
}

export { plainText, slugify };
