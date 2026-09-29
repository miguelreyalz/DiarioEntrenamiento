import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { RoutineService } from '../../core/services/routine';
import { WorkoutService } from '../../core/services/workout';

import { RoutineDay } from '../../core/models/routine-day.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  readonly activeRoutine = computed(() =>
    this.routineService.routines().find(
      routine => routine.status === 'active'
    )
  );


  readonly activeSession = computed(() =>
    this.workoutService.sessions().find(
      session => session.finishedAt === null
    )
  );


  constructor(
    private readonly routineService: RoutineService,
    private readonly workoutService: WorkoutService,
    private readonly router: Router
  ) {}


  startWorkout(day: RoutineDay): void {

    /*
     * Si ya existe un entrenamiento activo,
     * continuamos ese entrenamiento.
     */
    const activeSession = this.activeSession();

    if (activeSession) {

      this.router.navigate([
        '/workout',
        activeSession.id
      ]);

      return;
    }


    const routine = this.activeRoutine();

    if (!routine) {
      return;
    }


    const session =
      this.workoutService.startWorkout(
        routine,
        day
      );


    this.router.navigate([
      '/workout',
      session.id
    ]);
  }


  continueWorkout(): void {

    const session = this.activeSession();

    if (!session) {
      return;
    }

    this.router.navigate([
      '/workout',
      session.id
    ]);
  }


  discardWorkout(): void {

    const session = this.activeSession();

    if (!session) {
      return;
    }

    const confirmed = window.confirm(
      '¿Quieres descartar este entrenamiento? Se perderán todas las series registradas.'
    );

    if (!confirmed) {
      return;
    }

    this.workoutService.deleteSession(
      session.id
    );
  }
}