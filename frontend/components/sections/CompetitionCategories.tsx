"use client";

import { motion } from "framer-motion";
import {
  Atom,
  Zap,
  Heart,
  Binary,
  GraduationCap,
  Cog,
  TrendingUp,
  Shield,
  FileText,
  Landmark,
  Train,
  MapPin,
  Sparkles,
} from "lucide-react";
import { categoriesContent } from "@/content/categories";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Atom,
  Zap,
  Heart,
  Binary,
  GraduationCap,
  Cog,
  TrendingUp,
  Shield,
  FileText,
  Landmark,
  Train,
  MapPin,
  Sparkles,
};

export function CompetitionCategories() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Examination Arenas
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Competition Categories
          </h2>
          <p className="text-sm text-muted-foreground mt-4">
            Choose your arena. From engineering and medical to civil services and management — every major
            competitive examination is represented with dedicated championship tracks.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categoriesContent.map((category, index) => {
            const IconComponent = iconMap[category.icon] || Sparkles;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="group relative p-5 bg-card border border-border/60 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer text-center"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 mb-3 ${category.color} group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {category.shortName}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed hidden sm:block">
                  {category.contestCount} active championships
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
