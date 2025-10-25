import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

const samplePosts = [
  {
    title: 'Getting Started with Next.js and TypeScript',
    content: `# Getting Started with Next.js and TypeScript

Next.js is a powerful React framework that enables features like server-side rendering and static site generation. When combined with TypeScript, it provides an even more robust development experience.

## Why Next.js?

Next.js offers several benefits:

- Server-side rendering
- Static site generation
- Automatic code splitting
- Hot code reloading
- API routes
- Built-in CSS and Sass support

## Setting Up a Project

To create a new Next.js project with TypeScript, run:

\`\`\`bash
npx create-next-app@latest --typescript
\`\`\`

## Project Structure

A typical Next.js project structure looks like this:

\`\`\`
my-app/
  ├── pages/
  ├── public/
  ├── styles/
  ├── components/
  └── package.json
\`\`\`

## Basic Routing

Next.js has a file-system based router. Pages are associated with routes based on their file name:

\`\`\`typescript
// pages/index.tsx - Homepage (/)
export default function Home() {
  return <h1>Welcome!</h1>
}

// pages/about.tsx - About page (/about)
export default function About() {
  return <h1>About Us</h1>
}
\`\`\``,
    categoryIds: [1], // Web Development
    published: true
  },
  {
    title: 'Understanding TypeScript Generics',
    content: `# Understanding TypeScript Generics

Generics are one of TypeScript's most powerful features, allowing you to write flexible, reusable code while maintaining type safety.

## What are Generics?

Generics allow you to write code that can work with multiple types while maintaining type safety. They act as type variables that can be used to create classes, functions, and interfaces that can work with different types.

## Basic Syntax

Here's a simple example of a generic function:

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

// Usage:
let result = identity<string>("Hello");  // type: string
let number = identity(42);               // type: number (type inference)
\`\`\`

## Common Use Cases

### Arrays and Collections

\`\`\`typescript
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Usage:
const numbers = [1, 2, 3];
const first = firstElement(numbers); // type: number

const strings = ["a", "b", "c"];
const firstString = firstElement(strings); // type: string
\`\`\`

### Generic Interfaces

\`\`\`typescript
interface Container<T> {
  value: T;
  getValue(): T;
}

class NumberContainer implements Container<number> {
  constructor(public value: number) {}
  getValue(): number {
    return this.value;
  }
}
\`\`\``,
    categoryIds: [1, 2], // Web Development, Programming
    published: true
  },
  {
    title: 'Building REST APIs with Node.js and Express',
    content: `# Building REST APIs with Node.js and Express

Learn how to create robust and scalable REST APIs using Node.js and Express.

## Setting Up the Project

First, initialize a new Node.js project:

\`\`\`bash
mkdir my-api
cd my-api
npm init -y
npm install express typescript @types/express
\`\`\`

## Basic Express Server

Here's a simple Express server setup:

\`\`\`typescript
import express from 'express';
import { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(\`Server running at http://localhost:\${port}\`);
});
\`\`\`

## RESTful Routes

A typical REST API includes these types of endpoints:

- GET /items - List all items
- GET /items/:id - Get a specific item
- POST /items - Create a new item
- PUT /items/:id - Update an item
- DELETE /items/:id - Delete an item

## Error Handling

Always implement proper error handling:

\`\`\`typescript
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
\`\`\``,
    categoryIds: [1, 2], // Web Development, Programming
    published: true
  }
];

const sampleCategories = [
  {
    id: 1,
    name: 'Web Development',
    description: 'Articles about web development technologies and best practices'
  },
  {
    id: 2,
    name: 'Programming',
    description: 'General programming concepts and tutorials'
  },
  {
    id: 3,
    name: 'DevOps',
    description: 'Topics related to DevOps practices and tools'
  },
  {
    id: 4,
    name: 'JavaScript',
    description: 'Articles and tutorials about JavaScript and the ecosystem'
  },
  {
    id: 5,
    name: 'TypeScript',
    description: 'TypeScript tips, patterns and best practices'
  },
  {
    id: 6,
    name: 'Databases',
    description: 'Database design, queries and optimization'
  },
  {
    id: 7,
    name: 'Tools & DevTools',
    description: 'Build tooling, editors, linters, and CI/CD'
  },
  {
    id: 8,
    name: 'Design',
    description: 'UI/UX and design system related posts'
  }
];

export const seedRouter = router({
  seed: publicProcedure
    .mutation(async ({ ctx }) => {
      // Create categories first
      for (const category of sampleCategories) {
        await ctx.db.insert(ctx.db.categories).values({
          id: category.id,
          name: category.name,
          description: category.description,
        }).onConflictDoNothing();
      }

      // Create posts
      for (const post of samplePosts) {
        const slug = post.title
          .toLowerCase()
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '-');

        // Create post
        const [newPost] = await ctx.db.insert(ctx.db.posts).values({
          title: post.title,
          content: post.content,
          slug,
          published: post.published,
        }).returning();

        // Create post-category relationships
        if (newPost) {
          for (const categoryId of post.categoryIds) {
            await ctx.db.insert(ctx.db.postCategories).values({
              postId: newPost.id,
              categoryId,
            }).onConflictDoNothing();
          }
        }
      }

      return { success: true };
    })
});