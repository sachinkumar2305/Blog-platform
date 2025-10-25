import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { db } from '../db';

export async function createContext(_opts: CreateNextContextOptions) {
  return {
    db,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;