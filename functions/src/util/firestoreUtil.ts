import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";

export enum ChangeType {
    CREATE,
    DELETE,
    UPDATE,
  }

export const getChangeType = (
    change: functions.Change<firestore.DocumentSnapshot>
): ChangeType => {
  if (!change.after.exists) {
    return ChangeType.DELETE;
  }
  if (!change.before.exists) {
    return ChangeType.CREATE;
  }
  return ChangeType.UPDATE;
};
