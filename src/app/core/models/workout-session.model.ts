import { ExerciseLog } from './exercise-log.model';

export interface WorkoutSession {
  id: string;

  routineId: string;
  routineName: string;

  routineDayId: string;
  routineDayName: string;

  startedAt: string;
  finishedAt: string | null;

  exercises: ExerciseLog[];
}