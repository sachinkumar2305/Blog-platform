import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  published: boolean('published').notNull().default(false),
  views: integer('views').notNull().default(0),
  imageUrl: varchar('image_url', { length: 1024 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
});

export const postCategories = pgTable('post_categories', {
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: primaryKey(t.postId, t.categoryId),
}));

// Relations
export const postsRelations = relations(posts, ({ many }) => ({
  categories: many(postCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(postCategories),
}));

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
}));

// Zod Schemas for validation
// Basic Zod schemas for runtime validation (keeps things simple and avoids
// tight coupling to an exact drizzle-zod version which caused import/export
// issues in some environments).
export const insertPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  slug: z.string().optional(),
  published: z.boolean().optional(),
  imageUrl: z.string().url().optional(),
});

export const selectPostSchema = z.any();

export const insertCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  slug: z.string().optional(),
});

export const selectCategorySchema = z.any();

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;