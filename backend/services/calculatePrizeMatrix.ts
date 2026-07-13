export interface PrizeRankRange {
  rankStart: number;
  rankEnd: number;
  prizePerUser: number;
  totalWinners: number;
  totalAllocation: number;
  isSafeZone: boolean;
}

export interface PrizeMatrixResult {
  totalCollection: number;
  platformRevenue: number;
  prizePool: number;
  winnerCount: number;
  rank1Prize: number;
  lowestPrize: number;
  prizes: number[]; // Index r-1 maps to Rank r prize
  distribution: PrizeRankRange[];
}

export function calculatePrizeMatrix(entryFee: number, filledSeats: number): PrizeMatrixResult {
  const totalCollection = entryFee * filledSeats;
  const platformRevenue = Math.round(totalCollection * 0.3 * 100) / 100;
  const prizePool = Math.round((totalCollection - platformRevenue) * 100) / 100;

  const winnerCount = Math.floor(filledSeats * 0.5);

  if (winnerCount <= 0) {
    return {
      totalCollection,
      platformRevenue,
      prizePool,
      winnerCount: 0,
      rank1Prize: 0,
      lowestPrize: 0,
      prizes: [],
      distribution: []
    };
  }

  if (winnerCount === 1) {
    const roundedPool = Math.round(prizePool);
    return {
      totalCollection,
      platformRevenue,
      prizePool,
      winnerCount: 1,
      rank1Prize: roundedPool,
      lowestPrize: roundedPool,
      prizes: [roundedPool],
      distribution: [
        {
          rankStart: 1,
          rankEnd: 1,
          prizePerUser: roundedPool,
          totalWinners: 1,
          totalAllocation: roundedPool,
          isSafeZone: true
        }
      ]
    };
  }

  const rank1Prize = Math.round(prizePool * 0.12 * 100) / 100;
  const lowestPrize = entryFee;

  const A = rank1Prize;
  const B = (rank1Prize - lowestPrize) / Math.log(winnerCount);

  const prizes: number[] = [];
  let sumPrizes = 0;

  for (let r = 1; r <= winnerCount; r++) {
    let p = A - B * Math.log(r);
    if (p < lowestPrize) p = lowestPrize;
    const roundedPrize = Math.round(p);
    prizes.push(roundedPrize);
    sumPrizes += roundedPrize;
  }

  const leakage = Math.round(prizePool) - sumPrizes;
  prizes[0] = prizes[0] + leakage;
  
  const finalRank1Prize = prizes[0];

  const distribution: PrizeRankRange[] = [];
  let currentStart = 1;
  
  for (let r = 1; r <= winnerCount; r++) {
    const currentPrize = prizes[r - 1];
    const nextPrize = prizes[r];
    
    if (currentPrize !== nextPrize || r === winnerCount) {
      const count = r - currentStart + 1;
      const allocation = currentPrize * count;
      distribution.push({
        rankStart: currentStart,
        rankEnd: r,
        prizePerUser: currentPrize,
        totalWinners: count,
        totalAllocation: allocation,
        isSafeZone: currentPrize > entryFee
      });
      currentStart = r + 1;
    }
  }

  return {
    totalCollection,
    platformRevenue,
    prizePool: Math.round(prizePool),
    winnerCount,
    rank1Prize: finalRank1Prize,
    lowestPrize,
    prizes,
    distribution
  };
}
