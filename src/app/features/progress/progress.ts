import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ExerciseService } from '../../core/services/exercise';
import { WorkoutService } from '../../core/services/workout';

@Component({
  selector: 'app-progress',
  imports: [FormsModule],
  templateUrl: './progress.html',
  styleUrl: './progress.css'
})
export class Progress {

  readonly selectedExerciseId = signal('');

  readonly exerciseHistory = computed(() => {

    const exerciseId = this.selectedExerciseId();

    if (!exerciseId) {
      return [];
    }

    return this.workoutService.sessions()
      .filter(session => session.finishedAt !== null)
      .filter(session =>
        session.exercises.some(
          exercise =>
            exercise.exerciseId === exerciseId
        )
      )
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() -
          new Date(a.startedAt).getTime()
      )
      .map(session => ({
        session,

        exerciseLog: session.exercises.find(
          exercise =>
            exercise.exerciseId === exerciseId
        )!
      }));
  });


  readonly selectedExercise = computed(() => {

    const id = this.selectedExerciseId();

    if (!id) {
      return undefined;
    }

    return this.exerciseService.getExerciseById(id);
  });


  constructor(
    public readonly exerciseService: ExerciseService,
    private readonly workoutService: WorkoutService
  ) {}


  selectExercise(id: string): void {
    this.selectedExerciseId.set(id);
  }


  formatDate(date: string): string {

    return new Intl.DateTimeFormat(
      'es-ES',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    ).format(new Date(date));
  }
}