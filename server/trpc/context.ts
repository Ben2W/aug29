import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { auth } from "@clerk/nextjs/server";
import { db } from "../db";
import type { DB } from "../db";

export type BaseContext = { db: DB; userId: string | null };

export function buildContext(params: Partial<BaseContext> = {}): BaseContext {
  return {
    db: params.db ?? db,
    userId: params.userId ?? null,
  };
}

export async function createContext(_opts: FetchCreateContextFnOptions) {
  const { userId } = await auth();
  return buildContext({ userId });
}

export type Context = Awaited<ReturnType<typeof createContext>>;
