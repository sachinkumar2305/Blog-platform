'use client';

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/trpc/router';

export const trpc = createTRPCReact<AppRouter>({
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});