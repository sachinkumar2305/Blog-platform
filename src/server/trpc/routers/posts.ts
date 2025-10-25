import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { desc, eq, sql } from 'drizzle-orm';
import { router, procedure } from '../trpc';
import { insertPostSchema, posts, postCategories, categories } from '../../../db/schema';
import { slugify } from '../../../utils/slug';
import fs from 'fs';
import path from 'path';

export const postsRouter = router({
  list: procedure
    .input(
      z.object({
        categoryId: z.number().optional(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { categoryId, limit, cursor } = input;
      
      let query = ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          published: posts.published,
          createdAt: posts.createdAt,
          categories: sql<string>`json_agg(json_build_object('id', ${categories.id}, 'name', ${categories.name}, 'slug', ${categories.slug}))`,
        })
        .from(posts)
        .leftJoin(postCategories, eq(posts.id, postCategories.postId))
        .leftJoin(categories, eq(postCategories.categoryId, categories.id))
        .groupBy(posts.id)
        .orderBy(desc(posts.createdAt))
        .limit(limit + 1);

      if (cursor) {
        query = query.where(sql`${posts.id} < ${cursor}`);
      }

      if (categoryId) {
        query = query.where(eq(postCategories.categoryId, categoryId));
      }

      const items = await query;
      let nextCursor: typeof cursor | undefined = undefined;
      
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  bySlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // Increment views atomically
      await ctx.db
        .update(posts)
        .set({ views: sql`${posts.views} + 1` })
        .where(eq(posts.slug, input.slug));

      const post = await ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          content: posts.content,
          slug: posts.slug,
          published: posts.published,
          views: posts.views,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          categories: sql<string>`json_agg(json_build_object('id', ${categories.id}, 'name', ${categories.name}, 'slug', ${categories.slug}))`,
        })
        .from(posts)
        .leftJoin(postCategories, eq(posts.id, postCategories.postId))
        .leftJoin(categories, eq(postCategories.categoryId, categories.id))
        .where(eq(posts.slug, input.slug))
        .groupBy(posts.id)
        .limit(1);

      if (!post[0]) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      return post[0];
    }),

  create: procedure
    .input(
      insertPostSchema.extend({
        categoryIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input: rawInput }) => {
      const input = rawInput as { title: string; content: string; published?: boolean; categoryIds?: number[]; imageUrl?: string };
      const { categoryIds, ...postData } = input;
      const slug = slugify(postData.title);

      const [post] = await ctx.db.insert(posts)
        .values({ ...postData, slug })
        .returning();

      if (categoryIds?.length) {
        await ctx.db.insert(postCategories)
          .values(
            categoryIds.map((categoryId: number) => ({
                  postId: post.id,
                  categoryId,
                }))
          );
      }

      return post;
    }),

  update: procedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        published: z.boolean().optional(),
        categoryIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input: rawInput }) => {
      const input = rawInput as { id: number; title?: string; content?: string; published?: boolean; categoryIds?: number[]; imageUrl?: string };
      const { id, categoryIds, ...updateData } = input;
      
      const updates: any = { ...updateData };
      if (input.title) {
        updates.slug = slugify(input.title);
      }

      const [post] = await ctx.db
        .update(posts)
        .set(updates)
        .where(eq(posts.id, id))
        .returning();

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      if (categoryIds !== undefined) {
        // Remove existing categories
        await ctx.db
          .delete(postCategories)
          .where(eq(postCategories.postId, id));

        // Add new categories
        if (categoryIds.length > 0) {
          await ctx.db.insert(postCategories)
            .values(
              categoryIds.map(categoryId => ({
                postId: id,
                categoryId,
              }))
            );
        }
      }

      return post;
    }),

  delete: procedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .delete(posts)
        .where(eq(posts.id, input.id))
        .returning();

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      return post;
    }),

  uploadImage: procedure
    .input(z.object({ filename: z.string(), data: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // input.data is expected to be a base64 data URL or raw base64
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      let base64 = input.data;
      // strip data URL prefix if present
      const matches = base64.match(/^data:(.+);base64,(.*)$/);
      if (matches) {
        base64 = matches[2];
      }

      const buffer = Buffer.from(base64, 'base64');
      const safeName = `${Date.now()}-${input.filename.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      const filePath = path.join(uploadsDir, safeName);
      fs.writeFileSync(filePath, buffer);

      const publicPath = `/uploads/${safeName}`;
      return { url: publicPath };
    }),

  search: procedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, limit } = input;

      // Use ILIKE for case-insensitive match and return an excerpt
      const rows = await ctx.db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: sql<string>`substring(${posts.content} from 1 for 200)`,
        })
        .from(posts)
        .where(sql`${posts.title} ILIKE ${sql`%${query}%`} OR ${posts.content} ILIKE ${sql`%${query}%`}`)
        .limit(limit);

      return { items: rows };
    }),
});