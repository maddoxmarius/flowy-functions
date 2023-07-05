import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {userOnCreateOperation} from "./operations/onUserCreate";
import {pomodoroRecorderOperation} from "./operations/pomodoroRecorder";
import {pomodoroTaskOperation} from "./operations/pomodoroTask";

admin.initializeApp(functions.config().firebase);
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


export const pomodoroRecorder = pomodoroRecorderOperation();
export const pomodoroTask = pomodoroTaskOperation();
export const onUserCreate = userOnCreateOperation();
