import { RoutineDay } from './routine-day.model';

export type RoutineStatus = 'active' | 'archived';

export interface Routine {
  id: string;
  name: string;

  startDate: string;
  endDate: string | null;

  status: RoutineStatus;

  days: RoutineDay[];
}