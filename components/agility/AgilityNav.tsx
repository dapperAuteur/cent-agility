'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';

export default function AgilityNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/agility/drill/setup', label: 'Drill', icon: '⚡' },
    { href: '/agility/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">⚡</span>
            <span className="text-lg sm:text-xl font-bold text-gray-900">Agility Engine</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
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

            {user ? (
              <>
                <span className="text-sm text-gray-600 truncate max-w-37.5">{user.email}</span>
                <button onClick={() => signOut()} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/agility/auth/signin" className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold ${
                  pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-600 truncate">{user.email}</div>
                <button onClick={() => signOut()} className="w-full text-left px-4 py-3 font-semibold text-gray-600 rounded-lg">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/agility/auth/signin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg text-center">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}