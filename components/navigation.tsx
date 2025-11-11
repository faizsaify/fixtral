'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';


const navItems = [
  { name: 'HOME', href: '/' },
  { name: 'QUEUE', href: '/queue' },
  { name: 'EDITOR', href: '/editor' },
  { name: 'HISTORY', href: '/history' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b-4 border-border bg-background">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold uppercase tracking-wider">
            FIXTRAL
          </Link>
          
          <div className="flex items-center space-x-0">
            <div className="flex space-x-0">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-6 py-3 border-2 border-border font-bold uppercase tracking-wide transition-all duration-100 ${
                    pathname === item.href
                      ? 'bg-foreground text-background'
                      : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="ml-4">

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}