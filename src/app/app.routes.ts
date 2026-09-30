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
import { ArchivedRoutineDetail } from './features/routines/archived-routine-detail/archived-routine-detail';
import { Login } from './features/login/login';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  // =========================
  // LOGIN - RUTA PÚBLICA
  // =========================

  {
    path: 'login',
    component: Login
  },


  // =========================
  // RUTAS PROTEGIDAS
  // =========================

  {
    path: '',
    component: Home,
    canActivate: [authGuard]
  },

  {
    path: 'routines',
    component: Routines,
    canActivate: [authGuard]
  },

  {
    path: 'history',
    component: History,
    canActivate: [authGuard]
  },

  {
    path: 'progress',
    component: Progress,
    canActivate: [authGuard]
  },

  {
    path: 'routines/new',
    component: CreateRoutine,
    canActivate: [authGuard]
  },

  {
    path: 'routines/:routineId/days/new',
    component: AddRoutineDay,
    canActivate: [authGuard]
  },

  {
    path: 'routines/:routineId/days/:dayId',
    component: RoutineDayDetail,
    canActivate: [authGuard]
  },

  {
    path: 'routines/:routineId/days/:dayId/exercises/new',
    component: AddExercise,
    canActivate: [authGuard]
  },

  {
    path: 'workout/:sessionId',
    component: WorkoutSession,
    canActivate: [authGuard]
  },

  {
    path: 'history/:sessionId',
    component: HistoryDetail,
    canActivate: [authGuard]
  },

  {
    path: 'routines/archived/:routineId',
    component: ArchivedRoutineDetail,
    canActivate: [authGuard]
  },


  {
    path: '**',
    redirectTo: ''
  }

];