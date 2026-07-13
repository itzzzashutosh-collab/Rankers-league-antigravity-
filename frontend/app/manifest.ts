import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ranker's League",
    short_name: "RankersLeague",
    description: "The National Competitive Examination Arena",
    start_url: "/",
    display: "standalone",
    background_color: "#030303",
    theme_color: "#fbbf24",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
