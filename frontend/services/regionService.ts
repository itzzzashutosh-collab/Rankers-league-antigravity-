export type RegionCode = "india" | "international" | "all";
export type CurrencyCode = "INR" | "USD";

export interface RegionalConfig {
  region: RegionCode;
  currency: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
}

export const REGION_CONFIGS: Record<"india" | "international", RegionalConfig> = {
  india: {
    region: "india",
    currency: "INR",
    symbol: "₹",
    label: "India (INR)",
    flag: "🇮🇳",
  },
  international: {
    region: "international",
    currency: "USD",
    symbol: "$",
    label: "International (USD)",
    flag: "🌐",
  },
};

const STORAGE_KEY = "rankers_league_user_region";

export const regionService = {
  // Detect default region via browser timezone
  detectUserRegion(): RegionCode {
    if (typeof window === "undefined") return "india";
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "india" || stored === "international" || stored === "all") {
        return stored;
      }

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone && (timezone.includes("Kolkata") || timezone.includes("Calcutta") || timezone.includes("Asia/Colombo"))) {
        return "india";
      }
    } catch {
      // Fallback default
    }

    return "india";
  },

  // Save selected region
  setRegion(region: RegionCode) {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, region);
      window.dispatchEvent(new CustomEvent("region-changed", { detail: region }));
    }
  },

  // Format currency dynamically based on currency code and region
  formatCurrency(amount: number, currencyCode: CurrencyCode = "INR"): string {
    if (amount === 0) return "Free Entry / Recognition";

    if (currencyCode === "USD") {
      return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }

    // Default INR format
    return `₹${amount.toLocaleString("en-IN")}`;
  },

  // Format prize pool with regional prefix (e.g. Up To ₹14,00,000 or Up To $20,000)
  formatPrizePool(amount: number, currencyCode: CurrencyCode = "INR"): string {
    if (amount === 0) return "Recognition Only";
    return this.formatCurrency(amount, currencyCode);
  }
};

export default regionService;
