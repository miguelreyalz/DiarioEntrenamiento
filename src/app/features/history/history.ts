import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { WorkoutService } from '../../core/services/workout';

@Component({
  selector: 'app-history',
  imports: [RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.css'
})
export class History {

  readonly completedSessions = computed(() =>
    this.workoutService.sessions()
      .filter(session => session.finishedAt !== null)
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() -
          new Date(a.startedAt).getTime()
      )
  );

  constructor(
    private readonly workoutService: WorkoutService
  ) {}

  formatDate(date: string): string {

    return new Intl.DateTimeFormat(
      'es-ES',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(new Date(date));
  }
}