import {firestore} from "firebase-admin";
// import {getFunctions} from "firebase-admin/functions";
import * as functions from "firebase-functions";
import {Change, CloudFunction, logger} from "firebase-functions";
import {fromObjectToTask, TaskState} from "./model/Task";
import * as admin from "firebase-admin";
import {Pomodoro, pomodoroConverter} from "./model/Pomodoro";

/**
 * Publishes the property if needed
 *
 * @param {admin.app.App} app: firestore database
 * @return {CloudFunction} cloudFunction : cloud function
 */
export function pomodoroRecorderOperation(): CloudFunction<
  Change<FirebaseFirestore.QueryDocumentSnapshot>
  > {
  return functions.firestore
      .document("tasks/{taskId}")
      .onUpdate(
          async (
              change: Change<firestore.QueryDocumentSnapshot>
          ): Promise<void> => {
            logger.info("task, before: ", change.before.data());
            logger.info("task, after: ", change.after.data());

            await handleUpdateTask(change);
          }
      );
}

/**
 * Records the pomodoro
 * @param {firestore.DocumentSnapshot} change
 */
async function handleUpdateTask(change: Change<firestore.DocumentSnapshot>) {
  logger.info("change", change);
  const data = change.after.data();
  if (!data) return;
  const task = fromObjectToTask(data);
  logger.info("after conversion", task);

  const beforeData = change.before.data();
  let startTime;
  let duration;
  if (beforeData) {
    const beforeTask= fromObjectToTask(beforeData);
    startTime = beforeTask.startTime;
    duration = beforeTask.duration;
  }

  if (task.state.name === TaskState.FOCUS_DONE.name) {
    logger.info("counting pomodoro for taskId={}", task.id);
    const pomodoro: Pomodoro = {
      id: admin.firestore().collection("pomodoros").doc().id,
      taskId: task.id ?? "", // this should never happen
      uid: task.uid,
      created: null,
      duration: duration,
      startTime: startTime,
    };
    await admin
        .firestore()
        .collection("pomodoros")
        .withConverter(pomodoroConverter)
        .add(pomodoro);
    await admin
        .firestore()
        .collection("tasks")
        .doc(task.id)
        .set({
          state: TaskState.BREAK_NOT_STARTED.name,
          pomodoroCount: admin.firestore.FieldValue.increment(1),
        }, {merge: true});
  } if (task.state.name === TaskState.BREAK_DONE.name) {
    await admin
        .firestore()
        .collection("tasks")
        .doc(task.id)
        .set({state: TaskState.FOCUS_NOT_STARTED.name}, {merge: true});
  } else {
    logger.debug("no counting needed since the state is not done");
  }
}
