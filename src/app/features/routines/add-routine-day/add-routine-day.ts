import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RoutineService } from '../../../core/services/routine';
import { RoutineDay } from '../../../core/models/routine-day.model';

@Component({
  selector: 'app-add-routine-day',
  imports: [FormsModule],
  templateUrl: './add-routine-day.html',
  styleUrl: './add-routine-day.css'
})
export class AddRoutineDay {

  dayName = '';

  private readonly routineId: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly routineService: RoutineService
  ) {
    this.routineId =
      this.route.snapshot.paramMap.get('routineId') ?? '';
  }

  createDay(): void {
    const name = this.dayName.trim();

    if (!name || !this.routineId) {
      return;
    }

    const routine =
      this.routineService.getRoutineById(this.routineId);

    if (!routine) {
      return;
    }

    const day: RoutineDay = {
      id: crypto.randomUUID(),
      name,
      exerciseIds: [],
      order: routine.days.length + 1
    };

    this.routineService.addDayToRoutine(
      this.routineId,
      day
    );

    this.router.navigate(['/routines']);
  }

  cancel(): void {
    this.router.navigate(['/routines']);
  }
}