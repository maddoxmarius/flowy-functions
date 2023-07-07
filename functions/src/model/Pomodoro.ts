import * as admin from "firebase-admin";

export interface Pomodoro {
  id?: string;
  taskId: string;
  created: Date | null;
  uid: string;
  taskListId: string;
  startTime?: Date | null;
  duration?: number | null;
}

/**
 * Converts the Pomodoro to an object
 *
 * @param {Pomodoro} pomodoro
 * @return {Record<string, any>} object
 */
export function fromPomodoroToObject(pomodoro: Pomodoro): Record<string, any> {
  return {
    id: pomodoro.id,
    taskId: pomodoro.taskId,
    taskListId: pomodoro.taskListId,
    created: pomodoro.created ?
      admin.firestore.Timestamp.fromDate(pomodoro.created) :
      admin.firestore.FieldValue.serverTimestamp(),
    uid: pomodoro.uid,
    startTime: pomodoro.startTime ?
      admin.firestore.Timestamp.fromDate(pomodoro.startTime) :
      null,
    duration: pomodoro.duration ?? null,
  };
}

/**
 * Converts the object to a pomodoro
 *
 * @param {Record<string,any>} data
 * @return {Pomodoro}
 */
export function fromObjectToPomodoro(data: Record<string, any>): Pomodoro {
  return {
    id: data.id,
    taskId: data.taskId,
    taskListId: data.taskListId,
    created: data.created?.toDate?.() ?? null,
    uid: data.uid,
    startTime: data.startTime?.toDate?.() ?? null,
    duration: data.duration,
  };
}

export const pomodoroConverter:
admin.firestore.FirestoreDataConverter<Pomodoro> =
  {
    toFirestore: (Pomodoro: Pomodoro) => fromPomodoroToObject(Pomodoro),
    fromFirestore(snapshot: admin.firestore.QueryDocumentSnapshot): Pomodoro {
      return fromObjectToPomodoro(snapshot.data());
    },
  };
