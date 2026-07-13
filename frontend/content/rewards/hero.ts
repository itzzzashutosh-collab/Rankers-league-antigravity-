export interface HeroContent {
  headline: string;
  subtitle: string;
  buttons: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
}

export const heroContent: HeroContent = {
  headline: "Compete with Excellence. Earn Recognition.",
  subtitle: "Every contest rewards performance through transparent prize distribution, official recognition and long-term achievement progression.",
  buttons: {
    primary: { label: "Explore Contests", href: "/contests" },
    secondary: { label: "View Leaderboard", href: "/leaderboard" },
  },
};
