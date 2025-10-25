import { router } from './trpc';
import { postsRouter } from './routers/posts';
import { categoriesRouter } from './routers/categories';
import { seedRouter } from './routers/seed';

export const appRouter = router({
  posts: postsRouter,
  categories: categoriesRouter,
  seed: seedRouter,
});

export type AppRouter = typeof appRouter;