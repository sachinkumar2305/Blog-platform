import { z } from 'zod'
import { initTRPC } from '@trpc/server'
import { Context } from '../context'
import { slugify } from '../../utils/slug'

const t = initTRPC.context<Context>().create()

export const categoriesRouter = t.router({
  list: t.procedure.query(async () => []),
  create: t.procedure.input(z.object({ name: z.string().min(1), description: z.string().optional() })).mutation(async ({ input }) => {
    const slug = slugify(input.name)
    return { id: 1, ...input, slug }
  }),
  update: t.procedure.input(z.object({ id: z.number(), name: z.string().optional(), description: z.string().optional() })).mutation(async ({ input }) => {
    return { ...input }
  }),
  delete: t.procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return { success: true }
  })
})
