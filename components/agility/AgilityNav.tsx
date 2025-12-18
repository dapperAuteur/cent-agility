'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

export default function AgilityNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    { href: '/agility/drill/setup', label: 'Drill', icon: '⚡' },
    { href: '/agility/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/agility/drill/setup" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold text-gray-900">Agility Engine</span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                  pathname === item.href
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/agility/auth/signin"
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
