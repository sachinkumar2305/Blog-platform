import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server/trpc/router';
import { createContext } from '../../../server/trpc/context';

export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error, type, path, input, ctx, req }: { 
    error: Error; 
    type: 'query' | 'mutation' | 'subscription' | 'unknown'; 
    path: string | undefined; 
    input: unknown; 
    ctx: unknown; 
    req: unknown; 
  }) {
    if ((error as any).code === 'INTERNAL_SERVER_ERROR') {
      console.error('Something went wrong', error);
    }
  },
});