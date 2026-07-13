export interface ContestExample {
  name: string;
  entryFee: number;
  prizePool: number;
  participants: number;
  winnerCount: number;
  firstPrize: number;
  examCategory: string;
}

export const prizeExamples: ContestExample[] = [
  {
    name: "IIT JEE Advanced Grandmaster Simulator Cup",
    entryFee: 250,
    prizePool: 50000,
    participants: 250,
    winnerCount: 25,
    firstPrize: 10000,
    examCategory: "JEE Advanced",
  },
  {
    name: "UPSC CSE Prelims All India Merit Mock",
    entryFee: 500,
    prizePool: 100000,
    participants: 300,
    winnerCount: 50,
    firstPrize: 25000,
    examCategory: "UPSC CSE",
  },
  {
    name: "NEET Physics Speed Blitz Challenge",
    entryFee: 100,
    prizePool: 20000,
    participants: 220,
    winnerCount: 15,
    firstPrize: 5000,
    examCategory: "NEET UG",
  },
];
