"use client";

/**
 * Pulsante segui.
 *
 * Lo stato cambia subito e la richiesta parte dopo: seguire qualcuno e' un
 * gesto piccolo e aspettare il server lo fa sembrare guasto. Se la richiesta
 * fallisce si torna indietro e si dice perche'.
 */

import { useState, useTransition } from "react";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";
import { toggleFollowAction } from "@/lib/social/actions";
import { Button } from "../ui";

const TESTI = testi({
  it: {
    nonRiuscito: "Non è stato possibile completare l'operazione.",
    seguiGia: "Segui già",
    segui: "Segui",
  },
  en: {
    nonRiuscito: "The operation couldn't be completed.",
    seguiGia: "Following",
    segui: "Follow",
  },
});

export function FollowButton({
  username,
  initialFollowing,
  initialFollowers,
}: {
  username: string;
  initialFollowing: boolean;
  initialFollowers: number;
}) {
  const t = TESTI[useLocale()];
  const [following, setFollowing] = useState(initialFollowing);
  const [followers, setFollowers] = useState(initialFollowers);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const previous = following;
    const previousCount = followers;

    setError(null);
    setFollowing(!previous);
    setFollowers(previousCount + (previous ? -1 : 1));

    startTransition(async () => {
      const result = await toggleFollowAction(username);
      if (!result.ok) {
        setFollowing(previous);
        setFollowers(previousCount);
        setError(result.error ?? t.nonRiuscito);
      }
    });
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button variant={following ? "outline" : "primary"} onClick={toggle} disabled={pending}>
        {following ? t.seguiGia : t.segui}
        <span className="font-mono text-[11px] opacity-70">{followers}</span>
      </Button>
      {error ? <span className="text-[11px] text-hot">{error}</span> : null}
    </span>
  );
}
