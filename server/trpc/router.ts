import { initTRPC } from '@trpc/server'
import { postsRouter } from './routers/posts'
import { categoriesRouter } from './routers/categories'
import { Context } from './context'

const t = initTRPC.context<Context>().create()

export const appRouter = t.router({
  posts: postsRouter,
  categories: categoriesRouter,
})

export type AppRouter = typeof appRouter
