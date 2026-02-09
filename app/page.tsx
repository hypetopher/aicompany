import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>aicompany</h1>
      <p>Open stage UI:</p>
      <Link href="/stage">/stage</Link>
    </main>
  );
}
