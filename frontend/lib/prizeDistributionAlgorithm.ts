export interface PrizeTier {
  rankRange: string;
  rankStart: number;
  rankEnd: number;
  prizePerWinner: number;
  winnerCount: number;
  totalAllocation: number;
  isBumper?: boolean;
  isRefund?: boolean;
}

export interface PrizeMatrixResult {
  seats: number;
  entryFee: number;
  totalCollection: number;
  marginPercentage: number;
  platformProfit: number;
  prizePool: number;
  totalWinners: number;
  winnerPercentage: number;
  matrix: PrizeTier[];
}

/**
 * Rounds a prize figure to a clean, student-friendly number.
 * e.g., 43,986 -> 44,000 | 12,340 -> 12,500 | 7,650 -> 7,700 | 542 -> 540
 */
function roundClean(amount: number): number {
  if (amount <= 0) return 0;
  if (amount >= 50000) return Math.round(amount / 1000) * 1000;
  if (amount >= 10000) return Math.round(amount / 500) * 500;
  if (amount >= 1000) return Math.round(amount / 100) * 100;
  if (amount >= 100) return Math.round(amount / 10) * 10;
  return Math.round(amount);
}

/**
 * Dynamically generates a mathematically exact, clean Rank Prize Distribution Matrix.
 * Guaranteed 0 negative numbers, clean rounded figures, and exact seat scaling.
 */
export function calculatePrizeMatrix(
  seats: number = 100,
  entryFee: number = 500,
  marginPercent: number = 30
): PrizeMatrixResult {
  const safeSeats = Math.max(5, seats || 100);
  const safeFee = Math.max(0, entryFee || 0);

  // 1. Basic Financials
  const totalCollection = safeSeats * safeFee;
  const prizePool = Math.round(totalCollection * 0.70);
  const platformProfit = totalCollection - prizePool;

  // Handle free contest case
  if (safeFee === 0 || totalCollection === 0) {
    const freeWinners = Math.max(3, Math.floor(safeSeats * 0.6));
    return {
      seats: safeSeats,
      entryFee: 0,
      totalCollection: 0,
      marginPercentage: 0,
      platformProfit: 0,
      prizePool: 0,
      totalWinners: freeWinners,
      winnerPercentage: 60,
      matrix: [
        { rankRange: "Rank 1", rankStart: 1, rankEnd: 1, prizePerWinner: 1000, winnerCount: 1, totalAllocation: 1000, isBumper: true },
        { rankRange: "Rank 2", rankStart: 2, rankEnd: 2, prizePerWinner: 600, winnerCount: 1, totalAllocation: 600 },
        { rankRange: "Rank 3", rankStart: 3, rankEnd: 3, prizePerWinner: 400, winnerCount: 1, totalAllocation: 400 },
        { rankRange: `Rank 4 - ${freeWinners}`, rankStart: 4, rankEnd: freeWinners, prizePerWinner: 100, winnerCount: freeWinners - 3, totalAllocation: (freeWinners - 3) * 100, isRefund: true },
      ],
    };
  }

  // 2. Winner Count (60% of total seats get rewards)
  const winnerPercentage = 60;
  const totalWinners = Math.max(1, Math.floor(safeSeats * 0.60));

  // Base allocation: Every winner gets at least their entry fee back (safeFee)
  // Base cost = totalWinners * safeFee
  const baseCost = totalWinners * safeFee;
  // Surplus pool above base entry fee return = prizePool - baseCost
  const surplusPool = Math.max(0, prizePool - baseCost);

  const matrix: PrizeTier[] = [];

  if (safeSeats <= 20) {
    // Micro Contest (<= 20 seats)
    const b2 = roundClean(surplusPool * 0.25);
    const b3 = roundClean(surplusPool * 0.15);
    const b1 = Math.max(0, surplusPool - (b2 + b3));

    matrix.push({ rankRange: "Rank 1", rankStart: 1, rankEnd: 1, prizePerWinner: safeFee + b1, winnerCount: 1, totalAllocation: safeFee + b1, isBumper: true });
    if (totalWinners >= 2) matrix.push({ rankRange: "Rank 2", rankStart: 2, rankEnd: 2, prizePerWinner: safeFee + b2, winnerCount: 1, totalAllocation: safeFee + b2 });
    if (totalWinners >= 3) matrix.push({ rankRange: "Rank 3", rankStart: 3, rankEnd: 3, prizePerWinner: safeFee + b3, winnerCount: 1, totalAllocation: safeFee + b3 });
    if (totalWinners > 3) {
      const remCount = totalWinners - 3;
      matrix.push({
        rankRange: totalWinners === 4 ? "Rank 4" : `Rank 4 - ${totalWinners}`,
        rankStart: 4,
        rankEnd: totalWinners,
        prizePerWinner: safeFee,
        winnerCount: remCount,
        totalAllocation: remCount * safeFee,
        isRefund: true,
      });
    }
  } else if (safeSeats <= 100) {
    // Medium Contest (21 - 100 seats)
    const b2 = roundClean(surplusPool * 0.20);
    const b3 = roundClean(surplusPool * 0.12);

    let b4_10_per = 0;
    let b4_10_total = 0;
    if (totalWinners >= 10) {
      b4_10_per = roundClean((surplusPool * 0.18) / 7);
      b4_10_total = b4_10_per * 7;
    }

    let b11_25_per = 0;
    let b11_25_total = 0;
    if (totalWinners >= 25) {
      b11_25_per = roundClean((surplusPool * 0.15) / 15);
      b11_25_total = b11_25_per * 15;
    }

    const b1 = Math.max(0, surplusPool - (b2 + b3 + b4_10_total + b11_25_total));

    matrix.push({ rankRange: "Rank 1", rankStart: 1, rankEnd: 1, prizePerWinner: safeFee + b1, winnerCount: 1, totalAllocation: safeFee + b1, isBumper: true });
    matrix.push({ rankRange: "Rank 2", rankStart: 2, rankEnd: 2, prizePerWinner: safeFee + b2, winnerCount: 1, totalAllocation: safeFee + b2 });
    matrix.push({ rankRange: "Rank 3", rankStart: 3, rankEnd: 3, prizePerWinner: safeFee + b3, winnerCount: 1, totalAllocation: safeFee + b3 });

    if (totalWinners >= 10) {
      matrix.push({ rankRange: "Rank 4 - 10", rankStart: 4, rankEnd: 10, prizePerWinner: safeFee + b4_10_per, winnerCount: 7, totalAllocation: (safeFee + b4_10_per) * 7 });
    }
    if (totalWinners >= 25) {
      matrix.push({ rankRange: "Rank 11 - 25", rankStart: 11, rankEnd: 25, prizePerWinner: safeFee + b11_25_per, winnerCount: 15, totalAllocation: (safeFee + b11_25_per) * 15 });
    }

    const usedCount = 3 + (totalWinners >= 10 ? 7 : 0) + (totalWinners >= 25 ? 15 : 0);
    const remWinners = Math.max(0, totalWinners - usedCount);
    if (remWinners > 0) {
      const startR = usedCount + 1;
      matrix.push({
        rankRange: startR === totalWinners ? `Rank ${startR}` : `Rank ${startR} - ${totalWinners}`,
        rankStart: startR,
        rankEnd: totalWinners,
        prizePerWinner: safeFee,
        winnerCount: remWinners,
        totalAllocation: remWinners * safeFee,
        isRefund: true,
      });
    }
  } else {
    // Large Contest (> 100 seats, e.g. 500, 1,000, 4,000, 10,000 seats)
    const b2 = roundClean(surplusPool * 0.18);
    const b3 = roundClean(surplusPool * 0.10);

    const b4_10_per = roundClean((surplusPool * 0.16) / 7);
    const b4_10_total = b4_10_per * 7;

    let b11_50_per = 0;
    let b11_50_total = 0;
    if (totalWinners >= 50) {
      b11_50_per = roundClean((surplusPool * 0.18) / 40);
      b11_50_total = b11_50_per * 40;
    }

    let b51_250_per = 0;
    let b51_250_total = 0;
    if (totalWinners >= 250) {
      b51_250_per = roundClean((surplusPool * 0.12) / 200);
      b51_250_total = b51_250_per * 200;
    }

    const b1 = Math.max(0, surplusPool - (b2 + b3 + b4_10_total + b11_50_total + b51_250_total));

    matrix.push({ rankRange: "Rank 1", rankStart: 1, rankEnd: 1, prizePerWinner: roundClean(safeFee + b1), winnerCount: 1, totalAllocation: roundClean(safeFee + b1), isBumper: true });
    matrix.push({ rankRange: "Rank 2", rankStart: 2, rankEnd: 2, prizePerWinner: roundClean(safeFee + b2), winnerCount: 1, totalAllocation: roundClean(safeFee + b2) });
    matrix.push({ rankRange: "Rank 3", rankStart: 3, rankEnd: 3, prizePerWinner: roundClean(safeFee + b3), winnerCount: 1, totalAllocation: roundClean(safeFee + b3) });
    matrix.push({ rankRange: "Rank 4 - 10", rankStart: 4, rankEnd: 10, prizePerWinner: roundClean(safeFee + b4_10_per), winnerCount: 7, totalAllocation: roundClean(safeFee + b4_10_per) * 7 });

    if (totalWinners >= 50) {
      matrix.push({ rankRange: "Rank 11 - 50", rankStart: 11, rankEnd: 50, prizePerWinner: roundClean(safeFee + b11_50_per), winnerCount: 40, totalAllocation: roundClean(safeFee + b11_50_per) * 40 });
    }
    if (totalWinners >= 250) {
      matrix.push({ rankRange: "Rank 51 - 250", rankStart: 51, rankEnd: 250, prizePerWinner: roundClean(safeFee + b51_250_per), winnerCount: 200, totalAllocation: roundClean(safeFee + b51_250_per) * 200 });
    }

    const usedCount = 3 + 7 + (totalWinners >= 50 ? 40 : 0) + (totalWinners >= 250 ? 200 : 0);
    const remWinners = Math.max(0, totalWinners - usedCount);
    if (remWinners > 0) {
      const startR = usedCount + 1;
      matrix.push({
        rankRange: startR === totalWinners ? `Rank ${startR}` : `Rank ${startR} - ${totalWinners}`,
        rankStart: startR,
        rankEnd: totalWinners,
        prizePerWinner: safeFee,
        winnerCount: remWinners,
        totalAllocation: remWinners * safeFee,
        isRefund: true,
      });
    }
  }

  return {
    seats: safeSeats,
    entryFee: safeFee,
    totalCollection,
    marginPercentage: marginPercent,
    platformProfit,
    prizePool,
    totalWinners,
    winnerPercentage,
    matrix,
  };
}
