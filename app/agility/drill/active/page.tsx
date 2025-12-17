/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { agilityStorage } from '@/lib/db/agility-storage';
import { syncWorker } from '@/lib/sync/agility-sync-worker';
import type { DrillConfig, DrillState, PendingSession } from '@/lib/types/agility.types';

export default function ActiveDrillPage() {
  const router = useRouter();
  const [config] = useState<DrillConfig | null>(() => {
    if (typeof window === 'undefined') return null;
    const configJson = sessionStorage.getItem('agility_drill_config');
    if (!configJson) return null;
    return JSON.parse(configJson);
  });
  
  const [state, setState] = useState<DrillState>({
    phase: 'ready',
    currentSet: 1,
    currentRep: 1,
    targetCone: null,
    startTime: null,
    reps: [],
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const startDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const restTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [restCountdown, setRestCountdown] = useState(0);

  useEffect(() => {
    // Redirect if no config
    if (!config) {
      router.push('/agility/drill/setup');
      return;
    }

    // Initialize Web Audio API
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    return () => {
      if (startDelayTimerRef.current) clearTimeout(startDelayTimerRef.current);
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [config, router]);

  const playTone = useCallback((frequency: number, duration: number) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sawtooth';

    gainNode.gain.value = 0.3;

    const now = ctx.currentTime;
    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
  }, []);

  // const speakCone = useCallback((coneNumber: number) => {
  //   // Use Web Speech API (requires internet on some devices)
  //   // For production, replace with pre-recorded audio files
  //   const utterance = new SpeechSynthesisUtterance(`Cone ${coneNumber}`);
  //   utterance.rate = 1.3;
  //   utterance.volume = 1.0;
  //   window.speechSynthesis.speak(utterance);
  // }, []);

  const speakCone = useCallback((coneNumber: number) => {
    // Play pre-recorded audio
    const audio = new Audio(`/audio/cone-${coneNumber}.mp3`);
    audio.volume = 1.0;
    audio.play().catch(error => {
      console.error('Audio playback failed:', error);
    });
  }, []);

  const handleReady = useCallback(() => {
    if (!config || state.phase !== 'ready') return;

    setState(prev => ({ ...prev, phase: 'waiting' }));

    // Random delay before "GO"
    const delay = Math.random() * 
      (config.maxStartDelay - config.minStartDelay) + 
      config.minStartDelay;

    startDelayTimerRef.current = setTimeout(() => {
      // Pick random cone
      const targetCone = Math.floor(Math.random() * config.course.cone_count) + 1;
      
      // Play tone + speak
      playTone(2500, 200);
      speakCone(targetCone);

      setState(prev => ({
        ...prev,
        phase: 'go',
        targetCone,
        startTime: Date.now(),
      }));
    }, delay * 1000);
  }, [config, state.phase, playTone, speakCone]);

  const startRestTimer = useCallback(() => {
    if (!config) return;

    setRestCountdown(config.restBetweenSets);
    
    restTimerRef.current = setInterval(() => {
      setRestCountdown(prev => {
        if (prev <= 1) {
          // Rest complete
          if (restTimerRef.current) clearInterval(restTimerRef.current);
          
          setState(prevState => ({
            ...prevState,
            phase: 'ready',
            currentSet: prevState.currentSet + 1,
            currentRep: 1,
          }));
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [config]);

  const completeDrill = useCallback(async (reps: any[]) => {
    if (!config) return;

    const totalTime = reps[reps.length - 1].sprint_time_ms + 
      reps[reps.length - 1].start_delay_ms;

    const pendingSession: PendingSession = {
      local_id: crypto.randomUUID(),
      user_id: null, // TODO: Get from auth
      course_id: config.course.id,
      task_id: config.linkToTask || null,
      goal_id: config.linkToGoal || null,
      sets: config.sets,
      reps_per_set: config.repsPerSet,
      rest_between_sets: config.restBetweenSets,
      min_start_delay: config.minStartDelay,
      max_start_delay: config.maxStartDelay,
      total_time_ms: totalTime,
      total_reps_completed: reps.length,
      is_ranked: config.course.is_official,
      completed_at: new Date().toISOString(),
      notes: null,
      rpe: null,
      shared_count: 0,
      reps,
      avg_sprint_time_ms: null,
      sprint_variance: null
    };

    // Save to IndexedDB
    try {
      await agilityStorage.init(); // Ensure initialized
      await agilityStorage.queueSession(pendingSession);
      
      // Trigger sync
      syncWorker.syncNow();
    } catch (error) {
      console.error('Failed to queue session:', error);
      // Continue to victory card anyway
    }

    // Navigate to victory card
    sessionStorage.setItem('agility_completed_session', JSON.stringify(pendingSession));
    router.push('/agility/drill/complete');
  }, [config, router]);

  const handleReturn = useCallback(() => {
    if (!config || state.phase !== 'go' || !state.startTime || !state.targetCone) return;

    const sprintTime = Date.now() - state.startTime;
    const startDelay = startDelayTimerRef.current ? config.minStartDelay * 1000 : 0;

    // Minimum possible time check (prevent accidental early press)
    const distance = config.course.cone_positions.find(p => p.number === state.targetCone)?.distance || 10;
    const minPossibleTime = (distance / 12) * 1000; // 12 m/s = world-class

    if (sprintTime < minPossibleTime) {
      // Too early - vibrate and ignore
      if (navigator.vibrate) navigator.vibrate(100);
      return;
    }

    // Record rep
    const rep = {
      rep_number: state.currentRep,
      set_number: state.currentSet,
      target_cone: state.targetCone,
      start_delay_ms: startDelay,
      sprint_time_ms: sprintTime,
      reaction_quality: null as any,
    };

    const newReps = [...state.reps, rep];

    // Check if set complete
    const isSetComplete = state.currentRep === config.repsPerSet;
    const isDrillComplete = isSetComplete && state.currentSet === config.sets;

    if (isDrillComplete) {
      // Drill finished
      completeDrill(newReps);
    } else if (isSetComplete) {
      // Rest between sets
      setState(prev => ({
        ...prev,
        phase: 'rest',
        reps: newReps,
      }));
      startRestTimer();
    } else {
      // Next rep
      setState(prev => ({
        ...prev,
        phase: 'ready',
        currentRep: prev.currentRep + 1,
        targetCone: null,
        startTime: null,
        reps: newReps,
      }));
    }
  }, [completeDrill, config, startRestTimer, state.currentRep, state.currentSet, state.phase, state.reps, state.startTime, state.targetCone]);

  

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin h-12 w-12 border-4 border-lime-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-6 border-b-2 border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-lime-400">
              {config.course.name}
            </h1>
            <p className="text-gray-400">
              Set {state.currentSet}/{config.sets} · Rep {state.currentRep}/{config.repsPerSet}
            </p>
          </div>
          <button
            onClick={() => router.push('/agility/drill/setup')}
            className="px-4 py-2 text-sm border-2 border-gray-700 rounded-lg hover:border-gray-600"
          >
            EXIT
          </button>
        </div>
      </header>

      {/* Main Drill Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {state.phase === 'ready' && (
          <div className="text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-3xl font-bold mb-2">Ready?</h2>
              <p className="text-gray-400">Press START when you&apos;re at the center</p>
            </div>
            <button
              onClick={handleReady}
              className="px-12 py-6 bg-lime-400 text-black text-3xl font-bold rounded-xl hover:bg-lime-300 transition"
            >
              START
            </button>
          </div>
        )}

        {state.phase === 'waiting' && (
          <div className="text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4 animate-pulse">👂</div>
              <h2 className="text-3xl font-bold mb-2 text-yellow-400">
                Wait for signal...
              </h2>
              <p className="text-gray-400">Stay focused</p>
            </div>
          </div>
        )}

        {state.phase === 'go' && state.targetCone && (
          <div className="text-center">
            <div className="mb-8">
              <div className="text-9xl font-bold text-lime-400 mb-4">
                {state.targetCone}
              </div>
              <h2 className="text-4xl font-bold text-lime-400 mb-4">
                CONE {state.targetCone}
              </h2>
              <p className="text-gray-400 text-xl">Sprint! Press RETURN when back</p>
            </div>
            <button
              onClick={handleReturn}
              className="px-12 py-6 bg-lime-400 text-black text-3xl font-bold rounded-xl hover:bg-lime-300 transition animate-pulse"
            >
              RETURN
            </button>
          </div>
        )}

        {state.phase === 'rest' && (
          <div className="text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">😮‍💨</div>
              <h2 className="text-3xl font-bold mb-2 text-red-400">Rest</h2>
              <div className="text-8xl font-bold text-red-400 mb-4">
                {restCountdown}
              </div>
              <p className="text-gray-400">Next set starts automatically</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <footer className="p-6 border-t-2 border-gray-800">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-lime-400">
              {state.reps.length}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-lime-400">
              {state.reps.length > 0 
                ? (state.reps.reduce((sum, r) => sum + r.sprint_time_ms, 0) / state.reps.length / 1000).toFixed(1)
                : '0.0'
              }s
            </div>
            <div className="text-sm text-gray-400">Avg Sprint</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-lime-400">
              {config.sets * config.repsPerSet - state.reps.length}
            </div>
            <div className="text-sm text-gray-400">Remaining</div>
          </div>
        </div>
      </footer>
    </div>
  );
}