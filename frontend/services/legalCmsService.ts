import { legalDocuments as initialDocuments, type LegalDocument, type LegalSection, type VersionLog } from "@/content/legal-center";

export type DocumentStatus = "published" | "draft" | "archived";

export interface LegalCMSSection extends LegalSection {
  id: string;
  subsections?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

export interface LegalSEOData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface CMSLegalDocument extends Omit<LegalDocument, "sections"> {
  id: string;
  effectiveDate: string;
  status: DocumentStatus;
  sections: LegalCMSSection[];
  sectionsHi?: LegalCMSSection[];
  seo?: LegalSEOData;
}

const CMS_STORAGE_KEY = "rankers_legal_cms_documents_v3";

/**
 * Seed initial CMS documents from legal-center.ts data
 */
function getInitialCMSData(): CMSLegalDocument[] {
  const seen = new Set<string>();
  const initialUnique = initialDocuments.filter((doc) => {
    if (seen.has(doc.slug)) return false;
    seen.add(doc.slug);
    return true;
  });

  return initialUnique.map((doc, idx) => ({
    ...doc,
    id: `doc-${idx + 1}`,
    effectiveDate: "August 1, 2026",
    status: "published" as DocumentStatus,
    sections: doc.sections.map((sec, sIdx) => ({
      ...sec,
      id: `section-${sIdx + 1}`,
    })),
    sectionsHi: doc.sectionsHi?.map((sec, sIdx) => ({
      ...sec,
      id: `section-hi-${sIdx + 1}`,
    })),
    seo: {
      metaTitle: `${doc.title} | Ranker's League Legal Center`,
      metaDescription: doc.shortDescription,
      keywords: ["Rankers League", doc.title, doc.category, "Legal Policy", "Terms"],
    },
  }));
}

class LegalCMSService {
  private documents: CMSLegalDocument[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private sanitizeAndDeduplicate(docs: CMSLegalDocument[]): CMSLegalDocument[] {
    const seen = new Set<string>();
    const uniqueDocs: CMSLegalDocument[] = [];

    for (const d of docs) {
      if (!seen.has(d.slug)) {
        seen.add(d.slug);
        uniqueDocs.push({
          ...d,
          id: `doc-${uniqueDocs.length + 1}`,
        });
      }
    }
    return uniqueDocs;
  }

  private loadFromStorage() {
    if (typeof window === "undefined") {
      this.documents = getInitialCMSData();
      return;
    }

    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.documents = this.sanitizeAndDeduplicate(parsed);
      } else {
        this.documents = getInitialCMSData();
        this.saveToStorage();
      }
    } catch {
      this.documents = getInitialCMSData();
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(this.documents));
      } catch (err) {
        console.error("Failed to persist Legal CMS documents:", err);
      }
    }
  }

  /**
   * Get all published documents for public display
   */
  public getPublishedDocuments(): CMSLegalDocument[] {
    return this.sanitizeAndDeduplicate(this.documents.filter((d) => d.status === "published"));
  }

  /**
   * Get all documents (Admin view including Drafts & Archived)
   */
  public getAllDocuments(): CMSLegalDocument[] {
    return this.sanitizeAndDeduplicate(this.documents);
  }

  /**
   * Find document by slug or alias
   */
  public getDocumentBySlug(slug: string): CMSLegalDocument | null {
    const aliasMap: Record<string, string> = {
      "refund-policy": "refund",
      "terms": "terms-and-conditions",
      "tax-policy": "tax-tds",
      "withdrawal-policy": "withdrawal",
      "contest-eligibility": "eligibility",
      "security-policy": "security",
      "appeals": "appeal",
      "legal-support": "contact-support",
    };

    const targetSlug = aliasMap[slug] || slug;
    return this.documents.find((d) => d.slug === targetSlug) || null;
  }

  /**
   * Search documents by query or category
   */
  public searchDocuments(query: string = "", category: string = "All"): CMSLegalDocument[] {
    return this.getPublishedDocuments().filter((doc) => {
      const matchesCategory = category === "All" || doc.category === category;
      const q = query.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesTitle = doc.title.toLowerCase().includes(q) || (doc.titleHi && doc.titleHi.includes(q));
      const matchesDesc = doc.shortDescription.toLowerCase().includes(q);
      const matchesSection = doc.sections.some(
        (s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
      );

      return matchesCategory && (matchesTitle || matchesDesc || matchesSection);
    });
  }

  /**
   * Save or Update a Document in the CMS
   */
  public saveDocument(updatedDoc: CMSLegalDocument): CMSLegalDocument {
    const index = this.documents.findIndex((d) => d.id === updatedDoc.id);
    if (index >= 0) {
      this.documents[index] = { ...updatedDoc, lastUpdated: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) };
    } else {
      this.documents.push(updatedDoc);
    }
    this.saveToStorage();
    return updatedDoc;
  }

  /**
   * Create a new Version Revision for a document
   */
  public createRevision(docId: string, newVersion: string, summary: string): CMSLegalDocument | null {
    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) return null;

    const newLog: VersionLog = {
      version: newVersion,
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      summary,
    };

    doc.version = newVersion;
    doc.lastUpdated = newLog.date;
    doc.versionHistory = [newLog, ...(doc.versionHistory || [])];

    this.saveToStorage();
    return doc;
  }

  /**
   * Update Document Status
   */
  public setDocumentStatus(docId: string, status: DocumentStatus): boolean {
    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) return false;
    doc.status = status;
    this.saveToStorage();
    return true;
  }

  /**
   * Reset CMS back to initial seeds
   */
  public resetToDefaults(): void {
    this.documents = getInitialCMSData();
    this.saveToStorage();
  }
}

export const legalCmsService = new LegalCMSService();
export default legalCmsService;
