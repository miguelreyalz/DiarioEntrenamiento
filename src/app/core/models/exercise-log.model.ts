import { WorkoutSet } from './workout-set.model';

export interface ExerciseLog {
  id: string;

  exerciseId: string;
  exerciseName: string;

  order: number;

  sets: WorkoutSet[];
}