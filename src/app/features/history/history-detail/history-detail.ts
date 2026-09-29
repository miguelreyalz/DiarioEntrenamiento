import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WorkoutService } from '../../../core/services/workout';
import { ExerciseService } from '../../../core/services/exercise';

@Component({
  selector: 'app-history-detail',
  imports: [],
  templateUrl: './history-detail.html',
  styleUrl: './history-detail.css'
})
export class HistoryDetail {

  readonly sessionId: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly workoutService: WorkoutService,
    public readonly exerciseService: ExerciseService
  ) {
    this.sessionId =
      this.route.snapshot.paramMap.get('sessionId') ?? '';

    if (!this.session) {
      this.router.navigate(['/history']);
    }
  }

  get session() {
    return this.workoutService.getSessionById(
      this.sessionId
    );
  }

  goBack(): void {
    this.router.navigate(['/history']);
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat(
      'es-ES',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    ).format(new Date(date));
  }
}