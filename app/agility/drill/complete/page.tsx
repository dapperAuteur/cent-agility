'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CourseMap from '@/components/agility/CourseMap';
import type { PendingSession } from '@/lib/types/agility.types';

export default function VictoryCardPage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [session] = useState<PendingSession | null>(() => {
    if (typeof window === 'undefined') return null;
    const sessionJson = sessionStorage.getItem('agility_completed_session');
    if (!sessionJson) return null;
    return JSON.parse(sessionJson);
  });

  useEffect(() => {
    if (!session) {
      router.push('/agility/drill/setup');
    }
  }, [session, router]);

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
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert('Copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const avgSprintTime = session.reps.reduce((sum, r) => sum + r.sprint_time_ms, 0) / session.reps.length;
  const bestRep = session.reps.reduce((best, r) => r.sprint_time_ms < best.sprint_time_ms ? r : best);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center">
      <div ref={cardRef} className="w-full max-w-md bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">🏆</div>
          <h1 className="text-4xl font-bold text-white mb-1">DRILL COMPLETE</h1>
          <p className="text-white/70 text-sm">{new Date(session.completed_at).toLocaleDateString()}</p>
        </div>

        <div className="bg-white/20 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">{session.sets}</div>
              <div className="text-xs text-white/70">SETS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">{session.total_reps_completed}</div>
              <div className="text-xs text-white/70">TOTAL REPS</div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-4">
            <div className="text-center mb-3">
              <div className="text-5xl font-bold text-white">{(session.total_time_ms / 1000 / 60).toFixed(1)}</div>
              <div className="text-sm text-white/70">MINUTES</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div>
                <div className="text-2xl font-bold text-white">{(avgSprintTime / 1000).toFixed(1)}s</div>
                <div className="text-xs text-white/70">AVG SPRINT</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">#{bestRep.target_cone}</div>
                <div className="text-xs text-white/70">BEST CONE</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/20 rounded-2xl p-4 mb-6 flex justify-center">
          <CourseMap 
            course={{
              id: session.course_id || '',
              name: '',
              description: null,
              cone_count: 4,
              cone_positions: [],
              is_official: session.is_ranked,
              created_by: null,
              created_at: '',
              updated_at: ''
            }} 
            compact 
            className="w-48 h-48"
          />
        </div>

        {session.is_ranked && (
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-white text-indigo-600 text-sm font-bold rounded-full">⭐ RANKED SESSION</span>
          </div>
        )}
      </div>

      <div className="w-full max-w-md mt-8 space-y-3">
        <button onClick={handleShare}
          className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition">
          📤 Share Results
        </button>
        <button onClick={() => router.push('/agility/leaderboard')}
          className="w-full py-4 bg-white text-gray-900 text-lg font-bold rounded-xl hover:bg-gray-50 transition border-2 border-gray-200">
          🏆 View Leaderboard
        </button>
        <button onClick={() => router.push('/agility/drill/setup')}
          className="w-full py-4 bg-white text-gray-900 text-lg font-bold rounded-xl hover:bg-gray-50 transition border-2 border-gray-200">
          🔄 New Drill
        </button>
      </div>
    </div>
  );
}
