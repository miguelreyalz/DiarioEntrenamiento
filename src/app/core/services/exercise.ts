import { Injectable, signal } from '@angular/core';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  private readonly STORAGE_KEY = 'gym-diary-exercises';

  private readonly exercisesSignal = signal<Exercise[]>(
    this.loadExercises()
  );

  readonly exercises = this.exercisesSignal.asReadonly();

  createExercise(name: string, muscleGroup: string): Exercise {
    const exercise: Exercise = {
      id: crypto.randomUUID(),
      name: name.trim(),
      muscleGroup: muscleGroup.trim()
    };

    this.exercisesSignal.update(exercises => [
      ...exercises,
      exercise
    ]);

    this.saveExercises();

    return exercise;
  }

  getExerciseById(id: string): Exercise | undefined {
    return this.exercisesSignal().find(
      exercise => exercise.id === id
    );
  }

  private saveExercises(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.exercisesSignal())
    );
  }

  private loadExercises(): Exercise[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as Exercise[];
    } catch {
      return [];
    }
  }
}