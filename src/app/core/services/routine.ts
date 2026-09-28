import { Injectable, signal } from '@angular/core';
import { Routine } from '../models/routine.model';
import { RoutineDay } from '../models/routine-day.model';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {

  private readonly STORAGE_KEY = 'gym-diary-routines';

  private readonly routinesSignal = signal<Routine[]>(
    this.loadRoutines()
  );

  readonly routines = this.routinesSignal.asReadonly();

  getActiveRoutine(): Routine | undefined {
    return this.routinesSignal().find(
      routine => routine.status === 'active'
    );
  }

  getArchivedRoutines(): Routine[] {
    return this.routinesSignal().filter(
      routine => routine.status === 'archived'
    );
  }

  getRoutineById(id: string): Routine | undefined {
    return this.routinesSignal().find(
      routine => routine.id === id
    );
  }

  createRoutine(routine: Routine): void {
    const routines = this.routinesSignal();

    this.routinesSignal.set([
      ...routines,
      routine
    ]);

    this.saveRoutines();
  }

  deleteRoutine(id: string): void {
    const updatedRoutines = this.routinesSignal().filter(
      routine => routine.id !== id
    );

    this.routinesSignal.set(updatedRoutines);
    this.saveRoutines();
  }

  activateRoutine(id: string): void {
    const today = new Date().toISOString();

    const updatedRoutines = this.routinesSignal().map(routine => {

      if (routine.id === id) {
        return {
          ...routine,
          status: 'active' as const,
          startDate: routine.startDate || today,
          endDate: null
        };
      }

      if (routine.status === 'active') {
        return {
          ...routine,
          status: 'archived' as const,
          endDate: today
        };
      }

      return routine;
    });

    this.routinesSignal.set(updatedRoutines);
    this.saveRoutines();
  }

  private saveRoutines(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.routinesSignal())
    );
  }

  private loadRoutines(): Routine[] {
    const storedRoutines = localStorage.getItem(
      this.STORAGE_KEY
    );

    if (!storedRoutines) {
      return [];
    }

    try {
      return JSON.parse(storedRoutines) as Routine[];
    } catch {
      return [];
    }
  }

  addDayToRoutine(routineId: string, day: RoutineDay): void {
    const updatedRoutines = this.routinesSignal().map(routine => {
      if (routine.id !== routineId) {
        return routine;
      }

      return {
        ...routine,
        days: [
          ...routine.days,
          day
        ]
      };
    });

    this.routinesSignal.set(updatedRoutines);
    this.saveRoutines();
  }

  getRoutineDay(routineId: string, dayId: string): RoutineDay | undefined {
    const routine = this.getRoutineById(routineId);

    return routine?.days.find(
      day => day.id === dayId
    );
  }

  addExerciseToDay(
    routineId: string,
    dayId: string,
    exerciseId: string
  ): void {

    const updatedRoutines = this.routinesSignal().map(routine => {

      if (routine.id !== routineId) {
        return routine;
      }

      return {
        ...routine,

        days: routine.days.map(day => {

          if (day.id !== dayId) {
            return day;
          }

          if (day.exerciseIds.includes(exerciseId)) {
            return day;
          }

          return {
            ...day,
            exerciseIds: [
              ...day.exerciseIds,
              exerciseId
            ]
          };
        })
      };
    });

    this.routinesSignal.set(updatedRoutines);
    this.saveRoutines();
  }

}