

# 📝 Full-Stack Blogging Platform

A modern blogging platform built with Next.js, tRPC, and PostgreSQL, featuring a clean UI and robust content management system.

## 💻 Tech Stack

* **Frontend:**
  * Next.js 14 (App Router)
  * React
  * Tailwind CSS
  * shadcn/ui components
* **Backend:**
  * tRPC (end-to-end typesafe API)
  * Zod (validation)
  * Node.js
* **Database:**
  * PostgreSQL
  * Drizzle ORM
* **Editor:**
  * Markdown editor with live preview
* **Deployment:**
  * Vercel (hosting)
  * Neon (PostgreSQL)

## 🚀 Features

### Core Features
* ✅ Blog post management (create, read, update, delete)
* ✅ Category management
* ✅ Multi-category post assignments
* ✅ Responsive blog listing page with filters
* ✅ Individual post pages with Markdown rendering
* ✅ Admin dashboard for content management
* ✅ Draft/Published post status
* ✅ Search functionality
* ✅ Mobile-responsive design

### Additional Features
* ✅ Fast, SEO-friendly static pages
* ✅ Auto-generated post slugs
* ✅ Category-based post filtering
* ✅ Loading states & error handling
* ✅ Database seeding for sample content

---

## 🛠 Setup Instructions

1. **Clone and Install:**
```bash
git clone https://github.com/sachinkumar2305/blogging-platform.git
cd blogging-platform
npm install
```

2. **Configure Environment:**
Create `.env.local` with:
```env
# Required: PostgreSQL connection string (Neon.tech recommended)
DATABASE_URL='postgresql://neondb_owner:npg_udsVE7mc4RPJ@ep-wandering-tooth-ahtqagcf-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

# Required: URL where your app is running (local or production)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Enable debug logging for tRPC
# DEBUG_TRPC="true"
```

3. **Setup Database:**
```bash
# Push schema to database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

4. **Development:**
```bash
npm run dev
```
Visit `http://localhost:3000`

5. **Build & Production:**
```bash
npm run build
npm start
```

---

## 📐 Project Structure & API Design

```
├── src/
│   ├── app/             # Next.js pages & API routes
│   ├── components/      # React components
│   ├── server/
│   │   ├── db/         # Database config & schema
│   │   └── trpc/       # tRPC routers & procedures
│   └── utils/          # Shared utilities
├── drizzle/            # DB migrations
└── public/             # Static assets
```

### 🔌 tRPC Router Structure

The API is built with tRPC for end-to-end type safety:

```typescript
// src/server/trpc/router.ts
export const appRouter = router({
  posts: postsRouter,      // Blog post CRUD operations
  categories: categoryRouter, // Category management
  seed: seedRouter.seed    // Database seeding utility
});
```

Key Routes:
- `/api/trpc/posts.list` - Get paginated posts with category filters
- `/api/trpc/posts.bySlug` - Get single post by slug
- `/api/trpc/categories.list` - Get all categories
- `/api/trpc/seed` - Populate database with sample content

## 🌐 Live Deployment

The app is deployed on Vercel:
[https://blogging-platform-sachinkumar2305-sachinkumar2305s-projects.vercel.app/](https://blogging-platform-sachinkumar2305-sachinkumar2305s-projects.vercel.app/)
## 🗃 Database Seeding

The app includes a seeding system to populate the database with sample blog posts and categories:

1. **Via UI:** Click "Add sample data" on an empty dashboard
2. **Via CLI:** Run the seed script:
```bash
npm run db:seed
```

Sample data includes:
- Programming-related blog posts
- Common blog categories
- Proper category-post relationships

---

## 📌 Trade-offs / Decisions

* Chose **Markdown editor** over rich text editor to save development time.
* Limited landing page to **3 sections** to focus on polished core features.
* **Authentication** not implemented (per requirements).
* No image uploads (can be added as a bonus).

---

## ⏱ Time Spent

* **Approx. 12–16 hours** over 7 days

---

## ✅ Notes

* Focused on **clean, type-safe code** with tRPC + TypeScript.
* Fully functional CRUD operations, responsive UI, and category management are implemented.
* Deployment is live on Vercel and connects to Neon DB.

