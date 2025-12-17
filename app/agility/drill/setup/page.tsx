'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { agilityStorage } from '@/lib/db/agility-storage';
import type { AgilityCourse, DrillConfig } from '@/lib/types/agility.types';
import { useRouter } from 'next/navigation';

export default function DrillSetupPage() {
  const router = useRouter();
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
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      // Try IndexedDB cache first
      const cached = await agilityStorage.getCachedCourses();
      
      if (cached.length > 0) {
        setCourses(cached);
        setSelectedCourse(cached.find(c => c.is_official) || cached[0]);
        setLoading(false);
      }

      // Fetch fresh data from Supabase
      const supabase = createClient();
      const { data, error } = await supabase
        .from('agility_courses')
        .select('*')
        .order('is_official', { ascending: false });

      if (error) throw error;

      if (data) {
        setCourses(data);
        await agilityStorage.cacheCourses(data);
        
        if (cached.length === 0) {
          setSelectedCourse(data.find(c => c.is_official) || data[0]);
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

    // Store in sessionStorage for drill page
    sessionStorage.setItem('agility_drill_config', JSON.stringify(drillConfig));
    router.push('/agility/drill/active');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-lime-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-5xl font-bold text-lime-400 mb-2">
            AGILITY ENGINE
          </h1>
          <p className="text-gray-400">Configure your reaction drill</p>
        </header>

        {/* Course Selection */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-lime-400 mb-4">
            Select Course
          </h2>
          
          <div className="space-y-3">
            {courses.map(course => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`w-full p-4 rounded-xl border-2 transition text-left ${
                  selectedCourse?.id === course.id
                    ? 'border-lime-400 bg-lime-400/10'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {course.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {course.cone_count} cones · {course.description}
                    </p>
                  </div>
                  {course.is_official && (
                    <span className="px-3 py-1 bg-lime-400 text-black text-xs font-bold rounded-full">
                      RANKED
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Drill Configuration */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-lime-400 mb-4">
            Configure Drill
          </h2>

          <div className="space-y-4">
            {/* Sets */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Sets
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.sets}
                onChange={(e) => setConfig({ ...config, sets: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-lime-400 focus:outline-none"
              />
            </div>

            {/* Reps per Set */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Reps per Set
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={config.repsPerSet}
                onChange={(e) => setConfig({ ...config, repsPerSet: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-lime-400 focus:outline-none"
              />
            </div>

            {/* Rest Between Sets */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Rest Between Sets (seconds)
              </label>
              <input
                type="number"
                min="10"
                max="300"
                step="5"
                value={config.restBetweenSets}
                onChange={(e) => setConfig({ ...config, restBetweenSets: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-lime-400 focus:outline-none"
              />
            </div>

            {/* Start Delay Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Min Start Delay (s)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.minStartDelay}
                  onChange={(e) => setConfig({ ...config, minStartDelay: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-lime-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Max Start Delay (s)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.maxStartDelay}
                  onChange={(e) => setConfig({ ...config, maxStartDelay: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-lime-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-8 p-6 bg-lime-400/10 border-2 border-lime-400 rounded-xl">
          <h3 className="text-lg font-bold mb-3">Drill Summary</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="text-gray-400">Total reps:</span>{' '}
              <span className="font-bold">{config.sets × config.repsPerSet}</span>
            </li>
            <li>
              <span className="text-gray-400">Estimated time:</span>{' '}
              <span className="font-bold">
                {Math.round(
                  (config.sets * config.repsPerSet * 10) / 60 + 
                  (config.sets - 1) * config.restBetweenSets / 60
                )} minutes
              </span>
            </li>
            <li>
              <span className="text-gray-400">Course:</span>{' '}
              <span className="font-bold">{selectedCourse?.name}</span>
            </li>
            {selectedCourse?.is_official && (
              <li className="text-lime-400 font-bold">
                ✓ This drill will be ranked on leaderboard
              </li>
            )}
          </ul>
        </section>

        {/* Start Button */}
        <button
          onClick={startDrill}
          disabled={!selectedCourse}
          className="w-full py-6 bg-lime-400 text-black text-2xl font-bold rounded-xl hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          START DRILL
        </button>
      </div>
    </div>
  );
}
