import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RoutineService } from '../../../core/services/routine';
import { ExerciseService } from '../../../core/services/exercise';

import { Routine } from '../../../core/models/routine.model';
import { RoutineDay } from '../../../core/models/routine-day.model';

@Component({
  selector: 'app-routine-day-detail',
  imports: [RouterLink],
  templateUrl: './routine-day-detail.html',
  styleUrl: './routine-day-detail.css'
})
export class RoutineDayDetail {

  routine?: Routine;
  day?: RoutineDay;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly routineService: RoutineService,
    public readonly exerciseService: ExerciseService
  ) {
    const routineId =
      this.route.snapshot.paramMap.get('routineId');

    const dayId =
      this.route.snapshot.paramMap.get('dayId');

    if (!routineId || !dayId) {
      this.router.navigate(['/routines']);
      return;
    }

    this.routine =
      this.routineService.getRoutineById(routineId);

    this.day =
      this.routineService.getRoutineDay(routineId, dayId);

    if (!this.routine || !this.day) {
      this.router.navigate(['/routines']);
    }
  }

  goBack(): void {
    this.router.navigate(['/routines']);
  }
}