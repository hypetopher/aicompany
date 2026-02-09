export function computeNextRunAfter(attempts: number): string {
  const capped = Math.min(attempts, 6);
  const delaySec = Math.pow(2, capped) * 30; // 30s, 60s, 120s ...
  return new Date(Date.now() + delaySec * 1000).toISOString();
}

export function shouldDeadLetter(attempts: number): boolean {
  return attempts >= 7;
}
