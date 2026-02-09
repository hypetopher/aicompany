export function classifySentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const s = text.toLowerCase();
  const pos = [
    'great', 'nice', 'thanks', 'appreciate', 'helpful', 'agree', 'collab', 'mentor', 'good idea', 'love'
  ];
  const neg = [
    'bad', 'failed', 'conflict', 'disagree', 'wrong', 'blocked', 'issue', 'problem', 'annoyed', 'friction'
  ];

  let p = 0, n = 0;
  for (const w of pos) if (s.includes(w)) p++;
  for (const w of neg) if (s.includes(w)) n++;

  if (p > n) return 'positive';
  if (n > p) return 'negative';
  return 'neutral';
}

export function sentimentDelta(sentiment: 'positive' | 'negative' | 'neutral'): number {
  if (sentiment === 'positive') return 3;
  if (sentiment === 'negative') return -3;
  return 1;
}
