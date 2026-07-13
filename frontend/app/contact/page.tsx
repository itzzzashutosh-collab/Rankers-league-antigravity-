"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Section, Typography, Card, Badge, Breadcrumb } from "@/components/ui";
import { Mail, Send, Sparkles, Phone, HelpCircle } from "lucide-react";
import { contactContent } from "@/content/footer/contact";

export default function ContactPage() {
  const [success, setSuccess] = React.useState(false);
  const [inquiryType, setInquiryType] = React.useState("support");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Contact Us" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />

      <main className="flex-grow">
        <Section className="py-20 bg-gradient-to-b from-card/30 to-background/50">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <Breadcrumb items={breadcrumbItems} className="mb-8" />

            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <Badge variant="featured" className="self-center">
                Contact Desk
              </Badge>
              <Typography variant="display-l" className="tracking-tight leading-tight">
                {contactContent.title}
              </Typography>
              <Typography variant="body-large" className="text-muted-foreground leading-relaxed">
                {contactContent.intro}
              </Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Direct channels */}
              <div className="lg:col-span-5 space-y-6">
                <Typography variant="h3" className="tracking-tight">
                  Direct Channels
                </Typography>
                
                <div className="space-y-4">
                  {contactContent.channels.map((ch) => (
                    <Card key={ch.id} className="p-5 rounded-xl border border-border bg-card/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{ch.name}</span>
                        <Badge variant="national" className="text-[8px] uppercase py-0 px-2">
                          {ch.id}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {ch.description}
                      </p>
                      <a
                        href={`mailto:${ch.email}`}
                        className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {ch.email}
                      </a>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Right Column: Inquiry Form */}
              <div className="lg:col-span-7">
                <Card className="p-8 rounded-3xl border border-border bg-card/25 backdrop-blur-md">
                  <Typography variant="h3" className="mb-6 tracking-tight">
                    Submit Inquiry
                  </Typography>

                  {success ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                        <Sparkles className="w-6 h-6 text-emerald-400" />
                      </div>
                      <Typography variant="h4">Message Dispatched</Typography>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                        Your inquiry parameters have been registered. A support representative will follow up shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-muted-foreground block">Your Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-semibold text-muted-foreground block">Email Address *</label>
                          <input
                            type="email"
                            required
                            placeholder="john@example.com"
                            className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground block">Inquiry Type *</label>
                        <select
                          value={inquiryType}
                          onChange={(e) => setInquiryType(e.target.value)}
                          className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:border-primary"
                        >
                          <option value="support">Technical Support</option>
                          <option value="sales">Institutional Partnerships</option>
                          <option value="biz">Business Development</option>
                          <option value="media">Media / Press Inquiries</option>
                          <option value="general">General Inquiry</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground block">Subject *</label>
                        <input
                          type="text"
                          required
                          placeholder="Brief query subject..."
                          className="w-full h-9 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground block">Message Details *</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Provide detailed information regarding your inquiry..."
                          className="w-full p-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full h-10 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send Message
                      </button>
                    </form>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
