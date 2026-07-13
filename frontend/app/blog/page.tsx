"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Section,
  Typography,
  Grid,
  Card,
  Badge,
  InputField,
} from "@/components/ui";
import { ArrowRight, BookOpen, Clock, Calendar } from "lucide-react";
import { blogContent } from "@/content/footer/blog";
import Link from "next/link";

const categories = ["All", "Engineering", "Medical", "Civil Services", "Competition Strategy", "Announcements", "Platform Updates", "Success Stories"];


export default function BlogListingPage() {
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [searchTerm, setSearchTerm] = React.useState("");

  const filtered = React.useMemo(() => {
    return blogContent.filter((article) => {
      const matchesCategory =
        activeCategory === "All" || article.category === activeCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        <Section radialGlow className="pt-16 pb-20">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-4 mb-12">
            <Badge variant="featured" className="self-center">
              Prestige Journal
            </Badge>
            <Typography variant="display-l">Insights & Strategy</Typography>
            <Typography variant="subtitle">
              Expert articles, data-driven analysis, and strategy guidelines written by elite educators and toppers.
            </Typography>
          </div>

          {/* Filters Bar */}
          <div className="max-w-5xl mx-auto bg-card border border-border/60 p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xl mb-12">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <InputField
                type="search"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="max-w-5xl mx-auto">
            {filtered.length > 0 ? (
              <Grid cols={3} gap={6}>
                {filtered.map((article) => (
                  <Card
                    key={article.id}
                    variant="solid"
                    hoverEffect="lift-glow"
                    padding="none"
                    className="flex flex-col h-full text-left"
                  >
                    <div className={`h-32 bg-gradient-to-br ${article.imageGradient} border-b border-border/40 p-5 flex items-end relative overflow-hidden`}>
                      <BookOpen className="absolute right-4 top-4 w-12 h-12 text-primary/10" />
                      <span className="text-[9px] font-bold text-primary tracking-widest uppercase bg-card/90 px-2 py-0.5 rounded border border-border">
                        {article.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {article.publishDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readingTime}
                        </span>
                      </div>

                      <Typography variant="h4" className="mb-2 line-clamp-2">
                        {article.title}
                      </Typography>
                      <Typography variant="body-small" className="text-muted-foreground line-clamp-3 mb-6">
                        {article.description}
                      </Typography>

                      <div className="flex items-center justify-between pt-4 border-t border-border/60 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[9px]">
                            {article.author.avatarInitials}
                          </div>
                          <span className="text-[10px] font-semibold text-foreground truncate max-w-[100px]">
                            {article.author.name}
                          </span>
                        </div>
                        <Link href={`/blog/${article.slug}`}>
                          <button className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors cursor-pointer">
                            Read More
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </Grid>
            ) : (
              <div className="text-center py-16">
                <Typography variant="body-large" className="text-muted-foreground">
                  No articles found matching your filters.
                </Typography>
              </div>
            )}
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
