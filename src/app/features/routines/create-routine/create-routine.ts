import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RoutineService } from '../../../core/services/routine';
import { Routine } from '../../../core/models/routine.model';

@Component({
  selector: 'app-create-routine',
  imports: [FormsModule],
  templateUrl: './create-routine.html',
  styleUrl: './create-routine.css'
})
export class CreateRoutine {

  routineName = '';

  constructor(
    private readonly routineService: RoutineService,
    private readonly router: Router
  ) {}

  createRoutine(): void {

    const name = this.routineName.trim();

    if (!name) {
      return;
    }

    const routine: Routine = {
      id: crypto.randomUUID(),
      name,
      startDate: new Date().toISOString(),
      endDate: null,
      status: 'active',
      days: []
    };

    const activeRoutine =
      this.routineService.getActiveRoutine();

    if (activeRoutine) {
      this.routineService.createRoutine({
        ...routine,
        status: 'archived'
      });

      this.routineService.activateRoutine(routine.id);
    } else {
      this.routineService.createRoutine(routine);
    }

    this.router.navigate(['/routines']);
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}