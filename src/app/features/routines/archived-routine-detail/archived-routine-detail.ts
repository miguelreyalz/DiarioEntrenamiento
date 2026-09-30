import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RoutineService } from '../../../core/services/routine';
import { ExerciseService } from '../../../core/services/exercise';

import { Routine } from '../../../core/models/routine.model';

@Component({
  selector: 'app-archived-routine-detail',
  imports: [],
  templateUrl: './archived-routine-detail.html',
  styleUrl: './archived-routine-detail.css'
})
export class ArchivedRoutineDetail {

  routine?: Routine;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly routineService: RoutineService,
    public readonly exerciseService: ExerciseService
  ) {

    const routineId =
      this.route.snapshot.paramMap.get('routineId');

    if (!routineId) {
      this.router.navigate(['/routines']);
      return;
    }

    this.routine =
      this.routineService.getRoutineById(routineId);

    if (
      !this.routine ||
      this.routine.status !== 'archived'
    ) {
      this.router.navigate(['/routines']);
    }
  }


  goBack(): void {
    this.router.navigate(['/routines']);
  }
}