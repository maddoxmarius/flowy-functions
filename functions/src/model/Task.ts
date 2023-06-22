import {EnumIdentity} from "./EnumIdentity";
import {firestore} from "firebase-admin";

export interface Task {
  id: string;
  title: string;
  state: TaskState;
  uid: string;
  created?: Date;
  startTime?: Date | null;
  duration?: number | null;
  order: number
  pomodoroCount: number
  // pomodoros: Pomodoro[]
}

// export interface Pomodoro {
//   id: string
//   start: Date
//   duration: number // in minutes
// }

/**
 * State of the task
 */
export class TaskState implements EnumIdentity {
  public static AllValues: Record<string, TaskState> = {};

  // Focus states
  static readonly FOCUS_NOT_STARTED = new TaskState("FOCUS_NOT_STARTED");
  static readonly FOCUS_IN_PROGRESS = new TaskState("FOCUS_IN_PROGRESS");
  static readonly FOCUS_PAUSED = new TaskState("FOCUS_PAUSED");
  static readonly FOCUS_DONE = new TaskState("FOCUS_DONE");

  // Break states
  static readonly BREAK_NOT_STARTED = new TaskState("BREAK_NOT_STARTED");
  static readonly BREAK_PAUSED = new TaskState("BREAK_PAUSED");
  static readonly BREAK_IN_PROGRESS = new TaskState("BREAK_IN_PROGRESS");
  static readonly BREAK_DONE = new TaskState("BREAK_DONE");


  static readonly DONE = new TaskState("DONE");

  /**
   * Constructor
   * @param {string} name
   */
  private constructor(public readonly name: string) {
    TaskState.AllValues[name] = this;
  }

  /**
   * Parses the enum
   *
   * @param {string} name
   * @return {TaskState}
   */
  public static parseEnum(name: string): TaskState {
    return TaskState.AllValues[name];
  }
}

/**
 * Converts the task to an object
 *
 * @param {Task} task
 * @return {Record<string, any>} object
 */
export function fromTaskToObject(task: Task): Record<string, any> {
  return {
    id: task.id,
    title: task.title,
    state: task.state.name,
    uid: task.uid,
    created: task.created ?? firestore.FieldValue.serverTimestamp(),
    startTime: task.startTime ?
      firestore.Timestamp.fromDate(task.startTime) :
      null,
    duration: task.duration ?? null,
    order: task.order ?? 0,
    pomodoroCount: task.pomodoroCount ?? 0,
  };
}

/**
 * Converts the object to a task
 *
 * @param {Record<string,any>} data
 * @return {Task}
 */
export function fromObjectToTask(data: firestore.DocumentData): Task {
  return {
    id: data.id,
    title: data.title,
    state: TaskState.parseEnum(data.state),
    uid: data.uid,
    created: data.created?.toDate(),
    startTime: data.startTime?.toDate(),
    duration: data.duration ?? null,
    order: data.order ?? 0,
    pomodoroCount: data.pomodoroCount ?? 0,
  };
}

export const taskConverter: firestore.FirestoreDataConverter<Task> = {
  toFirestore: (Task: Task) => fromTaskToObject(Task),
  fromFirestore(snapshot: firestore.QueryDocumentSnapshot): Task {
    return fromObjectToTask(snapshot.data());
  },
};
