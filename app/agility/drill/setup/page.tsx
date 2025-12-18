'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { agilityStorage } from '@/lib/db/agility-storage';
import { useAuth } from '@/lib/auth/auth-context';
import CourseMap from '@/components/agility/CourseMap';
import type { AgilityCourse, DrillConfig } from '@/lib/types/agility.types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DrillSetupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [courses, setCourses] = useState<AgilityCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<AgilityCourse | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [config, setConfig] = useState({
    sets: 3,
    repsPerSet: 10,
    restBetweenSets: 60,
    minStartDelay: 2,
    maxStartDelay: 5,
  });

  useEffect(() => {
    async function initAndLoadCourses() {
      try {
        await agilityStorage.init();
      } catch (err) {
        console.warn('Storage init failed:', err);
      }
      loadCourses();
    }
    initAndLoadCourses();
  }, []);

  async function loadCourses() {
    try {
      let cached: AgilityCourse[] = [];
      try {
        cached = await agilityStorage.getCachedCourses();
      } catch (err) {
        console.log('Cache unavailable');
        console.log('err :>> ', err);
      }
      
      if (cached.length > 0) {
        setCourses(cached);
        setSelectedCourse(cached.find(c => c.is_official) || cached[0]);
        setLoading(false);
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from('agility_courses')
        .select('*')
        .order('is_official', { ascending: false });

      if (error) throw error;

      if (data) {
        const typedData = data as unknown as AgilityCourse[];
        setCourses(typedData);
        await agilityStorage.cacheCourses(typedData);
        
        if (cached.length === 0) {
          setSelectedCourse(typedData.find(c => c.is_official) || typedData[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  }

  function startDrill() {
    if (!selectedCourse) return;
    const drillConfig: DrillConfig = {
      course: selectedCourse,
      ...config,
    };
    sessionStorage.setItem('agility_drill_config', JSON.stringify(drillConfig));
    router.push('/agility/drill/active');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {!user && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              <strong>Not signed in:</strong> Your drill results won&apos;t appear on the leaderboard.{' '}
              <Link href="/agility/auth/signin" className="font-semibold underline hover:text-amber-900">
                Sign in
              </Link>
            </p>
          </div>
        )}

        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Configure Your Drill</h1>
          <p className="text-sm sm:text-base text-gray-600">Select a course and customize your training session</p>
        </header>

        {/* Mobile: Single column, Desktop: Two columns */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Course Selection */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Select Course</h2>
            <div className="space-y-3">
              {courses.map(course => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`w-full p-4 rounded-xl border-2 transition text-left ${
                    selectedCourse?.id === course.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{course.name}</h3>
                        <p className="text-gray-600 text-sm">{course.cone_count} cones · {course.description}</p>
                      </div>
                      {course.is_official && (
                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full shrink-0">
                          RANKED
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <CourseMap course={course} compact className="w-48 h-48" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Configuration */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Drill Settings</h2>
            <div className="space-y-4 bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sets</label>
                <input
                  type="number" min="1" max="10" value={config.sets}
                  onChange={(e) => setConfig({ ...config, sets: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-base text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reps per Set</label>
                <input
                  type="number" min="1" max="50" value={config.repsPerSet}
                  onChange={(e) => setConfig({ ...config, repsPerSet: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-base text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rest Between Sets (seconds)</label>
                <input
                  type="number" min="10" max="300" step="5" value={config.restBetweenSets}
                  onChange={(e) => setConfig({ ...config, restBetweenSets: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-base text-gray-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Delay (s)</label>
                  <input
                    type="number" min="1" max="10" value={config.minStartDelay}
                    onChange={(e) => setConfig({ ...config, minStartDelay: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-base text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Delay (s)</label>
                  <input
                    type="number" min="1" max="10" value={config.maxStartDelay}
                    onChange={(e) => setConfig({ ...config, maxStartDelay: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none text-base text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 sm:p-6 bg-indigo-50 border-2 border-indigo-200 rounded-xl">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Drill Summary</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><span className="text-gray-600">Total reps:</span> <span className="font-bold">{config.sets * config.repsPerSet}</span></li>
                <li><span className="text-gray-600">Estimated time:</span> <span className="font-bold">{Math.round((config.sets * config.repsPerSet * 10) / 60 + (config.sets - 1) * config.restBetweenSets / 60)} minutes</span></li>
                {selectedCourse?.is_official && (<li className="text-indigo-600 font-bold">✓ Ranked on leaderboard</li>)}
              </ul>
            </div>

            <button onClick={startDrill} disabled={!selectedCourse}
              className="w-full mt-6 py-4 bg-indigo-600 text-white text-lg sm:text-xl font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg active:scale-95">
              START DRILL
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}