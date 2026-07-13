"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Section,
  Typography,
  Card,
  Badge,
  Button,
} from "@/components/ui";
import { Check, Star, HelpCircle } from "lucide-react";
import { pricingContent } from "@/content/pricing";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-grow">
        <Section radialGlow className="pt-16 pb-20">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-4 mb-16">
            <Badge variant="featured" className="self-center">
              Simple Credit Mechanics
            </Badge>
            <Typography variant="display-l">Access & Credit Bundles</Typography>
            <Typography variant="subtitle">
              Secure entrance credits to register for national-level competitive examination championships. Volume discounts apply.
            </Typography>
          </div>

          {/* Pricing Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-16">
            {pricingContent.map((pkg) => (
              <Card
                key={pkg.id}
                variant={pkg.popular ? "gradient-border" : "solid"}
                hoverEffect="lift-glow"
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Typography variant="h4" className="font-bold">
                      {pkg.name}
                    </Typography>
                    {pkg.popular && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[9px] font-bold uppercase tracking-wider">
                        <Star className="w-2.5 h-2.5 fill-primary" /> Most Popular
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground">
                      &#x20B9;{pkg.price}
                    </span>
                    <span className="text-xs text-muted-foreground">one-time</span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-col gap-3 mb-8">
                    <div className="text-xs font-bold text-foreground mb-1 uppercase tracking-widest text-primary">
                      {pkg.credits} + {pkg.bonusCredits} Bonus Credits
                    </div>
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex gap-2.5 items-start text-xs text-muted-foreground leading-relaxed">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full rounded-xl" variant={pkg.popular ? "gradient" : "outline"}>
                  Purchase Bundle
                </Button>
              </Card>
            ))}
          </div>

          {/* FAQ link */}
          <div className="max-w-md mx-auto text-center flex flex-col gap-3 justify-center items-center">
            <HelpCircle className="w-6 h-6 text-primary" />
            <Typography variant="body-medium" className="text-muted-foreground leading-relaxed">
              Credits never expire. For institutional allocations or custom mock centers, please contact our support desk.
            </Typography>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
