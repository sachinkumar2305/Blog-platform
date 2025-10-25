import { createNextApiHandler } from '@trpc/server/adapters/next'
import { appRouter } from '../../../server/trpc/router'
import { createContext } from '../../../server/trpc/context'

export default createNextApiHandler({
  router: appRouter,
  createContext,
})
