import { z } from 'zod'
import { initTRPC } from '@trpc/server'
import { Context } from '../context'
import { slugify } from '../../utils/slug'

const t = initTRPC.context<Context>().create()

export const postsRouter = t.router({
  list: t.procedure.query(async () => {
    // placeholder: return empty list
    return []
  }),
  create: t.procedure.input(z.object({ title: z.string().min(1), content: z.string(), published: z.boolean().optional() })).mutation(async ({ input }) => {
    const slug = slugify(input.title)
    // placeholder: return created object
    return { id: 1, ...input, slug }
  }),
  get: t.procedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    return null
  }),
  update: t.procedure.input(z.object({ id: z.number(), title: z.string().optional(), content: z.string().optional(), published: z.boolean().optional() })).mutation(async ({ input }) => {
    return { ...input }
  }),
  delete: t.procedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return { success: true }
  }),
})
