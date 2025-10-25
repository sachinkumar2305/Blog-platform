import { db } from './index';
import { categories, posts, postCategories } from './schema';
import { slugify } from '../utils/slug';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create categories
  const [programming, webdev] = await Promise.all([
    db.insert(categories).values({
      name: 'Programming',
      description: 'Articles about programming and software development',
      slug: slugify('Programming'),
    }).returning(),
    db.insert(categories).values({
      name: 'Web Development',
      description: 'Articles about web development and modern frameworks',
      slug: slugify('Web Development'),
    }).returning(),
  ]);

  // Create posts
  const post1 = await db.insert(posts).values({
    title: 'Getting Started with Next.js',
    content: '# Getting Started with Next.js\n\nNext.js is a powerful React framework...',
    slug: slugify('Getting Started with Next.js'),
    published: true,
  }).returning();

  const post2 = await db.insert(posts).values({
    title: 'Understanding TypeScript',
    content: '# Understanding TypeScript\n\nTypeScript adds static typing to JavaScript...',
    slug: slugify('Understanding TypeScript'),
    published: true,
  }).returning();

  // Associate posts with categories
  await Promise.all([
    db.insert(postCategories).values({
      postId: post1[0].id,
      categoryId: webdev[0].id,
    }),
    db.insert(postCategories).values({
      postId: post2[0].id,
      categoryId: programming[0].id,
    }),
    db.insert(postCategories).values({
      postId: post2[0].id,
      categoryId: webdev[0].id,
    }),
  ]);

  console.log('✅ Seeding completed!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});