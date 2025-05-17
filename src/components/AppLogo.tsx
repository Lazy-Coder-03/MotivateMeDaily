import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
      <img src="/flame_sticky_note.png" alt="App Logo" height="28" width="28" />
      <h1 className="text-2xl font-semibold">MotivateMe</h1>
    </Link>
  );
}
