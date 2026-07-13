export interface PrizeBracketPreview {
  rank_start: number;
  rank_end: number;
  prize_amount: number;
  winner_count: number;
  total_allocation: number;
  percentage_of_pool: number;
  zone: "Winning Zone" | "Safe Zone" | "Entry Recovery Zone";
}

export interface PrizeMatrixGenerationResult {
  total_collection: number;
  platform_profit: number;
  prize_pool: number;
  winner_count: number;
  brackets: PrizeBracketPreview[];
}

export const prizeGenerator = {
  calculateMatrix(
    seats: number,
    fee: number,
    platformFeePercent: number,
    winnerPercent: number,
    curve: "Balanced" | "Aggressive" | "Top Heavy" | "Flat",
    firstPrizeMultiplier: number = 1
  ): PrizeMatrixGenerationResult {
    const total_collection = seats * fee;
    const platform_profit = Math.round(total_collection * (platformFeePercent / 100));
    const prize_pool = total_collection - platform_profit;
    const winner_count = Math.floor(seats * (winnerPercent / 100));

    if (winner_count <= 0 || prize_pool <= 0) {
      return {
        total_collection,
        platform_profit,
        prize_pool,
        winner_count,
        brackets: []
      };
    }

    let brackets: PrizeBracketPreview[] = [];

    // Define Rank 1 allocation percentage based on curve selection
    let rank1Percent = 10; // Balanced
    if (curve === "Top Heavy") rank1Percent = 25 * firstPrizeMultiplier;
    else if (curve === "Aggressive") rank1Percent = 18 * firstPrizeMultiplier;
    else if (curve === "Flat") rank1Percent = 3;

    // Limit rank1 allocation to safe maximums
    rank1Percent = Math.min(50, Math.max(1, rank1Percent));

    const r1_prize = Math.round(prize_pool * (rank1Percent / 100));
    brackets.push({
      rank_start: 1,
      rank_end: 1,
      prize_amount: r1_prize,
      winner_count: 1,
      total_allocation: r1_prize,
      percentage_of_pool: rank1Percent,
      zone: "Winning Zone"
    });

    if (winner_count > 1) {
      // Bottom 55% of winners get exact entry fee back (Entry Recovery Zone)
      const recovery_count = Math.floor(winner_count * 0.55);
      const recovery_start = winner_count - recovery_count + 1;
      
      if (recovery_count > 0 && recovery_start > 1) {
        brackets.push({
          rank_start: recovery_start,
          rank_end: winner_count,
          prize_amount: fee,
          winner_count: recovery_count,
          total_allocation: fee * recovery_count,
          percentage_of_pool: Math.round(((fee * recovery_count) / prize_pool) * 100),
          zone: "Entry Recovery Zone"
        });
      }

      // Middle brackets (Safe Zone vs Winning Zone)
      const remaining_winners = winner_count - 1 - (recovery_start > 1 ? recovery_count : 0);

      if (remaining_winners > 0) {
        const countA = Math.floor(remaining_winners * 0.3) || 1;
        const countB = remaining_winners - countA;

        let prizeA = Math.round(fee * 3);
        let remaining_pool = prize_pool - r1_prize - (recovery_start > 1 ? (fee * recovery_count) : 0);

        if (curve === "Top Heavy") {
          prizeA = Math.round(fee * 4);
        } else if (curve === "Flat") {
          prizeA = Math.round(fee * 1.5);
        }

        const spentA = prizeA * countA;
        const left_for_B = remaining_pool - spentA;
        
        let prizeB = fee;
        if (countB > 0) {
          prizeB = Math.max(fee, Math.round(left_for_B / countB));
        }

        if (countA > 0) {
          brackets.push({
            rank_start: 2,
            rank_end: 1 + countA,
            prize_amount: prizeA,
            winner_count: countA,
            total_allocation: prizeA * countA,
            percentage_of_pool: Math.round(((prizeA * countA) / prize_pool) * 100),
            zone: "Winning Zone"
          });
        }

        if (countB > 0) {
          brackets.push({
            rank_start: 2 + countA,
            rank_end: 1 + countA + countB,
            prize_amount: prizeB,
            winner_count: countB,
            total_allocation: prizeB * countB,
            percentage_of_pool: Math.round(((prizeB * countB) / prize_pool) * 100),
            zone: "Safe Zone"
          });
        }
      }
    }

    // Sort brackets by rank
    brackets.sort((a, b) => a.rank_start - b.rank_start);

    // Enforce exact prize pool sum constraints by adjusting the mid bracket (Safe Zone)
    const current_sum = brackets.reduce((acc, curr) => acc + curr.total_allocation, 0);
    const variance = prize_pool - current_sum;

    if (variance !== 0 && brackets.length > 1) {
      // Find a safe zone or middle bracket to adjust
      const adjustIdx = brackets.findIndex(b => b.zone === "Safe Zone" || b.zone === "Winning Zone" && b.rank_start > 1);
      const targetIdx = adjustIdx !== -1 ? adjustIdx : brackets.length - 1;

      brackets[targetIdx].total_allocation += variance;
      brackets[targetIdx].prize_amount = Math.round(brackets[targetIdx].total_allocation / brackets[targetIdx].winner_count);
      brackets[targetIdx].percentage_of_pool = Math.round((brackets[targetIdx].total_allocation / prize_pool) * 100);
    }

    return {
      total_collection,
      platform_profit,
      prize_pool,
      winner_count,
      brackets
    };
  }
};
