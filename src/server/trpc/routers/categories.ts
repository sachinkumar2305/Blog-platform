import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { eq, sql } from 'drizzle-orm';
import { router, procedure } from '../trpc';
import { insertCategorySchema, categories, postCategories } from '../../../db/schema';
import { slugify } from '../../../utils/slug';

export const categoriesRouter = router({
  list: procedure
    .query(async ({ ctx }) => {
      return ctx.db
        .select({
          id: categories.id,
          name: categories.name,
          description: categories.description,
          slug: categories.slug,
          postCount: sql<number>`count(${postCategories.postId})`,
        })
        .from(categories)
        .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
        .groupBy(categories.id)
        .orderBy(categories.name);
    }),

  bySlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db
        .select()
        .from(categories)
        .where(eq(categories.slug, input.slug))
        .limit(1);

      if (!category[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return category[0];
    }),

  create: procedure
    .input(insertCategorySchema)
    .mutation(async ({ ctx, input: rawInput }) => {
      const input = rawInput as { name: string; description?: string };
      const slug = slugify(input.name);
      
      const [category] = await ctx.db
        .insert(categories)
        .values({ ...input, slug })
        .returning();

      return category;
    }),

  update: procedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input: rawInput }) => {
      const input = rawInput as { id: number; name?: string; description?: string };
      const { id, ...updateData } = input;
      
      const updates: any = { ...updateData };
      if (input.name) {
        updates.slug = slugify(input.name);
      }

      const [category] = await ctx.db
        .update(categories)
        .set(updates)
        .where(eq(categories.id, id))
        .returning();

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return category;
    }),

  delete: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .delete(categories)
        .where(eq(categories.id, input.id))
        .returning();

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return category;
    }),
});