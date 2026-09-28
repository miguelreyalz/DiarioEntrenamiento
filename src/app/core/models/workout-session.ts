import { ExerciseLog } from './exercise-log';

export interface WorkoutSession {
  id: string;

  routineId: string;
  routineDayId: string;

  routineName: string;
  dayName: string;

  startedAt: string;
  finishedAt: string | null;

  exercises: ExerciseLog[];
}