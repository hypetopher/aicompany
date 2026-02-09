import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>aicompany</h1>
      <p>Open pages:</p>
      <ul>
        <li><Link href="/stage">/stage</Link></li>
        <li><Link href="/assign">/assign</Link></li>
      </ul>
    </main>
  );
}
