import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { db } from "../db";

export async function createContext(_opts: FetchCreateContextFnOptions) {
  return { db };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
