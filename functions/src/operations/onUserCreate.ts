import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {taskListConverter} from "../model/TaskList";

export const userOnCreateOperation = (): functions.BlockingFunction => {
  return functions.auth.user().beforeCreate(async (user) => {
    functions.logger.info("beforeCreate user={}", user);
    const newTaskListRef = admin
        .firestore()
        .collection("users")
        .doc(user.uid)
        .collection("taskLists")
        .withConverter(taskListConverter)
        .doc();

    const defaultTaskList = {
      id: newTaskListRef.id,
      order: 0,
      title: "My tasks",
      uid: user.uid,
    };
    functions.logger.info("Creating default taskList={}", defaultTaskList);
    await newTaskListRef.set(defaultTaskList);
  });
};
