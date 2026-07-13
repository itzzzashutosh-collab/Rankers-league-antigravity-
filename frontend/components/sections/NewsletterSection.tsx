"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

export function NewsletterSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Newsletter subscription:", data.email);
    reset();
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 radial-glow pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 mb-6">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Championship Announcements
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">
            Be the first to know about new championships, schedule updates, and platform releases.
            Join 48,000+ aspirants who stay ahead.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8"
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto"
          >
            <div className="relative flex-1 w-full">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
              {errors.email && (
                <span className="absolute left-0 -bottom-5 text-[10px] text-destructive">
                  {errors.email.message}
                </span>
              )}
            </div>
            <Button type="submit" className="h-11 px-6 rounded-xl gap-2 font-semibold w-full sm:w-auto">
              <Send className="w-4 h-4" />
              Subscribe
            </Button>
          </form>

          {isSubmitSuccessful && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-emerald-500 text-center mt-4 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              You&apos;re subscribed! Championship updates will arrive shortly.
            </motion.p>
          )}

          <p className="text-[10px] text-muted-foreground text-center mt-4">
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
