import { Injectable, signal } from '@angular/core';

import { WorkoutSession } from '../models/workout-session';
import { Routine } from '../models/routine.model';
import { RoutineDay } from '../models/routine-day.model';

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {

    private readonly STORAGE_KEY = 'gym-diary-workouts';

    private readonly sessionsSignal = signal<WorkoutSession[]>(
        this.loadSessions()
    );

    readonly sessions = this.sessionsSignal.asReadonly();


    startWorkout(
        routine: Routine,
        day: RoutineDay
    ): WorkoutSession {

        const sessionId = crypto.randomUUID();

        const session: WorkoutSession = {

            id: sessionId,

            routineId: routine.id,
            routineDayId: day.id,

            routineName: routine.name,
            dayName: day.name,

            startedAt: new Date().toISOString(),
            finishedAt: null,

            exercises: day.exerciseIds.map(exerciseId => {

                const previousLog =
                    this.getLastCompletedExerciseLog(exerciseId);

                const numberOfSets =
                    previousLog?.sets.filter(set => set.completed).length || 1;

                return {
                    exerciseId,

                    sets: Array.from(
                        { length: numberOfSets },
                        (_, index) => ({
                            id: crypto.randomUUID(),
                            setNumber: index + 1,
                            weight: null,
                            reps: null,
                            completed: false
                        })
                    )
                };

            })
        };

        this.sessionsSignal.update(sessions => [
            ...sessions,
            session
        ]);

        this.saveSessions();

        return session;
    }

    private getLastCompletedExerciseLog(exerciseId: string) {

        const previousSessions = this.sessionsSignal()
            .filter(session =>
                session.finishedAt !== null &&
                session.exercises.some(
                    exercise => exercise.exerciseId === exerciseId
                )
            )
            .sort(
                (a, b) =>
                    new Date(b.startedAt).getTime() -
                    new Date(a.startedAt).getTime()
            );

        if (previousSessions.length === 0) {
            return undefined;
        }

        return previousSessions[0].exercises.find(
            exercise => exercise.exerciseId === exerciseId
        );
    }


    getSessionById(id: string): WorkoutSession | undefined {
        return this.sessionsSignal().find(
            session => session.id === id
        );
    }


    private saveSessions(): void {
        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(this.sessionsSignal())
        );
    }


    private loadSessions(): WorkoutSession[] {

        const stored =
            localStorage.getItem(this.STORAGE_KEY);

        if (!stored) {
            return [];
        }

        try {
            return JSON.parse(stored) as WorkoutSession[];
        } catch {
            return [];
        }
    }

    addSet(sessionId: string, exerciseId: string): void {

        this.sessionsSignal.update(sessions =>
            sessions.map(session => {

                if (session.id !== sessionId) {
                    return session;
                }

                return {
                    ...session,

                    exercises: session.exercises.map(exercise => {

                        if (exercise.exerciseId !== exerciseId) {
                            return exercise;
                        }

                        return {
                            ...exercise,

                            sets: [
                                ...exercise.sets,
                                {
                                    id: crypto.randomUUID(),
                                    setNumber: exercise.sets.length + 1,
                                    weight: null,
                                    reps: null,
                                    completed: false
                                }
                            ]
                        };
                    })
                };
            })
        );

        this.saveSessions();
    }


    updateSet(
        sessionId: string,
        exerciseId: string,
        setId: string,
        weight: number | null,
        reps: number | null
    ): void {

        this.sessionsSignal.update(sessions =>
            sessions.map(session => {

                if (session.id !== sessionId) {
                    return session;
                }

                return {
                    ...session,

                    exercises: session.exercises.map(exercise => {

                        if (exercise.exerciseId !== exerciseId) {
                            return exercise;
                        }

                        return {
                            ...exercise,

                            sets: exercise.sets.map(set => {

                                if (set.id !== setId) {
                                    return set;
                                }

                                return {
                                    ...set,
                                    weight,
                                    reps
                                };
                            })
                        };
                    })
                };
            })
        );

        this.saveSessions();
    }


    toggleSetCompleted(
        sessionId: string,
        exerciseId: string,
        setId: string
    ): void {

        this.sessionsSignal.update(sessions =>
            sessions.map(session => {

                if (session.id !== sessionId) {
                    return session;
                }

                return {
                    ...session,

                    exercises: session.exercises.map(exercise => {

                        if (exercise.exerciseId !== exerciseId) {
                            return exercise;
                        }

                        return {
                            ...exercise,

                            sets: exercise.sets.map(set =>
                                set.id === setId
                                    ? {
                                        ...set,
                                        completed: !set.completed
                                    }
                                    : set
                            )
                        };
                    })
                };
            })
        );

        this.saveSessions();
    }


    finishWorkout(sessionId: string): void {

        this.sessionsSignal.update(sessions =>
            sessions.map(session =>
                session.id === sessionId
                    ? {
                        ...session,
                        finishedAt: new Date().toISOString()
                    }
                    : session
            )
        );

        this.saveSessions();
    }

    deleteSet(
        sessionId: string,
        exerciseId: string,
        setId: string
    ): void {

        this.sessionsSignal.update(sessions =>
            sessions.map(session => {

                if (session.id !== sessionId) {
                    return session;
                }

                return {
                    ...session,

                    exercises: session.exercises.map(exercise => {

                        if (exercise.exerciseId !== exerciseId) {
                            return exercise;
                        }

                        // Dejamos siempre al menos una serie
                        if (exercise.sets.length <= 1) {
                            return exercise;
                        }

                        const sets = exercise.sets
                            .filter(set => set.id !== setId)
                            .map((set, index) => ({
                                ...set,
                                setNumber: index + 1
                            }));

                        return {
                            ...exercise,
                            sets
                        };
                    })
                };
            })
        );

        this.saveSessions();
    }

    getPreviousExerciseLog(
        exerciseId: string,
        currentSessionId: string
    ) {

        const previousSessions = this.sessionsSignal()
            .filter(session =>
                session.id !== currentSessionId &&
                session.finishedAt !== null
            )
            .filter(session =>
                session.exercises.some(
                    exercise => exercise.exerciseId === exerciseId
                )
            )
            .sort(
                (a, b) =>
                    new Date(b.startedAt).getTime() -
                    new Date(a.startedAt).getTime()
            );

        if (previousSessions.length === 0) {
            return undefined;
        }

        return previousSessions[0].exercises.find(
            exercise => exercise.exerciseId === exerciseId
        );
    }
}