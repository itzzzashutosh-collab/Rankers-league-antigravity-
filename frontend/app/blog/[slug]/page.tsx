import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section, Typography, Card, Badge, Breadcrumb } from "@/components/ui";
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Share2, Tag } from "lucide-react";
import { blogContent } from "@/content/footer/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = blogContent.find((a) => a.slug === slug);

  if (!article) return notFound();

  // Recommends 2 other posts in similar category or fallback
  const recommended = blogContent
    .filter((a) => a.slug !== slug)
    .slice(0, 2);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Insights Blog", href: "/blog" },
    { label: article.title },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        <Section className="py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group mb-8"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Insights
            </Link>

            {/* Article Header */}
            <header className="space-y-6 border-b border-border/60 pb-8 mb-10">
              <Badge variant="national" className="uppercase">{article.category}</Badge>
              <Typography variant="h1" className="tracking-tight leading-tight">
                {article.title}
              </Typography>
              <Typography variant="body-large" className="text-muted-foreground italic leading-relaxed">
                {article.description}
              </Typography>
              
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-muted-foreground font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary">
                    {article.author.avatarInitials}
                  </div>
                  <div>
                    <span className="text-foreground block">{article.author.name}</span>
                    <span className="text-[10px] text-muted-foreground/80 block font-normal">{article.author.role}</span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {article.publishDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {article.readingTime}
                  </span>
                </div>
              </div>
            </header>

            {/* Article content */}
            <article className="prose prose-invert prose-xs max-w-none text-muted-foreground leading-relaxed space-y-6 mb-16 text-xs">
              <p className="text-foreground/90 font-medium leading-relaxed mb-6">
                {article.content}
              </p>
              
              <p className="leading-relaxed">
                Platform simulations are designed to measure critical calibration vectors such as cognitive stamina and accuracy index under strict limits. Candidates are advised to simulate full desktop environments to bypass proctor alerts and verify their score ranks before sitting for official entrances.
              </p>
              
              <div className="flex flex-wrap gap-2 pt-6">
                {article.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-bold">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </article>

            {/* Recommendations Section */}
            <div className="border-t border-border/40 pt-12 mt-16 space-y-6">
              <Typography variant="h2" className="tracking-tight">Recommended Reading</Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {recommended.map((post) => (
                  <Card key={post.id} className="p-6 rounded-2xl border border-border bg-card/10 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold text-primary tracking-wider uppercase">{post.category}</span>
                      <Typography variant="h4" className="text-xs font-bold leading-snug line-clamp-2">
                        {post.title}
                      </Typography>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors group/link mt-2"
                    >
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return blogContent.map((a) => ({
    slug: a.slug,
  }));
}

export const dynamic = "force-static";
