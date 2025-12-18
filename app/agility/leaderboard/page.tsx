'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import CourseMap from '@/components/agility/CourseMap';
import { toAgilityCourse, toLeaderboardEntry, type AgilityCourse, type LeaderboardEntry } from '@/lib/types/agility.types';
import Image from 'next/image';

type RankingMetric = 'speed' | 'consistency';

export default function LeaderboardPage() {
  const [courses, setCourses] = useState<AgilityCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [metric, setMetric] = useState<RankingMetric>('speed');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCourseMap, setShowCourseMap] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    async function loadLeaderboard() {
      if (!selectedCourse) return;
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc('get_agility_leaderboard', {
          p_course_id: selectedCourse,
          p_limit: 100,
          p_metric: metric,
        });
        if (error) throw error;
        setEntries((data || []).map(toLeaderboardEntry));
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }
    if (selectedCourse) {
      loadLeaderboard();
    }
  }, [selectedCourse, metric]);

  async function loadCourses() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('agility_courses')
        .select('*')
        .eq('is_official', true)
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        const typedCourses = data.map(toAgilityCourse);
        setCourses(typedCourses);
        setSelectedCourse(typedCourses[0].id);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatTime(ms: number): string {
    const totalSeconds = ms / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(1);
    return minutes > 0 ? `${minutes}:${seconds.padStart(4, '0')}` : `${seconds}s`;
  }

  const selectedCourseName = courses.find(c => c.id === selectedCourse)?.name || '';
  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  if (loading && courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Ranked official courses only</p>
        </header>

        {/* Course Info - Collapsible on mobile */}
        {selectedCourseData && (
          <div className="mb-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowCourseMap(!showCourseMap)}
              className="w-full p-4 text-left flex items-center justify-between md:cursor-default"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedCourseData.name}</h3>
                <p className="text-sm text-gray-600">{selectedCourseData.description}</p>
              </div>
              <span className="md:hidden text-gray-400">{showCourseMap ? '▼' : '▶'}</span>
            </button>
            {(showCourseMap || window.innerWidth >= 768) && (
              <div className="px-4 pb-4 flex justify-center">
                <CourseMap course={selectedCourseData} compact className="w-48 h-48" />
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Course</label>
          <select value={selectedCourse || ''} onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-base">
            {courses.map(course => (<option key={course.id} value={course.id}>{course.name}</option>))}
          </select>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex gap-2 sm:gap-3">
            <button onClick={() => setMetric('speed')}
              className={`flex-1 py-3 rounded-lg font-bold transition text-sm sm:text-base ${metric === 'speed' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'}`}>
              🏃 Speed
            </button>
            <button onClick={() => setMetric('consistency')}
              className={`flex-1 py-3 rounded-lg font-bold transition text-sm sm:text-base ${metric === 'consistency' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'}`}>
              📊 Consistency
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-6xl mb-4">🏁</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No entries yet</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Be the first to complete {selectedCourseName}!</p>
            <button onClick={() => window.location.href = '/agility/drill/setup'}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">Start Drill</button>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const isTop3 = index < 3;
              const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
              return (
                <div key={entry.id}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition ${isTop3 ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-center w-12 sm:w-16">
                      {rankEmoji ? (<div className="text-2xl sm:text-3xl">{rankEmoji}</div>) : (<div className="text-xl sm:text-2xl font-bold text-gray-400">#{entry.rank}</div>)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {entry.profile_image_url && (<Image src={entry.profile_image_url} alt={entry.username} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" width={32} height={32} />)}
                        <span className="font-bold text-base sm:text-lg text-gray-900 truncate">{entry.username}</span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">{entry.total_reps} reps · {new Date(entry.completed_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-indigo-600">
                        {metric === 'speed' ? formatTime(entry.best_total_time_ms) : entry.sprint_variance.toFixed(2) + 'ms'}
                      </div>
                      <div className="text-xs text-gray-500">{metric === 'speed' ? 'Time' : 'Variance'}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 p-4 sm:p-6 bg-white rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">📋 How Rankings Work</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
            <li><strong className="text-gray-900">Speed:</strong> Fastest total session time wins</li>
            <li><strong className="text-gray-900">Consistency:</strong> Lowest sprint variance wins</li>
            <li>Only official courses appear on leaderboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}