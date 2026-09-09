"use client";

import { useActionState } from "react";
import { registerAction, type FormState } from "@/lib/auth/actions";

const INITIAL: FormState = {};

export function RegisterForm({ demoMode = false }: { demoMode?: boolean }) {
  const [state, action, pending] = useActionState(registerAction, INITIAL);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} noValidate>
      {state.error ? (
        <p className="notice notice--error" role="alert" style={{ marginBottom: 18 }}>
          {state.error}
        </p>
      ) : null}

      <label className="field">
        <span className="field__label">
          Handle
          <span className="field__hint">gachazone.it/u/…</span>
        </span>
        <input
          className="input input--mono"
          type="text"
          name="username"
          autoComplete="username"
          required
          minLength={3}
          maxLength={20}
          placeholder="ilmionome"
          aria-invalid={errors.username ? true : undefined}
        />
        {errors.username ? <span className="field__error">{errors.username}</span> : null}
      </label>

      <label className="field">
        <span className="field__label">Nome visualizzato</span>
        <input
          className="input"
          type="text"
          name="displayName"
          autoComplete="nickname"
          required
          maxLength={40}
          aria-invalid={errors.displayName ? true : undefined}
        />
        {errors.displayName ? <span className="field__error">{errors.displayName}</span> : null}
      </label>

      <label className="field">
        <span className="field__label">Email</span>
        <input
          className="input"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="tu@esempio.it"
          aria-invalid={errors.email ? true : undefined}
        />
        {errors.email ? <span className="field__error">{errors.email}</span> : null}
      </label>

      <label className="field">
        <span className="field__label">
          Password
          <span className="field__hint">almeno 10 caratteri</span>
        </span>
        <input
          className="input"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={10}
          aria-invalid={errors.password ? true : undefined}
        />
        {errors.password ? <span className="field__error">{errors.password}</span> : null}
      </label>

      <button
        type="submit"
        className={demoMode ? "btn btn--block" : "btn btn--primary btn--block"}
        disabled={pending}
      >
        {pending ? "Creazione in corso…" : "Crea il profilo"}
      </button>

      {demoMode ? (
        <p className="field__hint" style={{ marginTop: 10, color: "var(--faint)" }}>
          Senza database questo modulo porta anch&apos;esso al profilo di esempio.
        </p>
      ) : null}
    </form>
  );
}
