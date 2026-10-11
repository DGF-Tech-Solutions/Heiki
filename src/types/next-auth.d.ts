import type { DefaultSession } from "next-auth";
import type { Role } from "@/lib/auth/permissions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: Role;
    } & DefaultSession["user"];
    /** quando si e' entrati davvero l'ultima volta (secondi), per le azioni che chiedono un accesso recente */
    authAt?: number;
  }

  interface User {
    username?: string;
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    role?: Role;
    /** l'impronta della password con cui si e' entrati (passwordStamp) */
    pwd?: string;
    /** quando ruolo, handle e password sono stati riletti dal database, in secondi */
    checkedAt?: number;
    /** quando si e' entrati davvero (password o OAuth), in secondi */
    authAt?: number;
  }
}

export {};
