"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/lib/auth/actions";

const INITIAL: FormState = {};

export function LoginForm({ demoMode = false }: { demoMode?: boolean }) {
  const [state, action, pending] = useActionState(loginAction, INITIAL);

  return (
    <form action={action} noValidate>
      {state.error ? (
        <p className="notice notice--error" role="alert" style={{ marginBottom: 18 }}>
          {state.error}
        </p>
      ) : null}

      <label className="field">
        <span className="field__label">Email</span>
        <input
          className="input"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="tu@esempio.it"
        />
      </label>

      <label className="field">
        <span className="field__label">Password</span>
        <input
          className="input"
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </label>

      {/* In modalita' dimostrativa l'azione primaria e' il pannello sopra: questo
          bottone si smorza, perche' due bottoni oro nello stesso riquadro non
          direbbero all'utente dove guardare. */}
      <button
        type="submit"
        className={demoMode ? "btn btn--block" : "btn btn--primary btn--block"}
        disabled={pending}
      >
        {pending ? "Verifica in corso…" : "Entra"}
      </button>

      {demoMode ? (
        <p className="field__hint" style={{ marginTop: 10, color: "var(--faint)" }}>
          Senza database questo modulo porta anch&apos;esso al profilo di esempio.
        </p>
      ) : null}
    </form>
  );
}
