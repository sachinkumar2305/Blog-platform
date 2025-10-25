import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-foreground">
              BlogPlatform
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/posts" className="text-muted-foreground hover:text-foreground">
                Blog
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </header>

      <Head>
        <title>BlogPlatform — Write, Publish, Grow</title>
        <meta name="description" content="Create, publish, and grow your blog with our modern platform. Built with a markdown editor, categories, and an analytics dashboard." />
        <meta property="og:title" content="BlogPlatform — Write, Publish, Grow" />
      </Head>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Your Ideas Deserve a
              <span className="text-blue-600"> Beautiful Home</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create, publish, and grow your blog with our modern platform.
              Built with the latest tech for the best writing experience.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard/posts/new">Start Writing</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/posts">Read Posts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

  {/* Features Section */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-foreground">
            Everything you need to create amazing content
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Rich Markdown Editor</h3>
              <p className="text-muted-foreground">
                Write beautifully formatted content with our intuitive Markdown editor.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Organize with Categories</h3>
              <p className="text-muted-foreground">
                Keep your content organized with custom categories and tags.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Analytics Dashboard</h3>
              <p className="text-muted-foreground">
                Track your blog's performance with detailed analytics and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (Call to Action) - added to make a full 5-section landing) */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold">Ready to get started?</h3>
              <p className="mt-2 text-blue-100">Start writing and publishing your first post in minutes. Collaborate, organize, and grow your audience.</p>
            </div>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/dashboard/posts/new">Start Writing</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/posts">Explore Posts</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <Link href="/" className="text-xl font-bold text-foreground">
                BlogPlatform
              </Link>
              <p className="text-muted-foreground mt-2">
                © {new Date().getFullYear()} BlogPlatform. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/posts" className="text-muted-foreground hover:text-foreground">
                Blog
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}