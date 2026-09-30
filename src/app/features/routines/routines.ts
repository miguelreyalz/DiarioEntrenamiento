import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RoutineService } from '../../core/services/routine';

@Component({
  selector: 'app-routines',
  imports: [RouterLink],
  templateUrl: './routines.html',
  styleUrl: './routines.css'
})
export class Routines {

  constructor(
    public readonly routineService: RoutineService
  ) {}


  readonly activeRoutine = computed(() =>
    this.routineService.routines().find(
      routine => routine.status === 'active'
    )
  );


  readonly archivedRoutines = computed(() =>
    this.routineService.routines().filter(
      routine => routine.status === 'archived'
    )
  );


  deleteRoutine(id: string, name: string): void {

    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmed) {
      return;
    }

    this.routineService.deleteRoutine(id);
  }


  removeDay(
    routineId: string,
    dayId: string,
    dayName: string
  ): void {

    const confirmed = window.confirm(
      `¿Eliminar "${dayName}" de esta rutina?`
    );

    if (!confirmed) {
      return;
    }

    this.routineService.removeRoutineDay(
      routineId,
      dayId
    );
  }


  moveDayUp(
    routineId: string,
    dayId: string
  ): void {

    this.routineService.moveRoutineDay(
      routineId,
      dayId,
      'up'
    );
  }


  moveDayDown(
    routineId: string,
    dayId: string
  ): void {

    this.routineService.moveRoutineDay(
      routineId,
      dayId,
      'down'
    );
  }
}