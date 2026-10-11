import type { DefaultSession } from "next-auth";
import type { Role } from "@/lib/auth/permissions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: Role;
    } & DefaultSession["user"];
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
  }
}

export {};
