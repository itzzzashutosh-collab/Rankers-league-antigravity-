export interface SimilarityReport {
  matchedId: string;
  matchedText: string;
  score: number;
}

export const duplicateDetector = {
  // Jaccard similarity index computation
  calculateSimilarity(textA: string, textB: string): number {
    const sanitize = (t: string) => 
      t.toLowerCase()
       .replace(/[^\w\s]/g, "")
       .split(/\s+/)
       .filter(w => w.length > 2);

    const wordsA = new Set(sanitize(textA));
    const wordsB = new Set(sanitize(textB));

    if (wordsA.size === 0 || wordsB.size === 0) return 0;

    const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
    const union = new Set([...wordsA, ...wordsB]);

    const jaccard = intersection.size / union.size;
    return Math.round(jaccard * 100);
  },

  detect(
    currentStatement: string,
    existingQuestions: { id: string; statement: string }[]
  ): SimilarityReport[] {
    const results: SimilarityReport[] = [];

    for (const q of existingQuestions) {
      const score = this.calculateSimilarity(currentStatement, q.statement);
      if (score >= 60) { // Flag duplicate warning if 60%+ similar
        results.push({
          matchedId: q.id,
          matchedText: q.statement,
          score
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }
};
