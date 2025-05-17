import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
      <Sparkles className="h-7 w-7" />
      <h1 className="text-2xl font-semibold">MotivateMe Daily</h1>
    </Link>
  );
}
