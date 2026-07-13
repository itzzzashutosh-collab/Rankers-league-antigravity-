export function calculateStandingPercentile(
  rank: number,
  totalParticipants: number
): number {
  if (totalParticipants <= 1) return 100;
  const percentile = ((totalParticipants - rank) / totalParticipants) * 100;
  return Math.round(percentile * 100) / 100;
}

export function parseDuration(durationSeconds: number): string {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
