import {firestore} from "firebase-admin";

export interface TaskList {
  id?: string;
  title: string;
  uid: string;
  order?: number;
  created?: Date;
}

/**
 * Converts the task list to an object
 *
 * @param {TaskList} taskList
 * @return {Record<string, any>} object
 */
export function fromTaskListToObject(
    taskList: TaskList
): firestore.DocumentData {
  return {
    id: taskList.id,
    title: taskList.title,
    uid: taskList.uid,
    order: taskList.order,
    created: taskList.created ?? firestore.FieldValue.serverTimestamp(),
  };
}

/**
 * Converts the object to a task list
 *
 * @param {Record<string,any>} data
 * @return {TaskList}
 */
export function fromObjectToTaskList(data: firestore.DocumentData): TaskList {
  return {
    id: data.id,
    title: data.title,
    uid: data.uid,
    created: data.created?.toDate(),
    order: data.order ?? 0,
  };
}

export const taskListConverter: firestore.FirestoreDataConverter<TaskList> = {
  toFirestore: (taskList: TaskList) => fromTaskListToObject(taskList),
  fromFirestore(snapshot: firestore.QueryDocumentSnapshot): TaskList {
    return fromObjectToTaskList(snapshot.data());
  },
};
