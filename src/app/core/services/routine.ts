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

  removeExerciseFromDay(
    routineId: string,
    dayId: string,
    exerciseId: string
  ): void {

    this.routinesSignal.update(routines =>
      routines.map(routine => {

        if (routine.id !== routineId) {
          return routine;
        }

        return {
          ...routine,

          days: routine.days.map(day => {

            if (day.id !== dayId) {
              return day;
            }

            return {
              ...day,
              exerciseIds: day.exerciseIds.filter(
                id => id !== exerciseId
              )
            };
          })
        };
      })
    );

    this.saveRoutines();
  }


  moveExercise(
    routineId: string,
    dayId: string,
    exerciseId: string,
    direction: 'up' | 'down'
  ): void {

    this.routinesSignal.update(routines =>
      routines.map(routine => {

        if (routine.id !== routineId) {
          return routine;
        }

        return {
          ...routine,

          days: routine.days.map(day => {

            if (day.id !== dayId) {
              return day;
            }

            const exerciseIds = [...day.exerciseIds];

            const currentIndex =
              exerciseIds.indexOf(exerciseId);

            if (currentIndex === -1) {
              return day;
            }

            const newIndex =
              direction === 'up'
                ? currentIndex - 1
                : currentIndex + 1;

            if (
              newIndex < 0 ||
              newIndex >= exerciseIds.length
            ) {
              return day;
            }

            [
              exerciseIds[currentIndex],
              exerciseIds[newIndex]
            ] = [
                exerciseIds[newIndex],
                exerciseIds[currentIndex]
              ];

            return {
              ...day,
              exerciseIds
            };
          })
        };
      })
    );

    this.saveRoutines();
  }

  renameRoutineDay(
    routineId: string,
    dayId: string,
    newName: string
  ): void {
  
    const name = newName.trim();
  
    if (!name) {
      return;
    }
  
    this.routinesSignal.update(routines =>
      routines.map(routine => {
  
        if (routine.id !== routineId) {
          return routine;
        }
  
        return {
          ...routine,
  
          days: routine.days.map(day =>
            day.id === dayId
              ? {
                  ...day,
                  name
                }
              : day
          )
        };
      })
    );
  
    this.saveRoutines();
  }

  removeRoutineDay(
    routineId: string,
    dayId: string
  ): void {
  
    this.routinesSignal.update(routines =>
      routines.map(routine => {
  
        if (routine.id !== routineId) {
          return routine;
        }
  
        return {
          ...routine,
          days: routine.days.filter(
            day => day.id !== dayId
          )
        };
      })
    );
  
    this.saveRoutines();
  }
  
  
  moveRoutineDay(
    routineId: string,
    dayId: string,
    direction: 'up' | 'down'
  ): void {
  
    this.routinesSignal.update(routines =>
      routines.map(routine => {
  
        if (routine.id !== routineId) {
          return routine;
        }
  
        const days = [...routine.days];
  
        const currentIndex =
          days.findIndex(day => day.id === dayId);
  
        if (currentIndex === -1) {
          return routine;
        }
  
        const newIndex =
          direction === 'up'
            ? currentIndex - 1
            : currentIndex + 1;
  
        if (
          newIndex < 0 ||
          newIndex >= days.length
        ) {
          return routine;
        }
  
        [
          days[currentIndex],
          days[newIndex]
        ] = [
          days[newIndex],
          days[currentIndex]
        ];
  
        return {
          ...routine,
          days
        };
      })
    );
  
    this.saveRoutines();
  }

}