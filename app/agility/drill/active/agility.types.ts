import type { DrillConfig } from '@/lib/types/agility.types';

export function isDrillConfig(obj: unknown): obj is DrillConfig {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const config = obj as DrillConfig;

  return (
    typeof config.course === 'object' &&
    typeof config.course.name === 'string' &&
    typeof config.course.cone_count === 'number' &&
    typeof config.sets === 'number' &&
    typeof config.repsPerSet === 'number' &&
    typeof config.restBetweenSets === 'number' &&
    typeof config.minStartDelay === 'number' &&
    typeof config.maxStartDelay === 'number' &&
    Array.isArray(config.course.cone_positions)
  );
}