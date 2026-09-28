import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ExerciseService } from '../../../core/services/exercise';
import { RoutineService } from '../../../core/services/routine';

import { Exercise } from '../../../core/models/exercise.model';

@Component({
  selector: 'app-add-exercise',
  imports: [FormsModule],
  templateUrl: './add-exercise.html',
  styleUrl: './add-exercise.css'
})
export class AddExercise {

  readonly routineId: string;
  readonly dayId: string;

  readonly search = signal('');

  showCreateForm = false;

  exerciseName = '';
  muscleGroup = '';

  readonly filteredExercises = computed(() => {

    const search =
      this.search().trim().toLowerCase();

    const exercises =
      this.exerciseService.exercises();

    if (!search) {
      return exercises;
    }

    return exercises.filter(exercise =>
      exercise.name
        .toLowerCase()
        .includes(search) ||

      exercise.muscleGroup
        .toLowerCase()
        .includes(search)
    );
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly exerciseService: ExerciseService,
    private readonly routineService: RoutineService
  ) {
    this.routineId =
      this.route.snapshot.paramMap.get('routineId') ?? '';

    this.dayId =
      this.route.snapshot.paramMap.get('dayId') ?? '';
  }

  selectExercise(exercise: Exercise): void {

    this.routineService.addExerciseToDay(
      this.routineId,
      this.dayId,
      exercise.id
    );

    this.goBack();
  }

  createExercise(): void {

    const name = this.exerciseName.trim();
    const muscleGroup = this.muscleGroup.trim();

    if (!name || !muscleGroup) {
      return;
    }

    const exercise =
      this.exerciseService.createExercise(
        name,
        muscleGroup
      );

    this.selectExercise(exercise);
  }

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  cancelCreate(): void {
    this.showCreateForm = false;

    this.exerciseName = '';
    this.muscleGroup = '';
  }

  goBack(): void {
    this.router.navigate([
      '/routines',
      this.routineId,
      'days',
      this.dayId
    ]);
  }
}