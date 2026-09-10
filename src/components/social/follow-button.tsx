"use client";

/**
 * Pulsante segui.
 *
 * Lo stato cambia subito e la richiesta parte dopo: seguire qualcuno e' un
 * gesto piccolo e aspettare il server lo fa sembrare guasto. Se la richiesta
 * fallisce si torna indietro e si dice perche'.
 */

import { useState, useTransition } from "react";
import { toggleFollowAction } from "@/lib/social/actions";
import { Button } from "../ui";

export function FollowButton({
  username,
  initialFollowing,
  initialFollowers,
}: {
  username: string;
  initialFollowing: boolean;
  initialFollowers: number;
}) {
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
        setError(result.error ?? "Non è stato possibile completare l'operazione.");
      }
    });
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button variant={following ? "outline" : "primary"} onClick={toggle} disabled={pending}>
        {following ? "Segui già" : "Segui"}
        <span className="font-mono text-[11px] opacity-70">{followers}</span>
      </Button>
      {error ? <span className="text-[11px] text-hot">{error}</span> : null}
    </span>
  );
}
