import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WorkoutService } from '../../../core/services/workout';
import { ExerciseService } from '../../../core/services/exercise';

@Component({
  selector: 'app-workout-session',
  imports: [FormsModule],
  templateUrl: './workout-session.html',
  styleUrl: './workout-session.css'
})
export class WorkoutSession {

  readonly sessionId: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly workoutService: WorkoutService,
    public readonly exerciseService: ExerciseService
  ) {
    this.sessionId =
      this.route.snapshot.paramMap.get('sessionId') ?? '';

    if (!this.session) {
      this.router.navigate(['/']);
    }
  }

  get session() {
    return this.workoutService.getSessionById(
      this.sessionId
    );
  }


  addSet(exerciseId: string): void {
    this.workoutService.addSet(
      this.sessionId,
      exerciseId
    );
  }


  updateSet(
    exerciseId: string,
    setId: string,
    weight: number | null,
    reps: number | null
  ): void {

    this.workoutService.updateSet(
      this.sessionId,
      exerciseId,
      setId,
      weight,
      reps
    );
  }


  toggleCompleted(
    exerciseId: string,
    setId: string
  ): void {

    this.workoutService.toggleSetCompleted(
      this.sessionId,
      exerciseId,
      setId
    );
  }


  finishWorkout(): void {

    const session = this.session;

    if (!session) {
      return;
    }

    const hasIncompleteSets =
      session.exercises.some(exercise =>
        exercise.sets.some(set => !set.completed)
      );

    const message = hasIncompleteSets
      ? 'Hay series sin completar. ¿Quieres finalizar el entrenamiento igualmente? Las series no completadas no contarán en tu historial.'
      : '¿Quieres finalizar el entrenamiento?';

    const confirmed = window.confirm(message);

    if (!confirmed) {
      return;
    }

    this.workoutService.finishWorkout(
      this.sessionId
    );

    this.router.navigate(['/history']);
  }

  deleteSet(
    exerciseId: string,
    setId: string
  ): void {

    this.workoutService.deleteSet(
      this.sessionId,
      exerciseId,
      setId
    );
  }

  getPreviousLog(exerciseId: string) {
    return this.workoutService.getPreviousExerciseLog(
      exerciseId,
      this.sessionId
    );
  }


  exitWorkout(): void {
    this.router.navigate(['/']);
  }
}