import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rankersleague.com";

  // Public system paths matching the championship and standing views
  const paths = [
    "",
    "/challenges",
    "/standings",
    "/rewards",
    "/pricing",
    "/about",
    "/contact",
  ];

  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : 0.8,
  }));
}
