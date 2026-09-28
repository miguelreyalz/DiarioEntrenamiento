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

  constructor(
    private readonly routineService: RoutineService,
    private readonly workoutService: WorkoutService,
    private readonly router: Router
  ) {}

  startWorkout(day: RoutineDay): void {

    const routine = this.activeRoutine();

    if (!routine) {
      return;
    }

    const session = this.workoutService.startWorkout(
      routine,
      day
    );

    this.router.navigate([
      '/workout',
      session.id
    ]);
  }
}