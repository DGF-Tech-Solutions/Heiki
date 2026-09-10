import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

/**
 * Configurazione del linter.
 *
 * Si parte dalle regole di Next, che coprono le trappole del framework
 * (immagini, link, hook, direttive client/server), piu' quelle di TypeScript.
 * Le aggiunte sotto sono le poche cose che in questo progetto contano davvero.
 */
export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      ".next/**",
      ".next-check/**",
      "node_modules/**",
      "drizzle/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Una variabile inutilizzata e' spesso il residuo di un refactoring
      // incompleto: va vista, non tollerata. Il prefisso _ resta la via di
      // fuga per gli argomenti che la firma impone.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
      // `any` disattiva i controlli proprio dove servono. Se serve davvero,
      // va motivato con un commento e una disattivazione puntuale.
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];
