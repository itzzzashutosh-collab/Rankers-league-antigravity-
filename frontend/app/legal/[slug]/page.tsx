"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { legalDocuments } from "@/content/legal-center";
import { LegalDocumentTemplate, type StandardLegalDocumentData } from "@/components/legal/LegalDocumentTemplate";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function LegalDocumentPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const docIndex = legalDocuments.findIndex((d) => d.slug === slug);
  if (docIndex === -1) {
    notFound();
  }

  const rawDoc = legalDocuments[docIndex];
  const prevDoc = docIndex > 0 ? legalDocuments[docIndex - 1] : null;
  const nextDoc = docIndex < legalDocuments.length - 1 ? legalDocuments[docIndex + 1] : null;

  // Adapt rawDoc into StandardLegalDocumentData
  const templateData: StandardLegalDocumentData = {
    slug: rawDoc.slug,
    title: rawDoc.title,
    titleHi: rawDoc.titleHi,
    version: rawDoc.version,
    effectiveDate: "August 1, 2026",
    lastUpdated: rawDoc.lastUpdated,
    readTime: rawDoc.readTime,
    category: rawDoc.category,
    
    introduction: rawDoc.shortDescription,
    introductionHi: rawDoc.shortDescriptionHi,
    
    sections: rawDoc.sections,
    sectionsHi: rawDoc.sectionsHi,
    
    definitions: [
      { term: "Ranker's League", meaning: "India's premier competitive examination contest & percentile analytics platform." },
      { term: "Contestant / Candidate", meaning: "Any registered student or aspirant participating in live or mock contest arenas." },
      { term: "AIR Percentile", meaning: "Audited All-India Rank percentile calculated using proprietary scoring algorithms." },
    ],
    definitionsHi: [
      { term: "रैंकर्स लीग", meaning: "भारत का प्रमुख प्रतियोगी परीक्षा कॉन्टेस्ट एवं परसेंटाइल प्लेटफॉर्म।" },
      { term: "प्रतिभागी / अभ्यर्थी", meaning: "लाइव या मॉक प्रतियोगिता में भाग लेने वाला पंजीकृत छात्र।" },
    ],
    
    rights: [
      "Right to full transparency regarding contest scoring and rank calculation algorithms.",
      "Right to 100% wallet credit refund on platform-cancelled contests.",
      "Right to request personal data export or account closure under Privacy Policy.",
      "Right to file a formal appeal against disqualification within 48 hours."
    ],
    rightsHi: [
      "प्रतियोगिता अंकन और रैंक गणना की पूर्ण पारदर्शिता का अधिकार।",
      "रद्द प्रतियोगिताओं पर 100% वॉलेट क्रेडिट रिफंड का अधिकार।"
    ],
    
    responsibilities: [
      "Maintain strict academic integrity and solve all questions independently.",
      "Keep account credentials confidential and prevent unauthorized secondary device logins.",
      "Comply with active browser proctoring lockdown protocols throughout contest sessions.",
      "Report any discovered platform vulnerabilities responsibly to support."
    ],
    responsibilitiesHi: [
      "सख्त शैक्षणिक ईमानदारी बनाए रखें और स्वतंत्र रूप से प्रश्न हल करें।",
      "खाता क्रेडेंशियल गोपनीय रखें।"
    ],
    
    exceptions: [
      "Disruptions caused by candidate-side internet outage or hardware failure are exempt from fee refunds.",
      "Force Majeure events resulting in national server downtime will trigger automatic contest rescheduling."
    ],
    exceptionsHi: [
      "उम्मीदवार के इंटरनेट बंद होने से होने वाले व्यवधान रिफंड योग्य नहीं हैं।"
    ],
    
    contactEmail: "legal@rankersleague.com",
    contactAddress: "Ranker's League Legal Cell, Tech Park, New Delhi, India",
    
    versionHistory: rawDoc.versionHistory || [
      { version: rawDoc.version, date: rawDoc.lastUpdated, summary: "Current active policy version." }
    ],
    
    prevDoc: prevDoc ? { title: prevDoc.title, slug: prevDoc.slug } : null,
    nextDoc: nextDoc ? { title: nextDoc.title, slug: nextDoc.slug } : null,
  };

  return <LegalDocumentTemplate document={templateData} />;
}
