'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { PendingSession } from '@/lib/types/agility.types';

export default function VictoryCardPage() {
  const router = useRouter();
  const [session, setSession] = useState<PendingSession | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sessionJson = sessionStorage.getItem('agility_completed_session');
    if (!sessionJson) {
      router.push('/agility/drill/setup');
      return;
    }
    
    setSession(JSON.parse(sessionJson));
  }, [router]);

  async function handleShare() {
    if (!session) return;

    const shareData = {
      title: 'Agility Drill Complete',
      text: `Completed ${session.total_reps_completed} reps in ${(session.total_time_ms / 1000 / 60).toFixed(1)} minutes! 🏃⚡`,
      url: window.location.origin + '/agility/leaderboard',
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`
        );
        alert('Copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin h-12 w-12 border-4 border-lime-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const avgSprintTime = session.reps.reduce((sum, r) => sum + r.sprint_time_ms, 0) / session.reps.length;
  const bestRep = session.reps.reduce((best, r) => r.sprint_time_ms < best.sprint_time_ms ? r : best);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      {/* Victory Card */}
      <div 
        ref={cardRef}
        className="w-full max-w-md bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🏆</div>
          <h1 className="text-4xl font-bold text-black mb-1">
            DRILL COMPLETE
          </h1>
          <p className="text-black/70 text-sm">
            {new Date(session.completed_at).toLocaleDateString()}
          </p>
        </div>

        {/* Stats */}
        <div className="bg-black/20 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-1">
                {session.sets}
              </div>
              <div className="text-xs text-black/70">SETS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-black mb-1">
                {session.total_reps_completed}
              </div>
              <div className="text-xs text-black/70">TOTAL REPS</div>
            </div>
          </div>

          <div className="border-t border-black/20 pt-4">
            <div className="text-center mb-3">
              <div className="text-5xl font-bold text-black">
                {(session.total_time_ms / 1000 / 60).toFixed(1)}
              </div>
              <div className="text-sm text-black/70">MINUTES</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div>
                <div className="text-2xl font-bold text-black">
                  {(avgSprintTime / 1000).toFixed(1)}s
                </div>
                <div className="text-xs text-black/70">AVG SPRINT</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  #{bestRep.target_cone}
                </div>
                <div className="text-xs text-black/70">BEST CONE</div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Diagram */}
        <div className="bg-black/20 rounded-2xl p-4 mb-6">
          <div className="text-center text-xs text-black/70 mb-2">
            COURSE LAYOUT
          </div>
          <div className="relative w-full h-48 bg-black/10 rounded-xl flex items-center justify-center">
            {/* Simple cone visualization */}
            <div className="text-black/50 text-sm">
              Course diagram placeholder
            </div>
          </div>
        </div>

        {/* Footer */}
        {session.is_ranked && (
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-black text-lime-400 text-sm font-bold rounded-full">
              ⭐ RANKED SESSION
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="w-full max-w-md mt-8 space-y-3">
        <button
          onClick={handleShare}
          className="w-full py-4 bg-lime-400 text-black text-lg font-bold rounded-xl hover:bg-lime-300 transition"
        >
          📤 Share Results
        </button>

        <button
          onClick={() => router.push('/agility/leaderboard')}
          className="w-full py-4 bg-gray-900 text-white text-lg font-bold rounded-xl hover:bg-gray-800 transition border-2 border-gray-700"
        >
          🏆 View Leaderboard
        </button>

        <button
          onClick={() => router.push('/agility/drill/setup')}
          className="w-full py-4 bg-gray-900 text-white text-lg font-bold rounded-xl hover:bg-gray-800 transition border-2 border-gray-700"
        >
          🔄 New Drill
        </button>
      </div>
    </div>
  );
}
