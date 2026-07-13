export interface QualityScoreReport {
  difficulty_balance_score: number;
  chapter_coverage_score: number;
  topic_diversity_score: number;
  exposure_risk_score: number;
  overall_quality_score: number;
}

export const qualityEngine = {
  calculateScore(
    questions: { difficulty: string; topic_id?: string; usage?: { contests_count: number } }[]
  ): QualityScoreReport {
    if (questions.length === 0) {
      return {
        difficulty_balance_score: 100,
        chapter_coverage_score: 100,
        topic_diversity_score: 100,
        exposure_risk_score: 0,
        overall_quality_score: 100
      };
    }

    // 1. Difficulty balance score (optimal: 20% Easy, 60% Medium, 20% Hard)
    const total = questions.length;
    const easyCount = questions.filter(q => q.difficulty === "Easy").length;
    const mediumCount = questions.filter(q => q.difficulty === "Medium").length;
    const hardCount = questions.filter(q => q.difficulty === "Hard" || q.difficulty === "Grandmaster").length;

    const easyRatio = easyCount / total;
    const mediumRatio = mediumCount / total;
    const hardRatio = hardCount / total;

    // Penalty for deviations
    const easyDev = Math.abs(easyRatio - 0.2);
    const mediumDev = Math.abs(mediumRatio - 0.6);
    const hardDev = Math.abs(hardRatio - 0.2);

    const diffPenalty = (easyDev + mediumDev + hardDev) * 50;
    const difficulty_balance_score = Math.max(50, Math.round(100 - diffPenalty));

    // 2. Chapter coverage score (optimal: high unique topic IDs ratio)
    const uniqueTopics = new Set(questions.map(q => q.topic_id || "default"));
    const topicRatio = uniqueTopics.size / Math.min(total, 10);
    const chapter_coverage_score = Math.min(100, Math.round(topicRatio * 100));

    // 3. Exposure risk score (percent of questions used > 2 times in recent contests)
    const highlyExposed = questions.filter(q => (q.usage?.contests_count || 0) > 2).length;
    const exposure_risk_score = Math.round((highlyExposed / total) * 100);

    // 4. Overall quality score
    const overall_quality_score = Math.round(
      (difficulty_balance_score * 0.4) + 
      (chapter_coverage_score * 0.4) + 
      ((100 - exposure_risk_score) * 0.2)
    );

    return {
      difficulty_balance_score,
      chapter_coverage_score,
      topic_diversity_score: chapter_coverage_score, // mirrored for topic coverage details
      exposure_risk_score,
      overall_quality_score
    };
  }
};
