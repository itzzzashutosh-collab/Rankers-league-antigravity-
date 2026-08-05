import { MetadataRoute } from "next";
import { legalDocuments } from "@/content/legal-center";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rankersleague.com";

  // Base Legal Hub entry
  const hubEntry: MetadataRoute.Sitemap[number] = {
    url: `${baseUrl}/legal`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  };

  // 20+ Legal Document Entries
  const documentEntries: MetadataRoute.Sitemap = legalDocuments.map((doc) => ({
    url: `${baseUrl}/legal/${doc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [hubEntry, ...documentEntries];
}
