'use client';

import { AuthProvider } from '@/lib/auth/auth-context';
import AgilityNav from '@/components/agility/AgilityNav';

export default function AgilityLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AgilityNav />
        {children}
      </div>
    </AuthProvider>
  );
}
