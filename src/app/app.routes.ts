import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Routines } from './features/routines/routines';
import { History } from './features/history/history';
import { Progress } from './features/progress/progress';
import { CreateRoutine } from './features/routines/create-routine/create-routine';
import { AddRoutineDay } from './features/routines/add-routine-day/add-routine-day';
import { RoutineDayDetail } from './features/routines/routine-day-detail/routine-day-detail';
import { AddExercise } from './features/routines/add-exercise/add-exercise';
import { WorkoutSession } from './features/workout/workout-session/workout-session';
import { HistoryDetail } from './features/history/history-detail/history-detail';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'routines',
    component: Routines
  },
  {
    path: 'history',
    component: History
  },
  {
    path: 'progress',
    component: Progress
  },
  {
    path: 'routines/new',
    component: CreateRoutine
  },
  {
    path: 'routines/:routineId/days/new',
    component: AddRoutineDay
  },
  {
    path: 'routines/:routineId/days/:dayId',
    component: RoutineDayDetail
  },
  {
    path: 'routines/:routineId/days/:dayId/exercises/new',
    component: AddExercise
  },
  {
    path: 'workout/:sessionId',
    component: WorkoutSession
  },
  {
    path: 'history/:sessionId',
    component: HistoryDetail
  },
  {
    path: '**',
    redirectTo: ''
  }
];